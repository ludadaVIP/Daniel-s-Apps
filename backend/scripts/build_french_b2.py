"""
Build French Vocab B2 groups 2..20.

This pass adds placeholder learning fields only. The script validates new
lemmas against vocab-master.csv and rebuilds the master CSV from JSON.
"""

from __future__ import annotations

import csv
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = ROOT / "backend" / "data" / "FrenchVocab"
B2_DIR = DATA_DIR / "levels" / "b2"
CSV_PATH = DATA_DIR / "vocab-master.csv"
PH = "placeholder"

COUNTS = {"nouns": 38, "verbs": 26, "adj": 25, "adv": 3, "phrases": 8}
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
    ("group-2", "Group 2 · Débat public et institutions", "B2 vocabulary for public debate, institutions, lawmaking, civic tension and public decision-making."),
    ("group-3", "Group 3 · Économie et mutations", "B2 vocabulary for markets, labour, budgets, inequality, trade and economic change."),
    ("group-4", "Group 4 · Climat et biodiversité", "B2 vocabulary for climate pressure, ecosystems, resources, agriculture and environmental policy."),
    ("group-5", "Group 5 · Technologie et données", "B2 vocabulary for algorithms, digital systems, cybersecurity, platforms and data use."),
    ("group-6", "Group 6 · Recherche et méthode", "B2 vocabulary for evidence, research design, uncertainty, experiments and scientific explanation."),
    ("group-7", "Group 7 · Ville et logement", "B2 vocabulary for urban planning, mobility, housing pressure, neighbourhoods and public space."),
    ("group-8", "Group 8 · Santé publique", "B2 vocabulary for public health, prevention, care systems, risk and wellbeing policy."),
    ("group-9", "Group 9 · Éducation et transmission", "B2 vocabulary for education systems, access, assessment, training and knowledge transfer."),
    ("group-10", "Group 10 · Médias et opinion", "B2 vocabulary for journalism, framing, misinformation, credibility and public discourse."),
    ("group-11", "Group 11 · Culture et patrimoine", "B2 vocabulary for culture, heritage, creation, interpretation and public access."),
    ("group-12", "Group 12 · Travail et organisations", "B2 vocabulary for management, cooperation, restructuring, productivity and workplace change."),
    ("group-13", "Group 13 · Justice et conflits", "B2 vocabulary for courts, rights, sanctions, conflict, responsibility and legal reasoning."),
    ("group-14", "Group 14 · Relations internationales", "B2 vocabulary for diplomacy, migration, security, cooperation and global challenges."),
    ("group-15", "Group 15 · Psychologie et société", "B2 vocabulary for identity, perception, behaviour, emotions and social pressure."),
    ("group-16", "Group 16 · Sciences et innovation", "B2 vocabulary for innovation, models, engineering, discovery, limits and applications."),
    ("group-17", "Group 17 · Environnement économique", "B2 vocabulary for business models, regulation, consumption, incentives and sustainability."),
    ("group-18", "Group 18 · Argumentation avancée", "B2 vocabulary for qualifying claims, rebuttal, evidence, assumptions and structured argument."),
    ("group-19", "Group 19 · Administration complexe", "B2 vocabulary for procedures, compliance, documentation, auditing and institutional processes."),
    ("group-20", "Group 20 · Connecteurs et expressions B2", "B2 vocabulary for idiomatic transitions, stance, precision, concession and discourse flow."),
]


