const CACHE='ptboard-v6';
const ASSETS=[
  '/',
  '/index.html',
  '/landing.html',
  '/manifest.json',
  '/icon192.png',
  '/icon512.png'
];

self.addEventListener('install',e=>{
  e.waitUntil(
    caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(
      keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))
    )).then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  // Skip non-GET and cross-origin requests
  if(e.request.method!=='GET')return;
  if(url.origin!==location.origin){
    // For CDN resources (React, Babel, Firebase, etc.) - cache first, network fallback
    e.respondWith(
      caches.match(e.request).then(cached=>{
        if(cached)return cached;
        return fetch(e.request).then(res=>{
          if(res.ok){
            const clone=res.clone();
            caches.open(CACHE).then(c=>c.put(e.request,clone));
          }
          return res;
        }).catch(()=>cached);
      })
    );
    return;
  }
  // Local assets - network first, cache fallback
  e.respondWith(
    fetch(e.request).then(res=>{
      if(res.ok){
        const clone=res.clone();
        caches.open(CACHE).then(c=>c.put(e.request,clone));
      }
      return res;
    }).catch(()=>caches.match(e.request))
  );
});
