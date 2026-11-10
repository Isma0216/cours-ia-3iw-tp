// Extension (hors seances) : POST /api/orientation, "Quel cours pour moi ?".
//
// Le visiteur repond a 4 questions dans le widget (age, niveau, objectif,
// jours). Repartition des roles :
//   - le CODE filtre les cours compatibles (age, jours) et les classe : un
//     modele de 3B calcule mal les ages et les horaires ;
//   - le MODELE redige seulement la recommandation, a partir des cours retenus.
//
// Requete :  { "age": "adulte", "niveau": "debutant", "objectif": "forme", "jours": ["lundi","samedi"] }
// Reponse :  SSE  {cours:[...]} {actions:[...]} puis {delta} ... puis {done, usage}

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { streamer } from "./fourni/modele.mjs";
import { fin, fluxOu503, fragment, lireCorps, RequeteInvalide, sse } from "./fourni/transport.mjs";

const ICI = path.dirname(fileURLToPath(import.meta.url));
const COURS = JSON.parse(readFileSync(path.resolve(ICI, "..", "donnees", "cours.json"), "utf8")).cours;

const URL_INSCRIPTION = "https://tally.so/r/vG6oAQ";
const MODELE = process.env.MODEL_BASE || "qwen2.5:3b"; // pour le journal uniquement
const NB_COURS = 2;

// Les seules valeurs acceptees : celles des boutons du widget.
const AGES = { "8-11": [8, 11], "12-15": [12, 15], "16-17": [16, 17], "adulte": [18, 99] };
const LIBELLE_AGE = { "8-11": "8 à 11 ans", "12-15": "12 à 15 ans", "16-17": "16-17 ans", "adulte": "adulte" };
const NIVEAUX = { "debutant": "débutant", "deja": "a déjà pratiqué un sport de combat" };
const OBJECTIFS = {
  "forme": "se remettre en forme, cardio",
  "defense": "apprendre à se défendre",
  "competition": "faire de la compétition",
  "complet": "un sport complet, debout et au sol",
};
const JOURS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

function valider(corps) {
  const { age, niveau, objectif, jours } = corps;
  if (!(age in AGES) || !(niveau in NIVEAUX) || !(objectif in OBJECTIFS)
      || !Array.isArray(jours) || !jours.length || jours.length > JOURS.length
      || !jours.every((j) => JOURS.includes(j)) || new Set(jours).size !== jours.length) {
    throw new RequeteInvalide("profil invalide");
  }
  return { age, niveau, objectif, jours };
}

/** Deux intervalles d'age [min, max] se recouvrent-ils ? */
function agesCompatibles([a1, a2], [b1, b2]) {
  return a1 <= b2 && b1 <= a2;
}

/** Les creneaux d'un cours compatibles avec l'age et les jours choisis. */
function creneauxPossibles(cours, trancheAge, jours) {
  return cours.creneaux.filter((c) =>
    jours.includes(c.jour) && agesCompatibles(c.ages || cours.ages, trancheAge));
}

/** Le filtrage et le classement : 100 % code, aucun appel au modele. */
function recommander({ age, objectif, jours }) {
  const tranche = AGES[age];
  const pourAge = COURS.filter((c) => agesCompatibles(c.ages, tranche));
  const retenus = pourAge
    .map((c) => ({ c, creneaux: creneauxPossibles(c, tranche, jours) }))
    .filter(({ creneaux }) => creneaux.length > 0)
    .sort((x, y) => (Number(y.c.objectifs.includes(objectif)) - Number(x.c.objectifs.includes(objectif)))
      || (y.creneaux.length - x.creneaux.length))
    .slice(0, NB_COURS);
  return { retenus, pourAge };
}

async function orientation(req, res) {
  const debut = performance.now();
  const profil = valider(await lireCorps(req));

  async function* flux() {
    const { retenus, pourAge } = recommander(profil);

    // Les cours retenus partent AVANT le texte : le widget affiche les
    // horaires et tarifs EXACTS, quoi qu'ecrive le modele.
    yield sse({
      cours: retenus.map(({ c, creneaux }) => ({
        nom: c.nom,
        creneaux: creneaux.map(({ jour, horaire }) => ({ jour, horaire })),
        tarif: c.tarif,
      })),
    });

    // Aucun cours ces jours-la : reponse ecrite par le code, pas de modele.
    if (!retenus.length) {
      const jours = [...new Set(pourAge.flatMap((c) => c.creneaux.map((cr) => cr.jour)))];
      console.log(`[orientation] modele=aucun entree=0 sortie=0 ms=${Math.round(performance.now() - debut)} issue=aucun_creneau`);
      yield fragment(`Aucun cours pour ${LIBELLE_AGE[profil.age]} n'a lieu les jours que tu as choisis. `
        + `Les cours de ta tranche d'âge ont lieu le ${jours.join(", le ")}. `
        + "Relance le parcours avec un de ces jours, ou contacte le secrétariat !");
      yield fin({}, debut);
      return;
    }

    yield sse({ actions: [{ type: "inscription", url: URL_INSCRIPTION }] });

    const fiches = retenus.map(({ c, creneaux }, i) =>
      `[${i + 1}] ${c.nom} : ${c.description}\n`
      + `Creneaux compatibles : ${creneaux.map((cr) => `${cr.jour} ${cr.horaire}`).join(", ")}\n`
      + `Tarif : ${c.tarif}\n`
      + `Correspond a son objectif : ${c.objectifs.includes(profil.objectif) ? "oui" : "pas directement"}`).join("\n\n");

    const messages = [
      {
        role: "system",
        content:
          "Tu es l'assistant d'accueil du Chatillon Boxing Club. Tu tutoies TOUJOURS : jamais vous, jamais votre.\n"
          + "Regles :\n"
          + "1. Presente CHACUN des cours listes dans <cours>, dans l'ordre, avec son nom exact. Aucun autre cours.\n"
          + "2. Recopie les jours, horaires et tarifs tels qu'ils sont ecrits. Aucun autre chiffre.\n"
          + "3. Pour chaque cours, une phrase sur pourquoi il colle au profil (age, niveau, objectif).\n"
          + "4. Si la personne est debutante, rassure-la : tous les creneaux du club sont ouverts aux debutants.\n"
          + "5. Termine en rappelant qu'un certificat medical est obligatoire a l'inscription.\n"
          + "6. Pas de formule d'accueil (pas de bonjour). Reponds en francais, en 3 a 5 phrases, sur un ton chaleureux.",
      },
      {
        role: "user",
        content: `<cours>\n${fiches}\n</cours>\n\n`
          + `Mon profil : ${LIBELLE_AGE[profil.age]}, ${NIVEAUX[profil.niveau]}. `
          + `Objectif : ${OBJECTIFS[profil.objectif]}. Jours possibles : ${profil.jours.join(", ")}.`,
      },
    ];

    let usage = {};
    let issue = "ok";
    try {
      for await (const { genre, valeur } of streamer(messages, { temperature: 0.1, maxTokens: 300 })) {
        if (genre === "delta") yield fragment(valeur);
        else if (genre === "usage") usage = valeur;
      }
    } catch (e) {
      issue = `echec: ${e.message}`;
      throw e;
    } finally {
      console.log(`[orientation] modele=${MODELE} entree=${usage.entree ?? 0} sortie=${usage.sortie ?? 0} ms=${Math.round(performance.now() - debut)} issue=${issue}`);
    }
    yield fin(usage, debut);
  }

  await fluxOu503(res, flux());
}

export const routes = { "POST /api/orientation": orientation };