LEXICON = {
    "nouns": items("""
abaissement
abandon
abattement
aberration
abolition
aboutissement
abrogation
abstention
abstraction
accaparement
accélérateur
accessibilité
accréditation
accroissement
acculturation
accusation
acidification
acquisition
actionnaire
adaptabilité
adéquation
adhérent
administrateur
administratrice
affectation
affrontement
agencement
agglomération
agrandissement
agrément
alerte
algorithme
allocation
allongement
altération
ambiguïté
amendement
amortissement
aménagement
analogie
ancrage
anomalie
anticipation
aparté
appelant
appellation
approvisionnement
arbitrage
archivage
articulation
assemblage
assignation
assouplissement
asymétrie
atténuation
attribution
audit
audition
authenticité
autonomisation
avertisseur
balise
barème
basculement
bénéficiaire
billetterie
biodiversité
biomasse
bloc
boycott
branche
brevet
bureaucratie
cadre
cadrage
calibrage
canal
capitalisation
cartographie
causalité
censure
centralisation
certification
cessation
chiffrage
chronologie
circonscription
clarification
clivage
codage
coexistence
cofinancement
collusion
commande
commercialisation
commissaire
communauté
comparabilité
compatibilité
compétitivité
complexification
concession
concordance
concurrence
conditionnement
configuration
conformité
conjoncture
consentement
consolidation
constitution
consultation
contradiction
contrepartie
controverse
convention
coopérative
corpus
corrélation
couverture
crédibilité
cryptage
décentralisation
décideur
décideuse
déclenchement
déclin
décodage
décomposition
décret
défaillance
défrichement
dégagement
délibération
délocalisation
dématérialisation
démocratisation
dénonciation
densification
déontologie
dépistage
dépollution
dérèglement
dérive
désamorçage
désengagement
déséquilibre
désindustrialisation
désinformation
désorganisation
déstabilisation
détérioration
déviation
différenciation
diffusion
diplomatie
discontinuité
dispositif
distorsion
divergence
diversification
durabilité
écart
échantillonnage
échéance
écosystème
éligibilité
émancipation
émission
empreinte
encadrement
enchevêtrement
enclave
engorgement
enracinement
enseignement
entité
entrepreneuriat
épuisement
équité
érosion
escalade
estimation
étalement
éthique
évaluation
exclusion
exécutif
exonération
expérimentation
expertise
externalisation
extrapolation
fiabilité
filtrage
financiarisation
flexibilité
fluctuation
fragilisation
fracture
frein
généralisation
gentrification
géolocalisation
gouvernance
grille
hiérarchisation
homologation
indemnisation
indicateur
inertie
infrastructure
ingénierie
ingérence
initiative
injonction
insertion
instabilité
institutionnalisation
instrumentalisation
interdépendance
interopérabilité
intersection
intervenant
intimidation
jurisprudence
labellisation
législateur
législation
légitimité
levier
libéralisation
logistique
longévité
maillage
marge
marginalisation
médiation
méfiance
métropole
microplastique
modélisation
monétisation
monopole
moratoire
mutation
neutralité
normalisation
numérisation
obsolescence
optimisation
ordonnance
orientation
partenariat
pathologie
pénurie
pérennité
personnalisation
polarisation
polluant
portabilité
précarité
préconisation
prélèvement
présomption
prestation
prévalence
prévention
privatisation
procédure
protocole
quantification
quota
ratification
réaffectation
réaménagement
récession
recommandation
reconversion
redevance
redistribution
réévaluation
référendum
réforme
refonte
réhabilitation
réinsertion
relance
relocalisation
remaniement
rentabilité
réorientation
représentativité
résilience
responsabilisation
restructuration
revendication
scénario
scrutin
sectorisation
ségrégation
sensibilisation
souveraineté
standardisation
stéréotype
subvention
surexploitation
surmortalité
surveillance
tarification
territoire
traçabilité
tractation
transparence
urbanisation
usager
validation
variable
verrou
vulnérabilité
zonage
abaissement
accélération
accompagnement
accomplissement
activation
actualisation
adaptation
administration
admissibilité
affiliation
agrégation
allocation
application
appropriation
attestation
automatisation
autorisation
capteur
cohabitation
concertation
concrétisation
confrontation
contextualisation
contractualisation
coordination
décryptage
dédommagement
déploiement
désactivation
diagnostic
éditorialisation
électrification
encodage
enquêteur
exigibilité
facilitateur
facilitatrice
fiscalité
fluidité
formalisation
fragmentation
harmonisation
interconnexion
inventaire
médiatisation
mensualisation
modernisation
modérateur
modératrice
objectivation
opération
opérationnalisation
optimiseur
parrainage
plafonnement
préfiguration
présélection
professionnalisation
réactualisation
réattribution
reclassement
reconfiguration
reconsidération
redirection
réexamen
réinscription
renégociation
réorganisation
répertoire
repositionnement
sécurisation
simulation
subdivision
télétravail
temporalité
transversalité
vulgarisation
"""),
    "verbs": items("""
abaisser
abolir
absorber
accaparer
accélérer
accréditer
accroître
adapter
administrer
affecter
agencer
agrandir
allouer
amortir
aménager
ancrer
anticiper
appliquer
approuver
arbitrer
archiver
articuler
assigner
assouplir
atténuer
attribuer
auditer
authentifier
automatiser
autoriser
baliser
basculer
breveter
cadrer
calibrer
canaliser
capitaliser
cartographier
centraliser
certifier
chiffrer
circonscrire
clarifier
coder
coexister
cofinancer
commercialiser
compenser
configurer
consolider
contextualiser
contractualiser
convenir
coopérer
corréler
crypter
débloquer
décentraliser
décoder
décomposer
décréter
défricher
délibérer
délocaliser
dématérialiser
démocratiser
dénoncer
densifier
dépister
dépolluer
dérégler
désamorcer
désengager
désindustrialiser
désinformer
désorganiser
déstabiliser
détériorer
dévier
différencier
diffuser
diversifier
échantillonner
échelonner
émanciper
émettre
encadrer
engorger
enraciner
épuiser
évaluer
exclure
exonérer
expérimenter
externaliser
extrapoler
fiabiliser
filtrer
financiariser
fragiliser
freiner
généraliser
géolocaliser
hiérarchiser
homologuer
indemniser
insérer
institutionnaliser
instrumentaliser
interconnecter
intimider
labelliser
légiférer
légitimer
libéraliser
marginaliser
médiatiser
modéliser
monétiser
normaliser
numériser
objectiver
optimiser
orienter
pérenniser
personnaliser
plafonner
polariser
préconiser
prélever
privatiser
quantifier
ratifier
réaffecter
réaménager
réactualiser
reconfigurer
reconvertir
redistribuer
réévaluer
réformer
refondre
réhabiliter
réinsérer
relancer
relocaliser
remobiliser
rentabiliser
réorienter
responsabiliser
restreindre
restructurer
revendiquer
sectoriser
ségréger
standardiser
subventionner
tarifer
territorialiser
tracer
urbaniser
valider
verrouiller
vulgariser
zoner
abroger
acquitter
actualiser
affilier
agréger
alerter
alléger
approprier
attester
capter
cohabiter
concerter
concrétiser
confronter
coordonner
dédommager
déployer
désactiver
diagnostiquer
éditorialiser
électrifier
encoder
exiger
faciliter
fluidifier
formaliser
fragmenter
harmoniser
inventorier
mensualiser
modérer
opérationnaliser
parrainer
préfigurer
présélectionner
professionnaliser
reclasser
réexaminer
réinscrire
renégocier
répertorier
repositionner
sécuriser
simuler
subdiviser
télétravailler
transversaliser
abriter
accentuer
acheminer
adosser
affranchir
alimenter
amplifier
amender
amorcer
analyser
appuyer
arrondir
aspirer
attacher
avertir
blâmer
border
briser
censurer
cerner
cesser
coïncider
collecter
conditionner
consacrer
contenir
contourner
creuser
déclencher
délaisser
délivrer
dénaturer
dépasser
déplacer
déresponsabiliser
détourner
documenter
durcir
enchaîner
endommager
entériner
entreposer
énumérer
étaler
favoriser
fonder
fusionner
héberger
inciter
indexer
infiltrer
interagir
inventer
mailler
mandater
mesurer
mutualiser
nommer
notifier
ordonner
piloter
ponctuer
prédéfinir
préserver
programmer
promulguer
proportionner
réajuster
réanimer
réattribuer
recalculer
reconnecter
rediriger
rééquilibrer
réinventer
relier
renforcer
renseigner
réorganiser
réparer
repenser
reproduire
sélectionner
séquencer
soutenir
structurer
symboliser
témoigner
tester
trier
uniformiser
unifier
visualiser
"""),
    "adj": items("""
abordable
abstrait
accessible
accrédité
adaptable
administratif
algorithmique
alternatif
ambigu
amendable
analytique
applicable
arbitraire
asymétrique
automatisé
autonome
bancaire
biodégradable
budgétaire
bureaucratique
centralisé
certifié
chronologique
civique
climatique
coercitif
cohérent
collaboratif
comparable
compatible
compétitif
conditionnel
conforme
conjoncturel
constitutionnel
contextuel
controversé
conventionnel
coopératif
corrélé
crédible
crypté
décarboné
décentralisé
déclaratif
déductible
délibératif
dématérialisé
démocratique
dense
dérégulé
déséquilibré
différencié
durable
écologique
éligible
émancipateur
empirique
énergétique
éthique
évaluable
évolutif
expérimental
exploitable
fiable
financier
fiscal
fluctuant
fragile
géopolitique
globalisé
hiérarchique
homologué
illégitime
institutionnel
interactif
interconnecté
interdépendant
juridique
labellisé
législatif
légitime
majoritaire
marginal
méthodologique
migratoire
modulaire
multilatéral
numérique
opérationnel
participatif
pérenne
précaire
préventif
probatoire
quantifiable
renouvelable
représentatif
résilient
restrictif
sectoriel
sélectif
souverain
standardisé
structurel
subventionné
systémique
transfrontalier
transversal
traçable
urbain
validé
vulnérable
zonal
abrogatoire
accéléré
agrégé
amortissable
cartographique
comparatif
compensatoire
consultatif
contractuel
déontologique
diagnostique
éditorial
exonéré
fragmenté
informatif
logistique
monétaire
normatif
privatisé
procédural
redistributif
réglementaire
statistique
territorial
"""),
    "adv": items("""
abstraitement
administrativement
algorithmiquement
alternativement
analytiquement
arbitrairement
automatiquement
budgétairement
bureaucratiquement
chronologiquement
civiquement
climatiquement
collectivement
comparativement
concrètement
constitutionnellement
contextuellement
conventionnellement
durablement
écologiquement
empiriquement
énergétiquement
éthiquement
expérimentalement
financièrement
fiscalement
géopolitiquement
globalement
hiérarchiquement
institutionnellement
juridiquement
légalement
légitimement
majoritairement
méthodologiquement
numériquement
opérationnellement
politiquement
préventivement
procéduralement
progressivement
quantitativement
réglementairement
scientifiquement
sectoriellement
statistiquement
structurellement
systématiquement
territorialement
transversalement
administrativement
approximativement
comparativement
durablement
économiquement
explicitement
implicitement
institutionnellement
matériellement
normativement
partiellement
proportionnellement
relativement
respectivement
simultanément
stratégiquement
temporairement
théoriquement
"""),
    "phrases": items("""
à cet égard
à court terme
à long terme
à défaut de
à grande échelle
à juste titre
à la lumière de
à l'échelle nationale
à l'échelle mondiale
à l'inverse
à moyen terme
à première vue
à titre préventif
afin de mieux
aller dans le sens de
apporter un éclairage
au cas par cas
au cœur de
au détriment de
au fil du temps
au regard de
avoir pour conséquence
avoir recours à
avoir trait à
ce faisant
cela revient à
dans ce cadre
dans cette optique
dans la pratique
dans les faits
dans une certaine mesure
dès lors
donner lieu à
du point de vue de
en amont
en aval
en cas de besoin
en ce sens
en dernier ressort
en matière de
en principe
en pratique
en raison de
en tenant compte de
être amené à
être au cœur de
être en mesure de
être en voie de
être soumis à
faire abstraction de
faire émerger
faire l'objet de
faire obstacle à
faire ressortir
faute de quoi
il convient de
il en découle
il ressort que
mettre à profit
mettre au jour
mettre en œuvre
mettre l'accent sur
mettre un terme à
ne serait-ce que
par conséquent
par souci de
poser la question de
pour autant
prendre acte de
prendre appui sur
prendre en compte
prendre le parti de
prendre pour acquis
remettre en cause
rendre compte de
sans pour autant
se traduire par
sous réserve de
tenir compte de
tenir lieu de
"""),
}


