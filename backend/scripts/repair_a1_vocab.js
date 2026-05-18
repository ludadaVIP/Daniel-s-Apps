#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.resolve(__dirname, "../data/EspVocab");
const LEVELS_DIR = path.join(DATA_DIR, "levels");
const TARGET_LEVEL = "a1";
const SINGLE_WORD_POS = new Set(["noun", "verb", "adj", "adv"]);

const BAD_EXAMPLE_PATTERNS = [
  /es una expresión útil para organizar tus ideas/i,
  /es importante en este contexto/i,
  /is important in this context/i,
  /^tengo un[ao] .+ en casa\.?$/i,
  /^compré un[ao] .+ esta mañana\.?$/i,
  /^necesito un[ao] .+ para hoy\.?$/i,
  /^busco un[ao] .+ para la clase\.?$/i,
  /^intento .+ un poco cada día\.?$/i,
  /^tengo que .+ antes de salir\.?$/i,
  /^quiero .+ con más seguridad\.?$/i,
  /^es importante .+ con calma\.?$/i,
  /^aprendo a .+ en situaciones reales\.?$/i,
  /^este tema es .+\.?$/i,
  /^me parece .+\.?$/i,
  /^es un detalle .+\.?$/i,
  /^normalmente respondo .+\.?$/i,
  /^la situación cambia .+\.?$/i,
  /^lo hago .+ cuando puedo\.?$/i,
];

const TRANSLATION_FIXES = {
  animal: "living creature",
  cereal: "breakfast grain",
  hospital: "health centre",
  hotel: "place to stay",
  idea: "thought",
  internet: "online network",
  kilo: "kilogram",
  menú: "list of dishes",
  metro: "underground train",
  radio: "audio broadcast",
  simple: "easy, basic",
  sofá: "couch",
  taxi: "cab",
  televisión: "TV set",
  email: "electronic mail",
  plan: "arrangement",
  normal: "usual",
  artificial: "man-made",
};

const PHRASE_EXAMPLES = {
  "mañana temprano": ["Mañana temprano tengo una cita en el centro.", "Early tomorrow morning I have an appointment in the centre."],
  "esta semana": ["Esta semana estudio diez palabras nuevas cada día.", "This week I study ten new words every day."],
  "el próximo mes": ["El próximo mes empiezo un curso nuevo.", "Next month I start a new course."],
  "por favor repita": ["Por favor repita la dirección más despacio.", "Please repeat the address more slowly."],
  "no pasa nada": ["No pasa nada, podemos esperar unos minutos.", "It is okay, we can wait a few minutes."],
  "mucho gusto": ["Mucho gusto, soy Daniel y estudio español.", "Nice to meet you, I am Daniel and I study Spanish."],
  "al lado": ["La farmacia está al lado del supermercado.", "The pharmacy is next to the supermarket."],
  "en frente de": ["La parada está en frente de la estación.", "The stop is in front of the station."],
  "al fondo": ["Los baños están al fondo del pasillo.", "The toilets are at the end of the corridor."],
  "a la derecha": ["Gire a la derecha después del semáforo.", "Turn right after the traffic light."],
  "a la izquierda": ["La biblioteca queda a la izquierda.", "The library is on the left."],
  "siga recto": ["Siga recto y verá la plaza.", "Go straight ahead and you will see the square."],
  "empezar de nuevo": ["Si me equivoco, prefiero empezar de nuevo.", "If I make a mistake, I prefer to start again."],
  "hacer una pausa": ["Voy a hacer una pausa después de este ejercicio.", "I am going to take a break after this exercise."],
  "pedir ayuda": ["Cuando no entiendo el formulario, puedo pedir ayuda.", "When I do not understand the form, I can ask for help."],
  "un poco": ["Hablo un poco de español en la tienda.", "I speak a little Spanish in the shop."],
  "un momento": ["Un momento, voy a buscar mi cartera.", "One moment, I am going to look for my wallet."],
  "otra cosa": ["Necesito pan y otra cosa para la cena.", "I need bread and one other thing for dinner."],
  "más despacio": ["¿Puede hablar más despacio, por favor?", "Can you speak more slowly, please?"],
  "más alto": ["¿Puede hablar más alto? No oigo bien.", "Can you speak louder? I cannot hear well."],
  "más bajo": ["Hable más bajo, el bebé está durmiendo.", "Speak more quietly, the baby is sleeping."],
  "más o menos": ["La estación está a diez minutos, más o menos.", "The station is about ten minutes away, more or less."],
  "por persona": ["El menú cuesta doce euros por persona.", "The menu costs twelve euros per person."],
  "en total": ["En total son veinte euros.", "In total it is twenty euros."],
  "sin azúcar": ["Quiero un café sin azúcar.", "I want a coffee without sugar."],
  "con leche": ["Para mí, un café con leche.", "For me, a coffee with milk."],
  "para llevar": ["Quiero dos bocadillos para llevar.", "I want two sandwiches to take away."],
  "aquí tiene": ["Aquí tiene su recibo y el cambio.", "Here is your receipt and the change."],
  "firme aquí": ["Firme aquí antes de entregar el documento.", "Sign here before handing in the document."],
  "espere un momento": ["Espere un momento, por favor; ya viene el médico.", "Wait a moment, please; the doctor is coming."],
  "¿me puede ayudar?": ["¿Me puede ayudar con esta dirección?", "Can you help me with this address?"],
  "¿dónde está la parada?": ["¿Dónde está la parada del autobús?", "Where is the bus stop?"],
  "¿aceptan tarjeta?": ["¿Aceptan tarjeta o solo efectivo?", "Do you accept card or only cash?"],
  "¿puedo probarme esto?": ["¿Puedo probarme esto en el probador?", "Can I try this on in the fitting room?"],
  "¿tiene otra talla?": ["¿Tiene otra talla de esta camiseta?", "Do you have another size of this T-shirt?"],
  "la cuenta, por favor": ["La cuenta, por favor; tenemos prisa.", "The bill, please; we are in a hurry."],
  "sin problema": ["Sin problema, puedo volver mañana.", "No problem, I can come back tomorrow."],
  "a mi lado": ["Mi hermano se sienta a mi lado en clase.", "My brother sits by my side in class."],
  "con cuidado": ["Cruza la calle con cuidado.", "Cross the street carefully."],
  "de nuevo": ["Repito la frase de nuevo para practicar.", "I repeat the sentence again to practise."],
  "en voz alta": ["Leo el diálogo en voz alta.", "I read the dialogue out loud."],
};

