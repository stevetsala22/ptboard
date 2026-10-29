# GYM_PLAN.md — Spazio Palestra (v2, workspace condiviso)

> Design doc, non codice. Nessun file modificato oltre questo.
> **v2 (riscrittura):** cambia il modello di proprietà dei dati. In v1 i clienti restavano al PT; **ora i clienti appartengono alla palestra** e sono condivisi fra i PT membri.

## Panoramica
Alla registrazione l'utente sceglie **"Personal trainer"** (app attuale, invariata) oppure **"Palestra"**. Con "Palestra" si crea `gyms/{gymId}` con `ownerUid`, `nome`, `logo`, `theme`, `members[]`. L'utente entra in uno **Spazio Palestra**: stesso sito, stesso `index.html`, workspace separato con branding della palestra, deve sembrare un'app a sé.

- I **clienti** vivono in `gyms/{gymId}/clients/{clientId}` — un documento per cliente.
- Le **schede** di un cliente sono una sotto-collezione: `gyms/{gymId}/clients/{clientId}/schede/{schedaId}`.
- **Tutti i PT membri** leggono e modificano **tutti** i clienti e **tutte** le schede della palestra.
- **Ruoli**: `owner` (titolare — PT principale: gestisce PT, branding, abbonamento, lavora anche sui clienti) e `trainer` (PT membro).

## Obiettivo primario (invariato da v1)
**Minimizzare il tempo che il PT impiega da "cliente nuovo in sala" a "scheda pronta e inviata".** Baseline oggi: 8–15 min. Target Palestra: <5 min. La **valutazione rapida** (FASE 1 / STEP 1.1) è già live su `main` (commit `aa0ec61`/`134d078`) e funziona per i PT indipendenti → riusabile verbatim in Spazio Palestra cambiando solo il data-layer.

## Dual-identity: uno può essere PT indipendente E membro di una palestra?
Due opzioni analizzate:

| Opzione | Pro | Contro |
|---|---|---|
| **A. Space switcher** (stesso account, due workspace isolati) | Un solo login, un solo profilo. Toggle in sidebar "Spazio PT / Spazio Palestra ‹nome›". Email, lingua, piano d'abbonamento condivisi. | Due store distinti (clienti PT in `users/{uid}/appdata/main.patients`, clienti palestra in subcollection). Serve persistere `lastSpace` su `users/{uid}`. |
| **B. Account separati** | Isolamento totale. Nessuna confusione. | Doppio login, doppia email, doppio abbonamento Stripe se entrambi a pagamento. Attrito operativo alto. |

**Raccomandato: A — space switcher.** Un utente ha `users/{uid}.spaces: ['pt','gym']` + `lastSpace`. Al login carica l'ultimo workspace usato; toggle nella sidebar per cambiare. I dati PT restano nell'`appdata/main` esistente (zero migrazione), i dati palestra nei subcollection nuovi.

## Requisiti
1. **Signup**: scelta "Personal trainer" vs "Palestra". Con "Palestra" l'utente diventa `owner` del nuovo gym.
2. **Clienti condivisi**: ogni cliente è un documento in `gyms/{gymId}/clients/{clientId}`; le sue schede sono in sotto-collezione.
3. **Inviti PT**: owner genera un **link** (`?joinGym=<inviteId>`) o un **codice 6 caratteri** (es. `A4K9PX`), scadenza 7 giorni, revocabile.
4. **Rimozione PT**: perde subito l'accesso. Clienti e schede restano alla palestra.
5. **Concorrenza**: niente autosave dell'intero array di clienti. Ogni modifica è un `.update()` sui soli campi cambiati del documento cliente. Ogni scheda è un nuovo documento (`.add()` o `.set()` su id generato client-side).
6. **Branding**: logo caricato dall'owner → palette estratta client-side → ritocco con contrasto WCAG AA.
7. **Riuso codice**: `generaSchedaAuto` + `calcScoreAnamnestico` + modal Quick Assessment invariati; cambia solo il data-layer.
8. **Privacy**: consenso cliente informa che "i dati sono gestiti dalla palestra X e accessibili al suo staff".

## ⚠️ REGOLE CRITICHE — non violare mai
1. **MAI** `fbDb.enableIndexedDbPersistence()` / `fbDb.enablePersistence()`. Fanno crashare Firebase compat 10.7.0.
2. **Deploy SOLO via GitHub Pages**. Mai Netlify.
3. **Regole Firestore**: modifica SEMPRE prima `firestore.rules` nel repo, poi copia il file INTERO in Firebase Console → Firestore → Regole. L'editor Console sovrascrive l'intero ruleset.
4. **Nessuna chiave API/segreto nel frontend**.
5. **Brevo**: in `ONBOARDING_EMAILS` i template id 4 e 5 sono invertiti rispetto al giorno (`templateId:5 → day14`, `templateId:4 → day25`). Voluto.
6. **i18n**: ogni testo UI nuovo va in **tutte e 3 le lingue** (IT @ `index.html:457`, EN @ 1306, FR @ 2155).
7. **Autosave PT indipendente**: NON toccare il guard `loadedFromFirebase.current` né l'autosave esistente (7206-7222). I PT senza palestra devono funzionare IDENTICI.
8. **Lo Spazio Palestra NON usa l'autosave esistente**. Scrive solo tramite `.update()`/`.add()` field-level sui doc individuali (vedi §B e §Rischi).
9. **`buildSchedaAttuale` ↔ `buildGiorniDaTutteLeSchede` ↔ `share.html`**: tenere allineati.
10. **Asset non eliminare**: `dashboard.jpg`, `mobile.jpg`, `PTBoard_Guida_Rapida_PT.pdf` sono referenziati.

## Modello dati Firestore (v2)

### Collezioni esistenti (invariate)
- `users/{uid}` — profilo utente.
- `users/{uid}/appdata/main` — stato del PT **indipendente** (`patients, bookings, exercises, isLight, dataVersion:4`). **Non toccato dallo spazio palestra**.
- `athletes/{uid}/appdata/main` — mini-app atleta.
- `sharedClients/{sid}` — vista cliente anonima `/s/`.
- `deleteFeedback/{uid}` — feedback cancellazione.

