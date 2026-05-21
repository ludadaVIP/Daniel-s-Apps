"""
Build French Vocab C1 groups 2..20.

This pass adds placeholder learning fields only. It validates candidates
against vocab-master.csv and rebuilds the master CSV from the JSON files.
"""

from __future__ import annotations

import csv
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = ROOT / "backend" / "data" / "FrenchVocab"
C1_DIR = DATA_DIR / "levels" / "c1"
CSV_PATH = DATA_DIR / "vocab-master.csv"
PH = "placeholder"

COUNTS = {"nouns": 35, "verbs": 12, "adj": 43, "adv": 3, "phrases": 7}
POS_ORDER = [
    ("nouns", "noun"),
    ("verbs", "verb"),
    ("adj", "adj"),
    ("adv", "adv"),
    ("phrases", "phrase"),
]
TARGET_GROUP_IDS = {f"group-{n}" for n in range(2, 21)}


def items(raw: str) -> list[str]:
    return [line.strip() for line in raw.strip().splitlines() if line.strip()]


def group_sort_key(path: Path) -> tuple[int, str]:
    try:
        return (int(path.stem.split("-")[-1]), path.name)
    except ValueError:
        return (9999, path.name)


GROUPS = [
    ("group-2", "Group 2 · Concepts et abstraction", "C1 vocabulary for conceptual precision, abstraction, definition and theoretical framing."),
    ("group-3", "Group 3 · Argumentation critique", "C1 vocabulary for critique, rebuttal, concession, implication and high-level reasoning."),
    ("group-4", "Group 4 · Sciences humaines", "C1 vocabulary for social sciences, interpretation, identity, institutions and historical analysis."),
    ("group-5", "Group 5 · Philosophie et pensée", "C1 vocabulary for philosophical problems, epistemology, ontology, ethics and judgement."),
    ("group-6", "Group 6 · Littérature et esthétique", "C1 vocabulary for literary analysis, style, narrative, art, taste and reception."),
    ("group-7", "Group 7 · Recherche académique", "C1 vocabulary for methodology, evidence, modelling, publication, peer review and academic writing."),
    ("group-8", "Group 8 · Politique et idéologies", "C1 vocabulary for ideologies, legitimacy, power, public conflict and political thought."),
    ("group-9", "Group 9 · Droit et norme", "C1 vocabulary for norms, legal reasoning, obligations, interpretation and institutional legitimacy."),
    ("group-10", "Group 10 · Économie politique", "C1 vocabulary for political economy, finance, incentives, distribution and systemic change."),
    ("group-11", "Group 11 · Médias et discours", "C1 vocabulary for discourse analysis, framing, rhetoric, media systems and public language."),
    ("group-12", "Group 12 · Éthique et société", "C1 vocabulary for ethical judgement, responsibility, vulnerability, dignity and collective life."),
    ("group-13", "Group 13 · Technologie et subjectivité", "C1 vocabulary for technology, agency, automation, attention, mediation and subjectivity."),
    ("group-14", "Group 14 · Environnement complexe", "C1 vocabulary for ecological systems, limits, transitions, irreversibility and long-term risk."),
    ("group-15", "Group 15 · Histoire et mémoire", "C1 vocabulary for memory, archives, historical narration, rupture and continuity."),
    ("group-16", "Group 16 · Langage et sémiotique", "C1 vocabulary for language, signs, meaning, translation, ambiguity and interpretation."),
    ("group-17", "Group 17 · Psychologie et perception", "C1 vocabulary for perception, cognition, affect, bias, motivation and self-reflection."),
    ("group-18", "Group 18 · Organisations avancées", "C1 vocabulary for governance, coordination, institutional design and professional complexity."),
    ("group-19", "Group 19 · Nuance et registre", "C1 vocabulary for register, style, hedging, contrast, precision and rhetorical stance."),
    ("group-20", "Group 20 · Expressions C1", "C1 idiomatic and discourse expressions for refined argument, caution, synthesis and stance."),
]


