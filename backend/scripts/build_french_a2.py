"""
Build 14 A2 groups (group-2 .. group-15) for French Vocab.
- Each group: ~40 nouns, ~30 verbs, ~15 adj, ~5 adv, ~10 phrases (max 14 phrases = <15%).
- Placeholder fields: ipa, translation_en, example, example_en, tag.
- Uniqueness checked against vocab-master.csv and within new set.
"""
import csv
import json
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = ROOT / "backend" / "data" / "FrenchVocab"
A2_DIR = DATA_DIR / "levels" / "a2"
CSV_PATH = DATA_DIR / "vocab-master.csv"

GROUPS = [
    {
        "id": "group-2",
        "title": "Group 2 · Émotions et sentiments",
        "focus": "Emotions, feelings, mood, idiomatic expressions of state of mind.",
        "nouns": [
            "joie", "bonheur", "malheur", "tristesse", "colère",
            "amour", "haine", "jalousie", "honte", "fierté",
            "espoir", "courage", "ennui", "sentiment", "émotion",
            "humeur", "plaisir", "douleur", "inquiétude", "stress",
            "gêne", "paix", "confiance", "regret", "pardon",
            "amitié", "tendresse", "passion", "affection", "sympathie",
            "soulagement", "satisfaction", "déception", "surprise", "angoisse",
            "panique", "nostalgie", "choc", "enthousiasme", "sérénité",
        ],
        "verbs": [
            "pleurer", "rire", "soupirer", "trembler", "frissonner",
            "hurler", "pardonner", "regretter", "espérer", "craindre",
            "redouter", "détester", "adorer", "plaire", "déplaire",
            "fâcher", "calmer", "apaiser", "rassurer", "inquiéter",
            "surprendre", "étonner", "choquer", "agacer", "énerver",
            "amuser", "ennuyer", "fasciner", "consoler", "embrasser",
        ],
        "adj": [
            "amoureux", "jaloux", "fier", "honteux", "furieux",
            "inquiet", "nerveux", "anxieux", "tendre", "ravi",
            "déçu", "enthousiaste", "ému", "choqué", "effrayé",
        ],
        "adv": ["absolument", "tellement", "profondément", "terriblement", "vivement"],
        "phrases": [
            "avoir le cafard", "en avoir marre", "avoir le coup de foudre",
            "tomber amoureux", "garder le moral", "perdre patience",
            "avoir la pêche", "en vouloir à", "faire de la peine", "avoir le trac",
        ],
    },
    {
        "id": "group-3",
        "title": "Group 3 · Caractère et personnalité",
        "focus": "Personality traits, character qualities and flaws, behaviour.",
        "nouns": [
            "caractère", "personnalité", "qualité", "défaut", "force",
            "faiblesse", "patience", "impatience", "générosité", "égoïsme",
            "honnêteté", "mensonge", "vérité", "sincérité", "modestie",
            "arrogance", "ambition", "motivation", "paresse", "persévérance",
            "charme", "élégance", "beauté", "laideur", "intelligence",
            "sagesse", "folie", "humour", "gentillesse", "méchanceté",
            "douceur", "dureté", "optimisme", "pessimisme", "prudence",
            "audace", "timidité", "politesse", "impolitesse", "tolérance",
        ],
        "verbs": [
            "mentir", "tromper", "trahir", "respecter", "mépriser",
            "admirer", "envier", "encourager", "décourager", "influencer",
            "impressionner", "inspirer", "dominer", "obéir", "désobéir",
            "flatter", "exagérer", "tolérer", "supporter", "adapter",
            "exprimer", "avouer", "confier", "afficher", "provoquer",
            "taquiner", "plaisanter", "rougir", "apprécier", "négliger",
        ],
        "adj": [
            "honnête", "malhonnête", "égoïste", "généreux", "sincère",
            "hypocrite", "modeste", "arrogant", "ambitieux", "courageux",
            "lâche", "patient", "impatient", "tolérant", "méchant",
        ],
        "adv": ["gentiment", "franchement", "honnêtement", "carrément", "naturellement"],
        "phrases": [
            "avoir bon caractère", "avoir mauvais caractère", "avoir du cœur",
            "avoir la tête dure", "perdre la tête", "faire la tête",
            "être à l'aise", "avoir le sens de l'humour", "tenir parole", "avoir bon goût",
        ],
    },
    {
        "id": "group-4",
        "title": "Group 4 · Technologie et numérique",
        "focus": "Phone, internet, computer, media basics.",
        "nouns": [
            "portable", "tablette", "écran", "clavier", "enceinte",
            "internet", "site", "page", "application", "logiciel",
            "fichier", "dossier", "document", "courriel", "message",
            "vidéo", "musique", "film", "radio", "journal",
            "magazine", "émission", "chaîne", "saga", "icône",
            "lien", "commentaire", "utilisateur", "abonnement", "notification",
            "caméra", "wifi", "connexion", "version", "téléchargement",
            "batterie", "chargeur", "câble", "blog", "forum",
        ],
        "verbs": [
            "télécharger", "supprimer", "enregistrer", "sauvegarder", "cliquer",
            "configurer", "appeler", "rappeler", "raccrocher", "surfer",
            "publier", "poster", "commenter", "consulter", "rechercher",
            "communiquer", "bavarder", "contacter", "joindre", "transmettre",
            "diffuser", "filmer", "scanner", "imprimer", "coller",
            "abonner", "désabonner", "signaler", "bloquer", "débloquer",
        ],
        "adj": [
            "numérique", "virtuel", "électronique", "mobile", "connecté",
            "déconnecté", "automatique", "manuel", "public", "privé",
            "sécurisé", "gratuit", "payant", "instantané", "interactif",
        ],
        "adv": ["automatiquement", "immédiatement", "gratuitement", "directement", "instantanément"],
        "phrases": [
            "en ligne", "en direct", "hors ligne", "mot de passe", "mise à jour",
            "tomber en panne", "passer un coup de fil", "à distance",
            "en plein écran", "en sourdine",
        ],
    },
    {
        "id": "group-5",
        "title": "Group 5 · Cinéma, musique et lecture",
        "focus": "Arts, film, music, books, performance.",
        "nouns": [
            "cinéma", "actrice", "réalisateur", "spectateur", "scène",
            "comédie", "drame", "comédien", "tragédie", "intrigue",
            "personnage", "héros", "dialogue", "décor", "critique",
            "festival", "récompense", "concert", "orchestre", "chanteuse",
            "musicien", "compositeur", "mélodie", "rythme", "instrument",
            "piano", "guitare", "violon", "tambour", "flûte",
            "trompette", "chanson", "album", "clip", "paroles",
            "roman", "poème", "poésie", "auteur", "titre",
        ],
        "verbs": [
            "tourner", "interpréter", "applaudir", "siffler", "acclamer",
            "composer", "éditer", "dédicacer", "citer", "traduire",
            "représenter", "narrer", "décrire", "accorder", "improviser",
            "distribuer", "émouvoir", "divertir", "lancer", "enchanter",
            "captiver", "ressentir", "déchiffrer", "dévorer", "feuilleter",
            "projeter", "auditionner", "signer", "ovationner", "imaginer",
        ],
        "adj": [
            "musical", "littéraire", "dramatique", "comique", "tragique",
            "romantique", "émouvant", "captivant", "talentueux", "mélodieux",
            "vivant", "original", "traditionnel", "populaire", "fameux",
        ],
        "adv": ["magnifiquement", "joliment", "doucement", "fortement", "simplement"],
        "phrases": [
            "en concert", "en première", "en coulisses", "à l'affiche",
            "sur scène", "jouer un rôle", "mettre en scène",
            "faire un tabac", "en version originale", "à guichets fermés",
        ],
    },
    {
        "id": "group-6",
        "title": "Group 6 · Sport et activités physiques",
        "focus": "Sports, fitness, games, competition.",
        "nouns": [
            "sport", "équipe", "joueur", "joueuse", "match",
            "entraînement", "entraîneur", "arbitre", "capitaine", "championnat",
            "tournoi", "finale", "victoire", "défaite", "médaille",
            "trophée", "coupe", "classement", "score", "tribune",
            "terrain", "stade", "piscine", "gymnase", "piste",
            "marathon", "vestiaire", "ballon", "balle", "raquette",
            "filet", "panier", "maillot", "football", "rugby",
            "tennis", "judo", "natation", "gymnastique", "course",
        ],
        "verbs": [
            "entraîner", "battre", "viser", "marquer", "attaquer",
            "plonger", "glisser", "grimper", "escalader", "lutter",
            "pédaler", "ramer", "skier", "patiner", "arbitrer",
            "inscrire", "éliminer", "qualifier", "disqualifier", "mener",
            "abandonner", "coacher", "encadrer", "échauffer", "étirer",
            "motiver", "vaincre", "pratiquer", "défier", "remporter",
        ],
        "adj": [
            "sportif", "professionnel", "amateur", "athlétique", "musclé",
            "souple", "énergique", "dynamique", "compétitif", "performant",
            "gagnant", "perdant", "qualifié", "classé", "technique",
        ],
        "adv": ["rapidement", "sportivement", "dynamiquement", "intensivement", "vigoureusement"],
        "phrases": [
            "tenir le coup", "battre un record", "faire match nul",
            "marquer un but", "jouer franc jeu", "jeter l'éponge",
            "gagner haut la main", "relever le défi", "mettre KO",
            "avoir le souffle court",
        ],
    },
    {
        "id": "group-7",
        "title": "Group 7 · Cuisine et restaurant",
        "focus": "Cooking, recipes, ingredients, dining out.",
        "nouns": [
            "recette", "ingrédient", "préparation", "cuisson", "casserole",
            "poêle", "four", "micro-ondes", "cuisinière", "bouilloire",
            "mixeur", "louche", "spatule", "passoire", "robot",
            "balance", "minuteur", "tablier", "moule", "saladier",
            "théière", "cafetière", "farine", "levure", "vanille",
            "cannelle", "basilic", "persil", "menthe", "ail",
            "gingembre", "crème", "saumon", "crevette", "saucisse",
            "courgette", "aubergine", "poivron", "raisin", "framboise",
        ],
        "verbs": [
            "pétrir", "fouetter", "émincer", "mariner", "garnir",
            "mijoter", "brûler", "saupoudrer", "presser", "déguster",
            "savourer", "écumer", "dorer", "caraméliser", "glacer",
            "blanchir", "vider", "désosser", "fariner", "entamer",
            "déboucher", "mastiquer", "aromatiser", "relever", "pétiller",
            "macérer", "décanter", "réduire", "accompagner", "remuer",
        ],
        "adj": [
            "cuisiné", "bio", "allégé", "copieux", "savoureux",
            "appétissant", "parfumé", "croustillant", "croquant", "fondant",
            "juteux", "fade", "équilibré", "varié", "gourmand",
        ],
        "adv": ["divinement", "finement", "généreusement", "soigneusement", "légèrement"],
        "phrases": [
            "au four", "à la vapeur", "mettre la main à la pâte",
            "avoir l'eau à la bouche", "raconter des salades",
            "être aux petits oignons", "à la carte", "au bain-marie",
            "en sauce", "mettre les petits plats dans les grands",
        ],
    },
    {
        "id": "group-8",
        "title": "Group 8 · Achats, services et marché",
        "focus": "Shops, services, money handling, customer interactions.",
        "nouns": [
            "boutique", "bijouterie", "pharmacie", "pâtisserie", "épicerie",
            "fleuriste", "poissonnerie", "boucherie", "charcuterie", "papeterie",
            "parfumerie", "coiffeur", "opticien", "dentiste", "caisse",
            "caissier", "client", "commande", "livraison", "livreur",
            "facture", "reçu", "addition", "pourboire", "monnaie",
            "espèces", "chèque", "distributeur", "paiement", "remboursement",
            "garantie", "réclamation", "chariot", "rayon", "étiquette",
            "marque", "soldes", "promotion", "vitrine", "pointure",
        ],
        "verbs": [
            "réclamer", "magasiner", "dépenser", "économiser", "épargner",
            "gérer", "profiter", "bénéficier", "accumuler", "rapporter",
            "débourser", "encaisser", "tamponner", "valider", "contrôler",
            "vérifier", "brader", "importer", "exporter", "conseiller",
            "recommander", "vanter", "promouvoir", "expédier", "approvisionner",
            "retirer", "solder", "parcourir", "emprunter", "prêter",
        ],
        "adj": [
            "avantageux", "économique", "abordable", "raisonnable", "excessif",
            "exclusif", "limité", "illimité", "disponible", "indisponible",
            "périmé", "soldé", "alimentaire", "électrique", "ménager",
        ],
        "adv": ["partiellement", "totalement", "entièrement", "durement", "lourdement"],
        "phrases": [
            "faire les soldes", "payer comptant", "faire crédit",
            "coûter les yeux de la tête", "ça vaut le coup",
            "ouvrir un compte", "faire la queue", "faire des économies",
            "rentrer dans ses frais", "pour une bouchée de pain",
        ],
    },
    {
        "id": "group-9",
        "title": "Group 9 · Maison, jardin et bricolage",
        "focus": "Extended home, garden, DIY tools, repairs.",
        "nouns": [
            "terrasse", "véranda", "grenier", "sous-sol", "cour",
            "jardin", "potager", "pelouse", "haie", "clôture",
            "portail", "allée", "arrosoir", "tuyau", "brouette",
            "râteau", "pelle", "tondeuse", "sécateur", "marteau",
            "tournevis", "clou", "vis", "perceuse", "scie",
            "échelle", "coffre", "ampoule", "interrupteur", "robinet",
            "évier", "baignoire", "douche", "lavabo", "miroir",
            "savon", "balai", "seau", "éponge", "poubelle",
        ],
        "verbs": [
            "bêcher", "piocher", "désherber", "fertiliser", "greffer",
            "tondre", "ratisser", "élaguer", "raboter", "poncer",
            "enduire", "vernir", "carreler", "tapisser", "isoler",
            "aménager", "rénover", "restaurer", "entretenir", "bricoler",
            "dévisser", "enfoncer", "arracher", "déplacer", "aérer",
            "ventiler", "climatiser", "dégivrer", "jardiner", "rafraîchir",
        ],
        "adj": [
            "fleuri", "verdoyant", "ombragé", "soigné", "négligé",
            "entretenu", "accueillant", "douillet", "rustique", "contemporain",
            "vétuste", "coquet", "charmant", "vaste", "mitoyen",
        ],
        "adv": ["alentour", "horizontalement", "verticalement", "proprement", "salement"],
        "phrases": [
            "avoir la main verte", "faire des travaux",
            "faire le tour du propriétaire", "mettre sens dessus dessous",
            "en bois", "en pierre", "en métal", "de fond en comble",
            "avoir un toit", "à toute épreuve",
        ],
    },
    {
        "id": "group-10",
        "title": "Group 10 · Animaux, plantes et environnement",
        "focus": "Extended fauna and flora, ecosystems, environment vocabulary.",
        "nouns": [
            "animal", "mammifère", "reptile", "insecte", "requin",
            "dauphin", "baleine", "crabe", "lézard", "moustique",
            "guêpe", "coccinelle", "escargot", "hérisson", "écureuil",
            "chouette", "hibou", "aigle", "pigeon", "corbeau",
            "mouette", "pingouin", "perroquet", "cygne", "taureau",
            "veau", "agneau", "chiot", "chaton", "queue",
            "patte", "aile", "plume", "bec", "nid",
            "ruche", "zoo", "ferme", "troupeau", "désert",
        ],
        "verbs": [
            "picorer", "pondre", "rugir", "hennir", "beugler",
            "bêler", "croasser", "piétiner", "gambader", "sautiller",
            "ramper", "onduler", "préserver", "protéger", "polluer",
            "recycler", "détruire", "sauver", "contempler", "éclore",
            "germer", "mûrir", "pourrir", "faner", "flétrir",
            "moisir", "féconder", "abriter", "envahir", "migrer",
        ],
        "adj": [
            "rugueux", "glissant", "gluant", "écailleux", "ailé",
            "nocturne", "diurne", "herbivore", "carnivore", "omnivore",
            "terrestre", "aquatique", "marin", "protégé", "menacé",
        ],
        "adv": ["instinctivement", "sauvagement", "férocement", "paisiblement", "calmement"],
        "phrases": [
            "en voie de disparition", "prendre racine", "faire le mort",
            "mettre la puce à l'oreille", "avoir un chat dans la gorge",
            "chercher la petite bête", "poser un lapin",
            "avoir d'autres chats à fouetter", "sain et sauf", "faire la chasse à",
        ],
    },
    {
        "id": "group-11",
        "title": "Group 11 · Voyage, hôtel et tourisme",
        "focus": "Detailed travel vocabulary: lodging, sightseeing, landscapes.",
        "nouns": [
            "touriste", "visiteur", "guide", "voyageur", "agence",
            "circuit", "excursion", "séjour", "escale", "embarquement",
            "atterrissage", "décollage", "correspondance", "itinéraire", "destination",
            "boussole", "brochure", "dépliant", "souvenir", "monument",
            "musée", "château", "palais", "ruine", "quartier",
            "centre", "banlieue", "campagne", "capitale", "région",
            "pays", "continent", "fleuve", "cascade", "cathédrale",
            "église", "tour", "statue", "fontaine", "paysage",
        ],
        "verbs": [
            "voyager", "explorer", "séjourner", "loger", "héberger",
            "accueillir", "annuler", "confirmer", "prolonger", "bronzer",
            "photographier", "camper", "randonner", "flâner", "vagabonder",
            "dépayser", "immortaliser", "arpenter", "sillonner", "bivouaquer",
            "survoler", "piloter", "dérouter", "débuter", "héler",
            "guider", "réceptionner", "programmer", "égarer", "rapatrier",
        ],
        "adj": [
            "touristique", "exotique", "dépaysant", "pittoresque", "historique",
            "culturel", "animé", "paisible", "urbain", "rural",
            "montagneux", "tropical", "méditerranéen", "impressionnant", "splendide",
        ],
        "adv": ["localement", "mondialement", "internationalement", "régionalement", "nationalement"],
        "phrases": [
            "avoir le pied marin", "changer d'air", "avoir le mal du pays",
            "partir à l'aventure", "voyager léger", "faire les valises",
            "prendre le large", "mettre les voiles",
            "en pleine campagne", "en plein centre",
        ],
    },
    {
        "id": "group-12",
        "title": "Group 12 · Travail, métiers et entreprise",
        "focus": "Extended professions, business, workplace processes.",
        "nouns": [
            "mécanicien", "plombier", "électricien", "menuisier", "maçon",
            "charpentier", "couturier", "jardinier", "cuisinier", "pâtissier",
            "comptable", "banquier", "assureur", "notaire", "juge",
            "député", "ministre", "président", "gérant", "dirigeant",
            "cadre", "stagiaire", "apprenti", "ouvrier", "agriculteur",
            "pêcheur", "chasseur", "soldat", "militaire", "pilote",
            "chauffeur", "facteur", "fonctionnaire", "interprète", "traducteur",
            "chercheur", "chirurgien", "pharmacien", "vétérinaire", "psychologue",
        ],
        "verbs": [
            "embaucher", "recruter", "licencier", "démissionner", "postuler",
            "candidater", "sélectionner", "retenir", "déléguer", "superviser",
            "présider", "voter", "élire", "débattre", "exposer",
            "dialoguer", "militer", "syndiquer", "coordonner", "accomplir",
            "évaluer", "estimer", "hiérarchiser", "responsabiliser", "contribuer",
            "adhérer", "intervenir", "démarcher", "fidéliser", "prospérer",
        ],
        "adj": [
            "compétent", "incompétent", "expérimenté", "novice", "débutant",
            "motivé", "démotivé", "dévoué", "responsable", "irresponsable",
            "salarié", "travailleur", "productif", "efficace", "rentable",
        ],
        "adv": ["professionnellement", "efficacement", "sérieusement", "consciencieusement", "méthodiquement"],
        "phrases": [
            "faire grève", "prendre sa retraite", "toucher le chômage",
            "monter en grade", "gagner sa vie", "gagner du temps",
            "perdre son temps", "prendre des notes", "changer de métier",
            "mettre la main à",
        ],
    },
    {
        "id": "group-13",
        "title": "Group 13 · Études et formation",
        "focus": "Higher education, subjects, exams, study skills.",
        "nouns": [
            "filière", "discipline", "spécialité", "option", "licence",
            "master", "doctorat", "concours", "épreuve", "moyenne",
            "bulletin", "rapport", "thèse", "bibliographie", "citation",
            "mathématiques", "géographie", "biologie", "chimie", "philosophie",
            "sociologie", "psychologie", "linguistique", "littérature", "art",
            "syntaxe", "grammaire", "orthographe", "conjugaison", "vocabulaire",
            "prononciation", "syllabe", "accent", "ponctuation", "virgule",
            "tâche", "présentation", "exposé", "faculté", "campus",
        ],
        "verbs": [
            "rédiger", "résumer", "synthétiser", "classer", "ordonner",
            "lister", "surligner", "annoter", "photocopier", "conjuguer",
            "ressasser", "bachoter", "plancher", "investir", "redoubler",
            "sécher", "retarder", "oublier", "distraire", "relire",
            "prononcer", "épeler", "énumérer", "paraphraser", "ânonner",
            "orthographier", "accentuer", "assimiler", "exceller", "instruire",
        ],
        "adj": [
            "universitaire", "académique", "pédagogique", "théorique", "oral",
            "écrit", "obligatoire", "facultatif", "optionnel", "intensif",
            "bilingue", "illettré", "élémentaire", "supérieur", "secondaire",
        ],
        "adv": ["théoriquement", "oralement", "studieusement", "intelligemment", "péniblement"],
        "phrases": [
            "avec mention", "faire ses preuves", "avoir la moyenne",
            "bûcher comme un fou", "être à la traîne",
            "tomber sur un sujet", "décrocher un diplôme", "avoir son bac",
            "partir étudier", "faire ses armes",
        ],
    },
    {
        "id": "group-14",
        "title": "Group 14 · Ville, administration et services publics",
        "focus": "City life, public services, paperwork, law.",
        "nouns": [
            "mairie", "préfecture", "ambassade", "consulat", "tribunal",
            "commissariat", "banque", "administration", "formulaire", "signature",
            "demande", "autorisation", "permis", "attestation", "justificatif",
            "quittance", "avenue", "boulevard", "place", "square",
            "cimetière", "arrondissement", "zone", "secteur", "voirie",
            "urbanisme", "ordure", "déchet", "recyclage", "sécurité",
            "alarme", "gardien", "agent", "caserne", "prison",
            "amende", "contravention", "taxe", "lampadaire", "banc",
        ],
        "verbs": [
            "déclarer", "protester", "manifester", "défiler", "patrouiller",
            "interpeller", "fouiller", "inspecter", "verbaliser", "sanctionner",
            "amnistier", "gracier", "bétonner", "urbaniser", "élargir",
            "gouverner", "administrer", "légiférer", "plaider", "comparaître",
            "ratifier", "promulguer", "convoquer", "allouer", "réguler",
            "enquêter", "sécuriser", "vandaliser", "dégrader", "bâtir",
        ],
        "adj": [
            "administratif", "légal", "illégal", "officiel", "civique",
            "métropolitain", "municipal", "communal", "régional", "national",
            "international", "parisien", "départemental", "provincial", "sûr",
        ],
        "adv": ["officiellement", "légalement", "illégalement", "civilement", "juridiquement"],
        "phrases": [
            "déposer plainte", "porter plainte", "en règle", "hors la loi",
            "en ville", "dans le coin", "aller au poste",
            "coller une amende", "payer ses impôts", "à la une",
        ],
    },
    {
        "id": "group-15",
        "title": "Group 15 · Médias, actualité et société",
        "focus": "News, media, public discourse, society.",
        "nouns": [
            "actualité", "information", "nouvelle", "événement", "annonce",
            "communiqué", "déclaration", "interview", "reportage", "article",
            "presse", "quotidien", "hebdomadaire", "mensuel", "édition",
            "tirage", "abonné", "téléspectateur", "auditeur", "sondage",
            "polémique", "scandale", "rumeur", "censure", "propagande",
            "manipulation", "désinformation", "source", "témoin", "rédacteur",
            "présentateur", "animateur", "producteur", "célébrité", "vedette",
            "anonymat", "confidentialité", "transparence", "véracité", "impartialité",
        ],
        "verbs": [
            "annoncer", "informer", "divulguer", "nier", "démentir",
            "rectifier", "contredire", "accuser", "sonder", "interviewer",
            "questionner", "relater", "couvrir", "censurer", "bâillonner",
            "diffamer", "caricaturer", "satiriser", "mobiliser", "sensibiliser",
            "alerter", "prévenir", "ignorer", "omettre", "indigner",
            "engager", "démasquer", "polémiquer", "relayer", "propager",
        ],
        "adj": [
            "médiatique", "influent", "controversé", "scandaleux", "sensationnel",
            "discret", "indiscret", "secret", "impartial", "objectif",
            "subjectif", "biaisé", "neutre", "engagé", "factuel",
        ],
        "adv": ["publiquement", "médiatiquement", "objectivement", "prétendument", "apparemment"],
        "phrases": [
            "en exclusivité", "à la télé", "à la radio",
            "entre les lignes", "faire la une", "bouche à oreille",
            "mettre en lumière", "prendre la parole",
            "ne pas mâcher ses mots", "mettre les pieds dans le plat",
        ],
    },
]


