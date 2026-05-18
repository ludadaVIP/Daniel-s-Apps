#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.resolve(__dirname, "../data/EspVocab");
const LEVELS_DIR = path.join(DATA_DIR, "levels");
const TARGET_LEVEL = "b2";
const TARGET_POS_COUNTS = { noun: 45, verb: 28, adj: 15, adv: 5, phrase: 7 };
const SINGLE_WORD_POS = new Set(["noun", "verb", "adj", "adv"]);

const GROUPS = [
  {
    id: "group-1",
    title: "Argumentación y matices · Nuanced debate",
    focus: "B2 words for building an argument, qualifying claims, weighing evidence and sounding precise.",
    tag: "Argumentation",
    nouns: `
matiz|nuance|m;premisa|premise|f;objeción|objection|f;tesis|thesis, main claim|f;contraargumento|counterargument|m;razonamiento|reasoning|m;sesgo|bias|m;encuadre|framing|m;criterio|criterion|m;implicación|implication|f;repercusión|repercussion|f;ambigüedad|ambiguity|f;supuesto|assumption|m;sondeo|poll|m;pauta|pattern|f;indicio|sign, clue|m;precedente|precedent|m;paradoja|paradox|f;dilema|dilemma|m;coherencia|coherence|f;contradicción|contradiction|f;argumentario|set of arguments|m;razonabilidad|reasonableness|f;veracidad|truthfulness|f;falsedad|falsehood|f;enfoque|approach|m;alcance|scope|m;trasfondo|background|m;planteamiento|approach|m;concesión|concession|f;réplica|reply, rebuttal|f;refutación|refutation|f;valoración|assessment|f;excepción|exception|f;aclaración|clarification|f;omisión|omission|f;contraste|contrast|m;gradación|gradation|f;pertinencia|relevance|f;solidez|strength, solidity|f;credibilidad|credibility|f;fiabilidad|reliability|f;laguna|gap|f;salvedad|reservation, caveat|f;discrepancia|disagreement|f;consenso|consensus|m;controversia|controversy|f;conjetura|conjecture|f;veredicto|verdict|m;deducción|deduction|f;inferencia|inference|f;premura|urgency|f;divagación|digression|f;trascendencia|importance|f
`,
    verbs: `
matizar|to qualify, nuance;rebatir|to refute;cuestionar|to question;deducir|to deduce;inferir|to infer;contradecir|to contradict;replicar|to reply, rebut;objetar|to object;alegar|to allege;argumentar|to argue;fundamentar|to substantiate;constatar|to verify;corroborar|to corroborate;desmentir|to deny, debunk;subrayar|to underline;recalcar|to stress;puntualizar|to clarify a detail;sopesar|to weigh up;ponderar|to weigh, consider;desestimar|to dismiss;respaldar|to back up;omitir|to omit;tergiversar|to distort;generalizar|to generalise;concretar|to specify;relativizar|to put into perspective;conceder|to concede;admitir|to admit;reforzar|to strengthen;desarrollar|to develop;resumir|to summarise;concluir|to conclude;plantear|to raise;enfocar|to frame;aclarar|to clarify;formular|to formulate;sustentar|to support with evidence;precisar|to specify precisely;discrepar|to disagree;invalidar|to invalidate;reformular|to rephrase;esbozar|to outline;ahondar|to go deeper into;incidir|to have an impact on;reafirmar|to reaffirm;desglosar|to break down;confrontar|to confront;resaltar|to highlight
`,
    adjs: `
ambiguo|ambiguous;coherente|coherent;contradictorio|contradictory;fundado|well founded;infundado|unfounded;verosímil|plausible;sesgado|biased;matizado|nuanced;contundente|forceful;pertinente|relevant;irrelevante|irrelevant;discutible|debatable;convincente|convincing;falaz|fallacious;rotundo|categorical;parcial|partial;riguroso|rigorous;cuestionable|questionable;sólido|solid;endeble|weak
`,
    advs: `supuestamente|supposedly;presuntamente|allegedly;parcialmente|partly;matizadamente|with nuance;rotundamente|categorically;razonadamente|with reasoning`,
    phrases: `
poner en duda|to call into question;no cabe duda de que|there is no doubt that;desde mi punto de vista|from my point of view;en cierta medida|to some extent;al fin y al cabo|after all;por consiguiente|therefore;dicho de otro modo|in other words;conviene señalar que|it is worth pointing out that;por regla general|as a general rule;a grandes rasgos|broadly speaking
`,
  },
  {
    id: "group-2",
    title: "Sociedad y derechos · Public life and civic issues",
    focus: "B2 vocabulary for rights, institutions, inequality, social debate and civic participation.",
    tag: "Society",
    nouns: `
brecha|gap|f;cohesión|social unity|f;equidad|fairness, equity|f;vulnerabilidad|vulnerability|f;marginación|marginalisation|f;precariedad|precariousness|f;ciudadanía|citizenship|f;colectivo|group, collective|m;minoría|minority|f;mayoría|majority|f;convivencia|coexistence|f;tolerancia|tolerance|f;discriminación|discrimination|f;exclusión|being left out|f;inclusión|being included|f;integración|integration|f;segregación|segregation|f;estereotipo|stereotype|m;prejuicio|prejudice|m;acoso|harassment|m;denuncia|complaint, report|f;sanción|penalty|f;delito|crime|m;impunidad|impunity|f;amparo|protection|m;sentencia|court ruling|f;recurso|appeal, resource|m;ordenanza|local regulation|f;normativa|regulations|f;concejal|councillor|m;alcaldía|mayor's office|f;parlamento|parliament|m;comicio|election|m;votación|vote|f;abstención|abstention|f;escrutinio|vote count|m;portavoz|spokesperson|m;manifestación|demonstration|f;asamblea|assembly|f;plataforma|platform, campaign group|f;reivindicación|demand, claim|f;subvención|grant, subsidy|f;recorte|cutback|m;prestación|benefit, service|f;asistencia|assistance|f;cobertura|coverage|f;umbral|threshold|m;carencia|lack|f;dignidad|dignity|f;desamparo|helplessness|m;arraigo|roots, attachment|m;empoderamiento|empowerment|m;desigualdad|inequality|f;participación|participation|f;voluntariado|volunteering|m;padrón|municipal register|m;vecindad|neighbourly community|f;mediación|mediation|f;garantía|guarantee|f;reparación|reparation|f
`,
    verbs: `
reivindicar|to demand, claim;amparar|to protect;vulnerar|to violate;garantizar|to guarantee;promulgar|to enact;derogar|to repeal;sancionar|to penalise;denunciar|to report;discriminar|to discriminate;excluir|to exclude;incluir|to include;integrar|to integrate;marginar|to marginalise;mediar|to mediate;convivir|to live together;fomentar|to foster;sensibilizar|to raise awareness;movilizar|to mobilise;votar|to vote;abstenerse|to abstain;representar|to represent;legislar|to legislate;gobernar|to govern;negociar|to negotiate;financiar|to fund;subvencionar|to subsidise;recortar|to cut back;redistribuir|to redistribute;proteger|to protect;equiparar|to make equal;visibilizar|to make visible;reparar|to make amends;compensar|to compensate;regular|to regulate;supervisar|to supervise;incumplir|to fail to comply
`,
    adjs: `
cívico|civic;igualitario|egalitarian;vulnerable|at risk;precario|precarious;inclusivo|inclusive;excluyente|exclusive;discriminatorio|discriminatory;institucional|institutional;legislativo|legislative;judicial|court-related;municipal|town-level;autonómico|regional;estatal|state-level;solidario|supportive;reivindicativo|demanding rights;colectivo|collective;minoritario|minority;mayoritario|majority;desfavorecido|disadvantaged;representativo|representative;participativo|participatory;equitativo|equitable;asistencial|welfare-related;vecinal|neighbourhood-related
`,
    advs: `legalmente|legally;socialmente|socially;institucionalmente|institutionally;colectivamente|collectively;democráticamente|democratically;solidariamente|in solidarity`,
    phrases: `
tomar medidas|to take measures;hacer valer|to assert, enforce;estar en juego|to be at stake;poner de manifiesto|to reveal;dar voz a|to give a voice to;hacer frente a|to face;pasar por alto|to overlook;velar por|to look after, safeguard;estar al margen|to be on the margins;tener derecho a|to have the right to;poner límites a|to set limits on
`,
  },
  {
    id: "group-3",
    title: "Clima y sostenibilidad · Environment under pressure",
    focus: "B2 vocabulary for climate, resources, consumption, biodiversity and environmental policy.",
    tag: "Environment",
    nouns: `
biodiversidad|biodiversity|f;ecosistema|ecosystem|m;hábitat|natural home|m;deforestación|deforestation|f;desertificación|desertification|f;sequía|drought|f;inundación|flood|f;emisión|emission|f;vertido|spill, dumping|m;residuo|waste|m;escasez|shortage|f;huella|footprint, trace|f;sobreexplotación|overexploitation|f;renovable|renewable source|m;reciclaje|recycling|m;reutilización|reuse|f;aislamiento|insulation|m;eficiencia|efficiency|f;derroche|wastefulness|m;consumo|consumption|m;suministro|supply|m;incendio|wildfire|m;oleaje|swell|m;erosión|soil wear|f;caudal|flow|m;acuífero|aquifer|m;depuradora|water treatment plant|f;vertedero|landfill|m;microplástico|microplastic|m;plaga|pest|f;cosecha|harvest|f;cultivo|crop|m;ganadería|livestock farming|f;agricultura|agriculture|f;fertilizante|fertiliser|m;pesticida|pesticide|m;sequedal|dry area|m;reforestación|reforestation|f;conservación|conservation|f;extinción|extinction|f;especie|species|f;amenaza|threat|f;resiliencia|resilience|f;mitigación|mitigation|f;adaptación|adaptation|f;transición|transition|f;incentivo|incentive|m;normativa|regulation|f;etiquetado|labelling|m;descarbonización|decarbonisation|f;calentamiento|warming|m;sumidero|carbon sink|m;sequedad|dryness|f;oleoducto|oil pipeline|m;biomasa|biomass|f;compostaje|composting|m;deshielo|thaw, melting|m;salinidad|salinity|f;aridez|aridity|f;regadío|irrigated farming|m;monocultivo|monoculture|m;polinizador|pollinator|m;humedal|wetland|m;marisma|marsh|f;invernadero|greenhouse|m;repoblación|restocking, replanting|f;alerta|alert|f;vulnerabilidad|vulnerability|f;reserva|reserve|f;restricción|restriction|f
`,
    verbs: `
contaminar|to pollute;degradar|to degrade;emitir|to emit;verter|to dump, spill;reciclar|to recycle;reutilizar|to reuse;reducir|to reduce;ahorrar|to save;derrochar|to waste;compensar|to offset;mitigar|to mitigate;adaptarse|to adapt;preservar|to preserve;conservar|to conserve;restaurar|to restore;reforestar|to reforest;extinguirse|to become extinct;amenazar|to threaten;regular|to regulate;incentivar|to incentivise;penalizar|to penalise;prohibir|to ban;promover|to promote;concienciar|to raise awareness;monitorizar|to monitor;medir|to measure;capturar|to capture;almacenar|to store;depurar|to purify;filtrar|to filter;abastecer|to supply;cultivar|to cultivate;fumigar|to spray;erosionar|to erode;renovar|to renew;descarbonizar|to decarbonise;reconvertir|to convert, repurpose;encauzar|to channel;aprovechar|to make use of;malgastar|to waste;replantar|to replant;reintroducir|to reintroduce;proliferar|to proliferate;secarse|to dry up;encarecer|to make more expensive;encogerse|to shrink
`,
    adjs: `
sostenible|sustainable;renovable|renewable;reciclable|recyclable;biodegradable|able to break down naturally;tóxico|toxic;nocivo|harmful;contaminante|polluting;escaso|scarce;hídrico|water-related;forestal|forest-related;marino|marine;agrícola|agricultural;ganadero|livestock-related;climático|climate-related;energético|energy-related;ambiental|environmental;irreversible|not reversible;resiliente|resilient;ecológico|ecological
`,
    advs: `ambientalmente|environmentally;sosteniblemente|sustainably;gradualmente|gradually;irreversiblemente|irreversibly;localmente|locally;globalmente|globally`,
    phrases: `
poner en peligro|to endanger;estar en riesgo|to be at risk;hacer un uso responsable|to use responsibly;apostar por|to commit to;tomar conciencia|to become aware;dejar huella|to leave a footprint;pasar factura|to take its toll;poner freno a|to put a stop to;estar a tiempo de|to still have time to
`,
  },
  {
    id: "group-4",
    title: "Tecnología y medios · Digital society",
    focus: "B2 vocabulary for digital rights, media literacy, platforms, privacy and technological change.",
    tag: "Technology",
    nouns: `
algoritmo|algorithm|m;sesgo|bias|m;plataforma|platform|f;interfaz|interface|f;dispositivo|device|m;servidor|server|m;cifrado|encryption|m;contraseña|password|f;brecha|breach, gap|f;filtración|leak|f;suplantación|impersonation|f;vigilancia|surveillance|f;rastreo|tracking|m;consentimiento|consent|m;anonimato|anonymity|m;huella|trace, footprint|f;viralidad|virality|f;desinformación|misinformation|f;bulo|hoax|m;rumor|rumour|m;verificación|verification|f;fuente|source|f;titular|headline|m;cobertura|coverage|f;audiencia|audience|f;suscriptor|subscriber|m;redactor|writer, editor|m;portada|front page|f;enfoque|angle, approach|m;sesión|session|f;registro|record, sign-up|m;autenticación|authentication|f;actualización|update|f;almacenamiento|storage|m;respaldo|backup|m;accesibilidad|accessibility|f;usabilidad|usability|f;automatización|automation|f;innovación|innovation|f;obsolescencia|obsolescence|f;dependencia|dependence|f;adicción|addiction|f;notificación|notification|f;moderación|moderation|f;censura|censorship|f;transparencia|transparency|f;privacidad|privacy|f;seguridad|security|f;neutralidad|neutrality|f;piratería|piracy|f;licencia|licence|f;credencial|credential|f;captcha|human check|m;metadato|metadata item|m;repositorio|repository|m;parche|software patch|m;incidencia|incident, support issue|f;apagón|outage|m;latencia|latency|f;ancho|bandwidth|m;enlace|link|m;dominio|domain|m;alojamiento|hosting|m;portabilidad|portability|f;interoperabilidad|interoperability|f;trazabilidad|traceability|f;sesionalidad|session behaviour|f;redifusión|rebroadcast|f;curaduría|content curation|f;patrocinio|sponsorship|m;monetización|monetisation|f
`,
    verbs: `
cifrar|to encrypt;descifrar|to decrypt;almacenar|to store;rastrear|to track;suplantar|to impersonate;verificar|to verify;contrastar|to cross-check;desmentir|to debunk;viralizar|to make viral;difundir|to spread;moderarse|to be moderated;filtrar|to leak, filter;bloquear|to block;restringir|to restrict;habilitar|to enable;deshabilitar|to disable;automatizar|to automate;innovar|to innovate;actualizar|to update;sincronizar|to sync;programar|to schedule;configurar|to configure;autenticar|to authenticate;registrarse|to register;acceder|to access;descargar|to download;subir|to upload;compartir|to share;monetizar|to monetise;posicionar|to position;indexar|to index;redactar|to edit, write;publicar|to publish;editar|to edit;retransmitir|to broadcast;analizar|to analyse;encriptar|to encrypt;desencriptar|to decrypt;respaldar|to back up;archivar|to archive;etiquetar|to tag;notificar|to notify;silenciar|to mute;denunciar|to report;desinstalar|to uninstall;restablecer|to reset;vulnerar|to breach;segmentar|to segment;personalizar|to personalise;optimizar|to optimise;depurar|to debug;redireccionar|to redirect;escalar|to escalate;licenciar|to license;patrocinar|to sponsor;curar|to curate;banear|to ban online;desbloquear|to unblock;maquetar|to lay out;pixelar|to pixelate;tuitear|to tweet;postear|to post;copiar|to copy;pegar|to paste;reenviar|to forward;adjuntar|to attach;escanear|to scan;suscribirse|to subscribe;cancelar|to cancel;hospedar|to host;renderizar|to render;compilar|to compile;desplegar|to deploy
`,
    adjs: `
digital|online, digital;virtual|online, simulated;algorítmico|algorithmic;cifrado|encrypted;anónimo|anonymous;viral|widely shared;engañoso|misleading;verificable|verifiable;fiable|reliable;sesgado|biased;interactivo|interactive;automatizado|automated;obsoleto|obsolete;innovador|innovative;accesible|accessible;intuitivo|intuitive;masivo|massive;remoto|remote;inalámbrico|wireless;transparente|transparent;fraudulento|fraudulent;malicioso|malicious;compatible|able to work together;portable|easy to move between systems;escalable|scalable;invasivo|intrusive;adictivo|addictive;multimedia|using several media formats;colaborativo|collaborative;descentralizado|decentralised;predictivo|predictive;personalizado|personalised
`,
    advs: `digitalmente|digitally;virtualmente|virtually;masivamente|massively;automáticamente|automatically;anónimamente|anonymously;remotamente|remotely;manualmente|manually;simultáneamente|simultaneously;gratuitamente|for free;temporalmente|temporarily;internamente|internally;externamente|externally`,
    phrases: `
caer en una trampa|to fall into a trap;darse de alta|to sign up;darse de baja|to unsubscribe;estar al tanto|to keep up to date;hacer clic|to click;poner en circulación|to put into circulation;contrastar fuentes|to cross-check sources;dejar rastro|to leave a trace;tener acceso a|to have access to;estar conectado a|to be connected to;poner en marcha|to launch;pasar a segundo plano|to move into the background;estar expuesto a|to be exposed to;hacer una copia de seguridad|to make a backup
`,
  },
  {
    id: "group-5",
    title: "Educación y cultura · Learning and public culture",
    focus: "B2 vocabulary for education, culture, language, access, creativity and academic life.",
    tag: "Education",
    nouns: `
alfabetización|literacy|f;aprendizaje|learning|m;enseñanza|teaching|f;currículo|curriculum|m;temario|syllabus|m;competencia|skill, competence|f;destreza|skill|f;rendimiento|performance|m;abandono|dropout|m;absentismo|absenteeism|m;becario|grant holder|m;tutoría|tutorial|f;mentor|academic guide|m;orientación|guidance|f;acreditación|accreditation|f;homologación|recognition of qualifications|f;baremo|scoring scale|m;plagio|plagiarism|m;autoría|authorship|f;patrimonio|heritage|m;legado|legacy|m;hallazgo|finding|m;yacimiento|archaeological site|m;muestra|exhibition, sample|f;comisario|curator|m;escenario|stage, setting|m;ensayo|essay, rehearsal|m;guion|script|m;estreno|premiere|m;subtítulo|subtitle|m;doblaje|dubbing|m;reseña|review|f;crítica|review, criticism|f;editorial|publishing house|f;tirada|print run|f;lector|reader|m;traducción|translation|f;interpretación|interpretation|f;matrícula|enrolment|f;docencia|teaching|f;campus|university grounds|m;facultad|faculty|f;seminario|seminar|m;ponencia|conference paper|f;congreso|conference|m;divulgación|popularisation|f;creatividad|creativity|f;innovación|innovation|f;financiación|funding|f;archivo|archive|m;catálogo|catalogue|m;colección|collection|f;itinerario|study path|m;convocatoria|official call, exam sitting|f;optativa|elective subject|f;asignatura|school subject|f;convalidación|credit transfer|f;rúbrica|assessment rubric|f;calificación|grade|f;suspenso|fail grade|m;aprobado|pass grade|m;mención|honourable mention|f;tesis|thesis|f;tesina|short thesis|f;monografía|research paper|f;bibliografía|bibliography|f;hemeroteca|newspaper archive|f;auditorio|auditorium|m;butaca|theatre seat|f;taquilla|box office|f;aforo|capacity|m;cartelera|listings, programme|f
`,
    verbs: `
alfabetizar|to teach literacy;capacitar|to train;formar|to train, educate;orientar|to guide;tutorizar|to tutor;matricularse|to enrol;homologar|to recognise qualifications;acreditar|to accredit;evaluar|to assess;calificar|to grade;plagiar|to plagiarise;citar|to cite;referenciar|to reference;investigar|to research;divulgar|to popularise;interpretar|to interpret;traducir|to translate;doblar|to dub;subtitular|to subtitle;estrenar|to premiere;ensayar|to rehearse;representar|to perform;exponer|to exhibit;catalogar|to catalogue;conservar|to preserve;restaurar|to restore;financiar|to fund;becar|to grant a scholarship;publicar|to publish;editar|to edit, publish;reseñar|to review;criticar|to review, criticise;leer|to read;debatir|to debate;argumentar|to argue;redactar|to write;revisar|to revise;convalidar|to transfer credits;aprobar|to pass;suspender|to fail;examinarse|to sit an exam;memorizar|to memorise;asimilar|to absorb, understand;profundizar|to go deeper;documentarse|to gather information;ensamblar|to assemble;escenificar|to stage;versionar|to adapt, make a version;prologar|to write a foreword;ilustrar|to illustrate;maquetar|to lay out;encuadernar|to bind;archivar|to archive;digitalizar|to digitise;patrocinar|to sponsor;programar|to schedule;moderarse|to be moderated;comparecer|to appear publicly;recitar|to recite;improvisar|to improvise;desglosar|to break down;reescribir|to rewrite;consultar|to consult;seleccionar|to select;solicitar|to apply for;renovar|to renew
`,
    adjs: `
académico|academic;pedagógico|pedagogical;curricular|course-related;bilingüe|bilingual;plurilingüe|multilingual;autodidacta|self-taught;presencial|in-person;remoto|remote;híbrido|hybrid;obligatorio|required;optativo|optional;creativo|creative;artístico|artistic;literario|literary;escénico|stage-related;patrimonial|heritage-related;divulgativo|educational for the public;financiado|funded;acreditado|accredited;inédito|unpublished;interdisciplinar|interdisciplinary;extracurricular|outside the curriculum;selectivo|selective;vocacional|vocational
`,
    advs: `académicamente|academically;creativamente|creatively;presencialmente|in person;remotamente|remotely;críticamente|critically;pedagógicamente|pedagogically;oralmente|orally;por escrito|in writing;individualmente|individually;colectivamente|collectively`,
    phrases: `
poner en práctica|to put into practice;dar por sentado|to take for granted;estar a la altura|to be up to the standard;sacar partido|to make the most of;abrir puertas|to open doors;quedarse atrás|to fall behind;tener acceso a|to have access to;hacer hincapié en|to emphasise;servir de puente|to serve as a bridge
`,
  },
  {
    id: "group-6",
    title: "Economía y trabajo · Money, labour and inequality",
    focus: "B2 vocabulary for employment, income, housing, markets, inflation and economic choices.",
    tag: "Economy",
    nouns: `
inflación|inflation|f;deuda|debt|f;ahorro|saving|m;inversión|investment|f;presupuesto|budget|m;subida|increase|f;encarecimiento|price increase|m;rebaja|discount, reduction|f;financiación|funding|f;préstamo|loan|m;hipoteca|mortgage|f;alquiler|rent|m;fianza|deposit|f;desahucio|eviction|m;morosidad|late payment|f;insolvencia|insolvency|f;salario|salary|m;sueldo|wage|m;nómina|payslip|f;cotización|social security contribution|f;pensión|retirement payment|f;subsidio|subsidy|m;paro|unemployment|m;precariedad|precariousness|f;plantilla|staff|f;despido|dismissal|m;contratación|hiring|f;vacante|vacancy|f;teletrabajo|remote work|m;conciliación|work-life balance|f;productividad|productivity|f;rentabilidad|profitability|f;pérdida|loss|f;ganancia|profit, gain|f;beneficio|profit, benefit|m;facturación|turnover|f;proveedor|supplier|m;cliente|client|m;consumidor|consumer|m;demanda|demand|f;oferta|supply, offer|f;mercancía|goods|f;arancel|tariff|m;aduana|customs|f;impuesto|tax|m;fraude|fraud|m;desigualdad|inequality|f;riqueza|wealth|f;pobreza|poverty|f;umbral|threshold|m;coste|cost|m;liquidez|liquidity|f;solvencia|solvency|f;interés|interest rate|m;plazo|term, deadline|m;cuota|instalment|f;recargo|surcharge|m;bonificación|bonus, rebate|f;deducción|tax deduction|f;retención|withholding|f;cotizante|contributor|m;autónomo|self-employed worker|m;emprendedor|entrepreneur|m;pyme|small business|f;franquicia|franchise|f;margen|profit margin|m;balance|financial statement|m;auditoría|audit|f;comisión|fee, commission|f;compraventa|purchase and sale|f;licitación|public tender|f
`,
    verbs: `
encarecer|to make more expensive;abaratar|to make cheaper;invertir|to invest;endeudarse|to get into debt;financiar|to fund;presupuestar|to budget;ahorrar|to save;malgastar|to waste money;cotizar|to contribute to social security;tributar|to pay taxes;facturar|to invoice;contratar|to hire;despedir|to dismiss;renunciar|to resign;ascender|to promote;negociar|to negotiate;subcontratar|to subcontract;externalizar|to outsource;reclutar|to recruit;conciliar|to reconcile work and life;rendir|to perform;producir|to produce;distribuir|to distribute;exportar|to export;importar|to import;abastecer|to supply;consumir|to consume;demandar|to demand;ofertar|to offer;competir|to compete;quebrar|to go bankrupt;reembolsar|to reimburse;desahuciar|to evict;alquilar|to rent;avalar|to guarantee financially;fraudar|to defraud;liquidar|to settle, liquidate;deducir|to deduct;retener|to withhold;amortizar|to repay gradually;renegociar|to renegotiate;recaudar|to collect taxes;licitar|to put out to tender;adjudicar|to award a contract;emprender|to start a business;fusionar|to merge;absorber|to take over;auditar|to audit;ajustar|to adjust;abarrotar|to overcrowd
`,
    adjs: `
laboral|work-related;salarial|salary-related;fiscal|tax-related;financiero|financial;rentable|profitable;insolvente|insolvent;precario|precarious;estable|stable;temporal|temporary;indefinido|permanent;autónomo|self-employed;subcontratado|subcontracted;asequible|affordable;caro|expensive;barato|cheap;competitivo|competitive;deficitario|loss-making;productivo|productive;fraudulento|fraudulent;redistributivo|redistributive;inflacionario|inflationary;hipotecario|mortgage-related;deducible|tax-deductible;moroso|in arrears;solvente|financially sound;emprendedor|entrepreneurial;desigual|unequal;sumergido|undeclared
`,
    advs: `económicamente|economically;financieramente|financially;laboralmente|professionally;fiscalmente|for tax purposes;temporalmente|temporarily;rentablemente|profitably;mensualmente|monthly;anualmente|yearly;bruscamente|sharply;progresivamente|progressively`,
    phrases: `
llegar a fin de mes|to make ends meet;estar en paro|to be unemployed;salir rentable|to be profitable;hacer cuentas|to do the sums;estar endeudado|to be in debt;subir los precios|prices to rise;costar un dineral|to cost a fortune;apretarse el cinturón|to tighten one's belt;vivir al día|to live day to day
`,
  },
  {
    id: "group-7",
    title: "Salud y comunidad · Care, prevention and wellbeing",
    focus: "B2 vocabulary for public health, mental health, care, prevention and community support.",
    tag: "Health",
    nouns: `
prevención|prevention|f;diagnóstico|diagnosis|m;tratamiento|treatment|m;seguimiento|follow-up|m;recaída|relapse|f;síntoma|symptom|m;dolencia|ailment|f;trastorno|disorder|m;ansiedad|anxiety|f;depresión|depression|f;estrés|stress|m;agotamiento|exhaustion|m;insomnio|insomnia|m;soledad|loneliness|f;duelo|grief|m;cuidador|carer|m;dependencia|dependency|f;discapacidad|disability|f;accesibilidad|accessibility|f;residencia|care home, residence|f;urgencia|emergency|f;quirófano|operating theatre|m;cirugía|surgery|f;receta|prescription|f;vacunación|vaccination|f;brote|outbreak|m;contagio|infection, spread|m;inmunidad|immunity|f;riesgo|risk|m;hábito|habit|m;sedentarismo|sedentary lifestyle|m;alimentación|diet|f;nutrición|nutrition|f;obesidad|obesity|f;adicción|addiction|f;rehabilitación|rehabilitation|f;terapia|therapy|f;autoestima|self-esteem|f;bienestar|wellbeing|m;estigma|stigma|m;apoyo|support|m;acompañamiento|support, accompaniment|m;ducha|shower|f;higiene|hygiene|f;inclusión|inclusion|f;voluntariado|volunteering|m;donación|donation|f;sangre|blood|f;ambulancia|ambulance|f;paciente|patient|m;especialista|specialist|m;cribado|screening|m;chequeo|check-up|m;pronóstico|prognosis|m;secuelas|after-effects|f;brotes|flare-ups|m;epidemia|epidemic|f;aislamiento|isolation|m;cuarentena|quarantine|f;mascarilla|face mask|f;desinfección|disinfection|f;analítica|blood test|f;radiografía|x-ray|f;ecografía|ultrasound scan|f;derivación|referral|f;ingreso|hospital admission|m;alta|discharge|f;lista|waiting list|f;espera|wait|f;atención|care, attention|f;sanidad|health system|f;enfermería|nursing|f;matrona|midwife|f;fisioterapia|physiotherapy|f;logopedia|speech therapy|f;psiquiatría|psychiatry|f;resiliencia|resilience|f;autocuidado|self-care|m;empatía|empathy|f;burnout|work-related exhaustion|m
`,
    verbs: `
diagnosticar|to diagnose;prevenir|to prevent;tratar|to treat;recetar|to prescribe;vacunar|to vaccinate;contagiar|to infect;aislar|to isolate;recaer|to relapse;rehabilitar|to rehabilitate;acompañar|to support, accompany;cuidar|to care for;atender|to attend to;derivar|to refer;ingresar|to admit to hospital;operar|to operate;donar|to donate;supervisar|to supervise;aliviar|to relieve;agravar|to worsen;empeorar|to worsen;recuperarse|to recover;adaptarse|to adapt;concienciar|to raise awareness;estigmatizar|to stigmatise;normalizar|to normalise;priorizar|to prioritise;descuidar|to neglect;fomentar|to promote;reducir|to reduce;medicar|to medicate;desahogarse|to get things off one's chest;afrontar|to face;gestionar|to manage;respaldar|to support;orientar|to guide;cribar|to screen;desinfectar|to disinfect;monitorizar|to monitor;sedar|to sedate;anestesiar|to anaesthetise;intubar|to intubate;inmunizar|to immunise;descompensarse|to become unstable;somatizar|to express stress physically;estabilizar|to stabilise;reanimar|to resuscitate;drenar|to drain;palpar|to examine by touch;auscultar|to listen with a stethoscope;reincorporarse|to return to work;invalidar|to make unfit;acomodarse|to adapt oneself
`,
    adjs: `
preventivo|preventive;crónico|chronic;agudo|acute;leve|mild;grave|serious;contagioso|contagious;inmune|immune;vulnerable|at risk;sedentario|sedentary;nutritivo|nutritious;saludable|healthy;terapéutico|therapeutic;psicológico|psychological;emocional|emotional;asistencial|care-related;accesible|accessible;inclusivo|inclusive;estigmatizado|stigmatised;solidario|supportive;ambulatorio|outpatient;hospitalario|hospital-based;paliativo|palliative;quirúrgico|surgical;farmacéutico|pharmaceutical;epidemiológico|epidemiological;infeccioso|infectious;degenerativo|degenerative;cognitivo|cognitive;conductual|behavioural;vital|essential for life;compatible|consistent with
`,
    advs: `preventivamente|preventively;médicamente|medically;emocionalmente|emotionally;psicológicamente|psychologically;gradualmente|gradually;seriamente|seriously;clínicamente|clinically;diariamente|daily;semanalmente|weekly;presencialmente|in person;telefónicamente|by phone;urgentemente|urgently;anímicamente|emotionally, in spirits;sanitariamente|from a health-system perspective;terapéuticamente|therapeutically`,
    phrases: `
pedir ayuda|to ask for help;hacer seguimiento|to follow up;guardar reposo|to rest as prescribed;estar de baja|to be on sick leave;hacer frente a|to cope with;poner límites|to set boundaries;venirse abajo|to break down emotionally;dar el alta|to discharge a patient;estar en tratamiento|to be undergoing treatment;perder el apetito|to lose one's appetite;tener altibajos|to have ups and downs;llevar una vida sana|to lead a healthy life
`,
  },
  {
    id: "group-8",
    title: "Ciudad y vivienda · Urban pressure",
    focus: "B2 vocabulary for housing, neighbourhoods, mobility, tourism, public space and urban change.",
    tag: "Urban life",
    nouns: `
gentrificación|gentrification|f;masificación|overcrowding|f;hacinamiento|overcrowding in housing|m;alquiler|rent|m;hipoteca|mortgage|f;desahucio|eviction|m;fianza|deposit|f;inmueble|property|m;arrendador|landlord|m;inquilino|tenant|m;comunidad|residents' association|f;derrama|extra building fee|f;avería|fault|f;humedad|dampness|f;aislamiento|insulation|m;accesibilidad|accessibility|f;peatonalización|pedestrianisation|f;aparcamiento|parking|m;atasco|traffic jam|m;congestión|traffic build-up|f;movilidad|mobility|f;carril|lane|m;acera|pavement|f;calzada|roadway|f;rotonda|roundabout|f;transbordo|transfer|m;abono|travel pass|m;vivienda|housing|f;urbanismo|urban planning|m;ayuntamiento|town hall|m;barrio|neighbourhood|m;vecindario|neighbourhood|m;convivencia|coexistence|f;ruido|noise|m;ocio|leisure|m;turismo|tourism|m;alojamiento|accommodation|m;licencia|licence|f;inspección|inspection|f;sanción|fine|f;reforma|renovation|f;obra|construction work|f;solar|empty plot|m;parcela|plot|f;zonificación|zoning|f;periferia|outskirts|f;centro|city centre|m;desplazamiento|commute, displacement|m;arraigo|roots|m;patrimonio|heritage|m;equipamiento|facilities|m;arrendamiento|lease|m;subarriendo|sublet|m;desperfecto|damage|m;portal|entrance hall|m;trastero|storage room|m;azotea|roof terrace|f;andamio|scaffolding|m;fachada|facade|f;alcantarilla|drain|f;bordillo|curb|m;semáforo|traffic light|m;pasarela|footbridge|f;andén|platform|m;marquesina|bus shelter|f;intercambiador|transport hub|m;cercanías|commuter rail|f;afluencia|flow of people|f;aglomeración|crowd|f;vandalismo|vandalism|m;grafiti|graffiti|m;patinete|scooter|m;ciclovía|cycle lane|f;parquímetro|parking meter|m;residente|resident|m;empadronamiento|local registration|m;licenciamiento|licensing|m;ordenanza|municipal regulation|f;alumbrado|street lighting|m;basura|rubbish|f;mobiliario|street furniture|m;balcón|balcony|m;plazoleta|small square|f;desvío|detour|m
`,
    verbs: `
alquilar|to rent;arrendar|to lease;desahuciar|to evict;reformar|to renovate;insonorizar|to soundproof;aislar|to insulate;convivir|to live together;molestar|to disturb;denunciar|to report;inspeccionar|to inspect;sancionar|to fine;regular|to regulate;peatonalizar|to pedestrianise;desplazar|to displace;masificar|to overcrowd;congestionar|to congest;urbanizar|to develop land;edificar|to build;derribar|to demolish;rehabilitar|to renovate;preservar|to preserve;revalorizar|to increase in value;encarecer|to make more expensive;abaratar|to make cheaper;subvencionar|to subsidise;negociar|to negotiate;empadronarse|to register locally;aparcar|to park;transbordar|to transfer;recorrer|to travel through;desviarse|to take a detour;señalizar|to signpost;iluminar|to light;asfaltar|to asphalt;pavimentar|to pave;subarrendar|to sublet;realojar|to rehouse;reubicar|to relocate;desalojar|to clear out;ocupar|to squat, occupy;tramitar|to process paperwork;licenciar|to license;acondicionar|to adapt, fit out;demorar|to delay;ensanchar|to widen;estrechar|to narrow;soterrar|to bury underground;canalizar|to channel;vallar|to fence off;balizar|to mark off;desviar|to divert;atascarse|to get stuck in traffic;agilizar|to speed up;remolcar|to tow;reparar|to repair
`,
    adjs: `
urbano|urban;residencial|residential;turístico|tourist-related;peatonal|pedestrian-only;periférico|peripheral;céntrico|central;asequible|affordable;inhabitable|habitable;insalubre|unhealthy;ruidoso|noisy;masificado|overcrowded;gentrificado|gentrified;accesible|accessible;comunitario|community-related;patrimonial|heritage-related;municipal|town-level;precario|precarious;provisional|temporary;subterráneo|underground;transitable|passable;habitable|fit to live in;arrendado|rented;amueblado|furnished;luminoso|bright;colindante|adjoining;peatonalizado|pedestrianised;metropolitano|metropolitan;interurbano|between towns;rodado|vehicle-based;atascado|jammed;señalizado|signposted;vallado|fenced off;reformado|renovated
`,
    advs: `urbanísticamente|in urban-planning terms;municipalmente|municipally;temporalmente|temporarily;provisionalmente|provisionally;masivamente|massively;legalmente|legally;peatonalmente|on foot;diariamente|daily;nocturnamente|at night;subterráneamente|underground;localmente|locally`,
    phrases: `
estar en obras|to be under construction;poner una queja|to file a complaint;hacer vida de barrio|to live locally;quedarse fuera|to be left out;irse de las manos|to get out of hand;poner trabas|to create obstacles;tener cabida|to have a place;echar raíces|to put down roots;pagar una derrama|to pay an extra building fee;vivir de alquiler|to live in rented housing
`,
  },
  {
    id: "group-9",
    title: "Ciencia e investigación · Evidence and discovery",
    focus: "B2 vocabulary for research, data, experiments, uncertainty, findings and scientific communication.",
    tag: "Research",
    nouns: `
hallazgo|finding|m;descubrimiento|discovery|m;experimento|experiment|m;ensayo|trial|m;laboratorio|laboratory|m;muestra|sample|f;variable|changing factor|f;indicador|indicator|m;medición|measurement|f;promedio|average|m;desviación|deviation|f;probabilidad|probability|f;incertidumbre|uncertainty|f;margen|margin|m;error|mistake, margin of error|m;hipótesis|hypothesis|f;teoría|theory|f;modelo|model|m;patrón|pattern|m;tendencia|trend|f;correlación|correlation|f;causalidad|causality|f;sesgo|bias|m;muestreo|sampling|m;encuesta|survey|f;gráfico|graph|m;tabla|table|f;registro|record|m;archivo|archive|m;fuente|source|f;revisión|review|f;publicación|publication|f;revista|journal|f;ponencia|conference paper|f;congreso|conference|m;divulgación|popular science|f;simulación|simulation|f;predicción|prediction|f;prototipo|prototype|m;innovación|innovation|f;avance|breakthrough, progress|m;retroceso|setback|m;limitación|limitation|f;replicación|replication|f;validación|validation|f;comprobación|checking|f;observación|observation|f;anomalía|anomaly|f;fenómeno|phenomenon|m;partícula|particle|f;organismo|organism|m;metodología|methodology|f;procedimiento|procedure|m;parámetro|parameter|m;umbral|threshold|m;intervalo|interval|m;estimación|estimate|f;fiabilidad|reliability|f;validez|validity|f;reproducibilidad|reproducibility|f;consistencia|consistency|f;contraste|statistical test, contrast|m;aleatoriedad|randomness|f;cuestionario|questionnaire|m;encuestado|respondent|m;cohorte|cohort|f;subgrupo|subgroup|m;marcador|marker|m;secuencia|sequence|f;genoma|genome|m;célula|cell|f;tejido|tissue|m;sustancia|substance|f;reactivo|reagent|m;microscopio|microscope|m;calibración|calibration|f
`,
    verbs: `
investigar|to research;analizar|to analyse;observar|to observe;medir|to measure;registrar|to record;comparar|to compare;calcular|to calculate;estimar|to estimate;predecir|to predict;simular|to simulate;formular|to formulate;comprobar|to check;verificar|to verify;validar|to validate;replicar|to replicate;refutar|to refute;confirmar|to confirm;descartar|to rule out;detectar|to detect;aislar|to isolate;extraer|to extract;clasificar|to classify;codificar|to code;interpretar|to interpret;publicar|to publish;divulgar|to communicate to the public;financiar|to fund;patentar|to patent;innovar|to innovate;desarrollar|to develop;probar|to test;fallar|to fail;corregir|to correct;ajustar|to adjust;contrastar|to compare, check;muestrear|to sample;calibrar|to calibrate;cuantificar|to quantify;tabular|to tabulate;graficar|to graph;correlacionar|to correlate;secuenciar|to sequence;centrifugar|to centrifuge;diluir|to dilute;sintetizar|to synthesise;cultivar|to culture, cultivate;incubar|to incubate;amplificar|to amplify;separar|to separate;purificar|to purify;etiquetar|to label;anonimizar|to anonymise;ponderar|to weight;extrapolar|to extrapolate;inferir|to infer;parametrizar|to set parameters;modelizar|to model;reproducir|to reproduce;documentar|to document;someter|to submit;publicitar|to publicise;arbitrar|to peer-review;revisar|to review;sesgar|to bias;neutralizar|to neutralise;repensar|to rethink
`,
    adjs: `
empírico|empirical;experimental|based on experiments;teórico|theoretical;cuantitativo|quantitative;cualitativo|qualitative;estadístico|statistical;representativo|representative;aleatorio|random;fiable|reliable;válido|valid;replicable|able to be repeated;provisional|temporary, not final;innovador|innovative;patentable|able to be patented;observable|able to be observed;medible|measurable;incierto|uncertain;probable|likely;improbable|unlikely;riguroso|rigorous;longitudinal|over time;transversal|cross-sectional;preliminar|preliminary;sesgado|biased;anómalo|anomalous;reproducible|able to be reproduced;cuantificable|quantifiable
`,
    advs: `experimentalmente|experimentally;estadísticamente|statistically;empíricamente|empirically;teóricamente|theoretically;provisionalmente|provisionally;rigurosamente|rigorously`,
    phrases: `
poner a prueba|to test;dar lugar a|to give rise to;arrojar luz sobre|to shed light on;estar por demostrar|to remain to be proven;sacar conclusiones|to draw conclusions;partir de una hipótesis|to start from a hypothesis;cometer un error|to make a mistake
`,
  },
  {
    id: "group-10",
    title: "Retos globales · Policy, migration and change",
    focus: "B2 vocabulary for global challenges, migration, governance, conflict, cooperation and future risks.",
    tag: "Global issues",
    nouns: `
migración|migration|f;refugiado|refugee|m;asilo|asylum|m;frontera|border|f;desplazamiento|displacement|m;acogida|reception|f;arraigo|roots, attachment|m;retorno|return|m;remesa|remittance|f;cooperación|cooperation|f;alianza|alliance|f;tratado|treaty|m;cumbre|summit|f;diplomacia|diplomacy|f;embajada|embassy|f;consulado|consulate|m;sanción|sanction|f;bloqueo|blockade|m;conflicto|conflict|m;tregua|truce|f;alto|ceasefire|m;amenaza|threat|f;seguridad|security|f;defensa|defence|f;vigilancia|surveillance|f;crisis|severe emergency|f;emergencia|emergency|f;escasez|shortage|f;hambruna|famine|f;desigualdad|inequality|f;corrupción|corruption|f;transparencia|transparency|f;rendición|accountability|f;gobernanza|governance|f;soberanía|sovereignty|f;interdependencia|interdependence|f;polarización|polarisation|f;desinformación|misinformation|f;radicalización|radicalisation|f;populismo|populism|m;consenso|consensus|m;reforma|reform|f;retroceso|setback|m;avance|progress|m;resiliencia|resilience|f;adaptación|adaptation|f;mitigación|mitigation|f;transición|transition|f;incertidumbre|uncertainty|f;prioridad|priority|f;escenario|scenario|m;diáspora|migrant community abroad|f;visado|visa|m;apátrida|stateless person|m;repatriación|repatriation|f;reubicación|relocation|f;corredor|humanitarian corridor|m;enclave|territory surrounded by another|m;mediador|mediator|m;observador|observer|m;mandato|mandate|m;resolución|resolution|f;embargo|trade restriction|m;arancel|tariff|m;represalia|retaliation|f;insurgencia|insurgency|f;reclutamiento|recruitment|m;desarme|disarmament|m;reconciliación|reconciliation|f;impunidad|impunity|f;atrocidad|atrocity|f;persecución|persecution|f;auxilio|aid|m;socorro|relief|m;albergue|shelter|m;campamento|camp|m;brotes|outbreaks|m;sequía|drought|f;colapso|collapse|m;grieta|crack, divide|f;fragilidad|fragility|f;legitimidad|legitimacy|f;injerencia|interference|f;despliegue|deployment|m;superpotencia|superpower|f;hegemonía|hegemony|f;arbitraje|arbitration|m
`,
    verbs: `
migrar|to migrate;acoger|to welcome, receive;integrar|to integrate;regularizar|to regularise;solicitar|to request;expulsar|to expel;deportar|to deport;negociar|to negotiate;cooperar|to cooperate;mediar|to mediate;sancionar|to sanction;bloquear|to block;amenazar|to threaten;defender|to defend;vigilar|to monitor;prevenir|to prevent;intervenir|to intervene;reformar|to reform;transparentar|to make transparent;fiscalizar|to audit, oversee;combatir|to combat;radicalizar|to radicalise;polarizar|to polarise;desinformar|to misinform;coordinar|to coordinate;priorizar|to prioritise;adaptarse|to adapt;mitigar|to mitigate;resistir|to resist;afrontar|to face;abordar|to address;agravar|to worsen;aliviar|to ease;reconstruir|to rebuild;desplazar|to displace;retornar|to return;repatriar|to repatriate;reubicar|to relocate;tramitar|to process paperwork;asentarse|to settle;arraigarse|to put down roots;perseguir|to persecute;asediar|to besiege;desarmar|to disarm;pacificar|to pacify;reconciliar|to reconcile;amparar|to protect;auxiliar|to aid;socorrer|to help in an emergency;albergar|to shelter;repartir|to distribute;desplegar|to deploy;replegar|to withdraw;ratificar|to ratify;incumplir|to fail to comply;vulnerar|to violate;legitimar|to legitimise;desestabilizar|to destabilise;interponerse|to stand in the way;arbitrar|to arbitrate;boicotear|to boycott
`,
    adjs: `
global|worldwide;internacional|international;fronterizo|border-related;migratorio|migration-related;humanitario|humanitarian;diplomático|diplomatic;geopolítico|geopolitical;estratégico|strategic;soberano|sovereign;multilateral|involving many countries;bilateral|between two sides;transparente|transparent;corrupto|corrupt;polarizado|polarised;radicalizado|radicalised;resiliente|resilient;incierto|uncertain;prioritario|priority;estructural|structural
`,
    advs: `globalmente|globally;internacionalmente|internationally;diplomáticamente|diplomatically;estratégicamente|strategically;estructuralmente|structurally;humanitariamente|humanely`,
    phrases: `
estar en juego|to be at stake;hacer frente a|to face;poner sobre la mesa|to put on the table;llegar a un acuerdo|to reach an agreement;dar marcha atrás|to backtrack;estar bajo presión|to be under pressure;abrir un debate|to open a debate;cerrar filas|to close ranks;sentar las bases|to lay the groundwork;pedir asilo|to seek asylum;poner fin a|to put an end to
`,
  },
];