BASE_NOUNS = items("""
abduction
aberrance
absolu
abstractionnisme
acculturation
acception
achoppement
adéquation
affectivité
agentivité
agonistique
allégorie
anachronisme
anamnèse
analogie
ancrage
antagonisme
antinomie
aporie
appareillage
arbitraire
archétype
argumentativité
ascendance
assise
asymétrie
axiologie
bifurcation
casuistique
catégorisation
césure
chiasme
circularité
clivage
cognition
commensurabilité
complétude
conceptualité
concomitance
congruence
connotation
consubstantialité
contingence
contrepoint
corollaire
cosmogonie
déconstruction
déférence
déictique
délibératif
dénotation
dépassement
désaveu
désenchantement
dichotomie
digression
discursivité
disjonction
disqualification
doxa
dualité
élucidation
enchevêtrement
entéléchie
énonciation
équivocité
essentialisation
exégèse
factualité
filiation
finitude
généalogie
glissement
gradualité
heuristique
hétéronomie
historicité
hybridité
immanence
incommensurabilité
indétermination
inférence
inflexion
intersubjectivité
irréductibilité
itération
latence
lecture
littéralité
métaanalyse
métalangage
métaphore
mimétisme
modalité
narrativité
normativité
objectivation
ontologie
opacité
paradigme
paratexte
performativité
phénoménologie
plasticité
plausibilité
polyphonie
postulat
présupposition
problématisation
prolepse
réception
référentialité
réfutation
rémanence
résonance
schématisation
sémantique
sémiotique
singularité
spéculation
subjectivation
syllogisme
syncrétisme
tautologie
taxinomie
téléologie
temporalité
textualité
topologie
transcendance
univocité
vraisemblance
""")

ISM_BASES = items("""
absolut
abstractionn
agnostic
altru
anarch
anthropocentr
antiintellectual
antirational
autoritar
behavior
capital
classic
communautar
conceptual
constructiv
contextual
cultural
détermin
dogmat
dualisme
empir
essential
esthét
existential
fémin
formal
fonctionnal
historic
human
idéalisme
individual
institutionnal
interactionn
intuitionn
libéral
matérial
modern
monisme
moral
national
naturalisme
nihil
nominal
objectiv
organic
particular
positiv
pragmatisme
protectionn
rational
réductionn
relativ
romant
sceptic
scient
structural
subjectiv
symbol
technic
transhuman
universalisme
utilitar
vital
volontar
""")

ITY_BASES = items("""
abductiv
absolu
agentiv
allusiv
ambivalent
antagonique
apodictique
argumentatif
asymétrique
axiologique
canonique
catégoriel
cognitif
commensurable
conjectural
consubstantiel
contingent
déductif
dialogique
discursif
disjonctif
empirique
énonciatif
épistémique
équivoque
heuristique
hétérogène
holistique
immanent
inférentiel
interprétatif
irréductible
liminaire
métaphorique
méthodologique
mimétique
modal
narratif
normatif
ontologique
paradoxal
performative
phénoménal
poétique
polyphonique
pragmatique
problématique
référentiel
réflexif
sémiotique
spéculatif
symbolique
syncrétique
téléologique
textuel
transcendant
transversal
""")

BASE_VERBS = items("""
abstraire
allégoriser
arguer
axiologiser
baliser
circonscrire
conjecturer
contextualiser
corroborer
déconstruire
déduire
déplier
dériver
désamorcer
élucider
enchâsser
énoncer
entériner
essentialiser
étayer
exemplifier
extrapoler
historiciser
inférer
invalider
moduler
nuancer
objecter
objectiver
opacifier
paraphraser
postuler
préfigurer
présupposer
problématiser
réfuter
relativiser
répertorier
schématiser
spéculer
stipuler
subsumer
surdéterminer
thématiser
transcender
transposer
universaliser
""")

