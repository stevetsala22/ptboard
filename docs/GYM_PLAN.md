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

## Obiettivo primario
**Minimizzare il tempo che il PT impiega da "cliente nuovo in sala" a "scheda pronta e inviata".**

Baseline oggi: `PatientForm` + wizard valutazione completo + modal "Genera scheda" → **8–15 minuti** per cliente nuovo di PT esperto, oltre 20 per PT nuovo.
Target Palestra: **sotto 5 minuti** dall'apertura della valutazione rapida all'invio del link `/s/xxx` al cliente.
**Conseguenza**: la valutazione rapida è la **prima feature** da costruire — e deve funzionare anche per i PT senza palestra (è il moltiplicatore di valore anche fuori dal piano gym).

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

**Minimo per scheda valida+sicura (8 campi logici; molti auto-completabili):**
1. Anagrafica: `nome, cognome, sesso, annoNascita` (→ `eta`) — sempre esplicita. `annoNascita` è un intero YYYY (4 cifre), non `ddn`.
2. Antropometria: `altezza, peso` — sempre esplicita.
3. Esperienza: `esperienzaLiv` — da chip (3 valori). `attivita` **auto-derivata** da `esperienzaLiv`.
4. Giorni/settimana: `seduteSettimana` (2–5, default `3`).
5. Durata seduta: `durataSeduta` (45/60/90, default `60`).
6. Obiettivo: `obiettivo` — con default intelligente derivato da età+sesso (vedi §D.4).
7. PAR-Q+: `parqQ1..parqQ7` — tutti NO ⇒ safe senza cert; ≥1 SI ⇒ gate.
8. Clinica: `patologie, infortuni` — prefill `'Nessuna'`/`''` e **skippabile** se PAR-Q+ tutti NO.

**Attrezzatura (`equip`): fissa a `'gym'` nel contesto Palestra, mai chiesta.** Elimina 1 domanda vs flow PT standard. Dettaglio tempi e default in §D.4.

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
  - **"Rimuovi PT" — i clienti RESTANO al PT**. Nessun trasferimento di dati, nessuna migrazione di schede. L'owner perde solo la visibilità aggregata di quel PT nella dashboard gym. Operativamente:
    - `users/{uid}.update({gymId:null, gymRole:null})` → via Worker service-account (le rules non consentono a un utente di scrivere il profilo di un altro).
    - `gyms/{gymId}.members = arrayRemove(uid)` → direttamente dall'owner (rule gyms update by ownerUid).
    - Il PT rimosso continua a lavorare come PT indipendente: `users/{uid}/appdata/main` è intatto, `patients[]` suo rimane suo. Al prossimo login il tema gym non si applica più (hook `applyGymTheme` salta per `gymId:null`).
    - **Nessuna opzione di "trasferimento clienti al gym"**: i clienti sono proprietà del PT, il gym è solo brand + dashboard aggregata.

### D.4 Valutazione rapida (~8 domande, target <5 minuti)
- **Dove**: pagina dedicata `atleta.html?mode=assessment&gym=<gymId>` oppure `/valutazione.html` nuovo file (vanilla, ~400 righe).
- **Flow**:
  1. Carica `gyms/{gymId}` → applica tema + logo.
  2. 8 domande (vedi §A).
  3. Submit → riuso diretto delle funzioni esistenti, con fallback espliciti e try/catch (vedi snippet sotto).
  4. Mostra scheda proposta read-only con bottone "Modifica" (apre il modal scheda esistente) e "Invia al cliente" (genera `sharedClients/{sid}` come già fa il flusso PT).