### Nuove collezioni
```js
gyms/{gymId} = {
  gymId,
  nome,
  logo: 'data:image/webp;base64,…',   // ≤60KB inline
  theme: {bg, sidebar, card, border, border2, text, muted, dim, strong, accent, accentContrast},
  ownerUid,                            // IMMUTABILE dopo la create
  members: [uid1, uid2, …],            // include ownerUid
  memberRoles: {uid1:'owner', uid2:'trainer', …},
  activeInvites: ['A4K9PX', 'Q7PNHJ'], // codici invito attivi (array di document id di gymInvites),
                                       // per enumerazione lato owner SENZA list query su gymInvites.
  joinCode: '',                        // scratch field usato dalla rule self-join (vedi §C).
  createdAt, updatedAt, active:true,
  plan: 'gym',                         // futuro Stripe
  stripeCustomerId: null, stripeSubscriptionId: null, planExpiresAt: null
}

gyms/{gymId}/clients/{clientId} = {
  // Stesso schema di emptyP() della v1 PT, con nomi di campo identici
  // in modo che il modal Quick Assessment + PatientDetail/Form li
  // trattino allo stesso modo.
  nome, cognome, sesso, annoNascita, altezza, peso,
  obiettivo, attivita, patologie, infortuni,
  programma: {sedute, …}, parqPlus: {q1..q7},
  test: {…}, bia: {…}, progressi: [], log: [],
  modalitaValutazione: 'rapida'|'completa'|'',
  dataValutazione, createdAt,
  createdByUid: '<uid del PT che l'ha creato>',
  updatedByUid: '<ultimo che l'ha toccato>', updatedAt,
  consentAcceptedAt: null|timestamp     // consenso privacy (vedi §Privacy)
}

gyms/{gymId}/clients/{clientId}/schede/{schedaId} = {
  // Schema compatibile con una entry di patients[].schede[] della v1.
  nome, codice, split, splitDay, tipo, data,
  esercizi: [...], note, config: {…},
  createdByUid, createdAt
}

gymInvites/{code} = {
  // Document id = code 6 char (es. "A4K9PX"). Nessun campo 'code' separato.
  // Letture: SOLO via get(doc id). Nessuna list sulla collezione (vedi §C).
  gymId, gymNome,                       // IMMUTABILI dopo la create
  invitedByUid,                         // IMMUTABILE
  createdAt,
  expiresAt,                            // timestamp (default createdAt + 7g, max 30g)
  status: 'active' | 'revoked' | 'expired'
}
```

### Perché subcollection e non doc singolo con array
- **Concorrenza**: due PT che aggiungono clienti simultaneamente ⇒ due `.add()` separate, nessun conflitto. Con un array sul doc gym, due scritture concorrenti si sovrascriverebbero.
- **Dimensione**: un gym a regime può avere centinaia di clienti; il doc Firestore ha limite 1 MB.
- **Rules granulari**: più semplice gated-per-collezione.
- **Listener puntuali**: `onSnapshot` su `clients` restituisce solo i delta, non l'intero array.

### Campi nuovi su `users/{uid}`
```js
{
  // esistenti: email, plan, planType, planExpiresAt, trialStart, nomeStudio, logo, nome, cognome...
  spaces: ['pt'] | ['gym'] | ['pt','gym'],   // workspace a cui l'utente puo' accedere
  gymId: '<gymId>' | null,
  gymRole: 'owner' | 'trainer' | null,
  lastSpace: 'pt' | 'gym'                     // default aperto al login
}
```

Un PT indipendente storico ha `spaces: undefined` ⇒ trattato come `['pt']` (retrocompat).

## A. Isolamento Spazio Palestra in `index.html`

**Principio base:** aggiungere il minimo di punti di diramazione. Lo stato `isGym` viene calcolato una volta sola da `profile.lastSpace === 'gym' && profile.gymId`, e tutta la logica specifica è contenuta in nuovi componenti/hook. Il flusso PT indipendente (clienti in `appdata/main`) resta identico. Pixel-perfect pre/post deploy per i PT storici.