MORE_VERBS = items("""
abdiquer
abjurer
abolir
absoudre
abuser
accréditer
adjoindre
affermir
affleurer
agréger
ajourner
alléguer
amoindrir
annihiler
antéposer
appréhender
arguer
arrimer
asseoir
assujettir
atermoyer
attester
avérer
bafouer
circonvenir
coïncider
colliger
commuer
compulser
concéder
conjecturer
consolider
consteller
contrebalancer
contrecarrer
contrefaire
contrevenir
converger
corroborer
déceler
décréter
décrier
déduire
déférer
déjouer
délibérer
démettre
dénoter
déroger
déserter
destituer
détourner
discerner
disjoindre
disséquer
dissocier
élaguer
élider
élire
éluder
émanciper
enchâsser
enjoindre
entériner
entrelacer
entremêler
entrevoir
ériger
esquisser
étayer
exalter
exclure
exhorter
expliciter
fonder
infirmer
inhiber
instituer
invoquer
juxtaposer
légitimer
méconnaître
minorer
modérer
occulter
outrepasser
parachever
paraphraser
pondérer
postuler
préconiser
préfigurer
préjuger
prémunir
présumer
proférer
promouvoir
proscrire
réaffirmer
réaménager
réarticuler
recadrer
reconsidérer
redéployer
redéfinir
réexaminer
réhabiliter
réinscrire
réinterpréter
remédier
renvoyer
réorganiser
réorienter
répliquer
réprouver
résorber
revendiquer
sanctionner
scander
sonder
stigmatiser
subordonner
substituer
suggérer
supplanter
surinterpréter
surplomber
suspendre
transfigurer
transgresser
trancher
vaciller
acclimater
accréditer
advenir
affilier
affleurer
affubler
aliéner
aplanir
apostropher
arbitrer
articuler
asséner
ausculter
canaliser
caractériser
catégoriser
chapeauter
cohabiter
compenser
conceptualiser
concrétiser
confronter
conjuguer
contextualiser
cristalliser
déborder
déclasser
découler
décrédibiliser
dédramatiser
défaire
démystifier
dénaturaliser
dénouer
dépassionner
déraciner
désacraliser
désenclaver
désigner
désolidariser
diagnostiquer
diluer
distendre
diverger
ébranler
échantillonner
éclairer
écorner
élaborer
élargir
émietter
endosser
enraciner
entrecroiser
équilibrer
évacuer
évincer
façonner
fléchir
formuler
fragmenter
infléchir
interroger
irriguer
jalonner
matérialiser
médiatiser
mettre
modaliser
objectiver
orchestrer
polariser
problématiser
questionner
réactiver
réactualiser
recomposer
reconfigurer
reconduire
réévaluer
réifier
remodeler
renégocier
requalifier
resituer
singulariser
styliser
synthétiser
textualiser
typologiser
abstraire
acculturer
adhérer
adosser
affaiblir
affermir
agencer
agréger
aligner
altérer
amender
amplifier
annexer
anticiper
apprécier
apprivoiser
asseoir
assimiler
atténuer
avancer
basculer
biaiser
bousculer
cadrer
cerner
codifier
coïncider
colliger
commuer
comparer
complexifier
concéder
conditionner
consolider
constituer
contrecarrer
converger
décliner
décomposer
décontextualiser
dédoubler
déduire
déférer
déhiérarchiser
délimiter
dénoncer
dépolitiser
déprioriser
déréifier
désamorcer
déstabiliser
dévoiler
différencier
disqualifier
disséminer
dissoudre
documenter
échelonner
échafauder
élucider
émanciper
encadrer
entraîner
entretenir
esquiver
expliciter
fédérer
figer
hiérarchiser
historiciser
illustrer
inférer
instituer
intérioriser
intercaler
invalider
isoler
médiatiser
minorer
naturaliser
normaliser
neutraliser
opacifier
parcelliser
présupposer
redistribuer
réinscrire
répertorier
révéler
subvertir
surdéterminer
transposer
abominer
accabler
acquiescer
admonester
affabuler
affadir
affrioler
agonir
ajourer
alanguir
alléguer
amenuiser
anéantir
apostiller
arraisonner
avilir
blasonner
brocarder
circonvenir
coasser
conglomérer
conjecturer
conspuer
corroborer
daigner
décanter
déciller
déférer
déflorer
déjouer
démentir
déprécier
déroger
désavouer
disserter
dissimuler
disséquer
distancier
élaguer
élider
élucubrer
émarger
encenser
enjoindre
enliser
épancher
épiloguer
exacerber
excommunier
exhumer
expurger
extirper
fustiger
galvauder
gloser
haranguer
immiscer
incriminer
inoculer
instruire
invectiver
jauger
léser
louanger
méjuger
morigéner
objecter
obtempérer
palabrer
parapher
pérorer
préempter
préjuger
professer
ratiociner
récriminer
récuser
réprouver
ressasser
rétorquer
subodorer
tergiverser
vilipender
vitupérer
""")

VERB_PREFIXES = ["dé", "ré", "sur", "re"]
PREFIXABLE_VERBS = items("""
articuler
conceptualiser
contextualiser
définir
délimiter
déployer
déterminer
élaborer
inscrire
interpréter
modéliser
penser
politiser
qualifier
sémiotiser
structurer
symboliser
textualiser
théoriser
""")

