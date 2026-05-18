#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.resolve(__dirname, "../data/EspVocab");
const LEVELS_DIR = path.join(DATA_DIR, "levels");
const TARGET_LEVEL = "a2";
const TARGET_POS_COUNTS = { noun: 45, verb: 28, adj: 15, adv: 5, phrase: 7 };
const SINGLE_WORD_POS = new Set(["noun", "verb", "adj", "adv"]);

const GROUPS = [
  {
    id: "group-1",
    title: "Rutina y casa · Daily life that actually happens",
    focus: "Concrete A2 words for mornings, chores, clothing, rooms, small problems and everyday choices.",
    tag: "Daily life",
    nouns: `
despertador|alarm clock|m;almohada|pillow|f;sábana|sheet|f;manta|blanket|f;toalla|towel|f;cepillo|brush|m;pasta|toothpaste|f;afeitadora|razor|f;peine|comb|m;secador|hair dryer|m;espejo|mirror|m;cajón|drawer|m;armario|wardrobe|m;percha|hanger|f;chaqueta|jacket|f;abrigo|coat|m;bufanda|scarf|f;guante|glove|m;cinturón|belt|m;bolsillo|pocket|m;cordón|shoelace|m;cremallera|zipper|f;mancha|stain|f;arruga|wrinkle|f;lavadora|washing machine|f;lavavajillas|dishwasher|m;detergente|detergent|m;escoba|broom|f;fregona|mop|f;cubo|bucket|m;trapo|cloth|m;basura|trash|f;papelera|trash can|f;recado|errand|m;llave|key|f;cerradura|lock|f;enchufe|socket|m;interruptor|switch|m;bombilla|light bulb|f;persiana|blind|f;cortina|curtain|f;balcón|balcony|m;terraza|terrace|f;pasillo|hallway|m;escalera|stairs|f;portero|doorman|m;paquete|package|m;repartidor|delivery worker|m;vecindario|neighbourhood|m;avería|breakdown|f;goteo|drip|m
`,
    verbs: `
despertarse|to wake up;apresurarse|to hurry;ducharse|to shower;peinarse|to comb one's hair;afeitarse|to shave;vestirse|to get dressed;probarse|to try on;ponerse|to put on;quitarse|to take off;colgar|to hang up;doblar|to fold;planchar|to iron;lavar|to wash;secar|to dry;barrer|to sweep;fregar|to mop;ordenar|to tidy;tirar|to throw away;reciclar|to recycle;cerrar|to close;abrir|to open;apagar|to turn off;encender|to turn on;sonar|to ring;funcionar|to work;estropearse|to break down;arreglar|to fix;olvidarse|to forget
`,
    adjs: `
cotidiano|everyday;limpio|clean;sucio|dirty;estrecho|narrow;ancho|wide;oscuro|dark;claro|light;ordenado|tidy;desordenado|messy;práctico|practical;gastado|worn-out;mojado|wet;seco|dry;suave|soft;duro|hard;casero|home-made
`,
    advs: `temprano|early;tarde|late;despacio|slowly;rápido|quickly;adentro|inside;afuera|outside`,
    phrases: `
tener prisa|to be in a hurry;dejar algo encendido|to leave something on;quedarse dormido|to oversleep;poner la lavadora|to run the washing machine;hacer la cama|to make the bed;salir pitando|to rush out;estar hecho un lío|to be in a mess
`,
  },
  {
    id: "group-2",
    title: "Ciudad y transporte · Getting around without panic",
    focus: "Useful city, housing, transport and service vocabulary for moving through real places.",
    tag: "City & transport",
    nouns: `
acera|pavement|f;calzada|roadway|f;semáforo|traffic light|m;cruce|crossing|m;esquina|corner|f;rotonda|roundabout|f;carril|lane|m;túnel|tunnel|m;puente|bridge|m;andén|platform|m;taquilla|ticket window|f;abono|travel pass|m;transbordo|transfer|m;trayecto|journey|m;parada|stop|f;vagón|train carriage|m;maletero|trunk|m;volante|steering wheel|m;peatón|pedestrian|m;ciclista|cyclist|m;conductor|driver|m;pasajero|passenger|m;atasco|traffic jam|m;desvío|detour|m;gasolinera|petrol station|f;peaje|toll|m;aparcamiento|parking lot|m;garaje|garage|m;recorrido|route|m;destino|destination|m;orilla|riverbank|f;avenida|avenue|f;callejón|alley|m;manzana|city block|f;buzón|mailbox|m;portón|large gate|m;fachada|facade|f;azotea|rooftop|f;sótano|basement|m;inquilino|tenant|m;casero|landlord|m;fianza|deposit|f;mudanza|move|f;alquiler|rent|m;reforma|renovation|f;humedad|dampness|f;grieta|crack|f;ascensor|lift|m;timbre|doorbell|m;portería|entrance hall|f;consigna|locker room|f
`,
    verbs: `
atravesar|to cross;girar|to turn;seguir|to continue;subir|to get on;bajar|to get off;circular|to circulate;aparcar|to park;adelantar|to overtake;frenar|to brake;chocar|to crash;perderse|to get lost;orientarse|to find one's way;desviarse|to take a detour;alquilar|to rent;mudarse|to move house;convivir|to live together;reclamar|to complain;avisar|to notify;llamar|to call;firmar|to sign;renovar|to renew;compartir|to share;colocarse|to stand;esperar|to wait;cancelar|to cancel;reservar|to reserve;facturar|to check in luggage;embarcar|to board
`,
    adjs: `
céntrico|central;lejano|far away;cercano|nearby;peatonal|pedestrian-only;subterráneo|underground;urbano|urban;residencial|residential;ruidoso|noisy;tranquilo|quiet;luminoso|bright;amueblado|furnished;compartido|shared;disponible|available;puntual|punctual;perdido|lost;accesible|accessible
`,
    advs: `cerca|nearby;lejos|far away;delante|in front;detrás|behind;alrededor|around;recto|straight ahead;enfrente|opposite;encima|above;debajo|below;adonde|where to`,
    phrases: `
dar una vuelta|to take a walk;hacer cola|to queue;ir con tiempo|to leave enough time;perder el autobús|to miss the bus;cambiar de línea|to change lines;estar de paso|to be passing through;quedarse tirado|to be stranded
`,
  },
  {
    id: "group-3",
    title: "Salud y cuerpo · Symptoms, care and recovery",
    focus: "A2 vocabulary for explaining health problems, appointments, medicine and how you feel.",
    tag: "Health",
    nouns: `
síntoma|symptom|m;garganta|throat|f;oído|ear|m;muela|molar|f;rodilla|knee|f;hombro|shoulder|m;codo|elbow|m;tobillo|ankle|m;hueso|bone|m;músculo|muscle|m;piel|skin|f;sangre|blood|f;pulso|pulse|m;tos|cough|f;estornudo|sneeze|m;resfriado|cold|m;gripe|flu|f;alergia|allergy|f;herida|wound|f;quemadura|burn|f;golpe|knock, blow|m;mareo|dizziness|m;náusea|feeling sick|f;dolor|pain|m;fiebre|fever|f;cansancio|tiredness|m;malestar|discomfort|m;pastilla|pill|f;jarabe|syrup|m;pomada|ointment|f;venda|bandage|f;termómetro|thermometer|m;receta|prescription|f;vacuna|vaccine|f;inyección|injection|f;ambulancia|ambulance|f;urgencia|emergency|f;consulta|appointment|f;tratamiento|treatment|m;revisión|check-up|f;seguro|insurance|m;dieta|diet|f;descanso|rest|m;sueño|sleep|m;ánimo|mood|m;estrés|stress|m;ansiedad|anxiety|f;paciente|patient|m;dentista|dentist|m;farmacéutico|pharmacist|m;fisio|physiotherapist|m
`,
    verbs: `
toser|to cough;estornudar|to sneeze;respirar|to breathe;sangrar|to bleed;doler|to hurt;hincharse|to swell;marearse|to feel dizzy;vomitar|to vomit;curarse|to heal;recuperarse|to recover;descansar|to rest;cuidarse|to take care of oneself;pesar|to weigh;medir|to measure;revisar|to check;recetar|to prescribe;vacunarse|to get vaccinated;protegerse|to protect oneself;empeorar|to get worse;mejorar|to improve;contagiarse|to catch an illness;evitar|to avoid;aguantar|to put up with;notar|to notice;sentirse|to feel;probar|to try;tragar|to swallow;relajarse|to relax
`,
    adjs: `
sano|healthy;enfermo|ill;grave|serious;leve|mild;agudo|sharp;crónico|long-term;hinchado|swollen;roto|broken;cansado|tired;débil|weak;mareado|dizzy;alérgico|allergic;nervioso|nervous;tranquilo|calm;urgente|urgent;contagioso|contagious
`,
    advs: `regular|so-so;mejor|better;peor|worse;últimamente|lately;cuidadosamente|carefully;levemente|mildly;gravemente|seriously;suavemente|gently;profundamente|deeply;recientemente|recently`,
    phrases: `
pedir cita|to make an appointment;tener fiebre|to have a fever;sentirse fatal|to feel awful;guardar reposo|to rest as prescribed;tomarse la tensión|to have one's blood pressure taken;estar de baja|to be on sick leave;ponerse mejor|to get better
`,
  },
  {
    id: "group-4",
    title: "Estudio y trabajo · Practical school and job language",
    focus: "Words for classes, tasks, applications, interviews, schedules and small responsibilities.",
    tag: "Study & work",
    nouns: `
beca|scholarship|f;matrícula|enrolment|f;asignatura|subject|f;apunte|note|m;resumen|summary|m;redacción|composition|f;borrador|draft|m;ensayo|essay|m;diapositiva|slide|f;pizarra|board|f;tiza|chalk|f;rotulador|marker|m;carpeta|folder|f;archivo|file|m;plazo|deadline|m;entrega|submission|f;nota|grade|f;calificación|grade, mark|f;suspenso|fail grade|m;aprobado|pass grade|m;práctica|internship|f;currículum|CV|m;puesto|position|m;turno|shift|m;jornada|working day|f;sueldo|salary|m;contrato|contract|m;plantilla|staff|f;jefe|boss|m;compañero|colleague|m;cliente|customer|m;reunión|meeting|f;llamada|call|f;correo|email|m;adjunto|attachment|m;formulario|form|m;solicitud|application|f;requisito|requirement|m;certificado|certificate|m;permiso|permit|m;firma|signature|f;copia|copy|f;impresora|printer|f;fotocopia|photocopy|f;mostrador|counter|m;ventanilla|service window|f;turno|turn|m;sello|stamp|m;comprobante|proof, receipt|m;capacitación|training|f
`,
    verbs: `
matricularse|to enrol;repasar|to review;subrayar|to underline;resumir|to summarise;redactar|to draft;entregar|to submit;aprobar|to pass;suspender|to fail;corregir|to correct;memorizar|to memorise;exponer|to present;practicar|to practise;solicitar|to apply for;adjuntar|to attach;rellenar|to fill in;tramitar|to process;autorizar|to authorise;contratar|to hire;cobrar|to earn, charge;atender|to serve;contestar|to answer;confirmar|to confirm;aplazar|to postpone;archivar|to file;imprimir|to print;fotocopiar|to photocopy;capacitarse|to train;coordinar|to coordinate;calificar|to grade;examinarse|to take an exam;inscribirse|to sign up;renunciar|to resign;despedir|to dismiss;ascender|to promote;organizarse|to organise oneself;presentarse|to show up, apply;teclear|to type;grapar|to staple;encuadernar|to bind
`,
    adjs: `
obligatorio|required;opcional|optional;pendiente|pending;completo|complete;incompleto|incomplete;correcto|correct;incorrecto|incorrect;formal|formal;laboral|work-related;académico|academic;práctico|practical;responsable|responsible;flexible|flexible;fijo|fixed;temporal|temporary;adjunto|attached;presencial|in-person;remoto|remote;escrito|written;oral|spoken;semanal|weekly;mensual|monthly;puntual|on time;atrasado|late;firmado|signed;sellado|stamped;impreso|printed;grapado|stapled
`,
    advs: `formalmente|formally;correctamente|correctly;puntualmente|punctually;previamente|beforehand;claramente|clearly;presencialmente|in person;remotamente|remotely;semanalmente|weekly;mensualmente|monthly;oralmente|orally;laboralmente|professionally`,
    phrases: `
entregar a tiempo|to submit on time;estar pendiente de|to keep an eye on;ponerse al día|to catch up;quedar en algo|to agree on something;estar a cargo de|to be in charge of;cumplir con|to comply with;hacer una entrevista|to do an interview
`,
  },
  {
    id: "group-5",
    title: "Relaciones y ocio · People, plans and feelings",
    focus: "A2 vocabulary for friends, invitations, plans, misunderstandings, hobbies and emotions.",
    tag: "People & leisure",
    nouns: `
amistad|friendship|f;conocido|acquaintance|m;pareja|partner|f;compañía|company|f;confianza|trust|f;respeto|respect|m;cariño|affection|m;abrazo|hug|m;sonrisa|smile|f;broma|joke|f;secreto|secret|m;promesa|promise|f;culpa|guilt|f;disculpa|apology|f;malentendido|misunderstanding|m;enfado|anger|m;vergüenza|embarrassment|f;orgullo|pride|m;miedo|fear|m;alegría|joy|f;tristeza|sadness|f;sorpresa|surprise|f;invitación|invitation|f;cumpleaños|birthday|m;celebración|celebration|f;despedida|farewell|f;quedada|meet-up|f;afición|hobby|f;pasatiempo|pastime|m;entrada|ticket|f;escenario|stage|m;concierto|concert|m;obra|play, work|f;actor|performer|m;actriz|actress|f;personaje|character|m;capítulo|chapter|m;serie|series|f;novela|novel|f;cuento|short story|m;baile|dance|m;ensayo|rehearsal|m;guitarra|guitar|f;tambor|drum|m;fotografía|photography|f;exposición|exhibition|f;juego|game|m;equipo|team|m;entrenamiento|training session|m;competición|competition|f
`,
    verbs: `
confiar|to trust;perdonar|to forgive;disculparse|to apologise;prometer|to promise;cumplir|to keep, fulfil;fallar|to let down;molestar|to bother;enfadarse|to get angry;calmarse|to calm down;alegrarse|to be glad;atreverse|to dare;animar|to cheer up;invitar|to invite;quedar|to meet up;celebrar|to celebrate;despedirse|to say goodbye;abrazar|to hug;sonreír|to smile;reírse|to laugh;charlar|to chat;interrumpir|to interrupt;compartir|to share;ensayar|to rehearse;actuar|to perform;tocar|to play;dibujar|to draw;competir|to compete;bromear|to joke;cotillear|to gossip;llorar|to cry;gritar|to shout;susurrar|to whisper;besar|to kiss;saludar|to greet;aplaudir|to applaud;animarse|to cheer up;emocionarse|to get excited;avergonzarse|to get embarrassed;pelearse|to fight;reconciliarse|to reconcile;coquetear|to flirt;ligar|to flirt, hook up;extrañar|to miss;acompañar|to go with;presentar|to introduce;felicitar|to congratulate;criticar|to criticise;bailar|to dance;coleccionar|to collect;entrenarse|to train;apuntarse|to sign up;estrenar|to use for the first time;aburrirse|to get bored
`,
    adjs: `
sincero|sincere;amable|kind;egoísta|selfish;generoso|generous;fiel|loyal;celoso|jealous;tímido|shy;orgulloso|proud;divertido|fun;aburrido|boring;emocionado|excited;avergonzado|embarrassed;sensible|sensitive;creativo|creative;deportivo|sporty;artístico|artistic;gracioso|funny;romántico|romantic;amistoso|friendly;antipático|unpleasant;extrovertido|outgoing;introvertido|introverted;popular|well-liked;solitario|solitary;cariñoso|affectionate;mentiroso|lying;honrado|honest;comprensivo|understanding;celoso|jealous;atrevido|bold
`,
    advs: `sinceramente|sincerely;mutuamente|mutually;juntos|together;aparte|separately;repentinamente|suddenly;alegremente|cheerfully;tímidamente|shyly;cariñosamente|affectionately;socialmente|socially`,
    phrases: `
llevarse bien|to get along;hacer las paces|to make peace;pedir perdón|to apologise;guardar un secreto|to keep a secret;caer bien|to make a good impression;pasarlo bien|to have a good time;dar vergüenza|to be embarrassing
`,
  },
  {
    id: "group-6",
    title: "Compras y comida · Real errands and small decisions",
    focus: "Practical vocabulary for groceries, shops, prices, cooking, restaurants and daily money.",
    tag: "Shopping & food",
    nouns: `
cesta|basket|f;carrito|shopping cart|m;estantería|shelf|f;probador|fitting room|m;caja|checkout|f;recibo|receipt|m;ticket|printed receipt|m;devolución|return|f;rebaja|sale|f;oferta|offer|f;descuento|discount|m;monedero|wallet|m;tarjeta|card|f;efectivo|cash|m;cambio|change|m;propina|tip|f;cuenta|bill|f;menú|menu|m;plato|dish|m;ración|portion|f;tapa|small dish|f;aperitivo|appetiser|m;postre|dessert|m;cubierto|cutlery|m;servilleta|napkin|f;cuchara|spoon|f;tenedor|fork|m;cuchillo|knife|m;sartén|frying pan|f;cacerola|saucepan|f;bandeja|tray|f;horno|oven|m;nevera|fridge|f;congelador|freezer|m;microondas|microwave|m;aceite|oil|m;vinagre|vinegar|m;sal|salt|f;azúcar|sugar|m;harina|flour|f;arroz|rice|m;pasta|pasta|f;lenteja|lentil|f;garbanzo|chickpea|m;zanahoria|carrot|f;cebolla|onion|f;ajo|garlic|m;pimiento|pepper|m;lechuga|lettuce|f;melocotón|peach|m;uva|grape|f;berenjena|aubergine|f;calabacín|courgette|m;pepino|cucumber|m;pera|pear|f;ciruela|plum|f;sandía|watermelon|f;marisco|seafood|m;ternera|beef|f;cerdo|pork|m;salchicha|sausage|f;mermelada|jam|f;mantequilla|butter|f;yogur|yoghurt|m;galleta|biscuit|f;helado|ice cream|m;lata|tin, can|f;frasco|jar|m;tapón|cap|m
`,
    verbs: `
comprar|to buy;vender|to sell;costar|to cost;pagar|to pay;cobrar|to charge;ahorrar|to save;gastar|to spend;comparar|to compare;elegir|to choose;probar|to try on;devolver|to return;rebajar|to discount;pesar|to weigh;medir|to measure;cortar|to cut;pelar|to peel;mezclar|to mix;freír|to fry;hervir|to boil;hornear|to bake;calentar|to heat;enfriar|to cool;congelar|to freeze;servir|to serve;pedir|to order;recomendar|to recommend;reservar|to book;sobrar|to be left over;untar|to spread;trocear|to chop;añadir|to add;remover|to stir;probarse|to try on;envolver|to wrap;desenvolver|to unwrap;caducar|to expire;aprovechar|to make the most of;derretir|to melt;quemar|to burn;oler|to smell;saborear|to savour;merendar|to have an afternoon snack;descongelar|to defrost;escurrir|to drain;colar|to strain;aliñar|to dress food;empanar|to bread;rebozar|to coat in batter;tropezar|to trip;regatear|to bargain;encargar|to order;reponer|to restock;etiquetar|to label;despachar|to serve at a counter
`,
    adjs: `
fresco|fresh;maduro|ripe;crudo|raw;cocido|cooked;frito|fried;dulce|sweet;salado|salty;picante|spicy;amargo|bitter;ligero|light;pesado|heavy;barato|cheap;caro|expensive;rebajado|discounted;casero|homemade;vegetariano|vegetarian;congelado|frozen;caducado|expired;relleno|filled;crujiente|crunchy;tostado|toasted;cremoso|creamy;agrio|sour;grasiento|greasy;mediano|medium-sized;económico|budget-friendly;artesano|artisan
`,
    advs: `aparte|separately;gratis|free of charge;demasiado|too much;bastante|quite;aproximadamente|approximately;lentamente|slowly;suavemente|gently;separadamente|separately;directamente|directly;cuidadosamente|carefully;económicamente|economically;caseramente|in a homemade way;fríamente|coldly`,
    phrases: `
salir caro|to turn out expensive;merecer la pena|to be worth it;pagar en efectivo|to pay in cash;estar en oferta|to be on sale;pedir la cuenta|to ask for the bill;quedarse sin|to run out of;echar de menos|to miss;hacer la compra|to do the grocery shopping
`,
  },
  {
    id: "group-7",
    title: "Trámites y servicios · Forms, problems and solutions",
    focus: "Useful A2 words for offices, documents, appointments, complaints and practical services.",
    tag: "Services",
    nouns: `
trámite|administrative procedure|m;cita|appointment|f;turno|turn|m;cola|queue|f;ventanilla|service window|f;mostrador|counter|m;oficina|office|f;documento|document|m;formulario|form|m;solicitud|application|f;autorización|authorisation|f;justificante|supporting document|m;certificado|certificate|m;licencia|licence|f;permiso|permit|m;identidad|identity|f;pasaporte|passport|m;visado|visa|m;embajada|embassy|f;consulado|consulate|m;residencia|residence|f;empadronamiento|local registration|m;fotocopia|photocopy|f;copia|copy|f;original|source document|m;firma|signature|f;sello|stamp|m;fecha|date|f;plazo|deadline|m;requisito|requirement|m;tasa|fee|f;importe|amount|m;pago|payment|m;recibo|receipt|m;factura|invoice|f;reclamación|complaint|f;queja|complaint|f;aviso|notice|m;confirmación|confirmation|f;cancelación|cancellation|f;renovación|renewal|f;seguimiento|follow-up|m;atención|assistance|f;usuario|user|m;técnico|technician|m;operador|operator|m;reparación|repair|f;instalación|installation|f;suministro|supply|m;avería|fault|f;incidencia|incident|f;acuse|acknowledgement|m;expediente|case file|m;resguardo|receipt slip|m;clave|access code|f;código|code|m;pin|security code|m;casilla|box on a form|f;apartado|section|m;anexo|annex|m;duplicado|duplicate copy|m;extracto|statement|m;tarjetero|card holder|m;notaría|notary office|f;padrón|municipal register|m;recargo|surcharge|m;domicilio|home address|m;remitente|sender|m;destinatario|recipient|m;envío|shipment|m;sucursal|branch office|f
`,
    verbs: `
solicitar|to request;rellenar|to fill in;adjuntar|to attach;presentar|to submit;firmar|to sign;sellar|to stamp;tramitar|to process;autorizar|to authorise;renovar|to renew;cancelar|to cancel;confirmar|to confirm;reclamar|to complain;quejarse|to complain;avisar|to notify;notificar|to notify;comprobar|to check;verificar|to verify;registrarse|to register;identificarse|to identify oneself;pagar|to pay;abonar|to pay;devolver|to refund;instalar|to install;reparar|to repair;atender|to help, serve;derivar|to refer;consultar|to consult;resolver|to resolve;legalizar|to legalise;certificar|to certify;compulsar|to certify a copy;caducar|to expire;prorrogar|to extend a deadline;domiciliar|to set up direct debit;reembolsar|to reimburse;recurrir|to appeal;subsanar|to correct officially;validar|to validate;escanear|to scan;reenviar|to resend;extraviar|to misplace;extraviarse|to get lost;anexar|to attach as an annex;desbloquear|to unblock;activar|to activate;desactivar|to deactivate;acreditar|to prove;empadronarse|to register locally;autenticar|to authenticate;rubricar|to sign formally;remitir|to send officially;depositar|to deposit
`,
    adjs: `
oficial|official;administrativo|administrative;válido|valid;caducado|expired;vigente|current;obligatorio|required;necesario|necessary;urgente|urgent;pendiente|pending;gratuito|free;pagado|paid;electrónico|electronic;presencial|in-person;telefónico|by phone;completo|complete;incompleto|incomplete;autorizado|authorised;certificado|certified;compulsado|officially certified;legalizado|legalised;firmado|signed;sellado|stamped;anexado|attached;extraviado|misplaced;reembolsable|refundable;municipal|municipal;postal|mail-related;bancario|banking;sanitario|healthcare;prioritario|priority;provisional|temporary
`,
    advs: `personalmente|in person;telefónicamente|by phone;correctamente|correctly;previamente|beforehand;urgentemente|urgently;oficialmente|officially;postalmente|by post;presencialmente|in person;provisionalmente|temporarily;legalmente|legally`,
    phrases: `
pedir cita previa|to make an appointment in advance;hacer una reclamación|to file a complaint;estar en regla|to be in order;darse de alta|to sign up;darse de baja|to cancel registration;quedar pendiente|to remain pending;llevar encima|to carry with you;sacar número|to take a queue number;pasar por ventanilla|to go to the service window;estar caducado|to be expired;presentar una solicitud|to submit an application
`,
  },
  {
    id: "group-8",
    title: "Naturaleza y tiempo · Weather, places and small risks",
    focus: "Concrete vocabulary for weather, landscapes, animals, environment and outdoor plans.",
    tag: "Nature",
    nouns: `
nube|cloud|f;tormenta|storm|f;trueno|thunder|m;rayo|lightning|m;llovizna|drizzle|f;granizo|hail|m;niebla|fog|f;viento|wind|m;brisa|breeze|f;sombra|shade|f;solana|sunny spot|f;sequía|drought|f;inundación|flood|f;incendio|fire|m;humo|smoke|m;ceniza|ash|f;barro|mud|m;charco|puddle|m;arena|sand|f;piedra|stone|f;roca|rock|f;sendero|path|m;valle|valley|m;colina|hill|f;cumbre|summit|f;cueva|cave|f;orilla|shore|f;río|river|m;arroyo|stream|m;lago|lake|m;costa|coast|f;isla|island|f;bosque|forest|m;selva|jungle|f;campo|countryside|m;granja|farm|f;huerto|vegetable garden|m;raíz|root|f;hoja|leaf|f;flor|flower|f;rama|branch|f;semilla|seed|f;cosecha|harvest|f;abeja|bee|f;hormiga|ant|f;mosquito|biting insect|m;mariposa|butterfly|f;pájaro|bird|m;pez|fish|m;tortuga|turtle|f;conejo|rabbit|m;caracol|snail|m;lagartija|small lizard|f;seta|mushroom|f;matorral|bush|m
`,
    verbs: `
llover|to rain;nevar|to snow;granizar|to hail;soplar|to blow;mojarse|to get wet;secarse|to dry;crecer|to grow;florecer|to bloom;plantar|to plant;regar|to water;cosechar|to harvest;cuidar|to care for;proteger|to protect;contaminar|to pollute;reciclar|to recycle;reutilizar|to reuse;ahorrar|to save;desperdiciar|to waste;apagar|to turn off;encender|to turn on;acampar|to camp;caminar|to walk;escalar|to climb;resbalar|to slip;perderse|to get lost;refugiarse|to take shelter;picar|to sting;observar|to observe;amanecer|to dawn;anochecer|to get dark;atardecer|to get late in the day;lloviznar|to drizzle;inundarse|to flood;arder|to burn;brotar|to sprout;germinar|to germinate;marchar|to walk, go;trepar|to climb;bucear|to dive;pescar|to fish;pastar|to graze;zumbar|to buzz;revolotear|to flutter;rastrear|to track;orientarse|to find one's way
`,
    adjs: `
soleado|sunny;nublado|cloudy;lluvioso|rainy;seco|dry;húmedo|humid;fresco|cool;caluroso|hot;templado|mild;salvaje|wild;natural|from nature;rural|countryside-related;arenoso|sandy;rocoso|rocky;resbaladizo|slippery;reciclable|recyclable;renovable|renewable;nevado|snowy;fangoso|muddy;florido|full of flowers;frondoso|leafy;montañoso|mountainous;costero|coastal;marino|sea-related;silvestre|wild-growing;despejado|clear;ventoso|windy;brumoso|misty
`,
    advs: `naturalmente|naturally;afuera|outdoors;diariamente|daily;lentamente|slowly;repentinamente|suddenly;silenciosamente|silently;suavemente|gently;bruscamente|suddenly;verticalmente|vertically;horizontalmente|horizontally;climáticamente|climatically`,
    phrases: `
hacer buen tiempo|the weather to be nice;hacer mal tiempo|the weather to be bad;caer un chaparrón|to rain heavily;estar nublado|to be cloudy;tener cuidado|to be careful;dejar huella|to leave a mark;poner en riesgo|to put at risk;estar despejado|to be clear;ir de excursión|to go on a hike
`,
  },
  {
    id: "group-9",
    title: "Tecnología y medios · Screens, messages and reliable info",
    focus: "Words for phones, computers, online communication, news and simple digital safety.",
    tag: "Tech & media",
    nouns: `
pantalla|screen|f;teclado|keyboard|m;ratón|mouse|m;altavoz|speaker|m;auricular|earphone|m;cargador|charger|m;batería|battery|f;enchufe|socket|m;cable|charging cord|m;memoria|memory, storage|f;carpeta|folder|f;archivo|file|m;enlace|link|m;página|page|f;sitio|site|m;buscador|search engine|m;contraseña|password|f;usuario|user|m;perfil|profile|m;cuenta|account|f;aplicación|app|f;descarga|download|f;actualización|update|f;mensaje|message|m;notificación|notification|f;comentario|comment|m;respuesta|reply|f;imagen|image|f;vídeo|short video clip|m;grabación|recording|f;archivo|file|m;señal|signal|f;conexión|connection|f;red|network|f;cobertura|coverage|f;datos|data|m;privacidad|privacy|f;seguridad|security|f;riesgo|risk|m;engaño|deception|m;rumor|rumour|m;noticia|news item|f;titular|headline|m;fuente|source|f;artículo|article|m;reportaje|report|m;entrevista|interview|f;boletín|bulletin|m;prensa|press|f;anuncio|ad, announcement|m;publicidad|advertising|f;portátil|laptop|m;tableta|tablet computer|f;impresora|printer|f;escáner|scanner device|m;micrófono|microphone|m;cámara|camera|f;router|internet device|m;wifi|wireless internet|m;bluetooth|wireless connection|m;navegador|browser|m;pestaña|tab|f;ventana|window on screen|f;cursor|mouse pointer|m;icono|icon|m;menú|menu list|m;ajuste|setting|m;almacenamiento|storage|m;nube|cloud storage|f;respaldo|backup|m;captura|screenshot|f;emoticono|emoji|m;boletín|newsletter|m;suscripción|subscription|f;sección|section|f;portada|front page|f;redactor|editor, writer|m;locutor|announcer|m;oyente|listener|m;espectador|viewer|m;contraste|contrast|m;volumen|sound level|m;brillo|brightness|m;subtítulo|subtitle|m;podcast|audio programme|m;directo|live broadcast|m;videollamada|video call|f
`,
    verbs: `
buscar|to search;encontrar|to find;pinchar|to click;copiar|to copy;pegar|to paste;guardar|to save;borrar|to delete;descargar|to download;subir|to upload;actualizar|to update;conectar|to connect;desconectar|to disconnect;cargar|to charge;grabar|to record;publicar|to publish;comentar|to comment;compartir|to share;bloquear|to block;denunciar|to report;proteger|to protect;comprobar|to check;verificar|to verify;avisar|to warn;engañar|to deceive;informar|to inform;anunciar|to announce;traducir|to translate;reenviar|to forward;chatear|to chat online;tuitear|to tweet;postear|to post;silenciar|to mute;deslizar|to swipe;teclear|to type;clicar|to click;minimizar|to minimise;maximizar|to maximise;reiniciar|to restart;apagar|to turn off;encender|to turn on;sincronizar|to sync;indexar|to index;archivar|to archive;desinstalar|to uninstall;instalar|to install;formatear|to format;etiquetar|to tag;filtrar|to filter;reenfocar|to refocus;subtitular|to subtitle;retransmitir|to broadcast;pausar|to pause;reanudar|to resume;silabear|to spell out syllables;viralizar|to make viral;contrastar|to cross-check;desmentir|to debunk;responder|to reply;desplazar|to scroll;capturar|to screenshot;pixelar|to pixelate;desbloquear|to unlock;autocompletar|to autocomplete;programar|to schedule
`,
    adjs: `
digital|online, digital;virtual|online-only;fiable|reliable;falso|false;verdadero|true;engañoso|misleading;público|public;privado|private;seguro|safe;peligroso|dangerous;anónimo|anonymous;lento|slow;rápido|fast;actualizado|updated;gratuito|free;inalámbrico|wireless;táctil|touchscreen;borroso|blurry;nítido|sharp, clear;sonoro|sound-related;silenciado|muted;descargado|downloaded;comprimido|compressed;adjunto|attached;compartido|shared;viral|widely shared;verificado|verified;falso|false;noticioso|news-related;publicitario|advertising-related;interactivo|interactive;multimedia|using several media types
`,
    advs: `digitalmente|digitally;actualmente|currently;públicamente|publicly;privadamente|privately;virtualmente|online;anónimamente|anonymously;visualmente|visually;manualmente|manually;automáticamente|automatically;masivamente|on a large scale`,
    phrases: `
hacer clic|to click;darse cuenta de que|to realise that;estar al tanto|to keep up to date;caer en una trampa|to fall into a trap;cambiar la contraseña|to change the password;hacer una copia|to make a copy;quedarse sin batería|to run out of battery;subir una foto|to upload a photo;mandar un mensaje|to send a message;estar conectado|to be connected;poner en silencio|to put on silent;salir en directo|to go live
`,
  },
  {
    id: "group-10",
    title: "Opiniones y relatos · Explain, compare and connect ideas",
    focus: "A2 words for telling what happened, comparing options, giving reasons and sounding natural.",
    tag: "Opinions",
    nouns: `
opinión|opinion|f;idea|idea|f;motivo|reason|m;razón|reason|f;causa|cause|f;resultado|result|m;consecuencia|consequence|f;ventaja|advantage|f;desventaja|disadvantage|f;opción|option|f;elección|choice|f;decisión|decision|f;solución|solution|f;problema|problem|m;duda|doubt|f;pregunta|question|f;respuesta|answer|f;ejemplo|example|m;detalle|detail|m;caso|case|m;tema|topic|m;punto|point|m;parte|part|f;principio|beginning|m;mitad|middle|f;final|ending|m;historia|story|f;escena|scene|f;recuerdo|memory|m;experiencia|experience|f;situación|situation|f;cambio|change|m;costumbre|habit, custom|f;hábito|habit|m;error|mistake|m;acierto|right answer|m;sorpresa|surprise|f;suerte|luck|f;riesgo|risk|m;posibilidad|possibility|f;verdad|truth|f;mentira|lie|f;acuerdo|agreement|m;desacuerdo|disagreement|m;consejo|advice|m;mensaje|message|m;señal|sign|f;comparación|comparison|f;diferencia|difference|f;semejanza|similarity|f;prioridad|priority|f;descuido|careless mistake|m;despiste|absent-minded mistake|m;malentendido|misunderstanding|m;excusa|excuse|f;pretexto|pretext|m;suposición|assumption|f;rumbo|direction|m;giro|turn in events|m;arranque|start, outburst|m;desenlace|outcome|m;pausa|pause|f;silencio|silence|m;distracción|distraction|f;impaciencia|impatience|f;certeza|certainty|f;inseguridad|insecurity|f;intuición|intuition|f;impresión|impression|f;reparo|objection, hesitation|m;matiz|nuance|m;contradicción|contradiction|f;equivocación|mistake|f;arrepentimiento|regret|m;orgullo|pride|m;alivio|relief|m;decepción|disappointment|f;preocupación|concern|f;curiosidad|curiosity|f;preferencia|preference|f;postura|position, stance|f;rechazo|rejection|m;propuesta|proposal|f;alternativa|alternative|f;hipótesis|hypothesis|f;prueba|proof|f;conclusión|conclusion|f;resumen|summary|m;introducción|introduction|f;descripción|description|f;comienzo|beginning|m;cierre|closing|m;inciso|side note|m;aclaración|clarification|f;desahogo|relief by talking|m;corazonada|hunch|f;desconfianza|mistrust|f;confianza|confidence|f;dilema|dilemma|m;queja|complaint|f;rumor|rumour|m;chisme|gossip|m;aviso|warning|m;pista|clue|f;desorden|mess|m;orden|order|m;contratiempo|setback|m;retraso|delay|m;fallo|failure, error|m;arreglo|fix|m;mejora|improvement|f;empeoramiento|worsening|m;salida|way out|f;obstáculo|obstacle|m;reto|challenge|m;logro|achievement|m;fracaso|failure|m;intento|attempt|m;ensayo|trial|m;vacilación|hesitation|f;detalle|detail|m;desacierto|wrong move|m;ocurrencia|sudden idea|f;desvío|change of direction|m;remate|final touch|m;recuento|count, recap|m;desacuerdo|disagreement|m;charla|chat|f;apunte|note|m;paréntesis|aside|m;vuelta|turn, return|f;despedida|closing farewell|f;reencuentro|reunion|m;malestar|unease|m;desánimo|discouragement|m
`,
    verbs: `
opinar|to give an opinion;creer|to believe;suponer|to suppose;dudar|to doubt;aclarar|to clarify;explicar|to explain;comparar|to compare;preferir|to prefer;elegir|to choose;decidir|to decide;aconsejar|to advise;recomendar|to recommend;proponer|to suggest;aceptar|to accept;rechazar|to reject;negar|to deny;permitir|to allow;prohibir|to forbid;ocurrir|to happen;suceder|to happen;recordar|to remember;olvidar|to forget;añadir|to add;resumir|to summarise;concluir|to conclude;depender|to depend;influir|to influence;convencer|to convince;arrepentirse|to regret;vacilar|to hesitate;desanimarse|to lose heart;desahogarse|to get something off one's chest;malinterpretar|to misinterpret;rectificar|to correct oneself;reconsiderar|to reconsider;sopesar|to weigh up;deducir|to deduce;intuir|to sense, intuit;imaginarse|to imagine;equivocarse|to make a mistake;acertar|to get right;tropezar|to stumble;replantearse|to rethink;contradecir|to contradict;objetar|to object;replicar|to reply sharply;insinuar|to hint;reconducir|to redirect;rematar|to wrap up;recapitular|to recap;matizar|to add nuance;puntualizar|to clarify a detail;desviarse|to go off topic;redondear|to round off;despedirse|to say goodbye;reencontrarse|to meet again;despistarse|to get distracted;enredarse|to get tangled up;desconfiar|to mistrust;encariñarse|to grow fond;desmentir|to deny a rumour;lamentar|to regret;reírse|to laugh;callarse|to keep quiet;desahuciar|to evict
`,
    adjs: `
posible|possible;imposible|impossible;probable|probable;seguro|certain;dudoso|doubtful;claro|clear;confuso|confusing;parecido|similar;distinto|different;contrario|opposite;principal|main;secundario|secondary;necesario|necessary;innecesario|unnecessary;razonable|reasonable;útil|useful;equivocado|mistaken;acertado|right, well judged;convincente|convincing;exagerado|exaggerated;inesperado|unexpected;previsible|predictable;discutible|debatable;sincero|sincere;precipitado|rushed;prudente|careful, sensible;emocional|emotional;objetivo|objective;subjetivo|subjective;breve|brief;detallado|detailed;aproximado|approximate;definitivo|final;deseable|desirable;evitable|avoidable;inevitable|unavoidable;comprensible|understandable;incomprensible|hard to understand;distraído|distracted;arrepentido|regretful;desanimado|discouraged;ilusionado|hopeful;matizado|nuanced;redondo|well rounded
`,
    advs: `quizá|perhaps;acaso|maybe;seguramente|surely;simplemente|simply;claramente|clearly;aparentemente|apparently;sinceramente|honestly;brevemente|briefly;definitivamente|definitely;razonablemente|reasonably;emocionalmente|emotionally;francamente|frankly;honradamente|honestly`,
    phrases: `
en mi opinión|in my opinion;por un lado|on one hand;por otro lado|on the other hand;tener en cuenta|to take into account;estar de acuerdo|to agree;no estar de acuerdo|to disagree;al final|in the end;a mi parecer|in my view;cambiar de idea|to change one's mind;dar la razón|to say someone is right;no tener claro|to be unsure;quedarse con la duda|to be left unsure;salir del paso|to get by
`,
  },
];