const PHRASE_EXAMPLES = {
  "poner en duda": ["El informe pone en duda la eficacia de la medida.", "The report calls the effectiveness of the measure into question."],
  "no cabe duda de que": ["No cabe duda de que la vivienda se ha convertido en un reto social.", "There is no doubt that housing has become a social challenge."],
  "desde mi punto de vista": ["Desde mi punto de vista, el dato necesita más contexto.", "From my point of view, the data point needs more context."],
  "en cierta medida": ["En cierta medida, la tecnología facilita el acceso a la información.", "To some extent, technology makes access to information easier."],
  "al fin y al cabo": ["Al fin y al cabo, la decisión afecta a toda la comunidad.", "After all, the decision affects the whole community."],
  "por consiguiente": ["Los costes han aumentado; por consiguiente, habrá que revisar el presupuesto.", "Costs have increased; therefore, the budget will have to be reviewed."],
  "dicho de otro modo": ["Dicho de otro modo, no basta con aprobar una norma.", "In other words, approving a rule is not enough."],
  "conviene señalar que": ["Conviene señalar que la muestra era pequeña y los resultados son provisionales.", "It is worth pointing out that the sample was small and the results are provisional."],
  "por regla general": ["Por regla general, una opinión gana fuerza cuando se apoya en ejemplos concretos.", "As a general rule, an opinion becomes stronger when it is supported by concrete examples."],
  "a grandes rasgos": ["A grandes rasgos, el plan busca reducir costes sin perder calidad.", "Broadly speaking, the plan aims to reduce costs without losing quality."],
  "tomar medidas": ["El ayuntamiento debe tomar medidas antes de que el problema empeore.", "The town hall must take measures before the problem gets worse."],
  "hacer valer": ["La ciudadanía tiene que hacer valer sus derechos sin miedo.", "Citizens have to assert their rights without fear."],
  "estar en juego": ["En este debate está en juego la confianza en las instituciones.", "Trust in the institutions is at stake in this debate."],
  "poner de manifiesto": ["La encuesta pone de manifiesto una brecha entre generaciones.", "The survey reveals a gap between generations."],
  "dar voz a": ["El proyecto intenta dar voz a quienes casi nunca aparecen en los medios.", "The project tries to give a voice to those who rarely appear in the media."],
  "hacer frente a": ["La ciudad debe hacer frente al aumento del alquiler.", "The city must face the rise in rent."],
  "pasar por alto": ["No conviene pasar por alto los efectos indirectos de la medida.", "It is not wise to overlook the indirect effects of the measure."],
  "velar por": ["La institución debe velar por la seguridad de los menores.", "The institution must safeguard the safety of minors."],
  "estar al margen": ["Muchas familias sienten que están al margen de las decisiones públicas.", "Many families feel that they are on the margins of public decisions."],
  "tener derecho a": ["Todo estudiante tiene derecho a recibir orientación clara.", "Every student has the right to receive clear guidance."],
  "poner límites a": ["La nueva ley intenta poner límites a los abusos del mercado.", "The new law tries to set limits on market abuses."],
  "poner en peligro": ["La sequía puede poner en peligro la cosecha.", "The drought can endanger the harvest."],
  "estar en riesgo": ["Varias especies están en riesgo por la pérdida de hábitat.", "Several species are at risk because of habitat loss."],
  "hacer un uso responsable": ["Hay que hacer un uso responsable del agua en épocas de escasez.", "Water must be used responsibly during shortages."],
  "apostar por": ["El barrio quiere apostar por la energía renovable.", "The neighbourhood wants to commit to renewable energy."],
  "tomar conciencia": ["Cada vez más jóvenes toman conciencia del impacto del consumo.", "More and more young people are becoming aware of the impact of consumption."],
  "dejar huella": ["Nuestras decisiones de transporte dejan huella en el clima.", "Our transport choices leave a footprint on the climate."],
  "pasar factura": ["El derroche de recursos acaba pasando factura.", "The waste of resources eventually takes its toll."],
  "poner freno a": ["El plan intenta poner freno al derroche de agua en verano.", "The plan tries to put a stop to wasting water in summer."],
  "estar a tiempo de": ["Todavía estamos a tiempo de proteger los humedales cercanos.", "We still have time to protect the nearby wetlands."],
  "caer en una trampa": ["Muchos usuarios caen en una trampa por confiar en enlaces falsos.", "Many users fall into a trap by trusting false links."],
  "darse de alta": ["Para acceder al curso hay que darse de alta en la plataforma.", "To access the course you have to sign up on the platform."],
  "darse de baja": ["Se dio de baja porque no usaba el servicio.", "She unsubscribed because she did not use the service."],
  "estar al tanto": ["Conviene estar al tanto de los cambios de privacidad.", "It is best to keep up to date with privacy changes."],
  "hacer clic": ["Antes de hacer clic, comprueba la fuente.", "Before clicking, check the source."],
  "poner en circulación": ["El titular puso en circulación un rumor sin pruebas.", "The headline put an unproven rumour into circulation."],
  "contrastar fuentes": ["Para escribir bien, hay que contrastar fuentes.", "To write well, you have to cross-check sources."],
  "dejar rastro": ["Cada búsqueda puede dejar rastro si no cambias la configuración.", "Each search can leave a trace if you do not change the settings."],
  "estar conectado a": ["El dispositivo está conectado a una red pública y conviene tener cuidado.", "The device is connected to a public network, so it is best to be careful."],
  "poner en marcha": ["La empresa puso en marcha una plataforma para atender incidencias.", "The company launched a platform to handle support issues."],
  "pasar a segundo plano": ["La aplicación pasa a segundo plano, pero sigue consumiendo datos.", "The app moves into the background but keeps using data."],
  "estar expuesto a": ["Un menor puede estar expuesto a anuncios engañosos en redes sociales.", "A minor can be exposed to misleading ads on social media."],
  "hacer una copia de seguridad": ["Antes de actualizar, hice una copia de seguridad de todos los archivos.", "Before updating, I made a backup of all the files."],
  "poner en práctica": ["El curso permite poner en práctica la teoría.", "The course lets students put theory into practice."],
  "dar por sentado": ["No deberíamos dar por sentado el acceso a la educación.", "We should not take access to education for granted."],
  "estar a la altura": ["La respuesta institucional no estuvo a la altura del problema.", "The institutional response was not up to the problem."],
  "sacar partido": ["Un buen tutor ayuda a sacar partido del aprendizaje autónomo.", "A good tutor helps students make the most of independent learning."],
  "abrir puertas": ["Dominar otro idioma puede abrir puertas laborales.", "Mastering another language can open professional doors."],
  "quedarse atrás": ["Sin apoyo, algunos alumnos se quedan atrás.", "Without support, some students fall behind."],
  "tener acceso a": ["No todos tienen acceso a los mismos recursos.", "Not everyone has access to the same resources."],
  "hacer hincapié en": ["La profesora hizo hincapié en justificar cada respuesta.", "The teacher emphasised justifying every answer."],
  "servir de puente": ["La literatura puede servir de puente entre generaciones.", "Literature can serve as a bridge between generations."],
  "llegar a fin de mes": ["Con esos precios, muchas familias no llegan a fin de mes.", "With those prices, many families cannot make ends meet."],
  "estar en paro": ["Lleva meses en paro y está buscando formación.", "He has been unemployed for months and is looking for training."],
  "salir rentable": ["La inversión solo sale rentable a largo plazo.", "The investment is only profitable in the long term."],
  "hacer cuentas": ["Antes de firmar la hipoteca, hicimos cuentas con calma.", "Before signing the mortgage, we did the sums calmly."],
  "estar endeudado": ["El negocio está endeudado por la caída de ventas.", "The business is in debt because of the drop in sales."],
  "subir los precios": ["Si suben los precios, el consumo se reduce.", "If prices rise, consumption goes down."],
  "costar un dineral": ["Reformar el piso puede costar un dineral.", "Renovating the flat can cost a fortune."],
  "apretarse el cinturón": ["Muchas familias tuvieron que apretarse el cinturón durante la inflación.", "Many families had to tighten their belts during inflation."],
  "vivir al día": ["Con contratos tan inestables, mucha gente vive al día.", "With such unstable contracts, many people live day to day."],
  "pedir ayuda": ["Pedir ayuda a tiempo puede evitar una recaída.", "Asking for help in time can prevent a relapse."],
  "hacer seguimiento": ["El centro de salud hará seguimiento durante varias semanas.", "The health centre will follow up for several weeks."],
  "guardar reposo": ["El médico le recomendó guardar reposo tras la cirugía.", "The doctor recommended resting after the surgery."],
  "estar de baja": ["Está de baja por agotamiento y necesita apoyo.", "She is on sick leave because of exhaustion and needs support."],
  "poner límites": ["Poner límites también forma parte del bienestar.", "Setting boundaries is also part of wellbeing."],
  "venirse abajo": ["Después de meses de estrés, se vino abajo.", "After months of stress, he broke down emotionally."],
  "dar el alta": ["El hospital le dio el alta, pero seguirá con revisiones.", "The hospital discharged her, but she will continue with check-ups."],
  "estar en tratamiento": ["Está en tratamiento y ha notado una mejora gradual.", "He is undergoing treatment and has noticed a gradual improvement."],
  "perder el apetito": ["Cuando está muy nerviosa, suele perder el apetito.", "When she is very nervous, she tends to lose her appetite."],
  "tener altibajos": ["Durante la recuperación es normal tener altibajos.", "During recovery it is normal to have ups and downs."],
  "llevar una vida sana": ["Llevar una vida sana no consiste solo en hacer deporte.", "Leading a healthy life is not only about doing sport."],
  "estar en obras": ["La avenida está en obras y el tráfico se desvía.", "The avenue is under construction and traffic is diverted."],
  "poner una queja": ["Los vecinos pusieron una queja por el ruido nocturno.", "The neighbours filed a complaint about the night noise."],
  "hacer vida de barrio": ["Hacer vida de barrio ayuda a crear confianza.", "Living locally helps build trust."],
  "quedarse fuera": ["Muchos jóvenes se quedan fuera del mercado de vivienda.", "Many young people are left out of the housing market."],
  "irse de las manos": ["El turismo se fue de las manos en algunas zonas.", "Tourism got out of hand in some areas."],
  "poner trabas": ["La burocracia pone trabas a la rehabilitación de edificios.", "Bureaucracy creates obstacles to renovating buildings."],
  "tener cabida": ["La cultura local debe tener cabida en el centro.", "Local culture must have a place in the city centre."],
  "echar raíces": ["Después de años en el barrio, la familia echó raíces allí.", "After years in the neighbourhood, the family put down roots there."],
  "pagar una derrama": ["Los vecinos tendrán que pagar una derrama para reparar la fachada.", "The residents will have to pay an extra building fee to repair the facade."],
  "vivir de alquiler": ["Muchos jóvenes viven de alquiler porque no pueden comprar una vivienda.", "Many young people live in rented housing because they cannot buy a home."],
  "poner a prueba": ["El estudio pone a prueba una hipótesis sencilla.", "The study tests a simple hypothesis."],
  "dar lugar a": ["El hallazgo puede dar lugar a nuevas preguntas.", "The finding can give rise to new questions."],
  "arrojar luz sobre": ["Los datos arrojan luz sobre una tendencia poco visible.", "The data shed light on a barely visible trend."],
  "estar por demostrar": ["La relación causal todavía está por demostrar.", "The causal relationship remains to be proven."],
  "sacar conclusiones": ["No conviene sacar conclusiones con una muestra tan pequeña.", "It is not wise to draw conclusions from such a small sample."],
  "partir de una hipótesis": ["El equipo parte de una hipótesis que deberá comprobar.", "The team starts from a hypothesis that it will have to test."],
  "cometer un error": ["Cometer un error en la medición cambia el resultado.", "Making a measurement error changes the result."],
  "poner sobre la mesa": ["La crisis puso sobre la mesa la necesidad de cooperar.", "The crisis put the need to cooperate on the table."],
  "llegar a un acuerdo": ["Los países intentan llegar a un acuerdo antes de la cumbre.", "The countries are trying to reach an agreement before the summit."],
  "dar marcha atrás": ["El gobierno tuvo que dar marcha atrás por la presión social.", "The government had to backtrack because of social pressure."],
  "estar bajo presión": ["La administración está bajo presión por la falta de recursos.", "The administration is under pressure because of the lack of resources."],
  "abrir un debate": ["La propuesta abrió un debate sobre prioridades públicas.", "The proposal opened a debate about public priorities."],
  "cerrar filas": ["Los socios cerraron filas para defender el acuerdo.", "The partners closed ranks to defend the agreement."],
  "sentar las bases": ["La cumbre intentó sentar las bases de una cooperación más estable.", "The summit tried to lay the groundwork for more stable cooperation."],
  "pedir asilo": ["La familia pidió asilo después de cruzar la frontera.", "The family sought asylum after crossing the border."],
  "poner fin a": ["La mediación busca poner fin a meses de bloqueo.", "The mediation aims to put an end to months of deadlock."],
};