const CANDIDATES_RAW = `
noun|sello|stamp|m
noun|buzón|mailbox|m
noun|ventanilla|service window|f
noun|recibo|receipt|m
noun|resguardo|receipt slip|m
noun|mostrador|counter|m
noun|planta|floor, plant|f
noun|piso|floor, apartment|m
noun|email|email|m
noun|precio|price|m
noun|comida|meal, food|f
noun|sótano|basement|m
noun|azotea|roof terrace|f
noun|esquina|corner|f
noun|paso|step, crossing|m
noun|señal|sign|f
noun|timbre|doorbell|m
noun|botón|button|m
noun|cargador|charger|m
noun|enchufe|socket|m
noun|interruptor|switch|m
noun|pilas|batteries|f
noun|linterna|torch, flashlight|f
noun|paraguas|umbrella|m
noun|gorra|cap|f
noun|bufanda|scarf|f
noun|guante|glove|m
noun|cinturón|belt|m
noun|bolígrafo|pen|m
noun|rotulador|marker|m
noun|pegamento|glue|m
noun|tijeras|scissors|f
noun|regla|ruler|f
noun|libreta|notebook|f
noun|sacapuntas|pencil sharpener|m
noun|mochila|backpack|f
noun|cartera|wallet|f
noun|monedero|coin purse|m
noun|despensa|pantry|f
noun|fregadero|sink|m
noun|microondas|microwave|m
noun|tostador|toaster|m
noun|sartén|frying pan|f
noun|olla|pot|f
noun|cucharilla|teaspoon|f
noun|tenedor|fork|m
noun|cuchillo|knife|m
noun|servilleta|napkin|f
noun|mantel|tablecloth|m
noun|vaso|glass|m
noun|tostada|toast|f
noun|merienda|snack|f
noun|almuerzo|lunch|m
noun|sopa|soup|f
noun|arroz|rice|m
noun|pasta|pasta|f
noun|pollo|chicken|m
noun|pescado|fish|m
noun|huevo|egg|m
noun|aceite|oil|m
noun|vinagre|vinegar|m
noun|azúcar|sugar|m
noun|harina|flour|f
noun|miel|honey|f
noun|mantequilla|butter|f
noun|probador|fitting room|m
noun|escaparate|shop window|m
noun|dependiente|shop assistant|m
noun|rebaja|sale, discount|f
noun|etiqueta|label|f
noun|bolsa|bag|f
noun|maletero|boot, trunk|m
noun|taquilla|ticket office|f
noun|pasillo|aisle, corridor|m
noun|asiento|seat|m
noun|ventana|window|f
noun|cortina|curtain|f
noun|alfombra|rug|f
noun|espejo|mirror|m
noun|cajón|drawer|m
noun|estante|shelf|m
noun|almohada|pillow|f
noun|manta|blanket|f
noun|toalla|towel|f
noun|jabón|soap|m
noun|champú|shampoo|m
noun|cepillo|brush|m
noun|peine|comb|m
noun|maquinilla|razor|f
noun|esponja|sponge|f
noun|basurero|bin|m
noun|funda|cover, case|f
noun|candado|padlock|m
noun|rueda|wheel|f
noun|freno|brake|m
noun|casco|helmet|m
noun|gasolinera|petrol station|f
noun|semana|week|f
noun|quincena|fortnight|f
noun|temporada|season, period|f
noun|rutina|routine|f
noun|pausa|pause|f
noun|descanso|break, rest|m
noun|meta|goal|f
noun|duda|doubt, question|f
noun|razón|reason|f
noun|motivo|reason, motive|m
noun|recado|errand|m
noun|favor|favour|m
noun|permiso|permission|m
noun|prisa|rush|f
noun|silencio|silence|m
noun|ruido|noise|m
noun|aviso|notice|m
noun|nota|note|f
noun|lista|list|f
noun|frase|sentence|f
noun|palabra|word|f
noun|mensaje|message|m
noun|llamada|call|f
noun|cuenta|bill, account|f
noun|tarea|task|f
noun|respuesta|answer|f
noun|pregunta|question|f
noun|problema|problem|m
noun|plan|plan|m
noun|rato|short while|m
noun|paseo|walk|m
noun|visita|visit|f
noun|ducha|shower|f
noun|sabor|flavour|m
noun|olor|smell|m
noun|luz|light|f
noun|aire|air|m
verb|sellar|to stamp|Sellé el formulario antes de entregarlo.|I stamped the form before handing it in.
verb|enviar|to send|Envié un mensaje corto para confirmar la hora.|I sent a short message to confirm the time.
verb|recibir|to receive|Recibí el recibo después de pagar.|I received the receipt after paying.
verb|guardar|to keep, save|Guardé la llave en el bolsillo pequeño.|I kept the key in the small pocket.
verb|mostrar|to show|Mostré el documento en la entrada.|I showed the document at the entrance.
verb|marcar|to dial, mark|Marqué el número correcto en el teléfono.|I dialled the correct number on the phone.
verb|apuntar|to note down|Apunté la dirección en mi libreta.|I noted the address in my notebook.
verb|doblar|to fold|Doblé la carta y la puse en el sobre.|I folded the letter and put it in the envelope.
verb|pegar|to stick, paste|Pegué la etiqueta en la caja.|I stuck the label on the box.
verb|cortar|to cut|Corté el pan con cuidado.|I cut the bread carefully.
verb|lavar|to wash|Lavé la taza después del desayuno.|I washed the cup after breakfast.
verb|secar|to dry|Sequé la mesa con una servilleta.|I dried the table with a napkin.
verb|mezclar|to mix|Mezclé el arroz con un poco de aceite.|I mixed the rice with a little oil.
verb|hervir|to boil|Herví agua para preparar una sopa.|I boiled water to make soup.
verb|freír|to fry|Freí un huevo para la cena.|I fried an egg for dinner.
verb|calentar|to heat|Calenté la comida en el microondas.|I heated the food in the microwave.
verb|enfriar|to cool|Enfrié la botella antes de salir.|I cooled the bottle before leaving.
verb|probarse|to try on|Me probé la chaqueta antes de comprarla.|I tried on the jacket before buying it.
verb|devolver|to return|Devolví el producto porque estaba roto.|I returned the product because it was broken.
verb|cobrar|to charge|La tienda cobró el precio correcto.|The shop charged the correct price.
verb|envolver|to wrap|Envolví el regalo con papel azul.|I wrapped the gift with blue paper.
verb|pesar|to weigh|Pesé la fruta antes de pagar.|I weighed the fruit before paying.
verb|abrigar|to wrap up warmly|Abrigué al niño antes de salir.|I wrapped the child up warmly before going out.
verb|abrigarse|to wrap up warmly|Me abrigo cuando hace viento.|I wrap up warmly when it is windy.
verb|afeitarse|to shave|Me afeito por la mañana antes de clase.|I shave in the morning before class.
verb|peinarse|to comb one's hair|Me peino rápido antes de salir.|I comb my hair quickly before going out.
verb|vestirse|to get dressed|Me visto temprano los días de clase.|I get dressed early on class days.
verb|ducharse|to shower|Me ducho después de hacer ejercicio.|I shower after exercising.
verb|sentarse|to sit down|Me siento cerca de la ventana.|I sit near the window.
verb|levantarse|to get up|Me levanto a las siete durante la semana.|I get up at seven during the week.
verb|acostarse|to go to bed|Me acuesto temprano si estoy cansado.|I go to bed early if I am tired.
verb|despertarse|to wake up|Me despierto con la alarma del móvil.|I wake up with the phone alarm.
verb|estirarse|to stretch|Me estiro un poco después de caminar.|I stretch a little after walking.
verb|callarse|to be quiet|Me callo cuando empieza la explicación.|I am quiet when the explanation starts.
verb|sonreír|to smile|Sonreí al ver a mi amigo en la puerta.|I smiled when I saw my friend at the door.
verb|saludar|to greet|Saludé al vecino en el portal.|I greeted the neighbour in the entrance hall.
verb|despedir|to say goodbye to|Despedí a mi prima en la estación.|I said goodbye to my cousin at the station.
verb|invitar|to invite|Invité a dos amigos a comer en casa.|I invited two friends to eat at home.
verb|aceptar|to accept|Acepté la ayuda porque la necesitaba.|I accepted the help because I needed it.
verb|negar|to deny, refuse|Negué el rumor porque no era verdad.|I denied the rumour because it was not true.
verb|prestar|to lend|Presté un bolígrafo a mi compañero.|I lent a pen to my classmate.
verb|pedir|to ask for, order|Pedí una mesa junto a la ventana.|I asked for a table by the window.
verb|explicar|to explain|Expliqué el problema con palabras sencillas.|I explained the problem with simple words.
verb|contestar|to answer|Contesté la pregunta sin mirar el libro.|I answered the question without looking at the book.
verb|preguntar|to ask|Pregunté la hora en la recepción.|I asked the time at reception.
verb|repetir|to repeat|Repetí la frase para practicar la pronunciación.|I repeated the sentence to practise pronunciation.
verb|recordar|to remember|Recordé la palabra durante la conversación.|I remembered the word during the conversation.
verb|olvidar|to forget|Olvidé la contraseña y pedí ayuda.|I forgot the password and asked for help.
verb|decidir|to decide|Decidí esperar diez minutos más.|I decided to wait ten more minutes.
verb|echar|to throw, add|Eché la carta en el buzón.|I posted the letter in the mailbox.
verb|tirar|to throw away|Tiré el papel en el basurero.|I threw the paper in the bin.
verb|recoger|to pick up|Recogí la mochila antes de salir.|I picked up the backpack before leaving.
verb|ordenar|to tidy, order|Ordené el cajón por la tarde.|I tidied the drawer in the afternoon.
verb|barrer|to sweep|Barrí la cocina después de cenar.|I swept the kitchen after dinner.
verb|fregar|to mop, wash dishes|Fregué los platos después del almuerzo.|I washed the dishes after lunch.
verb|planchar|to iron|Planché la camisa para la entrevista.|I ironed the shirt for the interview.
verb|colgar|to hang up|Colgué el abrigo detrás de la puerta.|I hung the coat behind the door.
verb|encajar|to fit|La llave encajó bien en la cerradura.|The key fit well in the lock.
verb|arrancar|to start|El coche arrancó a la primera.|The car started on the first try.
verb|frenar|to brake|Frené antes del semáforo.|I braked before the traffic light.
verb|girar|to turn|Giré a la derecha en la esquina.|I turned right at the corner.
verb|aparcar|to park|Aparqué cerca de la farmacia.|I parked near the pharmacy.
verb|cruzar|to cross|Crucé la calle por el paso.|I crossed the street at the crossing.
verb|subir|to go up, get on|Subí al autobús con mi mochila.|I got on the bus with my backpack.
verb|bajar|to go down, get off|Bajé del tren en la segunda parada.|I got off the train at the second stop.
verb|reservar|to reserve|Reservé una habitación para dos noches.|I reserved a room for two nights.
verb|alojarse|to stay|Me alojé cerca de la estación.|I stayed near the station.
verb|llamar|to call|Llamé a la recepción para pedir una toalla.|I called reception to ask for a towel.
verb|avisar|to warn, let know|Avisé al profesor de mi retraso.|I let the teacher know about my delay.
verb|arreglar|to fix, tidy|Arreglé la habitación antes de estudiar.|I tidied the room before studying.
verb|practicar|to practise|Practiqué la frase varias veces en voz alta.|I practised the sentence aloud several times.
verb|mejorar|to improve|Mejoré mi pronunciación escuchando despacio.|I improved my pronunciation by listening slowly.
verb|fallar|to fail, go wrong|El plan falló porque llegamos tarde.|The plan failed because we arrived late.
verb|ayudar|to help|Ayudé a mi hermano con la tarea.|I helped my brother with the task.
verb|cuidar|to take care of|Cuidé la planta durante el verano.|I took care of the plant during the summer.
verb|apagar|to turn off|Apagué la luz antes de dormir.|I turned off the light before sleeping.
verb|encender|to turn on|Encendí la lámpara para leer.|I turned on the lamp to read.
verb|ahorrar|to save|Ahorré un poco cada semana.|I saved a little every week.
verb|gastar|to spend|Gasté menos en comida esta semana.|I spent less on food this week.
verb|descansar|to rest|Descansé media hora después de clase.|I rested for half an hour after class.
verb|respirar|to breathe|Respiré hondo antes de hablar.|I breathed deeply before speaking.
verb|escoger|to choose|Escogí una opción más barata.|I chose a cheaper option.
verb|rellenar|to fill in|Rellené el formulario con mi dirección.|I filled in the form with my address.
verb|firmar|to sign|Firmé el permiso en la ventanilla.|I signed the permission form at the service window.
adj|claro|clear
adj|oscuro|dark
adj|luminoso|bright
adj|dulce|sweet
adj|salado|salty
adj|amargo|bitter
adj|picante|spicy
adj|blando|soft
adj|duro|hard
adj|seco|dry
adj|mojado|wet
adj|roto|broken
adj|lleno|full
adj|vacío|empty
adj|listo|ready, smart
adj|preparado|prepared, ready
adj|aburrido|boring, bored
adj|divertido|fun, amusing
adj|ordenado|tidy
adj|desordenado|messy
adj|estrecho|narrow
adj|ancho|wide
adj|pesado|heavy
adj|ligero|light
adj|caliente|hot
adj|frío|cold
adj|templado|warm, mild
adj|suave|soft, gentle
adj|áspero|rough
adj|redondo|round
adj|cuadrado|square
adj|moderno|modern
adj|antiguo|old, ancient
adj|nuevo|new
adj|normal|normal
adj|posible|possible
adj|necesario|required, necessary
adj|completo|complete
adj|puntual|punctual
adj|educado|polite
adj|amable|kind
adj|serio|serious
adj|alegre|cheerful
adj|joven|young
adj|mayor|older
adv|despacio|slowly
adv|deprisa|quickly
adv|temprano|early
adv|tarde|late
adv|ayer|yesterday
adv|mañana|tomorrow
adv|siempre|always
adv|nunca|never
adv|también|also
adv|tampoco|neither, not either
adv|aquí|here
adv|allí|there
noun|grifo|tap, faucet|m
noun|lavabo|washbasin|m
noun|inodoro|toilet|m
noun|bañera|bathtub|f
noun|cuna|cot, crib|f
noun|cómoda|chest of drawers|f
noun|zapatero|shoe rack|m
noun|escalón|step|m
noun|llavero|key ring|m
noun|mesilla|bedside table|f
noun|recogedor|dustpan|m
noun|suavizante|fabric softener|m
noun|colcha|bedspread|f
noun|edredón|duvet|m
noun|bota|boot|f
noun|boleto|ticket|m
noun|móvil|mobile phone|m
noun|celular|cell phone|m
noun|foto|photo|f
noun|adaptador|adapter|m
noun|mañana|morning|f
noun|noche|night|f
noun|mediodía|midday|m
noun|madrugada|early morning|f
noun|primavera|spring|f
noun|verano|summer|m
noun|otoño|autumn|m
noun|invierno|winter|m
noun|quiosco|kiosk|m
noun|cafetería|café|f
noun|museo|museum|m
noun|piscina|swimming pool|f
noun|gimnasio|gym|m
noun|colegio|school|m
noun|instituto|secondary school|m
noun|universidad|university|f
noun|fábrica|factory|f
noun|fila|line, queue|f
noun|vendedor|salesperson|m
noun|compra|purchase|f
noun|venta|sale|f
noun|carné|ID card, licence|m
noun|plano|map, plan|m
noun|folleto|leaflet|m
noun|vuelo|flight|m
noun|tranvía|tram|m
noun|pulsera|bracelet|f
noun|collar|necklace|m
noun|tirita|plaster, bandage|f
noun|cuello|neck|m
noun|muñeca|wrist|f
noun|uña|nail|f
noun|pecho|chest|m
noun|barriga|belly|f
noun|cintura|waist|f
noun|talón|heel|m
noun|labio|lip|m
noun|diente|tooth|m
noun|lengua|tongue|f
noun|ceja|eyebrow|f
noun|barba|beard|f
noun|bigote|moustache|m
noun|espalda|back|f
noun|cabeza|head|f
noun|melón|melon|m
noun|cereales|cereal|m
noun|dormitorio|bedroom|m
noun|jardín|garden|m
noun|camino|path, road|m
noun|risa|laughter|f
noun|lágrima|tear|f
noun|beso|kiss|m
noun|saludo|greeting|m
verb|abrochar|to fasten
verb|abrocharse|to fasten one's clothes
verb|acostar|to put to bed
verb|afeitar|to shave
verb|bostezar|to yawn
verb|brincar|to jump
verb|callar|to be quiet
verb|cepillar|to brush
verb|cepillarse|to brush oneself
verb|colorear|to colour in
verb|coser|to sew
verb|maquillarse|to put on makeup
verb|peinar|to comb
verb|perfumar|to perfume
verb|perfumarse|to put on perfume
verb|saltar|to jump
verb|sentar|to seat
verb|silbar|to whistle
verb|telefonear|to phone
verb|zapatear|to tap one's feet
verb|masticar|to chew
verb|batir|to beat, whisk
verb|rallar|to grate
verb|cansarse|to get tired
verb|caerse|to fall
verb|empujar|to push
verb|jalar|to pull
verb|sujetar|to hold
verb|soltar|to let go
verb|apretar|to press, tighten
verb|pulsar|to press
verb|enchufar|to plug in
verb|desenchufar|to unplug
verb|quedarse|to stay
verb|alejarse|to move away
verb|torcer|to turn, twist
verb|continuar|to continue
verb|montar|to ride, assemble
verb|pedalear|to pedal
verb|patinar|to skate
verb|pasear|to stroll
verb|volar|to fly
verb|narrar|to narrate
verb|multiplicar|to multiply
verb|dormir|to sleep
verb|soñar|to dream
verb|roncar|to snore
verb|madrugar|to get up early
verb|trasnochar|to stay up late
verb|brindar|to toast
verb|regalar|to give as a gift
verb|hallar|to find
verb|descubrir|to discover
adj|fácil|easy
adj|difícil|difficult
adj|cómodo|comfortable
adj|incómodo|uncomfortable
adj|libre|free, available
adj|integral|wholemeal
adj|desnatado|skimmed
adj|artificial|artificial
adj|tardío|late
adj|dulce|sweet
adj|salado|salty
adj|amargo|bitter
adj|picante|spicy
adj|seco|dry
adj|mojado|wet
adj|roto|broken
adj|divertido|fun
adj|ordenado|tidy
adj|desordenado|messy
adj|ancho|wide
adj|pesado|heavy
adj|ligero|light
adj|caliente|hot
adj|frío|cold
adj|templado|warm, mild
adj|suave|soft, gentle
adj|redondo|round
adj|cuadrado|square
adj|nuevo|new
adj|posible|possible
adj|necesario|necessary
adj|completo|complete
adj|puntual|punctual
adj|alegre|cheerful
adj|contento|happy
adj|triste|sad
adj|raro|strange
adj|común|common
adv|luego|later
adv|antes|before
adv|casi|almost
adv|todavía|still, yet
adv|ya|already
`;

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, data) {
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

function normalise(value) {
  return String(value || "").normalize("NFC").trim();
}

function comparable(value) {
  return normalise(value).toLowerCase();
}

function parseCandidates() {
  return CANDIDATES_RAW.trim()
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [pos, lemma, translation_en, genderOrExample, example, example_en] = line.split("|").map(normalise);
      if (pos === "noun") return { pos, lemma, translation_en, gender: genderOrExample || "m" };
      if (pos === "verb") return { pos, lemma, translation_en, example: genderOrExample, example_en: example };
      return { pos, lemma, translation_en };
    });
}