const RESERVE_BY_POS = {
  noun: `
alacena|kitchen cupboard|f;alfombra|rug|f;almacén|warehouse|m;alojamiento|accommodation|m;anillo|ring|m;antena|antenna|f;aparcamiento|car park|m;apetito|appetite|m;apoyo|support|m;arena|sand|f;asesor|advisor|m;asiento|seat|m;aspiradora|vacuum cleaner|f;autopista|motorway|f;aviso|notice|m;azafata|flight attendant|f;banco|bench, bank|m;bandeja|tray|f;batería|battery|f;botiquín|first-aid kit|m;brújula|compass|f;cajero|cash machine|m;calendario|calendar|m;caminata|long walk|f;camiseta|T-shirt|f;campamento|camp|m;caravana|caravan|f;carpintero|carpenter|m;cartera|wallet, schoolbag|f;catálogo|catalogue|m;cepillo|brush|m;cerrajero|locksmith|m;chándal|tracksuit|m;charco|puddle|m;chiste|joke|m;cicatriz|scar|f;cierre|closure|m;cinturón|belt|m;colchón|mattress|m;colonia|cologne|f;comprobante|proof, receipt|m;congelador|freezer|m;consejería|advisory office|f;contador|meter|m;contraseña|password|f;crema|skin cream|f;cristal|glass pane|m;cuaderno|notebook|m;cuerda|rope|f;desayuno|breakfast|m;despacho|office|m;detergente|detergent|m;diccionario|dictionary|m;ducha|shower|f;embalaje|packaging|m;emergencia|emergency|f;entrada|entrance, ticket|f;equipaje|luggage|m;escaparate|shop window|m;escoba|broom|f;estuche|pencil case|m;farmacia|pharmacy|f;ferretería|hardware store|f;fregadero|sink|m;furgoneta|van|f;gafas|glasses|f;gasolina|petrol|f;guía|guidebook, guide|f;horario|schedule|m;hostal|hostel|m;idioma|language|m;impresora|printer|f;informe|report|m;itinerario|itinerary|m;jersey|sweater|m;kilómetro|kilometre|m;linterna|torch|f;maleta|suitcase|f;mapa|map|m;marcador|marker|m;medicamento|medicine|m;mercado|market|m;mochila|backpack|f;monumento|monument|m;muelle|dock|m;nevera|fridge|f;oferta|special offer|f;paella|rice dish|f;panadería|bakery|f;papelería|stationery shop|f;paraguas|umbrella|m;pasaje|ticket, fare|m;peluquería|hairdresser's|f;pendiente|earring|m;periódico|newspaper|m;pijama|pyjamas|m;pinza|clip|f;plaza|square|f;receta|recipe, prescription|f;recepción|front desk|f;regalo|gift|m;reserva|booking|f;rotulador|marker|m;sacacorchos|corkscrew|m;sandalia|sandal|f;señal|sign|f;sombra|shade|f;sorteo|raffle|m;supermercado|supermarket|m;suplemento|extra supplement|m;taller|workshop|m;tarifa|rate, fare|f;temporada|season|f;tienda|shop|f;tijera|scissors|f;tostadora|toaster|f;tráfico|road traffic|m;uniforme|uniform|m;vacaciones|holiday|f;zapatería|shoe shop|f;zapatilla|slipper, trainer|f
`,
  verb: `
acercarse|to approach;acomodar|to arrange;acostarse|to go to bed;acostumbrarse|to get used to;agacharse|to bend down;agendar|to schedule;agitar|to shake;alquilar|to rent;anular|to cancel;aparcar|to park;apetecer|to feel like;apuntarse|to sign up;arreglarse|to get ready;asustarse|to get scared;aterrizar|to land;bañarse|to bathe;calentar|to heat up;cambiarse|to change clothes;cancelar|to cancel;colgar|to hang up;comportarse|to behave;comprobar|to check;conducir|to drive;congelar|to freeze;consultar|to consult;contagiar|to infect;cruzar|to cross;desayunar|to have breakfast;despegar|to take off;desvestirse|to undress;devolver|to return;doblar|to fold, turn;dormirse|to fall asleep;ducharse|to shower;enfriar|to cool down;enfermar|to fall ill;enfermarse|to get sick;enviar|to send;escanear|to scan;escoger|to choose;estacionar|to park;estornudar|to sneeze;facturar|to check in luggage;fichar|to clock in;freír|to fry;girar|to turn;guardar|to keep, save;hervir|to boil;imprimir|to print;inscribirse|to register;limpiarse|to clean oneself;marearse|to get dizzy;merendar|to have an afternoon snack;mojar|to wet;notar|to notice;peinarse|to comb one's hair;preocuparse|to worry;probarse|to try on;quejarse|to complain;quitarse|to take off;recetar|to prescribe;recoger|to pick up;repartir|to distribute;secar|to dry;sentarse|to sit down;sonreír|to smile;soplar|to blow;tapar|to cover;tardar|to take time;tostar|to toast;tropezar|to trip;vacunarse|to get vaccinated;vendar|to bandage
`,
  adj: `
abrigado|warmly dressed;agotado|sold out, exhausted;amueblado|furnished;ancho|wide;apto|suitable;averiado|broken;caducado|expired;casual|informal;coqueto|charming;crujiente|crunchy;descalzo|barefoot;despistado|absent-minded;doble|double;doméstico|domestic;eléctrico|electric;estrecho|narrow;fresco|fresh;húmedo|humid;inalámbrico|wireless;ligero|lightweight;maduro|ripe;manchado|stained;mareado|dizzy;mojado|wet;ocupado|busy;peatonal|pedestrian-only;peligroso|dangerous;picante|spicy;prestado|borrowed;puntual|punctual;redondo|round;resbaladizo|slippery;roto|broken;salado|salty;sencillo|simple;soleado|sunny;subterráneo|underground;tierno|tender, soft;tostado|toasted;urgente|urgent;vacío|empty
`,
  adv: `
abajo|downstairs;arriba|upstairs;afuera|outside;adentro|inside;anoche|last night;anteayer|the day before yesterday;enseguida|right away;pronto|soon;quizás|perhaps;regularmente|regularly;tranquilamente|calmly
`,
  phrase: `
echar una mano|to lend a hand;hacer caso|to pay attention;hacer cola|to queue;estar de acuerdo|to agree;tener razón|to be right;llevar razón|to be right;dar igual|to not matter;no pasa nada|it is no big deal;tomar nota|to take note;tener cuidado|to be careful;hacer falta|to be needed;venir bien|to be useful;sentar bien|to suit, feel good;ir de compras|to go shopping;estar agotado|to be sold out;salir bien|to turn out well;salir mal|to turn out badly
`,
};

