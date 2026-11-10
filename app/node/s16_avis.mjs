// Extension (hors seances) : POST /api/avis, les pouces 👍 / 👎.
//
// Chaque vote est ajoute en fin de fichier, une ligne JSON par avis (format
// JSONL) : app/donnees/avis/avis.jsonl. Le dossier est ignore par git : on ne
// publie pas les questions des visiteurs.
//
// C'est la seule route qui ECRIT sur le disque : tout est valide strictement
// avant ecriture (valeurs connues, tailles limitees, aucun chemin venant du client).
//
// Requete :  { "chatbot": "club", "question": "...", "reponse": "...", "avis": "+" }
// Reponse :  200 { "ok": true }   ou   400 { "erreur": "avis invalide" }

import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { envoyerJson, lireCorps, RequeteInvalide } from "./fourni/transport.mjs";

const ICI = path.dirname(fileURLToPath(import.meta.url));
const DOSSIER = path.resolve(ICI, "..", "donnees", "avis");
const FICHIER = path.join(DOSSIER, "avis.jsonl");

const CHATBOTS = new Set(["club", "coach", "lexique", "orientation"]);
const VOTES = new Set(["+", "-"]);
const QUESTION_MAX = 1000;
const REPONSE_MAX = 4000;

function texteValide(valeur, max) {
  return typeof valeur === "string" && valeur.trim().length > 0 && valeur.length <= max;
}

async function avis(req, res) {
  const corps = await lireCorps(req);
  if (!CHATBOTS.has(corps.chatbot) || !VOTES.has(corps.avis)
      || !texteValide(corps.question, QUESTION_MAX) || !texteValide(corps.reponse, REPONSE_MAX)) {
    throw new RequeteInvalide("avis invalide");
  }

  // On ne garde QUE les champs attendus : rien d'autre venant du client n'est ecrit.
  const ligne = JSON.stringify({
    date: new Date().toISOString(),
    chatbot: corps.chatbot,
    avis: corps.avis,
    question: corps.question.trim(),
    reponse: corps.reponse.trim(),
  });
  await mkdir(DOSSIER, { recursive: true });
  await appendFile(FICHIER, `${ligne}\n`, "utf8");
  console.log(`[avis] chatbot=${corps.chatbot} avis=${corps.avis}`);
  envoyerJson(res, 200, { ok: true });
}

export const routes = { "POST /api/avis": avis };
