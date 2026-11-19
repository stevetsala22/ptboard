// PT Board landing: testi EN/FR. L'italiano e' scritto direttamente in landing.html
// (attributi data-i18n, data-i18n-alt, data-i18n-src): al primo cambio di lingua viene
// memorizzato e ripristinato quando si torna a IT. Lingua salvata in localStorage 'pt_landing_lang'.
var TR={
en:{
"meta.title":"PT Board · The training management software for personal trainers and gyms",
"meta.desc":"PT Board is the training management software for personal trainers and gyms: assess the client, build the plan with supersets, circuits, EMOM and Hyrox, and the client follows it on their phone with timers and exercise images. 15 days free.",
"nav.tagline":"The personal trainer's board",
"nav.login":"Sign in",
"nav.cta":"Start free",
"hero.eyebrow":"Training management software for personal trainers and gyms",
"hero.title":"Your plan. <em>On their phone.</em>",
"hero.lead":"Assess, program and coach every client from one place. From the first assessment to the last rep.",
"hero.how":"See how it works",
"hero.tag":"<b>EMOM</b> timer included",
"cta.start":"Start free",
"cta.start2":"Start free",
"cta.note":"15 days free. No credit card.",
"cta.note2":"15 days free. No credit card.",
"img.phoneTop":"The client link on a phone: workout plan with rules, progression and warm-up",
"img.phoneEmom":"EMOM timer on the client's phone: minute 3 of 16, station B3",
"img.pdf":"/img/landing/pdf-en.jpg",
"img.pdfAlt":"Workout plan PDF: superset, EMOM and finisher with loads and notes",
"how.eyebrow":"How it works",
"how.title":"Assess. Program. Coach.",
"how.sub":"All your work with a client, in one app.",
"p1.k":"Assess",
"p1.t":"Start from data.",
"p1.a":"Guided health history and PAR-Q",
"p1.b":"Standard tests: 6MWT, sit-to-stand, handgrip, BIA",
"p1.c":"5-minute quick assessment when you need it",
"p1.d":"Weight and test progress over time",
"p2.k":"Program",
"p2.t":"Build the way you think.",
"p2.a":"Automatic generator based on goal and level",
"p2.b":"Supersets, circuits, EMOM, AMRAP, Hyrox, finishers",
"p2.c":"Reps, time, metres, calories, per side",
"p2.d":"Your own templates, your gym's or other PTs'",
"p3.k":"Coach",
"p3.t":"Always by their side.",
"p3.a":"Personal link, no app to install",
"p3.b":"Rest timer, EMOM, AMRAP and stopwatch",
"p3.c":"\"How to do it\" images for over 230 exercises",
"p3.d":"The client logs loads and reps",
"prog.eyebrow":"Program",
"prog.title":"The methods you use. In one plan.",
"prog.sub":"Superset, EMOM, Hyrox. Write the workout the way you think it: PT Board turns it into a clean PDF and a plan on your client's phone.",
"blk.sup":"2 exercises, then rest",
"blk.cirName":"Circuit",
"blk.cir":"stations × rounds",
"blk.emom":"one station every minute",
"blk.amrap":"as many rounds as possible",
"blk.hyrox":"rounds with no rest",
"blk.fin":"a hard finish",
"prog.a":"Loads, notes and progression where you need them.",
"prog.b":"Warm-up and cool-down in every session.",
"prog.c":"Session length, calculated for you.",
"prog.d":"Your logo on every PDF.",
"cli.eyebrow":"Coach",
"cli.title":"You're not in the gym. Your plan is.",
"cli.sub":"One link, no app to install. Your client opens today's session and trains with your method: timers, exercise images, loads to log.",
"cli.a":"On any phone, no sign-up.",
"cli.b":"EMOM and AMRAP timers, rest that beeps.",
"cli.c":"Images for over 230 exercises, to do them right.",
"cli.d":"Change the plan, their link updates.",
"gym.eyebrow":"For gyms",
"gym.title":"One team. One standard.",
"gym.sub":"With Gym Space every PT works with the same clients, the same templates and your gym's brand.",
"gym.at":"Shared clients",
"gym.a":"Every PT can coach every member.",
"gym.bt":"Shared templates",
"gym.b":"Your best plans, for the whole staff.",
"gym.ct":"Your brand",
"gym.c":"Logo and colours on the app, PDFs and the client's phone.",
"gym.dt":"New members",
"gym.d":"Quick assessment, plan ready in minutes.",
"pr.eyebrow":"Pricing",
"pr.title":"Simple, as it should be.",
"pr.sub":"Start with 15 days free. Cancel anytime. Your data stays yours.",
"pr.month":"/ month",
"pr.month2":"/ month",
"pr.proSub":"or €7.99 a month billed yearly (€95.88 a year)",
"pr.pro1":"Unlimited clients",
"pr.pro2":"Assessment, generator and plans",
"pr.pro3":"Client link with timers",
"pr.pro4":"PDFs with your logo",
"pr.proBtn":"Start with Pro",
"pr.teamBadge":"For studios",
"pr.teamSub":"up to 3 PTs · €15.99 a month billed yearly",
"pr.team1":"Everything in Pro",
"pr.team2":"Up to 3 PTs",
"pr.team3":"Templates shared between you",
"pr.teamBtn":"Start with Team",
"pr.gymName":"Gym",
"pr.gymAmt":"Tailored",
"pr.gymSub":"An offer built on your number of PTs and members.",
"pr.gym1":"All the PTs in your gym",
"pr.gym2":"Shared clients and templates",
"pr.gym3":"Your gym's brand",
"pr.gym4":"Dedicated support",
"pr.gymBtn":"Talk to us",
"num.eyebrow":"PT Board in numbers",
"num.title":"Made by personal trainers, for personal trainers.",
"num.sub":"Born on the gym floor. Every test and every calculation comes from the scientific literature.",
"num.a":"exercises in the library, most with \"how to do it\" images",
"num.b":"block types: superset, circuit, EMOM, AMRAP, Hyrox, finisher",
"num.c":"languages: Italian, English, French",
"num.refs":"Tests and calculations based on <b>ACSM</b> · <b>NSCA</b> · <b>ERS/ATS 2014</b> (6MWT) · <b>Rikli &amp; Jones</b> (sit-to-stand) · <b>ISSN 2017</b> (nutrition) · <b>Schoenfeld</b> (volume and rest)",
"early.eyebrow":"Early PT program",
"early.text":"<b>Start now and grow with us.</b> Direct support from our team and your requests in the next releases.",
"faq.eyebrow":"FAQ",
"faq.title":"Questions? Answers.",
"faq.q1":"Does the client need to install an app?",
"faq.a1":"No. They get a link and open it on their phone. If they like, they can add it to their home screen.",
"faq.q2":"Can I use my own plans?",
"faq.a2":"Yes. Write them in the editor, import them from a file or start from a template. The automatic generator is there to help, not required.",
"faq.q3":"Is my clients' data safe?",
"faq.a3":"It's stored on Google Firebase and only you can see it. No client data goes into shared templates.",
"faq.q4":"Does it work on tablets and computers?",
"faq.a4":"Yes, in the browser on any device. You can install it as an app on your phone.",
"faq.q5":"Can I cancel?",
"faq.a5":"Anytime. You keep the plan until the end of the paid period and you can export all your data.",
"final.title":"Your next client starts here.",
"final.lead":"Build their plan today. Tomorrow they open it in the gym.",
"foot.blog":"Blog",
"foot.privacy":"Privacy",
"foot.terms":"Terms",
"foot.login":"Sign in"
},
fr:{
"meta.title":"PT Board · Le logiciel de gestion de l'entraînement pour coachs sportifs et salles",
"meta.desc":"PT Board est le logiciel de gestion de l'entraînement pour coachs sportifs et salles : évaluez le client, créez le programme avec supersets, circuits, EMOM et Hyrox, et le client le suit sur son téléphone avec minuteurs et images des exercices. 15 jours gratuits.",
"nav.tagline":"Le tableau du coach sportif",
"nav.login":"Se connecter",
"nav.cta":"Essai gratuit",
"hero.eyebrow":"Le logiciel de gestion de l'entraînement pour coachs sportifs et salles",
"hero.title":"Votre programme. <em>Dans son téléphone.</em>",
"hero.lead":"Évaluez, programmez et suivez chaque client depuis un seul endroit. De la première évaluation à la dernière répétition.",
"hero.how":"Voir comment ça marche",
"hero.tag":"Minuteur <b>EMOM</b> inclus",
"cta.start":"Commencer gratuitement",
"cta.start2":"Commencer gratuitement",
"cta.note":"15 jours gratuits. Sans carte bancaire.",
"cta.note2":"15 jours gratuits. Sans carte bancaire.",
"img.phoneTop":"Le lien du client sur le téléphone : programme avec règles, progression et échauffement",
"img.phoneEmom":"Minuteur EMOM sur le téléphone du client : minute 3 sur 16, station B3",
"img.pdf":"/img/landing/pdf-fr.jpg",
"img.pdfAlt":"PDF du programme : superset, EMOM et finisher avec charges et notes",
"how.eyebrow":"Comment ça marche",
"how.title":"Évaluez. Programmez. Suivez.",
"how.sub":"Tout votre travail avec un client, dans une seule app.",
"p1.k":"Évaluez",
"p1.t":"Partez des données.",
"p1.a":"Anamnèse et PAR-Q guidés",
"p1.b":"Tests standard : 6MWT, assis-debout, handgrip, BIA",
"p1.c":"Évaluation rapide en 5 minutes si besoin",
"p1.d":"Progrès du poids et des tests dans le temps",
"p2.k":"Programmez",
"p2.t":"Construisez comme vous pensez.",
"p2.a":"Générateur automatique selon l'objectif et le niveau",
"p2.b":"Supersets, circuits, EMOM, AMRAP, Hyrox, finishers",
"p2.c":"Répétitions, temps, mètres, calories, par côté",
"p2.d":"Vos modèles, ceux de votre salle ou d'autres coachs",
"p3.k":"Suivez",
"p3.t":"Toujours à ses côtés.",
"p3.a":"Lien personnel, sans app à installer",
"p3.b":"Minuteur de récupération, EMOM, AMRAP et chrono",
"p3.c":"Images « comment faire » pour plus de 230 exercices",
"p3.d":"Le client note ses charges et ses répétitions",
"prog.eyebrow":"Programmez",
"prog.title":"Les méthodes que vous utilisez. Dans un seul programme.",
"prog.sub":"Superset, EMOM, Hyrox. Écrivez la séance comme vous la pensez : PT Board la transforme en un PDF clair et en un programme sur le téléphone du client.",
"blk.sup":"2 exercices, puis récupération",
"blk.cirName":"Circuit",
"blk.cir":"stations × tours",
"blk.emom":"une station par minute",
"blk.amrap":"le plus de tours possible",
"blk.hyrox":"tours sans pause",
"blk.fin":"une fin intense",
"prog.a":"Charges, notes et progression là où il faut.",
"prog.b":"Échauffement et retour au calme à chaque séance.",
"prog.c":"La durée de chaque séance, calculée pour vous.",
"prog.d":"Votre logo sur chaque PDF.",
"cli.eyebrow":"Suivez",
"cli.title":"Vous n'êtes pas en salle. Votre programme, si.",
"cli.sub":"Un lien, aucune app à installer. Le client ouvre la séance du jour et s'entraîne avec votre méthode : minuteurs, images des exercices, charges à noter.",
"cli.a":"Sur tous les téléphones, sans inscription.",
"cli.b":"Minuteurs EMOM et AMRAP, récupérations qui sonnent.",
"cli.c":"Images de plus de 230 exercices, pour bien les faire.",
"cli.d":"Vous changez le programme, son lien se met à jour.",
"gym.eyebrow":"Pour les salles",
"gym.title":"Une équipe. Un standard.",
"gym.sub":"Avec l'Espace Salle, chaque coach travaille avec les mêmes clients, les mêmes modèles et la marque de votre salle.",
"gym.at":"Clients partagés",
"gym.a":"Chaque coach peut suivre chaque adhérent.",
"gym.bt":"Modèles communs",
"gym.b":"Vos meilleurs programmes, pour toute l'équipe.",
"gym.ct":"Votre marque",
"gym.c":"Logo et couleurs sur l'app, les PDF et le téléphone du client.",
"gym.dt":"Nouveaux adhérents",
"gym.d":"Évaluation rapide, programme prêt en quelques minutes.",
"pr.eyebrow":"Tarifs",
"pr.title":"Simple, comme il se doit.",
"pr.sub":"Commencez avec 15 jours gratuits. Résiliez quand vous voulez. Vos données restent les vôtres.",
"pr.month":"/ mois",
"pr.month2":"/ mois",
"pr.proSub":"ou 7,99 € par mois en annuel (95,88 € par an)",
"pr.pro1":"Clients illimités",
"pr.pro2":"Évaluation, générateur et programmes",
"pr.pro3":"Lien client avec minuteurs",
"pr.pro4":"PDF avec votre logo",
"pr.proBtn":"Commencer avec Pro",
"pr.teamBadge":"Pour les studios",
"pr.teamSub":"jusqu'à 3 coachs · 15,99 € par mois en annuel",
"pr.team1":"Tout ce qu'il y a dans Pro",
"pr.team2":"Jusqu'à 3 coachs",
"pr.team3":"Modèles partagés entre vous",
"pr.teamBtn":"Commencer avec Team",
"pr.gymName":"Salle",
"pr.gymAmt":"Sur mesure",
"pr.gymSub":"Une offre construite selon le nombre de coachs et d'adhérents.",
"pr.gym1":"Tous les coachs de la salle",
"pr.gym2":"Clients et modèles partagés",
"pr.gym3":"La marque de la salle",
"pr.gym4":"Support dédié",
"pr.gymBtn":"Parlons-en",
"num.eyebrow":"PT Board en chiffres",
"num.title":"Créé par des coachs sportifs, pour les coachs sportifs.",
"num.sub":"Né du terrain. Chaque test et chaque calcul vient de la littérature scientifique.",
"num.a":"exercices dans la bibliothèque, la plupart avec les images « comment faire »",
"num.b":"types de blocs : superset, circuit, EMOM, AMRAP, Hyrox, finisher",
"num.c":"langues : italien, anglais, français",
"num.refs":"Tests et calculs basés sur <b>ACSM</b> · <b>NSCA</b> · <b>ERS/ATS 2014</b> (6MWT) · <b>Rikli &amp; Jones</b> (assis-debout) · <b>ISSN 2017</b> (nutrition) · <b>Schoenfeld</b> (volume et récupération)",
"early.eyebrow":"Programme Premiers coachs",
"early.text":"<b>Commencez maintenant et grandissez avec nous.</b> Un support direct de notre équipe et vos demandes dans les prochaines versions.",
"faq.eyebrow":"Questions fréquentes",
"faq.title":"Des questions ? Des réponses.",
"faq.q1":"Le client doit-il installer une app ?",
"faq.a1":"Non. Il reçoit un lien et l'ouvre sur son téléphone. S'il le souhaite, il peut l'ajouter à son écran d'accueil.",
"faq.q2":"Puis-je utiliser mes propres programmes ?",
"faq.a2":"Oui. Écrivez-les dans l'éditeur, importez-les depuis un fichier ou partez d'un modèle. Le générateur automatique est une aide, pas une obligation.",
"faq.q3":"Les données de mes clients sont-elles en sécurité ?",
"faq.a3":"Elles sont enregistrées sur Google Firebase et vous seul pouvez les voir. Aucune donnée client ne va dans les modèles partagés.",
"faq.q4":"Ça marche sur tablette et ordinateur ?",
"faq.a4":"Oui, dans le navigateur de n'importe quel appareil. Vous pouvez l'installer comme une app sur votre téléphone.",
"faq.q5":"Puis-je résilier ?",
"faq.a5":"Quand vous voulez. Vous gardez votre formule jusqu'à la fin de la période payée et vous pouvez exporter toutes vos données.",
"final.title":"Votre prochain client commence ici.",
"final.lead":"Créez son programme aujourd'hui. Demain, il l'ouvre en salle.",
"foot.blog":"Blog",
"foot.privacy":"Confidentialité",
"foot.terms":"Conditions",
"foot.login":"Se connecter"
}
};

