# CLAUDE.md — Contesto progetto PT Board

> Letto automaticamente da Claude Code all'avvio di ogni sessione.
> Fonte di verità del progetto per tutte le sessioni future.
> Aggiornare quando cambia qualcosa di strutturale.

## Panoramica
SaaS/PWA per personal trainer italiani. Dominio: `personaltrainerboard.com`.
Target: PT italiani (anche in espansione EN/FR). App principale PT single-file
in `index.html`; mini-app atleta separata in `atleta.html`; vista cliente
anonima in `share.html` (link `/s/xxx`). Hosting GitHub Pages dal repo
`stevetsala22/ptboard`.

## Stack e hosting
- **Frontend principale**: React 18 + Babel via CDN, **no build, no bundler**. Chart.js, EmailJS, Sentry, GA4, Meta Pixel, Crisp. Tutto embedded.
- **atleta.html / share.html**: JS vanilla (più leggero, no React).
- **Firebase compat 10.7.0**, progetto `ptboard-1`. Firestore + Auth (Google login).
- **Pagamenti**: Stripe tramite 4 Payment Links in `const PLANS` (`index.html:136-141`).
- **Email transazionali**: Brevo, inviate tramite Cloudflare Worker `ptboard-webhook.ptboard-info.workers.dev` (endpoint `/send-email`). Il Worker vive in un repo separato (progetto Cloudflare dell'account `ptboard-info`): qui dentro c'è SOLO il client che chiama `WORKER_URL+'/send-email'` (`index.html:198-230`).
- **PWA**: `sw.js` (cache `ptboard-v65`) + `manifest.json`.
- **Hosting**: GitHub Pages via `.nojekyll` + `CNAME`.

## ⚠️ REGOLE CRITICHE — non violare mai
1. **MAI** `fbDb.enableIndexedDbPersistence()` / `fbDb.enablePersistence()`. Fanno crashare Firebase compat 10.7.0.
2. **Deploy SOLO via GitHub Pages**. MAI Netlify, MAI altri hosting.
3. **Regole Firestore**: modifica SEMPRE prima `firestore.rules` nel repo, POI copia il file intero in Firebase Console → Firestore → Regole. L'editor Console sovrascrive l'intero ruleset: una regola nuova pubblicata senza il resto cancella tutte le altre. Dopo ogni modifica verifica che ci siano TUTTI i blocchi dell'appendice (users, admin, deleteFeedback, sharedClients, athletes, gyms con clients/schede/templates/exercises, publicTemplates, gymsPublic, gymInvites, blocca-tutto).
4. **Nessuna chiave API/segreto nel frontend**. Brevo passa dal Cloudflare Worker; Stripe passa dalle Payment Links. Public keys (Firebase, EmailJS public key, Sentry DSN, GA4, Meta Pixel) sono per design pubbliche e OK in HTML.
5. **Brevo**: email della prova in `ONBOARDING_EMAILS` (modelli Brevo: 1 benvenuto g0, 2 g3, 5 "3 funzioni" g5, 3 g7, 4 "il trial scade tra 5 giorni" g10, 7 "trial scaduto" g15; `maxDay` = oltre quel giorno non si manda piu'). Le chiavi (`day14`, `day25`…) sono storiche e NON corrispondono al giorno: servono a non rimandare email gia' ricevute, non rinominarle. Il modello 8 e' l'email "Novita' schede functional" (invio da pannello admin). Sistemato su richiesta di Steve (nov 2026).
6. **i18n**: ogni nuovo testo UI va aggiunto in **tutte e 3 le lingue** (IT @ `index.html:457`, EN @ 1306, FR @ 2155). Stessa chiave in tutti e tre i blocchi.
7. **Auto-save**: non introdurre logiche che possano sovrascrivere dati remoti con stato locale vuoto. Il guard `loadedFromFirebase` (useRef) blocca il save fin quando `fbLoad` non è completato (vedi §Trappole note).
8. **ADMIN_EMAIL** = `stevetsala22@gmail.com` (hardcoded in `index.html:133`). Attenzione ai typo (NON `tsalasteve22`). Usato sia nel codice che nelle regole Firestore.
9. **`buildSchedaAttuale` (`index.html:4587`) e `buildGiorniDaTutteLeSchede` (`index.html:4611`) devono restare allineate**: se modifichi una, verifica anche l'altra e `share.html`. Entrambe raggruppano gli esercizi per `sezione` ma scrivono/consumano formati diversi (la prima scrive `sharedClients/{sid}.schedaAttuale`, la seconda formatta per la vista share) — un cambio di regola di splitting in una sola delle due produce schede divise male lato cliente.
10. **File asset non eliminare né rinominare**: `dashboard.jpg` e `mobile.jpg` (vecchie anteprime, possono essere in cache su social e link condivisi; l'anteprima attuale di `landing.html` e' `og-image.jpg`, 1200×630); `PTBoard_Guida_Rapida_PT.pdf` è linkato da `index.html`. Nonostante il nome storico, NON sono legacy.
11. **MAI fare merge su `main` senza OK esplicito di Steve.** Steve dice "merge" (o equivalente) e solo allora si procede. "Hai fatto bene a chiedere" non è un via libera.
12. **`fbLoad` nasconde gli errori** (ritorna `null` sia per utente nuovo sia per errore di rete): per decidere se **sbloccare i salvataggi** (`loadedFromFirebase.current=true`, `setDbHydrated(true)`) usa **SEMPRE `fbLoadStrict`** (riga ~165), che lascia propagare l'errore al `.catch()`. L'unlock DEVE stare dentro `.then()`, MAI nel `.finally()`: altrimenti un fault di rete sblocca l'autosave e lo stato locale vuoto sovrascrive i dati remoti.
13. **Prima di modificare codice**, leggere la versione live da `https://raw.githubusercontent.com/stevetsala22/ptboard/main/<file>` oppure il file nel repo locale appena pullato: i numeri di riga si spostano a ogni commit.

## Mappa dei file
- `index.html` — app PT single-file (~11.500 righe). Vedi §Mappa index.html.
- `atleta.html` — mini-app atleta (vanilla JS). Google login, setup scheda, vista palestra con timer di recupero, storico sessioni.
- `share.html` — vista anonima della scheda condivisa dal PT. Un giorno per sezione se multi-day (Upper/Lower, PPL).
- `anim-esercizi.js` + `img/esercizi/` — "Come si esegue": immagini RepDB (libreria gratuita, licenza free tier v1.0) delle due posizioni (`<id>-start.webp`/`<id>-peak.webp`, oppure `<id>-main.webp` per tenute e stretching) che si alternano con dissolvenza. Globale `PTAnim`: `MAP` id esercizio PT Board → id RepDB (225 esercizi, corrispondenze verificate una per una; gli altri non hanno il bottone ▶. Nov 2026: tolti E86, E89, E131, E133, E134, E167, E181 perche' le immagini RepDB non corrispondevano — attrezzo o movimento diverso — e cancellate le immagini rimaste orfane. Mai rimappare un esercizio su un'immagine "simile": meglio nessuna immagine), `FRAMES`, `specFor(ex)`, `has(ex)`, `mount(el, spec, opts)`, `CREDIT`. **Licenza**: obbligatorio il link visibile "Exercise data by RepDB (repdb.co)" (mostrato sotto ogni immagine in app e nel link cliente); vietato ripubblicare le immagini come dataset/API o usarle per generare immagini con AI. In app: `AnimBtn` (ricerca esercizi e scheda espansa) → `AnimModal`. Nel link cliente l'esercizio porta `anim` = id RepDB (da `animSharePatch`, in `buildSchedaAttuale` e `buildGiorniDaTutteLeSchede`): i link creati prima mostrano le immagini dopo un nuovo "Condividi" o una modifica della scheda.
- `404.html` — fallback SPA: cattura `/s/{id}` dal path e redirige a `share.html?id=…` via `sessionStorage`.
- `landing.html` + `landing-i18n.js` — homepage pubblica, sempre chiara: IT scritto nella pagina, EN/FR in `TR` (`landing-i18n.js`) con attributi `data-i18n` (testo), `data-i18n-alt`, `data-i18n-src` (es. PDF per lingua), piu' titolo e meta description. Ogni chiave deve esistere in EN e FR. Screenshot in `img/landing/` (link cliente e PDF in IT/EN/FR). `landing-demo.js` non e' piu' usato dalla landing.
- `blog/index.html`, `blog/valutazione-funzionale-pt-guida-2026.html` — blog SEO.
- `privacy.html`, `terms.html` — pagine legali.
- `cookie-consent.js` — banner cookie e caricamento di Analytics/Pixel dopo il consenso.
- `firestore.rules` — fonte di verità delle regole (poi copiata a mano in Console).
- `sw.js` — service worker PWA (cache `ptboard-v65`).
- `manifest.json`, `icon192.png`, `icon512.png`, `favicon.*` — PWA assets.
- `sitemap.xml`, `robots.txt`, `CNAME`, `.nojekyll` — hosting/SEO.
- `og-image.jpg` — anteprima social di `landing.html` (1200×630). `dashboard.jpg`, `mobile.jpg` — vecchie anteprime, da tenere.
- `PTBoard_Guida_Rapida_PT.pdf` — guida scaricabile, linkata da `index.html`.
- `PTBoard_v8…v13.html`, `PTBoard_v8 (5-7).html`, `PTBoard_Tutorial.html`, `files.zip` — snapshot legacy, NON referenziati dall'app in esecuzione. Clutter nel repo (vedi §Da verificare).

### Mappa `index.html` (range di righe approssimativi)
- 1–120: license, Sentry, cookie banner, GA4, Meta Pixel, SW registration, splash redirect, CDN loader (React/Babel/Chart.js/Firebase compat 10.7.0/EmailJS).
- 122–131: `firebase.initializeApp({projectId:'ptboard-1', …})`, globali `fbAuth`, `fbDb`.
- 133–141: `ADMIN_EMAIL`, `TRIAL_DAYS=15`, `PLANS` (4 Payment Links Stripe).
- 143–163: `fbSaveUserProfile`, `fbGetUserProfile`, `fbGetAllUsers`, `fbSave`, `fbLoad` (helper Firestore).
- 164–196: EmailJS config, `askSendEmail`.
- 197–230: `WORKER_URL`, `ONBOARDING_EMAILS`, `sendBrevoEmail` (POST al Cloudflare Worker).
- 427–429: `SK='fitmanager_v4'`, `load()`, `save()` (localStorage).
- 456–3059: `const LANGS={it,en,fr}` (IT 457, EN 1306, FR 2155).
- 3061–3065: `getLang`, `setLangStore`, `gT`, `exName(ex,lang)`.
- 3070–3098: `NOTIFICHE[]` (campanella), `NOTIF_READ_KEY`, read helpers.
- 3100–3160: tema `C`, tabelle normative test (`mwtNorms`, `stsNorms`, `hgNorms`, `tugNorms`).
- 3163–3450: `stimaTest`.
- 3763–4062: `INIT_EXERCISES` (305 esercizi `E01..E305`, di cui E255–E305 macchine/cavi/multipower/landmine/cardio da palestra, campi `{id, nome:{it,en,fr}, cat, muscoli, desc, livello, equip, primary, move, primarySplit}`).
- 4065–4103: `MUSCOLI_TRANS`, `muscoliLocale`, `livelloLocale`.
- 4104: `INIT_PATIENTS=[]`.
- 4136–4318: Toast, `Avatar`, `FF`, `Modal`, `StatCard`, chart helpers.
- 4319–4579: `Dashboard`, `PatientList`.
- 4580–4610: `generaShareId`, `buildSchedaAttuale`.
- 4611–4665: `buildGiorniDaTutteLeSchede` (sezione-aware per multi-day).
- 4667–6569: `PatientDetail` (anagrafica, test, programma, share modal, log).
- 6570–6700: `PatientForm`.
- 6703–6835: `App` auth gate, `AppInner` state (`loadedFromFirebase=useRef(false)`).
- 6848–6930: effect di caricamento Firebase (hydration try/catch per paziente, patch esercizi mancanti).
- 6938–6967: effetti autosave (gated da `loadedFromFirebase.current`), save su visibilitychange/pagehide.
- 7022–7034: `navItems` (`invite` → "App per il cliente") + modal invito.
- 7418: `generaSchedaAuto`.
- 7538: `classifyExercise`.
- 7549: `exParams` (matrice serie/reps/rec per livello).
- 8067–8205: `trimPerTempo` (3 fasi).
- 8223: `applyVolumeRules`.
- 8236–8252: definizioni split FB / Upper-Lower / PPL.
- 8358: push esercizio con `sezione:day.name, splitCode, category`.
- 8413: push cardio con `note:'Cardio', category:'cardio'`.
- 8623: `testConsigliatiSmart`.
- 8669: `calcolaObiettivoMetrics`.
- 10996: `setPlan` (admin: scrive `plan`, `planType`, `planExpiresAt`).
- 11289: Google login via `firebase.auth.GoogleAuthProvider`.

## Modello dati Firestore
- `users/{uid}` — profilo PT: `{email, plan, planType, planExpiresAt, planExpiredAt?}`. Owner read/write; admin read/write.
- `users/{uid}/appdata/main` — stato PT: `{patients:[…], bookings:[…], exercises:[…], isLight:bool, dataVersion:4}`. Il load lo ignora se `remote.dataVersion < 4` (6851). Autosave gated da `loadedFromFirebase.current`.
- `users/{uid}/appdata/templates` — modelli di scheda del PT: `{list:[scheda+{tplId}], updatedAt}`. Doc separato (non passa dall'autosave), letto al login e scritto a ogni modifica SOLO dopo un load riuscito (`templatesLoaded` ref). Vale anche in spazio palestra (modelli personali del PT). Coperto dalla regola owner `appdata/{docId}`: nessuna modifica alle regole.
- `athletes/{athleteId}/appdata/main` — stato atleta: `{scheda:{giorni:[{nome, esercizi:[{name,serie,reps,rec}], storico?:[…]}], updatedAt}, updatedAt:serverTimestamp, invitedBy:<ptUid|null>, dataVersion:1}`. Scrittura con `{merge:true}`.
- `sharedClients/{shareId}` — vista cliente anonima: `{ownerUid, cliente, ptNome, attivo:true, schedaAttuale:{programma, giorni:[…]}, log:[{data, giorno, esercizi, ts}], createdAt, updatedAt}`. Public read. Update anonimo consentito solo per aggiungere `log[]` e aggiornare `updatedAt`.
- `gyms/{gymId}/templates/{tplId}` e `publicTemplates/{tplId}` — modelli di scheda condivisi (palestra / tutti i PT), vedi Convenzioni.
- `deleteFeedback/{uid}` — feedback cancellazione: write solo da `request.auth.uid == docId`, read solo admin.

`dataVersion`: 4 lato PT, 1 lato atleta, assente in `sharedClients`.

## Funzioni chiave del motore
| Nome | Dove | Cosa fa |
|---|---|---|
| `generaSchedaAuto(params, esercizi)` | index.html:7418 | Entry point auto-generatore. Filtra per livello/equip/patologie, sceglie split (FB / Upper-Lower / PPL), riempie giorni, chiama `applyVolumeRules` e `trimPerTempo`. Ritorna array di scheda. |
| `generaSchedaAuto` con `params.struttura==='circuito'` | index.html (ramo prima di `var days`) | Circuito total body a stazioni (gambe, spinta, tirata, core, anca, spalle, braccia + stazione cardio per obiettivi metabolici), niente bilanciere/stacchi, salti solo per Performance. Parametri per profilo (giri, reps, recEx, recGiri), giri adattati alla durata con `stimaDurataMin`. Un giorno per seduta (max 3, sezione 'Giorno A/B/C'), un blocco circuito per giorno. Se trova meno di 4 esercizi ripiega sulla struttura classica. Struttura consigliata: `strutturaConsigliata(obiettivo)`. |
| `buildSchedaAttuale(p, exercises, lang)` | index.html:4587 | Formatta `schedaAttuale` scritto in `sharedClients/{sid}` per il link `/s/`. |
| `buildGiorniDaTutteLeSchede(p, exercises, lang)` | index.html:4611 | Spezza le schede del paziente in giorni per `share.html`. Se gli esercizi hanno campo `sezione` e >1 sezioni, divide in un giorno per sezione; altrimenti 1 giorno per scheda (comportamento legacy). |
| `trimPerTempo(scheda, budgetSec, minSlots, splitCode)` | index.html (dentro generaSchedaAuto) | Riceve il CODICE del giorno (`fullbody`/`upper`/`lower`/`push`/`pull`/`legs`), non il nome tradotto. (1) rimuove dalla coda small → big → core → fondamentali non protetti; protegge gli schemi essenziali del giorno (Full Body: gambe, tirata, spinta, core, cerniera d'anca; sedute ≤30': solo gambe/tirata/spinta); (2) toglie 1 serie a big/small; (2b) toglie serie ai fondamentali fino a 3 (2 se seduta ≤45'); (3) `overBudget` se ancora >budget*1.15. |
| `calcolaObiettivoMetrics` | index.html:8669 | Per obiettivo + obiettivoStrutturato ritorna `{livello:'green'|'yellow'|'red', messaggio, tassoAttesoSettimana, kcalDelta, durataProgrammaMesi, progressioneRmPct}`. |
| `testConsigliatiSmart` | index.html:8623 | Da età/obiettivo/patologie/BMI/infortuni → subset consigliato degli 11 test funzionali. |
| `classifyExercise(ex)` | index.html:7538 | Ritorna `'compound'|'big'|'small'|'core'`. |
| `applyVolumeRules(dayArr)` | index.html (dentro generaSchedaAuto) | Oltre il 3° fondamentale pesante (`rec>=180`) del giorno l'esercizio resta ma con i parametri da accessorio. |
| `PARAM_OBIETTIVO` / `paramObiettivo(ob)` | script globale | Serie, ripetizioni, recupero per obiettivo × tipo (compound/big/small/core) + `range` e `pct` per il testo del programma. Unica fonte per `exParamsFor` (scheda) e `generaProgramma`: se cambi uno, cambiano entrambi. `exParamsFor` applica poi profilo, attività, durata e SOLO ALLA FINE età e patologie (i limiti di sicurezza non vengono annullati). Ripetizioni arrotondate a 5/6/8/10/12/15/20 (`ripStandard`). |
| `setPlan(uid, plan, duration)` | index.html:10996 | Admin: scrive `plan`, `planType`, `planExpiresAt`. Annuale=370d, mensile=33d. |

## Obiettivi
- Valori canonici (`OBIETTIVI_CANON`): Perdere peso, Aumentare massa, Tonificare, Resistenza, Forza, Salute (mostrato come "Salute e benessere"), Riabilitazione, Performance.
- `Benessere` e' confluito in `Salute` (stesso comportamento del motore): resta valido nei dati vecchi, `getObiettivi` lo legge come `Salute`.
- `Tonificare`: split come ipertrofia, 10-15 rep / 60-90 s (clamp in `exParamsFor`, sotto le regole per patologia), kcal 0.95×TDEE, proteine 1.8 g/kg.

## i18n
- `const LANGS={it:{flag,name,t:{…}}, en:{…}, fr:{…}}` in `index.html:456`. Blocco IT @ 457, EN @ 1306, FR @ 2155.
- Consumo nei componenti: `const T = LANGS[lang]?.t || LANGS.it.t`.
- Esercizi: `ex.nome = {it, en, fr}`. Lookup via `exName(ex,lang)` (`index.html:3064`), fallback IT.
- Muscoli: `MUSCOLI_TRANS` + `muscoliLocale(key,lang)` (4065–4096).
- **Aggiungere un nuovo testo UI**: aprire tutti e 3 i blocchi (IT/EN/FR), aggiungere la stessa chiave in ciascuno. Nessun fallback automatico tra lingue: se manca in EN/FR, viene mostrato `undefined`.
- Landing: IT inline in `landing.html`; EN/FR in `landing-i18n.js` (`TR[lang][key]`). In francese "coach sportif" al posto di "PT".

## Feature "Atleta" (stato)
- ✅ **Fase 1** — bottone "🔗 App per il cliente" nel menu PT (ex "Invita atleta") + `atleta.html` landing mobile-first. Link `atleta.html?inv=<ptUid>`.
- ✅ **Fase 2a** — Google login + wizard setup scheda (1–6 giorni, esercizi con tendine serie/reps/rec). Firestore `athletes/{uid}/appdata/main`.
- ✅ **Fase 2b** — Vista palestra: home con lista giorni → scegli giorno → set con peso/reps/RPE → timer recupero floating + vibrazione → sessione salvata in `scheda.storico[]`.
- ✅ **Autocomplete esercizi** — libreria embedded in `atleta.html` (array `EXERCISE_LIBRARY` @ riga 333, ricerca multi-lingua IT/EN/FR).
- ⏳ **Fase 3** — Collegamento opzionale PT ↔ atleta (atleta invitato può chiedere al PT di seguirlo come cliente).

## Convenzioni di codice osservate
- Terminologia italiana nel dominio: `esercizio`, `scheda`, `giorno`, `serie`, `reps`, `rec` (recupero), `carico`, `sezione`, `obiettivo`, `patologia`, `profilo` (A/B/C/C+).
- ID esercizi `E01..E254` (2 cifre fino a E99, 3 da E105 in poi). Codici scheda `SCH-…`. Share id `<slug>-<rand6>` (`generaShareId`, 4580).
- React: `useState`/`useEffect`/`useRef`. Component tree piatto, `AppInner` tiene lo stato globale, sotto-componenti ricevono props.
- `useRef` come guard anti-race: `loadedFromFirebase`, `firstLoad`. NON rimuovere mai questi guard.
- Styling: stili inline tramite oggetto `C` (CSS variables + hex). Nessun Tailwind, nessun CSS module.
- Modal/toast: hub imperativo (`_toastDispatch`, `showToast`, `showConfirmToast`, `showAskToast`).
- Esercizio auto-generato nel giorno: `{eId, serie, reps, rec, peso:'', note, sezione:day.name, splitCode, category}` (8358). Cardio: `(e.note||'').indexOf('Cardio')!==-1`.
- Campi esercizio opzionali: `repsMode:'time'|'dist'|'cal'` (reps = secondi / metri / calorie; assente = ripetizioni), `perLato:true` ("per lato / per gamba", conta il doppio nella durata), `peso` (carico, testo libero: un numero diventa "N kg" con `fmtCarico`), `nota` (nota del PT, max 80 caratteri, modificabile con un tocco; DIVERSA da `note`, che e' interna al motore es. 'Cardio'), `nomeCustom` (esercizio fuori libreria, `eId:null`), `blocco:<id>`.
- Dose: `DoseControls` (valore + unita' Rip/Tempo/m/cal + "×lato") nella scheda espansa e nell'editor; `CaricoNota` + `TestoInline` sotto il nome. Helper globali: `MODI_DOSE`, `opzioniDose`, `fmtDose`, `fmtDist`, `fmtCarico`, `repsPerLink` (link: "90s", "15 m", "12 cal").
- Blocchi: `scheda.blocchi = {<id>: {tipo, giri, recEx, recGiri, durata?}}`, `TIPI_BLOCCO` = superset, circuito, emom, amrap (a durata: `durata` in minuti, `bloccoADurata`), hyrox (giri senza pause), finisher. Colori `BLOCCO_COLOR`, nomi `nomeTipoBlocco`, spiegazione `bloccoDesc`, parametri `bloccoParametri`. Mai controllare `tipo==='superset'` per dedurre 'circuito': usare `tipoBlocco(bl)`. Gli esercizi di un blocco sono contigui; dentro il blocco serie e rec del singolo esercizio sono ignorati (contano giri e recEx). Helper: `bloccoOf`, `bloccoLabels`, `stimaDurataMin`, `bloccoSharePatch`. Nel link cliente l'esercizio porta `blocco:{id,label,tipo,giri,recEx,recGiri,durata?}` con `serie=giri` (EMOM/AMRAP: serie 1), piu' `lato`, `carico` e `nota`; `share.html` ha i suoi testi per tipo (`bannerTitolo`/`bannerTesto`).
- Parti della seduta e regole: `scheda.regole` / `scheda.progressione` (testo, una frase per riga) e `scheda.parti = {<sezione o '_'>: {risc:{testo,min}, defat:{testo,min}}}` (chiave mai vuota: Firestore non accetta campi vuoti; `chiaveParte`, `parteSeduta`). Nota del blocco: `blocchi[id].nota`. UI: `RegoleProgressione` (scheda espansa + editor), `ParteBox` in testa/fondo a ogni giorno (scheda espansa), `BoxTesto` (✏️ + frasi pronte da i18n separate da '|'). Durata: i minuti del riscaldamento sostituiscono i 5' standard, il defaticamento si aggiunge. Link cliente: ogni giorno porta `regole`, `progressione`, `riscaldamento`, `defaticamento` (`partiPerLink`, `regolePerLink`, in entrambi i builder); `share.html` li mostra in `#partePrima`/`#parteDopo`, FUORI da `#exerciseList`.
- PDF scheda: colonne # · Esercizio (gruppo e livello sotto il nome) · Serie · Rip · Carico · Rec · Note; Carico e Note compaiono solo se almeno un esercizio le usa (`_colCar`, `_colNota`, colspan `_ncol`). Riquadri in alto: Split, durata a seduta (`stimaDurataMin`), numero esercizi, attrezzatura; durate per giorno nel sottotitolo.
- Link cliente: giorni come bottoni (`#dayChips`, fino a 6 giorni; la tendina `#daySelect` resta e riceve l'evento change). Timer nei blocchi EMOM (minuto per minuto, stazione corrente, bip/vibrazione a ogni minuto), AMRAP (conto alla rovescia) e Hyrox (cronometro): `creaTimer`, stato in `blkTimers` per giorno+blocco fuori dal DOM, un solo interval attivo solo mentre un timer gira, schermo tenuto acceso con Wake Lock quando disponibile.
- Spiegazioni (tooltip): attributo `data-tip` su qualsiasi elemento + host globale (IIFE prima di `ordinaPerSezione`, div `#pt-tip`). Su computer compaiono al passaggio del cursore; su telefono si tocca la "i" (`<TipI tip=…/>`, classe `.tip-i`, nascosta sui dispositivi con mouse): il listener in fase di cattura ferma il click, quindi la "i" dentro un bottone non esegue l'azione. Testi `tip*` in IT/EN/FR, `tipBlocco(tipo,T)` per i tipi di blocco.
- Email novita' a tutti i PT: pannello admin, sezione "📣 Email novita'" (`inviaNovita` in `AdminModal`). Si scrive l'ID di un modello Brevo creato da Steve; invio uno alla volta con `sendBrevoEmail`, chi l'ha ricevuta e' salvato in `users/{admin}/appdata/broadcasts` (`tpl<ID>: [uid…]`), quindi niente doppioni. Campanella: `NOTIFICHE` (in cima la piu' recente).
- Modelli di scheda (3 livelli): "Salva come modello" apre `SalvaModelloModal` (nome + "Solo io" / "I PT della mia palestra" / "Tutti i PT"). Solo io: `users/{uid}/appdata/templates` come prima. Palestra: `gyms/{gymId}/templates/{tplId}`; tutti: `publicTemplates/{tplId}`; doc `{tplId, ownerUid, autore, nome, ambito, scheda, createdAt}` con `scheda = schedaPerModello(s)` (solo struttura: esercizi, blocchi, note, regole, progressione, parti, config ridotta a tipo/equip/durata; niente dati del cliente). AppInner unisce i 3 elenchi in `allTemplates` (`_scope`, `_autore`, `_mine`); "Parti da" li mostra in 3 gruppi; elimina solo chi puo' (autore, owner palestra, admin per i pubblici). "Parti da" copia anche regole, progressione e parti della seduta.
- Importa scheda: bottone "📥 Importa scheda" accanto a "Nuova scheda" (PatientDetail). File .json o testo incollato `{ptboard:'scheda', v:1, scheda:{nome, regole, progressione, parti, blocchi, esercizi:[{eId?, nome, serie, reps, repsMode?, perLato?, rec, peso, nota, sezione, blocco}]}}`. `importaScheda(raw, lib)` (script globale) tiene solo i campi noti con tipi e lunghezze controllati, collega gli esercizi per `eId` o per nome (IT/EN/FR/kw, `normTesto`), altrimenti `nomeCustom`; nuovi id ai blocchi. La scheda si apre in `SchedaModal` (prop `titolo`) per il controllo prima del salvataggio. Nello script globale non ci sono `exName`/`fmtDate` (stanno nello script Babel).
- Storico sessioni atleta: `scheda.storico[]`.
- Durata stimata: calcolo UNICO nello script globale (`durateSedute`, `stimaDurataMin(scheda, lib)` = seduta piu' lunga, `testoDurata`, `tempoVoceSec`, `classificaEsercizio` + `COMPOUND_KEYWORDS`). Lo usano generatore (`tempoEsercizioSec`/`classifyExercise` delegano qui), scheda espansa, editor e PDF, sempre calcolato dalla scheda attuale (non da `config.tempoStimato`). Per seduta (una sezione = un giorno): riscaldamento 5' + preparazione per tipo + serie × lavoro (3 s/rep, 4 compound, 2 core; secondi se `repsMode:'time'`; cardio in minuti) + recuperi; blocchi: 60 s + giri × stazioni + recuperi.
- Schede su piu' giorni (sezioni, es. circuito 'Giorno A/B/C', Upper/Lower): un esercizio aggiunto va sotto il suo giorno, mai in fondo alla scheda. Scheda espansa: bottoni "+ Esercizio in {giorno}" / "+ Superset" / "+ Circuito" in fondo a ogni giorno (`multiGiorno`, `pickTarget.sezione`); editor: inserimento dopo l'ultimo esercizio del giorno attivo. `ordinaPerSezione` + `sezioniSpezzate`: `patchScheda` e il salvataggio dell'editor riordinano; le schede gia' "spezzate" vengono riordinate e salvate all'apertura del cliente.
- Tempi e recuperi: salvati sempre in secondi, mostrati con `fmtSec(n)` ("45s", "1min", "1min 30s", "2min") in tendine, blocchi, PDF; `share.html` ha la sua `fmtSec`/`fmtT` e formatta solo in visualizzazione (i dati nel link restano "90s": `isTimed` li legge cosi'). Valori della tendina Tempo: `TEMPO_OPZIONI` (5s→55s ogni 5s, 1→5min ogni 15s, 6→60min ogni minuto). Esercizio a tempo: selettore `RepsTimeToggle` ("Rip | Tempo", testi `modeReps/modeTime`) nella scheda espansa e nell'editor.
- Spazio Palestra (`isGymLite` in PatientDetail, `isGym` in AppInner): nei documenti per il cliente NIENTE profilo "Forma Bassa/Media/Buona/Ottima" ne' punteggio: PDF scheda, PDF valutazione, report del wizard di valutazione, email di valutazione. Il PT lo vede comunque nell'app. Per i PT normali invariato.
- Ricerca esercizi (modal di ricerca e pagina Esercizi): `matchEsercizio(ex, query)` nello script globale. Cerca su nome IT/EN/FR + `kw` + muscoli, senza accenti/trattini (`normTesto`), parole in qualsiasi ordine, singolare/plurale (`radiceParola`), parole attaccate o staccate, sinonimi da palestra (`SINONIMI_RICERCA`); un codice tipo `E23` trova solo quell'esercizio.
- Riuso schede: `copiaScheda` (copia indipendente, nuovo codice, senza `_sid`/metadati) usata da "Assegna ad altri clienti" (`assignSchedaToClients` in AppInner) e "Salva come modello". "Modifica scheda" apre `SchedaModal` con `initial` (stesso codice/`_sid`, sostituisce la scheda) e aggiorna `sharedClients/{shareId}.schedaAttuale` se il link esiste (`aggiornaLinkCliente`). `tipoDaScheda` sceglie il tipo editor solo se le sezioni coincidono, altrimenti `Custom` con le sezioni della scheda.

## ⚠️ Trappole note (NON ripeterle)
- **Firestore rules trap**: la Console sovrascrive l'intero ruleset. Pubblicare un blocco nuovo senza il resto cancella write admin su `users/`, `deleteFeedback`, `athletes/`, `sharedClients/` → attivazione piani / inviti rotti. SEMPRE copia-incolla del `firestore.rules` INTERO.
- **Race `loadedFromFirebase`** (`index.html:6796-6948`): useRef inizializzato a `false`, diventa `true` solo nel `.finally` di `fbLoad`. L'autosave bail-outa finché è `false`. Senza questo guard, uno stato vuoto `[]` può sovrascrivere i dati veri (bug "lista clienti vuota di Luccia"). Mai rimuovere.
- **Hydration pazienti**: la `.map` di hydration è avvolta in `try/catch` per singolo paziente (`index.html:6848-6930`). Un paziente malformato non deve far crollare l'intera lista.
- **Aggiornamenti PWA**: niente `location.reload()` automatico su `controllerchange`/`SW_UPDATED` (faceva "riavviare da sola" l'app a ogni deploy, perdendo cio' che il PT stava scrivendo). Ora compare l'avviso `#pt-update-banner` ("Nuova versione disponibile · Aggiorna", testi `updAvail/updBtn/updLater`), solo se c'era gia' un service worker attivo (non al primo avvio).
- **StatCard**: il conteggio animato usa lo stato React e si riavvia a ogni cambio di valore. Mai scrivere il numero nel DOM con `textContent`: i clienti arrivano da Firebase dopo il mount e il riquadro restava a 0.
- **Tema chiaro di default**: `isLight` vale `true` salvo scelta esplicita in Personalizza. La scelta (`scegliTema`) si salva nel PROFILO `users/{uid}.tema` ('light'|'dark') e in `localStorage.ptb_tema`, cosi' vale anche in Spazio Palestra (dove `appdata/main` non si salva) e su altri dispositivi; vecchio fallback `appdata/main.themeChosen`. Aprire Personalizza senza cambiare non e' una scelta. Uno script in testa a `index.html` mette la classe `light` prima di React (niente lampo scuro). Login, verifica email, paywall, piani, lingua, codice palestra e caricamento sono chiari (colori fissi nei componenti). Il pannello admin resta scuro.
- **Cookie e tracciamenti**: `cookie-consent.js` (landing, app, blog) mostra il banner e carica Google Analytics e Meta Pixel SOLO dopo "Accetta". Prima del consenso `gtag`/`fbq` sono funzioni vuote. Scelta in `localStorage.ptboard_cookies_consent` ('all' / 'necessary'); riapertura con `window.ptCookieSettings()` (link "Preferenze cookie" nel footer della landing, "Cookie" nella barra laterale dell'app). Mai rimettere gli script di GA/Pixel direttamente nelle pagine.
- **Piano gratuito**: finita la prova (o scaduto un piano pagato, `plan:'blocked'` con `planExpiredAt`) il PT entra comunque con `gratuito=true` (calcolato nel gate di `App`): `addClient` si ferma a `CLIENTI_GRATIS` (3) clienti, i clienti oltre i primi 3 mostrano un riquadro "Passa a Pro" al posto della scheda, banner in alto. Restano bloccati dal Paywall: Spazio Palestra senza piano e `blocked` messo a mano dall'admin (senza `planExpiredAt`).
- **Crescita**: "Invita un collega" (`InvitaModal`, link `landing.html?ref=<uid>`; `?ref` salvato in `localStorage.ptb_ref` da landing e dalla testa di `index.html`; alla registrazione `campoInvito()` scrive `invitatoDa` nel profilo). Premio manuale nel pannello admin: bottone "Premia" (+33 giorni all'invitato e all'invitante, `referralPremiato:true`). Pannello admin "Andamento · ultimi 7 giorni" (nuovi, attivi da `users.lastSeenAt`, % paganti, invitati); `lastSeenAt` scritto al massimo ogni 12 ore. Link cliente: firma "Scheda creata con PT Board · crea le tue schede gratis" (`#ptbFirma`), sostituita da un link neutro per le palestre.
- **Landing e accesso**: su `/` chi non e' collegato (nessun `localStorage.ptboard_uid`) va a `/landing.html`, salvo arrivo da una pagina del sito (referrer), app installata (PWA standalone), `?login=1`, `?join=`, `?gym=1`. I link "Accedi"/"App" del sito puntano a `/?login=1`; logo e "Torna al sito" a `/landing.html`. Il logout usa `esciVersoLanding()` (signOut + landing; nella PWA resta il login). Non togliere `ptboard_uid` dal login: e' il segnale "collegato".
- **sw.js precache obsoleto**: `sw.js` fa precache di `/landing.html`. Dopo una modifica a `landing.html`, bump `const CACHE='ptboard-v##'` altrimenti l'app serve la versione in cache fino alla naturale invalidazione.
- **Plan expiry side-effect** in `loadProfile` (6710–6714): per ogni utente pro/team non-admin con `planExpiresAt < now`, viene scritto `plan='blocked'` al login. Idempotente ma genera una write per utente scaduto.
- **Autogenerato**: `trimPerTempo` riceve `day.splitCode` (non `day.name`, che e' tradotto). Negli slot di forza niente esercizi di categoria Mobilita (stretching), niente core negli slot non-core, niente due varianti della stessa famiglia (`famigliaEsercizio`, `FAMIGLIE_ESERCIZI`). Full Body: squat + tirata + spinta + cerniera d'anca + spalle + core per tutti (anche donne: il petto c'e'). Programma: niente % di carico fisse a settimana; carico espresso come ripetizioni di riserva (RPE); adattamento 2 settimane per il profilo A (serie ridotte), 1 per gli altri (B una serie in meno); doppia progressione; settimana 4 = scarico (B/C/C+) o verifica con i test (profilo A e riabilitazione, `weekCheck`). Massa: cardio leggero continuo, fondamentali caricabili (niente squat al cavo, goblet, ecc.).

## Workflow di sviluppo
1. Steve scrive un briefing (prompt completo in markdown, caricato come file).
2. Claude applica le MOD richieste come **sostituzioni di testo esatte** (TROVA/SOSTITUISCI). Niente riscritture di parti non richieste.
3. Branch per feature (`feature/<nome>` o `fix/<nome>`), un commit per sessione quando possibile.
4. Push a `origin/<branch>`, Steve dice "merge" quando vuole.
5. Merge su `main` → GitHub Pages fa deploy automatico dalla root del repo.
6. Nessun PR formale a meno che Steve non lo chieda; preferenza: merge locale e push diretto.
7. Attribution commit: `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>` + link sessione.

## Contatti
- Admin: `stevetsala22@gmail.com`
- Supporto cliente: `ptboard.info@gmail.com`

## Librerie esercizi (due, separate)
- **`index.html`** — `INIT_EXERCISES`: **305 esercizi** `E01..E305`, oggetti `{id, nome:{it,en,fr}, cat, muscoli, desc, livello, equip, primary, move, primarySplit}`. Fonte di verità per PT, auto-generatore, condivisione. Le macchine hanno nome generico; la marca (es. Technogym Selection/Pure Strength/Kinesis) compare solo come esempio nella descrizione. Nomi IT tradotti dove esiste un nome italiano usato in palestra; restano in inglese i termini standard (Squat, Leg Press, Hip Thrust, Plank…). Gli esercizi tradotti hanno `kw:<nome storico inglese>`: il generatore cerca le parole chiave su `nomeChiave(ex)` = `kw || nome.it`, cosi' esclusioni e preferenze basate sul nome restano identiche. Al login, gli esercizi salvati dal PT con il nome vecchio vengono aggiornati (solo se il nome non e' stato cambiato a mano).
- **Esercizi creati dal PT**: `buildCustomExercise` → id `U…`, `custom:true`, nome uguale in IT/EN/FR, `move`/`primarySplit`/`cat` ricavati dal gruppo muscolare (`PRIMARY_META`). Salvati da `addLibraryExercise` (AppInner) in `exercises` (spazio PT, autosave) o in `gyms/{gymId}/exercises` (palestra). Entrano nella ricerca (badge "Tuo") e nel generatore. Sulla scheda l'esercizio porta anche `nomeCustom` come nome di riserva.
- **`atleta.html`** — `EXERCISE_LIBRARY` (`atleta.html:333`): **222 nomi** `{it,en,fr}`. Lista separata, usata solo per l'autocomplete del wizard setup scheda atleta. **I nomi NON sono allineati** alla libreria principale di `index.html` (sono stati inseriti a mano, molti coincidono ma la copertura è parziale).

## Da verificare (incongruenze trovate nel repo)
- **TODO: generare `EXERCISE_LIBRARY` di `atleta.html` dai 254 di `index.html`** — serve uno script/one-shot che estragga `INIT_EXERCISES[].nome` e lo rigetti dentro `atleta.html:333` così le due liste restano sincronizzate (oggi divergono: 254 vs 222, con nomi non 1:1).
- **Working notes stale**: `i18n_audit.md` cita "10316 righe" (oggi `index.html` ne ha 11525); `exercises_translation_preview.md` è labelled "Batch H". Entrambi probabilmente obsoleti (candidati alla rimozione).
- **Rules duplicate match**: `firestore.rules` ha due blocchi `match /users/{userId}` (owner + admin, righe 6–11 e 14–17). Funziona (Firestore fa union delle match). **Deciso: lasciare invariato**.

---

## APPENDICE — Regole Firestore correnti (fonte di verità)
> Copia tutto il blocco qui sotto (da `rules_version` a `}` finale) in Firebase Console → Firestore → Regole quando pubblichi modifiche. Aggiorna questa appendice ogni volta che `firestore.rules` cambia.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ── USERS COLLECTION ──
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      match /appdata/{docId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }

    // ── ADMIN: lettura e scrittura tutti gli utenti ──
    match /users/{userId} {
      allow read, write: if request.auth != null
                && request.auth.token.email == 'stevetsala22@gmail.com';
    }

    // ── ADMIN: anche le sub-collection ──
    match /users/{userId}/appdata/{docId} {
      allow read, write: if request.auth != null
                && request.auth.token.email == 'stevetsala22@gmail.com';
    }

    // ── DELETE FEEDBACK ──
    match /deleteFeedback/{docId} {
      allow write: if request.auth != null && request.auth.uid == docId;
      allow read: if request.auth != null
                && request.auth.token.email == 'stevetsala22@gmail.com';
    }

    // ── SHARED CLIENTS ──
    match /sharedClients/{shareId} {
      allow read: if true;
      allow create: if request.auth != null
                    && request.resource.data.ownerUid == request.auth.uid;
      allow update: if request.auth != null
                    && resource.data.ownerUid == request.auth.uid;
      allow update: if request.auth == null
                    && request.resource.data.ownerUid == resource.data.ownerUid
                    && request.resource.data.cliente == resource.data.cliente
                    && request.resource.data.ptNome == resource.data.ptNome
                    && request.resource.data.attivo == resource.data.attivo
                    && request.resource.data.schedaAttuale == resource.data.schedaAttuale
                    && request.resource.data.createdAt == resource.data.createdAt
                    && resource.data.attivo == true;
      allow delete: if request.auth != null
                    && resource.data.ownerUid == request.auth.uid;
    }

    // ── ATHLETES COLLECTION ──
    match /athletes/{athleteId} {
      allow read, write: if request.auth != null && request.auth.uid == athleteId;
      match /appdata/{docId} {
        allow read, write: if request.auth != null && request.auth.uid == athleteId;
      }
    }

    // ── GYMS (Spazio Palestra) ──
    // Vedi docs/GYM_PLAN.md §C per il razionale di sicurezza.
    match /gyms/{gymId} {
      // Lettura: solo membri del gym.
      allow read: if request.auth != null
                  && resource.data.members.hasAny([request.auth.uid]);

      // Create: il fondatore e' owner e UNICO membro iniziale.
      allow create: if request.auth != null
                    && request.resource.data.ownerUid == request.auth.uid
                    && request.resource.data.members == [request.auth.uid]
                    && request.resource.data.memberRoles[request.auth.uid] == 'owner';

      // (A) Update dell'owner: puo' cambiare tutto EXCETTO ownerUid.
      allow update: if request.auth != null
                    && resource.data.ownerUid == request.auth.uid
                    && request.resource.data.ownerUid == resource.data.ownerUid;

      // (B) Update dell'admin: stessa clausola di invarianza su ownerUid.
      allow update: if request.auth != null
                    && request.auth.token.email == 'stevetsala22@gmail.com'
                    && request.resource.data.ownerUid == resource.data.ownerUid;

      // (C) Self-join di un PT invitato: diff SOLO su members + memberRoles + memberInfo + joinCode.
      // Verifica che il PT aggiunga SOLO il proprio uid, con ruolo 'trainer',
      // e che il codice usato (joinCode) esista come doc gymInvites/{joinCode}
      // attivo, non scaduto, e punti a questo gymId. ownerUid immutabile.
      // SECURITY: le diff di memberRoles e memberInfo devono toccare SOLO la
      // chiave del chiamante — un attaccante non puo' promuoversi owner,
      // degradare un altro membro o alterare nome/email di qualcun altro.
      allow update: if request.auth != null
                    && request.resource.data.diff(resource.data).affectedKeys()
                         .hasOnly(['members','memberRoles','memberInfo','joinCode'])
                    && request.resource.data.ownerUid == resource.data.ownerUid
                    && !(request.auth.uid in resource.data.members)
                    && request.resource.data.members == resource.data.members.concat([request.auth.uid])
                    && request.resource.data.memberRoles[request.auth.uid] == 'trainer'
                    && request.resource.data.memberRoles.diff(resource.data.memberRoles).affectedKeys().hasOnly([request.auth.uid])
                    && request.resource.data.memberInfo.diff(resource.data.memberInfo).affectedKeys().hasOnly([request.auth.uid])
                    && exists(/databases/$(database)/documents/gymInvites/$(request.resource.data.joinCode))
                    && get(/databases/$(database)/documents/gymInvites/$(request.resource.data.joinCode)).data.gymId == gymId
                    && get(/databases/$(database)/documents/gymInvites/$(request.resource.data.joinCode)).data.status == 'active'
                    && get(/databases/$(database)/documents/gymInvites/$(request.resource.data.joinCode)).data.expiresAt > request.time;

      allow delete: if request.auth != null
                    && resource.data.ownerUid == request.auth.uid;

      // Clienti del gym: tutti i membri possono CRUD.
      match /clients/{clientId} {
        allow read, create, update, delete: if request.auth != null
          && get(/databases/$(database)/documents/gyms/$(gymId)).data.members.hasAny([request.auth.uid]);

        // Schede del cliente.
        match /schede/{schedaId} {
          allow read, create, update, delete: if request.auth != null
            && get(/databases/$(database)/documents/gyms/$(gymId)).data.members.hasAny([request.auth.uid]);
        }
      }

      // Modelli di scheda condivisi con i PT della palestra.
      // Leggono tutti i membri; si crea solo a proprio nome; l'autore modifica (senza cambiare
      // autore); eliminano l'autore o l'owner della palestra.
      match /templates/{tplId} {
        allow read: if request.auth != null
          && get(/databases/$(database)/documents/gyms/$(gymId)).data.members.hasAny([request.auth.uid]);
        allow create: if request.auth != null
          && request.resource.data.ownerUid == request.auth.uid
          && request.resource.data.keys().hasOnly(['tplId','ownerUid','autore','nome','ambito','scheda','createdAt'])
          && get(/databases/$(database)/documents/gyms/$(gymId)).data.members.hasAny([request.auth.uid]);
        allow update: if request.auth != null
          && resource.data.ownerUid == request.auth.uid
          && request.resource.data.ownerUid == resource.data.ownerUid
          && request.resource.data.keys().hasOnly(['tplId','ownerUid','autore','nome','ambito','scheda','createdAt']);
        allow delete: if request.auth != null
          && (resource.data.ownerUid == request.auth.uid
              || get(/databases/$(database)/documents/gyms/$(gymId)).data.ownerUid == request.auth.uid);
      }

      // Libreria esercizi condivisa della palestra: override di INIT_EXERCISES
      // o nuovi esercizi custom. Stesso accesso dei clienti (tutti i membri).
      match /exercises/{exId} {
        allow read, create, update, delete: if request.auth != null
          && get(/databases/$(database)/documents/gyms/$(gymId)).data.members.hasAny([request.auth.uid]);
      }
    }

    // ── MODELLI DI SCHEDA PER TUTTI I PT ──
    // Leggibili da ogni utente loggato; si crea solo a proprio nome; l'autore modifica;
    // eliminano l'autore o l'admin (moderazione).
    match /publicTemplates/{tplId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null
                    && request.resource.data.ownerUid == request.auth.uid
                    && request.resource.data.keys().hasOnly(['tplId','ownerUid','autore','nome','ambito','scheda','createdAt']);
      allow update: if request.auth != null
                    && resource.data.ownerUid == request.auth.uid
                    && request.resource.data.ownerUid == resource.data.ownerUid
                    && request.resource.data.keys().hasOnly(['tplId','ownerUid','autore','nome','ambito','scheda','createdAt']);
      allow delete: if request.auth != null
                    && (resource.data.ownerUid == request.auth.uid
                        || request.auth.token.email == 'stevetsala22@gmail.com');
    }

    // ── GYMS PUBLIC MIRROR (branding visibile ai clienti anonimi) ──
    // Snapshot di gyms/{gymId} ridotto a {gymId, nome, logo, theme}, usato
    // da atleta.html (anonimo pre-login) per applicare il tema della palestra.
    // Public read; write solo dall'owner del corrispondente gyms/{gymId}.
    match /gymsPublic/{gymId} {
      allow read: if true;
      allow create, update: if request.auth != null
        && get(/databases/$(database)/documents/gyms/$(gymId)).data.ownerUid == request.auth.uid;
      allow delete: if request.auth != null
        && get(/databases/$(database)/documents/gyms/$(gymId)).data.ownerUid == request.auth.uid;
    }

    // ── INVITI PT (codice 6 char = document id) ──
    match /gymInvites/{inviteId} {
      // Owner crea l'invito. status='active', expiresAt entro 30 giorni.
      // SECURITY: solo l'owner della palestra bersaglio puo' crearne inviti
      // (un trainer o un estraneo loggato non puo' emettere inviti per gyms altrui).
      allow create: if request.auth != null
                    && request.resource.data.invitedByUid == request.auth.uid
                    && request.resource.data.status == 'active'
                    && request.resource.data.expiresAt is timestamp
                    && request.resource.data.expiresAt > request.time
                    && request.resource.data.expiresAt < request.time + duration.value(30, 'd')
                    && get(/databases/$(database)/documents/gyms/$(request.resource.data.gymId)).data.ownerUid == request.auth.uid;

      // GET consentito a chiunque loggato (serve all'accept per validare).
      // NESSUN list: enumerazione collezione proibita.
      allow get: if request.auth != null;

      // Update: solo owner originale puo' revocare/cambiare la scadenza.
      // invitedByUid e gymId immutabili.
      allow update: if request.auth != null
                    && resource.data.invitedByUid == request.auth.uid
                    && request.resource.data.invitedByUid == resource.data.invitedByUid
                    && request.resource.data.gymId == resource.data.gymId;

      allow delete: if request.auth != null
                    && resource.data.invitedByUid == request.auth.uid;
    }

    // ── BLOCCA TUTTO IL RESTO ──
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```
