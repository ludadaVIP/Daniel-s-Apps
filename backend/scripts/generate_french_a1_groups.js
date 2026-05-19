#!/usr/bin/env node
/**
 * Generates French A1 groups 2-10 with placeholder fields.
 * Each group has ~100 entries: nouns / verbs / adj / adv / phrase.
 * `lemma` and `pos` are real; everything else is "placeholder".
 *
 * Run from repo root:
 *   node backend/scripts/generate_french_a1_groups.js
 */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data", "FrenchVocab");
const A1_DIR = path.join(DATA_DIR, "levels", "a1");
const INDEX_PATH = path.join(A1_DIR, "index.json");
const CSV_PATH = path.join(DATA_DIR, "vocab-master.csv");

const groups = [
  {
    id: "group-2",
    title: "Group 2 · Corps et santé",
    focus:
      "Body parts, basic health and care. 40 nouns / 30 verbs / 15 adj / 5 adv / 10 phrases. Placeholder fields filled later.",
    nouns: [
      "ventre","dos","bras","jambe","doigt","oreille","nez","visage","cou","épaule",
      "genou","cœur","peau","ongle","langue","lèvre","joue","front","gorge","sang",
      "os","voix","sourire","larme","cerveau","estomac","poumon","cheville","coude","poitrine",
      "taille","hanche","talon","mâchoire","menton","cil","paupière","nuque","moustache","barbe"
    ],
    verbs: [
      "respirer","sentir","tousser","soigner","guérir","blesser","saigner","souffrir","mourir","naître",
      "grandir","vivre","peser","mesurer","masser","brosser","peigner","câliner","caresser","piquer",
      "gratter","cligner","bâiller","éternuer","transpirer","avaler","mâcher","nourrir","examiner","soulager"
    ],
    adj: [
      "sain","fragile","robuste","doux","dur","mou","lourd","léger","long","court",
      "étroit","large","plein","vide","mince"
    ],
    adv: ["tôt","tard","vite","lentement","ensemble"],
    phrases: [
      "avoir mal","avoir chaud","avoir froid","avoir sommeil","en forme",
      "en bonne santé","tomber malade","faire la sieste","prendre soin","à tes souhaits"
    ],
  },
  {
    id: "group-3",
    title: "Group 3 · Nourriture et repas",
    focus:
      "Food, drinks, meals, kitchen items. 50 nouns / 25 verbs / 10 adj / 5 adv / 10 phrases.",
    nouns: [
      "viande","poisson","poulet","bœuf","jambon","œuf","beurre","yaourt","sucre","sel",
      "poivre","huile","miel","chocolat","gâteau","biscuit","tarte","crêpe","baguette","croissant",
      "sandwich","soupe","salade","riz","pâtes","frites","pizza","fruit","légume","banane",
      "fraise","citron","tomate","carotte","oignon","thé","jus","vin","bière","glace",
      "repas","plat","menu","assiette","verre","tasse","bol","cuillère","fourchette","couteau"
    ],
    verbs: [
      "cuire","couper","mélanger","ajouter","verser","servir","goûter","commander","réserver","déjeuner",
      "dîner","peler","éplucher","trancher","hacher","frire","bouillir","rôtir","griller","consommer",
      "réchauffer","congeler","assaisonner","saler","sucrer"
    ],
    adj: ["délicieux","salé","sucré","amer","acide","épicé","frais","mûr","cru","cuit"],
    adv: ["assez","trop","peu","plutôt","presque"],
    phrases: [
      "à table","bon appétit","à votre santé","pomme de terre","fruits de mer",
      "à emporter","sur place","fait maison","à volonté","à point"
    ],
  },
  {
    id: "group-4",
    title: "Group 4 · Vêtements et accessoires",
    focus:
      "Clothes, accessories, shopping. 40 nouns / 30 verbs / 15 adj / 5 adv / 10 phrases.",
    nouns: [
      "vêtement","robe","jupe","pantalon","short","chemise","chemisier","tee-shirt","pull","veste",
      "manteau","blouson","costume","cravate","chaussure","chaussette","botte","sandale","basket","pantoufle",
      "sac","portefeuille","ceinture","chapeau","casquette","bonnet","gant","écharpe","foulard","lunettes",
      "montre","bague","bracelet","collier","parapluie","mouchoir","pyjama","poche","bouton","tissu"
    ],
    verbs: [
      "porter","enfiler","enlever","habiller","coudre","tricoter","plier","repasser","tacher","déchirer",
      "rétrécir","raccourcir","coiffer","maquiller","rincer","ranger","emballer","déballer","envelopper","suspendre",
      "accrocher","décrocher","attacher","détacher","nouer","dénouer","rendre","échanger","rembourser","marchander"
    ],
    adj: [
      "élégant","confortable","serré","ample","neuf","usé","abîmé","moderne","classique","coloré",
      "uni","rayé","transparent","brillant","mat"
    ],
    adv: ["autour","dehors","dedans","dessus","dessous"],
    phrases: [
      "à la mode","hors de prix","bon marché","en solde","en promotion",
      "faire les courses","à carreaux","à pois","à rayures","en cuir"
    ],
  },
  {
    id: "group-5",
    title: "Group 5 · Maison et objets",
    focus:
      "Rooms, furniture, household objects. 40 nouns / 30 verbs / 15 adj / 5 adv / 10 phrases.",
    nouns: [
      "appartement","immeuble","chambre","salon","cuisine","salle","couloir","balcon","cave","garage",
      "toilettes","lit","oreiller","drap","couverture","matelas","canapé","fauteuil","coussin","tapis",
      "rideau","étagère","armoire","tiroir","placard","lampe","télévision","ordinateur","téléphone","frigo",
      "machine","clé","mur","sol","plafond","escalier","ascenseur","photo","tableau","vase"
    ],
    verbs: [
      "allumer","éteindre","brancher","débrancher","arroser","balayer","essuyer","frotter","cirer","peindre",
      "décorer","tirer","pousser","soulever","baisser","taper","frapper","sonner","visser","clouer",
      "percer","casser","abîmer","salir","déménager","emménager","occuper","déranger","installer","cacher"
    ],
    adj: [
      "spacieux","lumineux","sombre","calme","bruyant","silencieux","tranquille","chaleureux","ancien","simple",
      "désordonné","décoré","meublé","carré","rond"
    ],
    adv: ["ici","là","ailleurs","partout","debout"],
    phrases: [
      "à la maison","chez soi","en haut","en bas","faire le ménage",
      "faire la vaisselle","mettre la table","faire la lessive","faire son lit","à côté de"
    ],
  },
  {
    id: "group-6",
    title: "Group 6 · Temps, saisons et météo",
    focus:
      "Time, dates, seasons, weather. 45 nouns / 25 verbs / 15 adj / 5 adv / 10 phrases.",
    nouns: [
      "minute","seconde","instant","moment","midi","minuit","après-midi","matinée","soirée","journée",
      "date","siècle","saison","printemps","été","automne","hiver","lundi","mardi","mercredi",
      "jeudi","vendredi","samedi","dimanche","janvier","février","mars","avril","mai","juin",
      "juillet","août","septembre","octobre","novembre","décembre","météo","nuage","orage","tempête",
      "brouillard","chaleur","lumière","étoile","lune"
    ],
    verbs: [
      "compter","durer","passer","dater","patienter","tarder","avancer","reculer","accélérer","ralentir",
      "bouger","briller","neiger","pleuvoir","souffler","geler","fondre","fleurir","chauffer","refroidir",
      "mouiller","tremper","inonder","tonner","éclairer"
    ],
    adj: [
      "ensoleillé","nuageux","pluvieux","orageux","neigeux","venteux","humide","sec","tiède","brumeux",
      "glacial","couvert","dégagé","doré","argenté"
    ],
    adv: ["hier","demain","aujourd'hui","maintenant","bientôt"],
    phrases: [
      "il fait beau","il fait mauvais","il y a du soleil","il y a du vent","au printemps",
      "en été","en hiver","à l'automne","à temps","de temps en temps"
    ],
  },
  {
    id: "group-7",
    title: "Group 7 · Transports et déplacements",
    focus:
      "Vehicles, travel, directions. 45 nouns / 25 verbs / 15 adj / 5 adv / 10 phrases.",
    nouns: [
      "bus","métro","tramway","vélo","moto","avion","bateau","taxi","camion","autocar",
      "route","autoroute","chemin","pont","port","quai","arrêt","station","parking","piéton",
      "trottoir","carrefour","feu","panneau","casque","pneu","moteur","essence","volant","siège",
      "valise","bagage","plan","billet","voyage","départ","arrivée","retour","passeport","frontière",
      "étranger","tourisme","promenade","sortie","trajet"
    ],
    verbs: [
      "conduire","rouler","voler","naviguer","atterrir","décoller","embarquer","débarquer","emmener","déposer",
      "récupérer","rater","manquer","doubler","freiner","démarrer","garer","stationner","louer","transporter",
      "livrer","circuler","traverser","longer","suivre"
    ],
    adj: [
      "proche","distant","direct","indirect","urgent","pressé","prêt","ponctuel","lointain","accessible",
      "pratique","risqué","fluide","dense","bondé"
    ],
    adv: ["loin","près","devant","derrière","là-bas"],
    phrases: [
      "à pied","à vélo","en voiture","en train","en avion",
      "tout droit","bon voyage","en route","à l'étranger","aller-retour"
    ],
  },
  {
    id: "group-8",
    title: "Group 8 · École et professions",
    focus:
      "School objects, study verbs, professions. 45 nouns / 25 verbs / 15 adj / 5 adv / 10 phrases.",
    nouns: [
      "élève","leçon","cours","exercice","cahier","stylo","crayon","gomme","papier","cartable",
      "calendrier","agenda","dictionnaire","mot","lettre","paragraphe","texte","question","réponse","exemple",
      "dictée","lecture","écriture","récréation","bibliothèque","directeur","cantine","métier","profession","policier",
      "pompier","vendeur","serveur","boulanger","chef","secrétaire","infirmier","acteur","chanteur","artiste",
      "peintre","écrivain","journaliste","ingénieur","avocat"
    ],
    verbs: [
      "étudier","enseigner","former","corriger","noter","copier","réviser","calculer","dessiner","colorier",
      "tracer","effacer","souligner","répéter","mémoriser","réciter","poser","interroger","présenter","assister",
      "participer","concentrer","raisonner","inventer","découvrir"
    ],
    adj: [
      "attentif","distrait","studieux","paresseux","doué","intelligent","créatif","curieux","sérieux","sage",
      "timide","poli","gentil","drôle","amusant"
    ],
    adv: ["mieux","pire","moins","plus","surtout"],
    phrases: [
      "faire ses devoirs","avoir cours","à l'école","en classe","au tableau",
      "par cœur","tout le monde","de plus en plus","de moins en moins","petit à petit"
    ],
  },
  {
    id: "group-9",
    title: "Group 9 · Nature et animaux",
    focus:
      "Plants, terrain, animals. 45 nouns / 25 verbs / 15 adj / 5 adv / 10 phrases.",
    nouns: [
      "arbre","fleur","feuille","herbe","plante","branche","racine","graine","champ","lac",
      "île","colline","vallée","rocher","pierre","sable","terre","boue","nature","oiseau",
      "cheval","vache","mouton","poule","canard","lapin","souris","cochon","âne","chèvre",
      "lion","tigre","éléphant","ours","loup","renard","singe","abeille","papillon","fourmi",
      "mouche","araignée","serpent","tortue","grenouille"
    ],
    verbs: [
      "cultiver","planter","semer","récolter","cueillir","ramasser","tailler","élever","chasser","pêcher",
      "attraper","relâcher","mordre","aboyer","miauler","galoper","ronronner","brouter","couver","nicher",
      "apprivoiser","dresser","errer","fuir","crier"
    ],
    adj: [
      "sauvage","domestique","gros","mignon","féroce","vif","agile","gigantesque","immense","minuscule",
      "énorme","pointu","fidèle","poilu","lisse"
    ],
    adv: ["aussi","exactement","environ","autrement","normalement"],
    phrases: [
      "au bord de","au milieu de","à la campagne","à la ferme","en pleine nature",
      "en plein air","faire le tour de","faire un tour","au coin de","il était une fois"
    ],
  },
  {
    id: "group-10",
    title: "Group 10 · Couleurs, qualités et verbes essentiels",
    focus:
      "Colors, common qualities, everyday verbs. 35 nouns / 25 verbs / 20 adj / 10 adv / 10 phrases.",
    nouns: [
      "couleur","début","fin","matière","forme","nombre","quantité","différence","milieu","côté",
      "surface","point","ligne","cercle","groupe","paire","partie","moitié","tas","bout",
      "morceau","paquet","boîte","liste","série","ordre","niveau","genre","type","style",
      "fait","chose","objet","outil","produit"
    ],
    verbs: [
      "aider","jeter","tenir","montrer","penser","croire","sembler","paraître","exister","garder",
      "laisser","quitter","rentrer","retourner","revenir","devenir","agir","réagir","offrir","promettre",
      "remercier","saluer","féliciter","inviter","rencontrer"
    ],
    adj: [
      "rouge","bleu","vert","jaune","noir","blanc","gris","rose","orange","violet","marron",
      "seul","premier","dernier","prochain","autre","même","certain","principal","général"
    ],
    adv: [
      "alors","puis","ensuite","avant","après","depuis","pendant","justement","finalement","complètement"
    ],
    phrases: [
      "c'est-à-dire","par hasard","tout à fait","à peu près","quelque chose",
      "quelqu'un","tout d'un coup","en tout cas","de toute façon","par contre"
    ],
  },
];