#### Snippet di submit (riuso diretto)
```js
function submitValutazioneRapida(d, exercises, T){
  // d è l'oggetto raccolto dal form rapido (chiavi coerenti con PatientForm).
  // exercises è passato dal chiamante (in index.html è lo state 'exercises';
  // in /valutazione.html è INIT_EXERCISES importato come variabile globale).
  // T è la translation table (LANGS[lang].t).
  try {
    // 'annoNascita' è un intero YYYY (es. 1988), raccolto dal form come input number
    // 4 cifre con validazione 1920 ≤ anno ≤ anno corrente. Non si usa 'ddn'.
    // Stesso nome del campo nei clienti esistenti → nessuna conversione a save.
    var annoNascita = +d.annoNascita;
    var eta = annoNascita ? (new Date().getFullYear() - annoNascita) : 50;
    var pr = calcScoreAnamnestico(d, eta);              // 3292, ritorna {code,...} o null
    var profilo = (pr && pr.code) || 'B';               // ★ fallback 'B'
    var schede = generaSchedaAuto({
      profilo: profilo,
      obiettivo: d.obiettivo,                           // obbligatorio, mai default (§Default intelligenti)
      sesso: d.sesso,                                   // ★ obbligatorio, NESSUN default (vedi Fix #2: sesso mancante → norme sbagliate)
      eta: eta,
      patologie: d.patologie || 'Nessuna',              // 'Nessuna' SOLO se PAR-Q+ tutto NO (§Sicurezza)
      infortuni: d.infortuni || '',
      programma: { sedute: +d.seduteSettimana || 3 },   // ★ fallback 3
      equip: 'gym',                                     // fisso in Palestra
      durataSeduta: +d.durataSeduta || 60,              // ★ fallback 60
      T: T,
      attivita: d.attivita || ''
    }, exercises);
    return schede;
  } catch (e) {
    console.warn('[valutazione] gen error:', e);
    if (typeof showToast === 'function')
      showToast(T.schedaGenError || 'Errore generazione scheda', 'error');  // allineato a index.html:6114
    return null;
  }
}
```
Note:
- **`annoNascita`** è un **campo del form** (input `type="number"` 4 cifre, `min=1920`, `max=new Date().getFullYear()`, `required`). NON si usa `ddn` (data completa) nella valutazione rapida: raccogliere solo l'anno elimina 2 input (giorno+mese) e `annoNascita` è quello che serve per calcolare `eta`. Il paziente creato dal flusso salva `annoNascita` (stesso campo dei clienti esistenti in `patients[]`), **non** `ddn`.
- **`sesso` è obbligatorio senza default**: lo snippet NON ha più `|| 'M'`. Il form deve bloccare il submit finché `d.sesso ∈ {'M','F'}` non è selezionato. Default silenziosi su `sesso` producono norme di riferimento sbagliate (es. STS, 6MWT, hip-thrust preference 7694) → scheda potenzialmente mal calibrata per il cliente.
- `exercises` è SEMPRE passato dal chiamante (secondo argomento di `generaSchedaAuto`): in `index.html` è lo state locale `exercises` (idratato da `appdata/main.exercises`); in `/valutazione.html` è `INIT_EXERCISES` incluso via `<script>`.
- `T` è la translation table corrente (`LANGS[getLang()].t`), passata nel modal; `generaSchedaAuto` la usa per etichette interne (es. "Cardio").
- Tutti i default pericolosi sono assenti: `obiettivo` NON ha fallback (campo obbligatorio nel form); `sesso` ha fallback `'M'` ma il form NON lascia passare un submit senza selezione (il fallback copre solo caso di input corrotto).
- Il `try/catch` protegge sia errori di `calcScoreAnamnestico` (dati esotici) sia di `generaSchedaAuto` (es. libreria esercizi vuota).

- **Reuse verbatim**: `generaSchedaAuto` 7418, `calcScoreAnamnestico` 3292, `INIT_EXERCISES` 3763-4062, `calcolaObiettivoMetrics` 8669.
- **Variante alternativa**: valutazione rapida come **nuovo modal in `index.html`** per il PT loggato (`showAssessment` state vicino a 6818). Più semplice da implementare (già tutto in scope), ma non è pubblico/anonimo. **Decisione raccomandata per MVP**: modal in `index.html` (è il PT a compilare, standing accanto al cliente in sala; non serve passarlo al cliente).

