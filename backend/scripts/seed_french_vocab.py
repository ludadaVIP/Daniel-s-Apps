"""Seed French Vocab group-1 files with 600 real French lemmas.

translation_en / example / example_en / ipa / tag are deliberately
placeholders — they will be filled in later, one group at a time.

Run once, idempotent: overwrites the six group-1.json files and
adjusts each level's index.json title/focus to match.
"""

from __future__ import annotations

import csv
import json
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parents[1] / "data" / "FrenchVocab"
BASE = DATA_DIR / "levels"
MASTER_CSV = DATA_DIR / "vocab-master.csv"
PH = "placeholder"

DATA = {
    "a1": {
        "noun": [
            "maison", "famille", "ami", "père", "mère", "frère", "sœur", "enfant", "homme", "femme",
            "fille", "garçon", "nom", "jour", "nuit", "matin", "soir", "semaine", "mois", "année",
            "heure", "eau", "pain", "café", "lait", "fromage", "pomme", "table", "chaise", "porte",
            "fenêtre", "livre", "école", "classe", "ville", "rue", "voiture", "train", "chien", "chat",
        ],
        "verb": [
            "être", "avoir", "faire", "aller", "venir", "dire", "voir", "savoir", "pouvoir", "vouloir",
            "devoir", "parler", "manger", "boire", "dormir", "lire", "écrire", "écouter", "regarder", "aimer",
            "donner", "prendre", "mettre", "ouvrir", "fermer", "acheter", "travailler", "habiter", "apprendre", "comprendre",
        ],
        "adj": [
            "grand", "petit", "bon", "mauvais", "nouveau", "vieux", "jeune", "beau", "joli", "heureux",
            "triste", "facile", "difficile", "chaud", "froid",
        ],
        "adv": ["bien", "mal", "très", "beaucoup", "souvent"],
        "phrase": [
            "bonjour", "bonsoir", "au revoir", "s'il vous plaît", "merci beaucoup",
            "de rien", "excusez-moi", "à bientôt", "comment ça va", "bonne nuit",
        ],
    },
    "a2": {
        "noun": [
            "travail", "bureau", "magasin", "marché", "supermarché", "boulangerie", "restaurant", "hôtel", "gare", "aéroport",
            "plage", "montagne", "forêt", "rivière", "mer", "soleil", "pluie", "neige", "vent", "ciel",
            "corps", "tête", "main", "pied", "œil", "bouche", "dent", "cheveu", "santé", "médecin",
            "hôpital", "médicament", "argent", "prix", "ticket", "cadeau", "fête", "anniversaire", "vacances", "week-end",
        ],
        "verb": [
            "choisir", "finir", "commencer", "attendre", "arriver", "partir", "sortir", "entrer", "monter", "descendre",
            "tomber", "courir", "marcher", "nager", "danser", "chanter", "jouer", "cuisiner", "laver", "nettoyer",
            "préparer", "essayer", "chercher", "trouver", "perdre", "gagner", "payer", "vendre", "rester", "visiter",
        ],
        "adj": [
            "content", "fatigué", "malade", "occupé", "libre", "propre", "sale", "cher", "rapide", "lent",
            "fort", "faible", "célèbre", "ouvert", "fermé",
        ],
        "adv": ["toujours", "jamais", "déjà", "encore", "parfois"],
        "phrase": [
            "tout de suite", "tout à l'heure", "en même temps", "pas du tout", "d'accord",
            "bien sûr", "ça dépend", "à demain", "avoir faim", "avoir soif",
        ],
    },
    "b1": {
        "noun": [
            "emploi", "entreprise", "réunion", "projet", "collègue", "patron", "employé", "salaire", "carrière", "expérience",
            "formation", "diplôme", "université", "étudiant", "professeur", "examen", "note", "recherche", "problème", "occasion",
            "choix", "décision", "raison", "avis", "idée", "but", "effort", "succès", "échec", "règle",
            "liberté", "droit", "justice", "société", "culture", "tradition", "histoire", "avenir", "passé", "monde",
        ],
        "verb": [
            "décider", "réfléchir", "discuter", "expliquer", "proposer", "accepter", "refuser", "demander", "répondre", "raconter",
            "partager", "recevoir", "envoyer", "apporter", "emporter", "ramener", "continuer", "arrêter", "changer", "améliorer",
            "développer", "créer", "construire", "réparer", "utiliser", "produire", "organiser", "réussir", "échouer", "permettre",
        ],
        "adj": [
            "intéressant", "ennuyeux", "important", "utile", "nécessaire", "possible", "impossible", "dangereux", "agréable", "désagréable",
            "surprenant", "évident", "probable", "différent", "semblable",
        ],
        "adv": ["probablement", "peut-être", "vraiment", "seulement", "enfin"],
        "phrase": [
            "avoir envie de", "avoir besoin de", "avoir raison", "avoir tort", "avoir peur",
            "faire attention", "se rendre compte", "à mon avis", "par exemple", "au lieu de",
        ],
    },
    "b2": {
        "noun": [
            "politique", "gouvernement", "économie", "citoyen", "impôt", "loi", "débat", "conflit", "crise", "enjeu",
            "autorité", "influence", "impact", "environnement", "pollution", "climat", "progrès", "inégalité", "pauvreté", "richesse",
            "concurrence", "consommation", "industrie", "technologie", "innovation", "découverte", "invention", "réseau", "média", "publicité",
            "preuve", "analyse", "argument", "enquête", "réflexion", "conscience", "attitude", "comportement", "identité", "opinion",
        ],
        "verb": [
            "analyser", "comparer", "juger", "critiquer", "défendre", "soutenir", "contester", "dénoncer", "condamner", "prouver",
            "affirmer", "supposer", "prévoir", "prédire", "exiger", "négocier", "convaincre", "persuader", "hésiter", "douter",
            "remarquer", "observer", "constater", "distinguer", "exclure", "inclure", "dépendre", "dépasser", "atteindre", "éviter",
        ],
        "adj": [
            "abstrait", "concret", "complexe", "ambigu", "clair", "vague", "juste", "injuste", "profond", "superficiel",
            "rare", "fréquent", "durable", "temporaire", "sensible",
        ],
        "adv": ["néanmoins", "cependant", "pourtant", "ainsi", "désormais"],
        "phrase": [
            "en revanche", "d'une part", "d'autre part", "dans la mesure où", "à condition que",
            "tenir compte de", "mettre en cause", "faire face à", "prendre conscience de", "en fin de compte",
        ],
    },
    "c1": {
        "noun": [
            "discours", "rhétorique", "raisonnement", "hypothèse", "paradoxe", "dilemme", "nuance", "contradiction", "équilibre", "perspective",
            "intuition", "perception", "jugement", "prémisse", "conclusion", "déduction", "induction", "théorie", "doctrine", "idéologie",
            "mentalité", "sensibilité", "subtilité", "complexité", "ambiguïté", "légitimité", "crédibilité", "fiabilité", "pertinence", "cohérence",
            "divergence", "convergence", "synthèse", "démarche", "méthodologie", "paradigme", "postulat", "finesse", "ampleur", "portée",
        ],
        "verb": [
            "nuancer", "élaborer", "formuler", "articuler", "structurer", "fonder", "justifier", "légitimer", "dissocier", "associer",
            "incarner", "illustrer", "démontrer", "esquisser", "approfondir", "susciter", "induire", "déduire", "présumer", "déplorer",
            "admettre", "concéder", "reconnaître", "dissimuler", "révéler", "occulter", "conférer", "attribuer", "octroyer", "témoigner",
        ],
        "adj": [
            "pertinent", "cohérent", "nuancé", "subtil", "raffiné", "sophistiqué", "exhaustif", "rigoureux", "lucide", "perspicace",
            "ambivalent", "paradoxal", "légitime", "plausible", "redoutable",
        ],
        "adv": ["notamment", "principalement", "essentiellement", "particulièrement", "davantage"],
        "phrase": [
            "à plus forte raison", "à proprement parler", "en l'occurrence", "en dépit de", "dans la mesure du possible",
            "mettre en évidence", "faire abstraction de", "prendre du recul", "remettre en question", "faire l'objet de",
        ],
    },
    "c2": {
        "noun": [
            "acuité", "alacrité", "allégresse", "apanage", "atavisme", "aporie", "atermoiement", "axiome", "casuistique", "célérité",
            "chimère", "conjecture", "dialectique", "ébauche", "écueil", "embellie", "épistémologie", "escarmouche", "exégèse", "faconde",
            "hégémonie", "herméneutique", "idiosyncrasie", "immanence", "impéritie", "inadvertance", "ineptie", "ingérence", "lapalissade", "lassitude",
            "limpidité", "magnanimité", "mansuétude", "mécompte", "mièvrerie", "mutisme", "obédience", "palinodie", "panégyrique", "péroraison",
        ],
        "verb": [
            "abdiquer", "abjurer", "acquiescer", "atermoyer", "conjecturer", "corroborer", "daigner", "déambuler", "dénoter", "déroger",
            "disserter", "ériger", "esquiver", "étayer", "exhumer", "expurger", "fustiger", "galvauder", "gloser", "jauger",
            "léser", "ourdir", "palabrer", "parachever", "peaufiner", "prévaloir", "proférer", "ratiociner", "sacraliser", "ternir",
        ],
        "adj": [
            "abscons", "ampoulé", "anodin", "atavique", "byzantin", "captieux", "dilettante", "emphatique", "fallacieux", "hagiographique",
            "inéluctable", "prosaïque", "sibyllin", "tautologique", "ubuesque",
        ],
        "adv": ["nonobstant", "conséquemment", "subséquemment", "incidemment", "concomitamment"],
        "phrase": [
            "à l'aune de", "à corps perdu", "à bon escient", "sans coup férir", "en dépit du bon sens",
            "faire montre de", "battre en brèche", "prendre acte de", "faire fi de", "mettre en exergue",
        ],
    },
}

