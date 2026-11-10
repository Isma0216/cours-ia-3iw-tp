// Seance 13, premiere partie : l'index de recherche semantique.
//
// Objectif : retrouver les extraits du corpus les plus proches d'une question,
// SANS modele de generation. C'est la brique que la seance 12 enseigne.
//
// Vous remplissez les TODO 9 a 11 de ce fichier, et rien d'autre.
//
// Verifier la recherche seule, avant de brancher le modele :
//     node app/node/s13_index.mjs "comment demander un remboursement ?"

import { pathToFileURL } from "node:url";

import { chargerDocuments } from "./fourni/donnees.mjs";
import { plonger } from "./fourni/modele.mjs";
import { AEcrire } from "./fourni/transport.mjs";

// =====================================================================
// TODO 9 : decouper un document en morceaux
// =====================================================================
export function decouper(titre, texte) {
  // Renvoie une liste de { titre, texte }.
  //
  // Visez 300 a 800 tokens par morceau, avec un recouvrement. Decouper sur la
  // structure (les titres ##) vaut mieux que decouper sur la longueur.
  // Ecartez les morceaux trop courts pour porter du sens.
  //
  // Choix : une section "## " = un morceau (decoupe sur la structure).
  // Une section trop longue est recoupee par fenetres qui se recouvrent.
  // En francais, 1 token vaut environ 4 caracteres : 2400 car. ~ 600 tokens.
  const TAILLE_MAX = 2400;
  const RECOUVREMENT = 300;
  const TAILLE_MIN = 80;

  // Le chatbot est celui du Chatillon Boxing Club : on n'indexe que les fiches
  // du club (fichiers club-*.md, titres "Club ..."). Les documents e-commerce
  // du TP restent dans le dossier, intacts, mais ne sont pas indexes : sinon
  // le modele melange les deux (ex. "paiement en 3 fois des 500 EUR").
  if (!titre.startsWith("Club")) return [];

  const resultat = [];
  for (const section of texte.split(/\n(?=## )/)) {
    // On retire le titre "# " du document : il est deja porte par `titre`.
    const propre = section.replace(/^# .*\n?/, "").trim();
    if (propre.length < TAILLE_MIN) continue;

    // Le titre de la section precise la source citee au client.
    const intertitre = propre.match(/^## (.+)/)?.[1]?.trim();
    const titreMorceau = intertitre ? `${titre} : ${intertitre}` : titre;

    for (let debut = 0; debut < propre.length; debut += TAILLE_MAX - RECOUVREMENT) {
      const bout = propre.slice(debut, debut + TAILLE_MAX).trim();
      // Le titre du document est repete en tete : le morceau garde son contexte.
      if (bout.length >= TAILLE_MIN) {
        resultat.push({ titre: titreMorceau, texte: `${titre}\n${bout}` });
      }
      if (debut + TAILLE_MAX >= propre.length) break;
    }
  }
  return resultat;
}

let MORCEAUX = null;

/** FOURNI : decoupe tout le corpus, une seule fois, a la premiere demande. */
export function morceaux() {
  if (MORCEAUX === null) {
    MORCEAUX = chargerDocuments().flatMap(({ titre, texte }) => decouper(titre, texte));
  }
  return MORCEAUX;
}

// =====================================================================
// TODO 10 : vectoriser les morceaux, une seule fois
// =====================================================================
// On garde la PROMESSE en memoire, pas seulement le resultat : si deux
// questions arrivent pendant la premiere vectorisation, le corpus n'est
// vectorise qu'une fois.
let VECTEURS = null;

export async function indexer() {
  // Renvoie la liste des vecteurs, dans le meme ordre que morceaux().
  //
  // plonger(listeDeTextes) renvoie une liste de vecteurs. Gardez le resultat
  // en memoire : vectoriser le corpus a chaque question serait tres lent.
  if (VECTEURS === null) {
    VECTEURS = plonger(morceaux().map((m) => m.texte)).catch((e) => {
      VECTEURS = null; // echec (modele eteint...) : on retentera a la prochaine question
      throw e;
    });
  }
  return VECTEURS;
}

// =====================================================================
// TODO 11 : recherche par similarite cosinus
// =====================================================================
function cosinus(a, b) {
  let scalaire = 0;
  let normeA = 0;
  let normeB = 0;
  for (let i = 0; i < a.length; i++) {
    scalaire += a[i] * b[i];
    normeA += a[i] * a[i];
    normeB += b[i] * b[i];
  }
  if (normeA === 0 || normeB === 0) return 0; // vecteur nul : aucune proximite
  return scalaire / (Math.sqrt(normeA) * Math.sqrt(normeB));
}

export function chercher(vecteurQuestion, vecteurs, k = 3) {
  // Renvoie les k morceaux les plus proches : [{ titre, texte, score }, ...].
  //
  // Similarite cosinus : produit scalaire divise par le produit des normes.
  // Triez du plus proche au moins proche.
  const liste = morceaux();
  return vecteurs
    .map((vecteur, i) => ({
      titre: liste[i].titre,
      texte: liste[i].texte,
      score: cosinus(vecteurQuestion, vecteur),
    }))
    .sort((x, y) => y.score - x.score)
    .slice(0, k);
}

// FOURNI : tester la recherche seule, en ligne de commande.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const question = process.argv.slice(2).join(" ") || "comment demander un remboursement ?";
  console.log(`${morceaux().length} morceaux`);
  const vecteurs = await indexer();
  const vecteurQuestion = (await plonger([question]))[0];
  console.log("vectorises, voici les plus proches :\n");
  for (const { titre, texte, score } of chercher(vecteurQuestion, vecteurs)) {
    console.log(`  ${score.toFixed(3)}  ${titre}`);
    console.log(`         ${texte.slice(0, 90).replace(/\n/g, " ")}...`);
  }
}
