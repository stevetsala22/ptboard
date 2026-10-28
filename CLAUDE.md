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
- **PWA**: `sw.js` (cache `ptboard-v55`) + `manifest.json`.
- **Hosting**: GitHub Pages via `.nojekyll` + `CNAME`.

## ⚠️ REGOLE CRITICHE — non violare mai
1. **MAI** `fbDb.enableIndexedDbPersistence()` / `fbDb.enablePersistence()`. Fanno crashare Firebase compat 10.7.0.
2. **Deploy SOLO via GitHub Pages**. MAI Netlify, MAI altri hosting.
3. **Regole Firestore**: modifica SEMPRE prima `firestore.rules` nel repo, POI copia il file intero in Firebase Console → Firestore → Regole. L'editor Console sovrascrive l'intero ruleset: una regola nuova pubblicata senza il resto cancella tutte le altre. Dopo ogni modifica verifica che ci siano TUTTI i 7 blocchi (vedi §Firestore rules).
4. **Nessuna chiave API/segreto nel frontend**. Brevo passa dal Cloudflare Worker; Stripe passa dalle Payment Links. Public keys (Firebase, EmailJS public key, Sentry DSN, GA4, Meta Pixel) sono per design pubbliche e OK in HTML.
5. **Brevo**: in `ONBOARDING_EMAILS` (`index.html:199-206`) i template id **4 e 5 sono invertiti rispetto al giorno** (`templateId:5 → day14`, `templateId:4 → day25`). È voluto, allineato alle configurazioni Brevo. NON "correggere" senza istruzione esplicita di Steve.
6. **i18n**: ogni nuovo testo UI va aggiunto in **tutte e 3 le lingue** (IT @ `index.html:457`, EN @ 1306, FR @ 2155). Stessa chiave in tutti e tre i blocchi.
7. **Auto-save**: non introdurre logiche che possano sovrascrivere dati remoti con stato locale vuoto. Il guard `loadedFromFirebase` (useRef) blocca il save fin quando `fbLoad` non è completato (vedi §Trappole note).
8. **ADMIN_EMAIL** = `stevetsala22@gmail.com` (hardcoded in `index.html:133`). Attenzione ai typo (NON `tsalasteve22`). Usato sia nel codice che nelle regole Firestore.
9. **`buildSchedaAttuale` (`index.html:4587`) e `buildGiorniDaTutteLeSchede` (`index.html:4611`) devono restare allineate**: se modifichi una, verifica anche l'altra e `share.html`. Entrambe raggruppano gli esercizi per `sezione` ma scrivono/consumano formati diversi (la prima scrive `sharedClients/{sid}.schedaAttuale`, la seconda formatta per la vista share) — un cambio di regola di splitting in una sola delle due produce schede divise male lato cliente.
10. **File asset non eliminare né rinominare**: `dashboard.jpg` e `mobile.jpg` sono usati come `og:image` da `landing.html`; `PTBoard_Guida_Rapida_PT.pdf` è linkato da `index.html`. Nonostante il nome storico, NON sono legacy.
11. **Prima di modificare codice**, leggere la versione live da `https://raw.githubusercontent.com/stevetsala22/ptboard/main/<file>` oppure il file nel repo locale appena pullato: i numeri di riga si spostano a ogni commit.