const PHRASE_EXAMPLES = {
  "tener prisa": ["Tengo prisa, así que te llamo cuando llegue al metro.", "I am in a hurry, so I will call you when I get to the metro."],
  "dejar algo encendido": ["Creo que dejé el horno encendido y prefiero volver a comprobarlo.", "I think I left the oven on, and I prefer to go back and check."],
  "quedarse dormido": ["Me quedé dormido en el sofá y casi pierdo la llamada.", "I fell asleep on the sofa and almost missed the call."],
  "poner la lavadora": ["Voy a poner la lavadora esta noche porque mañana necesito la camisa.", "I am going to run the washing machine tonight because I need the shirt tomorrow."],
  "hacer la cama": ["Antes de salir hago la cama para encontrar la habitación ordenada.", "Before leaving, I make the bed so the room is tidy when I come back."],
  "salir pitando": ["Cuando sonó el despertador, salí pitando para no llegar tarde.", "When the alarm went off, I rushed out so I would not be late."],
  "estar hecho un lío": ["Estoy hecho un lío con tantos papeles y necesito ordenarlos.", "I am in a mess with so many papers and need to organise them."],
  "dar una vuelta": ["Después de cenar dimos una vuelta por el barrio para despejarnos.", "After dinner we took a walk around the neighbourhood to clear our heads."],
  "ir con tiempo": ["Vamos con tiempo porque en esa avenida siempre hay atasco.", "Let us leave enough time because there is always traffic on that avenue."],
  "perder el autobús": ["Si tardamos cinco minutos más, vamos a perder el autobús.", "If we take five more minutes, we are going to miss the bus."],
  "cambiar de línea": ["Tienes que cambiar de línea en la próxima estación.", "You have to change lines at the next station."],
  "estar de paso": ["Solo estoy de paso en la ciudad, pero me gustaría conocer el centro.", "I am only passing through the city, but I would like to see the centre."],
  "quedarse tirado": ["Nos quedamos tirados cuando el coche se paró en la autopista.", "We were stranded when the car stopped on the motorway."],
  "pedir cita": ["Voy a pedir cita porque la tos no se me quita.", "I am going to make an appointment because my cough will not go away."],
  "tener fiebre": ["Si vuelves a tener fiebre, no vayas a clase mañana.", "If you have a fever again, do not go to class tomorrow."],
  "sentirse fatal": ["Me sentía fatal después del viaje y decidí descansar.", "I felt awful after the trip and decided to rest."],
  "guardar reposo": ["El médico me pidió guardar reposo durante dos días.", "The doctor asked me to rest for two days."],
  "tomarse la tensión": ["Mi abuela se toma la tensión cada mañana.", "My grandmother checks her blood pressure every morning."],
  "estar de baja": ["Está de baja porque se lesionó la rodilla en el trabajo.", "She is on sick leave because she injured her knee at work."],
  "ponerse mejor": ["Con descanso y agua, empezó a ponerse mejor por la tarde.", "With rest and water, he started to get better in the afternoon."],
  "entregar a tiempo": ["Intenté entregar el trabajo a tiempo aunque tuve problemas con la impresora.", "I tried to submit the assignment on time although I had problems with the printer."],
  "estar pendiente de": ["Estoy pendiente del correo por si la oficina contesta hoy.", "I am watching my email in case the office replies today."],
  "ponerse al día": ["Después de faltar a clase, necesito ponerme al día con los apuntes.", "After missing class, I need to catch up with the notes."],
  "quedar en algo": ["Quedamos en reunirnos el jueves para revisar el borrador.", "We agreed to meet on Thursday to review the draft."],
  "estar a cargo de": ["Laura está a cargo de confirmar las reservas del grupo.", "Laura is in charge of confirming the group bookings."],
  "cumplir con": ["Para renovar el permiso hay que cumplir con todos los requisitos.", "To renew the permit you must meet all the requirements."],
  "hacer una entrevista": ["Mañana voy a hacer una entrevista para una práctica de verano.", "Tomorrow I am going to do an interview for a summer internship."],
  "llevarse bien": ["Me llevo bien con mis compañeros porque hablamos claro desde el principio.", "I get along with my classmates because we speak clearly from the start."],
  "hacer las paces": ["Después de discutir, hicieron las paces antes de volver a casa.", "After arguing, they made peace before going home."],
  "pedir perdón": ["Pidió perdón por interrumpir la conversación.", "He apologised for interrupting the conversation."],
  "guardar un secreto": ["Puedes confiar en ella: sabe guardar un secreto.", "You can trust her: she knows how to keep a secret."],
  "caer bien": ["Tu prima me cae bien porque escucha antes de opinar.", "I like your cousin because she listens before giving her opinion."],
  "pasarlo bien": ["Lo pasamos bien en el concierto aunque empezó tarde.", "We had a good time at the concert although it started late."],
  "dar vergüenza": ["Me da vergüenza hablar en público, pero quiero practicar.", "I feel embarrassed speaking in public, but I want to practise."],
  "salir caro": ["Comprar todo en el aeropuerto suele salir caro.", "Buying everything at the airport usually turns out expensive."],
  "merecer la pena": ["Aunque el billete es caro, el viaje merece la pena.", "Although the ticket is expensive, the trip is worth it."],
  "pagar en efectivo": ["En esa tienda pequeña prefieren que pagues en efectivo.", "In that small shop they prefer you to pay in cash."],
  "estar en oferta": ["Estas sandalias están en oferta hasta el domingo.", "These sandals are on sale until Sunday."],
  "pedir la cuenta": ["Voy a pedir la cuenta porque tenemos que llegar al cine.", "I am going to ask for the bill because we have to get to the cinema."],
  "quedarse sin": ["Nos quedamos sin pan justo antes de la cena.", "We ran out of bread just before dinner."],
  "echar de menos": ["Echo de menos la comida de mi casa cuando viajo.", "I miss the food from home when I travel."],
  "hacer la compra": ["Los sábados hacemos la compra para toda la semana.", "On Saturdays we do the grocery shopping for the whole week."],
  "pedir cita previa": ["Para renovar el documento hay que pedir cita previa.", "To renew the document you have to make an appointment in advance."],
  "hacer una reclamación": ["Hice una reclamación porque la factura tenía un error.", "I filed a complaint because the invoice had an error."],
  "estar en regla": ["Antes de viajar comprueba que el pasaporte esté en regla.", "Before travelling, check that your passport is in order."],
  "darse de alta": ["Me di de alta en la biblioteca para poder estudiar allí.", "I signed up at the library so I could study there."],
  "darse de baja": ["Voy a darme de baja del gimnasio porque casi no voy.", "I am going to cancel my gym membership because I hardly go."],
  "quedar pendiente": ["Queda pendiente enviar la copia firmada del formulario.", "Sending the signed copy of the form remains pending."],
  "llevar encima": ["Lleva encima una copia del seguro por si la piden.", "Carry a copy of the insurance in case they ask for it."],
  "sacar número": ["Al llegar a la oficina, saqué número y esperé mi turno.", "When I arrived at the office, I took a queue number and waited for my turn."],
  "pasar por ventanilla": ["Después de pagar la tasa, tuve que pasar por ventanilla.", "After paying the fee, I had to go to the service window."],
  "estar caducado": ["Mi permiso estaba caducado y no pude hacer el trámite en línea.", "My permit was expired, and I could not complete the procedure online."],
  "presentar una solicitud": ["Presenté una solicitud para renovar la residencia.", "I submitted an application to renew my residence permit."],
  "hacer buen tiempo": ["Si hace buen tiempo, subiremos a la colina por la mañana.", "If the weather is nice, we will go up the hill in the morning."],
  "hacer mal tiempo": ["Cuando hace mal tiempo, prefiero no conducir por esa carretera.", "When the weather is bad, I prefer not to drive on that road."],
  "caer un chaparrón": ["Nos cayó un chaparrón justo antes de llegar al refugio.", "It poured on us just before we reached the shelter."],
  "estar nublado": ["Está nublado, pero no parece que vaya a llover.", "It is cloudy, but it does not look like it is going to rain."],
  "tener cuidado": ["Ten cuidado con las piedras porque el sendero está mojado.", "Be careful with the stones because the path is wet."],
  "dejar huella": ["Un paseo por el bosque puede dejar huella si aprendes a observar.", "A walk in the forest can leave a mark if you learn to observe."],
  "poner en riesgo": ["Tirar basura al río pone en riesgo a muchos animales.", "Throwing rubbish into the river puts many animals at risk."],
  "estar despejado": ["El cielo está despejado y se ven las montañas desde aquí.", "The sky is clear, and you can see the mountains from here."],
  "ir de excursión": ["El domingo queremos ir de excursión si no llueve.", "On Sunday we want to go on a hike if it does not rain."],
  "hacer clic": ["Haz clic en el enlace solo si conoces la página.", "Click the link only if you know the page."],
  "darse cuenta de que": ["Me di cuenta de que la noticia venía de una fuente falsa.", "I realised that the news came from a false source."],
  "estar al tanto": ["Quiero estar al tanto de los cambios en el horario.", "I want to keep up to date with the changes in the schedule."],
  "caer en una trampa": ["No compartas tu contraseña para no caer en una trampa.", "Do not share your password so you do not fall into a trap."],
  "cambiar la contraseña": ["Después del aviso, cambié la contraseña de mi cuenta.", "After the warning, I changed my account password."],
  "hacer una copia": ["Haz una copia del archivo antes de borrarlo.", "Make a copy of the file before deleting it."],
  "quedarse sin batería": ["Me quedé sin batería justo cuando necesitaba el mapa.", "I ran out of battery just when I needed the map."],
  "subir una foto": ["No subas una foto de otra persona sin pedir permiso.", "Do not upload a photo of another person without asking permission."],
  "mandar un mensaje": ["Te mando un mensaje cuando termine la clase.", "I will send you a message when class finishes."],
  "estar conectado": ["El portátil está conectado, pero internet va muy lento.", "The laptop is connected, but the internet is very slow."],
  "poner en silencio": ["Voy a poner el móvil en silencio durante la entrevista.", "I am going to put my phone on silent during the interview."],
  "salir en directo": ["La radio local va a salir en directo desde la plaza.", "The local radio station is going to broadcast live from the square."],
  "en mi opinión": ["En mi opinión, esta opción es más cómoda y más barata.", "In my opinion, this option is more comfortable and cheaper."],
  "por un lado": ["Por un lado, el piso es pequeño; por otro, está muy bien situado.", "On one hand, the flat is small; on the other, it is very well located."],
  "por otro lado": ["Por otro lado, podemos esperar una semana y comparar precios.", "On the other hand, we can wait a week and compare prices."],
  "tener en cuenta": ["Hay que tener en cuenta el tiempo antes de aceptar el plan.", "You have to take the time into account before accepting the plan."],
  "no estar de acuerdo": ["No estoy de acuerdo con pagar más por el mismo servicio.", "I do not agree with paying more for the same service."],
  "al final": ["Al final elegimos la solución más sencilla.", "In the end we chose the simplest solution."],
  "a mi parecer": ["A mi parecer, la explicación necesita un ejemplo más claro.", "In my view, the explanation needs a clearer example."],
  "cambiar de idea": ["Cambié de idea después de escuchar los argumentos de Ana.", "I changed my mind after listening to Ana's arguments."],
  "dar la razón": ["Le di la razón porque su ejemplo era más convincente.", "I said he was right because his example was more convincing."],
  "no tener claro": ["No tengo claro si esta opción nos conviene.", "I am not sure whether this option suits us."],
  "quedarse con la duda": ["Me quedé con la duda y volví a preguntar al profesor.", "I was left unsure and asked the teacher again."],
  "salir del paso": ["Contestó rápido solo para salir del paso.", "He answered quickly just to get by."],
};