#### Budget tempo (target <5 min, obiettivo stretch <3 min)
Baseline misurata (compilazione a mano, tutti i campi espliciti):
| Step | Campi | Tempo tipico |
|---|---|---|
| 1. Anagrafica | nome, cognome, sesso, ddn | 30s |
| 2. Antropometria | altezza, peso | 15s |
| 3. Esperienza | esperienzaLiv, attivita | 25s |
| 4. Allenamento | seduteSettimana, durataSeduta | 20s |
| 5. Obiettivo | obiettivo (dropdown 7-8 valori) | 15s |
| 6. PAR-Q+ | parqQ1..parqQ7 (7 radio sì/no) | 60-90s |
| 7. Clinica | patologie, infortuni (textarea) | 60-120s |
| **Totale** | | **~4-6 min** |

#### Default intelligenti (riducono il tempo a ~2-3 min)
Il PT può accettare i default con un singolo "Continua" per campo. Default pensati per il profilo-mediano Palestra (adulto 25-55, in salute, sa alzare pesi):

| Campo | Default | Come applicarlo |
|---|---|---|
| `equip` | `'gym'` | **Fissato**, mai chiesto. Palestra = sala attrezzata. −1 domanda vs flow PT standard. |
| `seduteSettimana` | `3` | Preset con slider 2/3/4/5. Media del gym. |
| `durataSeduta` | `60` | Preset 45/60/90. Default 60. |
| `attivita` | derivato da `esperienzaLiv` | `Principiante`→`'Sedentaria'`, `Intermedio`→`'Attiva'`, `Avanzato`→`'Molto attiva'`. **Il campo è sempre visibile e modificabile** (non collassato): il PT vede subito il valore proposto e può correggerlo con un tap. |
| `patologie` | `'Nessuna'` **solo se PAR-Q+ tutto NO** | Vedi §Short-circuits + §Sicurezza. Con ≥1 PAR-Q+ SI il campo è obbligatorio e vuoto. |
| `infortuni` | `''` **solo se PAR-Q+ tutto NO** | Idem a `patologie`. |
| `obiettivo` | **nessun default — selezione obbligatoria** | **Non preselezionato.** 7-8 opzioni mostrate come card grandi tap-able (Forza, Massa, Perdere peso, Resistenza, Performance, Riabilitazione, Salute, Forma generale). Un singolo tap conclude lo step. L'obiettivo è troppo determinante sulla struttura della scheda (`chooseSplit`, `exParamsFor`) per lasciarlo a un default. |
| `obiettivoStrutturato` | `{}` vuoto | Skippare completamente nella valutazione rapida (non alimenta `generaSchedaAuto` direttamente, solo `calcolaObiettivoMetrics` che qui non serve). |
| `sesso` | **nessun default — obbligatorio** | Non inferibile da nome in modo affidabile. 2 chip grandi "M"/"F" tap-able; submit disabled finché non selezionato. **Vedi Fix #2: `sesso` mancante → norme sbagliate** (STS, 6MWT, hip-thrust preference 7694). |
| `annoNascita` | nessun default — obbligatorio | Input numerico 4 cifre, `min=1920`, `max=anno corrente`, required. Si raccoglie SOLO l'anno (no giorno/mese), stesso campo salvato nel paziente creato (coerente con `patients[]` esistenti). Da `annoNascita` deriva `eta` per filtri ACSM anziani. |
| `altezza`, `peso` | nessun default | Antropometria sempre esplicita (3 valori che toccano serie/peso iniziali). |

#### Sicurezza — regole non negoziabili
- **PAR-Q+ è SEMPRE obbligatorio.** 7 radio sì/no, nessuna preselezione, nessun bypass. Il form di submit resta disabilitato finché le 7 risposte non sono date esplicitamente.
- **PAR-Q+ NON rientra mai in "accetta tutti i default"** (vedi short-circuits). Il power-user può accettare i default per esperienza/attivita/durata/sedute, ma deve compilare PAR-Q+ a mano.
- Con **≥1 PAR-Q+ SI**, la sezione clinica (`patologie`, `infortuni`) è obbligatoria, i campi partono VUOTI (nessun prefill), e il bottone "Genera scheda" è disabilitato finché `patologie` non contiene testo non-vuoto (lo stesso vale per `infortuni` se il PT lo rileva: la UI chiede esplicitamente "Infortuni in corso?" con sì/no e, se sì, textarea obbligatoria).
- Con **PAR-Q+ tutto NO**, `patologie='Nessuna'` e `infortuni=''` sono prefillati e lo step clinica è skippabile con un singolo tap "Procedi".