## Mappa dei file
- `index.html` — app PT single-file (~11.500 righe). Vedi §Mappa index.html.
- `atleta.html` — mini-app atleta (vanilla JS). Google login, setup scheda, vista palestra con timer di recupero, storico sessioni.
- `share.html` — vista anonima della scheda condivisa dal PT. Un giorno per sezione se multi-day (Upper/Lower, PPL).
- `404.html` — fallback SPA: cattura `/s/{id}` dal path e redirige a `share.html?id=…` via `sessionStorage`.
- `landing.html` + `landing-i18n.js` + `landing-demo.js` — homepage pubblica (IT inline, EN/FR da `window.TR`).
- `blog/index.html`, `blog/valutazione-funzionale-pt-guida-2026.html` — blog SEO.
- `privacy.html`, `terms.html` — pagine legali.
- `firestore.rules` — fonte di verità delle regole (poi copiata a mano in Console).
- `sw.js` — service worker PWA (cache `ptboard-v55`).
- `manifest.json`, `icon192.png`, `icon512.png`, `favicon.*` — PWA assets.
- `sitemap.xml`, `robots.txt`, `CNAME`, `.nojekyll` — hosting/SEO.
- `dashboard.jpg`, `mobile.jpg` — immagini `og:image` referenziate da `landing.html`.
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
- 3763–4062: `INIT_EXERCISES` (254 esercizi `E01..E254`, campi `{id, nome:{it,en,fr}, cat, muscoli, desc, livello, equip, primary, move, primarySplit}`).
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
- `athletes/{athleteId}/appdata/main` — stato atleta: `{scheda:{giorni:[{nome, esercizi:[{name,serie,reps,rec}], storico?:[…]}], updatedAt}, updatedAt:serverTimestamp, invitedBy:<ptUid|null>, dataVersion:1}`. Scrittura con `{merge:true}`.
- `sharedClients/{shareId}` — vista cliente anonima: `{ownerUid, cliente, ptNome, attivo:true, schedaAttuale:{programma, giorni:[…]}, log:[{data, giorno, esercizi, ts}], createdAt, updatedAt}`. Public read. Update anonimo consentito solo per aggiungere `log[]` e aggiornare `updatedAt`.
- `deleteFeedback/{uid}` — feedback cancellazione: write solo da `request.auth.uid == docId`, read solo admin.

`dataVersion`: 4 lato PT, 1 lato atleta, assente in `sharedClients`.

## Funzioni chiave del motore
| Nome | Dove | Cosa fa |
|---|---|---|
| `generaSchedaAuto(params, esercizi)` | index.html:7418 | Entry point auto-generatore. Filtra per livello/equip/patologie, sceglie split (FB / Upper-Lower / PPL), riempie giorni, chiama `applyVolumeRules` e `trimPerTempo`. Ritorna array di scheda. |
| `buildSchedaAttuale(p, exercises, lang)` | index.html:4587 | Formatta `schedaAttuale` scritto in `sharedClients/{sid}` per il link `/s/`. |
| `buildGiorniDaTutteLeSchede(p, exercises, lang)` | index.html:4611 | Spezza le schede del paziente in giorni per `share.html`. Se gli esercizi hanno campo `sezione` e >1 sezioni, divide in un giorno per sezione; altrimenti 1 giorno per scheda (comportamento legacy). |
| `trimPerTempo(scheda, budgetSec, minSlots, splitDayName)` | index.html:8067 | 3 fasi: (1) rimuove small/big/core dalla coda ma protegge 1 push + 1 pull + 1 legs + 1 core quando `splitDayName==='Full Body'`; (2) scala di 1 serie i big/small (mai compound/core) fino a 8 iterazioni; (3) imposta `overBudget` se ancora >budget*1.15. Ritorna `{esercizi, tempoSec, trimmed, scaled, overBudget}`. |
| `calcolaObiettivoMetrics` | index.html:8669 | Per obiettivo + obiettivoStrutturato ritorna `{livello:'green'|'yellow'|'red', messaggio, tassoAttesoSettimana, kcalDelta, durataProgrammaMesi, progressioneRmPct}`. |
| `testConsigliatiSmart` | index.html:8623 | Da età/obiettivo/patologie/BMI/infortuni → subset consigliato degli 11 test funzionali. |
| `classifyExercise(ex)` | index.html:7538 | Ritorna `'compound'|'big'|'small'|'core'`. |
| `applyVolumeRules(dayArr)` | index.html:8223 | Taglia tutto ciò che segue il 2° compound pesante (`rec>=180`) nello stesso giorno. |
| `setPlan(uid, plan, duration)` | index.html:10996 | Admin: scrive `plan`, `planType`, `planExpiresAt`. Annuale=370d, mensile=33d. |