function collectUsedExceptBad(badKeys) {
  const used = new Set();
  const levels = readJson(path.join(DATA_DIR, "levels.json")).levels || [];
  for (const level of levels) {
    const index = readJson(path.join(LEVELS_DIR, level.id, "index.json"));
    for (const group of index.groups || []) {
      const data = readJson(path.join(LEVELS_DIR, level.id, `${group.id}.json`));
      for (const word of data.words || []) {
        const key = `${level.id}/${group.id}/${comparable(word.lemma)}`;
        if (!badKeys.has(key)) used.add(comparable(word.lemma));
      }
    }
  }
  return used;
}

function article(word) {
  if (comparable(word.lemma) === "agua") return "el";
  return word.gender === "f" ? "la" : "el";
}

const BODY_NOUNS = new Set("cuello muñeca uña pecho barriga cintura talón labio diente lengua ceja barba bigote espalda cabeza ojo nariz boca pelo cara brazo pierna dedo estómago corazón mano pie".split(" "));
const TIME_NOUNS = new Set("día hora semana mes año minuto fecha lunes martes miércoles jueves viernes sábado domingo enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre mañana noche mediodía madrugada primavera verano otoño invierno quincena temporada".split(" "));
const PLACE_NOUNS = new Set("comisaría quiosco cafetería museo piscina gimnasio colegio instituto universidad fábrica zapatería papelería librería juguetería floristería frutería pescadería pastelería panadería carnicería supermercado biblioteca teatro iglesia restaurante parque banco hospital farmacia hotel playa estación tienda".split(" "));
const HOME_NOUNS = new Set("casa salón comedor pasillo terraza balcón suelo techo pared lámpara sofá armario nevera horno lavadora jabón toalla cepillo papel caja reloj ordenador televisión planta piso grifo lavabo inodoro bañera cuna cómoda zapatero escalón llavero mesilla recogedor suavizante colcha edredón manta almohada sábana enchufe interruptor fregadero dormitorio jardín alfombra espejo cama puerta ventana habitación baño aire luz".split(" "));
const FOOD_NOUNS = new Set("agua pan leche manzana queso arroz huevo pollo carne fruta verdura café azúcar sal sopa plato cuchillo tenedor cuchara fresa plátano pera uva limón patata tomate cebolla ensalada bocadillo tarta yogur zumo cerveza botella servilleta menú hambre sed maíz cereal taza cena almuerzo comida tostada cereales melón sopa pasta aceite vinagre harina miel mantequilla".split(" "));
const TRANSPORT_NOUNS = new Set("rueda freno andén casco boleto vuelo tranvía autobús tren bicicleta taxi metro camión moto barco carretera semáforo cruce esquina camino paso".split(" "));
const CLOTHING_NOUNS = new Set("bota pulsera collar bolso cinturón chaqueta jersey camisa gorra gafas abrigo vestido calcetín sombrero paraguas zapato pantalón ropa talla probador".split(" "));
const NOUN_EXAMPLES = {
  necesidad: ["Tengo una necesidad concreta: practicar cada día.", "I have a specific need: to practise every day."],
  deseo: ["Mi deseo es hablar español con más confianza.", "My wish is to speak Spanish with more confidence."],
  preferencia: ["Mi preferencia es estudiar por la mañana.", "My preference is to study in the morning."],
  prisa: ["Tengo prisa porque el autobús sale pronto.", "I am in a hurry because the bus leaves soon."],
  tarea: ["Termino la tarea antes de cenar.", "I finish the task before dinner."],
  plan: ["Mi plan es repasar veinte palabras.", "My plan is to review twenty words."],
  rato: ["Estudio un rato después de comer.", "I study for a short while after eating."],
  paseo: ["Doy un paseo corto por el barrio.", "I take a short walk around the neighbourhood."],
  mostrador: ["Pregunto en el mostrador de información.", "I ask at the information counter."],
  sabor: ["El sabor de la sopa es suave.", "The flavour of the soup is mild."],
  olor: ["El olor del pan recién hecho es agradable.", "The smell of freshly made bread is pleasant."],
  compra: ["Hago la compra los sábados.", "I do the shopping on Saturdays."],
  venta: ["La venta empieza a las diez.", "The sale starts at ten."],
  silencio: ["Guardo silencio durante la explicación.", "I keep quiet during the explanation."],
};

