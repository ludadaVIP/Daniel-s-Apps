"""
Build French Vocab B1 groups 2..15.

The learning fields stay as placeholders for this pass. The script validates
new lemmas against vocab-master.csv before writing anything.
"""

from __future__ import annotations

import csv
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = ROOT / "backend" / "data" / "FrenchVocab"
B1_DIR = DATA_DIR / "levels" / "b1"
CSV_PATH = DATA_DIR / "vocab-master.csv"
PH = "placeholder"

COUNTS = {"nouns": 40, "verbs": 30, "adj": 15, "adv": 5, "phrases": 10}
POS_ORDER = [
    ("nouns", "noun"),
    ("verbs", "verb"),
    ("adj", "adj"),
    ("adv", "adv"),
    ("phrases", "phrase"),
]
TARGET_GROUP_IDS = {f"group-{n}" for n in range(2, 16)}


def items(raw: str) -> list[str]:
    return [line.strip() for line in raw.strip().splitlines() if line.strip()]


def group_sort_key(path: Path) -> tuple[int, str]:
    try:
        return (int(path.stem.split("-")[-1]), path.name)
    except ValueError:
        return (9999, path.name)


GROUPS = [
    {
        "id": "group-2",
        "title": "Group 2 · Opinions et raisonnement",
        "focus": "B1 vocabulary for explaining opinions, reasoning, nuance, doubt and practical argument.",
        "nouns": items("""
argumentation
accord
désaccord
conviction
certitude
doute
supposition
hypothèse
preuve
exemple
contre-exemple
nuance
malentendu
interprétation
conclusion
conséquence
cause
effet
comparaison
différence
ressemblance
contradiction
cohérence
logique
jugement
critère
position
point
argumentaire
objection
réponse
réserve
priorité
possibilité
limite
condition
exception
tendance
préférence
incertitude
"""),
        "verbs": items("""
argumenter
justifier
prouver
conclure
résumer
comparer
contraster
nuancer
supposer
imaginer
douter
convaincre
persuader
admettre
contester
souligner
préciser
remarquer
estimer
considérer
déduire
résulter
impliquer
entraîner
signifier
confirmer
vérifier
corriger
clarifier
illustrer
"""),
        "adj": items("""
logique
cohérent
contradictoire
convaincant
incertain
certain
probable
improbable
relatif
essentiel
secondaire
principal
valable
contestable
précis
"""),
        "adv": items("""
logiquement
clairement
précisément
probablement
certainement
"""),
        "phrases": items("""
à mon sens
selon moi
en d'autres termes
cela dit
quoi qu'il en soit
mettre en doute
tirer une conclusion
peser le pour et le contre
avoir du mal à croire
prendre en considération
"""),
    },
    {
        "id": "group-3",
        "title": "Group 3 · Travail et organisation",
        "focus": "B1 vocabulary for office life, projects, responsibilities, planning and workplace problems.",
        "nouns": items("""
candidature
recrutement
entretien
contrat
mission
responsabilité
service
direction
équipe
planning
calendrier
horaire
délai
retard
avance
priorisation
tâche
dossier
rapport
compte-rendu
objectif
résultat
performance
rendement
productivité
compétence
qualification
promotion
démission
licenciement
chômage
retraite
stage
stagiaire
apprentissage
atelier
clientèle
fournisseur
partenariat
budget
"""),
        "verbs": items("""
postuler
recruter
embaucher
licencier
démissionner
négocier
planifier
prévoir
reporter
annuler
coordonner
superviser
diriger
déléguer
collaborer
participer
contribuer
accomplir
réaliser
atteindre
respecter
dépasser
évaluer
mesurer
prioriser
classer
traiter
résoudre
présenter
féliciter
"""),
        "adj": items("""
professionnel
efficace
productif
compétent
qualifié
responsable
disponible
ponctuel
urgent
prioritaire
collectif
individuel
hiérarchique
rentable
flexible
"""),
        "adv": items("""
professionnellement
efficacement
ponctuellement
collectivement
rapidement
"""),
        "phrases": items("""
être débordé
prendre rendez-vous
faire le point
tenir au courant
rendre service
avoir du retard
mettre à jour
être responsable de
poser sa candidature
donner suite à
"""),
    },
    {
        "id": "group-4",
        "title": "Group 4 · Études et apprentissage",
        "focus": "B1 vocabulary for study strategy, exams, research, academic work and learning habits.",
        "nouns": items("""
enseignement
apprentissage
programme
module
cours
séminaire
conférence
atelier
devoir
exercice
consigne
correction
évaluation
contrôle
résultat
moyenne
mention
mémoire
thèse
bibliothèque
ouvrage
manuel
chapitre
paragraphe
introduction
conclusion
résumé
synthèse
fiche
révision
méthode
stratégie
discipline
spécialité
niveau
progression
difficulté
erreur
lacune
autonomie
"""),
        "verbs": items("""
étudier
réviser
mémoriser
retenir
oublier
relire
noter
annoter
surligner
rédiger
corriger
réviser
réussir
échouer
progresser
maîtriser
assimiler
approfondir
chercher
documenter
consulter
citer
traduire
interpréter
présenter
exposer
organiser
préparer
concentrer
motiver
"""),
        "adj": items("""
scolaire
universitaire
académique
pédagogique
théorique
pratique
obligatoire
facultatif
optionnel
bilingue
autonome
concentré
distrait
méthodique
régulier
"""),
        "adv": items("""
méthodiquement
régulièrement
attentivement
sérieusement
oralement
"""),
        "phrases": items("""
prendre des notes
passer un examen
rendre un devoir
avoir la moyenne
faire des progrès
être à la traîne
se remettre à niveau
apprendre par cœur
faire une recherche
perdre le fil
"""),
    },
    {
        "id": "group-5",
        "title": "Group 5 · Santé et équilibre",
        "focus": "B1 vocabulary for appointments, symptoms, recovery, stress, habits and emotional balance.",
        "nouns": items("""
symptôme
diagnostic
traitement
ordonnance
consultation
urgence
opération
récupération
guérison
blessure
infection
allergie
tension
fatigue
insomnie
douleur
migraine
nausée
vertige
fièvre
toux
respiration
appétit
alimentation
poids
activité
repos
rythme
habitude
équilibre
stress
anxiété
inquiétude
soulagement
soutien
prévention
risque
conseil
spécialiste
assurance
"""),
        "verbs": items("""
soigner
guérir
souffrir
tousser
respirer
saigner
vomir
prescrire
consulter
examiner
opérer
hospitaliser
récupérer
reposer
prévenir
éviter
soulager
apaiser
rassurer
inquiéter
stresser
fatiguer
maigrir
grossir
peser
mesurer
équilibrer
accompagner
soutenir
surveiller
"""),
        "adj": items("""
médical
physique
mental
chronique
aigu
léger
sérieux
douloureux
fatigué
épuisé
inquiet
rassuré
équilibré
préventif
quotidien
"""),
        "adv": items("""
physiquement
mentalement
quotidiennement
progressivement
doucement
"""),
        "phrases": items("""
prendre soin de
être en forme
avoir mal à
prendre rendez-vous
garder le lit
se sentir mieux
être sous traitement
faire une pause
reprendre des forces
avoir le moral
"""),
    },
    {
        "id": "group-6",
        "title": "Group 6 · Relations et vie sociale",
        "focus": "B1 vocabulary for friendship, family, conflict, trust, apologies and social behaviour.",
        "nouns": items("""
relation
connaissance
voisinage
communauté
confiance
respect
dispute
conflit
réconciliation
excuse
promesse
mensonge
vérité
secret
trahison
jalousie
générosité
égoïsme
solidarité
solitude
présence
absence
compagnie
groupe
réseau
contact
invitation
rencontre
sortie
cérémonie
fiançailles
mariage
naissance
adolescence
adulte
parenté
génération
comportement
réaction
attitude
"""),
        "verbs": items("""
rencontrer
fréquenter
inviter
présenter
saluer
embrasser
sourire
plaisanter
promettre
mentir
trahir
pardonner
excuser
disputer
réconcilier
respecter
mépriser
admirer
jalouser
encourager
inspirer
influencer
soutenir
partager
confier
révéler
cacher
accompagner
quitter
manquer
"""),
        "adj": items("""
social
amical
familial
sincère
fidèle
jaloux
généreux
égoïste
solidaire
seul
présent
absent
proche
distant
respectueux
"""),
        "adv": items("""
sincèrement
mutuellement
socialement
amicalement
poliment
"""),
        "phrases": items("""
se faire des amis
garder le contact
couper les ponts
faire confiance à
tenir sa promesse
demander pardon
faire la paix
avoir confiance en
prendre des nouvelles
se mettre à la place de
"""),
    },
    {
        "id": "group-7",
        "title": "Group 7 · Voyage et mobilité",
        "focus": "B1 vocabulary for planning trips, delays, reservations, transport problems and orientation.",
        "nouns": items("""
itinéraire
trajet
parcours
destination
départ
arrivée
correspondance
réservation
annulation
retard
embarquement
décollage
atterrissage
bagage
passeport
frontière
douane
visa
séjour
hébergement
auberge
camping
croisière
excursion
randonnée
visite
souvenir
guide
carte
boussole
panneau
direction
carrefour
bouchon
péage
contrôle
assurance
agence
aventure
paysage
"""),
        "verbs": items("""
voyager
réserver
annuler
confirmer
retarder
embarquer
atterrir
décoller
traverser
franchir
contrôler
loger
héberger
camper
randonner
explorer
visiter
photographier
orienter
perdre
retrouver
déplacer
circuler
stationner
doubler
freiner
accélérer
ralentir
emprunter
profiter
"""),
        "adj": items("""
touristique
local
étranger
international
national
régional
urbain
rural
montagneux
côtier
pittoresque
animé
isolé
accessible
bondé
"""),
        "adv": items("""
localement
internationalement
librement
prudemment
provisoirement
"""),
        "phrases": items("""
changer d'air
faire ses valises
partir en voyage
prendre la route
perdre son chemin
être de passage
avoir le mal du pays
voyager léger
prendre le large
être coincé dans
"""),
    },
    {
        "id": "group-8",
        "title": "Group 8 · Logement et vie urbaine",
        "focus": "B1 vocabulary for housing, neighbourhoods, repairs, public space and everyday city problems.",
        "nouns": items("""
logement
appartement
immeuble
résidence
locataire
propriétaire
loyer
caution
bail
déménagement
installation
réparation
travaux
chantier
bruit
humidité
fuite
panne
coupure
chauffage
électricité
plomberie
ascenseur
escaliers
couloir
balcon
terrasse
cour
quartier
voisin
voisine
commerce
mairie
permis
stationnement
circulation
déviation
passage
espace
propreté
"""),
        "verbs": items("""
louer
occuper
habiter
installer
déménager
emménager
aménager
réparer
rénover
entretenir
nettoyer
chauffer
aérer
éclairer
couper
rétablir
fuir
sonner
déranger
gêner
plaindre
signaler
déclarer
garer
stationner
circuler
traverser
construire
démolir
agrandir
"""),
        "adj": items("""
résidentiel
urbain
bruyant
calme
lumineux
sombre
spacieux
étroit
meublé
vide
provisoire
permanent
commun
privé
municipal
"""),
        "adv": items("""
provisoirement
définitivement
bruyamment
calmement
localement
"""),
        "phrases": items("""
chercher un logement
signer un bail
payer le loyer
faire des travaux
tomber en panne
porter plainte
faire du bruit
vivre en colocation
être chez soi
avoir des voisins
"""),
    },
    {
        "id": "group-9",
        "title": "Group 9 · Environnement et consommation",
        "focus": "B1 vocabulary for climate, resources, waste, responsible habits and everyday consumption.",
        "nouns": items("""
nature
ressource
déchet
ordure
tri
emballage
plastique
verre
carton
métal
énergie
électricité
gaz
essence
chauffage
consommation
production
produit
marque
qualité
quantité
prix
coût
économie
gaspillage
pollution
protection
préservation
réduction
recyclage
réutilisation
réchauffement
température
sécheresse
inondation
incendie
espèce
habitat
agriculture
récolte
"""),
        "verbs": items("""
consommer
économiser
gaspiller
réduire
réutiliser
trier
recycler
jeter
ramasser
protéger
préserver
polluer
menacer
disparaître
augmenter
diminuer
chauffer
refroidir
produire
cultiver
récolter
planter
arroser
sécher
inonder
brûler
sensibiliser
limiter
remplacer
choisir
"""),
        "adj": items("""
écologique
durable
responsable
renouvelable
recyclable
réutilisable
polluant
toxique
naturel
artificiel
local
mondial
climatique
agricole
énergétique
"""),
        "adv": items("""
durablement
responsablement
localement
mondialement
naturellement
"""),
        "phrases": items("""
faire le tri
jeter à la poubelle
économiser l'énergie
protéger la planète
prendre conscience de
être en danger
réduire ses déchets
consommer moins
faire attention à
agir pour
"""),
    },
    {
        "id": "group-10",
        "title": "Group 10 · Médias et numérique",
        "focus": "B1 vocabulary for online life, reliable information, devices, privacy and digital communication.",
        "nouns": items("""
réseau
plateforme
compte
profil
mot-clé
identifiant
connexion
déconnexion
mise
paramètre
réglage
fichier
donnée
stockage
mémoire
sauvegarde
publication
partage
réaction
abonné
abonnement
internaute
actualité
information
titre
article
reportage
interview
journaliste
rédaction
rubrique
commentaire
avis
rumeur
source
fiabilité
publicité
confidentialité
sécurité
piratage
"""),
        "verbs": items("""
connecter
déconnecter
télécharger
enregistrer
sauvegarder
supprimer
modifier
paramétrer
publier
partager
commenter
réagir
suivre
abonner
désabonner
bloquer
débloquer
signaler
protéger
pirater
vérifier
comparer
consulter
rechercher
diffuser
transmettre
informer
annoncer
interviewer
répondre
"""),
        "adj": items("""
numérique
digital
virtuel
connecté
sécurisé
fiable
faux
vrai
récent
actuel
anonyme
public
confidentiel
interactif
automatique
"""),
        "adv": items("""
numériquement
virtuellement
automatiquement
directement
publiquement
"""),
        "phrases": items("""
mettre en ligne
hors connexion
faire une recherche
vérifier une source
partager un article
protéger ses données
créer un compte
mot de passe oublié
rester connecté
faire circuler
"""),
    },
    {
        "id": "group-11",
        "title": "Group 11 · Administration et démarches",
        "focus": "B1 vocabulary for forms, official requests, public services, complaints and paperwork.",
        "nouns": items("""
démarche
procédure
formulaire
dossier
document
copie
original
signature
tampon
certificat
attestation
justificatif
autorisation
demande
requête
réclamation
plainte
guichet
accueil
service
usager
agent
fonctionnaire
administration
préfecture
consulat
ambassade
tribunal
mairie
impôt
taxe
amende
contravention
identité
domicile
adresse
délai
renouvellement
validation
refus
"""),
        "verbs": items("""
remplir
compléter
signer
joindre
fournir
déposer
envoyer
recevoir
traiter
valider
refuser
accepter
autoriser
renouveler
modifier
corriger
imprimer
scanner
photocopier
classer
archiver
réclamer
plaindre
déclarer
payer
rembourser
contrôler
vérifier
convoquer
comparaître
"""),
        "adj": items("""
administratif
officiel
obligatoire
facultatif
valide
invalide
complet
incomplet
original
copié
signé
daté
gratuit
payant
juridique
"""),
        "adv": items("""
officiellement
gratuitement
obligatoirement
juridiquement
personnellement
"""),
        "phrases": items("""
remplir un formulaire
faire une demande
déposer un dossier
fournir un justificatif
être en règle
prendre un numéro
faire appel à
passer au guichet
recevoir une réponse
demander un remboursement
"""),
    },
    {
        "id": "group-12",
        "title": "Group 12 · Culture et loisirs",
        "focus": "B1 vocabulary for books, cinema, performance, museums, hobbies and cultural events.",
        "nouns": items("""
loisir
activité
spectacle
représentation
séance
billet
réservation
entrée
sortie
exposition
galerie
œuvre
peinture
sculpture
photographie
cinéaste
acteur
actrice
spectateur
critique
intrigue
personnage
chapitre
scénario
réplique
roman
nouvelle
poésie
lecteur
lecture
bibliothèque
librairie
édition
concert
orchestre
chanteur
musicien
mélodie
rythme
festival
"""),
        "verbs": items("""
lire
feuilleter
parcourir
écrire
publier
éditer
traduire
interpréter
jouer
chanter
danser
composer
enregistrer
filmer
tourner
réaliser
projeter
réserver
applaudir
critiquer
recommander
décrire
raconter
imaginer
émouvoir
divertir
captiver
exposer
collectionner
découvrir
"""),
        "adj": items("""
culturel
artistique
littéraire
musical
cinématographique
créatif
original
classique
moderne
populaire
émouvant
captivant
drôle
tragique
comique
"""),
        "adv": items("""
artistiquement
culturellement
musicalement
librement
créativement
"""),
        "phrases": items("""
aller au cinéma
aller voir une exposition
être à l'affiche
monter sur scène
jouer un rôle
faire salle comble
avoir du succès
donner envie de
être passionné par
passer un bon moment
"""),
    },
    {
        "id": "group-13",
        "title": "Group 13 · Économie et argent",
        "focus": "B1 vocabulary for prices, income, saving, household budgets, banking and everyday economic choices.",
        "nouns": items("""
revenu
dépense
épargne
économie
budget
compte
banque
carte
espèces
virement
retrait
dépôt
intérêt
prêt
dette
crédit
facture
loyer
charge
abonnement
tarif
réduction
remise
promotion
achat
vente
consommateur
marchand
commande
livraison
remboursement
garantie
assurance
investissement
profit
perte
valeur
croissance
baisse
inflation
"""),
        "verbs": items("""
dépenser
économiser
épargner
gagner
perdre
coûter
valoir
payer
rembourser
prêter
emprunter
retirer
déposer
virer
facturer
commander
livrer
acheter
vendre
négocier
réduire
augmenter
investir
profiter
risquer
assurer
garantir
comparer
calculer
prévoir
"""),
        "adj": items("""
financier
économique
bancaire
cher
abordable
gratuit
payant
rentable
avantageux
raisonnable
excessif
mensuel
annuel
fixe
variable
"""),
        "adv": items("""
financièrement
économiquement
mensuellement
annuellement
raisonnablement
"""),
        "phrases": items("""
faire des économies
ouvrir un compte
payer par carte
retirer de l'argent
avoir les moyens
coûter trop cher
faire un virement
être en promotion
tenir un budget
mettre de côté
"""),
    },
    {
        "id": "group-14",
        "title": "Group 14 · Récits et événements",
        "focus": "B1 vocabulary for telling stories, sequencing events, describing surprises, mistakes and results.",
        "nouns": items("""
événement
incident
accident
aventure
expérience
scène
moment
étape
début
milieu
fin
suite
ordre
désordre
retournement
surprise
hasard
chance
malchance
erreur
faute
oubli
échec
réussite
tentative
solution
sortie
obstacle
progrès
amélioration
aggravation
changement
transformation
déroulement
description
détail
souvenir
mémoire
témoignage
leçon
"""),
        "verbs": items("""
arriver
survenir
se produire
débuter
terminer
continuer
suivre
précéder
interrompre
reprendre
oublier
se souvenir
rappeler
raconter
décrire
expliquer
détailler
résumer
étonner
surprendre
réagir
échouer
réussir
tenter
essayer
réparer
améliorer
aggraver
transformer
apprendre
"""),
        "adj": items("""
inattendu
prévu
imprévu
habituel
exceptionnel
réussi
raté
grave
léger
compliqué
simple
curieux
étrange
mémorable
progressif
"""),
        "adv": items("""
soudainement
progressivement
finalement
ensuite
autrefois
"""),
        "phrases": items("""
tout à coup
au début
à la fin
par hasard
avoir lieu
se passer bien
tourner mal
se souvenir de
faire une erreur
tirer une leçon
"""),
    },
    {
        "id": "group-15",
        "title": "Group 15 · Expressions idiomatiques et nuances",
        "focus": "B1 vocabulary for common attitudes, discourse markers, reactions and idiomatic expressions.",
        "nouns": items("""
façon
manière
attente
besoin
envie
peur
honte
fierté
courage
patience
impatience
colère
calme
tension
pression
hésitation
surprise
déception
regret
espoir
volonté
capacité
habileté
attention
prudence
confiance
méfiance
curiosité
intérêt
ennui
plaisir
souci
difficulté
solution
choix
occasion
chance
danger
avantage
inconvénient
"""),
        "verbs": items("""
hésiter
oser
renoncer
insister
persévérer
abandonner
se méfier
se tromper
se dépêcher
se calmer
s'énerver
s'inquiéter
se réjouir
regretter
espérer
craindre
redouter
affronter
supporter
tolérer
accepter
refuser
préférer
choisir
éviter
profiter
réfléchir
réagir
remarquer
attirer
"""),
        "adj": items("""
capable
incapable
prudent
imprudent
patient
impatient
courageux
lâche
curieux
indifférent
méfiant
confiant
hésitant
déterminé
calme
"""),
        "adv": items("""
franchement
vraiment
seulement
heureusement
malheureusement
"""),
        "phrases": items("""
avoir besoin de
avoir envie de
avoir peur de
en avoir assez
en valoir la peine
faire exprès
faire semblant
prendre son temps
se débrouiller
ne pas oser
"""),
    },
]