## i18n
- `const LANGS={it:{flag,name,t:{…}}, en:{…}, fr:{…}}` in `index.html:456`. Blocco IT @ 457, EN @ 1306, FR @ 2155.
- Consumo nei componenti: `const T = LANGS[lang]?.t || LANGS.it.t`.
- Esercizi: `ex.nome = {it, en, fr}`. Lookup via `exName(ex,lang)` (`index.html:3064`), fallback IT.
- Muscoli: `MUSCOLI_TRANS` + `muscoliLocale(key,lang)` (4065–4096).
- **Aggiungere un nuovo testo UI**: aprire tutti e 3 i blocchi (IT/EN/FR), aggiungere la stessa chiave in ciascuno. Nessun fallback automatico tra lingue: se manca in EN/FR, viene mostrato `undefined`.
- Landing: IT inline in `landing.html`; EN/FR in `landing-i18n.js` (`window.TR[lang][key]`).

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
- Storico sessioni atleta: `scheda.storico[]`.

## ⚠️ Trappole note (NON ripeterle)
- **Firestore rules trap**: la Console sovrascrive l'intero ruleset. Pubblicare un blocco nuovo senza il resto cancella write admin su `users/`, `deleteFeedback`, `athletes/`, `sharedClients/` → attivazione piani / inviti rotti. SEMPRE copia-incolla del `firestore.rules` INTERO.
- **Race `loadedFromFirebase`** (`index.html:6796-6948`): useRef inizializzato a `false`, diventa `true` solo nel `.finally` di `fbLoad`. L'autosave bail-outa finché è `false`. Senza questo guard, uno stato vuoto `[]` può sovrascrivere i dati veri (bug "lista clienti vuota di Luccia"). Mai rimuovere.
- **Hydration pazienti**: la `.map` di hydration è avvolta in `try/catch` per singolo paziente (`index.html:6848-6930`). Un paziente malformato non deve far crollare l'intera lista.
- **sw.js precache obsoleto**: `sw.js` fa precache di `/landing.html`. Dopo una modifica a `landing.html`, bump `const CACHE='ptboard-v##'` altrimenti l'app serve la versione in cache fino alla naturale invalidazione.
- **Plan expiry side-effect** in `loadProfile` (6710–6714): per ogni utente pro/team non-admin con `planExpiresAt < now`, viene scritto `plan='blocked'` al login. Idempotente ma genera una write per utente scaduto.
- **Autogenerato Full Body**: `trimPerTempo` protegge push/pull/legs/core SOLO quando `splitDayName==='Full Body'`. Il nome del giorno deve matchare esattamente, altrimenti ricade sulla protezione minima "primo compound".

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
- **`index.html`** — `INIT_EXERCISES` (`index.html:3763-4062`): **254 esercizi** `E01..E254`, oggetti `{id, nome:{it,en,fr}, cat, muscoli, desc, livello, equip, primary, move, primarySplit}`. Fonte di verità per PT, auto-generatore, condivisione.
- **`atleta.html`** — `EXERCISE_LIBRARY` (`atleta.html:333`): **222 nomi** `{it,en,fr}`. Lista separata, usata solo per l'autocomplete del wizard setup scheda atleta. **I nomi NON sono allineati** alla libreria principale di `index.html` (sono stati inseriti a mano, molti coincidono ma la copertura è parziale).

## Da verificare (incongruenze trovate nel repo)
- **TODO: generare `EXERCISE_LIBRARY` di `atleta.html` dai 254 di `index.html`** — serve uno script/one-shot che estragga `INIT_EXERCISES[].nome` e lo rigetti dentro `atleta.html:333` così le due liste restano sincronizzate (oggi divergono: 254 vs 222, con nomi non 1:1).
- **Working notes stale**: `i18n_audit.md` cita "10316 righe" (oggi `index.html` ne ha 11525); `exercises_translation_preview.md` è labelled "Batch H". Entrambi probabilmente obsoleti (candidati alla rimozione).
- **Rules duplicate match**: `firestore.rules` ha due blocchi `match /users/{userId}` (owner + admin, righe 6–11 e 14–17). Funziona (Firestore fa union delle match). **Deciso: lasciare invariato**.
- **Brevo 4↔5 swap**: `templateId:4 → day25`, `templateId:5 → day14` nel frontend. **Deciso: lasciare invariato** (vedi Regola Critica #5).

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

    // ── BLOCCA TUTTO IL RESTO ──
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```