#### Short-circuits
- **PAR-Q+ tutti NO** ⇒ step clinica collassato con prefill (`'Nessuna'`/`''`), skippabile con un tap. Risparmio: 60-120s. Totale compilazione **~2-3 min**.
- **PAR-Q+ ≥1 SI** ⇒ gate di sicurezza. Lo screen clinico si espande, campi vuoti, submit disabled. Il PT compila patologie/infortuni **a mano** prima di poter generare la scheda. **Nessuno skip, nessun default.** Se la condizione richiede cert medico (es. patologia cardiovascolare, gravidanza), la UI mostra avviso "Serve certificato medico — raccogli il documento prima di procedere con l'allenamento".
- **"Accetta tutti i default e genera"** (power user): salta solo gli step con default sicuri (`esperienza`→`attivita`, `seduteSettimana=3`, `durataSeduta=60`). **Resta obbligatorio compilare**: anagrafica, antropometria, obiettivo (nessuna preselezione), PAR-Q+. Totale minimo: **~90 secondi** se PAR-Q+ tutto NO; **~2.5 min** se PAR-Q+ ha SI (clinica obbligatoria).

#### UX: una schermata, non uno step-by-step
Form singolo scrollabile (non wizard multi-pagina) con sezioni collassate di default per i campi con default intelligente. Ogni sezione collassata mostra `"Esperienza: Intermedio (default) ✎"` → click per espandere e modificare. Riduce friction cognitivo e numero di click.

#### Post-submit
Scheda proposta → bottoni:
- `"Modifica"` → apre il modal "Genera scheda" esistente (`PatientDetail` 6114) con tutti i valori pre-popolati. Il PT ritocca il split, cambia esercizi, salva.
- `"Invia al cliente"` → crea `sharedClients/{sid}` (riusa `buildSchedaAttuale` 4587 + `generaShareId` 4580), mostra link `/s/xxx` copiabile + QR. Il PT può anche mandarlo direttamente via WhatsApp.
- `"Salva come paziente"` → crea `patients[]` entry in `users/{uid}/appdata/main` con la scheda allegata.

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

## E. Piano implementazione (ordinato per impatto, non per architettura)

L'ordine riflette l'obiettivo primario (minimizzare "cliente nuovo → scheda inviata") e il principio: **la valutazione rapida deve essere live PRIMA del piano Palestra**, utilizzabile da ogni PT senza palestra. L'account gym arriva dopo.

**FASE 1 — Valutazione rapida (indipendente dal piano Palestra)**
Obiettivo: cliente nuovo → scheda proposta in ~3 minuti.
- STEP 1.1 — Modal "Valutazione rapida" in `index.html` (vedi §D.4), un form singolo scrollabile con default intelligenti e short-circuit PAR-Q+/clinica. Reuse `generaSchedaAuto` 7418, `calcScoreAnamnestico` 3292, `INIT_EXERCISES` 3763-4062. Entry point: nuovo bottone "⚡ Valutazione rapida" in `PatientList` 4519-4579 e in `Dashboard` 4319-4518.
- STEP 1.2 — Post-submit: 3 bottoni "Modifica/Invia/Salva" (vedi §D.4). Reuse `buildSchedaAttuale` 4587, `generaShareId` 4580.
- Test: PT senza gym, cliente nuovo, cronometro: deve arrivare al link `/s/xxx` sotto 5 minuti.
- Rischio: basso. Nessuna modifica a `users/{uid}/appdata/main` fuori dal flusso `PatientForm` esistente ⇒ autosave guard non toccato.
- **Risultato parziale a fine FASE 1**: tutti i PT (anche senza palestra) hanno la valutazione rapida. Valore immediato, zero dipendenze da gym.