var TR_ORIG={};
function detectLang(){
  var s=null;try{s=localStorage.getItem('pt_landing_lang');}catch(e){}
  if(s==='it'||TR[s])return s;
  var n=(navigator.language||'it').slice(0,2).toLowerCase();
  return TR[n]?n:'it';
}
function trTesto(lang,k,orig){
  if(lang==='it')return orig;
  var t=TR[lang]&&TR[lang][k];
  return (t!==undefined&&t!==null)?t:orig;
}
function applyLang(lang){
  if(lang!=='it'&&!TR[lang])lang='it';
  document.documentElement.lang=lang;
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    var k=el.getAttribute('data-i18n');
    if(!(k in TR_ORIG))TR_ORIG[k]=el.innerHTML;
    el.innerHTML=trTesto(lang,k,TR_ORIG[k]);
  });
  document.querySelectorAll('[data-i18n-alt]').forEach(function(el){
    var k=el.getAttribute('data-i18n-alt'),o='__alt__'+k;
    if(!(o in TR_ORIG))TR_ORIG[o]=el.getAttribute('alt')||'';
    el.setAttribute('alt',trTesto(lang,k,TR_ORIG[o]));
  });
  document.querySelectorAll('[data-i18n-src]').forEach(function(el){
    var k=el.getAttribute('data-i18n-src'),o='__src__'+k;
    if(!(o in TR_ORIG))TR_ORIG[o]=el.getAttribute('src')||'';
    el.setAttribute('src',trTesto(lang,k,TR_ORIG[o]));
  });
  // Titolo e descrizione della pagina.
  if(!('__title' in TR_ORIG))TR_ORIG.__title=document.title;
  document.title=trTesto(lang,'meta.title',TR_ORIG.__title);
  var md=document.querySelector('meta[name="description"]');
  if(md){if(!('__desc' in TR_ORIG))TR_ORIG.__desc=md.getAttribute('content')||'';md.setAttribute('content',trTesto(lang,'meta.desc',TR_ORIG.__desc));}
  document.querySelectorAll('.lang button[data-lang]').forEach(function(b){
    b.setAttribute('aria-pressed',b.getAttribute('data-lang')===lang?'true':'false');
  });
}
function setLang(lang){
  try{localStorage.setItem('pt_landing_lang',lang);}catch(e){}
  applyLang(lang);
}
function initI18n(){
  document.querySelectorAll('.lang button[data-lang]').forEach(function(b){
    b.addEventListener('click',function(){setLang(b.getAttribute('data-lang'));});
  });
  applyLang(detectLang());
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initI18n);
else initI18n();
