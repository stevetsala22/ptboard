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

  // ── Disegno (markup SVG), stile v2: figura con volumi, abiti, attrezzi realistici ──
  // Colori: C.<nome> = 'var(--anim-<nome>, fallback)'. Vedi colors().
  function f1(n){return Math.round(n*10)/10;}
  function sty(col,op){return 'style="fill:'+col+'"'+(op!=null?' opacity="'+op+'"':'');}
  function circ(c,r,col,op){return '<circle cx="'+f1(c.x)+'" cy="'+f1(c.y)+'" r="'+f1(r)+'" '+sty(col,op)+'/>';}
  function poly(pts,col,op){return '<polygon points="'+pts.map(function(p){return f1(p.x)+','+f1(p.y);}).join(' ')+'" '+sty(col,op)+'/>';}
  function rect(x,y,w,h,col,rx,op){return '<rect x="'+f1(x)+'" y="'+f1(y)+'" width="'+f1(w)+'" height="'+f1(h)+'" rx="'+(rx||0)+'" '+sty(col,op)+'/>';}
  function line(a,b,w,col,op){return '<line x1="'+f1(a.x)+'" y1="'+f1(a.y)+'" x2="'+f1(b.x)+'" y2="'+f1(b.y)+'" stroke-width="'+w+'" stroke-linecap="round" style="stroke:'+col+'"'+(op!=null?' opacity="'+op+'"':'')+'/>';}
  function norm(a,b){var dx=b.x-a.x,dy=b.y-a.y,l=Math.hypot(dx,dy)||1;return {x:dx/l,y:dy/l};}
  // Segmento affusolato (arto): raggio ra in a, rb in b.
  function capsule(a,b,ra,rb,col,op){
    var d=norm(a,b),n={x:-d.y,y:d.x};
    return poly([{x:a.x+n.x*ra,y:a.y+n.y*ra},{x:b.x+n.x*rb,y:b.y+n.y*rb},{x:b.x-n.x*rb,y:b.y-n.y*rb},{x:a.x-n.x*ra,y:a.y-n.y*ra}],col,op)+circ(a,ra,col,op)+circ(b,rb,col,op);
  }
  // Muscolo evidenziato: rigonfiamento su un lato del segmento a->b (s=+1/-1 sceglie il lato).
  function bulge(a,b,t0,t1,s,w,col,op){
    var d=norm(a,b),n={x:-d.y*s,y:d.x*s},p0=lp(a,b,t0),p1=lp(a,b,t1),pm=lp(a,b,(t0+t1)/2);
    return '<path d="M'+f1(p0.x)+' '+f1(p0.y)+' Q'+f1(pm.x+n.x*w*2)+' '+f1(pm.y+n.y*w*2)+' '+f1(p1.x)+' '+f1(p1.y)+' Q'+f1(pm.x+n.x*w*0.3)+' '+f1(pm.y+n.y*w*0.3)+' '+f1(p0.x)+' '+f1(p0.y)+'Z" '+sty(col,op)+'/>';
  }
  // Lato (s) di a->b verso cui sta il punto q.
  function sideToward(a,b,q){var d=norm(a,b);return ((q.x-a.x)*(-d.y)+(q.y-a.y)*d.x)>=0?1:-1;}
  function smoothPath(pts){
    var s='M'+f1(pts[0].x)+' '+f1(pts[0].y),n=pts.length;
    for(var i=0;i<n;i++){var p0=pts[(i-1+n)%n],p1=pts[i],p2=pts[(i+1)%n],p3=pts[(i+2)%n];
      s+=' C'+f1(p1.x+(p2.x-p0.x)/6)+' '+f1(p1.y+(p2.y-p0.y)/6)+' '+f1(p2.x-(p3.x-p1.x)/6)+' '+f1(p2.y-(p3.y-p1.y)/6)+' '+f1(p2.x)+' '+f1(p2.y);}
    return s+'Z';
  }
  // Busto di profilo: petto, vita, glutei. side=+1 se il davanti e' a sinistra di hip->sh (figura rivolta a destra in piedi).
  function torsoSide(H,S,side,col){
    var d=norm(H,S),n={x:-d.y*side,y:d.x*side};
    var fr=[[0,8],[0.2,8.5],[0.4,8],[0.62,10],[0.8,11],[0.95,8],[1,6]],bk=[[0,12],[0.12,11],[0.35,8.5],[0.6,9],[0.85,10],[1,8]],pts=[];
    fr.forEach(function(q){var p=lp(H,S,q[0]);pts.push({x:p.x+n.x*q[1],y:p.y+n.y*q[1]});});
    bk.slice().reverse().forEach(function(q){var p=lp(H,S,q[0]);pts.push({x:p.x-n.x*q[1],y:p.y-n.y*q[1]});});
    return '<path d="'+smoothPath(pts)+'" '+sty(col)+'/>';
  }
  function headSide(sh,hd,side,C){
    var neck=P(sh,4,hd),c=P(sh,19,hd),fc={x:Math.cos(R(hd))*side,y:Math.sin(R(hd))*side};
    return capsule(neck,{x:c.x-fc.x*2,y:c.y-fc.y*2+0},4.5,4.5,C.skin)+
      circ({x:c.x-fc.x*1.8,y:c.y-fc.y*1.8},11.5,C.hair)+circ({x:c.x+fc.x*1.2,y:c.y+fc.y*1.2},10.5,C.skin)+
      circ({x:c.x-fc.x*1.5,y:c.y-fc.y*1.5},2.2,C.skinFar);
  }
  function shoe(ankle,toe,col){
    var u=norm(ankle,toe),heel={x:ankle.x-u.x*4,y:ankle.y-u.y*4};
    var down={x:-u.y,y:u.x};if(down.y<0) down={x:-down.x,y:-down.y};
    var h2={x:heel.x+down.x*2,y:heel.y+down.y*2},t2={x:toe.x+down.x*1.5,y:toe.y+down.y*1.5};
    return capsule(h2,t2,4.4,3.7,col)+capsule(ankle,h2,4,4.3,col);
  }
  function arrowM(a,b,col,op){
    var d=norm(a,b),n={x:-d.y,y:d.x},h={x:b.x-d.x*9,y:b.y-d.y*9};
    return '<g opacity="'+(op||0.85)+'">'+line(a,h,3,col)+poly([b,{x:h.x+n.x*6,y:h.y+n.y*6},{x:h.x-n.x*6,y:h.y-n.y*6}],col)+'</g>';
  }
  function plateM(c,r,C){return circ(c,r,C.metal)+circ(c,r*0.78,C.frame,0.35)+circ(c,r*0.24,C.bg)+circ(c,r*0.12,C.metal);}

  // Attrezzi.
  function propMarkup(pr,C){
    switch(pr.t){
      case 'plate': return plateM(pr.c,pr.r||16,C);
      case 'db': return circ(pr.c,7.5,C.metal)+circ(pr.c,5.2,C.frame,0.45)+circ(pr.c,2,C.metal);
      case 'kb': return '<circle cx="'+f1(pr.c.x)+'" cy="'+f1(pr.c.y-1)+'" r="5.5" style="fill:none;stroke:'+C.metal+'" stroke-width="3"/>'+circ({x:pr.c.x,y:pr.c.y+8},9.5,C.metal)+circ({x:pr.c.x-3,y:pr.c.y+5},2.5,C.frame,0.5);
      case 'rect': return rect(pr.x,pr.y,pr.w,pr.h,pr.dark?C.frame:C.frameLight,pr.rx==null?2:pr.rx);
      case 'pad': return rect(pr.x,pr.y,pr.w,pr.h,C.frame,pr.rx==null?4:pr.rx);
      case 'line': return line(pr.a,pr.b,pr.w||4,pr.dark?C.frame:C.frameLight);
      case 'cable': return line(pr.a,pr.b,1.8,C.metal);
      case 'ring': return '<circle cx="'+f1(pr.c.x)+'" cy="'+f1(pr.c.y)+'" r="'+pr.r+'" style="fill:none;stroke:'+C.frame+'" stroke-width="'+(pr.w||4)+'"/>';
      case 'dot': return circ(pr.c,pr.r||4,C.frame);
      case 'handle': return capsule({x:pr.c.x,y:pr.c.y-7},{x:pr.c.x,y:pr.c.y+7},2.6,2.6,C.metal);
      case 'pulley': return circ(pr.c,pr.r||6,C.frame)+circ(pr.c,(pr.r||6)*0.4,C.frameLight);
      case 'stack': {
        // Colonna con pacco pesi: le piastre alte salgono di pr.lift.
        var s=rect(pr.x-4,pr.top,pr.w+8,G-pr.top,C.frameLight,3)+rect(pr.x,pr.top+6,pr.w,G-pr.top-8,C.bg,2),n=pr.n||8,h=7;
        for(var i=0;i<n;i++){var y=G-4-(i+1)*(h+1),up=i>=n-4?(pr.lift||0):0;s+=rect(pr.x+2,y-up,pr.w-4,h,i>=n-4?C.metal:C.frame,1.5);}
        return s+line({x:pr.x+pr.w/2,y:pr.top+8},{x:pr.x+pr.w/2,y:G-4-n*(h+1)-(pr.lift||0)},1.6,C.metal);
      }
    }
    return '';
  }

  // Figura di profilo. Pose: f/b (gambe: hip,knee,ankle,toe), aF/aB (braccia: elb,hand), sh, headDeg, fs (lato del davanti).
  function sideFigure(po,hl,C){
    var side=po.fs||1,s='';
    var has=function(k){return hl.indexOf(k)!==-1;};
    var lf=po.f,lb=po.b,af=po.aF,ab=po.aB;
    var offL=po.offL||{x:-5,y:-1},offA=po.offA||{x:-4,y:-1};
    function mv(p,o){return p?{x:p.x+o.x,y:p.y+o.y}:p;}
    if(!lb&&lf) lb={hip:mv(lf.hip,offL),knee:mv(lf.knee,offL),ankle:mv(lf.ankle,offL),toe:mv(lf.toe,offL)};
    if(!ab&&af&&!po.oneArm) ab={elb:mv(af.elb,offA),hand:mv(af.hand,offA)};
    var hip=lf?lf.hip:po.hip,shB=mv(po.sh,offA);
    function leg(l,far){
      var sk=far?C.skinFar:C.skin,sh2=far?C.shirtFar:C.shorts,o='';
      o+=capsule(l.hip,l.knee,9,6.6,sk)+capsule(l.knee,l.ankle,6.4,4.4,sk);
      if(!far&&has('quads')) o+=bulge(l.knee,l.hip,0.14,0.86,-sideToward(l.knee,l.hip,l.toe||{x:l.knee.x+10,y:l.knee.y}),7,C.acc,0.95);
      if(!far&&has('hams')) o+=bulge(l.knee,l.hip,0.14,0.86,sideToward(l.knee,l.hip,l.toe||{x:l.knee.x+10,y:l.knee.y}),7,C.acc,0.95);
      if(!far&&has('calf')&&l.toe) o+=bulge(l.ankle,l.knee,0.2,0.75,-sideToward(l.ankle,l.knee,l.toe),4,C.acc,0.9);
      o+=capsule(l.hip,lp(l.hip,l.knee,0.44),10,8.4,sh2);
      if(l.toe) o+=shoe(l.ankle,l.toe,far?C.shirtFar:C.shoe);
      return o;
    }
    function armM(sh,a,far){
      var sk=far?C.skinFar:C.skin,o=capsule(sh,a.elb,6,4.8,sk)+capsule(a.elb,a.hand,4.6,3.6,sk);
      if(!far&&(has('biceps')||has('triceps'))){
        var t=sideToward(a.elb,sh,a.hand),straight=Math.abs((sh.x-a.elb.x)*(a.hand.y-a.elb.y)-(sh.y-a.elb.y)*(a.hand.x-a.elb.x))<60;
        if(straight) t=sideToward(a.elb,sh,{x:a.elb.x+side*10,y:a.elb.y});
        if(has('biceps')) o+=bulge(a.elb,sh,0.12,0.82,t,5.5,C.acc,0.95);
        if(has('triceps')) o+=bulge(a.elb,sh,0.12,0.82,-t,5.5,C.acc,0.95);
      }
      o+=capsule(sh,lp(sh,a.elb,0.38),7,6,far?C.shirtFar:C.shirt)+circ(a.hand,4.3,sk);
      if(!far&&has('delt')) o+=circ(sh,6.6,C.acc,0.85);
      return o;
    }
    if(lb&&lb.knee) s+=leg(lb,true);
    if(ab&&!po.armsBehind) s+=armM(shB,ab,true);
    (po.propsMid||[]).forEach(function(pr){s+=propMarkup(pr,C);});
    s+=torsoSide(hip,po.sh,side,C.shirt);
    if(has('chest')) s+=bulge(hip,po.sh,0.52,0.94,side,8,C.acc,0.95);
    if(has('abs')) s+=bulge(hip,po.sh,0.08,0.54,side,7,C.acc,0.95);
    if(has('back')) s+=bulge(hip,po.sh,0.38,0.92,-side,8,C.acc,0.95);
    if(has('lowback')) s+=bulge(hip,po.sh,0.05,0.42,-side,5,C.acc,0.9);
    if(has('glute')&&lf) s+=bulge(lf.hip,lf.knee,-0.2,0.3,sideToward(lf.knee,lf.hip,lf.toe||{x:lf.knee.x+10,y:lf.knee.y}),8,C.acc,0.95);
    var hd=po.headDeg!=null?po.headDeg:degOf(hip,po.sh);
    s+=headSide(po.sh,hd,side,C);
    if(has('neck')) s+=capsule(po.sh,P(po.sh,9,hd),5,4,C.acc,0.85);
    if(lf) s+=leg(lf,false);
    if(ab&&po.armsBehind) s+=armM(shB,ab,true);
    if(af) s+=armM(po.sh,af,false);
    return s;
  }

  // Figura frontale. o: {cx, shY, hipY, legs:'stand'|'seated'|'hang', feet (scarto caviglie), hands:[L,R] o arms (angolo), hl}
  function frontFigure(o,hl,C){
    var s='',cx=o.cx||150,shY=o.shY,hipY=o.hipY,has=function(k){return hl.indexOf(k)!==-1;};
    var ft=o.feet==null?18:o.feet;
    // gambe
    [-1,1].forEach(function(k){
      var hip={x:cx+k*12,y:hipY};
      if(o.legs==='seated'){var knee={x:cx+k*17,y:hipY+12},ank={x:cx+k*19,y:G-9};
        s+=capsule(hip,knee,11,9,C.skin)+capsule(hip,{x:cx+k*14,y:hipY+6},12,10,C.shorts)+capsule(knee,ank,7,5,C.skin)+'<ellipse cx="'+f1(ank.x+k)+'" cy="'+f1(G-5)+'" rx="8" ry="5" '+sty(C.shoe)+'/>';}
      else{var ank2={x:cx+k*ft,y:o.legs==='hang'?hipY+66:G-9},knee2=lp(hip,ank2,0.5);
        if(o.legs==='hang'){knee2={x:knee2.x,y:knee2.y};}
        s+=capsule(hip,knee2,10,7,C.skin)+capsule(knee2,ank2,7,5,C.skin)+capsule(hip,lp(hip,knee2,0.5),11,9.5,C.shorts);
        if(has('quads')) s+=bulge(lp(hip,knee2,0.2),knee2,0,0.9,k,3.5,C.acc,0.85);
        s+='<ellipse cx="'+f1(ank2.x+k*3)+'" cy="'+f1(ank2.y+4)+'" rx="8" ry="4.6" '+sty(C.shoe)+'/>';}
    });
    if(o.pad) s+=o.pad;
    // busto
    s+='<path d="M'+f1(cx-17)+' '+f1(hipY)+' Q'+f1(cx-14)+' '+f1(shY+40)+' '+f1(cx-23)+' '+f1(shY+14)+' Q'+f1(cx-30)+' '+f1(shY-2)+' '+f1(cx-18)+' '+f1(shY-6)+' L'+f1(cx+18)+' '+f1(shY-6)+' Q'+f1(cx+30)+' '+f1(shY-2)+' '+f1(cx+23)+' '+f1(shY+14)+' Q'+f1(cx+14)+' '+f1(shY+40)+' '+f1(cx+17)+' '+f1(hipY)+'Z" '+sty(C.shirt)+'/>';
    if(has('lats')){var lat=o.latOpen==null?1:o.latOpen;[-1,1].forEach(function(k){s+=poly([{x:cx+k*20,y:shY+8},{x:cx+k*(22+5*lat),y:shY+22},{x:cx+k*17,y:shY+48},{x:cx+k*12,y:shY+44},{x:cx+k*15,y:shY+16}],C.acc,0.9);});}
    if(has('abs')) s+=rect(cx-8,shY+24,16,hipY-shY-30,C.acc,5,0.85);
    // collo e testa
    s+=capsule({x:cx,y:shY-4},{x:cx,y:shY-14},5,5,C.skin)+'<ellipse cx="'+f1(cx)+'" cy="'+f1(shY-27)+'" rx="12.5" ry="13.5" '+sty(C.hair)+'/><ellipse cx="'+f1(cx)+'" cy="'+f1(shY-24)+'" rx="11" ry="12" '+sty(C.skin)+'/>';
    // braccia
    var shs=[{x:cx-25,y:shY},{x:cx+25,y:shY}],hands=[];
    [0,1].forEach(function(i){var k=i?1:-1,sh=shs[i],e,h;
      if(o.hands){h=o.hands[i];e=ik(sh,h,36,33,function(a,b){return (k*a.x+a.y)>(k*b.x+b.y)?a:b;});}
      else{var dg=k*o.arms;e=P(sh,36,dg);h=P(e,33,dg-k*6);}
      hands.push(h);
      s+=capsule(sh,e,6.3,5,C.skin)+capsule(e,h,4.8,3.8,C.skin);
      if(has('biceps')) s+=bulge(e,sh,0.2,0.8,-k,3.5,C.acc,0.8);
      s+=capsule(sh,lp(sh,e,0.36),7.4,6.4,C.shirt);
      if(has('delt')) s+=circ({x:sh.x+k*1.5,y:sh.y},7,C.acc,0.85);
    });
    if(o.after) s+=o.after(hands);
    hands.forEach(function(h){s+=circ(h,4.8,C.skin);});
    if(o.db) hands.forEach(function(h){s+=capsule({x:h.x-9,y:h.y},{x:h.x+9,y:h.y},2,2,C.metal)+rect(h.x-13,h.y-6,5,12,C.metal,1.5)+rect(h.x+8,h.y-6,5,12,C.metal,1.5);});
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

  S.squat={key:'hip',seq:PP(2,1),hl:['quads','glute'],pose:function(p,o){
    var shin=lerp(0,32,p),thigh=lerp(0,-79,p),torso=lerp(3,o.prop==='bar'||o.prop==='barfront'?30:38,p);
    if(o.v==='chair'||o.v==='box'){thigh=lerp(0,-74,p);shin=lerp(0,22,p);torso=lerp(3,40,p);}
    var lg=flatFoot(legUp(A0,shin,thigh)),sh=P(lg.hip,L.torso,torso),po={f:lg,sh:sh,headDeg:torso*0.5,props:[],propsBack:[]};
    if(o.prop==='db'||o.prop==='kb'){var h=P(lg.hip,L.torso*0.8,torso);h={x:h.x+Math.cos(R(torso))*16,y:h.y+Math.sin(R(torso))*16};po.aF=armTo(sh,h,DOWN);po.props=propsInHands(po,o);}
    else if(o.prop==='bar'){var b=P(sh,6,torso-90);po.aF=armTo(sh,b,DOWN);po.props=[{t:'plate',c:b,r:15}];}
    else if(o.prop==='barfront'){var bf=P(sh,15,torso+108);po.aF=armTo(sh,bf,DOWN);po.props=[{t:'plate',c:bf,r:13}];}
    else {var ad=lerp(178,86,p);po.aF=arm(sh,ad,ad-4);}
    if(o.v==='box'){po.propsBack=[{t:'rect',x:84,y:160,w:48,h:G-160,rx:3,dark:true}];}
    if(o.v==='chair'){po.propsBack=[{t:'rect',x:88,y:150,w:40,h:7},{t:'line',a:{x:92,y:157},b:{x:92,y:G},w:4},{t:'line',a:{x:124,y:157},b:{x:124,y:G},w:4},{t:'line',a:{x:90,y:150},b:{x:86,y:96},w:4}];}
    return po;
  }};

  S.lunge={key:'hip',seq:PP(2,1),hl:['quads','glute'],pose:function(p,o){
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

  S.stepup={key:'hip',scale:0.8,seq:PP(1.6,1.2),hl:['quads','glute'],pose:function(p,o){
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
    var h={x:po.hip.x,y:po.hip.y-14};po.aF=armTo(po.sh,h,UP);
    if(o.prop==='bar') po.props=[{t:'plate',c:{x:po.hip.x,y:po.hip.y-20},r:19}];
    po.propsBack=[{t:'rect',x:72,y:164,w:52,h:8},{t:'line',a:{x:80,y:172},b:{x:80,y:G},w:4},{t:'line',a:{x:116,y:172},b:{x:116,y:G},w:4}];
    return po;
  }};
  S.bridge={seq:PP(1.6,1),hl:['glute','hams'],pose:function(p,o){
    var po=bridgeCommon(1-p,{x:92,y:G-12},{x:192,y:G-6},-30,-3,-92);
    po.aF={elb:{x:112,y:G-6},hand:{x:146,y:G-6}};return po;
  }};

  S.calf={key:'hip',seq:PP(1.6,0.9,0.3,0.6),hl:['calf'],pose:function(p,o){
    var toe={x:166,y:G-3},phi=lerp(42,8,p),ank={x:toe.x-L.foot*Math.cos(R(phi)),y:toe.y-L.foot*Math.sin(R(phi))};
    var lg=legUp(ank,0,0);lg.toe=toe;var sh=P(lg.hip,L.torso,2);
    var po={f:lg,sh:sh,headDeg:2,aF:arm(sh,178,178)};po.props=propsInHands(po,o);return po;
  }};

  function plankBody(beta,toeX,anchorKnee){
    var toe={x:toeX,y:G-3},dir=90-beta;
    var ankle=P(toe,15,25),knee=P(ankle,L.shin,dir),hip=P(knee,L.thigh,dir),sh=P(hip,L.torso,dir);
    return {f:{hip:hip,knee:knee,ankle:ankle,toe:toe},sh:sh,dir:dir};
  }
  S.pushup={key:'sh',seq:PP(2,1),hl:['chest','triceps'],pose:function(p,o){
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
  S.climber={seq:[[0.9,0,1,'lin']],hl:['abs','quads'],pose:function(p,o){
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
      :[{t:'pad',x:hip.x-22,y:hip.y+11,w:L.torso+52,h:9},{t:'line',a:{x:hip.x-14,y:hip.y+19},b:{x:hip.x-14,y:G},w:4},{t:'line',a:{x:hip.x+L.torso+20,y:hip.y+19},b:{x:hip.x+L.torso+20,y:G},w:4}];
    return {f:f,sh:sh,dir:dir,headDeg:dir+(inc<90?-10:0),fs:-1,propsBack:bench};
  }
  S.bench={seq:PP(2,1),hl:['chest','triceps'],pose:function(p,o){
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
  S.skull={seq:PP(2,1),hl:['triceps'],pose:function(p,o){
    var po=lying(p,o,90),sh=po.sh,elb={x:sh.x-4,y:sh.y-36};
    var hand=P(elb,L.fore,lerp(-4,128,p));po.aF={elb:elb,hand:hand};
    po.props=[{t:o.prop==='db'?'db':'plate',c:hand,r:12}];return po;
  }};

  S.ohp={seq:PP(1.8,1.2),hl:['delt','triceps'],pose:function(p,o){
    if(o.v==='seat'){
      // Seduto con schienale (manubri o macchina).
      var hipS={x:124,y:152},shS=P(hipS,L.torso,-4),fS=legDown(hipS,90,180);fS.toe=P(fS.ankle,L.foot,90);
      var handS=lp({x:shS.x+2,y:shS.y-66},{x:shS.x+14,y:shS.y-6},p);
      var poS={f:fS,sh:shS,headDeg:-2,aF:armTo(shS,handS,DOWN),
        propsBack:[{t:'pad',x:98,y:158,w:64,h:8},{t:'line',a:{x:110,y:166},b:{x:110,y:G},w:5},{t:'line',a:{x:104,y:156},b:{x:96,y:70},w:9,dark:true}]};
      poS.props=o.prop==='none'?[{t:'handle',c:handS}]:propsInHands(poS,o);return poS;
    }
    var lg=flatFoot(legUp(A0,0,0)),sh=P(lg.hip,L.torso,-3);
    var hand=lp({x:sh.x+2,y:sh.y-66},{x:sh.x+14,y:sh.y-6},p),po={f:lg,sh:sh,headDeg:-2,aF:armTo(sh,hand,DOWN)};
    po.props=o.prop==='bar'?[{t:'plate',c:hand,r:15}]:propsInHands(po,o);return po;
  }};
  S.lateral={view:'front',seq:PP(1.8,1.1,0.4,0.2),hl:['delt'],pose:function(p,o){return {shY:52,hipY:112,legs:'stand',feet:16,arms:lerp(92,172,p),db:o.prop!=='none'};}};
  S.jjack={view:'front',seq:[[0.45,0,1],[0.45,1,0]],hl:[],noArrow:true,pose:function(p,o){var dy=-6*Math.sin(Math.PI*p);return {shY:52+dy,hipY:112+dy,legs:'stand',arms:lerp(176,22,p),feet:lerp(14,40,p)};}};
  S.front_raise={seq:PP(1.8,1.1,0.4,0.2),hl:['delt'],pose:function(p,o){
    var lg=flatFoot(legUp(A0,0,0)),sh=P(lg.hip,L.torso,2),ad=lerp(92,178,p);
    var po={f:lg,sh:sh,headDeg:2,aF:arm(sh,ad,ad-4),oneArm:false};po.props=propsInHands(po,o);return po;
  }};
  S.shrug={seq:PP(1.2,0.8,0.5,0.3),hl:['neck'],pose:function(p,o){
    var lg=flatFoot(legUp(A0,0,0)),sh=P(lg.hip,L.torso-lerp(-6,0,p),2);
    var po={f:lg,sh:sh,headDeg:2,aF:arm(sh,179,179)};po.props=propsInHands(po,o.prop==='none'?{prop:'db'}:o);return po;
  }};
  S.dip={key:'sh',seq:PP(2,1),hl:['chest','triceps'],pose:function(p,o){
    var hand={x:150,y:96},sh={x:lerp(146,154,p),y:lerp(30,56,p)},torso=lerp(4,22,p);
    var hip=P(sh,L.torso,torso+180),f=legDown(hip,188,244);f.toe=P(f.ankle,14,200);
    return {f:f,hip:hip,sh:sh,headDeg:torso,aF:armTo(sh,hand,LEFT),
      propsBack:[{t:'line',a:{x:126,y:hand.y+4},b:{x:176,y:hand.y+4},w:6},{t:'line',a:{x:170,y:hand.y+4},b:{x:170,y:G},w:4}]};
  }};

  function bentRow(p,o){
    var lg=flatFoot(legUp(A0,14,-22)),sh=P(lg.hip,L.torso,72);
    return {lg:lg,sh:sh};
  }
  S.row={seq:PP(2,1,0.4,0.4),hl:['back','biceps'],pose:function(p,o){
    if(o.v==='bench'){
      // Rematore con manubrio a un braccio: ginocchio e mano opposti sulla panca, busto parallelo al suolo.
      var hipB={x:108,y:110},shB=P(hipB,L.torso,90),bt=160;
      var nearAnk={x:96,y:G-6},fl={hip:hipB,ankle:nearAnk,knee:legIK(hipB,nearAnk,RIGHT)};fl.toe={x:nearAnk.x+L.foot,y:G-3};
      var fk={x:114,y:bt-5},bl={hip:{x:hipB.x-3,y:hipB.y-2},knee:fk,ankle:{x:fk.x-52,y:bt-5},toe:{x:fk.x-64,y:bt-8}};
      var handB=lp({x:shB.x+2,y:shB.y+64},{x:shB.x-26,y:shB.y+16},1-p);
      return {f:fl,b:bl,sh:shB,headDeg:96,aF:armTo(shB,handB,LEFT),aB:armTo({x:shB.x-3,y:shB.y-2},{x:shB.x+6,y:bt-4},LEFT),
        props:[{t:'db',c:handB}],propsBack:[{t:'pad',x:52,y:bt,w:150,h:9},{t:'line',a:{x:64,y:bt+9},b:{x:64,y:G},w:5},{t:'line',a:{x:190,y:bt+9},b:{x:190,y:G},w:5}]};
    }
    var b=bentRow(),sh=b.sh,hand=lp({x:sh.x+2,y:sh.y+64},{x:sh.x-28,y:sh.y+20},1-p);
    var po={f:b.lg,sh:sh,headDeg:86,aF:armTo(sh,hand,LEFT)};
    po.props=o.prop==='bar'?[{t:'plate',c:hand,r:15}]:[{t:'db',c:hand}];return po;
  }};
  S.revfly={seq:PP(1.8,1,0.4,0.3),hl:['back','delt'],pose:function(p,o){
    var b=bentRow(),sh=b.sh,k=Math.cos(R(lerp(78,0,p))),hand={x:sh.x+4,y:sh.y+66*k};
    var po={f:b.lg,sh:sh,headDeg:86,aF:{elb:lp(sh,hand,0.53),hand:hand}};po.props=[{t:'db',c:hand}];return po;
  }};
  S.kickback={seq:PP(1.6,1,0.4,0.4),hl:['triceps'],pose:function(p,o){
    var b=bentRow(),sh=b.sh,elb=P(sh,L.upper,-112),hand=P(elb,L.fore,lerp(-104,178,p));
    var po={f:b.lg,sh:sh,headDeg:86,aF:{elb:elb,hand:hand}};
    po.props=o.prop==='cable'?[{t:'stack',x:252,top:96,w:26,n:9,lift:(1-p)*22},{t:'cable',a:hand,b:{x:250,y:G-14}},{t:'pulley',c:{x:250,y:G-14},r:5},{t:'handle',c:hand}]:[{t:'db',c:hand}];return po;
  }};
  S.rowseated={seq:PP(2,1,0.3,0.4),hl:['back','biceps'],pose:function(p,o){
    var hip={x:112,y:186},torso=lerp(-4,18,p),sh=P(hip,L.torso,torso);
    var ank={x:204,y:186},f={hip:hip,ankle:ank,knee:legIK(hip,ank,UP)};f.toe=P(ank,L.foot,-10);
    var hand=lp({x:sh.x+20,y:sh.y+44},P(sh,66,96),p),anchor={x:250,y:178};
    if(o.v==='band'){
      // Elastico agganciato ai piedi, seduti a terra.
      return {f:f,sh:sh,headDeg:torso,aF:armTo(sh,hand,LEFT),props:[{t:'line',a:hand,b:{x:ank.x+8,y:ank.y-2},w:3,dark:true},{t:'handle',c:hand}]};
    }
    return {f:f,sh:sh,headDeg:torso,aF:armTo(sh,hand,LEFT),
      props:[{t:'cable',a:hand,b:anchor},{t:'handle',c:hand}],
      propsBack:[{t:'stack',x:252,top:96,w:26,n:9,lift:(1-p)*30},{t:'pad',x:80,y:194,w:66,h:7},{t:'line',a:{x:84,y:201},b:{x:236,y:201},w:5},{t:'line',a:{x:212,y:166},b:{x:212,y:201},w:6,dark:true},{t:'pulley',c:{x:250,y:178},r:6}]};
  }};
  // Lat machine e trazioni: vista frontale (si vede la presa larga e i gomiti che scendono).
  S.pulldown={view:'custom',seq:PP(2,1,0.3,0.4),hl:['lats','biceps'],draw:function(p,o,C,st){
    // p=0 barra al petto, p=1 braccia in alto (fase eccentrica = ritorno)
    var cx=150,barTop=40,barBot=108,barY=lerp(barBot,barTop,p),travel=(barY-barTop)*0.5,s='';
    s+=line({x:10,y:G+1},{x:290,y:G+1},2,C.ground);
    s+=propMarkup({t:'stack',x:26,top:10,w:30,n:9,lift:travel},C);
    s+=line({x:41,y:12},{x:150,y:12},6,C.frame)+line({x:150,y:12},{x:150,y:G},5,C.frameLight);
    s+=propMarkup({t:'pulley',c:{x:150,y:14}},C)+propMarkup({t:'pulley',c:{x:41,y:14}},C);
    s+=line({x:150,y:14},{x:cx,y:barY},1.8,C.metal);
    s+=rect(140,176,20,G-176,C.frameLight,2)+rect(118,168,64,9,C.frame,4);
    var pad=rect(112,150,76,10,C.frame,5)+line({x:150,y:160},{x:150,y:168},5,C.frame);
    s+=frontFigure({cx:cx,shY:104,hipY:164,legs:'seated',pad:pad,hands:[{x:cx-50,y:barY},{x:cx+50,y:barY}],latOpen:1-p,
      after:function(){return '<path d="M'+f1(cx-70)+' '+f1(barY+8)+' L'+f1(cx-58)+' '+f1(barY)+' L'+f1(cx+58)+' '+f1(barY)+' L'+f1(cx+70)+' '+f1(barY+8)+'" style="fill:none;stroke:'+C.metal+'" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>';}},['lats','biceps'],C);
    if(st&&(st.i===1||st.i===3)){var up=st.i===1;s+=arrowM({x:270,y:up?150:60},{x:270,y:up?60:150},C.acc);}
    return s;
  }};
  S.pullup={view:'custom',seq:PP(2,1,0.4,0.3),hl:['lats','biceps'],draw:function(p,o,C,st){
    // p=0 mento sopra la sbarra, p=1 braccia tese
    var cx=150,barY=24,shY=lerp(50,88,p),s='';
    s+=line({x:60,y:barY},{x:240,y:barY},6,C.frame)+line({x:66,y:barY},{x:66,y:G},5,C.frameLight)+line({x:234,y:barY},{x:234,y:G},5,C.frameLight)+line({x:10,y:G+1},{x:290,y:G+1},2,C.ground);
    var gw=o.v==='narrow'?24:48,body=frontFigure({cx:cx,shY:shY,hipY:shY+60,legs:'hang',feet:10,hands:[{x:cx-gw,y:barY},{x:cx+gw,y:barY}],latOpen:1-p},['lats','biceps'],C);
    s+=body;
    if(st&&(st.i===1||st.i===3)){var dn=st.i===1;s+=arrowM({x:270,y:dn?70:150},{x:270,y:dn?150:70},C.acc);}
    return s;
  }};
  S.hangraise={scale:0.86,seq:PP(1.8,1.2,0.4,0.3),hl:['abs'],pose:function(p,o){
    var bar={x:156,y:18},sh={x:152,y:84},hip=P(sh,L.torso,182);
    var th=lerp(92,176,p),f=o.v==='knee'?legDown(hip,lerp(80,176,p),lerp(184,180,p)):legDown(hip,th,th);
    f.toe=P(f.ankle,14,(o.v==='knee'?90:th-90));
    return {f:f,hip:hip,sh:sh,headDeg:2,aF:armTo(sh,bar,LEFT),props:[{t:'line',a:{x:116,y:bar.y},b:{x:216,y:bar.y},w:6}],noGround:true};
  }};

  function standArm(o){var lg=flatFoot(legUp(A0,0,0)),sh=P(lg.hip,L.torso,2);return {lg:lg,sh:sh};}
  S.curl={seq:PP(2,1,0.3,0.4),hl:['biceps'],pose:function(p,o){
    var b=standArm(),elb=P(b.sh,L.upper,176),hand=P(elb,L.fore,lerp(22,178,p));
    var po={f:b.lg,sh:b.sh,headDeg:2,aF:{elb:elb,hand:hand}};
    if(o.prop==='cable') po.props=[{t:'stack',x:222,top:96,w:26,n:9,lift:(1-p)*24},{t:'cable',a:hand,b:{x:220,y:G-14}},{t:'pulley',c:{x:220,y:G-14},r:5},{t:'handle',c:hand}];
    else if(o.prop==='bar') po.props=[{t:'plate',c:hand,r:13}];
    else if(o.prop!=='none') po.props=[{t:'db',c:hand}];
    return po;
  }};
  S.pushdown={seq:PP(1.8,1,0.4,0.3),hl:['triceps'],pose:function(p,o){
    var lg=flatFoot(legUp(A0,0,0)),sh=P(lg.hip,L.torso,10),elb=P(sh,L.upper,172),hand=P(elb,L.fore,lerp(176,56,p));
    if(o.v==='band') return {f:lg,sh:sh,headDeg:8,aF:{elb:elb,hand:hand},propsBack:[{t:'line',a:{x:214,y:0},b:{x:214,y:G},w:6}],props:[{t:'line',a:hand,b:{x:212,y:24},w:3,dark:true},{t:'dot',c:{x:212,y:24},r:4},{t:'handle',c:hand}]};
    return {f:lg,sh:sh,headDeg:8,aF:{elb:elb,hand:hand},propsBack:[{t:'stack',x:214,top:4,w:26,n:9,lift:(1-p)*28}],props:[{t:'pulley',c:{x:210,y:12},r:6},{t:'cable',a:hand,b:{x:210,y:12}},{t:'handle',c:hand}]};
  }};
  S.trioverhead={seq:PP(2,1,0.3,0.4),hl:['triceps'],pose:function(p,o){
    var lg=flatFoot(legUp(A0,0,0)),sh=P(lg.hip,L.torso,4),elb=P(sh,L.upper,-8),hand=P(elb,L.fore,lerp(-4,-164,p));
    var po={f:lg,sh:sh,headDeg:4,aF:{elb:elb,hand:hand},armsBehind:true};
    po.props=o.prop==='cable'?[{t:'cable',a:hand,b:{x:52,y:G-14}},{t:'pulley',c:{x:52,y:G-14},r:5},{t:'handle',c:hand}]:[{t:'db',c:hand}];if(o.prop==='cable') po.propsBack=[{t:'stack',x:22,top:96,w:26,n:9,lift:(1-p)*24}];return po;
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

  S.legext={seq:PP(1.8,1,0.3,0.4),hl:['quads'],pose:function(p,o){
    var hip={x:118,y:150},sh=P(hip,L.torso,-14),knee={x:hip.x+L.thigh,y:hip.y},ang=lerp(92,186,p),ank=P(knee,L.shin,ang);
    var f={hip:hip,knee:knee,ankle:ank,toe:P(ank,14,ang-90)};
    var seat=o.v==='chair'
      ?[{t:'rect',x:96,y:158,w:66,h:7},{t:'line',a:{x:100,y:165},b:{x:100,y:G},w:4},{t:'line',a:{x:156,y:165},b:{x:156,y:G},w:4},{t:'line',a:{x:98,y:158},b:{x:88,y:94},w:4}]
      :[{t:'stack',x:22,top:70,w:26,n:9,lift:(p<1?(1-p):0)*26},{t:'pad',x:92,y:158,w:84,h:8},{t:'line',a:{x:100,y:158},b:{x:84,y:92},w:9,dark:true},{t:'line',a:{x:120,y:166},b:{x:120,y:G},w:6},{t:'line',a:{x:120,y:G-4},b:{x:40,y:G-4},w:5},{t:'dot',c:P(ank,10,ang+90),r:7}];
    return {f:f,sh:sh,headDeg:-8,aF:armTo(sh,{x:hip.x+12,y:hip.y+6},DOWN),propsBack:seat};
  }};
  S.legcurl={seq:PP(1.8,1,0.3,0.4),hl:['hams'],pose:function(p,o){
    var hip={x:118,y:150},sh=P(hip,L.torso,-14),knee={x:hip.x+L.thigh,y:hip.y},ang=lerp(198,94,p),ank=P(knee,L.shin,ang);
    var f={hip:hip,knee:knee,ankle:ank,toe:P(ank,14,ang-90)};
    return {f:f,sh:sh,headDeg:-8,aF:armTo(sh,{x:hip.x+12,y:hip.y+6},DOWN),
      propsBack:[{t:'stack',x:22,top:70,w:26,n:9,lift:(1-p)*26},{t:'pad',x:92,y:158,w:84,h:8},{t:'line',a:{x:100,y:158},b:{x:84,y:92},w:9,dark:true},{t:'line',a:{x:120,y:166},b:{x:120,y:G},w:6},{t:'line',a:{x:120,y:G-4},b:{x:40,y:G-4},w:5},{t:'dot',c:P(ank,10,ang-90),r:7},{t:'dot',c:{x:knee.x-12,y:knee.y-14},r:7}]};
  }};
  S.legpress={seq:PP(2,1.2),hl:['quads','glute'],pose:function(p,o){
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
  S.bike={seq:[[1,0,1,'lin']],hl:['quads'],pose:function(p,o){
    var hip={x:128,y:118},cr={x:166,y:182},r=17;
    function leg(q){var a=2*Math.PI*q,ped={x:cr.x+r*Math.cos(a),y:cr.y+r*Math.sin(a)},ank={x:ped.x-4,y:ped.y-6};
      var l={hip:hip,ankle:ank,knee:legIK(hip,ank,RIGHT)};l.toe={x:ped.x+10,y:ped.y-2};return l;}
    var sh=P(hip,L.torso,38),hb={x:214,y:104};
    return {f:leg(p),b:leg(p+0.5),sh:sh,headDeg:60,aF:armTo(sh,hb,DOWN),offA:{x:-3,y:-1},
      propsBack:[{t:'line',a:{x:120,y:126},b:{x:136,y:126},w:6},{t:'line',a:{x:128,y:128},b:cr,w:5},{t:'line',a:cr,b:{x:206,y:110},w:5},{t:'line',a:{x:206,y:104},b:{x:220,y:104},w:5},
        {t:'ring',c:{x:204,y:184},r:22,w:4},{t:'line',a:{x:110,y:G},b:{x:226,y:G},w:5},{t:'ring',c:cr,r:4,w:3}]};
  }};
  S.rower={seq:[[0.2,0,0],[0.8,0,1],[0.2,1,1],[1.4,1,0]],hl:['back','quads'],pose:function(p,o){
    // p=0 presa (gambe piegate), p=1 finale (gambe distese, busto indietro, mani al petto)
    var ank={x:206,y:184},hip={x:lerp(152,106,ease(Math.min(1,p*1.3))),y:186};
    var f={hip:hip,ankle:ank,knee:legIK(hip,ank,UP)};f.toe=P(ank,L.foot,-20);
    var torso=lerp(28,-24,p),sh=P(hip,L.torso,torso);
    var armK=Math.max(0,(p-0.45)/0.55),hand=lp(P(sh,66,lerp(96,100,p)),{x:sh.x+22,y:sh.y+30},ease(armK));
    return {f:f,sh:sh,headDeg:torso,aF:armTo(sh,hand,LEFT),
      props:[{t:'cable',a:hand,b:{x:240,y:178}},{t:'line',a:{x:hand.x,y:hand.y-6},b:{x:hand.x,y:hand.y+6},w:4}],
      propsBack:[{t:'line',a:{x:70,y:198},b:{x:250,y:198},w:5},{t:'rect',x:hip.x-16,y:192,w:32,h:6},{t:'line',a:{x:214,y:172},b:{x:214,y:198},w:5},{t:'ring',c:{x:244,y:178},r:16,w:4}]};
  }};
  S.jumpsquat={key:'hip',seq:[[0.25,0,0],[0.8,0,1],[0.12,1,1],[0.3,1,0],[0.5,0,0,'air'],[0.15,0,0]],hl:['quads','glute'],pose:function(p,o,st){
    var po=S.squat.pose(p,{prop:'none'});
    if(st&&st.i===4){var h=Math.sin(Math.PI*st.k)*26;po.lift=h;po.aF=arm(po.sh,150,140);}
    return po;
  }};

  // ── Mappa esercizio → animazione (solo dove il movimento e' rappresentato fedelmente) ──
  var MAP={
    E01:'squat',E02:'squat::box',E03:'squat:db',E04:'legpress',E05:'lunge:db:rfe',E07:'bridge',E08:'hipthrust:bar',E09:'lunge',E10:'stepup',
    E11:'rdl:bar',E12:'rdl:none',E13:'rdl:barback',E14:'legcurl',E16:'pushup',E18:'pushup::knee',E19:'bench:db',E20:'bench:bar',E21:'fly',E22:'dip',
    E23:'row:db:bench',E24:'pulldown',E25:'pullup',E26:'rowseated',E27:'rowseated::band',E28:'row:bar',E29:'ohp:db:seat',E30:'lateral:db',E32:'ohp:db:seat',E33:'shrug:db',
    E34:'curl:db',E35:'curl:bar',E36:'curl:db',E38:'skull:bar',E39:'pushdown',E41:'kickback:db',E42:'calf:none',E44:'plank',E45:'deadbug',
    E46:'climber',E47:'crunch',E50:'birddog',E54:'walk',E55:'bike',E56:'run',E57:'rower',E58:'jjack',E67:'bench:db:incline',E72:'ohp:bar',E73:'ohp:none:seat',
    E75:'curl:cable',E77:'squat:db',E78:'legext',E79:'rdl:db',E86:'hangraise',E87:'walk::treadmill',E89:'bike',E90:'walk::treadmill',E91:'jumpsquat',
    E92:'calf:none',E93:'calf:none',E94:'pullup',E97:'pullup::narrow',E99:'pushup',E104:'bridge',E105:'squat:barfront',E110:'lunge',E111:'lunge',
    E115:'deadlift',E116:'deadlift',E117:'deadlift',E118:'rdl:bar',E120:'kbswing',E124:'bridge',E128:'hipthrust:bar',E131:'calf:none',
    E133:'bench:bar:incline',E134:'bench:bar',E140:'pushup',E145:'row:bar',E148:'pullup',E150:'pulldown',E155:'ohp:bar',E160:'front_raise:db',
    E161:'revfly',E162:'lateral:none',E167:'curl:db',E168:'curl:bar',E169:'curl:db',E171:'curl:bar',E172:'curl:bar',E173:'skull:bar',E174:'bench:bar',
    E175:'pushdown',E177:'trioverhead:cable',E179:'pushdown::band',E181:'hangraise',E187:'hangraise::knee',E191:'plank',E197:'walk:db',E198:'bike',E205:'bike',
    E206:'jumpsquat',E220:'squat:kb',E239:'birddog',E240:'crunch',E241:'bridge',E245:'squat::chair',E246:'walk',E248:'legext::chair',E249:'rowseated::band',
    E250:'run',E255:'rowseated',E256:'pulldown',E257:'rowseated',E259:'dip',E260:'legcurl',E266:'calf:none',E267:'legpress',
    E270:'rowseated',E271:'pulldown',E272:'ohp:none:seat',E275:'hipthrust:none',E276:'squat:bar',E277:'bench:bar',E278:'lunge:barback',E279:'ohp:bar',
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
  // Colori: variabili CSS --anim-* (definite da index.html e share.html per i due temi), con valori di riserva.
  var DEF={acc:'#2f6fec',bg:'#eef2f7',ground:'#d5dce6',frame:'#9aa6b8',frameLight:'#c3ccd9',metal:'#3a4558',
    skin:'#b9c5d6',skinFar:'#d3dbe6',shirt:'#33415a',shirtFar:'#56647e',shorts:'#222b3b',shoe:'#141a24',hair:'#2b3446'};
  var VAR={acc:'acc',bg:'bg',ground:'ground',frame:'frame',frameLight:'frame-light',metal:'metal',skin:'skin',skinFar:'skin-far',
    shirt:'shirt',shirtFar:'shirt-far',shorts:'shorts',shoe:'shoe',hair:'hair'};
  function colors(opts){
    var C={};opts=opts||{};
    Object.keys(DEF).forEach(function(k){C[k]=opts[k]||('var(--anim-'+VAR[k]+', '+DEF[k]+')');});
    return C;
  }
  // Freccia della direzione: segue il punto chiave (mano, o anca) tra inizio e fine del movimento.
  function autoArrow(pat,o,st,C){
    if(pat.noArrow||!st) return '';
    var ph=pat.seq[st.i];if(!ph||ph[1]===ph[2]||ph[3]==='lin') return '';
    var k0=pat.pose(0,o,null),k1=pat.pose(1,o,null);
    var pick=function(po){return pat.key==='hip'?(po.f?po.f.hip:po.hip):pat.key==='sh'?po.sh:(po.aF?po.aF.hand:(po.f?po.f.hip:po.hip));};
    var a=pick(k0),b=pick(k1);if(!a||!b) return '';
    var dx=b.x-a.x,dy=b.y-a.y;if(Math.hypot(dx,dy)<10) return '';
    var fw=ph[2]>ph[1],sgn=fw?1:-1;
    if(Math.abs(dy)>=Math.abs(dx)){var my=(a.y+b.y)/2,d=dy*sgn>0?1:-1,x=pat.arrowX||280;return arrowM({x:x,y:my-32*d},{x:x,y:my+32*d},C.acc);}
    var mx=(a.x+b.x)/2,dd=dx*sgn>0?1:-1;return arrowM({x:mx-30*dd,y:20},{x:mx+30*dd,y:20},C.acc);
  }
  function render(spec,time,C){
    var sp=parse(spec),pat=S[sp.p];if(!pat) return '';
    var st=seqAt(pat.seq,time),hl=pat.hl||[],s='';
    if(pat.view==='custom') return pat.draw(st.p,sp.o,C,st);
    var po=pat.pose(st.p,sp.o,st);
    if(pat.view==='front'){
      s+=line({x:40,y:G+1},{x:260,y:G+1},2,C.ground);
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
    return s+(tr?'<g transform="'+tr+'">'+body+'</g>':body)+autoArrow(pat,sp.o,st,C);
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
  window.PTAnim={specFor:specFor,has:function(ex){var s=specFor(ex);return !!(s&&S[parse(s).p]);},mount:mount,render:render,colors:colors,patterns:Object.keys(S),MAP:MAP};
})();
