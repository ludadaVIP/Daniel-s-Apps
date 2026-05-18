#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.resolve(__dirname, "../data/EspVocab");
const LEVELS_DIR = path.join(DATA_DIR, "levels");
const TARGET_LEVEL = "b1";
const SINGLE_WORD_POS = new Set(["noun", "verb", "adj", "adv"]);
const TARGET_POS_COUNTS = { noun: 45, verb: 28, adj: 15, adv: 5, phrase: 7 };
const RESERVE_RAW = `
abandono|noun|abandonment|m;abono|noun|subscription, pass|m;abundancia|noun|abundance|f;abuso|noun|abuse|m;acento|noun|accent|m;aclaración|noun|clarification|f;actitud|noun|attitude|f;adaptación|noun|adaptation|f;administración|noun|administration|f;admiración|noun|admiration|f;adolescente|noun|teenager|m;advertencia|noun|warning|f;afición|noun|hobby, interest|f;agenda|noun|planner|f;agotamiento|noun|exhaustion|m;agricultura|noun|agriculture|f;alarma|noun|alarm|f;alcance|noun|scope, reach|m;alivio|noun|relief|m;alumno|noun|student|m;amenaza|noun|threat|f;amistoso|adj|friendly;análisis|noun|analysis|m;anciano|noun|elderly person|m;anécdota|noun|anecdote|f;ángulo|noun|angle|m;ansiedad|noun|anxiety|f;antecedente|noun|background fact|m;aparato|noun|device|m;aprobación|noun|approval|f;archivo|noun|file|m;argumentación|noun|argumentation|f;arreglo|noun|arrangement, repair|m;asamblea|noun|assembly|f;asesoramiento|noun|guidance|m;aspiración|noun|aspiration|f;atracción|noun|attraction|f;audiencia|noun|audience|f;aula|noun|classroom|f;autonomía|noun|autonomy|f;avance|noun|progress|m;balanza|noun|balance, scales|f;bando|noun|side, faction|m;barrera|noun|barrier|f;base|noun|basis|f;beneficiario|noun|beneficiary|m;biblioteca|noun|library|f;bienestar|noun|wellbeing|m;borrador|noun|draft|m;brevedad|noun|brevity|f;caída|noun|fall|f;cálculo|noun|calculation|m;calendario|noun|calendar|m;calidad|noun|quality|f;campus|noun|university grounds|m;candidato|noun|candidate|m;capítulo|noun|chapter|m;carencia|noun|lack|f;carrera|noun|degree, career|f;castigo|noun|punishment|m;categoría|noun|category|f;censura|noun|censorship|f;certeza|noun|certainty|f;charla|noun|talk, chat|f;ciclo|noun|cycle|m;circunstancia|noun|circumstance|f;ciudadanía|noun|citizenship|f;claridad|noun|clarity|f;clima|noun|mood, climate|m;coherencia|noun|coherence|f;colaboración|noun|collaboration|f;colectivo|noun|group, collective|m;columna|noun|column|f;comercio|noun|trade, commerce|m;comisión|noun|committee, fee|f;compañía|noun|company, companionship|f;competencia|noun|skill, competition|f;complejidad|noun|complexity|f;compromiso|noun|commitment|m;concentración|noun|concentration|f;conclusión|noun|conclusion|f;concurso|noun|contest|m;conducta|noun|conduct|f;conferencia|noun|lecture, conference|f;confusión|noun|mix-up|f;conjunto|noun|set, whole|m;conocimiento|noun|knowledge|m;consenso|noun|consensus|m;conservación|noun|conservation|f;constancia|noun|perseverance|f;consulta|noun|consultation|f;consumidor|noun|consumer|m;contenido|noun|content|m;contradicción|noun|contradiction|f;contraste|noun|contrast|m;contribución|noun|contribution|f;control|noun|control|m;conveniencia|noun|convenience|f;cooperación|noun|cooperation|f;coordinación|noun|coordination|f;corriente|noun|current, trend|f;creatividad|noun|creativity|f;crecimiento|noun|growth|m;crisis|noun|crisis|f;crítica|noun|criticism, review|f;cuota|noun|fee, quota|f;curiosidad|noun|curiosity|f;daño|noun|damage|m;dato|noun|data point|m;debilidad|noun|weakness|f;decepción|noun|disappointment|f;declaración|noun|statement|f;dedicación|noun|dedication|f;defensa|noun|defence|f;demanda|noun|demand, lawsuit|f;demostración|noun|demonstration|f;dependencia|noun|dependence|f;desafío|noun|challenge|m;desarrollo|noun|development|m;desconfianza|noun|mistrust|f;descripción|noun|description|f;desempleo|noun|unemployment|m;desigualdad|noun|inequality|f;desorden|noun|disorder, mess|m;despedida|noun|farewell|f;diagnóstico|noun|diagnosis|m;diálogo|noun|dialogue|m;diferencia|noun|difference|f;dignidad|noun|dignity|f;dirección|noun|management, address|f;disciplina|noun|discipline|f;discurso|noun|speech, discourse|m;diseño|noun|design|m;distancia|noun|distance|f;distribución|noun|distribution|f;documentación|noun|documentation|f;edición|noun|edition, editing|f;efecto|noun|effect|m;eficacia|noun|effectiveness|f;ejemplar|noun|copy, example|m;elaboración|noun|preparation, production|f;emoción|noun|emotion|f;encargo|noun|assignment|m;encuentro|noun|meeting|m;energía|noun|energy|f;enfoque|noun|approach|m;engaño|noun|deception|m;entorno|noun|environment, surroundings|m;equivocación|noun|mistake|f;escasez|noun|shortage|f;especialista|noun|specialist|m;esperanza|noun|hope|f;estabilidad|noun|stability|f;estancia|noun|stay|f;estrategia|noun|strategy|f;estructura|noun|structure|f;evaluación|noun|assessment|f;evidencia|noun|evidence|f;exigencia|noun|demand, requirement|f;experto|noun|expert|m;expresión|noun|expression|f;facilidad|noun|ease|f;factor|noun|factor|m;falta|noun|lack, fault|f;fase|noun|phase|f;fenómeno|noun|phenomenon|m;financiación|noun|funding|f;flexibilidad|noun|flexibility|f;fracaso|noun|failure|m;franja|noun|time slot, strip|f;función|noun|function|f;fundamento|noun|basis, foundation|m;ganancia|noun|gain|f;garantía|noun|guarantee|f;gestión|noun|management|f;gobernador|noun|governor|m;hábito|noun|habit|m;hallazgo|noun|finding|m;hipótesis|noun|hypothesis|f;honestidad|noun|honesty|f;horno|noun|oven|m;huella|noun|footprint, trace|f;identificación|noun|identification|f;impacto|noun|impact|m;impresión|noun|impression|f;incertidumbre|noun|uncertainty|f;informe|noun|report|m;iniciativa|noun|initiative|f;inquietud|noun|concern, unease|f;inscripción|noun|registration|f;instrucción|noun|instruction|f;intercambio|noun|exchange|m;interés|noun|interest|m;interpretación|noun|interpretation|f;interrupción|noun|interruption|f;inversión|noun|investment|f;investigación|noun|research|f;juicio|noun|judgement, trial|m;junta|noun|board, meeting|f;justificación|noun|justification|f;juventud|noun|youth|f;labor|noun|work, task|f;lectura|noun|reading|f;lenguaje|noun|language|m;lesión|noun|injury|f;liderazgo|noun|leadership|m;límite|noun|limit|m;logro|noun|achievement|m;mantenimiento|noun|maintenance|m;mayoría|noun|majority|f;medida|noun|measure|f;minoría|noun|minority|f;modelo|noun|model|m;modo|noun|way, mode|m;motivación|noun|motivation|f;muestra|noun|sample|f;nivel|noun|level|m;normativa|noun|regulations|f;obligación|noun|obligation|f;observación|noun|observation|f;obstáculo|noun|obstacle|m;ocasión|noun|occasion|f;oferta|noun|offer|f;orientación|noun|guidance|f;origen|noun|origin|m;paciencia|noun|patience|f;participante|noun|participant|m;percepción|noun|perception|f;periodo|noun|period|m;permiso|noun|permission|m;perspectiva|noun|perspective|f;pista|noun|clue|f;planificación|noun|planning|f;población|noun|population|f;política|noun|policy, politics|f;porcentaje|noun|percentage|m;postura|noun|stance|f;precaución|noun|precaution|f;preferencia|noun|preference|f;prejuicio|noun|prejudice|m;preparación|noun|preparation|f;presión|noun|pressure|f;previsión|noun|forecast|f;prioridad|noun|priority|f;procedimiento|noun|procedure|m;propuesta|noun|proposal|f;proveedor|noun|provider|m;prueba|noun|test, proof|f;queja|noun|complaint|f;reacción|noun|reaction|f;realidad|noun|reality|f;rechazo|noun|rejection|m;recomendación|noun|recommendation|f;reconocimiento|noun|recognition|m;recuperación|noun|recovery|f;referencia|noun|reference|f;reflexión|noun|reflection|f;registro|noun|record, registration|m;relato|noun|account, story|m;rendimiento|noun|performance|m;reparto|noun|distribution, cast|m;representante|noun|representative|m;resistencia|noun|resistance|f;respaldo|noun|backing, support|m;restricción|noun|restriction|f;retraso|noun|delay|m;reunión|noun|meeting|f;riesgo|noun|risk|m;ritmo|noun|pace, rhythm|m;salida|noun|exit, departure|f;seguimiento|noun|follow-up|m;semejanza|noun|similarity|f;sensación|noun|feeling, sensation|f;sentido|noun|meaning, sense|m;señal|noun|sign|f;sesión|noun|session|f;síntesis|noun|synthesis|f;sistema|noun|system|m;socio|noun|member, partner|m;solicitud|noun|application, request|f;sospecha|noun|suspicion|f;sugerencia|noun|suggestion|f;taller|noun|workshop|m;tendencia|noun|trend|f;tensión|noun|strain|f;testigo|noun|witness|m;testimonio|noun|testimony|m;toma|noun|taking, shot|f;transformación|noun|transformation|f;transición|noun|transition|f;trato|noun|treatment, deal|m;utilidad|noun|usefulness|f;valentía|noun|courage|f;valoración|noun|assessment, rating|f;ventaja|noun|advantage|f;vínculo|noun|bond, link|m;voluntad|noun|will, willingness|f;
abandonar|verb|to abandon;abordar|verb|to address;absorber|verb|to absorb;acceder|verb|to access;acelerar|verb|to speed up;acompañar|verb|to accompany;aconsejar|verb|to advise;adaptar|verb|to adapt;advertir|verb|to warn;afirmar|verb|to state;agotar|verb|to exhaust;agradecer|verb|to thank;aislar|verb|to isolate;alcanzar|verb|to reach;amenazar|verb|to threaten;analizar|verb|to analyse;animar|verb|to encourage;anotar|verb|to note down;aportar|verb|to contribute;apoyar|verb|to support;apreciar|verb|to appreciate;aprobar|verb|to pass, approve;aprovechar|verb|to make use of;argumentar|verb|to argue;asistir|verb|to attend;asumir|verb|to take on;atreverse|verb|to dare;aumentar|verb|to increase;avanzar|verb|to progress;calcular|verb|to calculate;carecer|verb|to lack;ceder|verb|to give in;clasificar|verb|to classify;colaborar|verb|to collaborate;combinar|verb|to combine;cometer|verb|to commit;compensar|verb|to compensate;comprobar|verb|to check;comunicar|verb|to communicate;concentrar|verb|to concentrate;confiar|verb|to trust;confirmar|verb|to confirm;confundir|verb|to confuse;conservar|verb|to preserve;considerar|verb|to consider;consistir|verb|to consist;construir|verb|to build;consultar|verb|to consult;contribuir|verb|to contribute;controlar|verb|to control;convencer|verb|to convince;convertir|verb|to turn into;coordinar|verb|to coordinate;criticar|verb|to criticise;cuestionar|verb|to question;cumplir|verb|to fulfil;debatir|verb|to debate;defender|verb|to defend;definir|verb|to define;demostrar|verb|to demonstrate;depender|verb|to depend;desarrollar|verb|to develop;descubrir|verb|to discover;describir|verb|to describe;despedir|verb|to dismiss;destacar|verb|to highlight;detectar|verb|to detect;detener|verb|to stop;dirigir|verb|to direct;diseñar|verb|to design;distinguir|verb|to distinguish;distribuir|verb|to distribute;elaborar|verb|to prepare, develop;elegir|verb|to choose;eliminar|verb|to eliminate;enfrentar|verb|to face;engañar|verb|to deceive;establecer|verb|to establish;evaluar|verb|to evaluate;evitar|verb|to avoid;exigir|verb|to demand;experimentar|verb|to experience;expresar|verb|to express;facilitar|verb|to make easier;fomentar|verb|to encourage;fracasar|verb|to fail;garantizar|verb|to guarantee;generar|verb|to generate;gestionar|verb|to manage;identificar|verb|to identify;imaginar|verb|to imagine;impedir|verb|to prevent;implicar|verb|to imply;incluir|verb|to include;indicar|verb|to indicate;influir|verb|to influence;informar|verb|to inform;insistir|verb|to insist;interpretar|verb|to interpret;interrumpir|verb|to interrupt;invertir|verb|to invest;investigar|verb|to research;justificar|verb|to justify;limitar|verb|to limit;mantener|verb|to maintain;matizar|verb|to nuance;mencionar|verb|to mention;modificar|verb|to modify;motivar|verb|to motivate;negar|verb|to deny;observar|verb|to observe;ocupar|verb|to occupy;oponerse|verb|to oppose;participar|verb|to participate;percibir|verb|to perceive;perjudicar|verb|to harm;permanecer|verb|to remain;permitir|verb|to allow;pertenecer|verb|to belong;plantear|verb|to raise, propose;predecir|verb|to predict;preparar|verb|to prepare;prevenir|verb|to prevent;proponer|verb|to propose;proteger|verb|to protect;provocar|verb|to cause;publicar|verb|to publish;reaccionar|verb|to react;rechazar|verb|to reject;reclamar|verb|to claim, complain;recomendar|verb|to recommend;reconocer|verb|to recognise;recuperar|verb|to recover;reducir|verb|to reduce;reflejar|verb|to reflect;reforzar|verb|to strengthen;registrar|verb|to register;relacionar|verb|to relate;resolver|verb|to solve;respetar|verb|to respect;resumir|verb|to summarise;revisar|verb|to review;seleccionar|verb|to select;señalar|verb|to point out;sostener|verb|to maintain, support;superar|verb|to overcome;sustituir|verb|to replace;valorar|verb|to value, assess;variar|verb|to vary;verificar|verb|to verify;
abierto|adj|open;abstracto|adj|abstract;académico|adj|academic;accesible|adj|accessible;adecuado|adj|suitable;agotador|adj|exhausting;ajeno|adj|unrelated, someone else's;amplio|adj|broad;anónimo|adj|anonymous;anterior|adj|previous;apropiado|adj|appropriate;atento|adj|attentive;atractivo|adj|attractive;auténtico|adj|genuine;autónomo|adj|independent;beneficioso|adj|beneficial;breve|adj|brief;capaz|adj|capable;clásico|adj|classic;coherente|adj|coherent;colectivo|adj|collective;complejo|adj|complex;concreto|adj|concrete;consciente|adj|aware;constante|adj|constant;contrario|adj|opposite;convincente|adj|convincing;cotidiano|adj|everyday;crítico|adj|critical;cuidadoso|adj|careful;decisivo|adj|decisive;definitivo|adj|final;delicado|adj|delicate;dependiente|adj|dependent;desigual|adj|unequal;detallado|adj|detailed;digno|adj|worthy;disponible|adj|available;distinto|adj|different;diverso|adj|diverse;eficaz|adj|effective;eficiente|adj|efficient;emocionante|adj|exciting;estable|adj|stable;estricto|adj|strict;excesivo|adj|excessive;exigente|adj|demanding;externo|adj|external;favorable|adj|favourable;flexible|adj|adaptable;fundamental|adj|essential;grave|adj|serious;habitual|adj|usual;honesto|adj|honest;igualitario|adj|egalitarian;independiente|adj|independent;indirecto|adj|indirect;inesperado|adj|unexpected;injusto|adj|unfair;innecesario|adj|unnecessary;inseguro|adj|insecure;interno|adj|internal;justo|adj|fair;limitado|adj|limited;lógico|adj|logical;mayoritario|adj|majority;minoritario|adj|minority;moderado|adj|moderate;mutuo|adj|mutual;neutral|adj|impartial;notable|adj|remarkable;objetivo|adj|objective;obvio|adj|obvious;ordinario|adj|ordinary;paciente|adj|patient;permanente|adj|permanent;positivo|adj|positive;previo|adj|prior;productivo|adj|productive;profundo|adj|deep;progresivo|adj|gradual;razonable|adj|reasonable;reciente|adj|recent;remoto|adj|remote;respetuoso|adj|respectful;significativo|adj|meaningful;sólido|adj|solid;temporal|adj|temporary;valioso|adj|valuable;variado|adj|varied;visible|adj|easy to see;
actualmente|adv|currently;adecuadamente|adv|properly;afortunadamente|adv|fortunately;anualmente|adv|annually;aproximadamente|adv|approximately;atentamente|adv|attentively;brevemente|adv|briefly;constantemente|adv|constantly;cuidadosamente|adv|carefully;definitivamente|adv|definitely;directamente|adv|directly;efectivamente|adv|indeed;especialmente|adv|especially;finalmente|adv|finally;frecuentemente|adv|frequently;generalmente|adv|generally;honestamente|adv|honestly;inmediatamente|adv|immediately;indirectamente|adv|indirectly;inicialmente|adv|initially;justamente|adv|fairly;lentamente|adv|slowly;ligeramente|adv|slightly;normalmente|adv|normally;obviamente|adv|obviously;personalmente|adv|personally;previamente|adv|beforehand;principalmente|adv|mainly;probablemente|adv|probably;profundamente|adv|deeply;recientemente|adv|recently;seriamente|adv|seriously;simplemente|adv|simply;temporalmente|adv|temporarily;totalmente|adv|completely;últimamente|adv|lately;acogida|noun|welcome, reception|f;acuerdo|noun|settlement|m;ajuste|noun|adjustment|m;albergue|noun|hostel|m;alquiler|noun|rental|m;altavoz|noun|speaker|m;anfitrión|noun|host|m;anuncio|noun|notice|m;apuesta|noun|bet, commitment|f;apunte|noun|note|m;archivo|noun|archive|m;asesor|noun|advisor|m;asistente|noun|attendee, assistant|m;autobús|noun|bus|m;averiguación|noun|inquiry|f;balance|noun|overview|m;calificación|noun|grade, rating|f;caminata|noun|walk, hike|f;carpintero|noun|carpenter|m;cartel|noun|poster|m;catálogo|noun|catalogue|m;cierre|noun|closure|m;colaborador|noun|collaborator|m;comedor|noun|dining room|m;comparación|noun|comparison|f;comprobante|noun|proof, receipt|m;compra|noun|purchase|f;comunidad|noun|community|f;consejería|noun|advisory office|f;contador|noun|meter, accountant|m;contraseña|noun|password|f;convenio|noun|agreement|m;cooperativa|noun|cooperative|f;crédito|noun|credit|m;cuidador|noun|carer|m;descuento|noun|discount|m;desplazamiento|noun|travel, commute|m;destinatario|noun|recipient|m;deterioro|noun|deterioration|m;dispositivo|noun|device|m;editor|noun|person who edits a publication|m;encuesta|noun|survey|f;entrega|noun|delivery, submission|f;entrevistador|noun|interviewer|m;equipo|noun|equipment, team|m;escenario|noun|setting, stage|m;especialidad|noun|speciality|f;estímulo|noun|stimulus, encouragement|m;estudiante|noun|learner|m;facultad|noun|faculty|f;folleto|noun|leaflet|m;gestor|noun|manager|m;grabación|noun|recording|f;guardería|noun|nursery|f;guion|noun|script|m;impulso|noun|push, impulse|m;incidencia|noun|incident|f;indicador|noun|indicator|m;ingreso|noun|income, admission|m;inspector|noun|official checker|m;instalación|noun|facility, installation|f;interlocutor|noun|conversation partner|m;itinerario|noun|itinerary|m;justificante|noun|supporting document|m;licencia|noun|licence|f;matiz|noun|nuance|m;mediador|noun|mediator|m;mensajería|noun|messaging|f;monitor|noun|instructor, monitor|m;notificación|noun|notification|f;obligatorio|adj|required;ocupación|noun|occupation, occupancy|f;operador|noun|operator|m;orientador|noun|advisor|m;paquete|noun|package|m;parcela|noun|plot of land|f;pausa|noun|pause|f;peatón|noun|pedestrian|m;permanencia|noun|continuity, stay|f;plataforma|noun|platform|f;portavoz|noun|spokesperson|m;presupuesto|noun|budget estimate|m;prestación|noun|benefit, service|f;protocolo|noun|protocol|m;proyección|noun|projection, screening|f;recordatorio|noun|reminder|m;redacción|noun|writing, editorial office|f;referente|noun|reference point|m;refuerzo|noun|reinforcement|m;renovación|noun|renewal|f;residencia|noun|residence|f;responsable|noun|person in charge|m;revisión|noun|review|f;solicitante|noun|applicant|m;subida|noun|increase|f;suministro|noun|supply|m;supervisor|noun|team supervisor|m;tarifa|noun|rate, fare|f;técnico|noun|technician|m;usuario|noun|user|m;vecindario|noun|neighbourhood|m;voluntariado|noun|volunteering|m;acoger|verb|to welcome;acordar|verb|to agree;admitir|verb|to admit;agendar|verb|to schedule;alojar|verb|to host;ampliar|verb|to expand;aplazar|verb|to postpone;archivar|verb|to file, archive;asegurar|verb|to ensure;asignar|verb|to assign;atravesar|verb|to cross;autorizar|verb|to authorise;beneficiar|verb|to benefit;capacitar|verb|to train;charlar|verb|to chat;comunicar|verb|to notify;concretar|verb|to make specific;contrastar|verb|to compare, verify;convocar|verb|to call together;corresponder|verb|to correspond;desconfiar|verb|to mistrust;desplazar|verb|to move, commute;destinar|verb|to allocate;difundir|verb|to spread;disminuir|verb|to decrease;dividir|verb|to divide;emitir|verb|to issue, broadcast;encargar|verb|to assign, order;enriquecer|verb|to enrich;estimar|verb|to estimate;facilitar|verb|to facilitate;figurar|verb|to appear, be listed;financiar|verb|to fund;formular|verb|to formulate;gestionar|verb|to handle;habilitar|verb|to enable;impartir|verb|to teach, deliver;incorporar|verb|to incorporate;incumplir|verb|to fail to comply;indicar|verb|to point out;inscribirse|verb|to register;integrar|verb|to integrate;justificar|verb|to justify;localizar|verb|to locate;notificar|verb|to notify;orientar|verb|to guide;perjudicar|verb|to harm;posponer|verb|to postpone;presupuestar|verb|to budget;recopilar|verb|to gather;renovar|verb|to renew;repartir|verb|to distribute;residir|verb|to reside;tramitar|verb|to process;ubicar|verb|to locate;urgir|verb|to be urgent;vaciar|verb|to empty;vincular|verb|to link;abordable|adj|affordable;administrativo|adj|administrative;apto|adj|suitable, fit;asequible|adj|affordable;bilateral|adj|two-sided;comparable|adj|easy to compare;comunitario|adj|community-related;conveniente|adj|convenient;cotizable|adj|subject to contributions;discreto|adj|discreet;doméstico|adj|household-related;duradero|adj|lasting;educativo|adj|educational;esencial|adj|essential;fiable|adj|reliable;financiero|adj|financial;habitual|adj|usual;laboral|adj|work-related;municipal|adj|town-hall related;presencial|adj|in-person;preventivo|adj|preventive;residencial|adj|residential;sanitario|adj|health-related;solidario|adj|supportive;urgente|adj|urgent;virtual|adj|online;correctamente|adv|correctly;formalmente|adv|officially;previsiblemente|adv|predictably;semanalmente|adv|weekly;abarcar|verb|to cover;abreviar|verb|to shorten;acumular|verb|to accumulate;adaptarse|verb|to adapt;adelantar|verb|to move forward;administrar|verb|to administer;adoptar|verb|to adopt;afrontar|verb|to face;agrupar|verb|to group;ajustar|verb|to adjust;aliviar|verb|to ease;alternar|verb|to alternate;anular|verb|to cancel;aplicar|verb|to apply;apuntar|verb|to write down;argumentarse|verb|to be argued;asociar|verb|to associate;atender|verb|to attend to;atrasar|verb|to delay;beneficiarse|verb|to benefit;calificar|verb|to grade;canalizar|verb|to channel;capacitarse|verb|to get training;caracterizar|verb|to characterise;centrarse|verb|to focus;colocar|verb|to place;comprometer|verb|to commit;conceder|verb|to grant;conectar|verb|to connect;consolidar|verb|to consolidate;contratar|verb|to hire;corregirse|verb|to correct oneself;declarar|verb|to declare;dedicar|verb|to devote;delimitar|verb|to define limits;desaparecer|verb|to disappear;descartar|verb|to rule out;desconectar|verb|to disconnect;desempeñar|verb|to perform;detallar|verb|to detail;diferenciar|verb|to differentiate;documentar|verb|to document;ejercer|verb|to exercise, practise;enlazar|verb|to link;equilibrar|verb|to balance;esforzarse|verb|to make an effort;especificar|verb|to specify;estabilizar|verb|to stabilise;extraer|verb|to extract;favorecer|verb|to favour;graduarse|verb|to graduate;ilustrar|verb|to illustrate;implementar|verb|to implement;impulsar|verb|to drive forward;inspirar|verb|to inspire;intervenir|verb|to intervene;justificarse|verb|to justify oneself;negociarse|verb|to be negotiated;nombrar|verb|to name;optimizar|verb|to optimise;ordenar|verb|to arrange;preocuparse|verb|to worry;pronunciar|verb|to pronounce;recaudar|verb|to raise funds;reconstruir|verb|to rebuild;regular|verb|to regulate;reparar|verb|to repair;resaltar|verb|to stress, highlight;retomar|verb|to resume;solucionar|verb|to solve;subrayar|verb|to underline, stress;tramitarse|verb|to be processed;transmitir|verb|to transmit;valerse|verb|to make use of;vincularse|verb|to be linked;acertado|adj|appropriate;actualizado|adj|updated;aislado|adj|isolated;alternativo|adj|alternative;aplicable|adj|applicable;argumentado|adj|well-argued;coordinado|adj|coordinated;demostrable|adj|demonstrable;documentado|adj|well-documented;equilibrado|adj|balanced;específico|adj|specific;financiado|adj|funded;fundado|adj|well-founded;integrado|adj|integrated;justificado|adj|justified;negociable|adj|negotiable;ordenado|adj|well-organised;participativo|adj|participatory;previsible|adj|predictable;regulado|adj|regulated;relevante|adj|relevant;renovable|adj|renewable;representativo|adj|representative;solucionable|adj|solvable;verificable|adj|verifiable;aisladamente|adv|in isolation;anteriormente|adv|previously;colectivamente|adv|collectively;concretamente|adv|specifically;gradualmente|adv|gradually;inicialmente|adv|initially;oralmente|adv|orally;prácticamente|adv|practically;progresivamente|adv|progressively;respectivamente|adv|respectively
`;