const CUSTOM_VERBS = {
  quejarse: ["Me quejé de la factura porque cobraban un servicio que no usé.", "I complained about the bill because they charged for a service I did not use."],
  depender: ["La decisión depende de cuánto tiempo tengamos antes del viaje.", "The decision depends on how much time we have before the trip."],
  influir: ["Dormir poco influye en mi ánimo y en mi concentración.", "Sleeping little affects my mood and my concentration."],
  preocuparse: ["No te preocupes por el formulario; lo revisamos juntos.", "Do not worry about the form; we will review it together."],
  acostumbrarse: ["Me estoy acostumbrando al horario nuevo de la universidad.", "I am getting used to the new university schedule."],
  olvidarse: ["Me olvidé de apagar la luz del pasillo.", "I forgot to turn off the hallway light."],
  acordarse: ["Acuérdate de llevar encima el justificante.", "Remember to carry the supporting document with you."],
  registrarse: ["Tienes que registrarte antes de pedir la cita.", "You have to register before making the appointment."],
  identificarse: ["Al entrar en la oficina, tuve que identificarme con el pasaporte.", "When I entered the office, I had to identify myself with my passport."],
  matricularse: ["Quiero matricularme en un curso de conversación.", "I want to enrol in a conversation course."],
  apuntarse: ["Me apunté a un taller para conocer gente del barrio.", "I signed up for a workshop to meet people from the neighbourhood."],
  darse: ["", ""],
};

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function normalise(value) {
  return String(value || "").normalize("NFC").trim();
}

