"""Seance 9 : la route POST /api/resumer.

Objectif : resumer le message d'un client, en streaming, dans le ton demande.
Le contrat exact est dans app/CONTRAT.md, section "Route 1".

Vous remplissez les TODO 1 a 5 de ce fichier, et rien d'autre.
Tant qu'un TODO n'est pas ecrit, la route repond 501 "a ecrire".

Verifier :
    make app                     # terminal 1
    make conformite SEANCE=9     # terminal 2
"""
import time

from fastapi import APIRouter, Request
from fourni.modele import streamer
from fourni.transport import RequeteInvalide, fin, flux_ou_503, fragment, lire_corps

routeur = APIRouter()

TONS = {"neutre", "direct"}
LONGUEUR_MAX = 20_000


# =====================================================================
# TODO 1 : valider l'entree du client
# =====================================================================
def valider_resumer(corps):
    texte = corps.get("texte")
    if texte is None:
        raise RequeteInvalide("champ 'texte' absent")

    if len(texte) > LONGUEUR_MAX:
        raise RequeteInvalide("le champ 'texte' depasse 20 000 caracteres")

    ton = corps.get("ton")


    if ton not in TONS:
        raise RequeteInvalide("le champ 'ton' doit etre rempli")

    return texte, ton


# =====================================================================
# TODO 2 : assembler le prompt, cote serveur et nulle part ailleurs
# =====================================================================
def prompt_resumer(texte, ton):
    role = "Tu dois résumer les tickets des clients. "
    contexte = "Tu travailles dans une entrprise qui envoie des colis. "
    leformat = "Tu renvoies en format texte. "

    consigne = role + contexte + leformat

    return [
        {"role": "system", "content": consigne},
        {"role": "user", "content": texte},
    ]


    """Renvoie la liste de messages envoyee au modele.

    Rappel de la seance 5 : un role, un contexte, un format montre.
    Le texte du client est une DONNEE, jamais une consigne : gardez-le dans un
    message 'user' distinct de la consigne systeme.
    """
    raise NotImplementedError("TODO 2 : construire les messages")



# =============================================================
        # TODO 3 et 4 : appeler le modele et relayer chaque fragment
        # =============================================================
        # `streamer(messages)` produit des couples (genre, valeur) :
        #   ("delta", "un morceau de texte")        -> a renvoyer via fragment()
        #   ("usage", {"entree": .., "sortie": ..}) -> a garder pour la fin
        # =============================================================

@routeur.post("/api/resumer")
async def resumer(requete: Request):
    debut = time.perf_counter()
    texte, ton = valider_resumer(await lire_corps(requete))
    messages = prompt_resumer(texte, ton)
    async def flux():
        usage = {}
        async for genre, valeur in streamer(messages):
            if genre == "delta":
                yield fragment(valeur)
            elif genre == "usage":
                usage.update(valeur)

        
        # TODO 5 : cloturer le flux avec l'evenement done et l'usage
        # =============================================================
        yield fin(usage, debut)

    # flux_ou_503 consomme le premier evenement avant de repondre : c'est ce qui
    # permet de renvoyer un vrai 503 quand le modele ne repond pas.
    return await flux_ou_503(flux())