BASE_ADJ = items("""
abductif
absolutiste
allégorique
allusif
ambivalent
analogique
anachronique
antinomique
apodictique
aporétique
argumentatif
axiologique
canonique
casuistique
catégoriel
cognitif
commensurable
conjectural
consubstantiel
contingent
déictique
délibératif
dialogique
discursif
disjonctif
doxique
empirique
énonciatif
épistémique
équivoque
exégétique
factuel
généalogique
heuristique
hétéronome
holistique
immanent
inférentiel
interprétatif
irréductible
liminaire
métaphorique
méthodologique
mimétique
modal
narratif
normatif
ontologique
paradigmatique
paratextuel
performatif
phénoménologique
poétique
polyphonique
pragmatique
problématique
proleptique
référentiel
réflexif
rhétorique
sémiotique
spéculatif
syllogistique
symbolique
syncrétique
téléologique
textuel
transcendantal
transversal
univoque
vraisemblable
""")

ADJ_PREFIXES = ["archi", "extra", "infra", "méta", "para", "post", "pré", "proto", "quasi", "supra", "trans"]

ADVERBS = items("""
abstraitement
abductivement
allégoriquement
ambivalemment
analogiquement
anachroniquement
antinomiquement
apodictiquement
aporétiquement
argumentativement
axiologiquement
canoniquement
catégoriellement
cognitivement
conjecturalement
consubstantiellement
contingemment
conceptuellement
déductivement
dialogiquement
discursivement
disjonctivement
doxiquement
empiriquement
énonciativement
épistémiquement
équivoquement
exégétiquement
factuellement
généalogiquement
heuristiquement
holistiquement
implicitement
immanemment
inférentiellement
interprétativement
méthodologiquement
mimétiquement
modalement
narrativement
normativement
ontologiquement
paradoxalement
performativement
phénoménologiquement
poétiquement
polyphoniquement
pragmatiquement
problématiquement
proleptiquement
référentiellement
réflexivement
rhétoriquement
sémiotiquement
spéculativement
syllogistiquement
symboliquement
syncrétiquement
téléologiquement
textuellement
transversalement
univoquement
vraisemblablement
abductivement
apodictiquement
catégoriquement
consubstantiellement
diachroniquement
dialogiquement
différentiellement
herméneutiquement
historiquement
liminairement
paradigmatiquement
prospectivement
référentiellement
synchroniquement
syntaxiquement
""")

PHRASES = items("""
à bien y regarder
à ce titre
à contre-courant
à des degrés divers
à la faveur de
à la lumière de
à rebours de
à supposer même que
à travers le prisme de
au demeurant
au gré de
au risque de simplifier
ce faisant
cela étant posé
compte tenu de
dans cette perspective
dans le droit fil de
dans le prolongement de
dans une logique de
de ce point de vue
de manière sous-jacente
en arrière-plan
en creux
en dernière analyse
en filigrane
en l'état
en miroir
en quelque sorte
en toute rigueur
il convient toutefois de
il n'en demeure pas moins que
mettre en abyme
mettre en tension
ne serait-ce que
par effet de contraste
pour ainsi dire
prendre la mesure de
revenir sur les présupposés
sous couvert de
sous l'angle de
sous réserve de
toutes choses égales par ailleurs
à condition de préciser
à des fins heuristiques
à la charnière de
à la différence de
à la faveur d'un déplacement
à la limite
à nouveaux frais
à proprement parler
à titre d'hypothèse
afin d'en dégager
aller au-delà de
apporter une nuance
au croisement de
au-delà du constat
ce qui revient à
cela engage
cela suppose
dans cette mesure
dans le champ de
dans le même ordre d'idées
dans les termes de
dans sa forme la plus
de façon plus générale
de manière corrélative
de prime abord
dès lors que
du même coup
du reste
en amont de l'analyse
en ce qu'il
en dernière instance
en d'autres termes
en fonction du cadre
en guise de synthèse
en l'absence de
en marge de
en partant de
en régime de
en retour
en vertu de
faire apparaître
faire droit à
faire jouer
faire tenir ensemble
il apparaît que
il convient alors
il faut entendre par
il n'est pas anodin que
il s'ensuit que
mettre à distance
mettre au jour
mettre en exergue
mettre en regard
mettre en relation
ne va pas sans
on peut soutenir que
par contraste avec
par-delà
partant de là
prendre appui sur
prendre pour objet
procéder par
quitte à
rapporter à
rendre intelligible
se donner pour tâche de
sous cet aspect
sous le rapport de
sous les dehors de
tendre à montrer
venir nuancer
à ce niveau d'analyse
à condition toutefois
à l'aune de
à rebours des évidences
à titre indicatif
au prix d'une simplification
au sens strict
ce qui invite à
cela ne saurait
dans l'économie du texte
dans l'ordre du discours
dans un second temps
de ce qui précède
de manière non triviale
d'un point de vue théorique
en articulant
en conséquence de quoi
en déplaçant la question
en dernière analyse
en termes plus précis
en vertu du principe
il importe de distinguer
il reste à savoir
il serait réducteur de
il y a lieu de
mettre en perspective
mettre sur le même plan
ne saurait se réduire à
par un effet de
prendre acte du fait que
prendre garde à
procéder à une distinction
ramener à
rendre compte du fait que
replacer dans son contexte
saisir la portée de
sous l'effet de
tout se passe comme si
venir à l'appui de
""")