EXTRA_PHRASES = items("""
à double tranchant
à en juger par
à tous égards
au-delà de
au nom de
compte tenu de
d'un point de vue
dans le prolongement de
de ce fait
de manière générale
en arrière-plan
en ce qui concerne
en contrepartie
en dépit de
en fonction de
en perspective
en quelque sorte
en termes de
en vue de
faire valoir
il s'agit de
mettre en évidence
mettre en lumière
mettre en perspective
ne pas négliger
porter atteinte à
prendre du recul
quant à
remettre à plat
reposer sur
sous prétexte de
""")

ISER_VERBS = items("""
absolutiser
académiser
actualiser
anonymiser
autonomiser
banaliser
budgétiser
bureaucratiser
capitaliser
catégoriser
centraliser
collectiviser
coloniser
commercialiser
communautariser
conceptualiser
contextualiser
contractualiser
criminaliser
culpabiliser
décarboniser
décentraliser
dédramatiser
défavoriser
délocaliser
dématérialiser
démilitariser
démocratiser
démobiliser
démoraliser
démystifier
dépolitiser
déradicaliser
dérégionaliser
désacraliser
déscolariser
déshumaniser
désindustrialiser
désorganiser
déstabiliser
digitaliser
discrétiser
dramatiser
dynamiser
éditorialiser
égaliser
ethniciser
européaniser
externaliser
féminiser
financiariser
flexibiliser
fluidiser
focaliser
formaliser
fragiliser
généraliser
globaliser
gratifier
harmoniser
hiérarchiser
homogénéiser
humaniser
idéaliser
immobiliser
immuniser
individualiser
industrialiser
informatiser
institutionnaliser
instrumentaliser
intérioriser
internationaliser
judiciariser
labelliser
laïciser
libéraliser
localiser
marginaliser
marchandiser
matérialiser
médiatiser
mémoriser
militariser
minimiser
moderniser
monétiser
moraliser
mutualiser
nationaliser
neutraliser
normaliser
numériser
optimiser
patrimonialiser
pérenniser
personnaliser
polariser
politiser
prioriser
privatiser
professionnaliser
problématiser
radicaliser
rationaliser
réactualiser
réaménager
réanalyser
récontextualiser
rééquilibrer
réhabiliter
réinsérer
réinterpréter
réorganiser
réorienter
repositionner
responsabiliser
restructurer
robotiser
sanctuariser
sécuriser
sensibiliser
socialiser
spécialiser
standardiser
stabiliser
territorialiser
théoriser
uniformiser
urbaniser
valoriser
verbaliser
virtualiser
visualiser
vulgariser
""")