def placeholder_word(lemma, pos):
    return {
        "lemma": lemma,
        "ipa": "placeholder",
        "pos": pos,
        "translation_en": "placeholder",
        "example": "placeholder",
        "example_en": "placeholder",
        "tag": "placeholder",
    }


def load_existing_lemmas():
    existing = set()
    with open(CSV_PATH, "r", encoding="utf-8") as f:
        reader = csv.reader(f)
        next(reader)  # header
        for row in reader:
            if len(row) >= 3:
                existing.add(row[2])
    return existing


def validate():
    existing = load_existing_lemmas()
    seen = set()
    errors = []
    for g in GROUPS:
        n_phrase = len(g["phrases"])
        total = len(g["nouns"]) + len(g["verbs"]) + len(g["adj"]) + len(g["adv"]) + n_phrase
        if total != 100:
            errors.append(f"{g['id']}: total {total} (want 100)")
        if n_phrase / total >= 0.15:
            errors.append(f"{g['id']}: phrase ratio {n_phrase}/{total} >= 15%")
        # check single-word for non-phrase
        for pos_key in ("nouns", "verbs", "adj", "adv"):
            for w in g[pos_key]:
                if " " in w or "'" in w:
                    # hyphens are OK (single token in French)
                    errors.append(f"{g['id']}/{pos_key}: '{w}' has space/apostrophe")
        for pos_key in ("nouns", "verbs", "adj", "adv", "phrases"):
            for w in g[pos_key]:
                if w in existing:
                    errors.append(f"{g['id']}/{pos_key}: '{w}' already in master CSV")
                if w in seen:
                    errors.append(f"{g['id']}/{pos_key}: '{w}' duplicate in new groups")
                seen.add(w)
    return errors


