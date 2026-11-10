// Extensions de l'Assistant du club (route /api/documents) :
//   - memoire de conversation : reformuler une question de suite ("Et le samedi ?")
//   - bouton "S'inscrire" quand on parle de tarifs ou d'inscription
//
// Range a part pour garder le TODO 12 du cours lisible. Tout est optionnel :
// sans champ "historique", la route se comporte exactement comme le contrat.

import { appeler } from "./fourni/modele.mjs";
import { RequeteInvalide } from "./fourni/transport.mjs";

export const URL_INSCRIPTION = "https://tally.so/r/vG6oAQ";

const ECHANGES_MAX = 3;      // on ne garde que les 3 derniers echanges
const QUESTION_MAX = 1000;
const REPONSE_MAX = 1500;

/**
 * Valide le champ optionnel "historique" : [{ question, reponse }, ...].
 * Leve RequeteInvalide (400) s'il est mal forme. Absent = [].
 */
export function validerHistorique(valeur) {
  if (valeur === undefined || valeur === null) return [];
  if (!Array.isArray(valeur) || valeur.length > ECHANGES_MAX) {
    throw new RequeteInvalide("historique invalide");
  }
  return valeur.map((e) => {
    if (typeof e !== "object" || e === null
        || typeof e.question !== "string" || e.question.length > QUESTION_MAX
        || typeof e.reponse !== "string" || e.reponse.length > REPONSE_MAX) {
      throw new RequeteInvalide("historique invalide");
    }
    return { question: e.question.trim(), reponse: e.reponse.trim() };
  });
}

/**
 * Memoire de conversation. La recherche RAG ne trouve rien avec "Et le samedi ?"
 * tout seul : un appel court (sans streaming, temperature 0) reecrit la
 * question pour qu'elle se comprenne sans la conversation. C'est cette
 * question complete qui part dans la recherche et dans le prompt.
 * Sans historique : aucun appel, la question est utilisee telle quelle.
 */
export async function reformuler(question, historique) {
  const aucun = { question, usage: { entree: 0, sortie: 0 } };
  if (!historique.length) return aucun;

  const conversation = historique
    .map((e) => `Visiteur : ${e.question}\nAssistant : ${e.reponse.slice(0, 300)}`)
    .join("\n");
  const { message, usage } = await appeler([
    {
      role: "system",
      content:
        "Tu reecris la DERNIERE question d'un visiteur pour qu'elle soit comprehensible SANS la conversation.\n"
        + "Si elle est deja complete, recopie-la a l'identique. Ne reponds jamais a la question.\n"
        + "Reponds par une seule ligne : la question reecrite.\n"
        + "Exemples :\n"
        + "Avant : quels sont les horaires du Muay Thai ? | Derniere : et le samedi ? -> Quels cours y a-t-il le samedi ?\n"
        + "Avant : combien coute le MMA ? | Derniere : et pour un etudiant ? -> Combien coute le MMA pour un etudiant ?\n"
        + "Avant : qui sont les coachs de kick-boxing ? | Derniere : et en MMA ? -> Qui sont les coachs de MMA ?\n"
        + "Avant : ou est la salle ? | Derniere : combien coute le kick-boxing ? -> combien coute le kick-boxing ?",
    },
    { role: "user", content: `${conversation}\n\nDerniere question : ${question}` },
  ], { temperature: 0, maxTokens: 60 });

  // Garde-fous ecrits en CODE (le modele 3B peut deraper) :
  //  - une ligne, sans guillemets, de taille raisonnable ;
  //  - la reecriture doit GARDER tous les mots importants de la question :
  //    elle peut ajouter du contexte ("samedi" -> "cours le samedi"), pas
  //    changer de sujet. Mesure : "ou se trouve la salle ?" etait devenu une
  //    question sur le prix du MMA (sujet de l'echange precedent).
  // Sinon on garde la question d'origine.
  const brute = (message.content || "").split("\n")[0].replace(/^["«\s]+|["»\s]+$/g, "").trim();
  // Ce doit etre une QUESTION : mesure, le modele a parfois repondu a la place
  // ("Les coachs de Muay Thai sont Najib et Khadim.").
  if (!brute || brute.length > 300 || !brute.endsWith("?")) return { ...aucun, usage };
  const reecrits = new Set(motsImportants(brute).map((m) => m.slice(0, 5)));
  const perdus = motsImportants(question).filter((m) => !reecrits.has(m.slice(0, 5)));
  if (perdus.length) return { ...aucun, usage };
  return { question: brute, usage };
}

const MOTS_OUTILS = new Set(["les", "des", "une", "est", "pour", "avec", "dans", "sur", "que", "qui",
  "quoi", "quel", "quels", "quelle", "quelles", "combien", "comment", "pourquoi", "elle", "ils",
  "aussi", "mais", "alors", "ok", "daccord", "the", "vous", "nous", "mon", "mes", "ton", "tes"]);

function motsImportants(texte) {
  return texte.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .split(/[^a-z0-9]+/).filter((m) => m.length >= 3 && !MOTS_OUTILS.has(m));
}

/**
 * Bouton "S'inscrire" : decide par le CODE, pas par le modele.
 * Affiche si la question parle d'argent ou d'inscription, ou si la MEILLEURE
 * source est une section tarifs ou inscription. (Mesure : en regardant les 2
 * premieres sources et toute la fiche "inscription contact", le bouton
 * apparaissait aussi pour "ou est la salle ?" ou "et le samedi ?".)
 */
const SECTIONS_INSCRIPTION = ["Club tarifs", "Club inscription contact : Comment",
  "Club inscription contact : Documents"];

export function actionsInscription(question, extraits) {
  const motCle = /tarif|prix|co[uû]t|payer|paiement|cotisation|inscri|adh[ée]r/i.test(question);
  const source = extraits.length > 0
    && SECTIONS_INSCRIPTION.some((s) => extraits[0].titre.startsWith(s));
  return motCle || source ? [{ type: "inscription", url: URL_INSCRIPTION }] : [];
}
