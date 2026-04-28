# PT Board — Audit stringhe hardcoded italiane

File: `index.html` (10316 righe totali). Righe LANGS escluse: 526–2914.

## Riepilogo per area

| Area | Stringhe candidate |
|------|-------------------|
| SIDEBAR | 8 |
| AUTH | 18 |
| LISTA_CLIENTI | 18 |
| WIZARD | 14 |
| TIMER_MODAL | 1 |
| SCHEDE | 25 |
| PROGRAMMI | 8 |
| NUTRIZIONE | 1 |
| ADMIN | 1 |
| PERSONALIZZA | 0 |
| PAGAMENTO | 2 |
| PDF | 0 |
| ESERCIZI | 2 |
| COOKIE | 3 |
| TOAST | 2 |
| PROFILI | 0 |
| ONBOARDING | 0 |
| GENERAL | 74 |
| **TOTALE** | **177** |


---
## SIDEBAR (8 stringhe)

| Riga | Tipo | Stringa | Contesto (troncato) |
|------|------|---------|---------------------|
| 6334 | SQ_STRING | Completa gli step precedenti per sbloccare | <span className="tp">{locked?'Completa gli step precedenti per sbloccare':n.tip} |
| 6341 | JSX_TEXT | Avvia nuova valutazione cliente | <span className="tp">Avvia nuova valutazione cliente</span> |
| 6365 | JSX_TEXT | Il mio piano | <div style={{fontSize:13,fontWeight:700,color:C.muted,textTransform:'uppercase', |
| 6368 | SQ_STRING | team'?(trainerProfile?.planExpiresAt?'Scade il | <div style={{fontSize:13,color:C.muted,marginTop:4}}>{trainerProfile?.plan==='pr |
| 6368 | SQ_STRING | it-IT'):'Attivo'):'Scade tra | <div style={{fontSize:13,color:C.muted,marginTop:4}}>{trainerProfile?.plan==='pr |
| 10197 | JSX_TEXT | Come prenotare | <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spaci |
| 10239 | SQ_STRING | Apri la scheda cliente','Esplora le 5 tab e prenota sedute | ${[['1','🎯','Clicca 🎯 Valutazione nel menu','Scegli Base, Completa o Anagrafica' |
| 10239 | SQ_STRING | Prova il calendario','Prenota appuntamenti e invia promemoria | ${[['1','🎯','Clicca 🎯 Valutazione nel menu','Scegli Base, Completa o Anagrafica' |

---
## AUTH (18 stringhe)

| Riga | Tipo | Stringa | Contesto (troncato) |
|------|------|---------|---------------------|
| 3451 | SQ_STRING | Sotto la media',c: | if(v<ref*0.85)return{l:'Sotto la media',c:'#f59e0b',cons:`PhA ${v}° inferiore al |
| 3452 | SQ_STRING | Nella norma',c: | if(v<ref*1.15)return{l:'Nella norma',c:'#10b981',cons:`PhA ${v}° nella norma (ri |
| 3453 | SQ_STRING | Sopra la media',c: | return{l:'Sopra la media',c:'#3b82f6',cons:`PhA ${v}° eccellente (> media ${ref} |
| 6545 | JSX_TEXT | Annulla | <button onClick={()=>setShowLogoutModal(false)} style={{flex:1,padding:'12px',bo |
| 6546 | JSX_TEXT | Sì, esci | <button onClick={()=>{setShowLogoutModal(false);localStorage.removeItem('fitmana |
| 6551 | DQ_STRING | Eliminare definitivamente il tuo account? | {showDeleteAccount&&<Modal title="Eliminare definitivamente il tuo account?" onC |
| 6553 | JSX_TEXT | Tutti i tuoi dati, pazienti, appuntamenti e impostazioni verranno eliminati perm | <div style={{fontSize:13,color:C.text,lineHeight:1.6,background:'#ef444415',bord |
| 6584 | SQ_STRING | ELIMINA | }} style={{...S.btn(),background:'#ef4444',opacity:deleteConfirmText==='ELIMINA' |
| 6584 | SQ_STRING | ELIMINA'?'pointer':'not-allowed | }} style={{...S.btn(),background:'#ef4444',opacity:deleteConfirmText==='ELIMINA' |
| 9571 | SQ_STRING | Il tuo abbonamento è scaduto. Rinnova per continuare.':'Il tuo account è stato s | <div style={{fontSize:14,color:'#64748b',marginBottom:32}}>{profile?.planExpired |
| 9580 | SQ_STRING | Clienti illimitati','Tutte le funzionalità','PDF con il tuo logo','Supporto emai | const features=['Clienti illimitati','Tutte le funzionalità','PDF con il tuo log |
| 9997 | SQ_STRING | Email non ancora verificata. Controlla la casella di posta (anche lo spam). | setErr('Email non ancora verificata. Controlla la casella di posta (anche lo spa |
| 10008 | SQ_STRING | invio. Riprova tra qualche minuto. | }catch(e){setErr('Errore nell\'invio. Riprova tra qualche minuto.');} |
| 10019 | JSX_TEXT | Verifica la tua email | <div style={{fontSize:20,fontWeight:800,color:'#f8fafc',marginBottom:10}}>Verifi |
| 10025 | JSX_TEXT | Ho verificato, accedi | <button onClick={checkVerified} disabled={loading} style={{width:'100%',padding: |
| 10049 | SQ_STRING | auth/email-already-in-use') return 'Email già registrata | if(code==='auth/email-already-in-use') return 'Email già registrata'; |
| 10051 | SQ_STRING | auth/invalid-email') return 'Email non valida | if(code==='auth/invalid-email') return 'Email non valida'; |
| 10080 | SQ_STRING | Le password non coincidono | const doRegister=async()=>{setErr('');if(pw!==pw2){setErr('Le password non coinc |

---
## LISTA_CLIENTI (18 stringhe)

| Riga | Tipo | Stringa | Contesto (troncato) |
|------|------|---------|---------------------|
| 4075 | JSX_TEXT | Sedute per settimana | <div style={S.st}>Sedute per settimana</div> |
| 6485 | JSX_TEXT | Gestisci clienti, valutazioni e allenamenti in un unico posto. | <p style={{fontSize:13,color:C.muted,marginTop:8,lineHeight:1.6}}>Gestisci clien |
| 6490 | JSX_TEXT | Crea un nuovo cliente con il wizard guidato | <div><div style={{fontSize:15,fontWeight:700,color:C.blue}}>Valutazione 20 min</ |
| 6494 | JSX_TEXT | Vedi la lista completa e le schede | <div><div style={{fontSize:15,fontWeight:700,color:C.strong}}>I miei clienti</di |
| 6556 | SQ_STRING | Troppo costoso','Non mi serve più', | {['Troppo costoso','Non mi serve più','Ho trovato un\'alternativa migliore','Tro |
| 6556 | SQ_STRING | alternativa migliore','Troppo complicato da usare','Altro motivo | {['Troppo costoso','Non mi serve più','Ho trovato un\'alternativa migliore','Tro |
| 6560 | SQ_STRING | Altro motivo | {deleteReason==='Altro motivo'&&<textarea style={{...S.inp,border:'1px solid #33 |
| 6560 | DQ_STRING | Descrivi il motivo... | {deleteReason==='Altro motivo'&&<textarea style={{...S.inp,border:'1px solid #33 |
| 6561 | JSX_TEXT | ELIMINA | <div style={{fontSize:12,color:C.muted,marginTop:4}}>Scrivi <strong style={{colo |
| 6561 | JSX_TEXT | per confermare: | <div style={{fontSize:12,color:C.muted,marginTop:4}}>Scrivi <strong style={{colo |
| 9729 | SQ_STRING | Clienti illimitati','Tutte le funzionalità','PDF con il tuo logo','Supporto emai | const features=['Clienti illimitati','Tutte le funzionalità','PDF con il tuo log |
| 9737 | JSX_TEXT | Scegli il tuo piano | <div style={{fontSize:22,fontWeight:900,color:'#f8fafc',marginBottom:6}}>Scegli  |
| 10115 | JSX_TEXT | Gestione clienti per Personal Trainer | <div style={{fontSize:13,color:'#64748b'}}>Gestione clienti per Personal Trainer |
| 10160 | SQ_STRING | Il tuo strumento completo per gestire clienti, valutazioni, allenamenti e molto  | {label:'Benvenuto',time:'1 min',bc:'#3b82f630',bct:'#60a5fa',badge:'Introduzione |
| 10162 | SQ_STRING | Scheda cliente','Dopo la valutazione trovi tutto: sedute, peso, programma, nutri | ${[['🥇','Valutazione 20 min','Il cuore dell\'app. 3 modalità: Base (~10 min), Co |
| 10162 | SQ_STRING | Dashboard','Panoramica rapida: clienti attivi, sedute della settimana, metriche  | ${[['🥇','Valutazione 20 min','Il cuore dell\'app. 3 modalità: Base (~10 min), Co |
| 10182 | SQ_STRING | Dopo la valutazione ogni cliente ha una scheda completa con 5 tab principali. Ac | {label:'📋 Scheda cliente',time:'Uso quotidiano',bc:'#10b98130',bct:'#2dd4bf',bad |
| 10194 | SQ_STRING | Gestione agenda',title:'Calendario e promemoria automatici',desc:'Prenota appunt | {label:'📅 Calendario & Email',time:'Appuntamenti',bc:'#f59e0b30',bct:'#fbbf24',b |

---
## WIZARD (14 stringhe)

| Riga | Tipo | Stringa | Contesto (troncato) |
|------|------|---------|---------------------|
| 454 | SQ_STRING | ID','Cognome','Nome','Sesso','Data nascita','Altezza (cm)','Peso (kg)','BMI','Pr | const headers=['ID','Cognome','Nome','Sesso','Data nascita','Altezza (cm)','Peso |
| 3497 | SQ_STRING | Valutazione posturale registrata. Monitorare nel tempo. | return map[tipo]\|\|{l:tipo,c:C.muted,cons:'Valutazione posturale registrata. Mo |
| 3504 | SQ_STRING | Spalle allineate, buon equilibrio rotatori. Mantenere con: face pull, external r | 'Normali':{l:'Allineamento normale',c:'#10b981',cons:'Spalle allineate, buon equ |
| 4175 | SQ_STRING | B'?'Forma Media':'Buona Forma | {pr&&<span style={{...S.tag(pr.c,pr.bg),fontSize:isMobile?13:11,padding:isMobile |
| 6532 | SQ_STRING | C'?'Buona Forma':'- | askSendEmail({pat:p,subject:'Valutazione completata',message:'La tua valutazione |
| 8580 | SQ_STRING | SI in corso | {d.sesso==='F'&&<WizIn lbl={T.wizGravidanza} name="gravidanza" val={d.gravidanza |
| 8596 | SQ_STRING | Non fumatore | {d.fumo&&d.fumo!=='Non fumatore'&&<InterpBox interp={interpFumo(d.fumo==='Ex fum |
| 8596 | SQ_STRING | Fumatore regolare'?'Moderato':'Non fumatore | {d.fumo&&d.fumo!=='Non fumatore'&&<InterpBox interp={interpFumo(d.fumo==='Ex fum |
| 8610 | SQ_STRING | Molto limitata | {d.mobCaviglia&&d.mobCaviglia!=='Ottima'&&d.mobCaviglia!=='Buona'&&<InterpBox in |
| 8612 | SQ_STRING | Molto limitata | {d.mobAnca&&d.mobAnca!=='Ottima'&&d.mobAnca!=='Buona'&&<InterpBox interp={interp |
| 9186 | SQ_STRING | Altro'?' | var cls=classificaForza(d.rmEsercizio==='Altro'?'':d.rmEsercizio,rm,parseFloat(d |
| 9523 | SQ_STRING | Non fumatore | var p={nome:d.nome,cognome:d.cognome,sesso:d.sesso\|\|'',ddn:d.ddn,annoNascita:a |
| 10171 | SQ_STRING | Qualità Movimento','Squat profondità, compensi, affondo FMS', | ${[['1','Anagrafica & Clinica','Nome, peso, altezza, patologie, PAR-Q — BMI e FC |
| 10237 | JSX_TEXT | Segui questi 3 passi e sei operativo in 5 minuti | <div style="font-size:13px;color:#64748b;margin-bottom:20px">Segui questi 3 pass |

---
## TIMER_MODAL (1 stringhe)

| Riga | Tipo | Stringa | Contesto (troncato) |
|------|------|---------|---------------------|
| 8209 | SQ_STRING | NO',gravidanza:'NO',fumo:'Non fumatore',alcol:'Mai | familiarita:'NO',gravidanza:'NO',fumo:'Non fumatore',alcol:'Mai', |

---
## SCHEDE (25 stringhe)

| Riga | Tipo | Stringa | Contesto (troncato) |
|------|------|---------|---------------------|
| 3473 | SQ_STRING | FM% da atleta (6-13% ACSM). Ottimo per performance. Mantenere con alimentazione  | if(v<14)return{l:'Atletico',c:'#3b82f6',cons:'FM% da atleta (6-13% ACSM). Ottimo |
| 3474 | SQ_STRING | FM% nella fascia fitness (14-17% ACE). Eccellente per salute e performance. Comp | if(v<18)return{l:'Fitness',c:'#10b981',cons:'FM% nella fascia fitness (14-17% AC |
| 3479 | SQ_STRING | FM% da atleta (14-20% ACSM). Eccellente per performance sportiva. Monitorare cic | if(v<21)return{l:'Atletico',c:'#3b82f6',cons:'FM% da atleta (14-20% ACSM). Eccel |
| 3480 | SQ_STRING | FM% nella fascia fitness (21-24% ACE). Composizione corporea ideale per salute e | if(v<25)return{l:'Fitness',c:'#10b981',cons:'FM% nella fascia fitness (21-24% AC |
| 3490 | SQ_STRING | Allineamento nella norma. Mantenere con: core stability (plank, dead bug, bird d | 'Normale':{l:'Curve fisiologiche normali',c:'#10b981',cons:'Allineamento nella n |
| 3546 | SQ_STRING | Non fumatore | 'Non fumatore':{l:'Non fumatore',c:'#10b981',cons:'Nessun impatto da fumo su VO2 |
| 3546 | SQ_STRING | Non fumatore',c: | 'Non fumatore':{l:'Non fumatore',c:'#10b981',cons:'Nessun impatto da fumo su VO2 |
| 3546 | SQ_STRING | Nessun impatto da fumo su VO2max e FC. Capacità aerobica non limitata da fattori | 'Non fumatore':{l:'Non fumatore',c:'#10b981',cons:'Nessun impatto da fumo su VO2 |
| 3559 | SQ_STRING | Nessun impatto da alcol su recupero e metabolismo. Ottimale per performance e co | 'Astemio':{l:'Astemio',c:'#10b981',cons:'Nessun impatto da alcol su recupero e m |
| 3646 | SQ_STRING | E58',nome:'Jumping Jack',cat:'Cardio',muscoli:'Full Body',desc:'Salti con apertu | {id:'E58',nome:'Jumping Jack',cat:'Cardio',muscoli:'Full Body',desc:'Salti con a |
| 3651 | SQ_STRING | E62',nome:'Stretching Psoas',cat:'Mobilita',muscoli:'Flessori Anca',desc:'Allung | {id:'E62',nome:'Stretching Psoas',cat:'Mobilita',muscoli:'Flessori Anca',desc:'A |
| 4382 | SQ_STRING | Generata con | '<span class="center">'+esc(T.generatedWith\|\|'Generata con')+' <b>PT Board</b> |
| 4898 | SQ_STRING | Non fumatore | {p.fumo&&p.fumo!=='Non fumatore'&&<InterpBox interp={interpFumo(p.fumo==='Ex fum |
| 4898 | SQ_STRING | Fumatore regolare'?'Moderato':'Non fumatore | {p.fumo&&p.fumo!=='Non fumatore'&&<InterpBox interp={interpFumo(p.fumo==='Ex fum |
| 5470 | JSX_TEXT | Aggiungi esercizio | <div style={S.st}>Aggiungi esercizio</div> |
| 5501 | JSX_TEXT | Salva scheda | <button style={S.btn()} onClick={()=>form.nome&&onSave(form)}>Salva scheda</butt |
| 6626 | SQ_STRING | push-up', 'military press', 'lento avanti | if (patologie.includes('spalla') \|\| patologie.includes('cuffia')) esclusiNomi  |
| 6635 | SQ_STRING | military press','lento avanti','shoulder press','overhead','push press','alzate  | if (noOverheadPress) esclusiNomi = esclusiNomi.concat(['military press','lento a |
| 7194 | SQ_STRING | Buona Forma | var nomeProfilo = profilo === 'A' ? (TParam && TParam.profileLowShort \|\| 'Form |
| 7200 | SQ_STRING | Volume adattato alla durata della seduta ( | : 'Volume adattato alla durata della seduta (' + durataSeduta + ' min).'; |
| 7398 | SQ_STRING | Molto alto | if (ctx.stress === 'Alto' \|\| ctx.stress === 'Molto alto') { |
| 7438 | SQ_STRING | Full Body', ripetizioniSettimana: sed, razionaleSplit: 'Full Body: profilo princ | return { splitType: 'Full Body', ripetizioniSettimana: sed, razionaleSplit: 'Ful |
| 7467 | SQ_STRING | Upper / Lower', ripetizioniSettimana: 2, razionaleSplit: 'Upper/Lower con giorno | return { splitType: 'Upper / Lower', ripetizioniSettimana: 2, razionaleSplit: 'U |
| 7816 | SQ_STRING | elevato, priorità recupero':'moderato, spazio per progressione | noteProgr='Metabolico — +'+tassoCarico+'% carico o -5s recupero. Con '+sed_+' se |
| 7837 | SQ_STRING | Per risultati ottimali di | seduteWarning = 'Per risultati ottimali di ' + (obiettivo === 'Forza' ? 'forza'  |

---
## PROGRAMMI (8 stringhe)

| Riga | Tipo | Stringa | Contesto (troncato) |
|------|------|---------|---------------------|
| 3536 | SQ_STRING | Nessuna risposta positiva al PAR-Q. Il cliente può iniziare un programma di atti | if(v===0)return{l:'Rischio basso — clearance OK',c:'#10b981',cons:'Nessuna rispo |
| 4627 | JSX_TEXT | Aggiungi sesso | <button onClick={onEdit} style={{background:'#EF9F27',color:'#fff',border:'none' |
| 4644 | SQ_STRING | Il certificato è scaduto il | {isExp?'Il certificato è scaduto il '+scad+'. Richiedere il rinnovo prima della  |
| 4644 | SQ_STRING | Il certificato scade il | {isExp?'Il certificato è scaduto il '+scad+'. Richiedere il rinnovo prima della  |
| 5156 | SQ_STRING | Intensità | ['Intensità',p.programma.razionale.intensita], |
| 10215 | JSX_TEXT | Stiamo sviluppando questa funzionalità. Riceverai una notifica quando sarà dispo | <div style="font-size:12px;color:#94a3b8;line-height:1.7;margin-bottom:10px">Sti |
| 10216 | JSX_TEXT | L'AI Coach analizzerà il profilo del cliente e genererà un programma completo in | <div style="font-size:12px;color:#94a3b8;line-height:1.7">L'AI Coach analizzerà  |
| 10223 | SQ_STRING | Apri in Safari','Tocca il pulsante Condividi','Aggiungi a schermata Home | ${['Apri in Safari','Tocca il pulsante Condividi','Aggiungi a schermata Home'].m |

---
## NUTRIZIONE (1 stringhe)

| Riga | Tipo | Stringa | Contesto (troncato) |
|------|------|---------|---------------------|
| 3273 | SQ_STRING | Molto alto | if(p.stressPercepito==='Alto'\|\|p.stressPercepito==='Molto alto')kcal=Math.roun |

---
## ADMIN (1 stringhe)

| Riga | Tipo | Stringa | Contesto (troncato) |
|------|------|---------|---------------------|
| 6466 | SQ_STRING | Il tuo piano scade tra | <span style={{fontSize:13,fontWeight:600,color:urgent?'#ef4444':'#10b981'}}>{urg |

---
## PAGAMENTO (2 stringhe)

| Riga | Tipo | Stringa | Contesto (troncato) |
|------|------|---------|---------------------|
| 9745 | SQ_STRING | Piano Pro attivo':'Piano Team attivo | <div style={{fontSize:18,fontWeight:700,color:'#10b981'}}>{isPro?'Piano Pro atti |
| 9747 | JSX_TEXT | Grazie per il supporto! | <div style={{fontSize:13,color:'#64748b',marginTop:8}}>Grazie per il supporto!</ |

---
## ESERCIZI (2 stringhe)

| Riga | Tipo | Stringa | Contesto (troncato) |
|------|------|---------|---------------------|
| 3580 | SQ_STRING | E01',nome:'Squat',cat:'Forza',muscoli:'Quadricipiti, Glutei',desc:'Piegamento su | {id:'E01',nome:'Squat',cat:'Forza',muscoli:'Quadricipiti, Glutei',desc:'Piegamen |
| 3584 | SQ_STRING | E05',nome:'Bulgarian Split Squat',cat:'Forza',muscoli:'Quadricipiti, Glutei',des | {id:'E05',nome:'Bulgarian Split Squat',cat:'Forza',muscoli:'Quadricipiti, Glutei |

---
## COOKIE (3 stringhe)

| Riga | Tipo | Stringa | Contesto (troncato) |
|------|------|---------|---------------------|
| 34 | JSX_TEXT | Utilizziamo cookie analitici per migliorare il servizio. | banner.innerHTML = '<div style="flex:1;min-width:240px;font-size:13px;color:#94a |
| 36 | JSX_TEXT | Solo necessari | + '<button id="cookie-necessary" style="padding:10px 20px;border-radius:8px;bord |
| 37 | JSX_TEXT | Accetta tutti | + '<button id="cookie-accept" style="padding:10px 20px;border-radius:8px;border: |

---
## TOAST (2 stringhe)

| Riga | Tipo | Stringa | Contesto (troncato) |
|------|------|---------|---------------------|
| 3780 | JSX_TEXT | Annulla | {isConfirm&&<button onClick={handleCancel} style={{background:'#ef444420',color: |
| 9977 | JSX_TEXT | Scarica tutti gli utenti e i loro dati (appdata) in formato JSON. | <div style={{fontSize:11,color:'#475569',marginTop:6}}>Scarica tutti gli utenti  |

---
## GENERAL (74 stringhe)

| Riga | Tipo | Stringa | Contesto (troncato) |
|------|------|---------|---------------------|
| 409 | JSX_TEXT | Errore nel caricamento dell'app | <div style="font-size:14px;color:#ef4444;margin-bottom:8px">Errore nel caricamen |
| 410 | JSX_TEXT | Potrebbe essere un problema temporaneo di rete. Prova a ricaricare la pagina. | <div style="font-size:12px;color:#64748b;margin-bottom:16px">Potrebbe essere un  |
| 2991 | SQ_STRING | Poco attiva':0.92,Moderata:1.0,Attiva:1.08,'Molto attiva | var f6={Sedentaria:0.85,'Poco attiva':0.92,Moderata:1.0,Attiva:1.08,'Molto attiv |
| 2992 | SQ_STRING | Poco attiva':0.9,Moderata:1.0,Attiva:1.15,'Molto attiva | var fSts={Sedentaria:0.75,'Poco attiva':0.9,Moderata:1.0,Attiva:1.15,'Molto atti |
| 2993 | SQ_STRING | Poco attiva':0.95,Moderata:1.0,Attiva:1.1,'Molto attiva | var fHg={Sedentaria:0.85,'Poco attiva':0.95,Moderata:1.0,Attiva:1.1,'Molto attiv |
| 2994 | SQ_STRING | Poco attiva':1.1,Moderata:1.0,Attiva:0.85,'Molto attiva | var fTug={Sedentaria:1.2,'Poco attiva':1.1,Moderata:1.0,Attiva:0.85,'Molto attiv |
| 3046 | SQ_STRING | m per | components.push({id:'aerobica',label:'Capacita aerobica (6MWT)',w:40,score:s,val |
| 3086 | SQ_STRING | s per | components.push({id:'equilibrio',label:'Equilibrio (TUG)',w:10,score:ts,val:t+'s |
| 3121 | SQ_STRING | Non fumatore | var fumo=d.fumo\|\|'Non fumatore'; |
| 3130 | SQ_STRING | Sedentaria':20,'Poco attiva':38,'Moderata':58,'Attiva':74,'Molto attiva | 'Sedentaria':20,'Poco attiva':38,'Moderata':58,'Attiva':74,'Molto attiva':90 |
| 3183 | SQ_STRING | Molto alto | if(stress==='Alto'\|\|stress==='Molto alto')score=Math.round(score*0.95); |
| 3211 | SQ_STRING | aerobica',label:'Capacità aerobica (stimata) | {id:'aerobica',label:'Capacità aerobica (stimata)',w:Math.round(wA*100),score:ae |
| 3212 | SQ_STRING | Non fumatore'? | val:att+(fumo!=='Non fumatore'?' · '+fumo:''),icon:'🚶'}, |
| 3254 | SQ_STRING | Sedentaria':1.2,'Poco attiva':1.375,'Moderata':1.55,'Attiva':1.725,'Molto attiva | var fattori={'Sedentaria':1.2,'Poco attiva':1.375,'Moderata':1.55,'Attiva':1.725 |
| 3353 | SQ_STRING | Molto alto | if(p.stressPercepito==='Alto'\|\|p.stressPercepito==='Molto alto')note.push(T.nu |
| 3509 | SQ_STRING | Postura spalle registrata. Monitorare nel tempo. | return map[tipo]\|\|{l:tipo,c:C.muted,cons:'Postura spalle registrata. Monitorar |
| 3516 | SQ_STRING | Ottima mobilità',c: | if(v>=12)return{l:'Ottima mobilità',c:'#3b82f6',cons:'Dorsiflessione eccellente  |
| 3519 | SQ_STRING | Molto ridotta',c: | return{l:'Molto ridotta',c:'#ef4444',cons:'Mobilità caviglia molto ridotta (<7 c |
| 3526 | SQ_STRING | Ottima mobilità',c: | if(v>=120)return{l:'Ottima mobilità',c:'#3b82f6',cons:'Flessione anca completa ( |
| 3529 | SQ_STRING | Molto ridotta',c: | return{l:'Molto ridotta',c:'#ef4444',cons:'Mobilità anca molto ridotta (<80°). R |
| 3588 | SQ_STRING | E08',nome:'Hip Thrust',cat:'Forza',muscoli:'Glutei',desc:'Ponte glutei con schie | {id:'E08',nome:'Hip Thrust',cat:'Forza',muscoli:'Glutei',desc:'Ponte glutei con  |
| 3589 | SQ_STRING | E09',nome:'Affondi',cat:'Forza',muscoli:'Quadricipiti, Glutei',desc:'Passo avant | {id:'E09',nome:'Affondi',cat:'Forza',muscoli:'Quadricipiti, Glutei',desc:'Passo  |
| 3590 | SQ_STRING | E10',nome:'Step-Up',cat:'Forza',muscoli:'Quadricipiti, Glutei',desc:'Salita su r | {id:'E10',nome:'Step-Up',cat:'Forza',muscoli:'Quadricipiti, Glutei',desc:'Salita |
| 3593 | SQ_STRING | E13',nome:'Good Morning',cat:'Forza',muscoli:'Femorali, Lombari',desc:'Flessione | {id:'E13',nome:'Good Morning',cat:'Forza',muscoli:'Femorali, Lombari',desc:'Fles |
| 3599 | SQ_STRING | E18',nome:'Push-up Ginocchia',cat:'Forza',muscoli:'Pettorali, Tricipiti',desc:'F | {id:'E18',nome:'Push-up Ginocchia',cat:'Forza',muscoli:'Pettorali, Tricipiti',de |
| 3600 | SQ_STRING | E19',nome:'Panca Manubri',cat:'Forza',muscoli:'Pettorali, Tricipiti',desc:'Diste | {id:'E19',nome:'Panca Manubri',cat:'Forza',muscoli:'Pettorali, Tricipiti',desc:' |
| 3601 | SQ_STRING | E20',nome:'Panca Bilanciere',cat:'Forza',muscoli:'Pettorali, Tricipiti',desc:'Di | {id:'E20',nome:'Panca Bilanciere',cat:'Forza',muscoli:'Pettorali, Tricipiti',des |
| 3605 | SQ_STRING | E23',nome:'Rematore Manubrio',cat:'Forza',muscoli:'Dorsali, Bicipiti',desc:'Tira | {id:'E23',nome:'Rematore Manubrio',cat:'Forza',muscoli:'Dorsali, Bicipiti',desc: |
| 3608 | SQ_STRING | E26',nome:'Pulley Basso',cat:'Forza',muscoli:'Dorsali, Bicipiti',desc:'Tirata or | {id:'E26',nome:'Pulley Basso',cat:'Forza',muscoli:'Dorsali, Bicipiti',desc:'Tira |
| 3612 | SQ_STRING | E29',nome:'Press Spalle Manubri',cat:'Forza',muscoli:'Spalle, Tricipiti',desc:'D | {id:'E29',nome:'Press Spalle Manubri',cat:'Forza',muscoli:'Spalle, Tricipiti',de |
| 3618 | SQ_STRING | E34',nome:'Curl Manubri',cat:'Forza',muscoli:'Bicipiti',desc:'Flessione avambrac | {id:'E34',nome:'Curl Manubri',cat:'Forza',muscoli:'Bicipiti',desc:'Flessione ava |
| 3619 | SQ_STRING | E35',nome:'Curl Bilanciere',cat:'Forza',muscoli:'Bicipiti',desc:'Flessione avamb | {id:'E35',nome:'Curl Bilanciere',cat:'Forza',muscoli:'Bicipiti',desc:'Flessione  |
| 3625 | SQ_STRING | E40',nome:'Dip Panca',cat:'Forza',muscoli:'Tricipiti',desc:'Flessioni inverse co | {id:'E40',nome:'Dip Panca',cat:'Forza',muscoli:'Tricipiti',desc:'Flessioni inver |
| 3626 | SQ_STRING | E41',nome:'Kickback',cat:'Forza',muscoli:'Tricipiti',desc:'Estensione indietro c | {id:'E41',nome:'Kickback',cat:'Forza',muscoli:'Tricipiti',desc:'Estensione indie |
| 3633 | SQ_STRING | E46',nome:'Mountain Climbers',cat:'Core',muscoli:'Core, Full Body',desc:'Arrampi | {id:'E46',nome:'Mountain Climbers',cat:'Core',muscoli:'Core, Full Body',desc:'Ar |
| 3635 | SQ_STRING | E48',nome:'Russian Twist',cat:'Core',muscoli:'Addome, Obliqui',desc:'Rotazione d | {id:'E48',nome:'Russian Twist',cat:'Core',muscoli:'Addome, Obliqui',desc:'Rotazi |
| 3657 | SQ_STRING | E67',nome:'Panca Inclinata Manubri',cat:'Forza',muscoli:'Pettorali alto, Spalle' | {id:'E67',nome:'Panca Inclinata Manubri',cat:'Forza',muscoli:'Pettorali alto, Sp |
| 3659 | SQ_STRING | E69',nome:'Pectoral Machine',cat:'Forza',muscoli:'Pettorali',desc:'Macchina ad a | {id:'E69',nome:'Pectoral Machine',cat:'Forza',muscoli:'Pettorali',desc:'Macchina |
| 3661 | SQ_STRING | E70',nome:'Pulley Alto',cat:'Forza',muscoli:'Dorsali, Trapezi',desc: | {id:'E70',nome:'Pulley Alto',cat:'Forza',muscoli:'Dorsali, Trapezi',desc:'Tirata |
| 3664 | SQ_STRING | E72',nome:'Military Press Bilanciere',cat:'Forza',muscoli:'Spalle, Tricipiti',de | {id:'E72',nome:'Military Press Bilanciere',cat:'Forza',muscoli:'Spalle, Tricipit |
| 3665 | SQ_STRING | E73',nome:'Vertical Press Macchina',cat:'Forza',muscoli:'Spalle, Tricipiti',desc | {id:'E73',nome:'Vertical Press Macchina',cat:'Forza',muscoli:'Spalle, Tricipiti' |
| 3666 | SQ_STRING | E74',nome:'Rear Delt Machine',cat:'Forza',muscoli:'Spalle posteriori',desc:'Macc | {id:'E74',nome:'Rear Delt Machine',cat:'Forza',muscoli:'Spalle posteriori',desc: |
| 3668 | SQ_STRING | E75',nome:'Curl Cavo Basso',cat:'Forza',muscoli:'Bicipiti',desc: | {id:'E75',nome:'Curl Cavo Basso',cat:'Forza',muscoli:'Bicipiti',desc:'Curl bicip |
| 3678 | SQ_STRING | E81',nome:'Slanci Glutei con Disco',cat:'Forza',muscoli:'Glutei',desc:'Hip exten | {id:'E81',nome:'Slanci Glutei con Disco',cat:'Forza',muscoli:'Glutei',desc:'Hip  |
| 3683 | SQ_STRING | E85',nome:'Crunch Macchina',cat:'Core',muscoli:'Addome',desc:'Crunch guidato all | {id:'E85',nome:'Crunch Macchina',cat:'Core',muscoli:'Addome',desc:'Crunch guidat |
| 3684 | SQ_STRING | E86',nome:'Leg Raise',cat:'Core',muscoli:'Addome basso',desc: | {id:'E86',nome:'Leg Raise',cat:'Core',muscoli:'Addome basso',desc:'Sollevamento  |
| 3688 | SQ_STRING | E89',nome:'Pedalata Gambe Alte',cat:'Cardio',muscoli:'Gambe, Cuore',desc:'Pedala | {id:'E89',nome:'Pedalata Gambe Alte',cat:'Cardio',muscoli:'Gambe, Cuore',desc:'P |
| 3701 | SQ_STRING | E98',nome:'Curl Asciugamano',cat:'Forza',muscoli:'Bicipiti',desc:'Curl isometric | {id:'E98',nome:'Curl Asciugamano',cat:'Forza',muscoli:'Bicipiti',desc:'Curl isom |
| 4086 | JSX_TEXT | Goditi la pausa! | {todayBookings.length===0&&<div style={{textAlign:'center',padding:'20px 0'}}><d |
| 5398 | SQ_STRING | Mobilità/stretching | <FF label={T.calLblTypeFull} name="tipo" value={newSeduta.tipo} onChange={e=>set |
| 5870 | SQ_STRING | Modifica esercizio':'Nuovo esercizio | <Modal title={editing?'Modifica esercizio':'Nuovo esercizio'} onClose={()=>setSh |
| 6410 | JSX_TEXT | Disconnetti il tuo account | <div className="tt"><button onClick={()=>setShowLogoutModal(true)} style={{backg |
| 6427 | JSX_TEXT | Disconnetti il tuo account | <div className="tt"><button onClick={()=>setShowLogoutModal(true)} style={{backg |
| 6562 | DQ_STRING | ELIMINA | <input style={{...S.inp,border:'1px solid #ef444440'}} placeholder="ELIMINA" val |
| 6563 | SQ_STRING | ELIMINA | <button disabled={deleteConfirmText!=='ELIMINA'} onClick={async()=>{ |
| 7050 | SQ_STRING | Gambe extra (STS basso) | if (rSts < 0.8) testSlotsLower.push({primary:['quadricipiti'], move:['legs'], la |
| 7058 | SQ_STRING | Farmer walk / Dead hang (grip basso) | if (rHg < 0.8) testSlotsAny.push({primary:['dorso','femorali'], label:'Farmer wa |
| 7061 | SQ_STRING | Core extra (plank basso) | testSlotsAny.push({primary:['core'], move:['core'], label:'Core extra (plank bas |
| 7065 | SQ_STRING | Equilibrio (TUG alto) | if (rTug > 1.2) testSlotsLower.push({primary:['core'], move:['core'], label:'Equ |
| 7839 | SQ_STRING | Per un deficit efficace si consigliano almeno 3 sedute/settimana. | seduteWarning = 'Per un deficit efficace si consigliano almeno 3 sedute/settiman |
| 8119 | JSX_TEXT | Dati mancanti per uno score piu preciso: | <div style={{fontSize:11,fontWeight:700,color:C.yellow}}>Dati mancanti per uno s |
| 8745 | SQ_STRING | SI','NO | {['SI','NO'].map(function(opt){return( |
| 9425 | SQ_STRING | buono'? | if(d.affondo){var af=d.affondo;var cl7=af==='impossibile'\|\|af==='scarso'?C.red |
| 9596 | JSX_TEXT | Il tuo periodo di prova è terminato | <div style={{fontSize:28,fontWeight:900,color:C.strong}}>Il tuo periodo di prova |
| 9597 | JSX_TEXT | Scegli un piano per continuare a usare PT Board | <div style={{fontSize:15,color:C.muted,marginTop:8,marginBottom:30}}>Scegli un p |
| 9613 | JSX_TEXT | Scegli questo piano | <button onClick={()=>{if(typeof gtag!=='undefined')gtag('event','plan_click',{pl |
| 9629 | SQ_STRING | Français',desc:'Langue par défaut | {k:'fr',flag:'🇫🇷',nome:'Français',desc:'Langue par défaut'}, |
| 9637 | JSX_TEXT | Scegli la lingua | <div style={{fontSize:22,fontWeight:900,color:'#f8fafc',marginBottom:6}}>Scegli  |
| 9638 | JSX_TEXT | La lingua cambia subito in tutta l'app | <div style={{fontSize:13,color:'#64748b',marginBottom:20}}>La lingua cambia subi |
| 9764 | JSX_TEXT | Scegli questo piano | <button onClick={()=>{if(typeof gtag!=='undefined')gtag('event','plan_click',{pl |
| 9847 | JSX_TEXT | Nessun utente ancora | users.length===0?<div style={{padding:40,textAlign:'center',color:'#475569'}}>Ne |
| 10211 | SQ_STRING | Funzionalità avanzate',title:'Installazione mobile',desc:'PT Board funziona come | {label:'📱 Installazione mobile',time:'Extra',bc:'#7c3aed30',bct:'#a78bfa',badge: |
| 10233 | SQ_STRING | Hai visto tutto quello che ti serve. Inizia subito con il tuo primo cliente. | {label:'✅ Pronto!',time:'Fine',bc:'#10b98130',bct:'#2dd4bf',badge:'Completato',t |
| 10236 | JSX_TEXT | Da dove iniziare? | <div style="font-size:16px;font-weight:800;color:#f8fafc;margin-bottom:6px">Da d |