IFIER_VERBS = items("""
amplifier
authentifier
bonifier
certifier
clarifier
classifier
codifier
complexifier
densifier
diversifier
falsifier
fluidifier
fortifier
humidifier
identifier
intensifier
justifier
modifier
notifier
objectifier
pacifier
planifier
quantifier
ratifier
rectifier
requalifier
rigidifier
simplifier
solidifier
spécifier
typifier
unifier
vérifier
""")


def repeat_prefix(verb: str) -> str:
    return ("ré" if verb[0] in "aeiouéèêàâîïôùûh" else "re") + verb


def over_prefix(verb: str) -> str:
    return ("sur" if verb[0] not in "aeiouéèêàâîïôùûh" else "sur") + verb


MORE_ISER_VERBS = items("""
acclimatiser
alcooliser
aseptiser
atomiser
automatiser
balcaniser
canaliser
caractériser
carboniser
cautériser
civiliser
climatiser
coloriser
conscientiser
cristalliser
diaboliser
dogmatiser
électoraliser
énergiser
essentialiser
esthétiser
fossiliser
franciser
historiciser
hybridiser
hypnotiser
idéologiser
lexicaliser
mondialiser
muséifier
naturaliser
nucléariser
pasteuriser
pénaliser
poétiser
psychologiser
ritualiser
satelliser
schématiser
séculariser
sédentariser
stigmatiser
styliser
synchroniser
synthétiser
systématiser
technocratiser
techniciser
temporaliser
théâtraliser
thématiser
trivialiser
universaliser
victimiser
viraliser
visibiliser
volatiliser
alphabétiser
angliciser
arabiser
aseptiser
catastrophiser
christianiser
décoloniser
déculpabiliser
défiscaliser
démarchandiser
dénationaliser
dépersonnaliser
dépsychiatriser
désinstitutionnaliser
désocialiser
folkloriser
galvaniser
géolocaliser
hospitaliser
optimaliser
pluraliser
précariser
provincialiser
racialiser
réinitialiser
rescolariser
romantiser
sectoriser
singulariser
spatialiser
subjectiviser
substantialiser
symboliser
techniciser
totaliser
transnationaliser
zombifier
apolitiser
aristocratiser
artificialiser
bestialiser
brutaliser
cartelliser
chroniciser
commercialiser
corporatiser
culturaliser
décentraliser
décomplexifier
démédicaliser
dénaturaliser
désexualiser
désynchroniser
environnementaliser
essentialiser
fictionnaliser
finaliser
fonctionnaliser
géométriser
grammaticaliser
imperméabiliser
juridiciser
libaniser
linéariser
mathématiser
médicaliser
métaphoriser
minéraliser
modaliser
modéliser
moléculariser
monopoliser
musicaliser
orientaliser
pathologiser
populariser
privatiser
psychologiser
racialiser
relativiser
romaniser
sacraliser
scénariser
semi-industrialiser
sémantiser
spectaculariser
spiritualiser
subjectiviser
technologiser
textualiser
urbaniser
viraliser
vocaliser
barbariser
bipolariser
cartelliser
civilianiser
décriminaliser
déjudiciariser
démobiliser
déminéraliser
dénormaliser
dénucléariser
déprivatiser
déprofessionnaliser
désécuriser
désensibiliser
désétatiser
désymboliser
déterritorialiser
doctrinariser
fiscaliser
géopolitiser
intellectualiser
islamiser
médiévaliser
morphologiser
néolibéraliser
patrimonialiser
philosophiser
prolétariser
resocialiser
ritualiser
satelliser
sémiotiser
spectraliser
statistiser
suburbaniser
techniciser
ubériser
ultralibéraliser
vectoriser
verticaliser
animaliser
autocratiser
bétoniser
climatiser
débureaucratiser
déciviliser
décommunautariser
décomplexifier
dédiaboliser
déhiérarchiser
désidéologiser
détechniciser
éditorialiser
familiariser
géographiser
historiciser
monopoliser
néocoloniser
oligarchiser
anthropiser
privatiser
resémantiser
techniciser
théologiser
typologiser
catégorialiser
documentariser
expérimentaliser
relationnaliser
sectorialiser
alcaliniser
""")

