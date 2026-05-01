const CACHE='ptboard-v55';
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
    caches.open(CACHE).then(c=>
      Promise.all(
        ASSETS.map(url=>
          fetch(url,{cache:'no-store'}).then(res=>{
            if(!res.ok) throw new Error('Failed to fetch '+url);
            return c.put(url,res);
          })
        )
      )
    ).then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(
      keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))
    )).then(()=>self.clients.claim()).then(()=>{
      self.clients.matchAll({type:'window'}).then(clients=>{
        clients.forEach(c=>c.postMessage({type:'SW_UPDATED'}));
      });
    })
  );
});

self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  if(e.request.method!=='GET') return;
  if(url.origin!==location.origin){
    e.respondWith(
      caches.match(e.request).then(cached=>{
        if(cached) return cached;
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
  e.respondWith(
    fetch(e.request,{cache:'no-store'}).then(res=>{
      if(res.ok){
        const clone=res.clone();
        caches.open(CACHE).then(c=>c.put(e.request,clone));
      }
      return res;
    }).catch(()=>caches.match(e.request))
  );
});