def build_group_json(g):
    words = []
    for lemma in g["nouns"]:
        words.append(placeholder_word(lemma, "noun"))
    for lemma in g["verbs"]:
        words.append(placeholder_word(lemma, "verb"))
    for lemma in g["adj"]:
        words.append(placeholder_word(lemma, "adj"))
    for lemma in g["adv"]:
        words.append(placeholder_word(lemma, "adv"))
    for lemma in g["phrases"]:
        words.append(placeholder_word(lemma, "phrase"))
    return {
        "id": g["id"],
        "title": g["title"],
        "focus": g["focus"] + " Translation, example, example_en, IPA and tag are placeholders — fill them in group by group.",
        "words": words,
    }


def main():
    errors = validate()
    if errors:
        print("VALIDATION ERRORS:")
        for e in errors:
            print("  " + e)
        return 1

    # Write group JSON files
    for g in GROUPS:
        out = build_group_json(g)
        path = A2_DIR / f"{g['id']}.json"
        path.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"Wrote {path}")

    # Update index.json
    index_path = A2_DIR / "index.json"
    index = json.loads(index_path.read_text(encoding="utf-8"))
    existing_ids = {grp["id"] for grp in index["groups"]}
    for g in GROUPS:
        if g["id"] not in existing_ids:
            index["groups"].append({
                "id": g["id"],
                "title": g["title"],
                "focus": g["focus"],
                "count": 100,
            })
    index_path.write_text(json.dumps(index, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Updated {index_path}")

    # Append rows to vocab-master.csv
    with open(CSV_PATH, "a", encoding="utf-8", newline="") as f:
        writer = csv.writer(f, lineterminator="\n")
        for g in GROUPS:
            for pos_key in ("nouns", "verbs", "adj", "adv", "phrases"):
                for lemma in g[pos_key]:
                    writer.writerow(["a2", g["id"], lemma])
    print(f"Appended rows to {CSV_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
