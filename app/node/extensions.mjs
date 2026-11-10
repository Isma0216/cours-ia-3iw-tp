// Aiguillage des routes d'extension (hors seances du cours).
//
// main.mjs est gele : il ne branche que les routes des fichiers de seance.
// s13_documents.mjs exporte donc, en plus de sa route, toutes celles-ci.
// Pour ajouter une extension : l'importer ici, rien d'autre a toucher.

import { routes as combattants } from "./s14_combattants.mjs";
import { routes as orientation } from "./s15_orientation.mjs";
import { routes as avis } from "./s16_avis.mjs";
import { routes as lexique } from "./s17_lexique.mjs";

export const routes = {
  ...combattants,   // POST /api/combattants  Coach video
  ...orientation,   // POST /api/orientation  "Quel cours pour moi ?"
  ...avis,          // POST /api/avis         pouces 👍 / 👎
  ...lexique,       // POST /api/lexique      Lexique et regles
};