MORE_IFIER_VERBS = items("""
acidifier
calcifier
décalcifier
déclassifier
décomplexifier
démystifier
disqualifier
édifier
électrifier
gélifier
glorifier
massifier
momifier
mythifier
plastifier
préclassifier
préqualifier
reclassifier
réidentifier
replanifier
sanctifier
stratifier
tarifier
émulsifier
liquéfier
ossifier
purifier
réifier
vitrifier
vivifier
""")

MANUAL_VERBS = items("""
abdiquer
accoster
acheminer
acquiescer
affaiblir
affluer
affoler
agiter
aliéner
amoindrir
annexer
apposer
appréhender
armer
assujettir
atermoyer
avaler
bafouer
bannir
biaiser
blesser
booster
boycotter
canaliser
capituler
caricaturer
chapeauter
circuler
coacher
coïncider
comptabiliser
confectionner
conjuguer
consolider
contempler
convertir
corroborer
court-circuiter
courtiser
cristalliser
déborder
décaler
décortiquer
décrédibiliser
défaire
défiscaliser
dégager
délivrer
démarrer
démanteler
démarquer
dénaturer
dépassionner
déprioriser
déresponsabiliser
désigner
désolidariser
desservir
détourner
dévaloriser
différencier
discréditer
émietter
enclencher
endosser
enrayer
entamer
entériner
entreposer
équiper
ériger
esquiver
étayer
étouffer
évincer
exacerber
exhorter
expulser
fédérer
flécher
fructifier
fusionner
geler
généraliser
gouverner
graviter
imputer
incarner
inciter
infléchir
innover
inspirer
inventorier
légender
mandater
monopoliser
nuire
occulter
outiller
parachever
paralyser
patenter
pérenniser
plaider
pondérer
préfinancer
préfigurer
prélever
préprogrammer
proroger
réaffirmer
réarmer
rebondir
recadrer
recalculer
recenser
recomposer
reconduire
reconstruire
redécouper
redessiner
redéployer
redéfinir
redonner
réécrire
réembaucher
réengager
réformer
réinventer
réinvestir
relativiser
remédier
remodeler
renflouer
renverser
répliquer
revaloriser
sanctionner
segmenter
sélectionner
séquencer
siéger
soumissionner
souscrire
spéculer
stigmatiser
subordonner
substituer
surinterpréter
surmédiatiser
surreprésenter
survaloriser
temporiser
transcoder
transcrire
transiter
uniformiser
viabiliser
""")