function comparable(value) {
  return normalise(value).toLowerCase();
}

function parseItems(raw, pos) {
  return normalise(raw)
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [lemma, translation, gender] = item.split("|").map((part) => normalise(part));
      return { lemma, translation_en: translation, gender, pos };
    });
}

function articleFor(word, definite = true) {
  const gender = word.gender === "f" ? "f" : "m";
  if (definite) return gender === "f" ? "la" : "el";
  return gender === "f" ? "una" : "un";
}

function prepArticle(word) {
  return word.gender === "f" ? `de la ${word.lemma}` : `del ${word.lemma}`;
}

function makeNounExample(word, groupId, index) {
  const article = articleFor(word);
  const deArticle = word.gender === "f" ? `de la ${word.lemma}` : `del ${word.lemma}`;
  const lower = word.lemma;
  const templatesByGroup = {
    "group-1": [
      [`Esta mañana no encontraba ${article} ${lower} y salí con retraso.`, `This morning I could not find the ${word.translation_en}, and I left late.`],
      [`En casa usamos ${article} ${lower} casi todos los días.`, `At home we use the ${word.translation_en} almost every day.`],
      [`Cuando ordené la habitación, me di cuenta de que faltaba ${article} ${lower}.`, `When I tidied the room, I realised the ${word.translation_en} was missing.`],
      [`Anoté ${article} ${lower} en la lista de cosas para revisar esta semana.`, `I wrote the ${word.translation_en} on the list of things to check this week.`],
    ],
    "group-2": [
      [`El conductor nos dejó cerca de ${article} ${lower}.`, `The driver left us near the ${word.translation_en}.`],
      [`Pregunté por ${article} ${lower} para no perderme en el barrio.`, `I asked about the ${word.translation_en} so I would not get lost in the neighbourhood.`],
      [`En esta zona, ${article} ${lower} es útil para orientarse.`, `In this area, the ${word.translation_en} is useful for finding your way.`],
      [`Antes de firmar, revisamos ${article} ${lower} con cuidado.`, `Before signing, we checked the ${word.translation_en} carefully.`],
    ],
    "group-3": [
      [`Le expliqué ${article} ${lower} al médico con palabras sencillas.`, `I explained the ${word.translation_en} to the doctor in simple words.`],
      [`Después del viaje noté ${article} ${lower} y decidí descansar.`, `After the trip I noticed the ${word.translation_en}, and I decided to rest.`],
      [`La enfermera revisó ${article} ${lower} antes de recomendar un tratamiento.`, `The nurse checked the ${word.translation_en} before recommending a treatment.`],
      [`Si vuelve ${article} ${lower}, pediré cita mañana.`, `If the ${word.translation_en} comes back, I will make an appointment tomorrow.`],
    ],
    "group-4": [
      [`Necesito información sobre ${article} ${lower} antes de tomar una decisión.`, `I need information about the ${word.translation_en} before making a decision.`],
      [`En clase hablamos de ${article} ${lower} con un ejemplo práctico.`, `In class we talked about the ${word.translation_en} with a practical example.`],
      [`Esta semana tuve que organizar algo relacionado con ${article} ${lower}.`, `This week I had to organise something related to the ${word.translation_en}.`],
      [`Revisé los detalles ${deArticle} antes de escribir el correo.`, `I reviewed the details of the ${word.translation_en} before writing the email.`],
    ],
    "group-5": [
      [`Hablamos de ${article} ${lower} durante la cena con amigos.`, `We talked about the ${word.translation_en} during dinner with friends.`],
      [`Me dio mucha ilusión recibir ${article} ${lower}.`, `I was very excited to receive the ${word.translation_en}.`],
      [`La película muestra ${article} ${lower} de una forma muy cercana.`, `The film shows the ${word.translation_en} in a very relatable way.`],
      [`En el grupo, ${article} ${lower} ayudó a romper el hielo.`, `In the group, the ${word.translation_en} helped break the ice.`],
    ],
    "group-6": [
      [`En la tienda o el restaurante pregunté por ${article} ${lower}.`, `In the shop or restaurant I asked about the ${word.translation_en}.`],
      [`Hablamos ${deArticle} antes de decidir qué comprar o pedir.`, `We talked about the ${word.translation_en} before deciding what to buy or order.`],
      [`Me fijé en ${article} ${lower} porque podía afectar al precio o al pedido.`, `I noticed the ${word.translation_en} because it could affect the price or the order.`],
      [`La decisión sobre ${article} ${lower} me hizo cambiar el plan.`, `The decision about the ${word.translation_en} made me change the plan.`],
    ],
    "group-7": [
      [`En la oficina me pidieron ${article} ${lower} para continuar el trámite.`, `At the office they asked me for the ${word.translation_en} to continue the procedure.`],
      [`Pregunté por ${article} ${lower} porque no entendía el siguiente paso.`, `I asked about the ${word.translation_en} because I did not understand the next step.`],
      [`Tuve un problema con ${article} ${lower} y pedí ayuda en el mostrador.`, `I had a problem with the ${word.translation_en} and asked for help at the counter.`],
      [`El empleado me explicó ${article} ${lower} antes de darme el comprobante.`, `The employee explained the ${word.translation_en} before giving me the receipt.`],
    ],
    "group-8": [
      [`Vimos ${article} ${lower} durante la excursión y nos paramos a observarlo.`, `We saw the ${word.translation_en} during the trip and stopped to observe it.`],
      [`Después de la lluvia, ${article} ${lower} cambió el camino.`, `After the rain, the ${word.translation_en} changed the path.`],
      [`En esa zona, ${article} ${lower} forma parte del paisaje.`, `In that area, the ${word.translation_en} is part of the landscape.`],
      [`Conviene respetar ${article} ${lower} cuando caminamos por el campo.`, `It is best to respect the ${word.translation_en} when we walk in the countryside.`],
    ],
    "group-9": [
      [`Tuve un problema con ${article} ${lower} mientras estudiaba en línea.`, `I had a problem with the ${word.translation_en} while studying online.`],
      [`Busqué información sobre ${article} ${lower} antes de tocar la configuración.`, `I looked up information about the ${word.translation_en} before touching the settings.`],
      [`En clase hablamos ${deArticle} y de cómo usarlo con cuidado.`, `In class we talked about the ${word.translation_en} and how to use it carefully.`],
      [`Antes de la videollamada revisé ${article} ${lower}.`, `Before the video call I checked the ${word.translation_en}.`],
    ],
    "group-10": [
      [`Mencioné ${article} ${lower} para explicar mejor mi opinión.`, `I mentioned the ${word.translation_en} to explain my opinion better.`],
      [`Ese detalle cambió la forma en que entendí ${article} ${lower}.`, `That detail changed the way I understood the ${word.translation_en}.`],
      [`Antes de responder, pensé en ${article} ${lower} con calma.`, `Before replying, I thought calmly about the ${word.translation_en}.`],
      [`La conversación terminó hablando ${deArticle}.`, `The conversation ended by talking about the ${word.translation_en}.`],
    ],
  };
  const templates = templatesByGroup[groupId] || templatesByGroup["group-10"];
  return templates[index % templates.length];
}