function makeEntry(lemma, pos) {
  return {
    lemma,
    ipa: "placeholder",
    pos,
    translation_en: "placeholder",
    example: "placeholder",
    example_en: "placeholder",
    tag: "placeholder",
  };
}

function buildGroupJson(group) {
  const words = [];
  for (const lemma of group.nouns) words.push(makeEntry(lemma, "noun"));
  for (const lemma of group.verbs) words.push(makeEntry(lemma, "verb"));
  for (const lemma of group.adj) words.push(makeEntry(lemma, "adj"));
  for (const lemma of group.adv) words.push(makeEntry(lemma, "adv"));
  for (const lemma of group.phrases) words.push(makeEntry(lemma, "phrase"));
  return {
    id: group.id,
    title: group.title,
    focus: group.focus,
    words,
  };
}

// 1. Read existing master CSV to detect duplicates
const existingLemmas = new Set();
const csvLines = fs.readFileSync(CSV_PATH, "utf8").split(/\r?\n/);
for (let i = 1; i < csvLines.length; i++) {
  const line = csvLines[i].trim();
  if (!line) continue;
  const parts = line.split(",");
  const lemma = parts.slice(2).join(",");
  if (lemma) existingLemmas.add(lemma);
}

// 2. Validate no duplicates within the new groups or against existing
const seenNew = new Set();
const errors = [];
for (const group of groups) {
  const all = [
    ...group.nouns.map((l) => ["noun", l]),
    ...group.verbs.map((l) => ["verb", l]),
    ...group.adj.map((l) => ["adj", l]),
    ...group.adv.map((l) => ["adv", l]),
    ...group.phrases.map((l) => ["phrase", l]),
  ];
  for (const [pos, lemma] of all) {
    if (existingLemmas.has(lemma)) errors.push(`DUP w/ master: ${group.id} ${pos} ${lemma}`);
    if (seenNew.has(lemma)) errors.push(`DUP w/in new: ${group.id} ${pos} ${lemma}`);
    seenNew.add(lemma);
    if (pos !== "phrase" && /\s/.test(lemma)) errors.push(`Multi-word non-phrase: ${group.id} ${pos} ${lemma}`);
  }
  const total =
    group.nouns.length +
    group.verbs.length +
    group.adj.length +
    group.adv.length +
    group.phrases.length;
  if (total !== 100) errors.push(`${group.id} has ${total} words, expected 100`);
  const phraseRatio = group.phrases.length / total;
  if (phraseRatio >= 0.15) errors.push(`${group.id} phrase ratio ${(phraseRatio * 100).toFixed(1)}% (must be < 15%)`);
}