PREFIXABLE_VERBS = items("""
actualiser
anonymiser
autonomiser
budgétiser
centraliser
commercialiser
conceptualiser
contextualiser
contractualiser
décarboniser
décentraliser
dématérialiser
démocratiser
digitaliser
éditorialiser
financiariser
formaliser
fragiliser
généraliser
globaliser
harmoniser
hiérarchiser
individualiser
industrialiser
informatiser
institutionnaliser
internationaliser
localiser
médiatiser
moderniser
monétiser
normaliser
numériser
optimiser
personnaliser
politiser
privatiser
professionnaliser
radicaliser
rationaliser
responsabiliser
sécuriser
sensibiliser
socialiser
standardiser
territorialiser
urbaniser
valoriser
visualiser
vulgariser
automatiser
caractériser
banaliser
bureaucratiser
capitaliser
catégoriser
collectiviser
criminaliser
culpabiliser
dédramatiser
délocaliser
dépolitiser
déscolariser
déshumaniser
désindustrialiser
désorganiser
déstabiliser
dynamiser
européaniser
externaliser
féminiser
flexibiliser
fluidiser
focaliser
homogénéiser
humaniser
idéaliser
immobiliser
immuniser
instrumentaliser
judiciariser
laïciser
libéraliser
marchandiser
matérialiser
militariser
minimiser
moraliser
mutualiser
nationaliser
neutraliser
patrimonialiser
problématiser
robotiser
spécialiser
théoriser
virtualiser
ritualiser
stigmatiser
systématiser
temporaliser
universaliser
visibiliser
""")

