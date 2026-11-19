// PT Board · consenso cookie (landing, app, blog).
// Google Analytics e Meta Pixel si caricano SOLO dopo "Accetta". Prima del consenso
// gtag/fbq sono funzioni vuote: le chiamate dell'app non inviano nulla.
// Scelta salvata in localStorage 'ptboard_cookies_consent': 'all' = accetta, 'necessary' = rifiuta
// (stessa chiave del vecchio banner dell'app, quindi chi aveva gia' scelto non lo rivede).
// Riapertura: window.ptCookieSettings() (link "Preferenze cookie").
(function(){
  var KEY='ptboard_cookies_consent', GA='G-EXPPE8PWMT', PIXEL='1671690820676185';
  function leggi(){try{return localStorage.getItem(KEY);}catch(e){return null;}}
  function scrivi(v){try{localStorage.setItem(KEY,v);}catch(e){}}
  var caricato=false;
  window.dataLayer=window.dataLayer||[];
  if(typeof window.gtag!=='function') window.gtag=function(){};
  if(typeof window.fbq!=='function') window.fbq=function(){};

  function caricaTracciamenti(){
    if(caricato) return; caricato=true;
    window.gtag=function(){window.dataLayer.push(arguments);};
    var g=document.createElement('script');g.async=true;g.src='https://www.googletagmanager.com/gtag/js?id='+GA;
    (document.head||document.documentElement).appendChild(g);
    window.gtag('js',new Date());window.gtag('config',GA);
    // Meta Pixel (codice standard di Meta).
    window.fbq=undefined;
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
      s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init',PIXEL);window.fbq('track','PageView');
  }

  var TESTI={
    it:{t:'Usiamo cookie tecnici, necessari al funzionamento del sito. Con il tuo consenso usiamo anche cookie di analisi (Google Analytics) e di marketing (Meta Pixel) per capire come migliorare PT Board. Puoi cambiare idea quando vuoi.',p:'Privacy',no:'Rifiuta',si:'Accetta',x:'Chiudi e rifiuta'},
    en:{t:'We use technical cookies that the site needs to work. With your consent we also use analytics (Google Analytics) and marketing (Meta Pixel) cookies to understand how to improve PT Board. You can change your mind anytime.',p:'Privacy',no:'Reject',si:'Accept',x:'Close and reject'},
    fr:{t:'Nous utilisons des cookies techniques nécessaires au fonctionnement du site. Avec votre accord, nous utilisons aussi des cookies d’analyse (Google Analytics) et marketing (Meta Pixel) pour améliorer PT Board. Vous pouvez changer d’avis à tout moment.',p:'Confidentialité',no:'Refuser',si:'Accepter',x:'Fermer et refuser'}
  };
  function lingua(){
    var l=null;
    try{l=localStorage.getItem('pt_landing_lang')||localStorage.getItem('ptboard_lang');}catch(e){}
    // Lingua scelta sul sito o nell'app; altrimenti quella del browser (come fa la landing).
    l=(l||navigator.language||'it').slice(0,2).toLowerCase();
    return TESTI[l]?l:'it';
  }

  function mostraBanner(){
    if(document.getElementById('pt-cookie')) return;
    var T=TESTI[lingua()];
    var b=document.createElement('div');
    b.id='pt-cookie';b.setAttribute('role','dialog');b.setAttribute('aria-label','Cookie');
    b.style.cssText='position:fixed;left:max(12px,env(safe-area-inset-left,0px));right:max(12px,env(safe-area-inset-right,0px));bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:100001;max-width:760px;margin:0 auto;background:#ffffff;color:#334155;border:1px solid #e2e8f0;border-radius:14px;box-shadow:0 16px 40px rgba(15,23,42,.18);padding:16px 44px 16px 18px;font:14px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif;display:flex;gap:14px;align-items:center;flex-wrap:wrap';
    var p=document.createElement('p');p.style.cssText='margin:0;flex:1 1 320px;min-width:0';
    p.textContent=T.t+' ';
    var a=document.createElement('a');a.href='/privacy.html';a.target='_blank';a.rel='noopener';a.textContent=T.p;a.style.cssText='color:#2563eb;font-weight:700';
    p.appendChild(a);
    var box=document.createElement('div');box.style.cssText='display:flex;gap:8px;flex-shrink:0';
    function bottone(testo,primario){var x=document.createElement('button');x.type='button';x.textContent=testo;
      x.style.cssText='padding:10px 20px;border-radius:10px;font:700 14px system-ui,-apple-system,sans-serif;cursor:pointer;border:1px solid '+(primario?'#2563eb':'#cbd5e1')+';background:'+(primario?'#2563eb':'#ffffff')+';color:'+(primario?'#ffffff':'#0f172a');return x;}
    var no=bottone(T.no,false),si=bottone(T.si,true);
    var chiudi=document.createElement('button');chiudi.type='button';chiudi.setAttribute('aria-label',T.x);chiudi.textContent='×';
    chiudi.style.cssText='position:absolute;top:6px;right:8px;border:none;background:transparent;color:#64748b;font:700 22px/1 system-ui,sans-serif;cursor:pointer;padding:4px 8px';
    function scegli(v){scrivi(v);b.remove();if(v==='all') caricaTracciamenti();}
    no.onclick=function(){scegli('necessary');};
    chiudi.onclick=function(){scegli('necessary');};
    si.onclick=function(){scegli('all');};
    box.appendChild(no);box.appendChild(si);
    b.appendChild(p);b.appendChild(box);b.appendChild(chiudi);
    document.body.appendChild(b);
  }

  // Riaprire il banner per cambiare scelta. Se il consenso viene tolto, la pagina si ricarica
  // cosi' Analytics e Pixel gia' caricati smettono di funzionare.
  window.ptCookieSettings=function(){
    var prima=leggi();
    try{localStorage.removeItem(KEY);}catch(e){}
    mostraBanner();
    var b=document.getElementById('pt-cookie');
    if(b&&prima==='all') b.addEventListener('click',function(e){
      if(e.target.tagName==='BUTTON'&&leggi()==='necessary') location.reload();
    });
  };

  var c=leggi();
  if(c==='all') caricaTracciamenti();
  else if(!c){
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mostraBanner);
    else mostraBanner();
  }
})();