### Punti di innesto (riga su `main`)
| Dove | Cosa fare |
|---|---|
| `App.loadProfile` (`index.html:6974-6983` circa) | Dopo `fbGetUserProfile`, se `profile.spaces` contiene `'gym'` ⇒ caricare `gyms/{profile.gymId}` e applicare il tema (CSS variables su `:root`). |
| `AppInner` state (7058-7110) | Aggiungere `const [currentSpace, setCurrentSpace] = useState(profile.lastSpace||'pt')`. Aggiungere `const isGym = currentSpace==='gym' && profile.gymId`. |
| `AppInner` state patients (7058) | Lasciare `const [patients, setPatients] = useState(...)` INVARIATO. In gym mode viene usato uno `useClientData` adapter che restituisce `clients` dalla subcollection, non da questo state. |
| Firebase load effect (7118-7194) | Il load `fbLoad(uid)` per `appdata/main` continua a eseguirsi SOLO se `isGym` è false al momento del load (evitare lo spreco di `patients` quando l'utente lavora in gym mode). Il guard `loadedFromFirebase.current` resta come oggi: PT indipendente invariato. |
| Autosave effect (7206-7222) | Guard aggiuntivo in cima: `if (isGym) return;`. L'autosave esistente scrive SOLO il workspace PT indipendente. In gym mode non deve mai triggerare. |
| `navItems` (7362-7375 circa) | Rimangono invariate. In più: nuovo item "Palestra" visibile se `isGym`, nasconde "App per il cliente" (che era specifica del PT indipendente). |
| Sidebar workspace switcher | Nuovo blocco in cima alla sidebar: se `profile.spaces` ha 2 elementi, dropdown "Spazio PT ↕ Spazio Palestra". Click → `setCurrentSpace(v); fbSaveUserProfile(uid, {lastSpace:v})`. Il resto della sidebar re-renderizza con `isGym` nuovo. |
| `PatientList` call site (7585-7595) | Due versioni:<br>- PT independente: `<PatientList patients={patients} … />` come oggi.<br>- Gym: `<PatientList patients={gymClients} onSelect={…} onQuickAssess={…} …/>` con dati dal nuovo hook `useGymClients(gymId)`. Il componente stesso NON cambia. |
| `PatientDetail` (4674-5000 circa) | Prop `onUpdate` continua a venire da fuori. In gym mode `onUpdate(patch)` chiama l'adapter che fa `.update()` sui soli campi del patch, non `setPatients(...)`. Vedi §B. |
| Modal Quick Assessment `onCreate` (7620-7640 circa) | In gym mode chiama `adapterCreateClient(patientData, nuoveSchede)` → `.add()` su `gyms/{gymId}/clients` + `.add()` su subcollection schede, poi `setSelectedId(docId); setPage('detail')`. |
| Branding | Theme già ricevuto da `App.loadProfile`. Fatto una volta sola. |

### Diramazioni minime
- Lato render: le pagine `dash`, `patients`, `detail`, `form`, `calendar`, `exercises` continuano a usare gli stessi componenti. Solo la **fonte dei dati** cambia (`patients` state vs `gymClients` state). Nessun componente nuovo nel 95% dei casi.
- Il `pr?.code` logic di `generaSchedaAuto` non cambia.
- Export PDF, condivisione `/s/`, atleta.html: usano il doc del cliente così com'è, invariato.

### Cosa NON si tocca
- `patients, bookings, exercises, isLight, dataVersion:4` su `users/{uid}/appdata/main`.
- Autosave esistente (7206-7222).
- `PatientForm` validation.
- `generaSchedaAuto` (`index.html:7418`), `calcScoreAnamnestico` (3292).

## B. Data layer: adapter `useClientData`

### Call-sites attuali che leggono/scrivono `patients`
| Linea | Operazione |
|---|---|
| 7058 | `const [patients, setPatients] = useState(...)` |
| 7132 | `setPatients(pHydrated)` — hydration da `fbLoad` |
| 7207, 7218 | autosave write di tutto `patients[]` |
| 7252 | `setPatients(ps=>[...ps,p])` — create da PatientForm (isNew) |
| 7254 | `setPatients(ps=>ps.map(...))` — update da PatientForm (edit) |
| 7592 | `onDelete`: `setPatients(ps=>ps.filter(...))`, `onUpdate`: `setPatients(ps=>ps.map(...))` |
| 7609, 7615 | Wizard valutazione save (reeval + new) |
| 7632 | Quick Assessment onCreate |
| 4707 | `upd=(fn)=>onUpdate({...p,...fn(p)})` in `PatientDetail` → risale a `setPatients` tramite onUpdate |

### Adapter `useClientData({isGym, gymId, patients, setPatients})`
Un hook unico che ritorna la stessa interfaccia per entrambi i mondi. Scopo: cambiare la riga più piccola possibile ai call-site.

```js
function useClientData({isGym, gymId, patients, setPatients, uid}){
  const [gymClients, setGymClients] = useState([]);
  const [gymReady, setGymReady] = useState(false);

  // Listener real-time sulla subcollection (solo in gym mode)
  useEffect(()=>{
    if(!isGym || !gymId) return;
    const q = fbDb.collection('gyms').doc(gymId).collection('clients');
    const unsub = q.onSnapshot(snap=>{
      setGymClients(snap.docs.map(d=>({...d.data(), id:d.id})));
      setGymReady(true);
    }, err=>console.warn('[gym clients] snapshot err:', err));
    return ()=>unsub();
  }, [isGym, gymId]);

  const clients = isGym ? gymClients : patients;

  async function addClient(c){
    if(!isGym){
      const id = nextPid(patients);
      const p = {...c, id};
      setPatients(ps=>[...ps,p]);
      return p;
    }
    // Gym: .add() → id autogenerato Firestore. Il cliente appare poi via onSnapshot.
    const docRef = await fbDb.collection('gyms').doc(gymId).collection('clients')
      .add({...c, createdByUid: uid, createdAt: Date.now(), updatedAt: Date.now()});
    return {...c, id: docRef.id};
  }

  async function updateClient(id, patch){
    if(!isGym){
      setPatients(ps=>ps.map(p=>p.id===id?{...p,...patch}:p));
      return;
    }
    // Gym: update field-level dei soli campi in patch (NON di tutto il doc)
    await fbDb.collection('gyms').doc(gymId).collection('clients').doc(id)
      .update({...patch, updatedByUid: uid, updatedAt: Date.now()});
  }

  async function removeClient(id){
    if(!isGym){
      setPatients(ps=>ps.filter(p=>p.id!==id));
      return;
    }
    // Gym: delete del doc + delete di tutte le schede della subcollection
    await fbDb.collection('gyms').doc(gymId).collection('clients').doc(id).delete();
    // schede subcollection: cleanup via Cloud Function o batch client-side
  }

  async function addScheda(clientId, scheda){
    if(!isGym){
      setPatients(ps=>ps.map(p=>p.id===clientId
        ? {...p, schede:[...(p.schede||[]), scheda]}
        : p));
      return;
    }
    await fbDb.collection('gyms').doc(gymId).collection('clients').doc(clientId)
      .collection('schede').add({...scheda, createdByUid: uid, createdAt: Date.now()});
  }

  return {clients, gymReady, addClient, updateClient, removeClient, addScheda};
}
```

### Punti di modifica ai call-sites
| Linea | Oggi | Nuovo |
|---|---|---|
| 7132 | `setPatients(pHydrated)` | invariato (PT indipendente only; in gym mode il load `fbLoad` è skippato) |
| 7252 (PatientForm new) | `setPatients(ps=>[...ps,p])` | `addClient(p)` |
| 7254 (PatientForm edit) | `setPatients(ps=>ps.map(...))` | `updateClient(form.id, form)` |
| 7592 onDelete | `setPatients(ps=>ps.filter(...))` | `removeClient(selectedId)` |
| 7592 onUpdate | `setPatients(ps=>ps.map(x=>x.id===p.id?p:x))` | `updateClient(p.id, p)` |
| 7609 (reeval wizard) | `setPatients(ps=>ps.map(...))` | `updateClient(reevalPatient.id, {test:p.test, bia:p.bia, …})` |
| 7615 (new wizard) | `setPatients(ps=>[...ps,np])` | `addClient(np).then(c=>setSelectedId(c.id))` |
| 7632 (QA onCreate) | `setPatients(ps=>[...ps,p])` | `addClient(p).then(c=>{if(nuoveSchede) nuoveSchede.forEach(s=>addScheda(c.id, s))}); setSelectedId(c.id)` |

Il `patients` state resta e viene letto come oggi: in gym mode `clients` arriva dallo snapshot e il resto del render è identico (stesso schema per-cliente). **Nessun refactor profondo di `PatientDetail`/`PatientForm`.**

### `upd` in PatientDetail (4707)
Oggi: `const upd=(fn)=>onUpdate({...p,...fn(p)})` dove `onUpdate` ⇒ `setPatients(...)`.
Nuovo in gym mode: `onUpdate` passata come prop è `(patient)=>updateClient(patient.id, diff)` dove `diff` sono solo i campi cambiati. Per calcolare il diff si confrontano `patient` e `p`: `const diff = diffPatch(p, patient)`. L'adapter manda `.update(diff)` → due PT che toccano campi diversi non si sovrascrivono.

In PT indipendente il comportamento resta identico (riga 4707 invariata).

### Field-level update: come
```js
// Esempio: PT A tocca il peso, PT B tocca il consenso. Entrambi aperti sullo stesso cliente.
// Senza field-level: ognuno fa .set({...cliente, peso: X}) o .set({...cliente, consentAcceptedAt: Y}),
// e chi scrive ultimo cancella l'altra modifica.
// Con field-level: ognuno fa .update({peso: X}) o .update({consentAcceptedAt: Y}),
// i due merge convivono.
```

Firestore `.update()` è atomico sui campi passati; non tocca il resto. Zero conflitti su campi disgiunti. Conflitto solo se entrambi scrivono lo stesso campo (last-write-wins — accettabile per i casi d'uso tipici).

## C. Bozza `firestore.rules` (solo nel doc, NON toccare il file)

Da aggiungere PRIMA del deny finale, mantenendo i 7 blocchi esistenti (Regola Critica #3).

**Principi di sicurezza v2 (aggiornati):**
- L'**id del documento invito è il codice stesso** (6 char uppercase). Niente campo `code` separato, niente query `where code==X`: la validazione passa da `get()` diretto sull'id.
- Nessuna `list` sulla collezione `gymInvites`: solo `get` del singolo documento. L'owner conosce i codici dei propri inviti perché sono salvati su `gyms/{gymId}.activeInvites[]` (vedi sotto).
- L'accettazione dell'invito è **client-side con validazione nelle rules**: il PT fa un `.update()` sul doc gym che aggiunge solo il proprio uid a `members` + `memberRoles[uid]='trainer'` + registra `joinCode`. La rule confronta i diff e verifica l'invito via `get()`.
- `ownerUid` è immutabile dopo la create. `members` alla create = `[request.auth.uid]` esatto (nessuno può piazzare altri uid al momento della fondazione).

```
// ── GYMS ──
match /gyms/{gymId} {
  // Lettura: tutti i membri possono leggere il doc gym (nome, logo, theme, members).
  allow read: if request.auth != null
              && resource.data.members.hasAny([request.auth.uid]);

  // Create: il fondatore e' owner e UNICO membro iniziale.
  allow create: if request.auth != null
                && request.resource.data.ownerUid == request.auth.uid
                && request.resource.data.members == [request.auth.uid]
                && request.resource.data.memberRoles[request.auth.uid] == 'owner';

  // (A) Update completo dell'owner: puo' cambiare tutto EXCETTO ownerUid.
  allow update: if request.auth != null
                && resource.data.ownerUid == request.auth.uid
                && request.resource.data.ownerUid == resource.data.ownerUid;

  // (B) Update dell'admin: stessa clausola di invarianza su ownerUid.
  allow update: if request.auth != null
                && request.auth.token.email == 'stevetsala22@gmail.com'
                && request.resource.data.ownerUid == resource.data.ownerUid;

  // (C) Self-join di un PT invitato: diff SOLO su members + memberRoles + joinCode.
  // La rule valida: (1) il PT aggiunge SOLO il proprio uid a members; (2) il suo ruolo
  // e' 'trainer'; (3) il codice usato esiste come doc gymInvites/{joinCode}, e' active,
  // non scaduto, e punta a questo gymId. ownerUid immutabile, members esistenti preservati.
  allow update: if request.auth != null
                && request.resource.data.diff(resource.data).affectedKeys()
                     .hasOnly(['members','memberRoles','joinCode'])
                && request.resource.data.ownerUid == resource.data.ownerUid
                && !(request.auth.uid in resource.data.members)
                && request.resource.data.members == resource.data.members.concat([request.auth.uid])
                && request.resource.data.memberRoles[request.auth.uid] == 'trainer'
                && exists(/databases/$(database)/documents/gymInvites/$(request.resource.data.joinCode))
                && get(/databases/$(database)/documents/gymInvites/$(request.resource.data.joinCode)).data.gymId == gymId
                && get(/databases/$(database)/documents/gymInvites/$(request.resource.data.joinCode)).data.status == 'active'
                && get(/databases/$(database)/documents/gymInvites/$(request.resource.data.joinCode)).data.expiresAt > request.time;

  allow delete: if request.auth != null
                && resource.data.ownerUid == request.auth.uid;

  // ── CLIENTI DEL GYM ──
  // Tutti i membri possono creare, leggere, aggiornare, cancellare clienti del gym.
  match /clients/{clientId} {
    allow read, create, update, delete: if request.auth != null
      && get(/databases/$(database)/documents/gyms/$(gymId)).data.members.hasAny([request.auth.uid]);

    // ── SCHEDE DEL CLIENTE ──
    match /schede/{schedaId} {
      allow read, create, update, delete: if request.auth != null
        && get(/databases/$(database)/documents/gyms/$(gymId)).data.members.hasAny([request.auth.uid]);
    }
  }
}

// ── INVITI PT (codice 6 char = document id) ──
match /gymInvites/{inviteId} {
  // (1) Owner crea l'invito. inviteId e' il codice stesso (uppercase, charset no-ambigui).
  //     Alla create, status='active' e expiresAt entro 30 giorni.
  allow create: if request.auth != null
                && request.resource.data.invitedByUid == request.auth.uid
                && request.resource.data.status == 'active'
                && request.resource.data.expiresAt is timestamp
                && request.resource.data.expiresAt > request.time
                && request.resource.data.expiresAt < request.time + duration.value(30, 'd');

  // (2) GET consentito a chiunque loggato (serve per validare il codice all'accept).
  //     NESSUN allow list: nessuno puo' enumerare la collezione.
  //     L'owner elenca i propri inviti via gyms/{gymId}.activeInvites[] (array di codici).
  allow get: if request.auth != null;

  // (3) Update: solo l'owner originale puo' revocare / cambiare la scadenza.
  //     invitedByUid immutabile; gymId immutabile.
  allow update: if request.auth != null
                && resource.data.invitedByUid == request.auth.uid
                && request.resource.data.invitedByUid == resource.data.invitedByUid
                && request.resource.data.gymId == resource.data.gymId;

  // (4) Delete solo dall'owner.
  allow delete: if request.auth != null
                && resource.data.invitedByUid == request.auth.uid;
}
```

**Nota su `used`/`maxUses`**: rimossi dallo schema. Un contatore atomico lato client non è verificabile dalle rules (le rules vedono solo lo stato prima della write; incrementare `used` e verificare `used<maxUses` nella stessa transazione del self-join richiederebbe un server). **Difesa compensativa**: scadenza breve (default 7g, max 30g) + revoca istantanea via `status='revoked'`. Se serve limitare i join a 1-N PT specifici, l'owner può creare N inviti distinti (uno per PT) e revocarli dopo l'uso.


**Verifica post-pubblicazione** (Regola Critica #3): 7 blocchi esistenti (owner users ×2, admin users, admin appdata, deleteFeedback, sharedClients, athletes) + 2 nuovi blocchi (gyms + gymInvites) + deny finale = **10 match** da controllare.

**Scelta esplicita**: lettura di `gyms/{gymId}` ora è gated ai soli membri (contrariamente alla v1 che lasciava read:true per lo spazio pubblico). Motivo: `members[]` contiene gli uid dei PT, dato leggermente sensibile. Il branding (nome/logo/theme) per clienti anonimi (atleta.html/share.html) viene **denormalizzato nei doc che gli servono** (es. in `sharedClients/{sid}.gymBranding`).

## Inviti PT (codice 6 caratteri = document id)

**Flusso 100% client-side. Nessun Cloudflare Worker, nessun service account, nessun endpoint custom.**

### Generazione (owner)
Schermata "Palestra → Membri" → bottone "Invita PT". Form:
- Scadenza: 7 giorni (default), slider 1–30.
- Opzionale: email (per promemoria via Brevo, tramite Worker esistente `/send-email`).

Click "Genera" (client-side, nessun Worker custom):
1. Il client genera un `code` di 6 char dal charset `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` (32 char, no I/O/0/1 per evitare ambiguità) — ~10^9 combinazioni. 32⁶ ≈ 1.07 × 10⁹.
2. `fbDb.collection('gymInvites').doc(code).set({invitedByUid: uid, gymId, gymNome, createdAt: serverTimestamp, expiresAt: now + 7g, status:'active'})` **con `{merge:false}` + check preliminare `.get()` per evitare collisione (retry ≤5 volte generando un nuovo code)**.
3. Lo stesso client aggiorna `gyms/{gymId}.activeInvites = arrayUnion(code)` → l'owner avrà la lista enumerabile dei suoi codici *senza* bisogno di una `list` query sulla collezione `gymInvites`.
4. (Opzionale) Il client chiama il Worker Brevo esistente (`WORKER_URL+'/send-email'`) con nuovo template id per mandare il codice via email.

Owner vede link `https://personaltrainerboard.com/?joinGym=A4K9PX` + codice `A4K9PX`. Entrambi funzionano (il link preformatta il codice).

### Uso (PT invitato) — self-join client-side
Due entry point:
1. **Link**: `?joinGym=A4K9PX` catturato in `App.loadProfile` dopo l'auth.
2. **Codice manuale**: pannello "Entra in una palestra" nel menu account → textbox 6 char.

Entrambi chiamano lo stesso handler client-side `acceptGymInvite(code)`:
```js
async function acceptGymInvite(code){
  const codeUp = code.toUpperCase().trim();
  // 1. Legge l'invito via GET diretto (allowed by rule allow get). Se non esiste o scaduto, errore.
  const inv = await fbDb.collection('gymInvites').doc(codeUp).get();
  if(!inv.exists) throw new Error('invite-not-found');
  const d = inv.data();
  if(d.status !== 'active') throw new Error('invite-not-active');
  if(d.expiresAt.toMillis() < Date.now()) throw new Error('invite-expired');

  // 2. Self-join sul gym: solo i tre campi diff ammessi dalla rule (members, memberRoles, joinCode).
  const gymRef = fbDb.collection('gyms').doc(d.gymId);
  const gym = await gymRef.get();
  const gymData = gym.data();
  if(gymData.members.includes(uid)) throw new Error('already-member');
  const newMembers = [...gymData.members, uid];
  const newRoles = {...gymData.memberRoles, [uid]: 'trainer'};
  await gymRef.update({
    members: newMembers,
    memberRoles: newRoles,
    joinCode: codeUp   // la rule confronta joinCode con get(gymInvites/joinCode)
  });

  // 3. Il PT scrive il proprio profilo (allowed by owner rule su /users/{uid}).
  await fbDb.collection('users').doc(uid).set({
    gymId: d.gymId,
    gymRole: 'trainer',
    spaces: arrayUnion('gym'),
    lastSpace: 'gym'
  }, {merge:true});

  showToast(T.gymJoinSuccess.replace('{nome}', d.gymNome), 'success');
}
```

**Perché è sicuro senza Worker:**
- La rule (C) `self-join` controlla che la diff tocchi solo `members/memberRoles/joinCode`, che l'uid aggiunto sia esattamente `request.auth.uid`, che `memberRoles[uid]='trainer'`, e che `gymInvites/{joinCode}` esista con `gymId==gymId`, `status='active'`, `expiresAt > now`.
- Un attaccante che tenta di aggiungere un altro uid: fallisce perché `members[new] == request.auth.uid` è obbligatorio.
- Un attaccante che tenta di modificare `ownerUid`, `nome`, `theme`, ecc. nella stessa write: fallisce perché `affectedKeys().hasOnly(['members','memberRoles','joinCode'])`.
- Un codice scaduto o revocato: fallisce perché la rule interroga lo stato attuale di `gymInvites/{code}`.
- Un codice indovinato per brute force: 32⁶ combinazioni ≈ 1.07 × 10⁹, Firestore throttles le read anonime, scadenza 7g, `allow get` ma **nessun `list`** → l'attaccante deve indovinare un codice specifico attivo in questo momento.

### Revoca (owner)
Bottone "Revoca" nella lista → `gymInvites/{code}.update({status:'revoked'})`, + `gyms/{gymId}.activeInvites = arrayRemove(code)`. Rule (C) di self-join rifiuta subito dopo (`status != 'active'`).

### Elenco inviti attivi (owner)
L'owner **non interroga** `gymInvites` con una `where`. Legge `gyms/{gymId}.activeInvites[]` (array di codici) e per ogni codice fa un `get` singolo su `gymInvites/{code}` per sapere `createdAt`/`expiresAt`/`status`. Se un codice è scaduto o revocato, il bottone "Pulisci inviti" lo rimuove dall'array (`arrayRemove`).

### Rimozione PT dalla palestra
Owner nel pannello Membri → bottone "Rimuovi" per riga. Operazione **100% client-side**, nessun Worker:
1. `gyms/{gymId}.update({members: newMembers, memberRoles: newRoles})` dove `newMembers = oldMembers.filter(u => u !== targetUid)` e `newRoles` rimuove la chiave `targetUid`. Permesso dalla rule (A) owner-update (owner può toccare qualsiasi campo tranne `ownerUid`).
2. **NON scrive `users/{targetUid}` dall'account owner** (le rules non lo permettono). Il profilo del PT rimosso viene "ripulito" al suo prossimo login: `App.loadProfile` del PT rilegge `gyms/{gymId}` → read-denied (non più in `members`) → setta `users/{targetUid}.gymId=null, gymRole=null, spaces=arrayRemove('gym')` sul proprio profilo (allowed dalla owner-rule su `/users/{uid}`).
3. Nel frattempo, se il PT rimosso è ancora loggato, al prossimo refresh/listener il suo accesso ai clienti del gym fallisce: le rules deny al nuovo stato `members` lo bloccano. UI mostra "Accesso scaduto".
4. **I clienti e le schede del gym restano INVARIATI nei subcollection.** Nessuna migrazione.


## Branding (invariato da v1)

### Pipeline logo
1. `<input type="file" accept="image/*">`.
2. Resize client-side via `<canvas>` a 256×auto, aspect ratio preservato.
3. `canvas.toBlob('image/webp', q)` con `q∈{0.85,0.75,0.60}` finché <60KB; fallback `image/png`.
4. Istogramma colori (quantizzazione 12-bit, scarto neutri estremi + alpha<128); top 3 bucket come proposta palette.
5. 3 color picker (`<input type="color">`) per `accent`, `bg`, `strong`.
6. Calcolo contrasto WCAG: luminance sRGB → ratio `(L1+0.05)/(L2+0.05)`. Target: `accentOnBg ≥ 4.5` (AA testo normale), `strongOnBg ≥ 7` (AAA). Badge "AA ✓/✗".
7. Save: `gyms/{gymId}.logo` (dataURI) + `.theme` (10 token).

### Applicazione tema
In `App.loadProfile`, se `profile.gymId` e `profile.lastSpace==='gym'` ⇒ fetch `gyms/{gymId}` ⇒ rewrite CSS variables su `:root`. I getter dell'oggetto `C` (`index.html:3100-3112`) continuano a leggere `var(--bg)`/`var(--card)` ecc. ⇒ zero refactor sui componenti.

Resta hardcoded `C.blue/green/red` (hex): per il MVP accettabile, il tema modifica tutto tranne gli accent semantici. STEP successivo: estrarre `--accent` CSS var (vedi §D).

## Valutazione rapida — status

✅ **LIVE su main** (`aa0ec61`, `134d078`). Modal `QuickAssessmentModal` in `index.html` (~6795-7027), 8 campi, <5 min, PAR-Q+ gate, default intelligenti. Oggi crea il paziente via `setPatients` (PT indipendente).

**Modifica per Spazio Palestra**: cambia solo il callback `onCreate` (riga ~7620). In gym mode:
```js
onCreate={(patientData, nuoveSchede)=>{
  if(!loadedFromFirebase.current){showToast(T.qaLoading,'error'); return;}
  if(isGym){
    addClient(patientData).then(created=>{
      if(nuoveSchede && nuoveSchede.length){
        return Promise.all(nuoveSchede.map(s=>addScheda(created.id, s)))
          .then(()=>created);
      }
      return created;
    }).then(created=>{
      setSelectedId(created.id); setPage('detail'); setShowQuickAssess(false);
    }).catch(err=>{
      console.error('[QA gym] create err:', err); showToast(T.schedaGenError,'error');
    });
    return;
  }
  // path PT indipendente invariato (già live)
  ...
}}
```

## Privacy / consenso cliente

Il paziente/cliente deve sapere che i suoi dati vengono gestiti da una palestra con più PT che possono accedervi.

**Flusso minimo**:
1. Alla prima apertura di `PatientForm` in gym mode, mostrare un banner: *"I dati di questo cliente sono gestiti dalla palestra ‹Nome Palestra› e accessibili allo staff tecnico (PT) di quella palestra."*
2. Il PT dichiara di aver raccolto il consenso informato dal cliente (checkbox obbligatorio prima di salvare).
3. Al save: `consentAcceptedAt: serverTimestamp, consentAcceptedByUid: <ptUid>`.

**Testo consenso** (3 lingue, nel documento Palestra o inline), configurabile dall'owner nella sezione Impostazioni Palestra. Suggerito testo-base italiano:
> "Autorizzo la palestra ‹Nome› e il suo staff tecnico (personal trainer) al trattamento dei dati personali raccolti durante l'anamnesi, i test e la pianificazione dell'allenamento. I dati non vengono condivisi con terzi fuori dallo staff della palestra. Posso richiedere accesso, modifica o cancellazione in qualsiasi momento scrivendo a ‹email owner›."

Questa non è consulenza legale: Steve verifichi con il DPO della palestra reale alla prima implementazione.

## D. Piano implementazione (ordinato per impatto)

**FASE 0 — Prep (nessuna feature utente)**
- STEP 0.1 — Design doc (questo file).
- STEP 0.2 — Refactor `--accent` CSS variable (prerequisito tecnico per theming reale). File: `index.html`, `atleta.html`, `share.html`. Sostituzioni esatte, test visuale pixel-perfect pre/post. Rischio: medio (molte sostituzioni).

**FASE 1 — Dati Palestra passivi (zero UX)**
- STEP 1.1 — `firestore.rules`: aggiungere i 2 blocchi `gyms` + `gymInvites` (vedi §C). Pubblicare file INTERO su Console. Verifica dei 10 match post-pubblicazione.
- STEP 1.2 — Nuovi campi `users/{uid}`: `spaces`, `gymId`, `gymRole`, `lastSpace`. Retrocompat: assenti ⇒ `spaces=['pt']`. Nessuna modifica UI.
- STEP 1.3 — Admin crea manualmente da Console un gym di test con un solo membro (Steve stesso). Verifica che le rules permettono read/write del member sul subcollection.
- Rischio: basso. Nessun impatto UI per i PT storici.

**FASE 2 — Signup "Palestra" + onboarding minimo**
- STEP 2.1 — Nella pagina di signup/landing, aggiungere lo switch "Personal trainer / Palestra" (default: PT). Con "Palestra" il signup crea `gyms/{gymId}` con `ownerUid=uid` e `members=[uid]`, poi scrive `users/{uid}.spaces=['gym']`, `gymId`, `gymRole='owner'`, `lastSpace='gym'`.
- STEP 2.2 — Screen `gymOnboarding` in `index.html`: form "Nome palestra" (branding → FASE 4). Hook `applyGymTheme` in `App.loadProfile` (anche con tema vuoto = no-op).
- Test: nuovo utente sceglie "Palestra", entra con brand di default, vede sidebar "Spazio Palestra ‹Nome›".
- Rischio: basso.

**FASE 3 — Data layer condiviso (useClientData)**
- STEP 3.1 — Introdurre `useClientData` hook (§B). PT indipendente usa i `patients`+`setPatients` esistenti; gym mode usa `onSnapshot` sulla subcollection.
- STEP 3.2 — Modificare i 7 call-sites (§B tabella) per usare `addClient/updateClient/removeClient/addScheda` dall'adapter.
- STEP 3.3 — `useEffect` autosave (7206-7222): aggiungere guard `if(isGym) return;` in cima.
- STEP 3.4 — Modal Quick Assessment `onCreate` branching su `isGym`.
- Test: nel gym appena creato, "⚡ Valutazione rapida" crea un cliente nella subcollection (verifica da Firestore Console). Due browser dello stesso owner vedono il nuovo cliente in real-time.
- Rischio: alto. Mitigazione: feature flag `enableGymMode` client-side (default false fino al go-live). Deploy incrementale.

**FASE 4 — Inviti PT (codice 6 char, 100% client-side)**
- STEP 4.1 — Screen `gymMembers` visibile solo a owner. Mostra: lista membri (da `gyms/{gymId}.members`), lista inviti attivi (da `gyms/{gymId}.activeInvites[]` + un `get` per ciascun codice), bottoni Invita / Revoca / Rimuovi.
- STEP 4.2 — Generazione invito: click "Invita PT" → genera `code` 6 char client-side, `set` su `gymInvites/{code}` con `status='active', expiresAt=now+7g` + `gyms/{gymId}.activeInvites = arrayUnion(code)`. Retry fino a 5 volte su collisione (lookup preliminare via `.get()`).
- STEP 4.3 — Accettazione: `App.loadProfile` processa `?joinGym=<code>` chiamando `acceptGymInvite(code)` (vedi snippet in §Inviti PT). Validazione client-side (get invito, check status/expiresAt), poi `.update()` su `gyms/{gymId}` (self-join autorizzato dalla rule C) + `.set({merge:true})` su `users/{uid}` (owner rule esistente). Nessun Cloudflare Worker custom.
- STEP 4.4 — Pannello "Entra in una palestra con codice" nel menu account: textbox 6 char → stesso handler `acceptGymInvite`.
- STEP 4.5 — Revoca: `gymInvites/{code}.update({status:'revoked'})` + `gyms/{gymId}.activeInvites = arrayRemove(code)`.
- STEP 4.6 — Rimozione PT: owner fa `.update()` su `gyms/{gymId}` rimuovendo l'uid da `members` e `memberRoles` (autorizzato dalla rule A owner-update). Il PT rimosso ripulisce il proprio `users/{uid}` al prossimo login (owner-rule su `/users/{uid}` è già permissive per il proprio profilo).
- STEP 4.7 — (Opzionale) Email promemoria via Worker Brevo esistente `WORKER_URL+'/send-email'` con un nuovo `templateId`. Nessun endpoint custom.
- Test: owner invita A → copia link `?joinGym=A4K9PX`; A fa signup PT normale, poi apre link → vede dialog "Entra nella palestra X? [sì]"; conferma → `gyms/X.members` include A; nella sidebar compare "Spazio Palestra X"; vede tutti i clienti. Audit Firestore: la rule self-join blocca tentativi fuori diff (es. modifica `theme` o `ownerUid`), tentativo con codice scaduto, aggiunta di uid diverso dal proprio.
- Rischio: medio (regole di sicurezza complesse — testare esplicitamente ogni scenario di tentato bypass).

**FASE 5 — Branding dal logo**
- STEP 5.1 — Screen `gymBranding`: upload file, estrazione palette, WCAG badge, color picker, save.
- STEP 5.2 — Theming surfaces: `atleta.html` carica `gyms/{gymId}` via `?gym=xxx`; `share.html` legge `sharedClients/{sid}.gymBranding` denormalizzato in `buildSchedaAttuale`; PDF export applica `theme.accent` e `nomeStudio`.
- Rischio: basso (tutto client-side; retrocompat garantita da `gymId:null` ⇒ nessun hook).

**FASE 6 — Switcher spazi (dual-identity)**
- STEP 6.1 — Sidebar workspace switcher visibile solo se `profile.spaces.length>1`. Toggle PT↔Palestra; persiste `lastSpace` su `users/{uid}`.
- STEP 6.2 — Scelta "crea anche uno spazio PT per me" nell'onboarding palestra se vuoi un dual-identity nativo.
- Rischio: basso.

**FASE 7 — Piano `gym` + Stripe**
- STEP 7.1 — Payment Link Stripe (`gymMonthly`, `gymYearly`) in `PLANS` 136-141.
- STEP 7.2 — Webhook: attiva `plan='gym'` su `gyms/{gymId}` (NON più su `users/{uid}`). Durante il trial, tutti i membri hanno accesso.
- STEP 7.3 — Enforcement: `isTrialExpired` (`index.html:416`) e `App.loadProfile` (6974+) leggono `gyms/{gymId}.planExpiresAt` quando `isGym`.
- Rischio: medio (soldi).

## E. Rischi

| Rischio | Mitigazione |
|---|---|
| **Autosave PT indipendente** scrive `patients` durante gym mode. | Guard `if(isGym) return;` in testa all'effect (7206, 7218). Zero autosave quando `isGym`. |
| **Retrocompat PT storici** — il 100% degli utenti ora. | `profile.spaces` assente ⇒ fallback `['pt']`. `isGym=false` di default. Zero cambi UI. Test pixel-perfect pre-deploy OBBLIGATORIO. |
| **Firestore rules trap** (Regola Critica #3). | Pubblica file INTERO con tutti i 10 blocchi; verifica post-pubblicazione; rollback plan documentato. |
| **Concorrenza PT su stesso cliente**. | Field-level `.update()`: due PT che toccano campi diversi convivono. Stesso campo = last-write-wins (accettabile). `updatedAt` sempre scritto per audit. |
| **Delete cliente** lascia schede orfane in subcollection. | Delete batch client-side: prima `clients/{id}/schede/*`, poi `clients/{id}`. Fallback: Cloud Function trigger che pulisce al delete del parent. |
| **Snapshot listener costoso** su molti clienti. | Paginazione: in gym con >100 clienti usare `where+limit+orderBy` + "mostra altri" invece che caricare tutto. Memoria client limitata. |
| **Membri che tentano di scrivere `gyms/{gymId}` (non ownership)**. | Rules proteggono: solo ownerUid può `.update()` sul doc gym (non sui subcollection). Members possono scrivere solo in `clients/**`. |
| **Codice invito collisione**. | Charset 32 char × 6 posti = 32⁶ ≈ 1.07 × 10⁹. Client fa `.get(doc)` preliminare prima di `.set()`: se esiste, rigenera (retry ≤5). In pratica mai capita; con 10k inviti attivi, probabilità di collisione <0.001%. |
| **Codice invito riusato da estraneo (brute force)**. | 10⁹ codici possibili, `allow get` ma **nessun `list`** (rule §C), scadenza 7g default/max 30g, revoca istantanea via owner. Nessun contatore `used` ⇒ se l'owner vuole limitare l'uso a 1 PT crea un codice usa-e-revoca (un invito per PT). |
| **PT appartiene a 2 palestre**. | Non previsto: `profile.gymId` è singolo. La rule self-join vieta implicitamente di joinare un secondo gym perché `members[new]==uid` e il gym nuovo non ha `uid` in `members`; però `users/{uid}.gymId` viene sovrascritto. **Mitigazione client-side**: `acceptGymInvite` controlla `profile.gymId` prima di procedere e, se non null, chiede conferma "Vuoi lasciare la palestra X per entrare in Y?". |
| **Email invito via Brevo**. | Worker Brevo ESISTENTE (`WORKER_URL+'/send-email'`) con un nuovo `templateId`. Nessun endpoint custom. Chiave API resta solo sul Worker. |
| **PWA cache** (`sw.js` `ptboard-v55`). | Bump `CACHE='ptboard-v##'` ad ogni release gym. |
| **atleta.html / share.html pre-auth** devono comunque applicare il tema. | `atleta.html`: `?gym=<id>` esplicito. `share.html`: denormalizzare `gymBranding` dentro `sharedClients/{sid}`. |
| **Rimozione PT: side-effect su `users/{targetUid}`**. | L'owner **non scrive** sul profilo del PT rimosso (rules `/users/{uid}` sono owner-only). L'owner rimuove solo l'uid da `gyms/{gymId}.members`/`memberRoles` (autorizzato). Il profilo `users/{targetUid}.gymId/gymRole/spaces` viene ripulito dal PT stesso al suo prossimo login (l'`App.loadProfile` nota che `gyms/{old}` è read-denied e azzera). Nessuna scrittura cross-user, nessun service account. |
| **Enumerazione inviti**. | Rule `gymInvites`: `allow get`, nessun `allow list`. L'owner enumera via `gyms/{gymId}.activeInvites[]` (array di codici) + `get(gymInvites/{code})` individuale per i dettagli. Nessuno può scansionare la collezione. |
| **Rule self-join: tentativo di escalation privilege**. | La rule C ferma: (a) `affectedKeys().hasOnly(['members','memberRoles','joinCode'])` → impossibile cambiare `theme`/`ownerUid`/`nome` nella stessa write; (b) `members == old + request.auth.uid` → impossibile aggiungere altri uid; (c) `memberRoles[uid]=='trainer'` → impossibile autopromuoversi `owner`; (d) `get(gymInvites/joinCode)` deve esistere, essere `active`, `expiresAt > request.time` e `gymId == gymId`. **Test E2E obbligatorio** su ciascuna di queste 4 difese. |
| **Rule self-join: costo in reads**. | Ogni accept esegue 1 `get(gyms)` + 3 `get(gymInvites)` dentro la rule (una per `exists`, una per `.gymId`, una per `.status`, una per `.expiresAt`). Firestore conta come ~4 reads fatturate. Trascurabile. Opzionale: unificare in 1 sola `get` + binding a variabile se Firestore rules supporta `let` (dipende dalla versione). |
| **Privacy / GDPR**. | Consenso esplicito in-form, denormalizzato nel doc cliente. Dpr/dpo scritti dall'owner. Export dati e cancellazione: GET/DELETE via Worker a richiesta cliente. |
| **"Spazio Palestra" sembra app a sé** — richiede che sidebar, breadcrumb, logo e colori siano del gym. | STEP 5 (branding) + STEP 6 (switcher) devono essere completati prima di aprire al pubblico. Fino ad allora, visibile solo come alpha interno. |
| **generaSchedaAuto cambia il comportamento** inaspettatamente in gym mode. | **Non cambia.** La funzione prende `params` e `exercises`, non legge mai `patients`/`users/{uid}`. Il riuso è verbatim. Test: stessi input ⇒ stessi output in PT mode e gym mode. |

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
