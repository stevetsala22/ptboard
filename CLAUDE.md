# CLAUDE.md — Contesto progetto PT Board

> Letto automaticamente da Claude Code all'avvio di ogni sessione.
> Serve a NON dover rispiegare il progetto ogni volta. Aggiornare quando cambia
> qualcosa di strutturale.

## Cos'è PT Board
SaaS PWA per personal trainer italiani. Dominio: `personaltrainerboard.com`.
App **single-file**: `index.html` (React + Babel, ~11.000 righe).
Repo: `stevetsala22/ptboard`. Hosting: GitHub Pages.

Pagine accessorie:
- `landing.html` — homepage pubblica
- `share.html` — vista cliente di una scheda condivisa (link `/s/xxx`)
- `atleta.html` — mini-app per atleti registrati (in costruzione, vedi sotto)

## Stack tecnico
- **Frontend:** React + Babel in `index.html` single-file (no build, no bundler). `atleta.html` è invece **JS vanilla** (più leggero per la mini-app).
- **Firebase compat 10.7.0** (progetto `ptboard-1`). Firestore + Auth (Google login).
- **Pagamenti:** Stripe (4 Payment Links). Webhook su Cloudflare Worker `ptboard-webhook.ptboard-info.workers.dev`.
- **Email:** Brevo (template 1–6; NB: 4 e 5 sono invertiti in codice).
- **Altro:** GA4, Meta Pixel, Sentry, Crisp chat.

## ⚠️ REGOLE ASSOLUTE — non violare mai
1. **MAI** `fbDb.enableIndexedDbPersistence()` / `fbDb.enablePersistence()`. Crashano l'app su compat 10.7.0.
2. **Admin email:** `stevetsala22@gmail.com` (hardcoded a riga ~133, `ADMIN_EMAIL`). Attenzione ai typo (NON `tsalasteve22`).
3. **Documento dati PT:** `users/{uid}/appdata/main`, campo `patients` (array), `dataVersion: 4`.
4. **Documento dati atleta:** `athletes/{uid}/appdata/main`, campo `scheda` (oggetto), `dataVersion: 1`.
5. Prima di modificare codice, leggere SEMPRE la versione live da `https://raw.githubusercontent.com/stevetsala22/ptboard/main/<file>` — i numeri di riga cambiano spesso.

## ⚠️ Trappole già scoperte (NON ripeterle)
- **Regole Firestore:** vivono in `firestore.rules` (repo) E Console Firebase. Si pubblicano SEMPRE come file intero: una regola nuova **sovrascrive tutto**. Errore già capitato: pubblicando `sharedClients` si è perso `write` admin su `users/` e `deleteFeedback` → attivazione piani rotta.
  → **Regola operativa:** modifica PRIMA `firestore.rules` nel repo, POI copia quel file in Console.
  → Dopo OGNI modifica, verifica che ci siano TUTTI i blocchi: owner users, admin users (read+write), admin appdata, deleteFeedback, sharedClients, **athletes**, deny finale.
- **Race condition salvataggio clienti:** il flag `loadedFromFirebase` (useRef) protegge i salvataggi automatici finché `fbLoad` non completa. Diventa `true` solo nel `.finally`. NON rimuoverlo — senza, stato vuoto `[]` può sovrascrivere dati veri (bug "lista clienti vuota di Luccia").
- **Hydration pazienti:** la `.map` di hydration è in `try/catch` per paziente. Mantenerla: un singolo paziente malformato non deve far sparire l'intera lista.

## Stato attuale feature "Atleta" (mini-app)
Feature in costruzione per atleti che hanno una scheda cartacea dal PT.

- ✅ **Fase 1** — Bottone "🔗 Invita atleta" nel menu PT (`index.html`) + `atleta.html` come landing mobile-first. Genera link `personaltrainerboard.com/atleta.html?inv=<ptUid>`.
- ✅ **Fase 2a** — `atleta.html` riscritto con Google login + wizard setup scheda (1-6 giorni, esercizi con tendine serie/reps/rec). Salva in `athletes/{uid}/appdata/main`. JS vanilla. Regole Firestore aggiornate con blocco `athletes/`.
- ⏳ **Fase 2b** — Vista palestra: scegli giorno → segna peso/reps/RPE per ogni set → timer recupero automatico → storico set precedenti.
- ⏳ **Fase 3** — Collegamento opzionale PT↔atleta (atleta invitato può chiedere al PT di seguirlo).

## Punti chiave nel codice (`index.html`, ~riga)
- `ADMIN_EMAIL` → ~133
- `fbLoad` / `fbSave` (helper Firebase) → ~153–162
- `load` / `save` (localStorage) → ~428–429
- `INIT_PATIENTS = []` → ~4090
- `navItems` (menu sinistro) → ~6972 (contiene voce `invite`)
- `showInviteModal` state e modal "Invita atleta" → ~6761, ~6985
- Caricamento clienti (useEffect con `fbLoad`) → ~6740
- Salvataggio auto (useEffect localStorage+Firebase) → ~6819
- Salvataggio su chiusura (`handleHide`) → ~6831
- Attivazione/cambio piano (`setPlan`) → ~10732

## Workflow di sviluppo
- Steve scrive un briefing, Claude pianifica e prepara un **prompt singolo copia-incolla** per Claude Code.
- Claude Code committa su GitHub. Steve rivede e fa merge.
- Preferenza: un solo prompt completo, **sostituzioni di testo esatte**, niente riscritture di parti non richieste.

## Email/contatti
- Admin: `stevetsala22@gmail.com`
- Supporto: `ptboard.info@gmail.com`

---

## APPENDICE — Regole Firestore correnti (fonte di verità)
> Copia tutto il blocco qui sotto (da `rules_version` a `}` finale) in Firebase Console
> → Firestore → Regole quando pubblichi modifiche. Aggiorna questa appendice ogni volta.

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
    // Ogni atleta puo leggere/scrivere SOLO il proprio documento
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
