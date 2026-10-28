# GYM_PLAN.md — Piano "Palestra" (self-service)

> Design doc, non codice. Nessun file modificato oltre questo.
> Branch: `feature/gym-plan`. Target: variante self-service di PT Board per palestre, con tema, inviti PT e valutazione rapida.

## Requisiti (sintesi)
1. Palestra si iscrive da sola: crea `gyms/{gymId}` con `ownerUid`, `nome`, `logo`, `theme`.
2. Titolare invita PT per email → link invito → PT accetta (login o signup, poi link); può anche rimuoverli.
3. Logo upload → estrazione colori client-side (canvas) → palette proposta → ritocco con color picker + check WCAG AA → salvataggio in `gyms/{gymId}.theme`. Logo ridimensionato ≤256px, WebP/PNG, <60KB, inline nel documento. **Nessun Firebase Storage.**
4. Tema CSS variables applicato a: `index.html` (PT e titolare), `atleta.html`, `share.html`, export PDF.
5. Valutazione rapida (~8 domande, PAR-Q+ incluso, equip=`gym`) → riusa `generaSchedaAuto` → scheda modificabile → inviabile al cliente (link `/s/`).
6. `profile.plan='gym'` (Stripe fase successiva: prevedere solo i campi).

---

## A. Stato attuale

### Inputs di `generaSchedaAuto`
Definizione a `index.html:7418`, unico call site a `6114` (modal "Genera scheda" di `PatientDetail`). Firma: `generaSchedaAuto(params, esercizi)`. Campi letti 7419-7430:

| Campo | Required | Default | Effetto |
|---|---|---|---|
| `profilo` | di fatto sì | fallback 'B' nei lookup | pilota serie/rec |
| `obiettivo` | consigliato | undefined ⇒ no modifiers | pilota split + exParams |
| `sesso` | ★ | `'M'` + `sessoWarning=true` | filtro gravidanza |
| `eta` | ★ | `50` | modificatori ACSM anziani |
| `patologie` | ★★★ sicurezza | `''` | 11 filtri esclusione (7447-7503) |
| `infortuni` | ★★★ sicurezza | `''` | flag `noLowerPlyo`/`noOverheadPress`/`noDeadlift` |
| `programma.sedute` | ★ | 3 (via `chooseSplit` 8551) | FB vs Upper-Lower vs PPL |
| `equip` | ★ (per Palestra sempre `'gym'`) | `'gym'` | filtra libreria 7439-7442 |
| `durataSeduta` | ★ | `60` | scala serie/rec 7625-7632 |
| `attivita` | opz. | `''` | modifier conservativo profilo B |
| `T` | opz. | `null` | solo etichette |

Nessun crash per campi mancanti; scheda meno sicura se mancano `patologie`/`infortuni`. `calcScoreAnamnestico(d,eta)` a `3292` calcola `profilo.code` SENZA test fisici → **minimo set Palestra = anagrafica + PAR-Q+ + patologie/infortuni testuali + preferenze allenamento**.

**Minimo per scheda valida+sicura (8 domande):**
1. Anagrafica: `nome, cognome, sesso, ddn` (→ `eta`)
2. Antropometria: `altezza, peso`
3. Esperienza: `esperienzaLiv` + `attivita`
4. Giorni/settimana: `seduteSettimana` (2–5)
5. Durata seduta: `durataSeduta` (45/60/90)
6. Obiettivo: `obiettivo`
7. PAR-Q+: `parqQ1..parqQ7` (≥1 SI ⇒ gate, richiedi cert medico)
8. Clinica: `patologie, infortuni` (prefill "Nessuna")

### Branding hardcoded (grep su `main`)

