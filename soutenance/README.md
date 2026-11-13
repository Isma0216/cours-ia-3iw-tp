# Soutenance — Assistants IA du Châtillon Boxing Club

**Ismaël Zerouali** · soutenance du 13/11/2026 · cours IA 3IW (voie JavaScript)

## Contenu de ce dossier

| Fichier | Description |
| --- | --- |
| [`Demo-Assistants-IA-Chatillon-Boxing-Club-HD.mp4`](Demo-Assistants-IA-Chatillon-Boxing-Club-HD.mp4) | Démo vidéo (2 min 34, 1080p, sans son) |
| [`Slides-Soutenance.pdf`](Slides-Soutenance.pdf) | Slides de la soutenance (lisibles directement sur GitHub) |
| [`Slides-Soutenance.pptx`](Slides-Soutenance.pptx) | Les mêmes slides en PowerPoint, avec les notes d'orateur |

## Ce que montre la démo

1. **Assistant du club** : tarifs avec bouton S'inscrire, mémoire de conversation, « Quel cours pour moi ? », question hors sujet.
2. **Coach vidéo** : combattants à regarder avec liens YouTube, redirection vers la bonne discipline, question hors sujet.
3. **Lexique & règles** : vocabulaire des sports de combat, question hors sujet.
4. **Conformité** : `make conformite EXIGER=1` (mode de correction du CC2).

## Le projet en bref

- IA **100 % locale** avec Ollama : `qwen2.5:3b` (rédaction) et `paraphrase-multilingual` (embeddings).
- Serveur **Node.js sans dépendance**, front qui n'appelle que les routes du serveur (contrat respecté).
- Routes du contrat : `/api/resumer` (séance 9), `/api/assistant` (séance 10, appel d'outil), `/api/documents` (séance 13, RAG).
- Conformité : **35/35** (dont les 2 tests « modèle injoignable », lancés serveur coupé d'Ollama).

## Lancer le projet

```bash
make app-node          # serveur sur http://localhost:3000 (Ollama doit tourner)
make conformite        # dans un 2e terminal
```

Le code complet est sur la branche [`main`](https://github.com/Isma0216/cours-ia-3iw-tp/tree/main).