const GROUPS = [
  {
    id: "group-1",
    title: "Ideas y estudio · Explaining and learning",
    focus: "B1 words for explaining opinions, learning from mistakes, and organising study.",
    tag: "Study & ideas",
    nouns: `
aprendizaje|learning|m;avance|progress|m;consejo|advice|m;duda|doubt|f;explicación|explanation|f;pregunta|question|f;respuesta|answer|f;ejemplo|example|m;resumen|summary|m;detalle|detail|m;tema|topic|m;asunto|matter|m;motivo|reason|m;causa|cause|f;consecuencia|consequence|f;razón|reason|f;opinión|personal view|f;acuerdo|agreement|m;desacuerdo|disagreement|m;debate|discussion|m;argumento|argument|m;criterio|criterion|m;idea|idea|f;creencia|belief|f;recuerdo|memory|m;experiencia|experience|f;error|mistake|m;solución|solution|f;mejora|improvement|f;revisión|review|f;práctica|practice|f;esfuerzo|effort|m;atención|attention|f;memoria|memory|f;costumbre|habit|f;rutina|routine|f;meta|goal|f;objetivo|objective|m;progreso|progress|m;capacidad|ability|f;habilidad|skill|f;confianza|confidence|f;paciencia|patience|f;curiosidad|curiosity|f;formación|training|f;lectura|reading|f;escritura|writing|f;pronunciación|pronunciation|f
`,
    verbs: `
aprender|to learn;repasar|to review;recordar|to remember;olvidar|to forget;entender|to understand;explicar|to explain;resumir|to summarise;comparar|to compare;relacionar|to connect;organizar|to organise;practicar|to practise;mejorar|to improve;fallar|to fail;corregir|to correct;aclarar|to clarify;preguntar|to ask;responder|to answer;opinar|to give an opinion;debatir|to debate;argumentar|to argue;dudar|to doubt;creer|to believe;suponer|to suppose;imaginar|to imagine;comprobar|to check;pensar|to think;concluir|to conclude;avanzar|to make progress
`,
    adjs: `
claro|clear;confuso|confusing;útil|useful;necesario|necessary;posible|possible;probable|likely;correcto|correct;incorrecto|incorrect;adecuado|suitable;suficiente|sufficient;insuficiente|insufficient;completo|complete;incompleto|incomplete;práctico|practical;teórico|theoretical
`,
    advs: `claramente|clearly;probablemente|probably;normalmente|normally;especialmente|especially`,
    phrases: `
darse cuenta de|to realise;tener en cuenta|to take into account;en mi opinión|in my opinion;por ejemplo|for example;en resumen|in short;estar de acuerdo|to agree;no cabe duda|there is no doubt
`,
  },
  {
    id: "group-2",
    title: "Trabajo y trámites · Work and paperwork",
    focus: "Useful B1 vocabulary for jobs, applications, documents, appointments and complaints.",
    tag: "Work & admin",
    nouns: `
solicitud|application, request|f;entrevista|interview|f;contrato|contract|m;salario|salary|m;puesto|position, job|m;empleo|employment|m;empresa|company|f;cliente|client|m;compañero|colleague|m;equipo|team|m;horario|schedule|m;turno|shift|m;plazo|deadline|m;tarea|task|f;requisito|required condition|m;formulario|form|m;documento|document|m;copia|copy|f;firma|signature|f;archivo|file|m;carpeta|folder|f;correo|email|m;mensaje|message|m;aviso|notice|m;anuncio|advertisement, notice|m;convocatoria|call, announcement|f;permiso|permit, permission|m;certificado|certificate|m;matrícula|enrolment|f;beca|scholarship|f;cita|appointment|f;trámite|procedure|m;queja|complaint|f;reclamación|formal complaint|f;factura|invoice|f;recibo|receipt|m;presupuesto|budget, estimate|m;gasto|expense|m;ingreso|income|m;ahorro|savings|m;deuda|debt|f;impuesto|tax|m;seguro|insurance|m;oficina|office|f;servicio|service|m;atención|assistance, attention|f;responsabilidad|responsibility|f
`,
    verbs: `
solicitar|to apply for;rellenar|to fill in;adjuntar|to attach;firmar|to sign;entregar|to hand in;enviar|to send;recibir|to receive;revisar|to review;cobrar|to charge, to get paid;pagar|to pay;contratar|to hire;despedir|to dismiss;aceptar|to accept;rechazar|to reject;negociar|to negotiate;organizar|to organise;coordinar|to coordinate;atender|to assist;avisar|to notify;confirmar|to confirm;cancelar|to cancel;reclamar|to complain formally;resolver|to solve;tramitar|to process;imprimir|to print;guardar|to save;descargar|to download;actualizar|to update
`,
    adjs: `
laboral|work-related;profesional|professional;urgente|urgent;pendiente|pending;válido|valid;gratuito|free of charge;obligatorio|required;voluntario|voluntary;temporal|temporary;fijo|permanent;formal|official in tone;informal|casual;responsable|responsible;puntual|punctual;disponible|available
`,
    advs: `puntualmente|punctually;temporalmente|temporarily;formalmente|formally;correctamente|correctly`,
    phrases: `
estar pendiente de|to keep an eye on;ponerse en contacto|to get in touch;llevar a cabo|to carry out;hacer una reclamación|to file a complaint;estar a cargo de|to be in charge of;cumplir con|to comply with;quedar en|to agree to meet
`,
  },
  {
    id: "group-3",
    title: "Ciudad y vivienda · City, housing and services",
    focus: "B1 words for renting, neighbourhood life, transport, repairs and public services.",
    tag: "City & housing",
    nouns: `
alquiler|rent|m;vivienda|housing, home|f;piso|flat, apartment|m;barrio|neighbourhood|m;vecino|neighbour|m;comunidad|community|f;calle|street|f;acera|pavement, sidewalk|f;cruce|crossing|m;semáforo|traffic light|m;parada|stop|f;trayecto|journey|m;atasco|traffic jam|m;aparcamiento|parking|m;billete|ticket|m;abono|travel pass, subscription|m;mapa|map|m;zona|area|f;centro|centre|m;afueras|outskirts|f;ayuntamiento|town hall|m;policía|police|f;urgencia|emergency|f;avería|breakdown|f;reparación|repair|f;herramienta|tool|f;enchufe|socket|m;calefacción|heating|f;ascensor|lift, elevator|m;escalera|stairs|f;tejado|roof|m;humedad|damp|f;ruido|noise|m;basura|rubbish|f;contenedor|bin, container|m;reciclaje|recycling|m;jardín|garden|m;parque|park|m;plaza|square|f;mercado|market|m;tienda|shop|f;farmacia|pharmacy|f;consulta|appointment, clinic|f;reserva|booking|f;mudanza|move, relocation|f;dirección|address|f;llave|key|f;propietario|landlord, owner|m
`,
    verbs: `
alquilar|to rent;mudarse|to move house;convivir|to live together;avisar|to warn, notify;arreglar|to fix;reparar|to repair;funcionar|to work, function;romper|to break;apagar|to turn off;encender|to turn on;subir|to go up;baixar|to go down;bajar|to go down;cruzar|to cross;aparcar|to park;conducir|to drive;recorrer|to travel through;perder|to miss, lose;encontrar|to find;reservar|to book;cancelar|to cancel;quejarse|to complain;molestar|to bother;reciclar|to recycle;limpiar|to clean;compartir|to share;prohibir|to forbid;permitir|to allow
`,
    adjs: `
urbano|urban;vecinal|neighbourhood-related;público|public;privado|private;céntrico|central;lejano|far away;cercano|nearby;seguro|safe;peligroso|dangerous;ruidoso|noisy;tranquilo|quiet;limpio|clean;sucio|dirty;estrecho|narrow;amplio|spacious
`,
    advs: `cerca|nearby;lejos|far away;rápidamente|quickly;diariamente|daily`,
    phrases: `
estar en obras|to be under construction;hacer ruido|to make noise;darse una vuelta|to take a walk;echar una mano|to lend a hand;tener lugar|to take place;poner una queja|to make a complaint;quedarse sin|to run out of
`,
  },
  {
    id: "group-4",
    title: "Salud y bienestar · Health and daily balance",
    focus: "B1 vocabulary for appointments, symptoms, stress, habits, emotions and self-care.",
    tag: "Health & wellbeing",
    nouns: `
salud|health|f;síntoma|symptom|m;dolor|pain|m;fiebre|fever|f;tos|cough|f;resfriado|cold|m;gripe|flu|f;herida|wound|f;alergia|allergy|f;medicina|medicine|f;pastilla|pill|f;tratamiento|treatment|m;receta|prescription|f;consulta|medical appointment|f;paciente|patient|m;enfermero|nurse|m;dentista|dentist|m;descanso|rest|m;sueño|sleep|m;insomnio|insomnia|m;cansancio|tiredness|m;estrés|stress|m;ánimo|mood|m;humor|mood, humour|m;miedo|fear|m;alegría|joy|f;tristeza|sadness|f;enfado|anger|m;vergüenza|embarrassment|f;orgullo|pride|m;preocupación|worry|f;apoyo|support|m;calma|calm|f;equilibrio|balance|m;costumbre|habit|f;alimentación|diet|f;ejercicio|exercise|m;peso|weight|m;energía|energy|f;fuerza|strength|f;riesgo|risk|m;prevención|prevention|f;cuidado|care|m;seguridad|safety|f;emergencia|emergency|f;mejilla|cheek|f;rodilla|knee|f;espalda|back|f
`,
    verbs: `
doler|to hurt;curar|to heal;mejorar|to get better;empeorar|to get worse;descansar|to rest;dormir|to sleep;respirar|to breathe;cuidar|to take care of;prevenir|to prevent;evitar|to avoid;aguantar|to put up with;sentir|to feel;preocupar|to worry;calmar|to calm;animar|to cheer up;apoyar|to support;relajarse|to relax;acostarse|to go to bed;levantarse|to get up;alimentarse|to feed oneself;engordar|to gain weight;adelgazar|to lose weight;proteger|to protect;consultar|to consult;recetar|to prescribe;acompañar|to accompany;superar|to overcome
`,
    adjs: `
sano|healthy;enfermo|ill;grave|serious;leve|mild;fuerte|strong;débil|weak;cansado|tired;nervioso|nervous;tranquilo|calm;preocupado|worried;orgulloso|proud;avergonzado|embarrassed;doloroso|painful;saludable|healthy;emocional|emotional
`,
    advs: `físicamente|physically;emocionalmente|emotionally;lentamente|slowly;últimamente|lately`,
    phrases: `
sentirse mejor|to feel better;tener fiebre|to have a fever;estar de baja|to be on sick leave;pedir cita|to make an appointment;hacer ejercicio|to exercise;pasarlo mal|to have a hard time;venir bien|to be good for someone
`,
  },
  {
    id: "group-5",
    title: "Relaciones y convivencia · People and feelings",
    focus: "B1 words for friendships, family, apologies, conflict, trust and everyday social life.",
    tag: "Relationships",
    nouns: `
amistad|friendship|f;pareja|partner, couple|f;relación|relationship|f;convivencia|living together|f;confianza|trust|f;respeto|respect|m;cariño|affection|m;apoyo|support|m;disculpa|apology|f;perdón|forgiveness|m;malentendido|misunderstanding|m;conflicto|conflict|m;pelea|argument, fight|f;discusión|argument|f;acuerdo|agreement|m;desacuerdo|disagreement|m;límite|limit|m;secreto|secret|m;promesa|promise|f;sorpresa|surprise|f;invitación|invitation|f;celebración|celebration|f;despedida|farewell|f;visita|visit|f;regalo|gift|m;detalle|thoughtful gesture|m;favor|favour|m;culpa|fault, guilt|f;carácter|personality|m;actitud|attitude|f;comportamiento|behaviour|m;reacción|reaction|f;gesto|gesture|m;sonrisa|smile|f;abrazo|hug|m;ánimo|encouragement|m;soledad|loneliness|f;compañía|company|f;grupo|group|m;ambiente|atmosphere|m;costumbre|custom|f;tradición|tradition|f;generación|generation|f;infancia|childhood|f;adolescencia|adolescence|f;madurez|maturity|f;identidad|identity|f
`,
    verbs: `
confiar|to trust;respetar|to respect;apoyar|to support;perdonar|to forgive;disculparse|to apologise;prometer|to promise;cumplir|to keep, fulfil;fallar|to let down;molestar|to bother;discutir|to argue;negociar|to negotiate;compartir|to share;convivir|to live together;celebrar|to celebrate;invitar|to invite;despedirse|to say goodbye;abrazar|to hug;sonreír|to smile;reaccionar|to react;aconsejar|to advise;animar|to encourage;escuchar|to listen;interrumpir|to interrupt;aceptar|to accept;rechazar|to reject;atreverse|to dare;madurar|to mature
`,
    adjs: `
sincero|sincere;amable|kind;egoísta|selfish;generoso|generous;fiel|loyal;celoso|jealous;maduro|mature;inmaduro|immature;sensible|sensitive;orgulloso|proud;tímido|shy;abierto|open;cerrado|closed;social|community-related;personal|individual
`,
    advs: `sinceramente|sincerely;personalmente|personally;mutuamente|mutually;socialmente|socially`,
    phrases: `
llevarse bien|to get along;hacer las paces|to make peace;pedir perdón|to apologise;guardar un secreto|to keep a secret;tener confianza|to trust;dar las gracias|to say thank you;pasar tiempo|to spend time
`,
  },
  {
    id: "group-6",
    title: "Medios y tecnología · News and digital life",
    focus: "B1 vocabulary for media, online tasks, privacy, devices, messages and reliable information.",
    tag: "Media & tech",
    nouns: `
noticia|news item|f;titular|headline|m;fuente|source|f;artículo|article|m;reportaje|report|m;entrevista|interview|f;boletín|bulletin|m;prensa|press|f;radio|radio|f;pantalla|screen|f;teclado|keyboard|m;ratón|mouse|m;contraseña|password|f;cuenta|account|f;perfil|profile|m;usuario|user|m;enlace|link|m;archivo|file|m;carpeta|folder|f;aplicación|app|f;herramienta|tool|f;red|network|f;privacidad|privacy|f;seguridad|security|f;riesgo|risk|m;engaño|deception|m;rumor|rumour|m;mentira|lie|f;verdad|truth|f;dato|piece of data|m;cifra|figure, number|f;gráfico|chart|m;encuesta|survey|f;comentario|comment|m;opinión|personal view|f;publicación|post, publication|f;mensaje|message|m;respuesta|reply|f;aviso|notification|m;actualización|update|f;descarga|download|f;memoria|storage, memory|f;batería|battery|f;señal|signal|f;conexión|connection|f;velocidad|speed|f;calidad|quality|f;acceso|access|m
`,
    verbs: `
publicar|to publish;anunciar|to announce;informar|to inform;comentar|to comment;compartir|to share;guardar|to save;borrar|to delete;descargar|to download;subir|to upload;actualizar|to update;conectar|to connect;desconectar|to disconnect;proteger|to protect;comprobar|to check;verificar|to verify;engañar|to deceive;criticar|to criticise;rebatir|to refute;traducir|to translate;buscar|to search;encontrar|to find;pinchar|to click;copiar|to copy;pegar|to paste;grabar|to record;bloquear|to block;denunciar|to report;avisar|to warn
`,
    adjs: `
digital|online;fiable|reliable;falso|false;verdadero|true;engañoso|misleading;actual|current;actualizado|updated;público|public;privado|private;seguro|safe;peligroso|dangerous;anónimo|anonymous;rápido|fast;lento|slow;gratuito|free
`,
    advs: `digitalmente|digitally;actualmente|currently;recientemente|recently;públicamente|publicly`,
    phrases: `
hacer clic|to click;darse de alta|to sign up;darse de baja|to unsubscribe;tener cuidado|to be careful;caer en una trampa|to fall into a trap;cambiar de opinión|to change one's mind;estar al tanto|to keep up to date
`,
  },
  {
    id: "group-7",
    title: "Viajes y dinero · Travel, plans and costs",
    focus: "B1 words for planning trips, comparing prices, dealing with transport, reservations and money.",
    tag: "Travel & money",
    nouns: `
viaje|trip|m;destino|destination|m;ruta|route|f;trayecto|journey|m;salida|departure|f;llegada|arrival|f;retraso|delay|m;cancelación|cancellation|f;reserva|booking|f;alojamiento|accommodation|m;equipaje|luggage|m;maleta|suitcase|f;mochila|backpack|f;pasaporte|passport|m;frontera|border|f;aduana|customs|f;guía|guide|f;turista|tourist|m;visita|visit|f;excursión|excursion|f;paisaje|landscape|m;playa|beach|f;montaña|mountain|f;pueblo|village|m;ciudad|city|f;transporte|transport|m;metro|underground, metro|m;andén|platform|m;vagón|carriage|m;asiento|seat|m;conductor|driver|m;pasajero|passenger|m;precio|price|m;oferta|offer|f;descuento|discount|m;moneda|currency, coin|f;cambio|change, exchange|m;tarjeta|card|f;efectivo|cash|m;cajero|cash machine|m;gasto|expense|m;presupuesto|budget|m;propina|tip|f;recuerdo|souvenir|m;seguro|insurance|m;mapa|map|m;riesgo|risk|m;aventura|adventure|f
`,
    verbs: `
viajar|to travel;planear|to plan;reservar|to book;alojarse|to stay;visitar|to visit;recorrer|to travel through;salir|to leave;llegar|to arrive;retrasarse|to be delayed;cancelar|to cancel;perder|to miss, lose;facturar|to check in luggage;embarcar|to board;cruzar|to cross;orientarse|to find one's way;gastar|to spend;ahorrar|to save;pagar|to pay;cambiar|to exchange, change;comparar|to compare;elegir|to choose;aprovechar|to make the most of;costar|to cost;valer|to be worth;arriesgar|to risk;recomendar|to recommend;probar|to try
`,
    adjs: `
barato|cheap;caro|expensive;económico|economical;cómodo|comfortable;incómodo|uncomfortable;lleno|full;vacío|empty;puntual|punctual;local|local;extranjero|foreign;turístico|tourist-related;seguro|safe;arriesgado|risky;perdido|lost;inolvidable|unforgettable
`,
    advs: `aproximadamente|approximately;totalmente|completely;localmente|locally;previamente|beforehand`,
    phrases: `
merecer la pena|to be worth it;salir caro|to turn out expensive;ir con tiempo|to leave enough time;perder el tren|to miss the train;hacer cola|to queue;estar de viaje|to be travelling;quedarse corto|to fall short
`,
  },
  {
    id: "group-8",
    title: "Sociedad y cultura · Community and public life",
    focus: "B1 vocabulary for society, culture, education, rights, rules and community participation.",
    tag: "Society & culture",
    nouns: `
sociedad|society|f;cultura|culture|f;educación|education|f;derecho|right|m;deber|duty|m;norma|rule|f;ley|law|f;gobierno|government|m;ciudadano|citizen|m;población|population|f;minoría|minority|f;mayoría|majority|f;igualdad|equality|f;desigualdad|inequality|f;libertad|freedom|f;justicia|justice|f;injusticia|injustice|f;respeto|respect|m;tolerancia|tolerance|f;diversidad|diversity|f;identidad|identity|f;origen|origin|m;costumbre|custom|f;tradición|tradition|f;fiesta|festival|f;celebración|celebration|f;exposición|exhibition|f;concierto|concert|m;teatro|theatre|m;película|film|f;novela|novel|f;poema|poem|m;pintura|painting|f;obra|work, play|f;autor|author|m;artista|artist|m;público|audience, public|m;entrada|ticket|f;premio|prize|m;campaña|campaign|f;asociación|association|f;voluntario|volunteer|m;proyecto|project|m;iniciativa|initiative|f;recurso|resource|m;ayuda|help|f;participación|participation|f
`,
    verbs: `
participar|to participate;colaborar|to collaborate;respetar|to respect;convivir|to live together;protestar|to protest;votar|to vote;defender|to defend;proteger|to protect;representar|to represent;pertenecer|to belong;incluir|to include;excluir|to exclude;discriminar|to discriminate;apoyar|to support;organizar|to organise;celebrar|to celebrate;traducir|to translate;interpretar|to interpret;actuar|to perform;exponer|to exhibit;publicar|to publish;crear|to create;expresar|to express;compartir|to share;fomentar|to encourage;educar|to educate;influir|to influence;convencer|to convince
`,
    adjs: `
social|social;cultural|cultural;público|public;privado|private;legal|legal;ilegal|illegal;justo|fair;injusto|unfair;diverso|diverse;comunitario|community-related;artístico|artistic;creativo|creative;tradicional|traditional;moderno|modern;solidario|supportive
`,
    advs: `legalmente|legally;culturalmente|culturally;socialmente|socially;justamente|fairly`,
    phrases: `
formar parte de|to be part of;tener derecho a|to have the right to;estar a favor de|to be in favour of;estar en contra de|to be against;tomar parte|to take part;poner en común|to share as a group;dar voz a|to give a voice to
`,
  },
  {
    id: "group-9",
    title: "Medio ambiente y consumo · Everyday choices",
    focus: "B1 words for climate, consumption, food choices, resources and responsible habits.",
    tag: "Environment & choices",
    nouns: `
ambiente|environment|m;naturaleza|nature|f;clima|climate|m;temperatura|temperature|f;calor|heat|m;frío|cold|m;lluvia|rain|f;sequía|drought|f;incendio|fire|m;inundación|flood|f;contaminación|pollution|f;residuo|waste|m;basura|rubbish|f;plástico|plastic|m;envase|packaging|m;bolsa|bag|f;botella|bottle|f;consumo|consumption|m;producto|product|m;marca|brand|f;calidad|quality|f;cantidad|quantity|f;precio|price|m;recurso|resource|m;energía|energy|f;electricidad|electricity|f;gas|fuel|m;agua|water|f;ahorro|saving|m;desperdicio|waste|m;reciclaje|recycling|m;reutilización|reuse|f;transporte|transport|m;bicicleta|bicycle|f;cosecha|harvest|f;cultivo|crop|m;granja|farm|f;bosque|forest|m;árbol|tree|m;hoja|leaf|f;raíz|root|f;animal|animal|m;especie|species|f;protección|protection|f;daño|damage|m;cambio|change|m;coste|cost|m;beneficio|benefit|m
`,
    verbs: `
contaminar|to pollute;reciclar|to recycle;reutilizar|to reuse;ahorrar|to save;gastar|to spend, use up;desperdiciar|to waste;consumir|to consume;elegir|to choose;comprar|to buy;vender|to sell;producir|to produce;cultivar|to grow;plantar|to plant;proteger|to protect;dañar|to damage;reducir|to reduce;aumentar|to increase;apagar|to turn off;encender|to turn on;separar|to separate;tirar|to throw away;recoger|to pick up;transportar|to transport;cuidar|to care for;evitar|to avoid;mejorar|to improve;empeorar|to worsen;aprovechar|to make use of
`,
    adjs: `
natural|natural;ambiental|environmental;responsable|responsible;sostenible|sustainable;renovable|renewable;reciclable|recyclable;contaminante|polluting;dañino|harmful;limpio|clean;sucio|dirty;local|local;ecológico|ecological;necesario|necessary;excesivo|excessive;útil|useful
`,
    advs: `responsablemente|responsibly;excesivamente|excessively;naturalmente|naturally;diariamente|daily`,
    phrases: `
merecer la pena|to be worth it;hacer daño|to harm;tener impacto|to have an impact;poner en riesgo|to put at risk;tomar medidas|to take measures;salir rentable|to be cost-effective;dar ejemplo|to set an example
`,
  },
  {
    id: "group-10",
    title: "Narrar y matizar · Telling stories and nuance",
    focus: "B1 vocabulary for telling events, reacting, adding nuance and writing more connected answers.",
    tag: "Narration & nuance",
    nouns: `
historia|story|f;relato|account, story|m;escena|scene|f;momento|moment|m;etapa|stage|f;principio|beginning|m;final|ending|m;resultado|result|m;éxito|success|m;fracaso|failure|m;suerte|luck|f;casualidad|coincidence|f;sorpresa|surprise|f;dificultad|difficulty|f;obstáculo|obstacle|m;reto|challenge|m;cambio|change|m;decisión|choice|f;intento|attempt|m;opción|option|f;elección|choice|f;ventaja|advantage|f;desventaja|disadvantage|f;beneficio|benefit|m;inconveniente|drawback|m;riesgo|risk|m;efecto|effect|m;influencia|influence|f;contexto|context|m;situación|situation|f;caso|case|m;hecho|fact|m;dato|piece of data|m;señal|sign|f;pista|clue|f;prueba|proof|f;conclusión|final point|f;matiz|nuance|m;contraste|contrast|m;comparación|comparison|f;diferencia|difference|f;semejanza|similarity|f;excepción|exception|f;condición|condition|f;posibilidad|possibility|f;tendencia|trend|f;prioridad|priority|f
`,
    verbs: `
ocurrir|to happen;suceder|to happen;pasar|to happen;empezar|to begin;terminar|to finish;continuar|to continue;cambiar|to change;mejorar|to improve;empeorar|to worsen;intentar|to try;lograr|to manage;conseguir|to achieve;fracasar|to fail;evitar|to avoid;arriesgar|to risk;decidir|to decide;elegir|to choose;preferir|to prefer;depender|to depend;influir|to influence;afectar|to affect;destacar|to highlight;añadir|to add;matizar|to nuance;contrastar|to contrast;comparar|to compare;demostrar|to show, prove;concluir|to conclude
`,
    adjs: `
inesperado|unexpected;previsto|expected;probable|probable;improbable|unlikely;seguro|certain;dudoso|doubtful;distinto|different;parecido|similar;contrario|opposite;principal|main;secundario|secondary;anterior|previous;posterior|later;breve|brief;detallado|detailed
`,
    advs: `finalmente|finally;anteriormente|previously;posteriormente|afterwards;brevemente|briefly`,
    phrases: `
por un lado|on one hand;por otro lado|on the other hand;en cambio|however, by contrast;aunque parezca|although it may seem;al fin y al cabo|after all;salir adelante|to get through;tener que ver con|to have to do with
`,
  },
];