if (errors.length) {
  console.error("Validation errors:");
  for (const e of errors) console.error("  " + e);
  process.exit(1);
}

// 3. Write group JSON files
for (const group of groups) {
  const filePath = path.join(A1_DIR, `${group.id}.json`);
  const json = JSON.stringify(buildGroupJson(group), null, 2) + "\n";
  fs.writeFileSync(filePath, json, "utf8");
  console.log(`wrote ${filePath}`);
}

// 4. Update index.json
const index = JSON.parse(fs.readFileSync(INDEX_PATH, "utf8"));
const existingIds = new Set(index.groups.map((g) => g.id));
for (const group of groups) {
  if (existingIds.has(group.id)) continue;
  index.groups.push({
    id: group.id,
    title: group.title,
    focus: group.focus,
    count: 100,
  });
}
fs.writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2) + "\n", "utf8");
console.log(`updated ${INDEX_PATH}`);

// 5. Append to vocab-master.csv
const csvAppend = [];
for (const group of groups) {
  const all = [
    ...group.nouns,
    ...group.verbs,
    ...group.adj,
    ...group.adv,
    ...group.phrases,
  ];
  for (const lemma of all) {
    csvAppend.push(`a1,${group.id},${lemma}`);
  }
}
const csvCurrent = fs.readFileSync(CSV_PATH, "utf8").replace(/\s*$/, "");
const csvFinal = csvCurrent + "\n" + csvAppend.join("\n") + "\n";
fs.writeFileSync(CSV_PATH, csvFinal, "utf8");
console.log(`appended ${csvAppend.length} rows to ${CSV_PATH}`);

console.log("\nDone. A1 now has", 100 + csvAppend.length, "lemmas across", 1 + groups.length, "groups.");
