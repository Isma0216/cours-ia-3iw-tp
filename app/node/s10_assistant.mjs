// Seance 10 : la route POST /api/assistant, avec appel d'outil.
//
// Objectif : repondre a une question sur une commande en laissant le modele
// demander l'outil chercher_commande, que VOTRE serveur execute.
// Le contrat exact est dans app/CONTRAT.md, section "Route 2".
//
// Vous remplissez les TODO 6 a 8 de ce fichier, et rien d'autre.
// Tant qu'un TODO n'est pas ecrit, la route repond 501 "a ecrire".
//
// Verifier :
//     make app-node                 # terminal 1
//     make conformite SEANCE=10     # terminal 2

import { chercherCommande } from "./fourni/donnees.mjs"; // utile pour le TODO 7
import { appeler, streamer } from "./fourni/modele.mjs"; // utiles pour le TODO 8
import {
  AEcrire, fin, fluxOu503, fragment, lireCorps, RequeteInvalide,
} from "./fourni/transport.mjs";

// =====================================================================
// TODO 6 : declarer l'outil au format attendu par le modele
// =====================================================================
// Un objet { type: "function", function: { name, description, parameters } }.
// La description est LUE PAR LE MODELE : elle fait partie du prompt, et c'est
// elle qui decide s'il appelle l'outil ou s'il repond de memoire.
const OUTILS = [
  {
    type: "function",
    function: {
      name: "chercher_commande",
      description:
        "Renvoie le statut, le transporteur, les dates et les articles d'une commande "
        + "a partir de son numero (format CMD-AAAA-NNN). A appeler des que le client "
        + "parle d'une commande precise : ne jamais repondre de memoire.",
      parameters: {
        type: "object",
        properties: {
          numero: { type: "string", description: "Numero de commande, par exemple CMD-2024-118" },
        },
        required: ["numero"],
      },
    },
  },
];

// =====================================================================
// TODO 7 : la table des outils executables
// =====================================================================
// Une table explicite, jamais une resolution dynamique du nom recu du modele.
// Les arguments viennent du modele : validez-les AVANT d'executer.
const FORMAT_NUMERO = /^CMD-\d{4}-\d{3}$/i;
const TABLE_DES_OUTILS = {
  chercher_commande(args) {
    const numero = typeof args?.numero === "string" ? args.numero.trim() : "";
    if (!FORMAT_NUMERO.test(numero)) return { erreur: "numero de commande invalide" };
    // Un numero inconnu est un cas normal : on le dit au modele, sans planter.
    return chercherCommande(numero) ?? { trouvee: false, numero, message: "aucune commande avec ce numero" };
  },
};

async function assistant(req, res) {
  const debut = performance.now();
  const corps = await lireCorps(req);
  const question = corps.question;
  if (typeof question !== "string" || !question.trim()) {
    throw new RequeteInvalide("question invalide");
  }

  async function* flux() {
    // =================================================================
    // TODO 8 : la boucle d'appel d'outil
    // =================================================================
    // 1. appeler(messages, { outils: OUTILS }) renvoie { message, usage }
    // 2. si message.tool_calls existe, pour chaque appel :
    //    valider les arguments, executer, puis ajouter au fil des messages
    //    { role: "tool", tool_call_id: ..., content: JSON.stringify(resultat) }
    // 3. rappeler le modele en streaming pour qu'il redige la reponse
    // 4. cumuler l'usage des DEUX appels : le client doit voir le total
    const MODELE = process.env.MODEL_BASE || "qwen2.5:3b"; // pour le journal uniquement
    const messages = [
      {
        role: "system",
        content: [
          "Tu es l'assistant du service client d'une boutique en ligne. Tu reponds en francais.",
          "Pour toute question sur une commande, appelle l'outil chercher_commande avec le numero donne par le client.",
          "Reponds en 2 ou 3 phrases, uniquement a partir du resultat de l'outil :",
          "statut, transporteur et date de livraison prevue s'ils existent.",
          "Si la commande est introuvable, dis-le simplement et invite le client a verifier le numero.",
          "N'invente jamais d'information.",
        ].join("\n"),
      },
      { role: "user", content: question.trim().slice(0, 1000) },
    ];
    const total = { entree: 0, sortie: 0 };
    const executes = [];

    const executer = (nom, args, id) => {
      // Table explicite : un nom inconnu n'execute rien.
      const outil = Object.hasOwn(TABLE_DES_OUTILS, nom) ? TABLE_DES_OUTILS[nom] : null;
      const resultat = outil ? outil(args) : { erreur: "outil inconnu" };
      executes.push(nom);
      messages.push({ role: "tool", tool_call_id: id, content: JSON.stringify(resultat) });
    };

    // 1 et 2 : le modele demande l'outil, le serveur l'execute (3 tours maximum)
    for (let tour = 0; tour < 3; tour++) {
      const { message, usage } = await appeler(messages, { outils: OUTILS });
      total.entree += usage.entree;
      total.sortie += usage.sortie;
      const appels = message.tool_calls || [];
      if (!appels.length) break;
      messages.push(message);
      for (const appel of appels) {
        let args = appel.function?.arguments ?? {};
        if (typeof args === "string") {
          try { args = JSON.parse(args); } catch { args = {}; }
        }
        executer(appel.function?.name, args, appel.id);
      }
    }

    // Repli : le modele n'a pas demande l'outil alors que la question cite un numero.
    // Le serveur l'execute lui-meme, pour que la reponse s'appuie sur le fichier.
    const numeroCite = question.match(/CMD-\d{4}-\d{3}/i);
    if (!executes.length && numeroCite) {
      const id = "repli-serveur";
      messages.push({
        role: "assistant",
        content: "",
        tool_calls: [{ id, type: "function", function: { name: "chercher_commande", arguments: JSON.stringify({ numero: numeroCite[0] }) } }],
      });
      executer("chercher_commande", { numero: numeroCite[0] }, id);
    }

    // 3 : le modele redige la reponse en streaming, a partir du resultat
    for await (const { genre, valeur } of streamer(messages, { temperature: 0.2, maxTokens: 300 })) {
      if (genre === "delta") yield fragment(valeur);
      else if (genre === "usage") {
        // 4 : l'usage cumule les appels, le client voit le total
        total.entree += valeur.entree;
        total.sortie += valeur.sortie;
      }
    }
    console.log(`[assistant] modele=${MODELE} outils=${executes.join(",") || "aucun"} entree=${total.entree} sortie=${total.sortie} ms=${Math.round(performance.now() - debut)} issue=ok`);
    yield fin(total, debut);
  }

  await fluxOu503(res, flux());
}

export const routes = { "POST /api/assistant": assistant };