const CUSTOM_VERBS = {
  depender: ["El resultado puede depender de una decisión tomada a tiempo.", "The result may depend on a decision made in time."],
  influir: ["La experiencia familiar suele influir en la forma de estudiar.", "Family experience often influences the way people study."],
  carecer: ["El informe carece de ejemplos concretos y por eso convence menos.", "The report lacks concrete examples, so it is less convincing."],
  consistir: ["La tarea consiste en comparar dos soluciones posibles.", "The task consists of comparing two possible solutions."],
  pertenecer: ["Muchos jóvenes quieren pertenecer a un grupo donde se sientan escuchados.", "Many young people want to belong to a group where they feel heard."],
  quejarse: ["Los vecinos suelen quejarse del ruido después de las once.", "The neighbours often complain about the noise after eleven."],
  mudarse: ["Mi compañera quiere mudarse a un barrio más tranquilo.", "My classmate wants to move to a quieter neighbourhood."],
  alojarse: ["Durante el viaje preferimos alojarnos cerca del centro.", "During the trip we prefer to stay near the centre."],
  orientarse: ["Me cuesta orientarme cuando salgo de una estación nueva.", "I find it hard to find my way when I leave a new station."],
  disculparse: ["Después de la discusión, decidió disculparse con su hermano.", "After the argument, he decided to apologise to his brother."],
  despedirse: ["Antes de subir al tren, se despidió de sus amigos.", "Before getting on the train, she said goodbye to her friends."],
  relajarse: ["Para relajarse, apaga el móvil media hora antes de dormir.", "To relax, he turns off his phone half an hour before sleeping."],
  acostarse: ["Intento acostarme temprano cuando tengo examen al día siguiente.", "I try to go to bed early when I have an exam the next day."],
  levantarse: ["Los fines de semana me levanto más tarde, pero mantengo una rutina.", "On weekends I get up later, but I keep a routine."],
};