function makeVerbExample(word, groupIndex, index) {
  if (CUSTOM_VERBS[word.lemma] && CUSTOM_VERBS[word.lemma][0]) return CUSTOM_VERBS[word.lemma];
  const templates = [
    [`Tengo que ${word.lemma} antes de confirmar el plan.`, `I have to ${word.translation_en.replace(/^to /, "")} before confirming the plan.`],
    [`Voy a ${word.lemma} con más calma para no cometer errores.`, `I am going to ${word.translation_en.replace(/^to /, "")} more calmly so I do not make mistakes.`],
    [`Ayer intenté ${word.lemma}, pero me faltaba información.`, `Yesterday I tried to ${word.translation_en.replace(/^to /, "")}, but I was missing information.`],
    [`Si quieres, podemos ${word.lemma} juntos después de clase.`, `If you want, we can ${word.translation_en.replace(/^to /, "")} together after class.`],
    [`Es mejor ${word.lemma} ahora que esperar hasta el último momento.`, `It is better to ${word.translation_en.replace(/^to /, "")} now than to wait until the last moment.`],
    [`Me cuesta ${word.lemma} cuando tengo prisa.`, `I find it hard to ${word.translation_en.replace(/^to /, "")} when I am in a hurry.`],
    [`Aprendí a ${word.lemma} observando cómo lo hacía mi compañero.`, `I learned to ${word.translation_en.replace(/^to /, "")} by watching how my classmate did it.`],
    [`No olvides ${word.lemma} antes de salir.`, `Do not forget to ${word.translation_en.replace(/^to /, "")} before leaving.`],
  ];
  return templates[(groupIndex * 13 + index) % templates.length];
}

