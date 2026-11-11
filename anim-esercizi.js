/* PT Board — "Come si esegue": immagini degli esercizi (RepDB, licenza gratuita con attribuzione).
 * Usato da index.html (app PT) e share.html (link cliente).
 * Immagini in /img/esercizi/<id>-start.webp e <id>-peak.webp (oppure <id>-main.webp per tenute e stretching).
 * Le due posizioni si alternano con una dissolvenza.
 * Licenza RepDB (free tier v1.0): uso in app consentito con il link "Exercise data by RepDB (repdb.co)";
 * vietato ridistribuire le immagini come dataset o API. Vedi PTAnim.CREDIT.
 * API globale (stessa di prima):
 *   PTAnim.specFor(ex)            -> id RepDB o null (ex = {id|eId|anim})
 *   PTAnim.has(ex)                -> true se l'esercizio ha le immagini
 *   PTAnim.mount(el, spec, opts)  -> {destroy(), setPlaying(bool)}
 */
(function(){
  'use strict';
  var BASE='/img/esercizi/';
  // id esercizio PT Board -> id RepDB (solo corrispondenze fedeli, verificate una per una).
  var MAP={
    E01:'squat', E02:'box-squat', E03:'goblet-squat', E04:'leg-press', E05:'bulgarian-split-squat', E07:'glute-bridge',
    E08:'hip-thrust', E09:'lunge', E10:'step-ups', E11:'romanian-deadlift', E12:'bodyweight-good-morning', E13:'good-morning',
    E14:'leg-curl', E15:'nordic-hamstring-curl', E16:'push-up', E17:'wall-push-ups', E18:'knee-push-ups', E19:'db-bench-press',
    E20:'bench-press', E21:'db-fly', E22:'dips', E23:'single-arm-db-row', E24:'lat-pulldown', E25:'pull-up',
    E26:'seated-cable-row', E28:'barbell-row', E29:'dumbbell-shoulder-press', E30:'lateral-raise', E31:'face-pull', E32:'arnold-press',
    E33:'db-shrug', E34:'bicep-curl', E35:'barbell-curl', E36:'hammer-curl', E37:'concentration-curl', E38:'skull-crusher',
    E39:'tricep-pushdown', E40:'bench-dips', E41:'tricep-kickback', E42:'standing-calf-raise', E43:'seated-calf-raise', E44:'plank',
    E45:'dead-bug', E46:'mountain-climbers', E47:'crunches', E48:'russian-twist', E49:'cable-pallof-press', E50:'bird-dog',
    E51:'ab-wheel-rollout', E52:'side-plank', E53:'hollow-body-hold', E54:'walking', E55:'stationary-bike', E56:'running',
    E57:'rowing-machine', E58:'jumping-jacks', E59:'burpees', E60:'jump-rope', E61:'cat-cow', E62:'kneeling-hip-flexor-stretch',
    E63:'90-90-hold', E64:'worlds-greatest-stretch', E66:'chest-press-machine', E67:'incline-db-press', E68:'cable-fly', E69:'pec-deck',
    E71:'db-pullover', E72:'ohp', E73:'machine-shoulder-press', E74:'machine-reverse-fly', E75:'cable-curl', E76:'machine-triceps-extension',
    E77:'sumo-squat', E78:'leg-extension', E79:'dumbbell-romanian-deadlift', E80:'cable-kickback', E82:'hip-adduction', E83:'hip-abduction',
    E84:'standing-hip-abduction', E85:'machine-seated-crunch', E86:'hanging-leg-raise', E87:'treadmill-running', E88:'elliptical-trainer', E89:'stationary-bike',
    E90:'incline-treadmill-walk', E91:'jump-squat', E92:'bodyweight-calf-raise', E93:'single-leg-calf-raise', E94:'pull-up', E95:'inverted-row',
    E96:'superman', E97:'chin-ups', E99:'diamond-push-ups', E100:'bench-dips', E101:'pike-push-ups', E103:'glute-kickback',
    E104:'single-leg-glute-bridge', E105:'front-squat', E106:'hack-squat', E107:'pistol-squat', E108:'wall-sit', E109:'cossack-squat',
    E110:'reverse-lunge', E111:'walking-lunge', E112:'side-lunge', E115:'deadlift', E116:'sumo-deadlift', E117:'hex-bar-deadlift',
    E118:'stiff-leg-deadlift', E119:'single-leg-romanian-deadlift', E120:'kettlebell-swing', E122:'back-extension', E123:'back-extension', E125:'banded-seated-hip-abduction',
    E127:'cable-pull-through', E129:'fire-hydrant', E130:'donkey-calf-raise', E131:'smith-machine-calf-raise', E133:'incline-bench-press', E134:'decline-bench-press-barbell',
    E135:'incline-push-ups', E136:'decline-push-up', E138:'svend-press', E139:'floor-press', E141:'archer-push-ups', E142:'plyo-push-up',
    E143:'cable-fly', E145:'t-bar-row', E148:'assisted-pull-ups', E149:'inverted-row', E150:'one-arm-lat-pulldown', E151:'straight-arm-pulldown',
    E152:'renegade-row', E153:'scapular-pull-ups', E154:'dead-hang', E155:'push-press', E156:'handstand-push-ups', E159:'upright-row',
    E160:'dumbbell-front-raise', E161:'dumbbell-reverse-fly', E162:'cable-lateral-raise', E163:'cable-external-rotation', E165:'preacher-curl', E166:'spider-curl',
    E167:'zottman-curl', E168:'barbell-curl', E169:'cross-body-hammer-curl', E170:'incline-db-curl', E171:'drag-curl', E172:'reverse-curl',
    E173:'lying-tricep-extension', E174:'close-grip-bench-press', E175:'tricep-pushdown', E177:'cable-overhead-tricep-extension', E180:'v-ups', E181:'toes-to-bar',
    E183:'reverse-crunches', E184:'bicycle-crunch', E185:'copenhagen-plank', E186:'suitcase-carry', E187:'hanging-knee-raise', E188:'l-sit',
    E191:'plank', E192:'cable-crunch', E193:'decline-crunch', E194:'battle-ropes', E195:'sled-push', E197:'dumbbell-farmers-walk',
    E198:'air-bike', E199:'stair-climber', E200:'high-knees', E201:'heel-flicks', E203:'bear-crawl', E205:'cycling',
    E206:'jump-squat', E207:'box-jump', E212:'medicine-ball-slam', E214:'medicine-ball-side-throw', E215:'kettlebell-turkish-get-ups', E216:'dumbbell-clean-and-press',
    E217:'thruster', E218:'wall-ball', E219:'dumbbell-snatch', E220:'goblet-squat', E222:'sandbag-carry', E224:'standing-quad-stretch',
    E225:'pigeon-stretch', E227:'bench-couch-stretch', E228:'childs-pose', E229:'downward-dog', E231:'cat-cow', E232:'supine-spinal-twist',
    E235:'cobra-stretch', E236:'butterfly-stretch', E237:'lizard-stretch', E238:'doorway-chest-stretch', E239:'bird-dog-hold', E242:'clamshells',
    E246:'heel-to-toe-walk', E250:'running', E254:'clap-push-ups', E255:'chest-supported-machine-row', E256:'lat-pulldown', E257:'chest-supported-machine-row',
    E258:'machine-bicep-curl', E259:'assisted-dips', E260:'seated-leg-curl', E261:'leg-curl', E264:'machine-back-extension', E266:'machine-calf-raise',
    E267:'horizontal-leg-press', E270:'chest-supported-machine-row', E271:'lat-pulldown', E272:'machine-shoulder-press', E275:'plate-loaded-glute-drive', E276:'smith-machine-squat',
    E277:'smith-machine-bench-press', E278:'smith-machine-split-squat', E279:'smith-machine-shoulder-press', E280:'one-arm-seated-cable-row', E281:'cable-reverse-fly', E282:'cable-chest-press',
    E287:'cable-front-raise', E288:'cable-tricep-kickback', E289:'cable-hammer-curl', E290:'wide-grip-seated-cable-row', E292:'landmine-press', E295:'captains-chair-knee-raise',
    E300:'plate-loaded-shrug', E301:'plate-loaded-lateral-raise', E302:'treadmill-running', E305:'ski-erg'
  };
  // id RepDB -> numero di immagini (2 = partenza/arrivo, 1 = posizione unica).
  var FRAMES={
    '90-90-hold':1, 'ab-wheel-rollout':2, 'air-bike':1, 'archer-push-ups':2, 'arnold-press':2,
    'assisted-dips':2, 'assisted-pull-ups':2, 'back-extension':2, 'banded-seated-hip-abduction':2, 'barbell-curl':2,
    'barbell-row':2, 'battle-ropes':1, 'bear-crawl':2, 'bench-couch-stretch':1, 'bench-dips':2,
    'bench-press':2, 'bicep-curl':2, 'bicycle-crunch':2, 'bird-dog':2, 'bird-dog-hold':1,
    'bodyweight-calf-raise':2, 'bodyweight-good-morning':2, 'box-jump':2, 'box-squat':2, 'bulgarian-split-squat':2,
    'burpees':1, 'butterfly-stretch':1, 'cable-chest-press':2, 'cable-crunch':2, 'cable-curl':2,
    'cable-external-rotation':2, 'cable-fly':2, 'cable-front-raise':2, 'cable-hammer-curl':2, 'cable-kickback':2,
    'cable-lateral-raise':2, 'cable-overhead-tricep-extension':2, 'cable-pallof-press':2, 'cable-pull-through':2, 'cable-reverse-fly':2,
    'cable-tricep-kickback':2, 'captains-chair-knee-raise':2, 'cat-cow':1, 'chest-press-machine':2, 'chest-supported-machine-row':2,
    'childs-pose':1, 'chin-ups':2, 'clamshells':2, 'clap-push-ups':2, 'close-grip-bench-press':2,
    'cobra-stretch':1, 'concentration-curl':2, 'copenhagen-plank':1, 'cossack-squat':2, 'cross-body-hammer-curl':2,
    'crunches':2, 'cycling':1, 'db-bench-press':2, 'db-fly':2, 'db-pullover':2,
    'db-shrug':2, 'dead-bug':2, 'dead-hang':1, 'deadlift':2, 'decline-bench-press-barbell':2,
    'decline-crunch':2, 'decline-push-up':2, 'diamond-push-ups':2, 'dips':2, 'donkey-calf-raise':2,
    'doorway-chest-stretch':1, 'downward-dog':1, 'drag-curl':2, 'dumbbell-clean-and-press':2, 'dumbbell-farmers-walk':1,
    'dumbbell-front-raise':2, 'dumbbell-reverse-fly':2, 'dumbbell-romanian-deadlift':2, 'dumbbell-shoulder-press':2, 'dumbbell-snatch':2,
    'elliptical-trainer':1, 'face-pull':2, 'fire-hydrant':2, 'floor-press':2, 'front-squat':2,
    'glute-bridge':2, 'glute-kickback':2, 'goblet-squat':2, 'good-morning':2, 'hack-squat':2,
    'hammer-curl':2, 'handstand-push-ups':2, 'hanging-knee-raise':2, 'hanging-leg-raise':2, 'heel-flicks':1,
    'heel-to-toe-walk':1, 'hex-bar-deadlift':2, 'high-knees':1, 'hip-abduction':2, 'hip-adduction':2,
    'hip-thrust':2, 'hollow-body-hold':1, 'horizontal-leg-press':2, 'incline-bench-press':2, 'incline-db-curl':2,
    'incline-db-press':2, 'incline-push-ups':2, 'incline-treadmill-walk':1, 'inverted-row':2, 'jump-rope':1,
    'jump-squat':2, 'jumping-jacks':2, 'kettlebell-swing':2, 'kettlebell-turkish-get-ups':2, 'knee-push-ups':2,
    'kneeling-hip-flexor-stretch':1, 'l-sit':1, 'landmine-press':2, 'lat-pulldown':2, 'lateral-raise':2,
    'leg-curl':2, 'leg-extension':2, 'leg-press':2, 'lizard-stretch':1, 'lunge':2,
    'lying-tricep-extension':2, 'machine-back-extension':2, 'machine-bicep-curl':2, 'machine-calf-raise':2, 'machine-reverse-fly':2,
    'machine-seated-crunch':2, 'machine-shoulder-press':2, 'machine-triceps-extension':2, 'medicine-ball-side-throw':2, 'medicine-ball-slam':2,
    'mountain-climbers':2, 'nordic-hamstring-curl':2, 'ohp':2, 'one-arm-lat-pulldown':2, 'one-arm-seated-cable-row':2,
    'pec-deck':2, 'pigeon-stretch':1, 'pike-push-ups':2, 'pistol-squat':2, 'plank':1,
    'plate-loaded-glute-drive':2, 'plate-loaded-lateral-raise':2, 'plate-loaded-shrug':2, 'plyo-push-up':2, 'preacher-curl':2,
    'pull-up':2, 'push-press':2, 'push-up':2, 'renegade-row':2, 'reverse-crunches':2,
    'reverse-curl':2, 'reverse-lunge':2, 'romanian-deadlift':2, 'rowing-machine':2, 'running':1,
    'russian-twist':2, 'sandbag-carry':1, 'scapular-pull-ups':2, 'seated-cable-row':2, 'seated-calf-raise':2,
    'seated-leg-curl':2, 'side-lunge':2, 'side-plank':1, 'single-arm-db-row':2, 'single-leg-calf-raise':2,
    'single-leg-glute-bridge':2, 'single-leg-romanian-deadlift':2, 'ski-erg':2, 'skull-crusher':2, 'sled-push':1,
    'smith-machine-bench-press':2, 'smith-machine-calf-raise':2, 'smith-machine-shoulder-press':2, 'smith-machine-split-squat':2, 'smith-machine-squat':2,
    'spider-curl':2, 'squat':2, 'stair-climber':1, 'standing-calf-raise':2, 'standing-hip-abduction':2,
    'standing-quad-stretch':1, 'stationary-bike':1, 'step-ups':2, 'stiff-leg-deadlift':2, 'straight-arm-pulldown':2,
    'suitcase-carry':1, 'sumo-deadlift':2, 'sumo-squat':2, 'superman':2, 'supine-spinal-twist':1,
    'svend-press':2, 't-bar-row':2, 'thruster':2, 'toes-to-bar':2, 'treadmill-running':1,
    'tricep-kickback':2, 'tricep-pushdown':2, 'upright-row':2, 'v-ups':2, 'walking':1,
    'walking-lunge':2, 'wall-ball':1, 'wall-push-ups':2, 'wall-sit':1, 'wide-grip-seated-cable-row':2,
    'worlds-greatest-stretch':2, 'zottman-curl':2
  };
  var CREDIT={text:'Exercise data by RepDB (repdb.co)',url:'https://repdb.co'};
  function specFor(ex){
    if(!ex) return null;
    if(typeof ex==='string') return MAP[ex]||(FRAMES[ex]?ex:null);
    if(ex.anim) return FRAMES[ex.anim]?ex.anim:null;
    var id=ex.eId||ex.id;
    return (id&&MAP[id])||null;
  }
  function has(ex){var s=specFor(ex);return !!(s&&FRAMES[s]);}
  function urls(spec){return FRAMES[spec]===1?[BASE+spec+'-main.webp']:[BASE+spec+'-start.webp',BASE+spec+'-peak.webp'];}
  function mount(el,spec,opts){
    var noop={destroy:function(){},setPlaying:function(){}};
    if(!el||!spec||!FRAMES[spec]) return noop;
    opts=opts||{};
    var box=document.createElement('div');
    box.style.cssText='position:relative;width:100%;aspect-ratio:1/1;overflow:hidden;background:#e9f1f8';
    var list=urls(spec),imgs=list.map(function(u,i){
      var im=document.createElement('img');im.src=u;im.alt=(opts.label||'')+(list.length>1?(i?' – arrivo':' – partenza'):'');
      im.decoding='async';im.loading='lazy';
      im.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:contain;transition:opacity .6s ease;opacity:'+(i?0:1);
      box.appendChild(im);return im;
    });
    el.appendChild(box);
    var reduce=false;try{reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}
    var playing=opts.playing!=null?!!opts.playing:!reduce,show=0,timer=0;
    function tick(){if(!box.isConnected){clearInterval(timer);return;}if(!playing||imgs.length<2) return;show=1-show;imgs[1].style.opacity=show?1:0;}
    if(imgs.length>1) timer=setInterval(tick,1400);
    return {
      destroy:function(){clearInterval(timer);if(box.parentNode) box.parentNode.removeChild(box);},
      setPlaying:function(v){playing=!!v;}
    };
  }
  window.PTAnim={specFor:specFor,has:has,mount:mount,urls:urls,MAP:MAP,FRAMES:FRAMES,CREDIT:CREDIT};
})();