EXPECTED = {"noun": 40, "verb": 30, "adj": 15, "adv": 5, "phrase": 10}
PLAN = ["noun", "verb", "adj", "adv", "phrase"]


def main() -> None:
    # --- Validate counts and global lemma uniqueness ---
    all_lemmas: list[tuple[str, str, str]] = []
    for lvl, by_pos in DATA.items():
        for pos, expected in EXPECTED.items():
            got = len(by_pos[pos])
            assert got == expected, f"{lvl}/{pos}: expected {expected}, got {got}"
        assert sum(len(by_pos[p]) for p in EXPECTED) == 100, f"{lvl} total != 100"
        for pos, words in by_pos.items():
            for w in words:
                all_lemmas.append((lvl, pos, w))

    seen: dict[str, str] = {}
    for lvl, pos, w in all_lemmas:
        if w in seen:
            raise SystemExit(f"DUPLICATE lemma: '{w}' in {lvl}/{pos} AND {seen[w]}")
        seen[w] = f"{lvl}/{pos}"
    print(f"OK: {len(all_lemmas)} unique lemmas across 6 levels")

    # --- Write group-1.json and refresh index.json ---
    for lvl, by_pos in DATA.items():
        words = []
        for pos in PLAN:
            for lemma in by_pos[pos]:
                words.append({
                    "lemma": lemma,
                    "ipa": PH,
                    "pos": pos,
                    "translation_en": PH,
                    "example": PH,
                    "example_en": PH,
                    "tag": PH,
                })
        group = {
            "id": "group-1",
            "title": "Group 1 · Core vocabulary",
            "focus": "100 real French lemmas (40 nouns, 30 verbs, 15 adj, 5 adv, 10 phrases). Translation, example, example_en, IPA and tag are placeholders — fill them in group by group.",
            "words": words,
        }
        group_path = BASE / lvl / "group-1.json"
        with group_path.open("w", encoding="utf-8") as f:
            json.dump(group, f, ensure_ascii=False, indent=2)
            f.write("\n")

        idx_path = BASE / lvl / "index.json"
        idx = json.loads(idx_path.read_text(encoding="utf-8"))
        idx["focus"] = "First 100 real French lemmas at this CEFR level. Translation, example and example_en are placeholders for now — they will be filled in one group at a time."
        idx["groups"][0]["title"] = "Group 1 · Core vocabulary"
        idx["groups"][0]["focus"] = "100 real French lemmas across noun / verb / adj / adv / phrase. Translation and example fields are placeholders."
        idx["groups"][0]["count"] = 100
        with idx_path.open("w", encoding="utf-8") as f:
            json.dump(idx, f, ensure_ascii=False, indent=2)
            f.write("\n")

    print("wrote 6 group-1.json + refreshed 6 index.json")

    # --- Rebuild vocab-master.csv from the JSON files (single source of truth).
    # The CSV lets us grep for duplicates before adding any new lemma:
    #   grep ',nouveau_lemme$' backend/data/FrenchVocab/vocab-master.csv
    rows: list[tuple[str, str, str]] = []
    for level_dir in sorted(BASE.iterdir()):
        if not level_dir.is_dir():
            continue
        for group_path in sorted(level_dir.glob("group-*.json")):
            group = json.loads(group_path.read_text(encoding="utf-8"))
            for word in group.get("words") or []:
                rows.append((level_dir.name, group["id"], word["lemma"]))

    # Master-CSV uniqueness guard — final safety net independent of DATA dict.
    seen_csv: dict[str, tuple[str, str]] = {}
    for level, group, lemma in rows:
        if lemma in seen_csv:
            prev_lvl, prev_grp = seen_csv[lemma]
            raise SystemExit(
                f"DUPLICATE lemma in vocab-master.csv: '{lemma}' in "
                f"{level}/{group} AND {prev_lvl}/{prev_grp}"
            )
        seen_csv[lemma] = (level, group)

    # newline="" + utf-8 (no BOM) matches the EspVocab master CSV format.
    with MASTER_CSV.open("w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f, lineterminator="\n")
        writer.writerow(["level", "group", "lemma"])
        writer.writerows(rows)
    print(f"wrote vocab-master.csv with {len(rows)} unique lemmas")


if __name__ == "__main__":
    main()