EXTRA_SINGLE = {
    "nouns": items("""
absolutisme
académisation
actualisation
anonymisation
autonomisation
banalisation
budgétisation
bureaucratisation
catégorisation
collectivisation
colonisation
communautarisation
conceptualisation
criminalisation
culpabilisation
décarbonisation
dédramatisation
défavorisation
démilitarisation
démobilisation
démoralisation
démystification
dépolitisation
déradicalisation
dérégionalisation
désacralisation
déscolarisation
déshumanisation
discrétisation
division
dramatisation
dynamisation
ethnicisation
européanisation
féminisation
flexibilisation
focalisation
gratification
humanisation
idéalisation
immobilisation
immunisation
individualisation
industrialisation
informatisation
intériorisation
internationalisation
judiciarisation
laïcisation
matérialisation
mémorisation
militarisation
minimisation
moralisation
nationalisation
patrimonialisation
politisation
priorisation
problématisation
radicalisation
rationalisation
réanalyse
réinterprétation
robotisation
sanctuarisation
spécialisation
théorisation
virtualisation
amplification
authentification
bonification
classification
codification
complexification
falsification
fortification
humidification
objectification
pacification
planification
rectification
rigidification
spécification
typification
appauvrissement
approfondissement
arrondissement
assainissement
asservissement
assèchement
assouvissement
basculement
blanchiment
bouleversement
cloisonnement
durcissement
élargissement
enchevêtrement
endettement
engagement
enrichissement
épaississement
éparpillement
étouffement
fractionnement
glissement
jaillissement
morcellement
ralentissement
rétrécissement
vieillissement
aboutissage
affichage
aiguillage
arrimage
balisage
bornage
brassage
calibrage
chiffrage
ciblage
cloisonnage
découpage
décryptage
dépannage
déploiement
dézonage
encodage
étalonnage
jalonnage
maillage
nettoyage
paramétrage
pilotage
plafonnage
recadrage
recyclage
repérage
sondage
stockage
traçage
tutorat
doctorant
chercheuse
évaluateur
évaluatrice
médiateur
médiatrice
régulateur
régulatrice
coordinateur
coordinatrice
innovateur
innovatrice
modélisateur
modélisatrice
programmateur
programmatrice
normalisateur
normalisatrice
"""),
    "verbs": items("""
abriter
acquérir
adosser
affranchir
aiguiller
alimenter
amender
amorcer
appauvrir
approfondir
arrimer
assainir
assécher
assouvir
baliser
blanchir
borner
brasser
cibler
cloisonner
découper
décrypter
dédommager
défavoriser
dépanner
dériver
dézoner
endetter
enrichir
épaissir
éparpiller
étalonner
étouffer
fractionner
glisser
jalonner
mailler
morceler
paramétrer
plafonner
rétrécir
scinder
sonder
stocker
tutorer
vieillir
"""),
    "adj": items("""
absolutisé
académisé
actualisé
anonymisé
autonomisé
banalisé
budgétisé
bureaucratisé
catégorisé
collectivisé
colonisé
communautarisé
conceptualisé
criminalisé
culpabilisé
décarbonisé
dédramatisé
défavorisé
démilitarisé
démobilisé
démoralisé
démystifié
dépolitisé
déradicalisé
désacralisé
déscolarisé
déshumanisé
digitalisé
dynamisé
éditorialisé
ethnicisé
européanisé
féminisé
flexibilisé
focalisé
formalisé
fragilisé
globalisé
harmonisé
hiérarchisé
homogénéisé
humanisé
idéalisé
immobilisé
immunisé
individualisé
industrialisé
informatisé
instrumentalisé
intériorisé
internationalisé
judiciarisé
laïcisé
libéralisé
localisé
marginalisé
marchandisé
matérialisé
médiatisé
mémorisé
militarisé
minimisé
modernisé
monétisé
moralisé
mutualisé
nationalisé
neutralisé
normalisé
optimisé
patrimonialisé
polarisé
politisé
priorisé
privatisé
professionnalisé
problématisé
radicalisé
rationalisé
réactualisé
réanalysé
récontextualisé
rééquilibré
réhabilité
réinséré
réinterprété
réorganisé
réorienté
repositionné
responsabilisé
robotisé
sanctuarisé
spécialisé
territorialisé
théorisé
virtualisé
amplifié
authentifié
bonifié
classifié
codifié
complexifié
densifié
diversifié
falsifié
fluidifié
fortifié
humidifié
identifié
intensifié
justifié
notifié
objectifié
pacifié
planifié
quantifié
ratifié
rectifié
rigidifié
spécifié
typifié
"""),
    "adv": items("""
absolument
académiquement
activement
anonymement
budgétairement
chronologiquement
comparativement
conjointement
constitutionnellement
contractuellement
démocratiquement
diagnostiquement
éditorialement
empiriquement
explicitement
implicitement
individuellement
internationalement
localement
majoritairement
minoritairement
monétairement
objectivement
opérationnellement
préventivement
proportionnellement
qualitativement
quantitativement
rationnellement
simultanément
souverainement
statutairement
symboliquement
transitoirement
virtuellement
"""),
    "phrases": items("""
à bien des égards
à ce stade
à condition de
à l'appui de
à l'origine de
à rebours de
à supposer que
à travers le prisme de
aller à l'encontre de
au fur et à mesure
au niveau de
au risque de
avoir vocation à
cela suppose de
dans l'hypothèse où
dans le contexte de
dans une logique de
de façon à
de nature à
de sorte que
du fait de
en ce qui touche à
en cohérence avec
en conséquence
en décalage avec
en dernier lieu
en lien avec
en parallèle
en réponse à
en se fondant sur
en toile de fond
être confronté à
être tributaire de
faire contrepoids à
faire état de
faire prévaloir
faire suite à
faute de mieux
mettre à disposition
mettre en balance
mettre en débat
mettre en garde
mettre hors de cause
ne pas être sans
ouvrir la voie à
par opposition à
porter sur
pour ce qui est de
prendre la mesure de
prendre le relais
procéder à
remédier à
rendre possible
se heurter à
s'inscrire dans
soulever la question
tenir pour acquis
"""),
}