const PHRASE_EXAMPLES = {
  "darse cuenta de": ["Me di cuenta de que necesitaba practicar con frases completas.", "I realised that I needed to practise with complete sentences."],
  "tener en cuenta": ["Hay que tener en cuenta el tiempo antes de aceptar otro compromiso.", "You have to take time into account before accepting another commitment."],
  "en mi opinión": ["En mi opinión, la mejor solución es hablar antes de decidir.", "In my opinion, the best solution is to talk before deciding."],
  "por ejemplo": ["Podemos ahorrar energía, por ejemplo, apagando las luces innecesarias.", "We can save energy, for example, by turning off unnecessary lights."],
  "en resumen": ["En resumen, el plan funciona si todos cumplen su parte.", "In short, the plan works if everyone does their part."],
  "estar de acuerdo": ["No siempre estamos de acuerdo, pero escuchamos los motivos del otro.", "We do not always agree, but we listen to each other's reasons."],
  "no cabe duda": ["No cabe duda de que practicar cada día mejora la confianza.", "There is no doubt that practising every day improves confidence."],
  "estar pendiente de": ["Estoy pendiente del correo por si llega la respuesta de la oficina.", "I am keeping an eye on my email in case the office replies."],
  "ponerse en contacto": ["Voy a ponerme en contacto con la empresa para confirmar la cita.", "I am going to get in touch with the company to confirm the appointment."],
  "llevar a cabo": ["El equipo logró llevar a cabo el proyecto dentro del plazo.", "The team managed to carry out the project within the deadline."],
  "hacer una reclamación": ["Si la factura está mal, conviene hacer una reclamación por escrito.", "If the invoice is wrong, it is best to file a written complaint."],
  "estar a cargo de": ["Marta está a cargo de organizar los documentos del curso.", "Marta is in charge of organising the course documents."],
  "cumplir con": ["Para recibir la beca, hay que cumplir con todos los requisitos.", "To receive the scholarship, you must meet all the requirements."],
  "quedar en": ["Quedamos en revisar el contrato antes del viernes.", "We agreed to review the contract before Friday."],
  "estar en obras": ["La calle está en obras y el autobús pasa por otra ruta.", "The street is under construction and the bus takes another route."],
  "hacer ruido": ["La lavadora empezó a hacer ruido durante la noche.", "The washing machine started making noise during the night."],
  "darse una vuelta": ["Después de cenar, nos dimos una vuelta por el barrio.", "After dinner, we took a walk around the neighbourhood."],
  "echar una mano": ["Un vecino me echó una mano con la mudanza.", "A neighbour lent me a hand with the move."],
  "tener lugar": ["La reunión tendrá lugar en el centro cultural.", "The meeting will take place in the cultural centre."],
  "poner una queja": ["Pusimos una queja porque el ascensor llevaba días sin funcionar.", "We made a complaint because the lift had not worked for days."],
  "quedarse sin": ["Nos quedamos sin agua caliente justo antes de salir.", "We ran out of hot water just before leaving."],
  "sentirse mejor": ["Después de descansar, empezó a sentirse mejor.", "After resting, she started to feel better."],
  "tener fiebre": ["Si vuelves a tener fiebre, llama al centro de salud.", "If you have a fever again, call the health centre."],
  "estar de baja": ["Está de baja porque necesita recuperarse de la operación.", "She is on sick leave because she needs to recover from the operation."],
  "pedir cita": ["Mañana voy a pedir cita con el dentista.", "Tomorrow I am going to make an appointment with the dentist."],
  "hacer ejercicio": ["Hacer ejercicio me ayuda a dormir mejor.", "Exercising helps me sleep better."],
  "pasarlo mal": ["Lo pasó mal durante la entrevista, pero no se rindió.", "He had a hard time during the interview, but he did not give up."],
  "venir bien": ["Me vendría bien descansar antes de volver al trabajo.", "It would be good for me to rest before going back to work."],
  "llevarse bien": ["Aunque son muy distintos, se llevan bien en casa.", "Although they are very different, they get along at home."],
  "hacer las paces": ["Después de hablar con calma, hicieron las paces.", "After talking calmly, they made peace."],
  "pedir perdón": ["Pidió perdón por llegar tarde y explicó lo ocurrido.", "He apologised for arriving late and explained what had happened."],
  "guardar un secreto": ["Sé guardar un secreto cuando alguien confía en mí.", "I know how to keep a secret when someone trusts me."],
  "tener confianza": ["Es importante tener confianza para hablar en otro idioma.", "It is important to have confidence to speak in another language."],
  "dar las gracias": ["Siempre doy las gracias cuando alguien me ayuda.", "I always say thank you when someone helps me."],
  "pasar tiempo": ["Intento pasar tiempo con mis amigos aunque esté ocupado.", "I try to spend time with my friends even when I am busy."],
  "hacer clic": ["Haz clic en el enlace solo si reconoces la página.", "Click the link only if you recognise the page."],
  "darse de alta": ["Me di de alta en la plataforma para seguir el curso.", "I signed up on the platform to follow the course."],
  "darse de baja": ["Se dio de baja porque ya no usaba el servicio.", "She unsubscribed because she no longer used the service."],
  "tener cuidado": ["Ten cuidado con los mensajes que piden tu contraseña.", "Be careful with messages that ask for your password."],
  "caer en una trampa": ["Mucha gente cae en una trampa cuando la oferta parece perfecta.", "Many people fall into a trap when the offer seems perfect."],
  "cambiar de opinión": ["Cambié de opinión después de leer una fuente más fiable.", "I changed my mind after reading a more reliable source."],
  "estar al tanto": ["Leo las noticias para estar al tanto de lo que pasa.", "I read the news to keep up to date with what is happening."],
  "merecer la pena": ["Aunque el viaje fue largo, mereció la pena.", "Although the trip was long, it was worth it."],
  "salir caro": ["Comprar a última hora puede salir caro.", "Buying at the last minute can turn out expensive."],
  "ir con tiempo": ["Conviene ir con tiempo porque suele haber cola.", "It is best to leave enough time because there is usually a queue."],
  "perder el tren": ["Casi perdimos el tren por salir tarde del hotel.", "We almost missed the train because we left the hotel late."],
  "hacer cola": ["Tuvimos que hacer cola para entrar al museo.", "We had to queue to enter the museum."],
  "estar de viaje": ["Cuando estoy de viaje, guardo copias de mis documentos.", "When I am travelling, I keep copies of my documents."],
  "quedarse corto": ["El presupuesto se quedó corto por los gastos de transporte.", "The budget fell short because of transport expenses."],
  "formar parte de": ["Quiero formar parte de un proyecto útil para el barrio.", "I want to be part of a useful project for the neighbourhood."],
  "tener derecho a": ["Todo estudiante tiene derecho a recibir información clara.", "Every student has the right to receive clear information."],
  "estar a favor de": ["Estoy a favor de ampliar los espacios públicos.", "I am in favour of expanding public spaces."],
  "estar en contra de": ["Estoy en contra de discriminar a alguien por su origen.", "I am against discriminating against someone because of their origin."],
  "tomar parte": ["Varios vecinos tomaron parte en la campaña local.", "Several neighbours took part in the local campaign."],
  "poner en común": ["Al final de la clase pusimos en común nuestras ideas.", "At the end of the class we shared our ideas as a group."],
  "dar voz a": ["La asociación quiere dar voz a los jóvenes del barrio.", "The association wants to give a voice to young people in the neighbourhood."],
  "hacer daño": ["Tirar plástico al río puede hacer daño a muchos animales.", "Throwing plastic into the river can harm many animals."],
  "tener impacto": ["Las decisiones pequeñas también pueden tener impacto.", "Small decisions can also have an impact."],
  "poner en riesgo": ["El desperdicio de agua pone en riesgo la cosecha.", "Wasting water puts the harvest at risk."],
  "tomar medidas": ["El ayuntamiento debe tomar medidas contra la contaminación.", "The town hall must take measures against pollution."],
  "salir rentable": ["Reutilizar envases puede salir rentable a largo plazo.", "Reusing packaging can be cost-effective in the long run."],
  "dar ejemplo": ["Si reciclamos en casa, damos ejemplo a los niños.", "If we recycle at home, we set an example for children."],
  "por un lado": ["Por un lado, el cambio ahorra dinero; por otro, exige tiempo.", "On one hand, the change saves money; on the other, it requires time."],
  "por otro lado": ["Por otro lado, no todos tienen acceso a la misma información.", "On the other hand, not everyone has access to the same information."],
  "en cambio": ["Yo prefería esperar; ella, en cambio, quería decidir ya.", "I preferred to wait; she, however, wanted to decide immediately."],
  "aunque parezca": ["Aunque parezca sencillo, explicar bien un problema lleva práctica.", "Although it may seem simple, explaining a problem well takes practice."],
  "al fin y al cabo": ["Al fin y al cabo, todos queremos una solución justa.", "After all, we all want a fair solution."],
  "salir adelante": ["Con apoyo y paciencia, logró salir adelante.", "With support and patience, she managed to get through it."],
  "tener que ver con": ["El problema tiene que ver con la falta de información.", "The problem has to do with the lack of information."],
};

