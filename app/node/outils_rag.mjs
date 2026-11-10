// Outils RAG reutilisables pour les extensions (hors seances).
//
// Meme methode que la seance 13 (s13_index.mjs), mais generique : on peut
// creer un index sur n'importe quel dossier de fiches Markdown.
// Le RAG de l'Assistant du club reste, lui, dans les TODO du cours.

import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { plonger } from "./fourni/modele.mjs";

/** Similarite cosinus : produit scalaire divise par le produit des normes. */
export function cosinus(a, b) {
  let scalaire = 0;
  let normeA = 0;
  let normeB = 0;
  for (let i = 0; i < a.length; i++) {
    scalaire += a[i] * b[i];
    normeA += a[i] * a[i];
    normeB += b[i] * b[i];
  }
  if (normeA === 0 || normeB === 0) return 0;
  return scalaire / (Math.sqrt(normeA) * Math.sqrt(normeB));
}

/**
 * Decoupe une fiche sur ses titres "## " : une section = un morceau.
 * Le titre de la fiche est repete en tete du morceau pour garder le contexte.
 */
export function decouperSections(titre, texte, { min = 60, max = 2400, recouvrement = 300 } = {}) {
  const resultat = [];
  for (const section of texte.split(/\n(?=## )/)) {
    const propre = section.replace(/^# .*\n?/, "").trim();
    if (propre.length < min) continue;
    const intertitre = propre.match(/^## (.+)/)?.[1]?.trim();
    const titreMorceau = intertitre ? `${titre} : ${intertitre}` : titre;
    for (let debut = 0; debut < propre.length; debut += max - recouvrement) {
      const bout = propre.slice(debut, debut + max).trim();
      if (bout.length >= min) resultat.push({ titre: titreMorceau, texte: `${titre}\n${bout}` });
      if (debut + max >= propre.length) break;
    }
  }
  return resultat;
}

/**
 * Cree un index de recherche sur les fiches .md d'un dossier.
 * Decoupage et vectorisation faits une seule fois, a la premiere question.
 */
export function creerIndex(dossier) {
  let morceaux = null;
  let vecteurs = null; // promesse gardee en memoire

  function charger() {
    if (morceaux === null) {
      morceaux = readdirSync(dossier)
        .filter((f) => f.endsWith(".md"))
        .sort()
        .flatMap((f) => {
          const base = path.basename(f, ".md").replace(/[-_]/g, " ");
          const titre = base.charAt(0).toUpperCase() + base.slice(1);
          return decouperSections(titre, readFileSync(path.join(dossier, f), "utf8"));
        });
    }
    return morceaux;
  }

  function indexer() {
    if (vecteurs === null) {
      vecteurs = plonger(charger().map((m) => m.texte)).catch((e) => {
        vecteurs = null; // modele eteint : on retentera
        throw e;
      });
    }
    return vecteurs;
  }

  /** Les k morceaux les plus proches de la question : [{ titre, texte, score }]. */
  async function chercher(question, k = 3) {
    const v = await indexer();
    const [q] = await plonger([question]);
    return charger()
      .map((m, i) => ({ ...m, score: cosinus(q, v[i]) }))
      .sort((x, y) => y.score - x.score)
      .slice(0, k);
  }

  return { chercher, morceaux: charger };
}