def derived_words() -> dict[str, list[str]]:
    prefixed_iser: list[str] = []
    prefixed_ifier: list[str] = []
    iser_verbs = [*ISER_VERBS, *MORE_ISER_VERBS, *prefixed_iser]
    ifier_verbs = [*IFIER_VERBS, *MORE_IFIER_VERBS, *prefixed_ifier]
    iser_stems = [verb[:-2] for verb in iser_verbs]
    ifier_stems = [verb[:-5] for verb in ifier_verbs]
    return {
        "nouns": [
            *[f"{verb[:-4]}isation" for verb in iser_verbs],
            *[f"{stem}ification" for stem in ifier_stems],
        ],
        "verbs": [*iser_verbs, *ifier_verbs, *MANUAL_VERBS],
        "adj": [
            *[f"{stem}é" for stem in iser_stems],
            *[f"{verb[:-2]}é" for verb in ifier_verbs],
        ],
        "adv": [],
        "phrases": [],
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
                if row[0] == "b2" and row[1] in TARGET_GROUP_IDS:
                    continue
                existing.add(row[2])
    return existing


def build_candidate_order(key: str, group_index: int) -> list[str]:
    derived = derived_words()
    base = [*LEXICON[key], *EXTRA_SINGLE[key], *derived[key]]
    if key == "phrases":
        base = [*base, *EXTRA_PHRASES]
    step = {
        "nouns": 29,
        "verbs": 23,
        "adj": 17,
        "adv": 7,
        "phrases": 11,
    }[key]
    start = (group_index * step) % len(base)
    return [*base[start:], *base[:start]]


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
        path = B2_DIR / f"{group['id']}.json"
        path.write_text(
            json.dumps(build_group_json(group), ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        print(f"Wrote {path}")

    index_path = B2_DIR / "index.json"
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
    index["focus"] = "2000 B2 French lemmas across public debate, economy, climate, technology, research, culture, law and advanced argument. Translation, example and example_en are placeholders for now."
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