function splitList(raw) {
  return raw
    .trim()
    .split(";")
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => chunk.split("|").map((part) => part.trim()));
}

function article(gender) {
  return gender === "f" ? "la" : "el";
}

function aboutArticle(gender) {
  return gender === "f" ? "sobre la" : "sobre el";
}

function cap(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function hash(text) {
  let value = 0;
  for (const char of text) value = (value * 31 + char.charCodeAt(0)) % 997;
  return value;
}

function exampleFor(entry, group) {
  const { lemma, pos, translation_en, gender } = entry;
  if (pos === "phrase" && PHRASE_EXAMPLES[lemma]) return PHRASE_EXAMPLES[lemma];
  if (pos === "verb" && CUSTOM_VERBS[lemma]) return CUSTOM_VERBS[lemma];

  if (pos === "noun") {
    const art = article(gender);
    const Art = cap(art);
    const templates = [
      [`Cuando hablo ${aboutArticle(gender)} ${lemma}, intento añadir un detalle concreto.`, `When I talk about the ${translation_en}, I try to add a concrete detail.`],
      [`Necesito un ejemplo claro para explicar ${art} ${lemma} sin traducir palabra por palabra.`, `I need a clear example to explain the ${translation_en} without translating word for word.`],
      [`${Art} ${lemma} puede aparecer en una conversación cotidiana o en un examen oral.`, `The ${translation_en} can appear in an everyday conversation or in an oral exam.`],
      [`Aprendí una frase útil para usar ${art} ${lemma} con más naturalidad.`, `I learned a useful sentence to use the ${translation_en} more naturally.`],
      [`Si menciono ${art} ${lemma}, conviene explicar por qué es importante.`, `If I mention the ${translation_en}, it is best to explain why it matters.`],
    ];
    return templates[hash(lemma) % templates.length];
  }

  if (pos === "verb") {
    const templates = [
      [`Quiero aprender a ${lemma} sin depender siempre del diccionario.`, `I want to learn to ${translation_en.replace(/^to /, "")} without always depending on the dictionary.`],
      [`En una conversación real, saber ${lemma} ayuda a responder con más seguridad.`, `In a real conversation, knowing how to ${translation_en.replace(/^to /, "")} helps you answer with more confidence.`],
      [`Para el examen oral, necesito practicar cómo ${lemma} una idea sencilla.`, `For the oral exam, I need to practise how to ${translation_en.replace(/^to /, "")} a simple idea.`],
      [`Es útil poder ${lemma} cuando la situación cambia de repente.`, `It is useful to be able to ${translation_en.replace(/^to /, "")} when the situation changes suddenly.`],
    ];
    return templates[hash(lemma) % templates.length];
  }

  if (pos === "adj") {
    const templates = [
      [`Me parece un enfoque ${lemma} para resolver el problema.`, `It seems like a ${translation_en} approach to solve the problem.`],
      [`Buscamos un ejemplo ${lemma} que se pueda usar en la vida diaria.`, `We are looking for a ${translation_en} example that can be used in daily life.`],
      [`Ese comentario fue ${lemma}, pero necesitaba más contexto.`, `That comment was ${translation_en}, but it needed more context.`],
    ];
    return templates[hash(lemma) % templates.length];
  }

  const templates = [
    [`${cap(lemma)} reviso lo que escribo antes de enviarlo.`, `${cap(translation_en)} I review what I write before sending it.`],
    [`Intento responder ${lemma} cuando la situación es complicada.`, `I try to answer ${translation_en} when the situation is complicated.`],
    [`La explicación cambió ${lemma} después de escuchar otra opinión.`, `The explanation changed ${translation_en} after hearing another opinion.`],
  ];
  return templates[hash(lemma) % templates.length];
}

function candidateWords(group) {
  const buckets = [
    ["noun", group.nouns],
    ["verb", group.verbs],
    ["adj", group.adjs],
    ["adv", group.advs],
    ["phrase", group.phrases],
  ];
  const words = [];
  for (const [pos, raw] of buckets) {
    for (const parts of splitList(raw)) {
      const [lemma, translation_en, gender = ""] = parts;
      const entry = {
        lemma,
        pos,
        translation_en,
        tag: group.tag,
      };
      if (pos === "noun" && gender) entry.gender = gender;
      const [example, example_en] = exampleFor(entry, group);
      words.push({ ...entry, example, example_en });
    }
  }
  return words;
}

function reserveWords() {
  return splitList(RESERVE_RAW).map(([lemma, pos, translation_en, gender = "", tag = "B1 reserve"]) => {
    const entry = { lemma, pos, translation_en, tag };
    if (pos === "noun" && gender) entry.gender = gender;
    const [example, example_en] = exampleFor(entry, { tag });
    return { ...entry, example, example_en };
  });
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function validateTargetGroups(groups) {
  const seen = new Set();
  const issues = [];
  for (const group of groups) {
    if (group.words.length !== 100) issues.push(`${group.id}: expected 100, got ${group.words.length}`);
    const phraseCount = group.words.filter((word) => word.pos === "phrase").length;
    if (phraseCount >= group.words.length * 0.15) issues.push(`${group.id}: phrase count ${phraseCount} is not below 15%`);
    for (const word of group.words) {
      if (seen.has(word.lemma)) issues.push(`duplicate inside B1: ${word.lemma}`);
      seen.add(word.lemma);
      if (SINGLE_WORD_POS.has(word.pos) && /\s/.test(word.lemma)) issues.push(`${group.id}: multi-word ${word.pos}: ${word.lemma}`);
      for (const key of ["lemma", "pos", "translation_en", "example", "example_en", "tag"]) {
        if (!word[key]) issues.push(`${group.id}/${word.lemma}: missing ${key}`);
      }
      if (word.translation_en.toLowerCase() === word.lemma.toLowerCase()) {
        issues.push(`${group.id}/${word.lemma}: translation copies lemma`);
      }
    }
  }
  return issues;
}

function collectOtherLevelLemmas() {
  const levels = readJson(path.join(DATA_DIR, "levels.json")).levels || [];
  const seen = new Map();
  for (const level of levels) {
    if (level.id === TARGET_LEVEL) continue;
    const index = readJson(path.join(LEVELS_DIR, level.id, "index.json"));
    for (const group of index.groups || []) {
      const data = readJson(path.join(LEVELS_DIR, level.id, `${group.id}.json`));
      for (const word of data.words || []) {
        seen.set(word.lemma, `${level.id}/${group.id}`);
      }
    }
  }
  return seen;
}

function writeGroups(groups) {
  const levelDir = path.join(LEVELS_DIR, TARGET_LEVEL);
  for (const group of groups) {
    fs.writeFileSync(
      path.join(levelDir, `${group.id}.json`),
      `${JSON.stringify({
        id: group.id,
        title: group.title,
        focus: group.focus,
        words: group.words,
      }, null, 2)}\n`,
    );
  }
  const index = readJson(path.join(levelDir, "index.json"));
  index.title = "B1 · Intermedio";
  index.subtitle = "Work, study, public life, travel, wellbeing and connected opinions.";
  index.focus = "Ten refined B1 groups with single-word vocabulary, useful phrases, real examples and English translations.";
  index.groups = groups.map((group) => ({
    id: group.id,
    title: group.title,
    focus: group.focus,
    count: group.words.length,
  }));
  fs.writeFileSync(path.join(levelDir, "index.json"), `${JSON.stringify(index, null, 2)}\n`);
}

function rebuildMaster() {
  const levels = readJson(path.join(DATA_DIR, "levels.json")).levels || [];
  const rows = ["level,group,lemma"];
  const seen = new Set();
  const issues = [];
  for (const level of levels) {
    const index = readJson(path.join(LEVELS_DIR, level.id, "index.json"));
    for (const group of index.groups || []) {
      const data = readJson(path.join(LEVELS_DIR, level.id, `${group.id}.json`));
      for (const word of data.words || []) {
        if (seen.has(word.lemma)) issues.push(`duplicate after write: ${word.lemma}`);
        seen.add(word.lemma);
        rows.push(`${level.id},${group.id},${word.lemma}`);
      }
    }
  }
  if (issues.length) throw new Error(issues.slice(0, 20).join("\n"));
  fs.writeFileSync(path.join(DATA_DIR, "vocab-master.csv"), `${rows.join("\n")}\n`);
  return seen.size;
}

function buildGroups() {
  const otherLevelLemmas = collectOtherLevelLemmas();
  const used = new Set();
  const reservesByPos = reserveWords().reduce((acc, word) => {
    (acc[word.pos] ||= []).push(word);
    return acc;
  }, {});
  const skipped = [];
  const groups = [];

  for (const group of GROUPS) {
    const picked = [];
    const posCounts = {};
    const canUse = (word) => {
      const source = otherLevelLemmas.get(word.lemma);
      if (source || used.has(word.lemma)) {
        skipped.push(`${group.id}: skipped ${word.lemma}${source ? ` from ${source}` : " duplicate in B1"}`);
        return false;
      }
      const limit = TARGET_POS_COUNTS[word.pos] || 0;
      if (limit && (posCounts[word.pos] || 0) >= limit) return false;
      return true;
    };
    const addWord = (word) => {
      used.add(word.lemma);
      posCounts[word.pos] = (posCounts[word.pos] || 0) + 1;
      picked.push(word);
    };

    for (const word of candidateWords(group)) {
      if (!canUse(word)) continue;
      addWord(word);
      if (picked.length === 100) break;
    }

    for (const pos of ["noun", "verb", "adj", "adv"]) {
      while ((posCounts[pos] || 0) < TARGET_POS_COUNTS[pos] && reservesByPos[pos]?.length) {
        const reserve = reservesByPos[pos].shift();
        const word = { ...reserve, tag: group.tag };
        const [example, example_en] = exampleFor(word, group);
        word.example = example;
        word.example_en = example_en;
        const source = otherLevelLemmas.get(word.lemma);
        if (source || used.has(word.lemma)) continue;
        addWord(word);
      }
    }

    const reserveOrder = ["noun", "verb", "adj", "adv"];
    let guard = 0;
    while (picked.length < 100 && guard < 2000) {
      guard += 1;
      const pos = reserveOrder[guard % reserveOrder.length];
      const reserve = reservesByPos[pos]?.shift();
      if (!reserve) continue;
      const word = { ...reserve, tag: group.tag };
      const [example, example_en] = exampleFor(word, group);
      if (otherLevelLemmas.has(word.lemma) || used.has(word.lemma)) continue;
      used.add(word.lemma);
      posCounts[word.pos] = (posCounts[word.pos] || 0) + 1;
      picked.push({ ...word, example, example_en });
    }
    groups.push({ ...group, words: picked });
  }
  return { groups, skipped };
}

function main() {
  const { groups, skipped } = buildGroups();
  const issues = validateTargetGroups(groups);
  if (issues.length) {
    console.error(issues.slice(0, 80).join("\n"));
    if (skipped.length) {
      console.error("\nSkipped candidates:");
      console.error(skipped.slice(0, 80).join("\n"));
    }
    console.error(`\nIssues: ${issues.length}`);
    process.exit(1);
  }
  writeGroups(groups);
  const total = rebuildMaster();
  console.log(JSON.stringify({
    level: TARGET_LEVEL,
    groups: groups.length,
    words: groups.reduce((sum, group) => sum + group.words.length, 0),
    masterTotal: total,
  }, null, 2));
}

main();