def normalize_root(root: str) -> str:
    for suffix in ("e", "ique", "if", "ive", "al", "el", "iel", "ent", "ant"):
        if root.endswith(suffix):
            return root[: -len(suffix)]
    return root


def abstract_noun_from_adj(adj: str) -> str:
    if adj.endswith("if"):
        return f"{adj[:-2]}ivité"
    if adj.endswith("ive"):
        return f"{adj[:-3]}ivité"
    if adj.endswith("ique"):
        return f"{adj[:-4]}icité"
    if adj.endswith("oque"):
        return f"{adj[:-3]}cité"
    if adj.endswith("al"):
        return f"{adj[:-2]}alité"
    if adj.endswith("iel"):
        return f"{adj[:-3]}ialité"
    if adj.endswith("el"):
        return f"{adj[:-2]}alité"
    if adj.endswith("ent"):
        return f"{adj[:-3]}ence"
    if adj.endswith("ant"):
        return f"{adj[:-3]}ance"
    if adj.endswith("able"):
        return f"{adj[:-4]}abilité"
    if adj.endswith("ible"):
        return f"{adj[:-4]}ibilité"
    if adj.endswith("aire"):
        return f"{adj[:-4]}arité"
    if adj.endswith("ène"):
        return f"{adj[:-3]}énéité"
    if adj.endswith("ome"):
        return f"{adj[:-1]}ie"
    if adj.endswith("e"):
        return f"{adj[:-1]}ité"
    return f"{adj}ité"


def generated_pools() -> dict[str, list[str]]:
    isms = [root if root.endswith("isme") else f"{root}isme" for root in ISM_BASES]
    ities = []
    for root in ITY_BASES:
        ities.append(abstract_noun_from_adj(root))
    adj_variants = []
    for adj in BASE_ADJ:
        for prefix in ADJ_PREFIXES:
            if adj.startswith(prefix):
                continue
            adj_variants.append(f"{prefix}{adj}")
    abstract_nouns = [
        abstract_noun_from_adj(adj)
        for adj in [*BASE_ADJ, *adj_variants]
        if not adj.endswith("iste")
    ]
    verb_variants = []
    for verb in PREFIXABLE_VERBS:
        for prefix in VERB_PREFIXES:
            if not verb.startswith(prefix):
                verb_variants.append(f"{prefix}{verb}")
    return {
        "nouns": [*BASE_NOUNS, *isms, *ities, *abstract_nouns],
        "verbs": [*BASE_VERBS, *MORE_VERBS, *verb_variants],
        "adj": [*BASE_ADJ, *adj_variants],
        "adv": ADVERBS,
        "phrases": PHRASES,
    }


def placeholder_word(lemma: str, pos: str) -> dict[str, str]:
    return {
        "lemma": lemma,
        "ipa": PH,
        "pos": pos,
        "translation_en": PH,
        "example": PH,
        "example_en": PH,
        "tag": PH,
    }


def load_existing_lemmas() -> set[str]:
    existing: set[str] = set()
    with CSV_PATH.open("r", encoding="utf-8", newline="") as f:
        reader = csv.reader(f)
        next(reader)
        for row in reader:
            if len(row) >= 3:
                if row[0] == "c1" and row[1] in TARGET_GROUP_IDS:
                    continue
                existing.add(row[2])
    return existing