function makeExample(word) {
  const lemma = word.lemma;
  if (word.pos === "phrase" && PHRASE_EXAMPLES[comparable(lemma)]) return PHRASE_EXAMPLES[comparable(lemma)];
  if (word.example && word.example_en) return [word.example, word.example_en];

  if (word.pos === "noun") {
    const key = comparable(lemma);
    if (NOUN_EXAMPLES[key]) return NOUN_EXAMPLES[key];
    if (word.tag === "Numbers") {
      return [`Escribí el número ${lemma} en el formulario.`, `I wrote the number ${word.translation_en} on the form.`];
    }
    if (TIME_NOUNS.has(key) || word.tag === "Time") {
      return [`Marco ${article(word)} ${lemma} en el calendario.`, `I mark the ${word.translation_en} on the calendar.`];
    }
    if (BODY_NOUNS.has(key)) {
      return [`Me duele ${article(word)} ${lemma} después de correr.`, `My ${word.translation_en} hurts after running.`];
    }
    if (PLACE_NOUNS.has(key)) {
      return [`${article(word)[0].toUpperCase()}${article(word).slice(1)} ${lemma} está cerca del centro.`, `The ${word.translation_en} is near the centre.`];
    }
    if (HOME_NOUNS.has(key)) {
      return [`Dejé ${article(word)} ${lemma} junto a la puerta.`, `I left the ${word.translation_en} by the door.`];
    }
    if (FOOD_NOUNS.has(key)) {
      return [`Puse ${article(word)} ${lemma} en la mesa para la cena.`, `I put the ${word.translation_en} on the table for dinner.`];
    }
    if (TRANSPORT_NOUNS.has(key)) {
      return [`Veo ${article(word)} ${lemma} en la estación.`, `I see the ${word.translation_en} at the station.`];
    }
    if (CLOTHING_NOUNS.has(key)) {
      return [`Llevo ${article(word)} ${lemma} cuando salgo de casa.`, `I take the ${word.translation_en} when I leave home.`];
    }
    if (word.tag === "Family") {
      return [`Hablo con mi ${lemma} por la tarde.`, `I talk with my ${word.translation_en} in the afternoon.`];
    }
    if (word.tag === "People") {
      return [`Hablo con ${article(word)} ${lemma} en la escuela.`, `I talk with the ${word.translation_en} at school.`];
    }
    if (word.tag === "Body") {
      return [`Me duele ${article(word)} ${lemma} después de correr.`, `My ${word.translation_en} hurts after running.`];
    }
    if (word.tag === "Animals") {
      return [`Veo ${article(word)} ${lemma} en el campo.`, `I see the ${word.translation_en} in the countryside.`];
    }
    if (["Food", "Food & drink"].includes(word.tag)) {
      return [`Puse ${article(word)} ${lemma} en la mesa para la cena.`, `I put the ${word.translation_en} on the table for dinner.`];
    }
    if (["Home", "Objects"].includes(word.tag)) {
      return [`Dejé ${article(word)} ${lemma} junto a la puerta.`, `I left the ${word.translation_en} by the door.`];
    }
    if (["Place", "Places", "City"].includes(word.tag)) {
      return [`${article(word)[0].toUpperCase()}${article(word).slice(1)} ${lemma} está cerca del centro.`, `The ${word.translation_en} is near the centre.`];
    }
    if (word.tag === "Weather" || word.tag === "Nature") {
      return [`Hoy hablamos de ${article(word)} ${lemma} en clase.`, `Today we talk about the ${word.translation_en} in class.`];
    }
    if (word.tag === "Transport") {
      return [`Uso ${article(word)} ${lemma} para llegar al centro.`, `I use the ${word.translation_en} to get to the centre.`];
    }
    if (["Travel", "Transport", "Services", "Shopping"].includes(word.tag)) {
      return [`Llevo ${article(word)} ${lemma} cuando salgo de casa.`, `I take the ${word.translation_en} when I leave home.`];
    }
    if (["Communication", "Classroom", "Education", "School"].includes(word.tag)) {
      return [`Anoté ${article(word)} ${lemma} en mi cuaderno.`, `I wrote down the ${word.translation_en} in my notebook.`];
    }
    if (["Opinion", "Opinions", "Abstract", "Evaluation"].includes(word.tag)) {
      return [`Tengo ${article(word)} ${lemma} antes de responder.`, `I have the ${word.translation_en} before answering.`];
    }
    return [`Uso ${article(word)} ${lemma} en una frase diaria.`, `I use the ${word.translation_en} in an everyday sentence.`];
  }

    if (word.pos === "verb") {
    if (lemma.endsWith("se")) {
      return [`Puedo ${lemma.replace(/se$/, "me")} antes de salir.`, `I can ${word.translation_en.replace(/^to /, "")} before going out.`];
    }
    return [`Hoy puedo ${lemma} en una situación real.`, `Today I can ${word.translation_en.replace(/^to /, "")} in a real situation.`];
  }

  if (word.pos === "adj") {
    return [`El ejemplo es ${lemma} y fácil de recordar.`, `The example is ${word.translation_en} and easy to remember.`];
  }

  if (word.pos === "adv") {
    return [`Hoy estudio ${lemma} durante diez minutos.`, `Today I study ${word.translation_en} for ten minutes.`];
  }

  return [word.example, word.example_en];
}