function makeAdjExample(word, groupIndex, index) {
  const templates = [
    [`Busco una opción ${word.lemma} que no sea demasiado cara.`, `I am looking for a ${word.translation_en} option that is not too expensive.`],
    [`El piso parecía ${word.lemma}, pero queríamos verlo otra vez.`, `The flat seemed ${word.translation_en}, but we wanted to see it again.`],
    [`Me gusta este plan porque es ${word.lemma} y fácil de explicar.`, `I like this plan because it is ${word.translation_en} and easy to explain.`],
    [`La respuesta fue ${word.lemma}, así que todos la entendieron.`, `The answer was ${word.translation_en}, so everyone understood it.`],
    [`Necesitamos un horario ${word.lemma} para poder organizarnos.`, `We need a ${word.translation_en} schedule so we can organise ourselves.`],
    [`Aunque era una situación ${word.lemma}, la resolvimos hablando.`, `Although it was a ${word.translation_en} situation, we solved it by talking.`],
  ];
  return templates[(groupIndex * 11 + index) % templates.length];
}

function makeAdvExample(word, groupIndex, index) {
  const templates = [
    [`Lo expliqué ${word.lemma} para que nadie se perdiera.`, `I explained it ${word.translation_en} so nobody would get lost.`],
    [`Normalmente respondo ${word.lemma} cuando recibo un aviso urgente.`, `I usually reply ${word.translation_en} when I receive an urgent notice.`],
    [`Esta vez lo hicimos ${word.lemma} y salió mejor.`, `This time we did it ${word.translation_en}, and it turned out better.`],
    [`Conviene revisar los datos ${word.lemma} antes de enviarlos.`, `It is best to check the data ${word.translation_en} before sending them.`],
    [`Llegamos ${word.lemma}, pero todavía había mucha gente esperando.`, `We arrived ${word.translation_en}, but there were still many people waiting.`],
  ];
  return templates[(groupIndex * 7 + index) % templates.length];
}

