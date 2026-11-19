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
    it:{t:'Usiamo cookie tecnici, necessari al funzionamento del sito. Con il tuo consenso usiamo anche cookie di analisi (Google Analytics) e di marketing (Meta Pixel) per capire come migliorare PT Board. Puoi cambiare idea quando vuoi.',p:'Privacy',no:'Rifiuta',si:'Accetta',x:'Chiudi e rifiuta',h:'La tua privacy'},
    en:{t:'We use technical cookies that the site needs to work. With your consent we also use analytics (Google Analytics) and marketing (Meta Pixel) cookies to understand how to improve PT Board. You can change your mind anytime.',p:'Privacy',no:'Reject',si:'Accept',x:'Close and reject',h:'Your privacy'},
    fr:{t:'Nous utilisons des cookies techniques nécessaires au fonctionnement du site. Avec votre accord, nous utilisons aussi des cookies d’analyse (Google Analytics) et marketing (Meta Pixel) pour améliorer PT Board. Vous pouvez changer d’avis à tout moment.',p:'Confidentialité',no:'Refuser',si:'Accepter',x:'Fermer et refuser',h:'Votre vie privée'}
  };
  function lingua(){
    var l=null;
    try{l=localStorage.getItem('pt_landing_lang')||localStorage.getItem('ptboard_lang');}catch(e){}
    // Lingua scelta sul sito o nell'app; altrimenti quella del browser (come fa la landing).
    l=(l||navigator.language||'it').slice(0,2).toLowerCase();
    return TESTI[l]?l:'it';
  }

  // Finestra grande al centro, con lo sfondo scurito. Rifiuta e Accetta hanno la stessa
  // grandezza e la x vale come rifiuto (indicazioni del Garante privacy): non e' un "cookie wall",
  // perche' rifiutando il sito resta usabile come prima.
  function mostraBanner(){
    if(document.getElementById('pt-cookie')) return;
    var T=TESTI[lingua()];
    var font='system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';
    var b=document.createElement('div');
    b.id='pt-cookie';
    b.style.cssText='position:fixed;inset:0;z-index:100001;background:rgba(15,23,42,.55);display:flex;align-items:center;justify-content:center;padding:max(16px,env(safe-area-inset-top,0px)) max(16px,env(safe-area-inset-right,0px)) max(16px,env(safe-area-inset-bottom,0px)) max(16px,env(safe-area-inset-left,0px));font-family:'+font;
    var card=document.createElement('div');
    card.setAttribute('role','dialog');card.setAttribute('aria-modal','true');card.setAttribute('aria-labelledby','pt-cookie-h');
    card.style.cssText='position:relative;width:100%;max-width:520px;max-height:100%;overflow:auto;background:#ffffff;color:#334155;border-radius:20px;box-shadow:0 30px 80px rgba(15,23,42,.35);padding:28px 26px 24px;display:flex;flex-direction:column;gap:16px';
    var h=document.createElement('h2');h.id='pt-cookie-h';h.textContent='🍪 '+T.h;
    h.style.cssText='margin:0;padding-right:28px;font:800 24px/1.2 '+font+';color:#0f172a;letter-spacing:-.01em';
    var p=document.createElement('p');p.style.cssText='margin:0;font:16px/1.6 '+font;
    p.textContent=T.t+' ';
    var a=document.createElement('a');a.href='/privacy.html';a.target='_blank';a.rel='noopener';a.textContent=T.p;a.style.cssText='color:#2563eb;font-weight:700';
    p.appendChild(a);
    var box=document.createElement('div');box.style.cssText='display:flex;gap:10px;flex-wrap:wrap;margin-top:4px';
    function bottone(testo,primario){var x=document.createElement('button');x.type='button';x.textContent=testo;
      x.style.cssText='flex:1 1 140px;min-height:52px;padding:12px 18px;border-radius:12px;font:800 17px '+font+';cursor:pointer;border:2px solid '+(primario?'#2563eb':'#cbd5e1')+';background:'+(primario?'#2563eb':'#ffffff')+';color:'+(primario?'#ffffff':'#0f172a');return x;}
    var no=bottone(T.no,false),si=bottone(T.si,true);
    var chiudi=document.createElement('button');chiudi.type='button';chiudi.setAttribute('aria-label',T.x);chiudi.textContent='×';
    chiudi.style.cssText='position:absolute;top:12px;right:14px;border:none;background:transparent;color:#64748b;font:700 28px/1 '+font+';cursor:pointer;padding:4px 8px';
    function scegli(v){scrivi(v);b.remove();document.removeEventListener('keydown',esc);if(v==='all') caricaTracciamenti();}
    function esc(e){if(e.key==='Escape') scegli('necessary');}
    no.onclick=function(){scegli('necessary');};
    chiudi.onclick=function(){scegli('necessary');};
    si.onclick=function(){scegli('all');};
    document.addEventListener('keydown',esc);
    box.appendChild(no);box.appendChild(si);
    card.appendChild(h);card.appendChild(p);card.appendChild(box);card.appendChild(chiudi);
    b.appendChild(card);
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