def build_candidate_order(key: str, group_index: int) -> list[str]:
    pool = generated_pools()[key]
    step = {"nouns": 37, "verbs": 19, "adj": 43, "adv": 5, "phrases": 7}[key]
    start = (group_index * step) % len(pool)
    return [*pool[start:], *pool[:start]]


def select_groups() -> tuple[list[dict[str, object]], list[str]]:
    existing = load_existing_lemmas()
    seen: set[str] = set()
    errors: list[str] = []
    selected_groups: list[dict[str, object]] = []

    for index, (group_id, title, focus) in enumerate(GROUPS):
        group: dict[str, object] = {
            "id": group_id,
            "title": title,
            "focus": focus,
            "nouns": [],
            "verbs": [],
            "adj": [],
            "adv": [],
            "phrases": [],
        }
        for key, expected in COUNTS.items():
            for lemma in build_candidate_order(key, index):
                if lemma in existing or lemma in seen:
                    continue
                if key != "phrases" and (" " in lemma or "'" in lemma or "’" in lemma):
                    continue
                group[key].append(lemma)
                seen.add(lemma)
                if len(group[key]) == expected:
                    break
            if len(group[key]) != expected:
                errors.append(f"{group_id}/{key}: selected {len(group[key])}, expected {expected}")
        total = sum(len(group[key]) for key in COUNTS)
        if total != 100:
            errors.append(f"{group_id}: total {total}, expected 100")
        if total and len(group["phrases"]) / total >= 0.15:
            errors.append(f"{group_id}: phrase ratio is not below 15%")
        selected_groups.append(group)

    return selected_groups, errors


def build_group_json(group: dict[str, object]) -> dict[str, object]:
    words: list[dict[str, str]] = []
    for key, pos in POS_ORDER:
        for lemma in group[key]:
            words.append(placeholder_word(lemma, pos))
    return {
        "id": group["id"],
        "title": group["title"],
        "focus": f"{group['focus']} Translation, example, example_en, IPA and tag are placeholders — fill them in group by group.",
        "words": words,
    }


def main() -> int:
    selected_groups, errors = select_groups()
    if errors:
        print("VALIDATION ERRORS:")
        for error in errors:
            print(f"  {error}")
        return 1

    for group in selected_groups:
        path = C1_DIR / f"{group['id']}.json"
        path.write_text(
            json.dumps(build_group_json(group), ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        print(f"Wrote {path}")

    index_path = C1_DIR / "index.json"
    index = json.loads(index_path.read_text(encoding="utf-8"))
    existing_ids = {group["id"] for group in index["groups"]}
    for group in selected_groups:
        if group["id"] not in existing_ids:
            index["groups"].append(
                {
                    "id": group["id"],
                    "title": group["title"],
                    "focus": group["focus"],
                    "count": 100,
                }
            )
    index["focus"] = "2000 C1 French lemmas across abstraction, academic reasoning, humanities, philosophy, rhetoric, ethics and advanced discourse. Translation, example and example_en are placeholders for now."
    index_path.write_text(json.dumps(index, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Updated {index_path}")

    rows: list[tuple[str, str, str]] = []
    for level_dir in sorted((DATA_DIR / "levels").iterdir()):
        if not level_dir.is_dir():
            continue
        for group_path in sorted(level_dir.glob("group-*.json"), key=group_sort_key):
            group = json.loads(group_path.read_text(encoding="utf-8"))
            for word in group.get("words") or []:
                rows.append((level_dir.name, group["id"], word["lemma"]))

    seen_csv: dict[str, tuple[str, str]] = {}
    for level, group_id, lemma in rows:
        if lemma in seen_csv:
            prev_level, prev_group = seen_csv[lemma]
            raise SystemExit(
                f"DUPLICATE lemma in rebuilt vocab-master.csv: {lemma} in "
                f"{level}/{group_id} and {prev_level}/{prev_group}"
            )
        seen_csv[lemma] = (level, group_id)

    with CSV_PATH.open("w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f, lineterminator="\n")
        writer.writerow(["level", "group", "lemma"])
        writer.writerows(rows)
    print(f"Rebuilt {CSV_PATH} with {len(rows)} unique lemmas")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