function makePhraseExample(word) {
  if (PHRASE_EXAMPLES[word.lemma]) return PHRASE_EXAMPLES[word.lemma];
  return [`Esta expresión se usa mucho: ${word.lemma}.`, `This expression is used often: ${word.translation_en}.`];
}

function buildWord(word, groupIndex, index, tag, groupId) {
  let example;
  if (word.pos === "phrase") example = makePhraseExample(word);
  else if (word.pos === "verb") example = makeVerbExample(word, groupIndex, index);
  else if (word.pos === "adj") example = makeAdjExample(word, groupIndex, index);
  else if (word.pos === "adv") example = makeAdvExample(word, groupIndex, index);
  else example = makeNounExample(word, groupId, index);
  const out = {
    lemma: word.lemma,
    pos: word.pos,
    translation_en: word.translation_en,
    example: example[0],
    example_en: example[1],
    tag,
  };
  if (word.gender && word.pos === "noun") out.gender = word.gender;
  return out;
}

function collectOtherLevelLemmas() {
  const other = new Set();
  const levels = readJson(path.join(DATA_DIR, "levels.json")).levels || [];
  for (const level of levels) {
    if (level.id === TARGET_LEVEL) continue;
    const index = readJson(path.join(LEVELS_DIR, level.id, "index.json"));
    for (const group of index.groups || []) {
      const data = readJson(path.join(LEVELS_DIR, level.id, `${group.id}.json`));
      for (const word of data.words || []) other.add(comparable(word.lemma));
    }
  }
  return other;
}

function uniqueCandidates(items, blocked, used) {
  const out = [];
  const local = new Set();
  for (const item of items) {
    const lemma = normalise(item.lemma);
    const key = comparable(lemma);
    if (!lemma || !item.translation_en || local.has(key) || blocked.has(key) || used.has(key)) continue;
    if (SINGLE_WORD_POS.has(item.pos) && /\s/.test(lemma)) continue;
    local.add(key);
    out.push({ ...item, lemma });
  }
  return out;
}

function buildGroup(group, groupIndex, blocked, used, reserve) {
  const parsed = {
    noun: parseItems(group.nouns, "noun"),
    verb: parseItems(group.verbs, "verb"),
    adj: parseItems(group.adjs, "adj"),
    adv: parseItems(group.advs, "adv"),
    phrase: parseItems(group.phrases, "phrase"),
  };
  const words = [];
  for (const pos of Object.keys(TARGET_POS_COUNTS)) {
    const need = TARGET_POS_COUNTS[pos];
    const pool = uniqueCandidates([...parsed[pos], ...reserve[pos]], blocked, used);
    const chosen = pool.slice(0, need);
    if (chosen.length !== need) {
      throw new Error(`${group.id} needs ${need} ${pos}, got ${chosen.length}`);
    }
    for (const item of chosen) {
      used.add(comparable(item.lemma));
      words.push(buildWord(item, groupIndex, words.length, group.tag, group.id));
    }
  }
  return {
    id: group.id,
    title: group.title,
    focus: group.focus,
    words,
  };
}

function validateGroup(data) {
  if (data.words.length !== 100) throw new Error(`${data.id} has ${data.words.length} words`);
  const counts = {};
  for (const word of data.words) {
    counts[word.pos] = (counts[word.pos] || 0) + 1;
    for (const field of ["lemma", "pos", "translation_en", "example", "example_en"]) {
      if (!word[field]) throw new Error(`${data.id}/${word.lemma || "unknown"} missing ${field}`);
    }
    if (SINGLE_WORD_POS.has(word.pos) && /\s/.test(word.lemma)) {
      throw new Error(`${data.id}/${word.lemma} is multi-word but pos=${word.pos}`);
    }
    if (word.pos === "phrase" && !/\s/.test(word.lemma)) {
      throw new Error(`${data.id}/${word.lemma} is a one-word phrase`);
    }
    if (comparable(word.lemma) === comparable(word.translation_en)) {
      throw new Error(`${data.id}/${word.lemma} has suspicious translation`);
    }
  }
  for (const [pos, count] of Object.entries(TARGET_POS_COUNTS)) {
    if ((counts[pos] || 0) !== count) {
      throw new Error(`${data.id} expected ${count} ${pos}, got ${counts[pos] || 0}`);
    }
  }
}

function writeJson(file, data) {
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

function rebuildMaster() {
  const rows = ["level,group,lemma"];
  const seen = new Set();
  const levels = readJson(path.join(DATA_DIR, "levels.json")).levels || [];
  for (const level of levels) {
    const index = readJson(path.join(LEVELS_DIR, level.id, "index.json"));
    for (const group of index.groups || []) {
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
  return seen.size;
}

function main() {
  const blocked = collectOtherLevelLemmas();
  const used = new Set();
  const reserve = {
    noun: parseItems(RESERVE_BY_POS.noun, "noun"),
    verb: parseItems(RESERVE_BY_POS.verb, "verb"),
    adj: parseItems(RESERVE_BY_POS.adj, "adj"),
    adv: parseItems(RESERVE_BY_POS.adv, "adv"),
    phrase: parseItems(RESERVE_BY_POS.phrase, "phrase"),
  };
  const built = GROUPS.map((group, index) => {
    const data = buildGroup(group, index, blocked, used, reserve);
    validateGroup(data);
    return data;
  });
  const index = {
    id: TARGET_LEVEL,
    title: "A2 · Elementary+",
    subtitle: "Real-life A2 vocabulary for daily life, services, travel, health, study and simple opinions.",
    focus: "Single-word vocabulary first, with a small number of useful fixed expressions in each group.",
    groups: GROUPS.map((group) => ({
      id: group.id,
      title: group.title,
      focus: group.focus,
      count: 100,
    })),
  };
  const levelDir = path.join(LEVELS_DIR, TARGET_LEVEL);
  writeJson(path.join(levelDir, "index.json"), index);
  for (const group of built) {
    writeJson(path.join(levelDir, `${group.id}.json`), group);
  }
  const total = rebuildMaster();
  console.log(JSON.stringify({ level: TARGET_LEVEL, groups: built.length, words: built.reduce((n, g) => n + g.words.length, 0), masterTotal: total }, null, 2));
}

main();