function hasBadExample(word) {
  const combined = `${word.example || ""}\n${word.example_en || ""}`;
  return BAD_EXAMPLE_PATTERNS.some((pattern) => pattern.test(combined));
}

function shouldRefreshExample(word) {
  if (hasBadExample(word)) return true;
  const example = String(word.example || "");
  return /importante para hablar|Hay un|Hay una|Necesito un|Necesito una|Busco un|Busco una|Compré un|Compré una|situación sencilla|hacer la gestión|Llevo .+ cuando salgo de casa|Uso .+ para llegar al centro|Puse .+ en la mesa para la cena|Anoté .+ en mi cuaderno|Tengo .+ antes de responder|Uso .+ en una frase diaria|El ejercicio parece|Hoy puedo .+ sin pedir ayuda|Quiero .+ con calma antes de salir|There is |I bought |I need .* for today|I am looking for .* for class/i.test(example);
}

function isBadMultiWord(word) {
  return SINGLE_WORD_POS.has(word.pos) && /\s/.test(normalise(word.lemma));
}

function main() {
  const index = readJson(path.join(LEVELS_DIR, TARGET_LEVEL, "index.json"));
  const groups = index.groups || [];
  const groupData = groups.map((group) => readJson(path.join(LEVELS_DIR, TARGET_LEVEL, `${group.id}.json`)));

  const badKeys = new Set();
  for (const data of groupData) {
    for (const word of data.words || []) {
      if (isBadMultiWord(word)) badKeys.add(`${TARGET_LEVEL}/${data.id}/${comparable(word.lemma)}`);
    }
  }

  const used = collectUsedExceptBad(badKeys);
  const candidates = parseCandidates();
  const pools = { noun: [], verb: [], adj: [], adv: [] };
  for (const item of candidates) {
    const key = comparable(item.lemma);
    if (!pools[item.pos] || /\s/.test(item.lemma) || used.has(key)) continue;
    pools[item.pos].push(item);
    used.add(key);
  }
  const cursors = { noun: 0, verb: 0, adj: 0, adv: 0 };
  const replacementCounts = { noun: 0, verb: 0, adj: 0, adv: 0 };
  const missing = [];

  for (const data of groupData) {
    for (const word of data.words || []) {
      if (isBadMultiWord(word)) {
        const replacement = pools[word.pos][cursors[word.pos]++];
        if (!replacement) {
          missing.push(`${data.id}/${word.pos}/${word.lemma}`);
          continue;
        }
        replacementCounts[word.pos] += 1;
        word.lemma = replacement.lemma;
        word.translation_en = replacement.translation_en;
        if (word.pos === "noun") word.gender = replacement.gender;
        else delete word.gender;
        const [example, example_en] = makeExample({ ...replacement, tag: word.tag });
        word.example = example;
        word.example_en = example_en;
      } else {
        const fixedTranslation = TRANSLATION_FIXES[comparable(word.lemma)];
        if (fixedTranslation) word.translation_en = fixedTranslation;
        if (shouldRefreshExample(word)) {
          const cleanWord = { ...word };
          delete cleanWord.example;
          delete cleanWord.example_en;
          const [example, example_en] = makeExample(cleanWord);
          word.example = example;
          word.example_en = example_en;
        }
      }
    }
  }

  if (missing.length) {
    throw new Error(`Not enough replacement candidates:\n${missing.join("\n")}`);
  }

  for (const data of groupData) {
    writeJson(path.join(LEVELS_DIR, TARGET_LEVEL, `${data.id}.json`), data);
  }

  const rows = ["level,group,lemma"];
  const seen = new Set();
  const levels = readJson(path.join(DATA_DIR, "levels.json")).levels || [];
  for (const level of levels) {
    const levelIndex = readJson(path.join(LEVELS_DIR, level.id, "index.json"));
    for (const group of levelIndex.groups || []) {
      const data = readJson(path.join(LEVELS_DIR, level.id, `${group.id}.json`));
      for (const word of data.words || []) {
        const key = comparable(word.lemma);
        if (seen.has(key)) throw new Error(`Duplicate lemma while rebuilding master: ${word.lemma}`);
        seen.add(key);
        rows.push(`${level.id},${group.id},${word.lemma}`);
      }
    }
  }
  fs.writeFileSync(path.join(DATA_DIR, "vocab-master.csv"), `${rows.join("\n")}\n`);

  console.log(JSON.stringify({ level: TARGET_LEVEL, replaced: replacementCounts, masterTotal: seen.size }, null, 2));
}

main();