**"PT Board" literal per file:**
`index.html` 68 (molte già bypassabili da `trainerProfile.nomeStudio`: 180, 188, 3010-3011, 4705, 4709, 4874, 4899-4902, 5069-5070, 6457, 7216, 9530-9533, 9667-9668). Hardcoded veri: meta/title 105-111; splash 390, 6759, 7171, 7214, 10796, 11319; ErrorBoundary 10759.
`atleta.html` 3; `share.html` 3; `landing.html` 17; `landing-i18n.js` 21; `manifest.json` 2; `blog/*` 11; privacy/terms 16; `sw.js` 0.

**Hex brand per file:**
- `index.html`: `#3b82f6` ×116, `#07090f` ×9, `#E6F1FB` ×5
- `atleta.html`: `#185FA5` ×29, `#042C53` ×16, `#E6F1FB` ×6, `#f0f0ec` ×9
- `share.html`: `#185FA5` ×13, `#042C53` ×10, `#E6F1FB` ×1, `#f0f0ec` ×7

**⚠️ Inconsistenza di palette**: `index.html` usa `#3b82f6`, `atleta/share` usano `#185FA5`. Da uniformare *prima* del gym theming.

**Theme object `C` + CSS vars** — `index.html:3100-3112`.
Semantici (`bg, sidebar, card, border, border2, text, muted, dim, strong`) sono getter → `var(--…)`. Dichiarati in `:root{…}` (dark, 266-269) e `:root.light{…}` (light, 270-273).
Accent (`blue, green, red, yellow, purple, cyan, orange, pink, teal`) sono **hex hardcoded** → NON swap-abili senza estrarre `--accent`.

**PDF export:**
- `exportPDFLista` (3006, 3011): `trainerProfile.logo` o fallback "PT Board".
- Scheda cliente (4705-5070): brandHtml 4700, 4899-4902; footer "Generata con PT Board" 4874, 5070 ★ hardcoded.
- Wizard valutazione (9526-9668): stesso pattern; footer 9668 ★ hardcoded.
- Stampa via `window.print()` (3033, 4851, 4975, 9599). Colore header `#3b82f6` 4851, 4975, 9599.

### Logica piani
| Linea | Funzione | Oggi |
|---|---|---|
| 416 | `isTrialExpired` | `pro\|team\|admin` ⇒ mai scaduto |
| 6710 | `App.loadProfile` | `pro\|team` scaduto ⇒ auto `plan='blocked'` |
| 6770-71 | render App | `blocked` o trial scaduto ⇒ `PaywallScreen` |
| 7133-41 | sidebar "Il mio piano" | label pro/team/trial |
| 7255/7281 | banner header | trial-left / expiring warning |
| 10815/10968 | paywall copy | nota "Fino a 3 PT" per `team*` |
| 10996 | `setPlan` (admin) | scrive `plan, planType, planExpiresAt`; annuale=370d, mensile=33d |
| 11019 | admin dashboard | pill color |
| 11073-104 | admin dashboard | editor piano |

**Cosa sblocca `team` oggi**: UI pubblicizza "Fino a 3 PT" (10815, 10968). In-app ZERO (`plan==='pro'\|\|plan==='team'` ovunque = stesse feature). Grep: nessun `orgId`/`gymId`/`members`. **"Team" oggi è solo un prezzo diverso su Stripe**; zero collisione con `gymId` ortogonale.

---

## B. Modello dati

### `gyms/{gymId}` (nuova collezione)
```js
{
  gymId: 'palestra-fit-roma',       // slug stabile (anche usato in URL ?gym=)
  nome: 'FitLab Roma',
  ownerUid: '<uid del titolare>',   // chi può modificare / invitare / rimuovere
  logo: 'data:image/webp;base64,…', // ≤60KB, max 256px, WebP/PNG inline
  theme: {
    bg, sidebar, card, border, border2,
    text, muted, dim, strong,
    accent, accentContrast,         // sostituisce C.blue (richiede estrazione a --accent)
    _wcagChecks: { accentOnBg:4.8, strongOnBg:12.1 }  // debug, opz.
  },
  members: ['<uid1>','<uid2>',…],   // include ownerUid + trainer collegati
  createdAt: serverTimestamp,
  updatedAt: serverTimestamp,
  active: true,
  plan: 'gym',                      // sempre; piano operativo del gym
  // Stripe (fase successiva): prevedi i campi, non popolarli ancora
  stripeCustomerId: null,
  stripeSubscriptionId: null,
  planExpiresAt: null
}
```