const CUSTOM_VERBS = {
  consistir: ["El problema consiste en garantizar derechos sin crear nuevas desigualdades.", "The problem consists of guaranteeing rights without creating new inequalities."],
  carecer: ["La propuesta carece de financiación estable.", "The proposal lacks stable funding."],
  influir: ["La precariedad influye en la salud mental de los jóvenes.", "Precariousness affects young people's mental health."],
  depender: ["El éxito de la reforma depende de su aplicación real.", "The success of the reform depends on its real implementation."],
  recurrir: ["Muchas familias recurren a sus ahorros para pagar el alquiler.", "Many families resort to their savings to pay rent."],
  contribuir: ["La educación contribuye a reducir la desigualdad.", "Education contributes to reducing inequality."],
  optar: ["El municipio optó por peatonalizar varias calles.", "The municipality chose to pedestrianise several streets."],
  aspirar: ["El proyecto aspira a mejorar la convivencia del barrio.", "The project aims to improve neighbourhood coexistence."],
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

function articleFor(word) {
  return word.gender === "f" ? "la" : "el";
}

function deArticleFor(word) {
  return word.gender === "f" ? `de la ${word.lemma}` : `del ${word.lemma}`;
}

function aArticleFor(word) {
  return word.gender === "f" ? `a la ${word.lemma}` : `al ${word.lemma}`;
}

const PERSON_NOUNS = new Set([
  "apátrida",
  "arrendador",
  "autónomo",
  "becario",
  "cliente",
  "comisario",
  "concejal",
  "consumidor",
  "cotizante",
  "cuidador",
  "emprendedor",
  "encuestado",
  "especialista",
  "inquilino",
  "lector",
  "matrona",
  "mediador",
  "mentor",
  "observador",
  "paciente",
  "portavoz",
  "proveedor",
  "redactor",
  "refugiado",
  "residente",
  "suscriptor",
]);

function makeNounExample(word, group) {
  const article = articleFor(word);
  const deArticle = deArticleFor(word);
  const aArticle = aArticleFor(word);
  if (PERSON_NOUNS.has(word.lemma)) {
    const personTemplates = {
      Society: [
        [`El informe recoge la experiencia ${deArticle} en el trámite público.`, `The report includes the experience of the ${word.translation_en} in the public procedure.`],
        [`La entrevista ${aArticle} muestra cómo funciona la norma en la vida real.`, `The interview with the ${word.translation_en} shows how the rule works in real life.`],
      ],
      Education: [
        [`La universidad orientó ${aArticle} antes de cerrar la matrícula.`, `The university guided the ${word.translation_en} before enrolment closed.`],
        [`El programa ofrece apoyo ${aArticle} durante todo el curso.`, `The programme offers support to the ${word.translation_en} throughout the course.`],
      ],
      Economy: [
        [`La nueva norma afecta ${aArticle} cuando cambian las cotizaciones.`, `The new rule affects the ${word.translation_en} when contributions change.`],
        [`El contrato protege ${aArticle} frente a abusos frecuentes.`, `The contract protects the ${word.translation_en} against common abuses.`],
      ],
      Health: [
        [`El centro ofrece apoyo ${aArticle} durante todo el seguimiento.`, `The centre offers support to the ${word.translation_en} throughout the follow-up.`],
        [`La guía explica qué necesita ${article} ${word.lemma} en una situación delicada.`, `The guide explains what the ${word.translation_en} needs in a delicate situation.`],
      ],
      "Urban life": [
        [`El ayuntamiento informó ${aArticle} sobre las nuevas normas del barrio.`, `The town hall informed the ${word.translation_en} about the new neighbourhood rules.`],
        [`La reunión permitió escuchar ${aArticle} antes de aprobar la reforma.`, `The meeting made it possible to listen to the ${word.translation_en} before approving the renovation.`],
      ],
      "Global issues": [
        [`La organización recogió el testimonio ${deArticle} durante la misión.`, `The organisation collected the testimony of the ${word.translation_en} during the mission.`],
        [`El acuerdo busca proteger ${aArticle} sin retrasar el trámite.`, `The agreement aims to protect the ${word.translation_en} without delaying the procedure.`],
      ],
    };
    const templates = personTemplates[group.tag] || personTemplates.Society;
    return templates[(word.lemma.length + group.id.length) % templates.length];
  }
  const templatesByTag = {
    Argumentation: [
      [`El debate gira en torno ${aArticle}, no solo a los datos.`, `The debate revolves around the ${word.translation_en}, not only the data.`],
      [`Para defender una postura, conviene aclarar ${article} ${word.lemma}.`, `To defend a position, it is best to clarify the ${word.translation_en}.`],
      [`El ensayo menciona ${article} ${word.lemma} para matizar la conclusión.`, `The essay mentions the ${word.translation_en} to qualify the conclusion.`],
      [`Ese ejemplo ayuda a entender mejor ${article} ${word.lemma}.`, `That example helps to understand the ${word.translation_en} better.`],
    ],
    Society: [
      [`La política pública debe tener en cuenta ${article} ${word.lemma}.`, `Public policy must take the ${word.translation_en} into account.`],
      [`El informe analiza problemas relacionados con ${article} ${word.lemma}.`, `The report analyses problems related to the ${word.translation_en}.`],
      [`Sin datos, es difícil valorar ${article} ${word.lemma}.`, `Without data, it is hard to assess the ${word.translation_en}.`],
      [`La sociedad no puede ignorar ${article} ${word.lemma}.`, `Society cannot ignore the ${word.translation_en}.`],
    ],
    Environment: [
      [`El informe explica cómo afecta ${article} ${word.lemma} a la zona.`, `The report explains how the ${word.translation_en} affects the area.`],
      [`Las autoridades revisan las medidas relacionadas con ${article} ${word.lemma}.`, `The authorities are reviewing measures related to the ${word.translation_en}.`],
      [`El cambio climático obliga a observar mejor ${article} ${word.lemma}.`, `Climate change makes it necessary to monitor the ${word.translation_en} more closely.`],
      [`La campaña explica por qué importa ${article} ${word.lemma}.`, `The campaign explains why the ${word.translation_en} matters.`],
    ],
    Technology: [
      [`La noticia analiza el impacto ${deArticle}.`, `The news item analyses the impact of the ${word.translation_en}.`],
      [`El usuario debe entender ${article} ${word.lemma} antes de aceptar las condiciones.`, `The user should understand the ${word.translation_en} before accepting the terms.`],
      [`La plataforma cambió su política sobre ${article} ${word.lemma}.`, `The platform changed its policy on the ${word.translation_en}.`],
      [`El debate digital se centra cada vez más en ${article} ${word.lemma}.`, `The digital debate increasingly focuses on the ${word.translation_en}.`],
    ],
    Education: [
      [`El centro quiere mejorar ${article} ${word.lemma} sin aumentar la carga del alumnado.`, `The centre wants to improve the ${word.translation_en} without increasing students' workload.`],
      [`La universidad abrió un debate sobre ${article} ${word.lemma}.`, `The university opened a debate about the ${word.translation_en}.`],
      [`El proyecto cultural depende ${deArticle} y de su financiación.`, `The cultural project depends on the ${word.translation_en} and its funding.`],
      [`La falta ${deArticle} limita el acceso a la cultura.`, `The lack of the ${word.translation_en} limits access to culture.`],
    ],
    Economy: [
      [`El aumento ${deArticle} afecta a muchas familias.`, `The rise in the ${word.translation_en} affects many families.`],
      [`La empresa revisó ${article} ${word.lemma} antes de contratar a más personal.`, `The company reviewed the ${word.translation_en} before hiring more staff.`],
      [`La crisis hizo visible ${article} ${word.lemma}.`, `The crisis made the ${word.translation_en} visible.`],
      [`El gobierno anunció medidas para reducir ${article} ${word.lemma}.`, `The government announced measures to reduce the ${word.translation_en}.`],
    ],
    Health: [
      [`La guía ofrece información clara sobre ${article} ${word.lemma}.`, `The guide offers clear information about the ${word.translation_en}.`],
      [`La campaña insiste en la importancia ${deArticle}.`, `The campaign stresses the importance of the ${word.translation_en}.`],
      [`El especialista explicó cómo reconocer ${article} ${word.lemma}.`, `The specialist explained how to recognise the ${word.translation_en}.`],
      [`El centro revisa cada caso relacionado con ${article} ${word.lemma}.`, `The centre reviews each case related to the ${word.translation_en}.`],
    ],
    "Urban life": [
      [`El barrio debate cómo gestionar ${article} ${word.lemma}.`, `The neighbourhood is debating how to manage the ${word.translation_en}.`],
      [`La reunión vecinal abordó el problema ${deArticle}.`, `The residents' meeting addressed the problem of the ${word.translation_en}.`],
      [`El ayuntamiento reguló ${article} ${word.lemma} tras varias quejas.`, `The town hall regulated the ${word.translation_en} after several complaints.`],
      [`La convivencia depende también ${deArticle}.`, `Coexistence also depends on the ${word.translation_en}.`],
    ],
    Research: [
      [`El equipo publicó ${article} ${word.lemma} en una revista especializada.`, `The team published the ${word.translation_en} in a specialised journal.`],
      [`La investigación parte ${deArticle}.`, `The research starts from the ${word.translation_en}.`],
      [`Un error en ${article} ${word.lemma} puede cambiar las conclusiones.`, `An error in the ${word.translation_en} can change the conclusions.`],
      [`Los datos no bastan para explicar ${article} ${word.lemma}.`, `The data are not enough to explain the ${word.translation_en}.`],
    ],
    "Global issues": [
      [`La cumbre abordó ${article} ${word.lemma} desde una perspectiva internacional.`, `The summit addressed the ${word.translation_en} from an international perspective.`],
      [`La crisis puso ${article} ${word.lemma} en el centro del debate.`, `The crisis put the ${word.translation_en} at the centre of the debate.`],
      [`Los gobiernos intentan coordinar una respuesta ante ${article} ${word.lemma}.`, `Governments are trying to coordinate a response to the ${word.translation_en}.`],
      [`La cooperación es clave para gestionar ${article} ${word.lemma}.`, `Cooperation is key to managing the ${word.translation_en}.`],
    ],
  };
  const templates = templatesByTag[group.tag] || templatesByTag.Argumentation;
  return templates[Math.abs(word.lemma.length + group.id.length) % templates.length];
}

function makeVerbExample(word, group) {
  if (CUSTOM_VERBS[word.lemma]) return CUSTOM_VERBS[word.lemma];
  const plain = word.translation_en.replace(/^to /, "");
  const templates = [
    [`El gobierno intenta ${word.lemma} el problema sin crear nuevas tensiones.`, `The government is trying to ${plain} the problem without creating new tensions.`],
    [`La medida puede ${word.lemma} la situación si no se aplica con cuidado.`, `The measure may ${plain} the situation if it is not applied carefully.`],
    [`Para avanzar, hace falta ${word.lemma} los datos con rigor.`, `To move forward, it is necessary to ${plain} the data rigorously.`],
    [`La comisión decidió ${word.lemma} la propuesta antes de votarla.`, `The committee decided to ${plain} the proposal before voting on it.`],
  ];
  return templates[(word.lemma.length + group.title.length) % templates.length];
}

function makeAdjExample(word, group) {
  const templates = [
    [`Es un enfoque ${word.lemma}, pero necesita más pruebas.`, `It is a ${word.translation_en} approach, but it needs more evidence.`],
    [`La respuesta fue ${word.lemma} para una situación tan compleja.`, `The response was ${word.translation_en} for such a complex situation.`],
    [`Un análisis ${word.lemma} permite evitar conclusiones rápidas.`, `A ${word.translation_en} analysis helps avoid quick conclusions.`],
    [`El debate se volvió más ${word.lemma} después de escuchar a los afectados.`, `The debate became more ${word.translation_en} after listening to those affected.`],
  ];
  return templates[(word.lemma.length + group.id.length) % templates.length];
}

function makeAdvExample(word) {
  const templates = [
    [`El informe explica ${word.lemma} por qué la medida no funciona.`, `The report explains ${word.translation_en} why the measure does not work.`],
    [`La situación cambió ${word.lemma} tras la nueva normativa.`, `The situation changed ${word.translation_en} after the new regulation.`],
    [`Conviene actuar ${word.lemma} cuando hay derechos en juego.`, `It is best to act ${word.translation_en} when rights are at stake.`],
    [`El dato debe interpretarse ${word.lemma}, no de forma aislada.`, `The data point must be interpreted ${word.translation_en}, not in isolation.`],
  ];
  return templates[word.lemma.length % templates.length];
}

function makePhraseExample(word) {
  return PHRASE_EXAMPLES[word.lemma] || [`La expresión "${word.lemma}" es útil para matizar una opinión.`, `The expression "${word.lemma}" is useful for qualifying an opinion.`];
}

function buildWord(word, group) {
  let example;
  if (word.pos === "phrase") example = makePhraseExample(word);
  else if (word.pos === "verb") example = makeVerbExample(word, group);
  else if (word.pos === "adj") example = makeAdjExample(word, group);
  else if (word.pos === "adv") example = makeAdvExample(word, group);
  else example = makeNounExample(word, group);
  const out = {
    lemma: word.lemma,
    pos: word.pos,
    translation_en: word.translation_en,
    example: example[0],
    example_en: example[1],
    tag: group.tag,
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

function buildGroup(group, blocked, used) {
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
    const pool = uniqueCandidates(parsed[pos], blocked, used);
    const chosen = pool.slice(0, need);
    if (chosen.length !== need) {
      throw new Error(`${group.id} needs ${need} ${pos}, got ${chosen.length}`);
    }
    for (const item of chosen) {
      used.add(comparable(item.lemma));
      words.push(buildWord(item, group));
    }
  }
  return { id: group.id, title: group.title, focus: group.focus, words };
}

function textComparable(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
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
    const lemmaText = String(word.lemma || "").trim().toLowerCase();
    const translationText = String(word.translation_en || "").trim().toLowerCase();
    if (lemmaText && translationText && lemmaText === translationText) {
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
  const built = GROUPS.map((group) => {
    const data = buildGroup(group, blocked, used);
    validateGroup(data);
    return data;
  });
  const index = {
    id: TARGET_LEVEL,
    title: "B2 · Intermedio alto",
    subtitle: "Upper-intermediate Spanish for DELE-style debate, study, public life and real-world issues.",
    focus: "Single-word B2 vocabulary with a small controlled set of useful idiomatic expressions in each group.",
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
