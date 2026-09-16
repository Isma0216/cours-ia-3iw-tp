#!/usr/bin/env python3
"""Atelier de la seance 5 : mesurer un prompt de classification.

Vous ne modifiez QUE la constante CONSIGNE. Tout le reste est l'instrument de
mesure : y toucher fausserait la comparaison.

    python3 tp/05_prompt/evaluer.py

Jumeau exact de evaluer.mjs : meme jeu de cas, meme score.
"""
import json
import os
import pathlib
import sys
import urllib.request

BASE = os.environ.get("OLLAMA_BASE_URL", "http://localhost:11434").rstrip("/")
MODELE = os.environ.get("MODEL_BASE", "qwen2.5:3b")
CAS = json.loads((pathlib.Path(__file__).parent / "cas.json").read_text(encoding="utf-8"))

# =====================================================================
# LA SEULE CHOSE QUE VOUS MODIFIEZ
# =====================================================================
CONSIGNE = """
Tu dois classer les tickets de support avec leur catégorie et leur urgence .
Tu dois répondre exclusivement en objet json.

"catégorie" = ["paiement", "livraison", "compte"].
Les urgences sont de plusieurs niveaux, soit 1, soit 2, soit 3.

Une erreur de connexion est de catégorie "compte".
Une facture est de catégorie "payement".
L'adresse d'un colis précis en cours "livraison".
Changer son adresse ou ses coordonnées par défaut "compte".
colis annoncé livré mais non reçu = perdu = urgence 3.
virement catégorie "paiement".
mot de passe pas accepté = urgence 2.

Le niveau d'urgence dépend de la gravité pour le client :

urgence 1 : simple question, demande d'information ou de "comment faire", changement de préférence. Rien n'est bloqué, rien n'est perdu.
exemple concret : "Quel est le délai de livraison ?", "Comment changer mon email ?", "Acceptez-vous le virement ?"

urgence 2 : le client est bloqué mais sans perte d'argent ni fuite de données. Connexion impossible, mot de passe rejeté, paiement refusé, colis en retard, ou demande sensible comme la suppression du compte.
exemple concret : "Je n'arrive plus à me connecter", "Mon paiement a été refusé", "Je n'ai pas encore reçu mon colis".

urgence 3 : perte réelle ou faille. Argent prélevé ou perdu à tort, remboursement qui traîne ; colis perdu, volé, endommagé, ouvert, ou envoyé à la mauvaise adresse ; accès aux données ou aux emails d'un autre client.
exemple concret : "J'ai été débité deux fois", "Mon colis est arrivé ouvert", "Je reçois les emails de quelqu'un d'autre".



Voici des exemples concrets :
{"texte": "Ma carte a ete debitee deux fois pour la meme commande.", "categorie": "paiement", "urgence": 3},
{"texte": "Comment changer l'adresse email de mon compte ?", "categorie": "compte", "urgence": 1},
{"texte": "Bonjour, je n'ai toujours pas recu mon colis commande il y a 12 jours.", "categorie": "livraison", "urgence": 2},
 """
# =====================================================================


def classer(texte):
    charge = json.dumps({
        "model": MODELE,
        "temperature": 0,
        "max_tokens": 80,
        "messages": [{"role": "system", "content": CONSIGNE},
                     {"role": "user", "content": texte}],
    }).encode()
    requete = urllib.request.Request(
        f"{BASE}/v1/chat/completions", data=charge,
        headers={"Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(requete, timeout=60) as reponse:
        brut = json.loads(reponse.read())["choices"][0]["message"]["content"]
    debut, fin = brut.find("{"), brut.rfind("}")
    if debut == -1 or fin == -1:
        return None
    try:
        return json.loads(brut[debut:fin + 1])
    except json.JSONDecodeError:
        return None


def main():
    total = len(CAS["cas"])
    formes, categories, urgences = 0, 0, 0
    print(f"modele : {MODELE}   cas : {total}\n")
    for i, cas in enumerate(CAS["cas"], 1):
        obtenu = classer(cas["texte"])
        if obtenu is None:
            print(f"  {i:2d}. JSON illisible          <- {cas['texte'][:44]}")
            continue
        formes += 1
        bonne_categorie = obtenu.get("categorie") == cas["categorie"]
        bonne_urgence = obtenu.get("urgence") == cas["urgence"]
        categories += bonne_categorie
        urgences += bonne_urgence
        marque = "ok " if bonne_categorie and bonne_urgence else "   "
        print(f"  {i:2d}. {marque} attendu {cas['categorie']}/{cas['urgence']}"
              f"  obtenu {obtenu.get('categorie')}/{obtenu.get('urgence')}")

    print(f"\n  JSON valide  : {formes}/{total}  ({100 * formes // total} %)")
    print(f"  Categorie    : {categories}/{total}  ({100 * categories // total} %)")
    print(f"  Urgence      : {urgences}/{total}  ({100 * urgences // total} %)")
    print("\nNotez ce score, modifiez CONSIGNE, relancez. Gardez la trace de "
          "chaque version : elle est demandee au CC2.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