**FASE 2 — Account palestra + inviti PT**
Obiettivo: titolare può creare il suo gym e invitare i suoi PT.
- STEP 2.1 — Refactor branding: estrarre `--accent` CSS var in `index.html`, `atleta.html`, `share.html`. Bump `sw.js` cache. Test visuale pixel-perfect pre/post (nessun cambio visivo). Rischio: medio (molte sostituzioni). Prerequisito tecnico per FASE 3.
- STEP 2.2 — Modello dati gym passivo: `firestore.rules` (nuovi blocchi `gyms`, `gymInvites`), `plan='gym'` trattato come `pro\|team` nei gate (416, 6710, 7133, 10815, 10968, 10996). CLAUDE.md aggiornato. **Attenzione Regola Critica #3**: pubblicare file INTERO, verifica 9 blocchi.
- STEP 2.3 — Screen `gymOnboarding` in `index.html`: form "Crea la tua palestra" (nome, poi logo+branding è FASE 3; qui solo nome e creazione record). Hook `applyGymTheme` in `App.loadProfile` 6716 (anche se tema vuoto, no-op).
- STEP 2.4 — Screen `gymMembers` in `index.html`: lista inviti pending + lista membri + "Invita PT" (form email) + "Rimuovi PT" (opzione (a): no transfer, vedi §D.3). Nuovo endpoint Cloudflare Worker `/gym-send-invite` + `/gym-remove-pt` (service-account), nuovo template Brevo.
- STEP 2.5 — Accettazione invito: lato PT invitato, deep link `?inviteGym=<id>` processato in `App.loadProfile`. Validazione match-email + transizione `gymInvites.status='accepted'`.
- Test: owner crea gym, invita PT A (email), A fa signup → vede banner "Invito a FitLab Roma", accetta, `users/A.gymId` popolato. Owner rimuove A → `A.gymId=null`, i clienti di A restano in `users/A/appdata/main` intatti.
- Rischio: medio. Email+rimozione via Worker (nessuna chiave API frontend, no rules fragili su `users`).

**FASE 3 — Branding dal logo**
Obiettivo: titolare carica logo → palette estratta → tema applicato ovunque.
- STEP 3.1 — Screen `gymBranding` in `index.html`: upload file, canvas resize 256px → WebP 0.85/0.75/0.6 fallback PNG, estrazione colori via istogramma 12-bit (scartare neutri/alpha<128), color picker + WCAG AA check (`luminance`+`contrast` helpers inline). Salva in `gyms/{gymId}.theme` + `.logo` (dataURI inline <60KB).
- STEP 3.2 — Theming surfaces: `atleta.html` legge `?gym=<id>` da URL, carica tema. `share.html` legge `sharedClients/{sid}.gymId` (denormalizzato in `buildSchedaAttuale` 4587) e applica tema. PDF export (3006-3033, 4705-5070, 9526-9668): sostituire `#3b82f6` → `theme.accent`, footer "Generata con PT Board" → `nomeStudio`.
- Test: owner carica 3 loghi diversi, verifica estrazione, applicazione live, salvataggio. Cliente apre link `/s/xxx` → vede tema del gym. PDF export brandizzato.
- Rischio: basso (tutto client-side; retrocompat garantita da `gymId:null` ⇒ nessun hook).

**FASE 4 — Dashboard titolare read-only**
Obiettivo: il titolare vede attività aggregata dei suoi PT **e** può aprire in sola lettura ogni cliente di ogni suo PT (anamnesi, screening, schede, progressi) per supervisione / qualità.

- STEP 4.1 — **Panoramica aggregata** (gymDashboard). Nuovo screen in `index.html` visibile solo se `profile.gymRole==='owner'`. Mostra: per ogni PT in `gyms/{gymId}.members` → counts di `patients[]`, `bookings[]`, `schede` generate ultimi 30g, ultima attività.
  - **Fonte**: metrics denormalizzate in `gyms/{gymId}.metrics[ptUid] = {nClienti, nSchede30d, lastActivity, …}`, scritte lato PT dentro l'autosave effect (6938-6967) SOTTO il guard `loadedFromFirebase.current`.
  - **Nessun dato identificativo di cliente** in `metrics`: solo counts e timestamp. Pensata per il "pannello di controllo".