### `gymInvites/{inviteId}` (nuova collezione)
```js
{
  inviteId: '<rand token>',
  gymId: '…',
  gymNome: '…',                     // denorm per il link di accettazione
  invitedByUid: '<ownerUid>',
  email: 'pt@mail.it',              // email invitata (lowercase, normalizzata)
  status: 'pending' | 'accepted' | 'revoked',
  createdAt: serverTimestamp,
  acceptedAt: null,
  acceptedByUid: null
}
```

Link di accettazione: `https://personaltrainerboard.com/?inviteGym=<inviteId>` (o `atleta.html` equivalente — vedi §D). Al login/signup, se `inviteGym` è presente in URL, chiama Cloud Function/Worker o scrittura client-side che: valida pending + match email → aggiorna `users/{uid}.gymId`, `users/{uid}.gymRole='trainer'`, aggiunge `uid` a `gyms/{gymId}.members`, segna `gymInvites/{id}.status='accepted'`.

### Campi nuovi su `users/{uid}`
```js
{
  // esistenti: email, plan, planType, planExpiresAt, planExpiredAt, trialStart, nomeStudio, logo, nome, cognome…
  gymId: '<gymId>' | null,           // null per PT indipendente (comportamento identico a oggi)
  gymRole: 'owner' | 'trainer' | null
}
```

### Nuovo `plan='gym'`
- Trattato come `pro\|team` in TUTTI i gate (`isTrialExpired` 416, `loadProfile` 6710, label 7133, paywall 10815/10968, `setPlan` 10996).
- Payment Link Stripe placeholder: aggiungere `gymMonthly`/`gymYearly` in `PLANS` (136-141) con URL `''` (vuoto) finché non c'è Stripe → UI mostra "Attiva piano Palestra" senza bottone funzionante.

### `dataVersion` — impatto
Il documento `users/{uid}/appdata/main` resta `dataVersion:4` **invariato**. I nuovi campi (`gymId`, `gymRole`) vivono su `users/{uid}` (profilo), NON dentro `appdata/main`.
Le nuove collezioni (`gyms`, `gymInvites`) hanno propri documenti, nessun `dataVersion` necessario inizialmente.
**Autosave non toccato**: il guard `loadedFromFirebase.current` (6832, 6926, 6941, 6955) continua a proteggere solo la scrittura su `users/{uid}/appdata/main`. Le scritture su `gyms/{gymId}` e `gymInvites/{id}` passano da nuovi helper (`gymSave`/`gymInviteCreate`) chiamati esclusivamente da handler UI, **mai** da effect automatici.

---

## C. Bozza `firestore.rules` (SOLO documento, non toccare il file)