RESERVE = {
    "nouns": items("""
abri
abus
accès
accompagnement
acteur
actrice
adaptation
adhésion
admission
affaire
affichage
âge
aide
alarme
alerte
ambiance
ampleur
analyse
annuaire
apparence
approche
argument
aspect
assistance
association
assurance
attaque
autorité
avertissement
bénéfice
bénévole
bilan
blocage
bouleversement
branche
campagne
capacité
carence
cas
catégorie
cause
célébration
centre
certitude
changement
charge
circonstance
citoyen
citoyenne
classement
climat
cohésion
collectif
collaboration
combinaison
commande
commerce
commission
communication
comparaison
compensation
compétition
complexité
compromis
concentration
concept
concours
conduite
confusion
connaissance
conséquence
conservation
consommateur
contenu
contexte
contrainte
contraste
contribution
coopération
coordination
création
crise
croissance
curiosité
décalage
découverte
défaut
défense
demandeur
déplacement
désir
détente
développement
dialogue
dignité
dimension
discussion
dispositif
distance
distribution
diversité
donnée
durée
échange
échantillon
efficacité
égalité
élaboration
émission
engagement
enquête
environnement
épreuve
erreur
espace
estimation
exigence
explication
exploitation
expression
extension
facteur
faiblesse
fermeture
financement
fonction
fond
forme
formule
fragilité
front
fonctionnement
gestion
goût
habitant
habitante
handicap
hausse
identification
impact
importance
initiative
inscription
institution
instruction
intégration
intention
interaction
intervention
investigation
libération
lien
maintien
manque
marche
matériel
mécanisme
médiation
menace
mesure
minorité
mode
modèle
modification
mouvement
moyen
naissance
notion
obligation
observation
obstacle
offre
opposition
orientation
ouverture
participant
participante
participation
patrimoine
pensée
perception
période
permanence
perspective
phénomène
piste
plaisanterie
population
posture
précaution
préparation
pression
principe
procès
processus
proposition
public
questionnement
recherche
recommandation
reconnaissance
recours
référence
réflexion
refus
regard
règlement
remarque
remplacement
renforcement
répartition
représentant
représentante
résistance
responsable
restriction
retour
révélation
risque
rupture
satisfaction
sélection
sentiment
séquence
signal
solution
sondage
souhait
stabilité
structure
suggestion
suivi
support
surveillance
système
témoignage
thème
tolérance
trait
transfert
transition
urgence
utilisateur
utilisatrice
utilisation
valeur
variation
version
vision
vitesse
volonté
zone
aboutissement
accélération
acceptation
acquisition
activation
ajustement
allègement
amélioration
anticipation
appréciation
approbation
approfondissement
arrêt
assemblée
atout
avancement
baisse
barrière
besoin
cap
cible
classe
commentaire
complément
conflit
continuité
créateur
créatrice
débat
décisionnaire
déclaration
dégradation
délimitation
démonstration
dépannage
désaccord
destinataire
détection
diminution
écran
éducateur
éducatrice
émotion
encadrement
engagement
entourage
entretien
équipement
évolution
exclusion
exécution
facilité
filière
fonctionnaire
indicateur
influence
interdiction
investissement
justification
lectorat
levier
localisation
matériau
maturité
méfiance
modération
négociation
opinion
organisateur
organisatrice
paramètre
parcours
partenaire
préférence
prévision
preuve
protection
réaction
réajustement
reconstruction
recueil
récupération
réforme
réseau
réussite
révision
sauvegarde
sensibilisation
situation
solidarité
soupçon
spécialiste
statut
stratégie
surface
témoin
transformation
validation
"""),
    "verbs": items("""
abaisser
abîmer
abolir
absorber
accéder
accrocher
accumuler
adapter
adhérer
agir
ajouter
alerter
alléger
allonger
amener
amplifier
animer
anticiper
apparaître
appartenir
approcher
approfondir
approuver
argumenter
assister
assumer
attirer
autoriser
avancer
bénéficier
blesser
bouleverser
calculer
caractériser
céder
changer
circuler
classer
collaborer
combiner
commettre
communiquer
compenser
compléter
composer
concerner
concentrer
concevoir
condamner
conduire
conserver
constituer
contenir
contester
contribuer
convertir
correspondre
critiquer
croître
décrire
défendre
définir
dégager
dépendre
dérober
désigner
détecter
détenir
déterminer
diriger
discuter
distinguer
distribuer
diviser
dominer
éclaircir
élargir
élire
éloigner
émerger
empêcher
encadrer
encourager
enrichir
enseigner
épargner
établir
examiner
exiger
expérimenter
exploiter
exprimer
faciliter
figurer
financer
fixer
former
formuler
fournir
garantir
générer
gérer
guider
identifier
ignorer
imposer
indiquer
informer
inscrire
insister
intégrer
interdire
intervenir
introduire
investir
justifier
libérer
limiter
lutter
maintenir
manifester
mentionner
modifier
montrer
motiver
observer
obtenir
opposer
orienter
parvenir
percevoir
permettre
persister
perturber
plaire
poser
poursuivre
préciser
préparer
préserver
prévoir
privilégier
procéder
produire
progresser
proposer
prouver
qualifier
réaliser
réclamer
recommander
reconnaître
recourir
recréer
réduire
référer
renforcer
renoncer
répartir
représenter
résister
résulter
retenir
réunir
révéler
sélectionner
situer
souhaiter
souligner
soumettre
susciter
tenir
tenter
transformer
transmettre
troubler
valider
valoriser
varier
viser
accompagner
accroître
accuser
achever
activer
actualiser
adapter
affecter
afficher
affronter
aggraver
ajuster
améliorer
aménager
amuser
analyser
annoncer
appliquer
apporter
apprécier
appuyer
arranger
arrêter
associer
attaquer
attendre
attribuer
avertir
baisser
bâtir
bloquer
bouger
cadrer
capter
cesser
choquer
cibler
citer
clarifier
commander
commenter
comparer
compliquer
comprendre
compter
concilier
concrétiser
confier
confondre
confronter
consacrer
conseiller
constater
consulter
convier
coopérer
copier
corriger
créer
débattre
débloquer
déclencher
décourager
découvrir
décrire
déduire
défiler
délimiter
demander
démontrer
déposer
déranger
désirer
déstabiliser
détailler
détruire
devenir
deviner
diminuer
divertir
donner
échanger
échouer
économiser
écouter
éduquer
effectuer
élaborer
éliminer
émettre
émouvoir
employer
enregistrer
entendre
entourer
envoyer
éprouver
équilibrer
espérer
essayer
éviter
évoluer
excuser
exécuter
expliquer
explorer
exporter
exposer
extraire
fonder
franchir
frapper
fréquenter
grandir
grouper
hésiter
hériter
hospitaliser
illustrer
importer
inclure
influencer
inquiéter
installer
interroger
interrompre
inviter
isoler
juger
lancer
localiser
maîtriser
marquer
menacer
mener
mériter
mesurer
naviguer
nier
noter
occuper
ordonner
organiser
oser
partager
passer
patienter
penser
perdre
placer
plaisanter
porter
posséder
pratiquer
préférer
prévenir
prévoir
provoquer
publier
quitter
raconter
ralentir
rappeler
rassurer
réagir
recevoir
rechercher
réconcilier
récupérer
reculer
réfléchir
refuser
regretter
relancer
relier
remarquer
remplacer
remplir
rencontrer
renouveler
réparer
répondre
reporter
reprendre
reproduire
résoudre
respirer
ressentir
rester
retrouver
réussir
revoir
risquer
satisfaire
sauvegarder
sécuriser
séduire
signaler
signer
simplifier
soigner
soupçonner
stabiliser
stimuler
surprendre
surveiller
tolérer
toucher
traduire
traverser
tromper
trouver
utiliser
vendre
vérifier
vider
violer
visiter
vivre
voter
abonder
abréger
abuser
accabler
accaparer
accommoder
accoster
accoucher
accoutumer
accréditer
acheminer
acquérir
acquitter
adoucir
advenir
affluer
affoler
affranchir
agencer
agiter
agrandir
agréer
aiguiller
alimenter
aligner
altérer
amasser
amender
amorcer
ancrer
anéantir
apposer
appréhender
apprivoiser
armer
arrondir
aspirer
assécher
assembler
attacher
atténuer
avaler
bénir
blâmer
border
boucler
briser
canaliser
causer
célébrer
cerner
certifier
chiffrer
civiliser
coder
cohabiter
coïncider
collecter
commercialiser
concrétiser
concurrencer
conditionner
conformer
connecter
contempler
convenir
creuser
déboucher
décréter
défaire
délaisser
délivrer
démarrer
dénoncer
dériver
dérouler
détacher
détourner
documenter
durcir
enchaîner
équiper
favoriser
fonctionner
forcer
inaugurer
inventer
légitimer
perturber
piloter
précéder
programmer
reconstruire
recréer
redéfinir
redonner
réécrire
rééquilibrer
refonder
reformuler
regrouper
réinventer
relancer
relire
remettre
remonter
renvoyer
reposer
repréciser
requalifier
secourir
restructurer
retirer
revendiquer
séparer
séquencer
servir
solidariser
sommeiller
standardiser
structurer
subir
subventionner
suspendre
symboliser
témoigner
tester
tracer
trier
uniformiser
unifier
urbaniser
vacciner
verbaliser
visualiser
anonymiser
approvisionner
budgétiser
candidater
capitaliser
centraliser
circonscrire
cofinancer
coordonner
dématérialiser
déprioriser
désamorcer
désorganiser
diagnostiquer
différencier
dimensionner
disponibiliser
encourir
envisager
externaliser
fiabiliser
fluidifier
formaliser
hiérarchiser
homogénéiser
indemniser
institutionnaliser
mutualiser
objectiver
officialiser
opérationnaliser
optimiser
personnaliser
pérenniser
professionnaliser
questionner
réactualiser
réaménager
réorienter
reprioriser
responsabiliser
sécuriser
sensibiliser
simplifier
socialiser
stabiliser
territorialiser
vulgariser
aiguiser
amarrer
ameublir
assainir
auditionner
authentifier
baliser
basculer
breveter
cartographier
cautériser
centrifuger
cloisonner
codifier
cocher
compacter
compatibiliser
comptabiliser
confectionner
consolider
contextualiser
contractualiser
crédibiliser
décentraliser
décliner
décomposer
déconseiller
dédoubler
dédommager
dédramatiser
défricher
dépanner
déployer
désactiver
désinstaller
désorienter
désynchroniser
détériorer
digitaliser
écourter
éditorialiser
électrifier
encoder
endommager
endosser
enraciner
entériner
entreposer
énumérer
étaler
extrapoler
finaliser
fructifier
fusionner
géolocaliser
harmoniser
individualiser
infiltrer
instrumentaliser
interagir
interconnecter
inventorier
labelliser
légender
marchandiser
médiatiser
mensualiser
modéliser
normaliser
numériser
parrainer
présélectionner
quantifier
rationner
réaffecter
réanimer
réattribuer
recalculer
reclasser
reconnecter
reconsidérer
rediriger
réexaminer
réhabiliter
réinscrire
réinstaller
renégocier
renseigner
réorganiser
répertorier
repositionner
tarifer
télétravailler
temporiser
"""),
    "adj": items("""
abstrait
accessible
adéquat
administratif
adulte
agricole
ambitieux
analytique
annuel
anonyme
antérieur
approximatif
attentif
automatique
autonome
bénéfique
central
collectif
communautaire
comparable
compatible
complexe
concret
conscient
constant
contraire
créatif
critique
définitif
délicat
dépendant
direct
divers
durable
éducatif
égal
électoral
émotionnel
énergique
environnemental
évident
exceptionnel
externe
favorable
financier
fondamental
fréquent
global
humain
identique
indépendant
indirect
initial
institutionnel
interne
justifié
limité
majoritaire
minoritaire
modéré
mutuel
nécessaire
notable
ordinaire
partiel
particulier
permanent
personnel
positif
potentiel
préalable
prévisible
progressif
public
quotidien
récent
remarquable
respectif
significatif
stable
temporaire
thématique
utile
visible
acceptable
actif
adaptable
admissible
affectif
agressif
aléatoire
améliorable
analysable
antique
applicable
approfondi
approximatif
attendu
autorisé
avancé
bancaire
bénévole
capable
ciblé
civil
complet
confus
constructif
consultatif
convaincu
correct
créateur
décevant
défensif
démocratique
dérangeant
désirable
détaillé
déterminé
directeur
disciplinaire
dominant
électif
encourageant
énergétique
engagé
étonnant
évolutif
exigeant
expérimental
explicatif
fiable
formatif
généralisé
gratifiant
horizontal
illimité
imaginable
impressionnant
inattendu
inclusif
informatif
instable
interactif
isolé
juste
localisable
maîtrisable
mémorable
mobile
motivante
national
négociable
neutre
obligé
officiel
opérationnel
organisé
participatif
préparatoire
préventif
professionnel
progressiste
réaliste
reconnu
réduit
renouvelable
représentatif
résistant
réutilisable
sélectif
solidaire
soutenable
spécialisé
spontané
stratégique
supérieur
surprenant
tolérable
variable
vertical
volontaire
"""),
    "adv": items("""
actuellement
ailleurs
annuellement
auparavant
autrement
brièvement
constamment
davantage
désormais
également
évidemment
exactement
facilement
fréquemment
généralement
globalement
indirectement
initialement
largement
notamment
particulièrement
partiellement
pleinement
principalement
rarement
relativement
respectivement
suffisamment
temporairement
totalement
abondamment
activement
admirablement
alternativement
approximativement
automatiquement
concrètement
convenablement
définitivement
directement
discrètement
durablement
effectivement
financièrement
honnêtement
humainement
intérieurement
juridiquement
librement
matériellement
modérément
nettement
officiellement
politiquement
progressivement
provisoirement
publiquement
quotidiennement
raisonnablement
spontanément
"""),
    "phrases": items("""
aller de soi
avoir tendance à
avoir affaire à
faire appel à
faire partie de
faire preuve de
mettre en place
mettre en relation
mettre l'accent sur
mettre de côté
prendre position
prendre la décision
prendre le risque
prendre part à
tenir compte de
tenir à jour
tomber d'accord
venir de loin
voir les choses autrement
y voir plus clair
avoir intérêt à
avoir lieu
avoir pour but de
être au courant
être en mesure de
être sur le point de
faire la différence
faire le nécessaire
faire remarquer
mettre fin à
mettre sur pied
ne pas manquer de
prendre au sérieux
prendre contact avec
prendre la peine de
revenir sur
tenir parole
tomber sous le charme
trouver un compromis
voir venir
"""),
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
                if row[0] == "b1" and row[1] in TARGET_GROUP_IDS:
                    continue
                existing.add(row[2])
    return existing


def select_groups() -> tuple[list[dict[str, object]], list[str]]:
    existing = load_existing_lemmas()
    seen: set[str] = set()
    errors: list[str] = []
    selected_groups: list[dict[str, object]] = []

    for group in GROUPS:
        selected = {
            "id": group["id"],
            "title": group["title"],
            "focus": group["focus"],
            "nouns": [],
            "verbs": [],
            "adj": [],
            "adv": [],
            "phrases": [],
        }
        for key, expected in COUNTS.items():
            for lemma in [*group[key], *RESERVE[key]]:
                if lemma in existing or lemma in seen:
                    continue
                if key != "phrases" and (" " in lemma or "'" in lemma or "’" in lemma):
                    continue
                selected[key].append(lemma)
                seen.add(lemma)
                if len(selected[key]) == expected:
                    break
            if len(selected[key]) != expected:
                errors.append(
                    f"{group['id']}/{key}: selected {len(selected[key])}, expected {expected}"
                )

        total = sum(len(selected[key]) for key in COUNTS)
        if total != 100:
            errors.append(f"{group['id']}: total {total}, expected 100")
        if total and len(selected["phrases"]) / total >= 0.15:
            errors.append(f"{group['id']}: phrase ratio is not below 15%")
        selected_groups.append(selected)

    return selected_groups, errors


def validate() -> list[str]:
    _selected, errors = select_groups()
    return errors


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
        path = B1_DIR / f"{group['id']}.json"
        path.write_text(
            json.dumps(build_group_json(group), ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        print(f"Wrote {path}")

    index_path = B1_DIR / "index.json"
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
    index["focus"] = "1500 B1 French lemmas across work, study, opinions, travel, health, society and everyday nuance. Translation, example and example_en are placeholders for now."
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