- STEP 4.2 — **Vista cliente read-only** (gymPatientRO). Nuovo screen in `index.html`, raggiungibile dalla panoramica (click su un PT → lista dei suoi clienti → click cliente). Riusa `PatientDetail` (4667-6569) in **modalità sola lettura**:
  - Nuovo prop `readOnly:true` passato a `PatientDetail`.
  - **Prop `upd` sostituita da no-op**: nel path read-only, le props `onUpdate`/`onDelete`/`onEdit`/`onValuta` (passate come prop a `PatientDetail` dall'`AppInner`, cfr. 7327) sono rimpiazzate da una funzione no-op che fa `console.warn('[gymPatientRO] blocked write attempt:', fn.name, args)` e **ritorna senza modificare nulla**. Questo è una difesa in profondità contro refactor futuri che potrebbero dimenticare di nascondere un bottone: anche se un handler residuo chiama `upd(…)`, l'azione viene intercettata e loggata invece di propagarsi.
  - Bottoni edit/delete/generate/salva/share/export nascosti via `readOnly`. Il form di edit non è montato affatto.
  - **Nessun pulsante di save**: la UI non ha controlli che modifichino lo state; non esiste un path di scrittura verso `users/{ptUid}/appdata/main` dalla vista read-only. Comunque, anche se un bottone residuo tentasse una scrittura, la rule Firestore su `/users/{ptUid}/appdata` consente SOLO `read` all'owner (vedi STEP 4.3) → `permission-denied` lato server.
  - **Nessun passaggio da appdata/main dell'owner**: `fbSave`/`fbLoad` (153-162) opera solo su `users/{currentUid}/appdata/main`. La lettura di `users/{ptUid}/appdata/main` passa da un helper NUOVO `fbLoadForOwner(ptUid)` che: (a) chiama `fbDb.collection('users').doc(ptUid).collection('appdata').doc('main').get()`; (b) idrata un oggetto locale; (c) NON scrive mai.
  - **Nessun montaggio di `AppInner`**: `gymPatientRO` è un sotto-screen di `AppInner` dell'owner, che però lavora su `patients` **del PT selezionato**, NON sui propri. Chiave: lo state `patients` del gym-owner (`AppInner` 6796-6835) NON viene mai modificato con i dati del PT. I dati del PT vengono letti in uno state **separato** (`viewingPatients, setViewingPatients=useState(null)`) usato solo per il render read-only. L'autosave effect (6938-6967) continua a leggere/scrivere SOLO lo state `patients` dell'owner → **mai scrive sui dati del PT**.
  - **Nessun pulsante di save**: la UI non ha controlli che modifichino lo state; non esiste un path di scrittura verso `users/{ptUid}/appdata/main` dalla vista read-only.
  - **Nessun passaggio da appdata/main dell'owner**: `fbSave`/`fbLoad` (153-162) opera solo su `users/{currentUid}/appdata/main`. La lettura di `users/{ptUid}/appdata/main` passa da un helper NUOVO `fbLoadForOwner(ptUid)` che: (a) chiama `fbDb.collection('users').doc(ptUid).collection('appdata').doc('main').get()`; (b) idrata un oggetto locale; (c) NON scrive mai.

- STEP 4.3 — **Rules per read-only cross-user**. Serve una regola nuova:
  ```
  match /users/{ptUid}/appdata/{docId} {
    // ... blocchi esistenti owner + admin ...
    // NUOVO: owner di un gym può leggere i dati dei suoi membri (solo READ, no write).
    allow read: if request.auth != null
                && exists(/databases/$(database)/documents/users/$(request.auth.uid))
                && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.gymRole == 'owner'
                && exists(/databases/$(database)/documents/gyms/$(get(/databases/$(database)/documents/users/$(request.auth.uid)).data.gymId))
                && get(/databases/$(database)/documents/gyms/$(get(/databases/$(database)/documents/users/$(request.auth.uid)).data.gymId)).data.members.hasAny([ptUid]);
  }
  ```
  - **Costo**: 2 `get()` + 2 `exists()` per read ⇒ ~2-4 ms extra, trascurabile. Firestore conta ogni `get()` come 1 read fatturato ⇒ ~3 reads per aprire la vista cliente.
  - **Simmetria**: lo STESSO blocco si applica a `match /users/{ptUid}` (profilo del PT) per leggere nome/email, necessari per il header della vista read-only.
  - **Rischio data leak**: minimo, perché il `read` è gated da (owner-role AND stessa gym AND ptUid in members). Un'operazione di `remove PT` (§D.3) rimuove `ptUid` da `gyms/{gymId}.members` ⇒ l'owner **perde immediatamente** il permesso di leggere i dati di quel PT. Nessun cache lato client va spurgato: la UI non espone più i clienti del PT rimosso al refresh successivo.

- STEP 4.4 — **Export PDF e condivisione dalla vista read-only**: disabilitati. L'owner può solo visualizzare; non può generare link `/s/xxx` né PDF né nuove schede sotto l'identità del PT. Se l'owner vuole intervenire deve chiedere al PT di farlo (o diventare lui stesso PT con un proprio account, altra storia).

- Test:
  - Owner apre dashboard, clicca su PT A, vede 12 clienti; clicca cliente, vede anamnesi+schede+log in sola lettura. Nessun bottone di edit visibile. Console network: solo `GET` request a `users/{ptAUid}/appdata/main`, nessuna `PATCH`/`PUT`/`POST`.
  - Owner tenta di triggerare autosave: cambia tab e torna → nessuna write a `users/{ownerUid}/appdata/main` relativa ai patients del PT (verifica con Firestore audit log o breakpoint sull'effect 6938).
  - **Il titolare prova a modificare**: forziamo da devtools una chiamata del tipo `fbDb.collection('users').doc('<ptUid>').collection('appdata').doc('main').update({patients:[...]})` autenticato come owner → **Firestore rifiuta con `permission-denied`** (rule STEP 4.3 consente solo `read`). Il tentativo deve essere loggato dalle console/Sentry ma non modificare nulla. Idem per qualsiasi handler UI che chiami `upd(...)`: la no-op intercetta client-side, le rules proteggono server-side.
  - Owner rimuove PT A → prossimo tentativo di aprire la vista cliente di A → rules deniegano con permission-denied. UI mostra "Accesso scaduto".

- Rischio: alto se non gestito bene. Mitigazione obbligatoria:
  1. State dei patients del PT in uno store SEPARATO dall'`AppInner` dell'owner.
  2. Prop `readOnly:true` effettivamente onorato da `PatientDetail` (verifica di tutti i bottoni che oggi ha).
  3. Prop `upd`/`onUpdate`/`onDelete`/`onEdit`/`onValuta` = funzione no-op con `console.warn` nel path read-only (grep su chi passa questi handler nel ramo gymPatientRO).
  4. Rules Firestore su `/users/{ptUid}/appdata` **solo `read`** per l'owner (vedi STEP 4.3): doppia difesa client+server.
  5. Audit periodico (test E2E) che simuli (a) owner+read-only + autosave trigger → `appdata/main` dell'owner intatto; (b) owner che forza una write via SDK → `permission-denied`.

**FASE 5 — Piano 'gym' + Stripe (fase separata)**
Obiettivo: monetizzare il piano Palestra.
- STEP 5.1 — Payment Link Stripe nuovi (`gymMonthly`, `gymYearly`) in `PLANS` 136-141. Nuove copy paywall per gym.
- STEP 5.2 — Webhook Stripe (Cloudflare Worker esistente) aggiornato per attivare `plan='gym'` + `planExpiresAt` dopo pagamento su `gyms/{gymId}` (NON più su `users/{uid}` singolo).
- STEP 5.3 — Enforcement: hook `isTrialExpired` 416 e `loadProfile` 6710 verificano `plan==='gym'` tramite `gyms/{gymId}.planExpiresAt` (non `users/{uid}.planExpiresAt`). Durante il trial del gym, tutti i membri hanno accesso senza paywall.
- STEP 5.4 — Email di onboarding palestra (template Brevo nuovo).
- Rischio: medio (soldi + flussi webhook). Prerequisito: FASE 2 completata e testata con utenti reali in modalità gratuita.

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
