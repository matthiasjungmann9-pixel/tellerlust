// App-Dateien: Netzwerk zuerst, damit Updates sofort erscheinen. Offline wird die gespeicherte Version genutzt.
// Fotos: einmal geladen, dann aus dem Speicher (spart Daten und klappt offline).
const V='tellerlust-v5',IMG='tellerlust-fotos',F=['./','./index.html','./recipes.js','./manifest.json','./icon-180.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!==IMG).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request;
 if(r.method!=='GET')return;
 if(/wikimedia\.org$/.test(new URL(r.url).hostname)){
  e.respondWith(caches.open(IMG).then(c=>c.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok||res.type==='opaque')c.put(r,res.clone());return res}))));
  return;
 }
 e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(V).then(x=>x.put(r,c));return res}).catch(()=>caches.match(r)));
});
