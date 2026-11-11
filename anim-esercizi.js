/* PT Board — animazioni degli esercizi (vettoriali, nessuna dipendenza).
 * Usato da index.html (app PT) e share.html (link cliente).
 * API globale:
 *   PTAnim.specFor(ex)            -> stringa 'schema:attrezzo:variante' o null (ex = {id|eId, ...})
 *   PTAnim.has(ex)                -> true se l'esercizio ha un'animazione
 *   PTAnim.mount(el, spec, opts)  -> {destroy(), setPlaying(bool)}; disegna un <svg> dentro el
 * Figura vista di lato, rivolta a destra. Angoli in gradi dall'alto, positivi verso destra.
 * La parte colorata indica i muscoli principali. Nessun testo dentro le animazioni (nessuna lingua).
 */
(function(){
  'use strict';
  var NS='http://www.w3.org/2000/svg';
  var G=212; // suolo
  var L={shin:52,thigh:54,torso:62,upper:36,fore:32,foot:18};

  // ── Geometria ──
  function R(d){return d*Math.PI/180;}
  function P(b,l,d){return {x:b.x+l*Math.sin(R(d)),y:b.y-l*Math.cos(R(d))};}
  function lerp(a,b,t){return a+(b-a)*t;}
  function lp(a,b,t){return {x:lerp(a.x,b.x,t),y:lerp(a.y,b.y,t)};}
  function ease(t){return 0.5-0.5*Math.cos(Math.PI*Math.max(0,Math.min(1,t)));}
  function degOf(a,b){return Math.atan2(b.x-a.x,-(b.y-a.y))*180/Math.PI;}
  function ik(S,H,l1,l2,pick){
    var dx=H.x-S.x,dy=H.y-S.y,d=Math.hypot(dx,dy);
    d=Math.max(Math.abs(l1-l2)+0.01,Math.min(d,l1+l2-0.01));
    var base=Math.atan2(dy,dx),c=(l1*l1+d*d-l2*l2)/(2*l1*d),a=Math.acos(Math.max(-1,Math.min(1,c)));
    var e1={x:S.x+l1*Math.cos(base+a),y:S.y+l1*Math.sin(base+a)},e2={x:S.x+l1*Math.cos(base-a),y:S.y+l1*Math.sin(base-a)};
    return pick(e1,e2);
  }
  var UP=function(a,b){return a.y<b.y?a:b;},DOWN=function(a,b){return a.y>b.y?a:b;},
      LEFT=function(a,b){return a.x<b.x?a:b;},RIGHT=function(a,b){return a.x>b.x?a:b;};
  function legIK(hip,ankle,pick){return ik(hip,ankle,L.thigh,L.shin,pick);}
  function armIK(sh,hand,pick){return ik(sh,hand,L.upper,L.fore,pick);}
  // Gamba "diritta" per angoli assoluti di stinco e coscia, dal basso (caviglia) all'alto (anca).
  function legUp(ankle,shinDeg,thighDeg){var k=P(ankle,L.shin,shinDeg);return {ankle:ankle,knee:k,hip:P(k,L.thigh,thighDeg)};}
  // Gamba dall'alto (anca) verso il basso.
  function legDown(hip,thighDeg,shinDeg){var k=P(hip,L.thigh,thighDeg);return {hip:hip,knee:k,ankle:P(k,L.shin,shinDeg)};}
  function arm(sh,upperDeg,foreDeg){var e=P(sh,L.upper,upperDeg);return {elb:e,hand:P(e,L.fore,foreDeg)};}
  function armTo(sh,hand,pick){return {elb:armIK(sh,hand,pick),hand:hand};}
  function foot(leg,deg){leg.toe=P(leg.ankle,L.foot,deg);return leg;}
  function flatFoot(leg){leg.toe={x:leg.ankle.x+L.foot,y:G-3};return leg;}

  // ── Disegno (markup SVG) ──
  function f1(n){return Math.round(n*10)/10;}
  function line(a,b,w,col,op){return '<line x1="'+f1(a.x)+'" y1="'+f1(a.y)+'" x2="'+f1(b.x)+'" y2="'+f1(b.y)+'" stroke-width="'+w+'" stroke-linecap="round" style="stroke:'+col+'"'+(op?' opacity="'+op+'"':'')+'/>';}
  function circ(c,r,col,op){return '<circle cx="'+f1(c.x)+'" cy="'+f1(c.y)+'" r="'+r+'" style="fill:'+col+'"'+(op?' opacity="'+op+'"':'')+'/>';}
  function rect(x,y,w,h,col,rx){return '<rect x="'+f1(x)+'" y="'+f1(y)+'" width="'+f1(w)+'" height="'+f1(h)+'" rx="'+(rx||2)+'" style="fill:'+col+'"/>';}
  function poly(pts,col){return '<polygon points="'+pts.map(function(p){return f1(p.x)+','+f1(p.y);}).join(' ')+'" style="fill:'+col+'"/>';}

  // Attrezzi: pesi nel colore della figura, strutture nel colore "attrezzo".
  function propMarkup(pr,C){
    switch(pr.t){
      case 'plate': return circ(pr.c,pr.r||16,C.fig)+circ(pr.c,(pr.r||16)*0.28,C.bg);
      case 'db': return circ(pr.c,7,C.fig)+circ(pr.c,2.6,C.bg);
      case 'kb': return circ({x:pr.c.x,y:pr.c.y+7},9,C.fig)+'<circle cx="'+f1(pr.c.x)+'" cy="'+f1(pr.c.y-1)+'" r="5" style="fill:none;stroke:'+C.fig+'" stroke-width="2.5"/>';
      case 'rect': return rect(pr.x,pr.y,pr.w,pr.h,C.prop,pr.rx);
      case 'line': return line(pr.a,pr.b,pr.w||4,C.prop);
      case 'cable': return line(pr.a,pr.b,1.6,C.prop);
      case 'ring': return '<circle cx="'+f1(pr.c.x)+'" cy="'+f1(pr.c.y)+'" r="'+pr.r+'" style="fill:none;stroke:'+C.prop+'" stroke-width="'+(pr.w||4)+'"/>';
      case 'dot': return circ(pr.c,pr.r||4,C.prop);
      case 'poly': return poly(pr.pts,C.prop);
    }
    return '';
  }
  function norm(a,b){var dx=b.x-a.x,dy=b.y-a.y,l=Math.hypot(dx,dy)||1;return {x:dx/l,y:dy/l};}
  // Tratto evidenziato parallelo a un segmento (da a=distale verso b=prossimale), lato fronte (+1) o retro (-1).
  function overlay(a,b,t0,t1,side,off,w,col){
    var d=norm(a,b),n={x:-d.y*side,y:d.x*side},p0=lp(a,b,t0),p1=lp(a,b,t1);
    return line({x:p0.x+n.x*off,y:p0.y+n.y*off},{x:p1.x+n.x*off,y:p1.y+n.y*off},w,col);
  }
  function sideFigure(po,hl,C){
    var fs=po.fs||1,s='';
    var has=function(k){return hl.indexOf(k)!==-1;};
    var col=function(k){return has(k)?C.acc:C.fig;};
    var lf=po.f,lb=po.b,af=po.aF,ab=po.aB;
    var offL=po.offL||{x:-5,y:-1},offA=po.offA||{x:-4,y:-1};
    function sh(p,o){return {x:p.x+o.x,y:p.y+o.y};}
    if(!lb&&lf) lb={hip:sh(lf.hip,offL),knee:sh(lf.knee,offL),ankle:sh(lf.ankle,offL),toe:lf.toe?sh(lf.toe,offL):null};
    if(!ab&&af&&!po.oneArm) ab={elb:sh(af.elb,offA),hand:sh(af.hand,offA)};
    var hip=lf?lf.hip:po.hip;
    // arti lontani
    if(lb){ if(lb.toe) s+=line(lb.ankle,lb.toe,7,C.fig,0.32); s+=line(lb.ankle,lb.knee,11,col('shin'),0.32)+line(lb.knee,lb.hip,14,col('thigh'),0.32); }
    if(ab&&!po.armsBehind){ s+=line(po.sh,ab.elb,9,col('upper'),0.32)+line(ab.elb,ab.hand,8,col('fore'),0.32); }
    if(po.propsMid) po.propsMid.forEach(function(pr){s+=propMarkup(pr,C);});
    // busto e testa
    s+=line(hip,po.sh,22,col('torso'));
    if(has('chest')) s+=overlay(hip,po.sh,0.58,0.9,fs,6,9,C.acc);
    if(has('abs')) s+=overlay(hip,po.sh,0.15,0.55,fs,6,9,C.acc);
    if(has('back')) s+=overlay(hip,po.sh,0.4,0.9,-fs,6,9,C.acc);
    if(has('glute')){var d=norm(hip,po.sh);s+=circ({x:hip.x+d.y*fs*5,y:hip.y-d.x*fs*5},8,C.acc);}
    var hd=po.headDeg!=null?po.headDeg:degOf(hip,po.sh);
    s+=line(po.sh,P(po.sh,9,hd),8,has('neck')?C.acc:C.fig)+circ(P(po.sh,21,hd),12,C.fig);
    if(has('delt')) s+=circ(po.sh,7,C.acc);
    // arti vicini
    if(lf){ if(lf.toe) s+=line(lf.ankle,lf.toe,7,C.fig); s+=line(lf.ankle,lf.knee,11,col('shin'))+line(lf.knee,lf.hip,14,col('thigh'));
      if(has('hams')) s+=overlay(lf.knee,lf.hip,0.15,0.85,-fs,5,6,C.acc); }
    if(ab&&po.armsBehind){ s+=line(po.sh,ab.elb,9,col('upper'),0.32)+line(ab.elb,ab.hand,8,col('fore'),0.32); }
    if(af){ s+=line(po.sh,af.elb,9,col('upper'))+line(af.elb,af.hand,8,col('fore')); }
    return s;
  }
  // Figura frontale (alzate laterali, jumping jack).
  function frontFigure(po,hl,C){
    var s='',has=function(k){return hl.indexOf(k)!==-1;};
    var cx=150,dy=po.dy||0;
    var hipL={x:cx-11,y:110+dy},hipR={x:cx+11,y:110+dy},shL={x:cx-19,y:52+dy},shR={x:cx+19,y:52+dy};
    function legF(hip,ax){var ank={x:ax,y:G-8};var k=lp(hip,ank,0.5);return line(hip,k,14,C.fig)+line(k,ank,11,C.fig)+line(ank,{x:ank.x+(ax<cx?-9:9),y:G-3},7,C.fig);}
    s+=legF(hipL,cx-po.feet)+legF(hipR,cx+po.feet);
    s+=line({x:cx,y:108+dy},{x:cx,y:58+dy},30,C.fig);
    s+=line({x:cx,y:50+dy},{x:cx,y:41+dy},8,C.fig)+circ({x:cx,y:29+dy},12,C.fig);
    function armF(sh,deg,mir){var e=P(sh,L.upper,mir*deg),h=P(e,L.fore,mir*(deg-6));return {s:line(sh,e,9,C.fig)+line(e,h,8,C.fig),h:h};}
    var aL=armF(shL,po.arm,-1),aR=armF(shR,po.arm,1);
    s+=aL.s+aR.s;
    if(has('delt')) s+=circ(shL,7,C.acc)+circ(shR,7,C.acc);
    if(po.db){s+=propMarkup({t:'db',c:aL.h},C)+propMarkup({t:'db',c:aR.h},C);}
    return s;
  }

  // ── Temporizzazione ──
  // seq: lista di fasi [durata s, p iniziale, p finale]. Ping-pong standard: pausa, eccentrica, pausa, concentrica.
  function PP(ecc,conc,h0,h1){return [[h0==null?0.4:h0,0,0],[ecc,0,1],[h1==null?0.3:h1,1,1],[conc,1,0]];}
  function seqAt(seq,time){
    var tot=0;seq.forEach(function(s){tot+=s[0];});
    var x=time%tot;
    for(var i=0;i<seq.length;i++){var s=seq[i];if(x<=s[0]||i===seq.length-1){var k=s[0]?x/s[0]:1;return {p:lerp(s[1],s[2],s[3]==='lin'?k:ease(k)),i:i,k:k};}x-=s[0];}
    return {p:0,i:0,k:0};
  }

  // ── Schemi di movimento ──
  // Ogni schema: {seq, hl:[muscoli], view:'side'|'front', pose(p, o, st)} con o={prop,v}.
  var S={};
  var A0={x:146,y:G-6};

  function propsInHands(po,o,both){
    var pr=[];
    if(o.prop==='db'){pr.push({t:'db',c:po.aF.hand});}
    if(o.prop==='kb'){pr.push({t:'kb',c:po.aF.hand});}
    if(o.prop==='bar'){pr.push({t:'plate',c:po.aF.hand,r:15});}
    return pr;
  }

  S.squat={seq:PP(2,1),hl:['thigh','glute'],pose:function(p,o){
    var shin=lerp(0,32,p),thigh=lerp(0,-79,p),torso=lerp(3,o.prop==='bar'||o.prop==='barfront'?30:38,p);
    if(o.v==='chair'){thigh=lerp(0,-74,p);shin=lerp(0,22,p);torso=lerp(3,40,p);}
    var lg=flatFoot(legUp(A0,shin,thigh)),sh=P(lg.hip,L.torso,torso),po={f:lg,sh:sh,headDeg:torso*0.5,props:[],propsBack:[]};
    if(o.prop==='db'||o.prop==='kb'){var h=P(lg.hip,L.torso*0.8,torso);h={x:h.x+Math.cos(R(torso))*16,y:h.y+Math.sin(R(torso))*16};po.aF=armTo(sh,h,DOWN);po.props=propsInHands(po,o);}
    else if(o.prop==='bar'){var b=P(sh,6,torso-90);po.aF=armTo(sh,b,DOWN);po.props=[{t:'plate',c:b,r:15}];}
    else if(o.prop==='barfront'){var bf=P(sh,15,torso+108);po.aF=armTo(sh,bf,DOWN);po.props=[{t:'plate',c:bf,r:13}];}
    else {var ad=lerp(178,86,p);po.aF=arm(sh,ad,ad-4);}
    if(o.v==='chair'){po.propsBack=[{t:'rect',x:88,y:150,w:40,h:7},{t:'line',a:{x:92,y:157},b:{x:92,y:G},w:4},{t:'line',a:{x:124,y:157},b:{x:124,y:G},w:4},{t:'line',a:{x:90,y:150},b:{x:86,y:96},w:4}];}
    return po;
  }};

  S.lunge={seq:PP(2,1),hl:['thigh','glute'],pose:function(p,o){
    var rfe=o.v==='rfe',fa={x:rfe?178:182,y:G-6},ba=rfe?{x:96,y:162}:{x:104,y:G-16};
    var hip={x:rfe?140:142,y:lerp(rfe?102:110,rfe?150:152,p)};
    var f=flatFoot({hip:hip,ankle:fa,knee:legIK(hip,fa,RIGHT)});
    var b={hip:{x:hip.x-4,y:hip.y-1},ankle:ba};b.knee=legIK(b.hip,ba,DOWN);b.toe=rfe?{x:ba.x-14,y:ba.y-4}:{x:ba.x-13,y:G-3};
    var sh=P(hip,L.torso,lerp(2,8,p)),po={f:f,b:b,sh:sh,headDeg:4};
    if(o.prop==='barback'){var bb=P(sh,6,-90);po.aF=armTo(sh,bb,DOWN);po.props=[{t:'plate',c:bb,r:15}];}
    else {po.aF=arm(sh,178,178);po.props=propsInHands(po,o);}
    if(rfe) po.propsBack=[{t:'rect',x:60,y:166,w:48,h:7},{t:'line',a:{x:66,y:172},b:{x:66,y:G},w:4},{t:'line',a:{x:102,y:172},b:{x:102,y:G},w:4}];
    return po;
  }};

  S.stepup={scale:0.8,seq:PP(1.6,1.2),hl:['thigh','glute'],pose:function(p,o){
    // p=0 in alto sul gradino, p=1 piede dietro a terra.
    var boxTop=186,fa={x:186,y:boxTop-6};
    var hip={x:lerp(180,150,p),y:lerp(boxTop-6-102,128,p)};
    var f={hip:hip,ankle:fa,knee:legIK(hip,fa,RIGHT)};f.toe={x:fa.x+L.foot,y:boxTop-3};
    var ba={x:lerp(178,112,p),y:lerp(boxTop-6,G-6,p)},b={hip:{x:hip.x-4,y:hip.y-1},ankle:ba};b.knee=legIK(b.hip,ba,RIGHT);b.toe={x:ba.x+L.foot,y:ba.y+3};
    var sh=P(hip,L.torso,lerp(2,12,p));
    return {f:f,b:b,sh:sh,headDeg:5,aF:arm(sh,lerp(178,170,p),lerp(178,160,p)),propsBack:[{t:'rect',x:160,y:boxTop,w:66,h:G-boxTop,rx:3}]};
  }};

  function hinge(p,o,bot){
    var shin=lerp(0,bot[0],p),thigh=lerp(0,bot[1],p),torso=lerp(2,bot[2],p);
    var lg=flatFoot(legUp(A0,shin,thigh)),sh=P(lg.hip,L.torso,torso),po={f:lg,sh:sh,headDeg:torso*0.85};
    if(o.prop==='barback'){var bg=P(sh,6,torso-90);po.aF=armTo(sh,bg,DOWN);po.props=[{t:'plate',c:bg,r:15}];return po;}
    var hand={x:sh.x,y:sh.y+66};
    // a busto eretto le mani restano davanti alle cosce
    if(p<0.5) hand.x=Math.max(hand.x,lg.hip.x+10);
    po.aF=armTo(sh,hand,LEFT);
    if(o.prop==='bar') po.props=[{t:'plate',c:{x:hand.x,y:hand.y+6},r:21}];
    else po.props=propsInHands(po,o);
    return po;
  }
  S.rdl={seq:PP(2,1.2),hl:['hams','glute'],pose:function(p,o){return hinge(p,o,[6,-38,72]);}};
  S.deadlift={seq:PP(2,1.2),hl:['hams','glute','back'],pose:function(p,o){
    var shin=lerp(0,24,p),thigh=lerp(0,-70,p),torso=lerp(2,60,p);
    var lg=flatFoot(legUp(A0,shin,thigh)),sh=P(lg.hip,L.torso,torso);
    var hand={x:sh.x,y:sh.y+66};if(hand.x<lg.knee.x+6&&p<0.6) hand.x=lg.knee.x+6;
    var po={f:lg,sh:sh,headDeg:torso*0.8,aF:armTo(sh,hand,LEFT)};
    po.props=[{t:'plate',c:{x:hand.x,y:Math.min(hand.y+8,G-24)},r:23}];return po;
  }};

  S.kbswing={seq:[[0.15,0,0],[0.55,0,1],[0.25,1,1],[0.65,1,0]],hl:['glute','hams'],pose:function(p,o){
    var shin=lerp(10,0,p),thigh=lerp(-42,0,p),torso=lerp(62,0,p);
    var lg=flatFoot(legUp(A0,shin,thigh)),sh=P(lg.hip,L.torso,torso),ad=lerp(196,92,p);
    var po={f:lg,sh:sh,headDeg:torso*0.6,aF:arm(sh,ad,ad)};po.props=[{t:'kb',c:po.aF.hand}];return po;
  }};

  function bridgeCommon(p,sh,ank,lo,hi,fixedHead){
    var a=lerp(lo,hi,p),hip={x:sh.x+L.torso*Math.cos(R(a)),y:sh.y+L.torso*Math.sin(R(a))};
    var f={hip:hip,ankle:ank,knee:legIK(hip,ank,UP)};f.toe={x:ank.x+L.foot,y:G-3};
    return {f:f,hip:hip,sh:sh,headDeg:fixedHead!=null?fixedHead:degOf(hip,sh)+8};
  }
  S.hipthrust={seq:PP(1.6,1),hl:['glute','hams'],pose:function(p,o){
    var po=bridgeCommon(1-p,{x:118,y:160},{x:204,y:G-6},-6,40);
    po.fs=-1;
    var h={x:po.hip.x,y:po.hip.y-14};po.aF=armTo(po.sh,h,UP);
    if(o.prop==='bar') po.props=[{t:'plate',c:{x:po.hip.x,y:po.hip.y-20},r:19}];
    po.propsBack=[{t:'rect',x:72,y:164,w:52,h:8},{t:'line',a:{x:80,y:172},b:{x:80,y:G},w:4},{t:'line',a:{x:116,y:172},b:{x:116,y:G},w:4}];
    return po;
  }};
  S.bridge={seq:PP(1.6,1),hl:['glute','hams'],pose:function(p,o){
    var po=bridgeCommon(1-p,{x:92,y:G-12},{x:192,y:G-6},-30,-3,-92);
    po.fs=-1;po.aF={elb:{x:112,y:G-6},hand:{x:146,y:G-6}};return po;
  }};

  S.calf={seq:PP(1.6,0.9,0.3,0.6),hl:['shin'],pose:function(p,o){
    var toe={x:166,y:G-3},phi=lerp(42,8,p),ank={x:toe.x-L.foot*Math.cos(R(phi)),y:toe.y-L.foot*Math.sin(R(phi))};
    var lg=legUp(ank,0,0);lg.toe=toe;var sh=P(lg.hip,L.torso,2);
    var po={f:lg,sh:sh,headDeg:2,aF:arm(sh,178,178)};po.props=propsInHands(po,o);return po;
  }};

  function plankBody(beta,toeX,anchorKnee){
    var toe={x:toeX,y:G-3},dir=90-beta;
    var ankle=P(toe,15,25),knee=P(ankle,L.shin,dir),hip=P(knee,L.thigh,dir),sh=P(hip,L.torso,dir);
    return {f:{hip:hip,knee:knee,ankle:ankle,toe:toe},sh:sh,dir:dir};
  }
  S.pushup={seq:PP(2,1),hl:['chest','upper'],pose:function(p,o){
    if(o.v==='knee'){
      var knee={x:96,y:G-6},beta=lerp(30,10,p),dir=90-beta,hip=P(knee,L.thigh,dir),sh=P(hip,L.torso,dir);
      var hand0={x:96+(L.thigh+L.torso)*Math.cos(R(30))+2,y:G-4};
      var f={hip:hip,knee:knee,ankle:P(knee,L.shin,-70)};f.toe=P(f.ankle,10,-110);
      return {f:f,sh:sh,headDeg:dir+8,aF:armTo(sh,hand0,LEFT)};
    }
    var b=plankBody(lerp(18,6,p),62),hand={x:plankBody(18,62).sh.x,y:G-4};
    return {f:b.f,sh:b.sh,headDeg:b.dir+8,aF:armTo(b.sh,hand,LEFT),offL:{x:-3,y:-2},offA:{x:-5,y:-2}};
  }};
  S.plank={seq:[[1.6,0,1],[1.6,1,0]],hl:['abs'],pose:function(p,o){
    var b=plankBody(8.5+p*0.8,70),elb={x:b.sh.x,y:G-5};
    return {f:b.f,sh:b.sh,headDeg:b.dir+8,aF:{elb:elb,hand:{x:elb.x+30,y:G-5}},offL:{x:-3,y:-2},offA:{x:-5,y:-1}};
  }};
  S.climber={seq:[[0.9,0,1,'lin']],hl:['abs','thigh'],pose:function(p,o){
    var b=plankBody(18,62),hip=b.f.hip,hand={x:b.sh.x,y:G-4};
    function legAt(q){var k=0.5-0.5*Math.cos(2*Math.PI*q);var ank={x:lerp(b.f.ankle.x,hip.x+36,k),y:lerp(b.f.ankle.y,G-14,k)};
      var l={hip:hip,ankle:ank,knee:legIK(hip,ank,RIGHT)};l.toe=lp(b.f.toe,{x:ank.x+12,y:G-3},k);return l;}
    return {f:legAt(p),b:legAt(p+0.5),sh:b.sh,headDeg:b.dir+8,aF:armTo(b.sh,hand,LEFT),offA:{x:-5,y:-2}};
  }};

  function lying(p,o,inc){
    // Supino sulla panca, testa a destra. inc: inclinazione del busto (90 = piano).
    var hip={x:118,y:inc<90?166:150},dir=inc,sh=P(hip,L.torso,dir);
    var ank={x:84,y:G-6},f={hip:hip,ankle:ank,knee:legIK(hip,ank,UP)};f.toe={x:ank.x+L.foot,y:G-3};
    var bench=inc<90
      ?[{t:'line',a:{x:hip.x-6,y:hip.y+14},b:P({x:hip.x-6,y:hip.y+14},L.torso+14,dir),w:8},{t:'line',a:{x:hip.x-10,y:hip.y+14},b:{x:hip.x-10,y:G},w:4},{t:'line',a:{x:hip.x+30,y:hip.y+2},b:{x:hip.x+30,y:G},w:4}]
      :[{t:'rect',x:hip.x-22,y:hip.y+12,w:L.torso+52,h:7},{t:'line',a:{x:hip.x-14,y:hip.y+19},b:{x:hip.x-14,y:G},w:4},{t:'line',a:{x:hip.x+L.torso+20,y:hip.y+19},b:{x:hip.x+L.torso+20,y:G},w:4}];
    return {f:f,sh:sh,dir:dir,headDeg:dir+(inc<90?-10:0),fs:-1,propsBack:bench};
  }
  S.bench={seq:PP(2,1),hl:['chest','upper'],pose:function(p,o){
    var po=lying(p,o,o.v==='incline'?52:90),sh=po.sh;
    var top={x:sh.x-2,y:sh.y-66},bot=o.v==='incline'?{x:sh.x+6,y:sh.y-16}:{x:sh.x-10,y:sh.y-18};
    var hand=lp(top,bot,p);po.aF=armTo(sh,hand,o.v==='incline'?DOWN:LEFT);
    po.props=o.prop==='bar'?[{t:'plate',c:hand,r:15}]:propsInHands(po,o);return po;
  }};
  S.fly={seq:PP(2,1.2),hl:['chest'],pose:function(p,o){
    var po=lying(p,o,90),sh=po.sh,ad=lerp(-4,-82,p);
    // Vista di lato: le braccia si aprono verso l'esterno, la mano si abbassa verso la panca.
    var len=66*Math.cos(R(lerp(0,70,p))),hand={x:sh.x-2,y:sh.y-len};po.aF={elb:{x:sh.x-1,y:sh.y-len*0.55},hand:hand};
    po.props=[{t:'db',c:hand}];return po;
  }};
  S.skull={seq:PP(2,1),hl:['upper'],pose:function(p,o){
    var po=lying(p,o,90),sh=po.sh,elb={x:sh.x-4,y:sh.y-36};
    var hand=P(elb,L.fore,lerp(-4,128,p));po.aF={elb:elb,hand:hand};
    po.props=[{t:o.prop==='db'?'db':'plate',c:hand,r:12}];return po;
  }};

  S.ohp={seq:PP(1.8,1.2),hl:['delt','upper'],pose:function(p,o){
    var lg=flatFoot(legUp(A0,0,0)),sh=P(lg.hip,L.torso,-3);
    var hand=lp({x:sh.x+2,y:sh.y-66},{x:sh.x+14,y:sh.y-6},p),po={f:lg,sh:sh,headDeg:-2,aF:armTo(sh,hand,DOWN)};
    po.props=o.prop==='bar'?[{t:'plate',c:hand,r:15}]:propsInHands(po,o);return po;
  }};
  S.lateral={view:'front',seq:PP(1.8,1.1,0.4,0.2),hl:['delt'],pose:function(p,o){return {arm:lerp(92,172,p),feet:16,db:o.prop!=='none'};}};
  S.jjack={view:'front',seq:[[0.45,0,1],[0.45,1,0]],hl:[],pose:function(p,o){return {arm:lerp(176,22,p),feet:lerp(14,44,p),dy:-6*Math.sin(Math.PI*p)};}};
  S.front_raise={seq:PP(1.8,1.1,0.4,0.2),hl:['delt'],pose:function(p,o){
    var lg=flatFoot(legUp(A0,0,0)),sh=P(lg.hip,L.torso,2),ad=lerp(92,178,p);
    var po={f:lg,sh:sh,headDeg:2,aF:arm(sh,ad,ad-4),oneArm:false};po.props=propsInHands(po,o);return po;
  }};
  S.shrug={seq:PP(1.2,0.8,0.5,0.3),hl:['neck'],pose:function(p,o){
    var lg=flatFoot(legUp(A0,0,0)),sh=P(lg.hip,L.torso-lerp(-6,0,p),2);
    var po={f:lg,sh:sh,headDeg:2,aF:arm(sh,179,179)};po.props=propsInHands(po,o.prop==='none'?{prop:'db'}:o);return po;
  }};
  S.dip={seq:PP(2,1),hl:['chest','upper'],pose:function(p,o){
    var hand={x:150,y:96},sh={x:lerp(146,154,p),y:lerp(30,56,p)},torso=lerp(4,22,p);
    var hip=P(sh,L.torso,torso+180),f=legDown(hip,188,244);f.toe=P(f.ankle,14,200);
    return {f:f,hip:hip,sh:sh,headDeg:torso,aF:armTo(sh,hand,LEFT),
      propsBack:[{t:'line',a:{x:126,y:hand.y+4},b:{x:176,y:hand.y+4},w:6},{t:'line',a:{x:170,y:hand.y+4},b:{x:170,y:G},w:4}]};
  }};

  function bentRow(p,o){
    var lg=flatFoot(legUp(A0,14,-22)),sh=P(lg.hip,L.torso,72);
    return {lg:lg,sh:sh};
  }
  S.row={seq:PP(2,1,0.4,0.4),hl:['back','upper'],pose:function(p,o){
    var b=bentRow(),sh=b.sh,hand=lp({x:sh.x+2,y:sh.y+64},{x:sh.x-28,y:sh.y+20},1-p);
    var po={f:b.lg,sh:sh,headDeg:86,aF:armTo(sh,hand,LEFT)};
    po.props=o.prop==='bar'?[{t:'plate',c:hand,r:15}]:[{t:'db',c:hand}];return po;
  }};
  S.revfly={seq:PP(1.8,1,0.4,0.3),hl:['back','delt'],pose:function(p,o){
    var b=bentRow(),sh=b.sh,k=Math.cos(R(lerp(78,0,p))),hand={x:sh.x+4,y:sh.y+66*k};
    var po={f:b.lg,sh:sh,headDeg:86,aF:{elb:lp(sh,hand,0.53),hand:hand}};po.props=[{t:'db',c:hand}];return po;
  }};
  S.kickback={seq:PP(1.6,1,0.4,0.4),hl:['upper'],pose:function(p,o){
    var b=bentRow(),sh=b.sh,elb=P(sh,L.upper,-112),hand=P(elb,L.fore,lerp(-104,178,p));
    var po={f:b.lg,sh:sh,headDeg:86,aF:{elb:elb,hand:hand}};
    po.props=o.prop==='cable'?[{t:'cable',a:hand,b:{x:262,y:G-10}},{t:'rect',x:258,y:110,w:10,h:G-110}]:[{t:'db',c:hand}];return po;
  }};
  S.rowseated={seq:PP(2,1,0.3,0.4),hl:['back','upper'],pose:function(p,o){
    var hip={x:112,y:186},torso=lerp(-4,18,p),sh=P(hip,L.torso,torso);
    var ank={x:204,y:186},f={hip:hip,ankle:ank,knee:legIK(hip,ank,UP)};f.toe=P(ank,L.foot,-10);
    var hand=lp({x:sh.x+20,y:sh.y+44},P(sh,66,96),p),anchor={x:262,y:178};
    return {f:f,sh:sh,headDeg:torso,aF:armTo(sh,hand,LEFT),
      props:[{t:'cable',a:hand,b:anchor},{t:'dot',c:hand,r:4}],
      propsBack:[{t:'rect',x:84,y:194,w:60,h:6},{t:'line',a:{x:212,y:166},b:{x:212,y:G},w:5},{t:'rect',x:256,y:150,w:12,h:G-150}]};
  }};
  S.pulldown={seq:PP(2,1,0.3,0.4),hl:['back','upper'],pose:function(p,o){
    var hip={x:132,y:152},sh=P(hip,L.torso,-12),f=legDown(hip,90,180);f.toe=P(f.ankle,L.foot,90);
    var hand=lp({x:sh.x+16,y:sh.y+10},{x:sh.x+14,y:sh.y-64},p);
    return {f:f,sh:sh,headDeg:-6,aF:armTo(sh,hand,LEFT),
      props:[{t:'cable',a:hand,b:{x:hand.x,y:0}},{t:'line',a:{x:hand.x-14,y:hand.y},b:{x:hand.x+14,y:hand.y},w:4}],
      propsBack:[{t:'rect',x:110,y:160,w:44,h:7},{t:'line',a:{x:132,y:167},b:{x:132,y:G},w:5},{t:'dot',c:{x:f.knee.x+2,y:f.knee.y-12},r:7}]};
  }};
  S.pullup={scale:0.86,seq:PP(2,1,0.4,0.3),hl:['back','upper'],pose:function(p,o){
    var bar={x:160,y:18},sh={x:lerp(150,157,p),y:lerp(50,84,p)},hip=P(sh,L.torso,186);
    var f=legDown(hip,170,214);f.toe=P(f.ankle,14,150);
    return {f:f,hip:hip,sh:sh,headDeg:4,aF:armTo(sh,bar,LEFT),props:[{t:'line',a:{x:120,y:bar.y},b:{x:220,y:bar.y},w:6}],noGround:true};
  }};
  S.hangraise={scale:0.86,seq:PP(1.8,1.2,0.4,0.3),hl:['abs'],pose:function(p,o){
    var bar={x:156,y:18},sh={x:152,y:84},hip=P(sh,L.torso,182);
    var th=lerp(92,176,p),f=o.v==='knee'?legDown(hip,lerp(80,176,p),lerp(184,180,p)):legDown(hip,th,th);
    f.toe=P(f.ankle,14,(o.v==='knee'?90:th-90));
    return {f:f,hip:hip,sh:sh,headDeg:2,aF:armTo(sh,bar,LEFT),props:[{t:'line',a:{x:116,y:bar.y},b:{x:216,y:bar.y},w:6}],noGround:true};
  }};

  function standArm(o){var lg=flatFoot(legUp(A0,0,0)),sh=P(lg.hip,L.torso,2);return {lg:lg,sh:sh};}
  S.curl={seq:PP(2,1,0.3,0.4),hl:['upper'],pose:function(p,o){
    var b=standArm(),elb=P(b.sh,L.upper,176),hand=P(elb,L.fore,lerp(22,178,p));
    var po={f:b.lg,sh:b.sh,headDeg:2,aF:{elb:elb,hand:hand}};
    if(o.prop==='cable') po.props=[{t:'cable',a:hand,b:{x:226,y:G-8}},{t:'rect',x:222,y:120,w:10,h:G-120}];
    else if(o.prop==='bar') po.props=[{t:'plate',c:hand,r:13}];
    else if(o.prop!=='none') po.props=[{t:'db',c:hand}];
    return po;
  }};
  S.pushdown={seq:PP(1.8,1,0.4,0.3),hl:['upper'],pose:function(p,o){
    var lg=flatFoot(legUp(A0,0,0)),sh=P(lg.hip,L.torso,10),elb=P(sh,L.upper,172),hand=P(elb,L.fore,lerp(176,56,p));
    return {f:lg,sh:sh,headDeg:8,aF:{elb:elb,hand:hand},props:[{t:'cable',a:hand,b:{x:206,y:6}},{t:'dot',c:hand,r:4},{t:'rect',x:206,y:0,w:10,h:G}]};
  }};
  S.trioverhead={seq:PP(2,1,0.3,0.4),hl:['upper'],pose:function(p,o){
    var lg=flatFoot(legUp(A0,0,0)),sh=P(lg.hip,L.torso,4),elb=P(sh,L.upper,-8),hand=P(elb,L.fore,lerp(-4,-164,p));
    var po={f:lg,sh:sh,headDeg:4,aF:{elb:elb,hand:hand},armsBehind:true};
    po.props=o.prop==='cable'?[{t:'cable',a:hand,b:{x:40,y:G-8}},{t:'rect',x:30,y:120,w:10,h:G-120}]:[{t:'db',c:hand}];return po;
  }};

  S.crunch={seq:PP(1.2,0.8,0.3,0.4),hl:['abs'],pose:function(p,o){
    var hip={x:150,y:G-12},ank={x:206,y:G-6},f={hip:hip,ankle:ank,knee:legIK(hip,ank,UP)};f.toe={x:ank.x+L.foot,y:G-3};
    var td=lerp(-62,-88,p),sh=P(hip,L.torso,td),hd=td-10,head=P(sh,21,hd);
    return {f:f,sh:sh,headDeg:hd,aF:armTo(sh,{x:head.x+6,y:head.y-6},UP)};
  }};
  S.legraise={seq:PP(1.8,1.2,0.4,0.3),hl:['abs'],pose:function(p,o){
    var hip={x:150,y:G-12},sh=P(hip,L.torso,-90),th=lerp(8,86,p),f=legDown(hip,th,th);f.toe=P(f.ankle,14,th-90);
    return {f:f,sh:sh,headDeg:-92,aF:{elb:{x:sh.x+30,y:G-6},hand:{x:sh.x+60,y:G-6}}};
  }};
  S.deadbug={seq:PP(1.6,1.2,0.4,0.3),hl:['abs'],pose:function(p,o){
    var hip={x:168,y:G-12},sh=P(hip,L.torso,-90);
    var fl=legDown(hip,lerp(4,74,p),lerp(92,80,p));fl.toe=P(fl.ankle,12,0);
    var bl=legDown({x:hip.x-3,y:hip.y-2},4,92);bl.toe=P(bl.ankle,12,0);
    return {f:fl,b:bl,sh:sh,headDeg:-92,aF:arm(sh,2,2),aB:arm({x:sh.x-2,y:sh.y-2},lerp(0,-78,p),lerp(0,-78,p))};
  }};
  S.birddog={seq:PP(1.4,1.2,0.4,0.6),hl:['back','glute'],pose:function(p,o){
    var hip={x:112,y:150},sh={x:174,y:150};
    var th=lerp(180,274,p),f=legDown(hip,th,lerp(270,274,p));
    f.toe=P(f.ankle,12,lerp(180,184,p));
    var b={hip:{x:hip.x-3,y:hip.y-2},knee:{x:hip.x-3,y:G-6},ankle:{x:hip.x-55,y:G-6},toe:{x:hip.x-66,y:G-4}};
    var ad=lerp(180,88,p);
    return {f:f,b:b,sh:sh,headDeg:84,aF:armTo(sh,{x:sh.x+3,y:G-5},LEFT),aB:arm({x:sh.x-3,y:sh.y-2},ad,ad),hip:hip,fs:1};
  }};

  S.legext={seq:PP(1.8,1,0.3,0.4),hl:['thigh'],pose:function(p,o){
    var hip={x:118,y:150},sh=P(hip,L.torso,-14),knee={x:hip.x+L.thigh,y:hip.y},ang=lerp(92,186,p),ank=P(knee,L.shin,ang);
    var f={hip:hip,knee:knee,ankle:ank,toe:P(ank,14,ang-90)};
    var seat=o.v==='chair'
      ?[{t:'rect',x:96,y:158,w:66,h:7},{t:'line',a:{x:100,y:165},b:{x:100,y:G},w:4},{t:'line',a:{x:156,y:165},b:{x:156,y:G},w:4},{t:'line',a:{x:98,y:158},b:{x:88,y:94},w:4}]
      :[{t:'rect',x:92,y:158,w:84,h:8},{t:'line',a:{x:100,y:158},b:{x:84,y:92},w:8},{t:'line',a:{x:120,y:166},b:{x:120,y:G},w:5},{t:'dot',c:P(ank,10,ang+90),r:7}];
    return {f:f,sh:sh,headDeg:-8,aF:armTo(sh,{x:hip.x+12,y:hip.y+6},DOWN),propsBack:seat};
  }};
  S.legcurl={seq:PP(1.8,1,0.3,0.4),hl:['hams'],pose:function(p,o){
    var hip={x:118,y:150},sh=P(hip,L.torso,-14),knee={x:hip.x+L.thigh,y:hip.y},ang=lerp(198,94,p),ank=P(knee,L.shin,ang);
    var f={hip:hip,knee:knee,ankle:ank,toe:P(ank,14,ang-90)};
    return {f:f,sh:sh,headDeg:-8,aF:armTo(sh,{x:hip.x+12,y:hip.y+6},DOWN),
      propsBack:[{t:'rect',x:92,y:158,w:84,h:8},{t:'line',a:{x:100,y:158},b:{x:84,y:92},w:8},{t:'line',a:{x:120,y:166},b:{x:120,y:G},w:5},{t:'dot',c:P(ank,10,ang-90),r:7},{t:'dot',c:{x:knee.x-12,y:knee.y-14},r:7}]};
  }};
  S.legpress={seq:PP(2,1.2),hl:['thigh','glute'],pose:function(p,o){
    var hip={x:106,y:176},sh=P(hip,L.torso,-62),dir={x:Math.cos(R(-40)),y:Math.sin(R(-40))},d=lerp(102,58,p);
    var ank={x:hip.x+dir.x*d,y:hip.y+dir.y*d},f={hip:hip,ankle:ank,knee:legIK(hip,ank,UP)};f.toe=P(ank,L.foot,-10);
    var n={x:-dir.y,y:dir.x},pc={x:ank.x+dir.x*8,y:ank.y+dir.y*8};
    return {f:f,sh:sh,headDeg:-50,aF:armTo(sh,{x:hip.x+6,y:hip.y-4},DOWN),
      props:[{t:'line',a:{x:pc.x-n.x*30,y:pc.y-n.y*30},b:{x:pc.x+n.x*30,y:pc.y+n.y*30},w:7}],
      propsBack:[{t:'line',a:{x:hip.x-6,y:hip.y+12},b:P({x:hip.x-6,y:hip.y+12},L.torso+10,-62),w:8},{t:'rect',x:hip.x-14,y:hip.y+12,w:40,h:7},{t:'line',a:{x:hip.x,y:hip.y+19},b:{x:hip.x,y:G},w:5}]};
  }};

  function gait(q,amp,knee,arms,torso){
    var hipX=150;
    function leg(ph){var s=Math.sin(2*Math.PI*ph),c=Math.cos(2*Math.PI*ph);
      var th=180-amp*s,flex=8+knee*Math.max(0,Math.sin(2*Math.PI*ph+2.2));var hip0={x:hipX,y:0};
      var lg=legDown(hip0,th,th+flex);lg.toe=P(lg.ankle,L.foot,th+flex-90);return lg;}
    var a=leg(q),b=leg(q+0.5),low=Math.max(a.ankle.y,b.ankle.y,a.toe.y,b.toe.y),dy=G-4-low;
    function mv(l){['hip','knee','ankle','toe'].forEach(function(k){l[k]={x:l[k].x,y:l[k].y+dy};});return l;}
    mv(a);mv(b);var sh=P(a.hip,L.torso,torso);
    var sa=Math.sin(2*Math.PI*q);
    return {f:a,b:b,sh:sh,headDeg:torso*0.5,aF:arm(sh,180+arms*sa,180+arms*sa-(knee>40?82:14)),aB:arm(sh,180-arms*sa,180-arms*sa-(knee>40?82:14))};
  }
  S.walk={seq:[[1.1,0,1,'lin']],hl:[],pose:function(p,o){
    var po=gait(p,22,30,o.prop==='db'?0:20,4);
    if(o.prop==='db'){po.aF=arm(po.sh,179,179);po.aB=arm(po.sh,181,181);po.props=[{t:'db',c:po.aF.hand}];}
    if(o.v==='treadmill') po.propsBack=[{t:'rect',x:70,y:G-2,w:170,h:8,rx:4},{t:'line',a:{x:236,y:G},b:{x:250,y:86},w:5},{t:'line',a:{x:250,y:86},b:{x:226,y:96},w:5}];
    return po;
  }};
  S.run={seq:[[0.7,0,1,'lin']],hl:[],pose:function(p,o){
    var po=gait(p,34,78,34,12);
    if(o.v==='treadmill') po.propsBack=[{t:'rect',x:70,y:G-2,w:170,h:8,rx:4},{t:'line',a:{x:236,y:G},b:{x:250,y:86},w:5},{t:'line',a:{x:250,y:86},b:{x:226,y:96},w:5}];
    return po;
  }};
  S.bike={seq:[[1,0,1,'lin']],hl:['thigh'],pose:function(p,o){
    var hip={x:128,y:118},cr={x:166,y:182},r=17;
    function leg(q){var a=2*Math.PI*q,ped={x:cr.x+r*Math.cos(a),y:cr.y+r*Math.sin(a)},ank={x:ped.x-4,y:ped.y-6};
      var l={hip:hip,ankle:ank,knee:legIK(hip,ank,RIGHT)};l.toe={x:ped.x+10,y:ped.y-2};return l;}
    var sh=P(hip,L.torso,38),hb={x:214,y:104};
    return {f:leg(p),b:leg(p+0.5),sh:sh,headDeg:60,aF:armTo(sh,hb,DOWN),offA:{x:-3,y:-1},
      propsBack:[{t:'line',a:{x:120,y:126},b:{x:136,y:126},w:6},{t:'line',a:{x:128,y:128},b:cr,w:5},{t:'line',a:cr,b:{x:206,y:110},w:5},{t:'line',a:{x:206,y:104},b:{x:220,y:104},w:5},
        {t:'ring',c:{x:204,y:184},r:22,w:4},{t:'line',a:{x:110,y:G},b:{x:226,y:G},w:5},{t:'ring',c:cr,r:4,w:3}]};
  }};
  S.rower={seq:[[0.2,0,0],[0.8,0,1],[0.2,1,1],[1.4,1,0]],hl:['back','thigh'],pose:function(p,o){
    // p=0 presa (gambe piegate), p=1 finale (gambe distese, busto indietro, mani al petto)
    var ank={x:206,y:184},hip={x:lerp(152,106,ease(Math.min(1,p*1.3))),y:186};
    var f={hip:hip,ankle:ank,knee:legIK(hip,ank,UP)};f.toe=P(ank,L.foot,-20);
    var torso=lerp(28,-24,p),sh=P(hip,L.torso,torso);
    var armK=Math.max(0,(p-0.45)/0.55),hand=lp(P(sh,66,lerp(96,100,p)),{x:sh.x+22,y:sh.y+30},ease(armK));
    return {f:f,sh:sh,headDeg:torso,aF:armTo(sh,hand,LEFT),
      props:[{t:'cable',a:hand,b:{x:240,y:178}},{t:'line',a:{x:hand.x,y:hand.y-6},b:{x:hand.x,y:hand.y+6},w:4}],
      propsBack:[{t:'line',a:{x:70,y:198},b:{x:250,y:198},w:5},{t:'rect',x:hip.x-16,y:192,w:32,h:6},{t:'line',a:{x:214,y:172},b:{x:214,y:198},w:5},{t:'ring',c:{x:244,y:178},r:16,w:4}]};
  }};
  S.jumpsquat={seq:[[0.25,0,0],[0.8,0,1],[0.12,1,1],[0.3,1,0],[0.5,0,0,'air'],[0.15,0,0]],hl:['thigh','glute'],pose:function(p,o,st){
    var po=S.squat.pose(p,{prop:'none'});
    if(st&&st.i===4){var h=Math.sin(Math.PI*st.k)*26;po.lift=h;po.aF=arm(po.sh,150,140);}
    return po;
  }};

  // ── Mappa esercizio → animazione (solo dove il movimento e' rappresentato fedelmente) ──
  var MAP={
    E01:'squat',E02:'squat',E03:'squat:db',E04:'legpress',E05:'lunge:db:rfe',E07:'bridge',E08:'hipthrust:bar',E09:'lunge',E10:'stepup',
    E11:'rdl:bar',E12:'rdl:none',E13:'rdl:barback',E14:'legcurl',E16:'pushup',E18:'pushup::knee',E19:'bench:db',E20:'bench:bar',E21:'fly',E22:'dip',
    E23:'row:db',E24:'pulldown',E25:'pullup',E26:'rowseated',E27:'rowseated',E28:'row:bar',E29:'ohp:db',E30:'lateral:db',E32:'ohp:db',E33:'shrug:db',
    E34:'curl:db',E35:'curl:bar',E36:'curl:db',E37:'curl:db',E38:'skull:bar',E39:'pushdown',E41:'kickback:db',E42:'calf:none',E44:'plank',E45:'deadbug',
    E46:'climber',E47:'crunch',E50:'birddog',E54:'walk',E55:'bike',E56:'run',E57:'rower',E58:'jjack',E67:'bench:db:incline',E72:'ohp:bar',E73:'ohp:none',
    E75:'curl:cable',E77:'squat:db',E78:'legext',E79:'rdl:db',E86:'hangraise',E87:'walk::treadmill',E89:'bike',E90:'walk::treadmill',E91:'jumpsquat',
    E92:'calf:none',E93:'calf:none',E94:'pullup',E97:'pullup',E99:'pushup',E104:'bridge',E105:'squat:barfront',E110:'lunge',E111:'lunge',
    E115:'deadlift',E116:'deadlift',E117:'deadlift',E118:'rdl:bar',E120:'kbswing',E124:'bridge',E128:'hipthrust:bar',E131:'calf:none',
    E133:'bench:bar:incline',E134:'bench:bar',E140:'pushup',E145:'row:bar',E148:'pullup',E150:'pulldown',E155:'ohp:bar',E160:'front_raise:db',
    E161:'revfly',E162:'lateral:none',E167:'curl:db',E168:'curl:bar',E169:'curl:db',E171:'curl:bar',E172:'curl:bar',E173:'skull:bar',E174:'bench:bar',
    E175:'pushdown',E177:'trioverhead:cable',E179:'pushdown',E181:'hangraise',E187:'hangraise::knee',E191:'plank',E197:'walk:db',E198:'bike',E205:'bike',
    E206:'jumpsquat',E220:'squat:kb',E239:'birddog',E240:'crunch',E241:'bridge',E245:'squat::chair',E246:'walk',E248:'legext::chair',E249:'rowseated',
    E250:'run',E255:'rowseated',E256:'pulldown',E257:'rowseated',E258:'curl:none',E259:'dip',E260:'legcurl',E266:'calf:none',E267:'legpress',
    E270:'rowseated',E271:'pulldown',E272:'ohp:none',E275:'hipthrust:none',E276:'squat:bar',E277:'bench:bar',E278:'lunge:barback',E279:'ohp:bar',
    E280:'rowseated',E287:'front_raise:none',E288:'kickback:cable',E289:'curl:cable',E290:'rowseated',E295:'hangraise::knee',E296:'lunge',
    E300:'shrug:none',E301:'lateral:none',E302:'run::treadmill'
  };
  function parse(spec){var a=String(spec||'').split(':');return {p:a[0],o:{prop:a[1]||'none',v:a[2]||''}};}
  function specFor(ex){
    if(!ex) return null;
    if(typeof ex==='string') return MAP[ex]||null;
    if(ex.anim) return ex.anim;
    var id=ex.eId||ex.id;
    return (id&&MAP[id])||null;
  }

  // ── Montaggio ──
  function colors(opts){
    opts=opts||{};
    return {fig:opts.fig||'var(--anim-fig, #2a3446)',acc:opts.acc||'var(--anim-acc, #2f6fec)',prop:opts.prop||'var(--anim-prop, #a3adbd)',
      bg:opts.bg||'var(--anim-bg, #f3f6fa)',ground:opts.ground||'var(--anim-ground, #d3d9e3)'};
  }
  function render(spec,time,C){
    var sp=parse(spec),pat=S[sp.p];if(!pat) return '';
    var st=seqAt(pat.seq,time),po=pat.pose(st.p,sp.o,st),hl=pat.hl||[],s='';
    if(pat.view==='front'){
      s+=line({x:60,y:G+1},{x:240,y:G+1},2,C.ground);
      return s+frontFigure(po,hl,C);
    }
    var body='';
    // Con la scala il suolo va dentro il gruppo, altrimenti la figura fluttua.
    if(!po.noGround){var gl=line({x:12,y:G+1},{x:288,y:G+1},2,C.ground);if(pat.scale) body+=gl; else s+=gl;}
    (po.propsBack||[]).forEach(function(pr){body+=propMarkup(pr,C);});
    body+=sideFigure(po,hl,C);
    (po.props||[]).forEach(function(pr){body+=propMarkup(pr,C);});
    var tr='';
    if(pat.scale) tr='translate('+(150*(1-pat.scale))+',4) scale('+pat.scale+')';
    if(po.lift) tr='translate(0,'+(-po.lift).toFixed(1)+')';
    return s+(tr?'<g transform="'+tr+'">'+body+'</g>':body);
  }
  function mount(el,spec,opts){
    if(!el||!spec||!S[parse(spec).p]) return {destroy:function(){},setPlaying:function(){}};
    opts=opts||{};
    var C=colors(opts),svg=document.createElementNS(NS,'svg');
    svg.setAttribute('viewBox','0 0 300 230');svg.setAttribute('role','img');
    if(opts.label) svg.setAttribute('aria-label',opts.label);
    svg.style.display='block';svg.style.width='100%';svg.style.height='auto';
    el.appendChild(svg);
    var reduce=false;try{reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}
    var playing=opts.playing!=null?!!opts.playing:!reduce,clock=0.9,last=null,raf=0,alive=true,speed=opts.speed||1;
    function draw(){svg.innerHTML=render(spec,clock,C);}
    function frame(ts){
      if(!alive) return;
      if(!svg.isConnected){alive=false;return;}
      if(last!=null&&playing) clock+=Math.min(0.1,(ts-last)/1000)*speed;
      last=ts;draw();raf=requestAnimationFrame(frame);
    }
    draw();raf=requestAnimationFrame(frame);
    return {
      destroy:function(){alive=false;cancelAnimationFrame(raf);if(svg.parentNode) svg.parentNode.removeChild(svg);},
      setPlaying:function(v){playing=!!v;}
    };
  }
  window.PTAnim={specFor:specFor,has:function(ex){var s=specFor(ex);return !!(s&&S[parse(s).p]);},mount:mount,render:render,patterns:Object.keys(S),MAP:MAP};
})();