Da aggiungere PRIMA del deny finale, mantenendo i 7 blocchi esistenti (Regola Critica #3).

```
// ── GYMS COLLECTION ──
match /gyms/{gymId} {
  // Lettura pubblica di nome/logo/theme (serve a share.html e atleta.html pre-auth)
  // Scrittura solo owner o admin
  allow read: if true;
  allow create: if request.auth != null
                && request.resource.data.ownerUid == request.auth.uid
                && request.resource.data.members.hasAny([request.auth.uid]);
  allow update: if request.auth != null
                && resource.data.ownerUid == request.auth.uid;
  allow update: if request.auth != null
                && request.auth.token.email == 'stevetsala22@gmail.com';
  allow delete: if request.auth != null
                && resource.data.ownerUid == request.auth.uid;
}

// ── GYM INVITES ──
match /gymInvites/{inviteId} {
  // Owner può creare/leggere/revocare inviti per il suo gym
  // Il destinatario può leggere il proprio invito via email match (post-login) e aggiornare status→accepted
  allow create: if request.auth != null
                && request.resource.data.invitedByUid == request.auth.uid
                && request.resource.data.status == 'pending';
  allow read: if request.auth != null
              && (
                resource.data.invitedByUid == request.auth.uid
                || resource.data.email == request.auth.token.email
              );
  // Owner può revocare
  allow update: if request.auth != null
                && resource.data.invitedByUid == request.auth.uid
                && request.resource.data.status in ['pending','revoked'];
  // Destinatario può accettare (solo transizione pending→accepted con il suo uid)
  allow update: if request.auth != null
                && resource.data.email == request.auth.token.email
                && resource.data.status == 'pending'
                && request.resource.data.status == 'accepted'
                && request.resource.data.acceptedByUid == request.auth.uid;
  allow delete: if request.auth != null
                && resource.data.invitedByUid == request.auth.uid;
}
```

**Letture dei clienti anonimi** (`atleta.html` pre-login, `share.html`): basta `allow read: if true` sulla collezione `gyms`. Le info sensibili (ownerUid, members, stripe*) sono comunque "metadata" non critiche; se preoccupa, si può splittare in `gyms/{gymId}/public/branding` con `read: true` e tenere il resto solo per membri auth. **MVP**: tenerlo semplice, read pubblico sul documento intero.

**Verifica post-pubblicazione (Regola Critica #3)**: owner-users ×2, admin-users, admin-appdata, deleteFeedback, sharedClients, athletes, **gyms, gymInvites**, deny finale.

---

## D. UI nuove schermate

### D.1 Onboarding palestra (`page='gymOnboarding'`)
Flusso 3-step: nome → upload logo + palette → crea.
- **Dove**: nuovo valore `page` gestito in `AppInner` (`index.html:6785`). Add state `const [showGymOnboarding,setShowGymOnboarding]=useState(false)` vicino a 6818 (`setShowPiani`).
- **Trigger**: nuova voce menu "Palestra" in `navItems` (7022-7034) visibile solo se `profile.plan==='gym'` o se il piano è `pro\|team` + è il primo setup. Modal o full-page.
- **Reuse**: `Modal` component (CLAUDE.md map), `showToast`.
- **Scrittura**: `fbDb.collection('gyms').doc(gymId).set({...})` + aggiorna profilo con `gymId, gymRole:'owner'` (via `fbSaveUserProfile` 143).

### D.2 Editor branding (upload logo + palette)
Sotto-schermata di D.1 (step 2) e anche voce separata "Palestra → Branding" per editing successivo.

**Pipeline client-side (nessuna lib esterna)**:
1. `<input type="file" accept="image/*">` → `URL.createObjectURL`.
2. Carica in `<img>`, aspetta `onload`.
3. Resize su `<canvas>` 256×auto preservando aspect ratio.
4. Riconverti via `canvas.toBlob('image/webp', 0.85)` → se >60KB, ritenta con quality 0.75 → 0.60. Fallback `image/png` se WebP non supportato.
5. Estrazione colori:
   - Leggi `ctx.getImageData(0,0,w,h).data`.
   - Istogramma su buckets `rgb >> 4` (12-bit quantize) ignorando pixel con alpha<128, saturation<0.15, luminance<0.08 o >0.95 (scarta neutri estremi).
   - Ordina buckets per count, prendi top 3-5.
   - Riconverti i bucket centers in hex.
6. Proponi 2-3 colori; mappa su `accent`, `strong`, `bg` di default.
7. Color picker (`<input type="color">`) per ritocco. Per ogni token colore critico calcolare contrasto WCAG:
   ```
   function luminance(hex){ /* standard sRGB → linear → 0.2126 R + 0.7152 G + 0.0722 B */ }
   function contrast(a,b){ var l1=lum(a)+0.05, l2=lum(b)+0.05; return (Math.max(l1,l2)/Math.min(l1,l2)); }
   // AA grande testo: >=3; AA testo normale: >=4.5
   ```
   Mostra badge "AA ✓/✗" sotto ogni coppia (accent su bg, text su bg, strong su bg).
8. Salva: `gyms/{gymId}.logo = dataURI`, `.theme = {bg,sidebar,card,border,border2,text,muted,dim,strong,accent,accentContrast}`.

**Note**:
- WebP è supportato da tutti i browser moderni (Safari 14+). Fallback PNG previsto.
- Target peso <60KB: WebP 256px qualità 0.85 di loghi tipici (grafica piatta) sta tra 5–25KB; qualità 0.6 copre il caso peggiore.
- Nessuna lib esterna (no Vibrant.js, no Color Thief). Implementazione <200 righe.

**Dove**: nuovo screen in `AppInner`, montato quando `page==='gymBranding'`. Reuse `Modal`.

### D.3 Gestione PT (lista invitati + membri + rimuovi)
- **Dove**: `page='gymMembers'`. Lista:
  - `members` risolti via query `users` where `gymId==gymId` (admin-only read oggi, ma dato che l'owner ha scritto `members` nel doc gym, basta leggere `members[]` + opzionalmente `fbGetUserProfile(uid)` per ogni membro — richiede admin o nuova rule "member can read other member's profile within same gym" — valutare: più semplice tenere denorm `members: [{uid, email, nome}, …]` nel doc gym).
  - Inviti pending: query `gymInvites` where `gymId==gymId && status=='pending'`.
- **Azioni**:
  - "Invita PT" → form email → `gymInvites.add({...})` + mandare email (via Cloudflare Worker esistente `WORKER_URL+'/send-email'`, 198-230, nuovo templateId Brevo).
  - "Revoca invito" → `gymInvites.update({status:'revoked'})`.
  - "Rimuovi PT" → `users/{uid}.update({gymId:null, gymRole:null})` + `gyms/{gymId}.members = arrayRemove(uid)`.
    - **Attenzione rules**: owner può toccare `users/{uid}` solo se la rule attuale lo permette. Oggi `match /users/{userId}` è solo owner read/write. Serve **nuova rule**: owner di un gym può aggiornare `gymId`/`gymRole` dei suoi membri. Più semplice: fare l'update via **Cloud Function** / Worker (service account), NON client-side.

### D.4 Valutazione rapida (~8 domande)
- **Dove**: pagina dedicata `atleta.html?mode=assessment&gym=<gymId>` oppure `/valutazione.html` nuovo file (vanilla, ~400 righe).
- **Flow**:
  1. Carica `gyms/{gymId}` → applica tema + logo.
  2. 8 domande (vedi §A).
  3. Submit → `calcScoreAnamnestico(d, eta)` (serve import inline dall'estratto, oppure chiama endpoint che riusa `generaSchedaAuto` — più pulito: duplicare le costanti o esporre un endpoint da index.html via query? No. **Soluzione raccomandata**: `/valutazione.html` **include direttamente** le funzioni `calcScoreAnamnestico`, `generaSchedaAuto` e dipendenze (`exParamsFor`, `trimPerTempo`, `applyVolumeRules`, `classifyExercise`, `chooseSplit`, `INIT_EXERCISES`) via `<script>` separati, oppure il PT compila la valutazione dentro `index.html` (vedi variante alternativa).
  4. Mostra scheda proposta read-only con bottone "Modifica" (apre il modal scheda esistente) e "Invia al cliente" (genera `sharedClients/{sid}` come già fa il flusso PT).
- **Reuse verbatim**: `generaSchedaAuto` 7418, `calcScoreAnamnestico` 3292, `INIT_EXERCISES` 3763-4062, `calcolaObiettivoMetrics` 8669.
- **Variante alternativa**: valutazione rapida come **nuovo modal in `index.html`** per il PT loggato (`showAssessment` state vicino a 6818). Più semplice da implementare (già tutto in scope), ma non è pubblico/anonimo. Decisione in sede di implementazione.

### D.5 Hook theme loader (per tutti i surface)
- `index.html`: dentro `App.loadProfile` (6703-6716), DOPO `setProfile(p)`, aggiungere:
  ```js
  if (p?.gymId) {
    try {
      const g = await fbDb.collection('gyms').doc(p.gymId).get();
      if (g.exists) applyGymTheme(g.data());
    } catch (e) { /* no-op */ }
  }
  ```
  dove `applyGymTheme({theme,logo,nome})` rewrites `document.documentElement.style.setProperty('--'+k,v)` + sovrascrive `trainerProfile.nomeStudio` e `trainerProfile.logo` solo se vuoti.
- `atleta.html` (1021 righe): init vicino alla sezione STATE, legge `?gym=` da URL se presente, poi carica `gyms/{gymId}`. Oggi usa `#185FA5`/`#042C53` inline — da refactoring (vedi §F).
- `share.html` (543 righe): `share.html` legge `sharedClients/{sid}.ownerUid` → read `users/{ownerUid}.gymId` (nuova rule necessaria, o denormalizzare `gymId` dentro `sharedClients/{sid}` al momento della condivisione). Più semplice: denormalizzare.
- PDF export: `exportPDFLista` 3006, scheda cliente 4705-5070, wizard 9526-9668 → passare `trainerProfile.gymTheme` nei template; sostituire footer "Generata con PT Board" hardcoded (4874, 5070, 9668) con `nomeStudio` del gym; sostituire `#3b82f6` nei pulsanti (4851, 4975, 9599) con `theme.accent`.

---

## E. Piano implementazione (step piccoli e testabili)

**STEP 0 — Prep (nessuna feature utente)**
- File: `docs/GYM_PLAN.md` (questo file). Branch separato, no merge.
- Rischio: nullo.

**STEP 1 — Refactor branding: estrarre `--accent`**
- File: `index.html` (sostituire `C.blue` → `var(--accent)` dove usato come colore brand, mantenere `blue:'#3b82f6'` come fallback nel `:root`), `atleta.html` (sostituire `#185FA5` inline → `var(--accent)` con default `#185FA5` nel `:root`), `share.html` (idem), `sw.js` (bump cache a `ptboard-v56`).
- Test: deploy, verificare che aspetto sia IDENTICO a oggi (nessun cambio visivo).
- Rischio: medio (tanti punti da toccare). Mitigazione: sostituzioni ESATTE una alla volta, screenshot before/after.

**STEP 2 — Modello dati gym (passivo, solo campi)**
- File: `firestore.rules` (nuovi blocchi `gyms`, `gymInvites`), `CLAUDE.md` (aggiornare appendice).
- Opzionale: add `plan='gym'` nei gate esistenti (416, 6710, 7133, 10815, 10968, 10996) trattandolo = `pro\|team`.
- Test: con utente admin, creare manualmente `gyms/test1` da console → leggibile da anonimo via SDK.
- Rischio: basso. **Attenzione Regola Critica #3**: pubblicare file INTERO su Firebase Console; verifica 9 blocchi (7 esistenti + 2 nuovi) prima e dopo il deploy.

**STEP 3 — Onboarding palestra + hook theme loader**
- File: `index.html`. Add state `showGymOnboarding` 6818, componente `GymOnboarding`, voce `navItems` 7022, hook `applyGymTheme` in `App.loadProfile` 6716.
- Test: PT loggato crea un gym vuoto, logout+login → tema caricato (anche se tema vuoto = default).
- Rischio: basso. Nessun impatto sui PT senza `gymId` (campo `null` ⇒ hook salta).

**STEP 4 — Editor branding (upload logo + palette)**
- File: `index.html`. Nuovo screen `page='gymBranding'`, funzione `extractDominantColors(img)`, color picker, WCAG check.
- Test: upload di 3 loghi diversi, verifica estrazione, verifica che il tema si applichi live in preview, salvataggio in `gyms/{gymId}.theme`, applicazione dopo reload.
- Rischio: basso. Logica tutta client-side; nessun impatto sugli altri PT.

**STEP 5 — Gestione PT (invita + revoca + rimuovi)**
- File: `index.html` (screen `page='gymMembers'`), **Cloudflare Worker** (nuovo endpoint `/gym-send-invite` + `/gym-remove-pt` service-account mediated), `firestore.rules` (rule `gymInvites` già in STEP 2), Brevo template nuovo (template id da assegnare).
- Test: owner invita un email A; A fa signup con quella email, vede banner "Invito a FitLab Roma", accetta, `users/A.gymId` popolato. Owner rimuove A → `A.gymId=null`, `A` perde accesso al tema gym.
- Rischio: medio. **Email via Worker** (Brevo), non client. **Rimozione via Worker** (service account) per evitare di aprire rules fragili.

**STEP 6 — Valutazione rapida**
- Scelta: modal in `index.html` (semplice, solo PT loggato) VS pagina pubblica (`/valutazione.html` o `atleta.html?mode=assessment`).
- Raccomandato MVP: **modal in `index.html`**. Entry da `PatientDetail` (nuovo cliente) + da onboarding palestra ("Valuta subito un cliente").
- File: `index.html` solo. Reuse `generaSchedaAuto`, `calcScoreAnamnestico`.
- Test: 8 domande → scheda proposta → "Modifica" apre modal esistente → "Salva" crea paziente + scheda.
- Rischio: basso (riuso puro di funzioni esistenti). Attenzione a NON by-passare autosave guard (vedi §F).

**STEP 7 — PDF theming**
- File: `index.html` 3006-3033 (`exportPDFLista`), 4705-5070 (scheda cliente), 9526-9668 (wizard).
- Sostituire `#3b82f6` → `theme.accent`, footer "Generata con PT Board" → `nomeStudio`, aggiungere `logo` del gym nel header se presente.
- Test: PDF export con e senza `gymId`.
- Rischio: basso.

**STEP 8 — Share theming**
- File: `index.html` call site di `generaShareId`/`buildSchedaAttuale` (4580, 4587) → denormalizzare `gymId, gymTheme, gymLogo, gymNome` dentro `sharedClients/{sid}` al momento della condivisione. `share.html` legge e applica tema.
- Test: PT di un gym condivide; cliente apre `/s/xxx` → vede tema del gym.
- Rischio: basso.

**STEP 9 — Atleta theming**
- File: `atleta.html`. Al load, se c'è `?gym=<gymId>` o se l'atleta loggato ha un PT con `gymId` (richiede lookup atleta→invitedBy→users/{inviter}.gymId), applica tema.
- Rischio: basso.

**STEP 10 — Stripe `gym` plan (fase separata)**
- File: `index.html:136-141` (aggiungi `gymMonthly`, `gymYearly` in `PLANS`), Cloudflare Worker (webhook Stripe aggiornato), Brevo (template upgrade).
- Rischio: medio (soldi). Fuori scope di questo doc per ora, solo prevedere i campi.

---

## F. Rischi

| Rischio | Mitigazione |
|---|---|
| **Autosave guard** (`loadedFromFirebase.current` 6832, 6926, 6941, 6955) sovrascrive `users/{uid}/appdata/main` con stato locale vuoto. | Scrivere su `gyms/*` e `gymInvites/*` SOLO da handler UI espliciti (`gymSave`, `gymInviteCreate`). NON agganciare mai questi scritti a `useEffect` automatici. Valutazione rapida: se è modal in `index.html`, usa lo stesso path di `PatientDetail` → autosave protegge già. Se è pagina separata (`atleta.html?mode=assessment`), NON montare `AppInner`: non c'è autosave da gestire. |
| **Retrocompatibilità PT senza palestra** (il 100% degli utenti attuali). | `gymId: null` ⇒ hook `applyGymTheme` salta, UI identica a oggi. **Testare prima del deploy**: utente non-gym logga, verifica che non appaia nessun elemento nuovo, nessun errore console, aspetto IDENTICO al pixel. |
| **Firestore rules trap** (Regola Critica #3): pubblicare un file nuovo cancella i 7 blocchi esistenti. | Modificare SOLO `firestore.rules` nel repo, poi copiare file INTERO su Console. Verificare post-pubblicazione i 9 blocchi (7+2 nuovi) nell'ordine corretto (gyms e gymInvites PRIMA del deny finale). |
| **Cache PWA** (`sw.js` `ptboard-v55`): nuovi file o modifiche a `landing.html` servono stale. | Bump `const CACHE='ptboard-v##'` ad ogni release gym. Aggiungere `/valutazione.html` (se creata) all'`ASSETS` solo se è entry pre-auth. |
| **`atleta.html` pre-login + palette hardcoded**: Firebase init non ha ancora auth, non può leggere `users/{uid}`. | Usare `?gym=<gymId>` da URL. La lettura di `gyms/{gymId}` è `allow read: if true` ⇒ funziona anonimo. |
| **`share.html` anonimo**: non può leggere `users/{ownerUid}.gymId`. | Denormalizzare `gymId, gymTheme, gymLogo, gymNome` dentro `sharedClients/{sid}` al momento del `buildSchedaAttuale` (4587). Nessuna rule da aprire. |
| **Rimozione PT**: owner che aggiorna `users/{uid}` di un altro utente richiederebbe rule custom fragile. | Fare la rimozione via **Cloudflare Worker** con service account Firebase Admin. Nessun aggiornamento rules per `users`. |
| **Email invito**: client non può chiamare Brevo direttamente (`#4 Nessuna chiave API/segreto nel frontend`). | Nuovo endpoint sul Worker esistente (`WORKER_URL+'/send-gym-invite'`). Nuovo template Brevo. |
| **PT in due gym**: edge case non supportato dal design (1 `gymId` per `users/{uid}`). | Se un PT accetta un invito mentre ha già `gymId`, rifiutare lato Worker con messaggio esplicito; owner può solo "preparare" l'invito. |
| **"PT Board" literal non-trainerProfile** (meta 105-111, splash 390/6759/7171/7214/10796/11319, ErrorBoundary 10759, footer PDF 4874/5070/9668). | Fix mirato: `document.title=profile.nomeStudio||'PT Board'` dopo loadProfile; componente `BrandSplash` che legge `trainerProfile?.nomeStudio`; template PDF con token sostituibile; ErrorBoundary prop `brand`. |
| **Palette inconsistente `#3b82f6` (index) vs `#185FA5` (atleta/share)**: STEP 1 è pre-requisito di tutto il tema. | Fare STEP 1 PRIMA degli altri; test visuale pixel-perfect prima e dopo. |
| **Logo 60KB inline + documento Firestore (max 1MB)**: ~900KB per theme + membri + stripe + extras ⇒ margine stretto. | Enforce <60KB client-side con retry quality progressivo. Monitorare `estimatedDocumentSize` prima del save. Alternativa futura: splittare `gyms/{gymId}/public/branding` doc separato. |
| **Nuova collezione `gyms` leggibile pubblicamente**: espone `ownerUid, members, stripeCustomerId` a chiunque. | Per MVP accettabile (sono metadata). Se preoccupa: splittare in `gyms/{gymId}/public/branding` (read:true) + `gyms/{gymId}` (read: solo auth + member). Decisione in STEP 2. |
| **Google OAuth consent screen** branded "PT Board" (Firebase Console, non repo). | Fuori ambito frontend. Per Palestra, i PT accettano l'invito via email + magic link / email+password; il gym owner può signup con Google o email. OAuth consent resta "PT Board" nei casi Google-signup — accettabile per MVP. |
