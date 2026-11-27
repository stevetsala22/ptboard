/* PT Board — Schede pronte (solo admin): schede scritte a mano da preparatore, nel formato di
 * "Importa scheda" ({ptboard:"scheda", v:1, scheda:{...}}). Mostrate nella pagina "Schede pronte"
 * del menu admin: anteprima, assegna a clienti, scarica file. Aggiungi qui nuove schede. */
window.SCHEDE_PRONTE=[
 {
  "id": "standard-ragazza",
  "categoria": "Standard",
  "titolo": "Standard ragazza · Full Body A/B",
  "desc": "Scheda base per ragazze che iniziano o ripartono: 3 sedute alternando A e B, glutei e gambe in evidenza (hip thrust, stacco rumeno, affondi) più parte alta e core, 10' di cardio a fine seduta.",
  "dati": {
   "ptboard": "scheda",
   "v": 1,
   "scheda": {
    "nome": "Standard ragazza · Full Body A/B",
    "note": "3 sedute a settimana alternando A e B (settimana 1: A-B-A, settimana 2: B-A-B), giorni non consecutivi. Circa 55-60 minuti. Scheda standard per chi parte o riparte: va adattata a obiettivi, dolori o limiti del cliente.",
    "regole": "Fatica 7/10: devi poter fare ancora 2-3 ripetizioni.\nTecnica prima del carico: se la forma peggiora, togli peso.\nSalita controllata, discesa lenta in 2-3 secondi.\nDolore (non fatica): fermati e avvisa il PT.",
    "progressione": "Settimane 1-2: carichi leggeri, impara la tecnica.\nSettimane 3-7: quando fai il massimo delle ripetizioni in tutte le serie, aumenta il carico (+1-2 kg sopra, +2,5-5 kg gambe).\nSettimana 8: una serie in meno per esercizio, poi si cambia scheda.",
    "parti": {
     "Giorno A": {
      "risc": {
       "testo": "5' ellittica o cyclette leggero. Mobilità di anche, spalle e torace, 10 ponti glutei, 2 serie leggere del primo esercizio.",
       "min": 8
      },
      "defat": {
       "testo": "5' camminata lenta e allungamento di gambe, glutei, petto e dorsali.",
       "min": 5
      }
     },
     "Giorno B": {
      "risc": {
       "testo": "5' ellittica o cyclette leggero. Mobilità di anche e spalle, 10 squat a corpo libero, 2 serie leggere del primo esercizio.",
       "min": 8
      },
      "defat": {
       "testo": "5' camminata lenta e allungamento di femorali, flessori dell'anca e spalle.",
       "min": 5
      }
     }
    },
    "esercizi": [
     {
      "eId": "E08",
      "nome": "Hip Thrust",
      "serie": 3,
      "reps": 10,
      "rec": 90,
      "sezione": "Giorno A",
      "nota": "Pausa 1 secondo in alto"
     },
     {
      "eId": "E04",
      "nome": "Leg Press",
      "serie": 3,
      "reps": 12,
      "rec": 90,
      "sezione": "Giorno A"
     },
     {
      "eId": "E24",
      "nome": "Lat Machine",
      "serie": 3,
      "reps": 10,
      "rec": 75,
      "sezione": "Giorno A",
      "nota": "Fino al petto"
     },
     {
      "eId": "E66",
      "nome": "Chest Press Macchina",
      "serie": 3,
      "reps": 10,
      "rec": 75,
      "sezione": "Giorno A"
     },
     {
      "eId": "E83",
      "nome": "Abduttori Macchina",
      "serie": 3,
      "reps": 15,
      "rec": 45,
      "sezione": "Giorno A"
     },
     {
      "eId": "E44",
      "nome": "Plank",
      "serie": 3,
      "reps": 30,
      "rec": 45,
      "sezione": "Giorno A",
      "repsMode": "time"
     },
     {
      "eId": "E87",
      "nome": "Tapis Roulant",
      "serie": 1,
      "reps": 600,
      "rec": 0,
      "sezione": "Giorno A",
      "nota": "10' camminata in salita",
      "repsMode": "time"
     },
     {
      "eId": "E11",
      "nome": "Stacco rumeno",
      "serie": 3,
      "reps": 10,
      "rec": 90,
      "sezione": "Giorno B",
      "nota": "Con manubri, schiena neutra"
     },
     {
      "eId": "E110",
      "nome": "Affondo all'indietro",
      "serie": 3,
      "reps": 10,
      "rec": 75,
      "sezione": "Giorno B",
      "nota": "Manubri lungo i fianchi",
      "perLato": true
     },
     {
      "eId": "E26",
      "nome": "Pulley Basso",
      "serie": 3,
      "reps": 12,
      "rec": 60,
      "sezione": "Giorno B"
     },
     {
      "eId": "E29",
      "nome": "Press Spalle Manubri",
      "serie": 3,
      "reps": 10,
      "rec": 75,
      "sezione": "Giorno B"
     },
     {
      "eId": "E14",
      "nome": "Leg Curl",
      "serie": 3,
      "reps": 12,
      "rec": 60,
      "sezione": "Giorno B"
     },
     {
      "eId": "E45",
      "nome": "Dead Bug",
      "serie": 3,
      "reps": 8,
      "rec": 45,
      "sezione": "Giorno B",
      "perLato": true
     },
     {
      "eId": "E55",
      "nome": "Cyclette",
      "serie": 1,
      "reps": 600,
      "rec": 0,
      "sezione": "Giorno B",
      "nota": "10' ritmo moderato",
      "repsMode": "time"
     }
    ]
   }
  }
 },
 {
  "id": "standard-ragazzo",
  "categoria": "Standard",
  "titolo": "Standard ragazzo · Full Body A/B",
  "desc": "Scheda base per ragazzi che iniziano o ripartono: 3 sedute alternando A e B, fondamentali (squat, panca, stacco rumeno, lat machine) più braccia, spalle e core, cardio breve a fine seduta.",
  "dati": {
   "ptboard": "scheda",
   "v": 1,
   "scheda": {
    "nome": "Standard ragazzo · Full Body A/B",
    "note": "3 sedute a settimana alternando A e B (settimana 1: A-B-A, settimana 2: B-A-B), giorni non consecutivi. Circa 55-60 minuti. Scheda standard per chi parte o riparte: va adattata a obiettivi, dolori o limiti del cliente.",
    "regole": "Fatica 7/10: devi poter fare ancora 2-3 ripetizioni.\nTecnica prima del carico: se la forma peggiora, togli peso.\nSalita controllata, discesa lenta in 2-3 secondi.\nDolore (non fatica): fermati e avvisa il PT.",
    "progressione": "Settimane 1-2: carichi leggeri, impara la tecnica.\nSettimane 3-7: quando fai il massimo delle ripetizioni in tutte le serie, aumenta il carico (+1-2 kg sopra, +2,5-5 kg gambe).\nSettimana 8: una serie in meno per esercizio, poi si cambia scheda.",
    "parti": {
     "Giorno A": {
      "risc": {
       "testo": "5' cyclette o vogatore leggero. Mobilità di anche, spalle e torace, 10 ponti glutei, 2 serie leggere del primo esercizio.",
       "min": 8
      },
      "defat": {
       "testo": "5' camminata lenta e allungamento di gambe, glutei, petto e dorsali.",
       "min": 5
      }
     },
     "Giorno B": {
      "risc": {
       "testo": "5' cyclette o vogatore leggero. Mobilità di anche e spalle, 10 squat a corpo libero, 2 serie leggere del primo esercizio.",
       "min": 8
      },
      "defat": {
       "testo": "5' camminata lenta e allungamento di femorali, flessori dell'anca e spalle.",
       "min": 5
      }
     }
    },
    "esercizi": [
     {
      "eId": "E01",
      "nome": "Squat",
      "serie": 3,
      "reps": 8,
      "rec": 120,
      "sezione": "Giorno A",
      "nota": "Bilanciere, profondità comoda"
     },
     {
      "eId": "E20",
      "nome": "Panca Bilanciere",
      "serie": 3,
      "reps": 8,
      "rec": 120,
      "sezione": "Giorno A"
     },
     {
      "eId": "E24",
      "nome": "Lat Machine",
      "serie": 3,
      "reps": 10,
      "rec": 75,
      "sezione": "Giorno A",
      "nota": "Fino al petto"
     },
     {
      "eId": "E14",
      "nome": "Leg Curl",
      "serie": 3,
      "reps": 12,
      "rec": 60,
      "sezione": "Giorno A"
     },
     {
      "eId": "E30",
      "nome": "Alzate Laterali",
      "serie": 3,
      "reps": 12,
      "rec": 45,
      "sezione": "Giorno A"
     },
     {
      "eId": "E34",
      "nome": "Curl Manubri",
      "serie": 2,
      "reps": 12,
      "rec": 45,
      "sezione": "Giorno A"
     },
     {
      "eId": "E44",
      "nome": "Plank",
      "serie": 3,
      "reps": 30,
      "rec": 45,
      "sezione": "Giorno A",
      "repsMode": "time"
     },
     {
      "eId": "E11",
      "nome": "Stacco rumeno",
      "serie": 3,
      "reps": 8,
      "rec": 90,
      "sezione": "Giorno B",
      "nota": "Schiena neutra"
     },
     {
      "eId": "E04",
      "nome": "Leg Press",
      "serie": 3,
      "reps": 10,
      "rec": 90,
      "sezione": "Giorno B"
     },
     {
      "eId": "E67",
      "nome": "Panca Inclinata Manubri",
      "serie": 3,
      "reps": 10,
      "rec": 75,
      "sezione": "Giorno B"
     },
     {
      "eId": "E23",
      "nome": "Rematore Manubrio",
      "serie": 3,
      "reps": 10,
      "rec": 60,
      "sezione": "Giorno B",
      "perLato": true
     },
     {
      "eId": "E39",
      "nome": "Pushdown Cavo",
      "serie": 2,
      "reps": 12,
      "rec": 45,
      "sezione": "Giorno B"
     },
     {
      "eId": "E49",
      "nome": "Pallof Press",
      "serie": 3,
      "reps": 10,
      "rec": 45,
      "sezione": "Giorno B",
      "perLato": true
     },
     {
      "eId": "E57",
      "nome": "Vogatore",
      "serie": 1,
      "reps": 480,
      "rec": 0,
      "sezione": "Giorno B",
      "nota": "8' ritmo moderato",
      "repsMode": "time"
     }
    ]
   }
  }
 },
 {
  "id": "dimagrimento-fb-abc",
  "categoria": "Dimagrimento",
  "titolo": "Dimagrimento · Full Body A/B/C",
  "desc": "Donna giovane allenata, palestra, 3 sedute da 60'. Forza con carichi veri + finale metabolico (EMOM, AMRAP, circuito), passi e note su alimentazione.",
  "dati": {
   "ptboard": "scheda",
   "v": 1,
   "scheda": {
    "nome": "Dimagrimento · Full Body A/B/C",
    "note": "3 sedute a settimana, giorni non consecutivi (es. lun-mer-ven). Fuori dalla palestra: 8.000-10.000 passi al giorno. Alimentazione: deficit moderato (circa 2.100-2.200 kcal) con proteine a ogni pasto (circa 150 g al giorno); per un piano dettagliato rivolgersi a un nutrizionista. Obiettivo realistico: 0,5-0,7 kg a settimana. Pesarsi 1 volta a settimana, stessa ora, e misurare il giro vita ogni 2 settimane.",
    "regole": "Carico: fermati con 2 ripetizioni ancora in canna (RPE 8) sui fondamentali.\nTecnica prima del carico: se la forma peggiora, togli peso.\nRispetta i recuperi: servono a mantenere forza e massa muscolare mentre dimagrisci.\nNel finale metabolico spingi forte ma senza perdere la tecnica.",
    "progressione": "Doppia progressione: quando completi tutte le serie al numero massimo di ripetizioni, aumenta il carico (+2,5 kg parte alta, +5 kg gambe) e riparti dal minimo.\nFinale metabolico: ogni 2 settimane +1 minuto o +1 giro.\nSettimana 6: scarico, una serie in meno per esercizio, poi si rivaluta e si cambia la scheda.",
    "parti": {
     "Giorno A": {
      "risc": {
       "testo": "5' cyclette o vogatore leggero, poi mobilità anche e caviglie, 2 serie di riscaldamento sullo squat (vuoto e 50%).",
       "min": 8
      },
      "defat": {
       "testo": "5' camminata lenta e allungamento di quadricipiti, glutei e dorsali.",
       "min": 5
      }
     },
     "Giorno B": {
      "risc": {
       "testo": "5' vogatore leggero, poi hip hinge con bastone, ponte glutei, 2 serie leggere di stacco rumeno.",
       "min": 8
      },
      "defat": {
       "testo": "5' camminata lenta e allungamento di femorali, flessori dell'anca e spalle.",
       "min": 5
      }
     },
     "Giorno C": {
      "risc": {
       "testo": "5' ski erg o cyclette leggera, poi attivazione glutei con elastico e 2 serie leggere di hip thrust.",
       "min": 8
      },
      "defat": {
       "testo": "5' camminata lenta e allungamento di glutei, pettorali e dorsali.",
       "min": 5
      }
     }
    },
    "blocchi": {
     "fA": {
      "tipo": "emom",
      "giri": 1,
      "recEx": 0,
      "recGiri": 0,
      "durata": 10,
      "nota": "Minuti dispari: swing. Minuti pari: air bike. Il resto del minuto è recupero."
     },
     "fB": {
      "tipo": "amrap",
      "giri": 1,
      "recEx": 0,
      "recGiri": 0,
      "durata": 10,
      "nota": "Più giri possibili in 10 minuti: annota il numero e prova a batterlo la volta dopo."
     },
     "fC": {
      "tipo": "circuito",
      "giri": 3,
      "recEx": 15,
      "recGiri": 60,
      "nota": "Ritmo alto, tecnica pulita."
     }
    },
    "esercizi": [
     {
      "eId": "E01",
      "nome": "Squat",
      "serie": 4,
      "reps": 8,
      "rec": 120,
      "nota": "Profondità piena, 2 rip in canna",
      "sezione": "Giorno A"
     },
     {
      "eId": "E24",
      "nome": "Lat Machine",
      "serie": 3,
      "reps": 10,
      "rec": 90,
      "nota": "Petto in fuori, scapole giù",
      "sezione": "Giorno A"
     },
     {
      "eId": "E19",
      "nome": "Panca Manubri",
      "serie": 3,
      "reps": 10,
      "rec": 90,
      "sezione": "Giorno A"
     },
     {
      "eId": "E14",
      "nome": "Leg Curl",
      "serie": 3,
      "reps": 12,
      "rec": 60,
      "nota": "Discesa lenta 3 secondi",
      "sezione": "Giorno A"
     },
     {
      "eId": "E30",
      "nome": "Alzate Laterali",
      "serie": 3,
      "reps": 15,
      "rec": 45,
      "sezione": "Giorno A"
     },
     {
      "eId": "E120",
      "nome": "Kettlebell Swing",
      "serie": 1,
      "reps": 15,
      "rec": 0,
      "sezione": "Giorno A",
      "blocco": "fA"
     },
     {
      "eId": "E198",
      "nome": "Air Bike",
      "serie": 1,
      "reps": 12,
      "repsMode": "cal",
      "rec": 0,
      "sezione": "Giorno A",
      "blocco": "fA"
     },
     {
      "eId": "E11",
      "nome": "Stacco rumeno",
      "serie": 4,
      "reps": 8,
      "rec": 120,
      "nota": "Schiena neutra, spingi le anche indietro",
      "sezione": "Giorno B"
     },
     {
      "eId": "E111",
      "nome": "Affondi in camminata",
      "serie": 3,
      "reps": 10,
      "perLato": true,
      "rec": 90,
      "nota": "Manubri in mano",
      "sezione": "Giorno B"
     },
     {
      "eId": "E29",
      "nome": "Press Spalle Manubri",
      "serie": 3,
      "reps": 10,
      "rec": 90,
      "sezione": "Giorno B"
     },
     {
      "eId": "E23",
      "nome": "Rematore Manubrio",
      "serie": 3,
      "reps": 10,
      "perLato": true,
      "rec": 60,
      "sezione": "Giorno B"
     },
     {
      "eId": "E49",
      "nome": "Pallof Press",
      "serie": 3,
      "reps": 12,
      "perLato": true,
      "rec": 45,
      "sezione": "Giorno B"
     },
     {
      "eId": "E218",
      "nome": "Wall Ball",
      "serie": 1,
      "reps": 10,
      "rec": 0,
      "sezione": "Giorno B",
      "blocco": "fB"
     },
     {
      "eId": "E57",
      "nome": "Vogatore",
      "serie": 1,
      "reps": 200,
      "repsMode": "dist",
      "rec": 0,
      "sezione": "Giorno B",
      "blocco": "fB"
     },
     {
      "eId": "E197",
      "nome": "Farmers Walk",
      "serie": 1,
      "reps": 30,
      "repsMode": "dist",
      "rec": 0,
      "sezione": "Giorno B",
      "blocco": "fB"
     },
     {
      "eId": "E08",
      "nome": "Hip Thrust",
      "serie": 4,
      "reps": 10,
      "rec": 90,
      "nota": "Pausa 1 secondo in alto",
      "sezione": "Giorno C"
     },
     {
      "eId": "E04",
      "nome": "Leg Press",
      "serie": 3,
      "reps": 12,
      "rec": 90,
      "sezione": "Giorno C"
     },
     {
      "eId": "E133",
      "nome": "Panca Inclinata Bilanciere",
      "serie": 3,
      "reps": 10,
      "rec": 90,
      "sezione": "Giorno C"
     },
     {
      "eId": "E270",
      "nome": "Row Isolaterale a Dischi",
      "serie": 3,
      "reps": 10,
      "rec": 75,
      "sezione": "Giorno C"
     },
     {
      "eId": "E31",
      "nome": "Face Pull",
      "serie": 3,
      "reps": 15,
      "rec": 45,
      "sezione": "Giorno C"
     },
     {
      "eId": "E305",
      "nome": "Ski Ergometro",
      "serie": 3,
      "reps": 40,
      "repsMode": "time",
      "rec": 15,
      "sezione": "Giorno C",
      "blocco": "fC"
     },
     {
      "eId": "E212",
      "nome": "Slam con palla medica",
      "serie": 3,
      "reps": 12,
      "rec": 15,
      "sezione": "Giorno C",
      "blocco": "fC"
     },
     {
      "eId": "E52",
      "nome": "Plank Laterale",
      "serie": 3,
      "reps": 30,
      "repsMode": "time",
      "perLato": true,
      "rec": 15,
      "sezione": "Giorno C",
      "blocco": "fC"
     }
    ]
   }
  }
 },
 {
  "id": "over65-spalla-cervicale",
  "categoria": "Over 65",
  "titolo": "Condizione generale 65+ · spalla e cervicale",
  "desc": "Donna 65 anni esperta, 3 sedute da 60'. Niente braccia sopra la testa, collo neutro, equilibrio in ogni seduta, pausa attiva per chi lavora in piedi e al computer.",
  "dati": {
   "ptboard": "scheda",
   "v": 1,
   "scheda": {
    "nome": "Condizione generale 65+ · spalla e cervicale · A/B/C",
    "note": "3 sedute a settimana, giorni non consecutivi. Spalla: niente esercizi con le braccia sopra la testa e gomiti sempre sotto l'altezza delle spalle; se il fastidio dura da più di qualche settimana o compare a riposo/di notte, serve una valutazione medica o fisioterapica. Al lavoro (in piedi e al computer): ogni ora 1 minuto di pausa attiva — 10 retrazioni del mento, 10 strette delle scapole, 10 sollevamenti sulle punte, 5 respiri lenti con il petto aperto. Schermo all'altezza degli occhi. Fuori dalla palestra: camminata a passo svelto 20-30 minuti nei giorni senza allenamento.",
    "regole": "Dolore: va bene un fastidio fino a 3/10 che non aumenta il giorno dopo; oltre, riduci carico o ampiezza.\nBraccia mai sopra la testa: gomiti sotto l'altezza delle spalle.\nCollo neutro: sguardo avanti, spalle lontane dalle orecchie, niente scrollate.\nRespira: espira nella fase di sforzo, non trattenere il fiato.\nSalita veloce e controllata, discesa lenta in 3 secondi.\nFatica 7/10: devi poter fare ancora 2-3 ripetizioni.",
    "progressione": "Settimana 1: carichi leggeri, impara la tecnica e annota i pesi.\nSettimane 2-5: quando fai 12 ripetizioni in tutte le serie, aumenta il carico del minimo possibile e riparti da 8-10.\nEquilibrio: quando un esercizio diventa facile, fallo a occhi socchiusi o su superficie morbida.\nSettimana 6: scarico (una serie in meno), poi rifai i test: sit to stand, TUG, forza della presa.",
    "parti": {
     "Giorno A": {
      "risc": {
       "testo": "5' cyclette facile. Poi: 10 retrazioni del mento, 10 aperture a libro da sdraiata per lato, 10 aperture con elastico a braccia basse, 10 ponti glutei.",
       "min": 8
      },
      "defat": {
       "testo": "Camminata lenta, allungamento pettorali alla porta con gomiti sotto le spalle, polpacci e flessori dell'anca, 5 respiri lenti.",
       "min": 5
      }
     },
     "Giorno B": {
      "risc": {
       "testo": "5' ellittica facile. Poi: 10 retrazioni del mento, rotazioni toraciche a quattro zampe 8 per lato, 10 aperture con elastico a braccia basse, 10 squat a corpo libero.",
       "min": 8
      },
      "defat": {
       "testo": "Camminata lenta, allungamento trapezio e collo dolce (senza tirare), glutei e femorali, 5 respiri lenti.",
       "min": 5
      }
     },
     "Giorno C": {
      "risc": {
       "testo": "5' tapis roulant in leggera salita. Poi: 10 retrazioni del mento, 10 aperture a libro per lato, 10 extrarotazioni con elastico, 10 affondi indietro a corpo libero.",
       "min": 8
      },
      "defat": {
       "testo": "Camminata lenta, allungamento pettorali alla porta, quadricipiti e polpacci, 5 respiri lenti.",
       "min": 5
      }
     }
    },
    "esercizi": [
     {
      "eId": "E04",
      "nome": "Leg Press",
      "serie": 3,
      "reps": 10,
      "rec": 90,
      "nota": "Spinta veloce, discesa lenta",
      "sezione": "Giorno A"
     },
     {
      "eId": "E66",
      "nome": "Chest Press Macchina",
      "serie": 3,
      "reps": 10,
      "rec": 90,
      "nota": "Impugnatura neutra, maniglie a metà petto",
      "sezione": "Giorno A"
     },
     {
      "eId": "E26",
      "nome": "Pulley Basso",
      "serie": 3,
      "reps": 12,
      "rec": 75,
      "nota": "Scapole indietro e in basso",
      "sezione": "Giorno A"
     },
     {
      "eId": "E11",
      "nome": "Stacco rumeno",
      "serie": 3,
      "reps": 10,
      "rec": 90,
      "nota": "Con manubri, schiena neutra",
      "sezione": "Giorno A"
     },
     {
      "eId": "E163",
      "nome": "External Rotation Cavo",
      "serie": 2,
      "reps": 15,
      "perLato": true,
      "rec": 45,
      "nota": "Gomito al fianco, carico leggero",
      "sezione": "Giorno A"
     },
     {
      "eId": "E49",
      "nome": "Pallof Press",
      "serie": 2,
      "reps": 12,
      "perLato": true,
      "rec": 45,
      "sezione": "Giorno A"
     },
     {
      "eId": "E246",
      "nome": "Camminata tallone-punta",
      "serie": 2,
      "reps": 30,
      "repsMode": "time",
      "rec": 30,
      "nota": "Equilibrio, vicino a un appoggio",
      "sezione": "Giorno A"
     },
     {
      "eId": "E55",
      "nome": "Cyclette",
      "serie": 1,
      "reps": 600,
      "repsMode": "time",
      "rec": 0,
      "nota": "10 minuti, ritmo moderato (fatica 5-6/10)",
      "sezione": "Giorno A"
     },
     {
      "eId": "E03",
      "nome": "Goblet Squat",
      "serie": 3,
      "reps": 10,
      "rec": 90,
      "nota": "Manubrio al petto, gomiti bassi",
      "sezione": "Giorno B"
     },
     {
      "eId": "E23",
      "nome": "Rematore Manubrio",
      "serie": 3,
      "reps": 10,
      "perLato": true,
      "rec": 75,
      "nota": "Appoggio sulla panca",
      "sezione": "Giorno B"
     },
     {
      "eId": "E139",
      "nome": "Distensioni a terra",
      "serie": 3,
      "reps": 10,
      "rec": 75,
      "nota": "Manubri presa neutra, i gomiti si fermano a terra",
      "sezione": "Giorno B"
     },
     {
      "eId": "E275",
      "nome": "Hip Thrust Macchina",
      "serie": 3,
      "reps": 12,
      "rec": 75,
      "sezione": "Giorno B"
     },
     {
      "eId": "E74",
      "nome": "Rear Delt Machine",
      "serie": 2,
      "reps": 15,
      "rec": 45,
      "nota": "Braccia all'altezza del petto, non più su",
      "sezione": "Giorno B"
     },
     {
      "eId": "E43",
      "nome": "Calf Seduto",
      "serie": 3,
      "reps": 15,
      "rec": 45,
      "nota": "Per chi sta in piedi tutto il giorno",
      "sezione": "Giorno B"
     },
     {
      "eId": "E45",
      "nome": "Dead Bug",
      "serie": 2,
      "reps": 8,
      "perLato": true,
      "rec": 45,
      "nota": "Testa appoggiata, collo rilassato",
      "sezione": "Giorno B"
     },
     {
      "eId": "E88",
      "nome": "Ellittica",
      "serie": 1,
      "reps": 600,
      "repsMode": "time",
      "rec": 0,
      "nota": "10 minuti, ritmo moderato",
      "sezione": "Giorno B"
     },
     {
      "eId": "E110",
      "nome": "Affondo all'indietro",
      "serie": 3,
      "reps": 8,
      "perLato": true,
      "rec": 90,
      "nota": "Manubri lungo i fianchi",
      "sezione": "Giorno C"
     },
     {
      "eId": "E290",
      "nome": "Rematore Seduto Presa Larga",
      "serie": 3,
      "reps": 12,
      "rec": 75,
      "sezione": "Giorno C"
     },
     {
      "eId": "E19",
      "nome": "Panca Manubri",
      "serie": 3,
      "reps": 10,
      "rec": 90,
      "nota": "Presa neutra, gomiti a 45 gradi",
      "sezione": "Giorno C"
     },
     {
      "eId": "E260",
      "nome": "Leg Curl Seduto Macchina",
      "serie": 3,
      "reps": 12,
      "rec": 60,
      "sezione": "Giorno C"
     },
     {
      "eId": "E119",
      "nome": "Stacco rumeno a una gamba",
      "serie": 2,
      "reps": 8,
      "perLato": true,
      "rec": 60,
      "nota": "Equilibrio: una mano su un appoggio all'inizio",
      "sezione": "Giorno C"
     },
     {
      "eId": "E197",
      "nome": "Farmers Walk",
      "serie": 3,
      "reps": 30,
      "repsMode": "dist",
      "rec": 60,
      "nota": "Spalle basse, collo lungo",
      "sezione": "Giorno C"
     },
     {
      "eId": "E52",
      "nome": "Plank Laterale",
      "serie": 2,
      "reps": 20,
      "repsMode": "time",
      "perLato": true,
      "rec": 45,
      "nota": "Anche dalle ginocchia",
      "sezione": "Giorno C"
     },
     {
      "eId": "E87",
      "nome": "Tapis Roulant",
      "serie": 1,
      "reps": 600,
      "repsMode": "time",
      "rec": 0,
      "nota": "10 minuti di camminata in salita 6-8%",
      "sezione": "Giorno C"
     }
    ]
   }
  }
 },
 {
  "id": "volley-centrale-stagione",
  "categoria": "Pallavolo",
  "titolo": "Centrale U16 · in stagione",
  "desc": "2 sedute: A Forza (2-3 giorni dopo la partita) e B Potenza (almeno 2 giorni prima). Footwork da centrale, prevenzione tendine rotuleo e spalla.",
  "dati": {
   "ptboard": "scheda",
   "v": 1,
   "scheda": {
    "nome": "Centrale U16 · IN STAGIONE (A Forza / B Potenza)",
    "note": "In stagione, 2 sedute a settimana. Giorno A (forza) 2-3 giorni dopo la partita, es. lunedì o martedì se giocate nel weekend. Giorno B (potenza) almeno 2 giorni prima della partita, es. mercoledì o giovedì. Mai palestra il giorno prima della partita. Settimana con due partite: solo il Giorno A, con una serie in meno per esercizio.",
    "regole": "Tecnica prima del carico: ogni ripetizione pulita, altrimenti togli peso.\nGiorno A: fatica 7-8/10, mai a cedimento.\nGiorno B: pochi salti ma al massimo dell'esplosività; se l'altezza cala, ferma la serie.\nAtterraggi: ginocchia in linea con le punte, atterra morbido e fermati 2 secondi.\nDolore (non fatica) a ginocchia, spalla o gomito: fermati e avvisa il preparatore.",
    "progressione": "Settimane 1-3: aumenta il carico di 2,5 kg sulle gambe (1-2 kg sopra) quando tutte le serie riescono pulite.\nSettimana 4: settimana leggera, una serie in meno per esercizio. Poi si riparte.\nSettimana di partite importanti o doppia partita: solo il Giorno A ridotto.\nOgni 4 settimane: test di salto (CMJ) all'inizio del Giorno B.",
    "parti": {
     "A · Forza": {
      "risc": {
       "testo": "5' corsetta, skip e spostamenti laterali. Mobilità di caviglie, anche e torace. Attivazione: mini-band laterale 2×10 passi, ponte glutei 10, 2 serie leggere di squat.",
       "min": 10
      },
      "defat": {
       "testo": "Allungamento polpacci, quadricipiti e flessori dell'anca; spalla posteriore (cross-body) 30 secondi per lato.",
       "min": 5
      }
     },
     "B · Potenza": {
      "risc": {
       "testo": "5' corsetta e spostamenti a muro senza salto. Mobilità di anche e torace, rotazioni con elastico per le spalle 10 per lato, 3 salti leggeri con stop.",
       "min": 10
      },
      "defat": {
       "testo": "Allungamento glutei, adduttori e femorali; spalla posteriore 30 secondi per lato.",
       "min": 5
      }
     }
    },
    "blocchi": {
     "cB": {
      "tipo": "superset",
      "giri": 2,
      "recEx": 20,
      "recGiri": 120,
      "nota": "Contrasto: trap bar pesante ma veloce, 20 secondi, poi 3 box jump esplosivi."
     }
    },
    "esercizi": [
     {
      "nome": "Squat",
      "serie": 3,
      "reps": 5,
      "rec": 120,
      "sezione": "A · Forza",
      "eId": "E01",
      "nota": "Bilanciere, fatica 7-8/10"
     },
     {
      "nome": "Affondo all'indietro",
      "serie": 2,
      "reps": 6,
      "rec": 90,
      "sezione": "A · Forza",
      "eId": "E110",
      "nota": "Manubri lungo i fianchi",
      "perLato": true
     },
     {
      "nome": "Hip Thrust",
      "serie": 3,
      "reps": 6,
      "rec": 90,
      "sezione": "A · Forza",
      "eId": "E08"
     },
     {
      "nome": "Rematore Manubrio",
      "serie": 3,
      "reps": 8,
      "rec": 60,
      "sezione": "A · Forza",
      "eId": "E23",
      "perLato": true
     },
     {
      "nome": "Push-up",
      "serie": 3,
      "reps": 8,
      "rec": 60,
      "sezione": "A · Forza",
      "eId": "E16",
      "nota": "Corpo in linea, gomiti a 45 gradi"
     },
     {
      "nome": "Nordic Curl",
      "serie": 2,
      "reps": 4,
      "rec": 90,
      "sezione": "A · Forza",
      "eId": "E15",
      "nota": "Scendi lento più che puoi"
     },
     {
      "nome": "Squat spagnolo",
      "serie": 2,
      "reps": 30,
      "rec": 60,
      "sezione": "A · Forza",
      "eId": "E114",
      "nota": "Isometria per il tendine rotuleo",
      "repsMode": "time"
     },
     {
      "nome": "External Rotation Cavo",
      "serie": 2,
      "reps": 12,
      "rec": 45,
      "sezione": "A · Forza",
      "eId": "E163",
      "nota": "Prevenzione spalla dell'attacco",
      "perLato": true
     },
     {
      "nome": "Stacco con trap bar",
      "serie": 2,
      "reps": 3,
      "rec": 0,
      "sezione": "B · Potenza",
      "eId": "E117",
      "nota": "Pesante ma veloce",
      "blocco": "cB"
     },
     {
      "nome": "Box Jump",
      "serie": 2,
      "reps": 3,
      "rec": 0,
      "sezione": "B · Potenza",
      "eId": "E207",
      "nota": "Esplosivo, atterra e scendi a piedi",
      "blocco": "cB"
     },
     {
      "nome": "Spostamento a muro 2 passi + salto",
      "serie": 2,
      "reps": 3,
      "rec": 60,
      "sezione": "B · Potenza",
      "nota": "Passo incrociato lungo la rete, salto a muro, stop",
      "perLato": true
     },
     {
      "nome": "Doppio salto: muro → primo tempo",
      "serie": 2,
      "reps": 2,
      "rec": 90,
      "sezione": "B · Potenza",
      "nota": "Salto a muro, atterra, girati, 2 passi e secondo salto"
     },
     {
      "nome": "Tenuta manubrio sopra la testa",
      "serie": 2,
      "reps": 20,
      "rec": 45,
      "sezione": "B · Potenza",
      "nota": "Braccio teso, scapola attiva: stabilità a muro",
      "repsMode": "time",
      "perLato": true
     },
     {
      "nome": "Lat Machine",
      "serie": 2,
      "reps": 8,
      "rec": 60,
      "sezione": "B · Potenza",
      "eId": "E24",
      "nota": "Fino al petto"
     },
     {
      "nome": "Calf Raise Monopodalico",
      "serie": 2,
      "reps": 10,
      "rec": 45,
      "sezione": "B · Potenza",
      "eId": "E93",
      "nota": "Discesa lenta 3 secondi",
      "perLato": true
     },
     {
      "nome": "Pallof Press",
      "serie": 2,
      "reps": 10,
      "rec": 45,
      "sezione": "B · Potenza",
      "eId": "E49",
      "perLato": true
     }
    ]
   }
  }
 },
 {
  "id": "volley-centrale-stagione-spalla",
  "categoria": "Pallavolo",
  "titolo": "Centrale U16 · in stagione · spalla/gomito",
  "desc": "Come sopra, versione protetta per spalla e gomito: niente braccia sopra la testa, presa neutra.",
  "dati": {
   "ptboard": "scheda",
   "v": 1,
   "scheda": {
    "nome": "Centrale U16 spalla dx/gomito sx · IN STAGIONE (A Forza / B Potenza)",
    "note": "In stagione, 2 sedute a settimana. Giorno A (forza) 2-3 giorni dopo la partita, es. lunedì o martedì se giocate nel weekend. Giorno B (potenza) almeno 2 giorni prima della partita, es. mercoledì o giovedì. Mai palestra il giorno prima della partita. Settimana con due partite: solo il Giorno A, con una serie in meno per esercizio. Spalla destra e gomito sinistro: niente esercizi con le braccia sopra la testa, niente push-up e lat machine finché c'è fastidio; visita da un medico dello sport prima di caricare di più.",
    "regole": "Tecnica prima del carico: ogni ripetizione pulita, altrimenti togli peso.\nGiorno A: fatica 7-8/10, mai a cedimento.\nGiorno B: pochi salti ma al massimo dell'esplosività; se l'altezza cala, ferma la serie.\nAtterraggi: ginocchia in linea con le punte, atterra morbido e fermati 2 secondi.\nDolore (non fatica) a ginocchia, spalla o gomito: fermati e avvisa il preparatore.",
    "progressione": "Settimane 1-3: aumenta il carico di 2,5 kg sulle gambe (1-2 kg sopra) quando tutte le serie riescono pulite.\nSettimana 4: settimana leggera, una serie in meno per esercizio. Poi si riparte.\nSettimana di partite importanti o doppia partita: solo il Giorno A ridotto.\nOgni 4 settimane: test di salto (CMJ) all'inizio del Giorno B.",
    "parti": {
     "A · Forza": {
      "risc": {
       "testo": "5' corsetta, skip e spostamenti laterali. Mobilità di caviglie, anche e torace. Attivazione: mini-band laterale 2×10 passi, ponte glutei 10, 2 serie leggere di squat.",
       "min": 10
      },
      "defat": {
       "testo": "Allungamento polpacci, quadricipiti e flessori dell'anca; spalla posteriore (cross-body) 30 secondi per lato.",
       "min": 5
      }
     },
     "B · Potenza": {
      "risc": {
       "testo": "5' corsetta e spostamenti a muro senza salto. Mobilità di anche e torace, rotazioni con elastico per le spalle 10 per lato, 3 salti leggeri con stop.",
       "min": 10
      },
      "defat": {
       "testo": "Allungamento glutei, adduttori e femorali; spalla posteriore 30 secondi per lato.",
       "min": 5
      }
     }
    },
    "blocchi": {
     "cB": {
      "tipo": "superset",
      "giri": 2,
      "recEx": 20,
      "recGiri": 120,
      "nota": "Contrasto: trap bar pesante ma veloce, 20 secondi, poi 3 box jump esplosivi."
     }
    },
    "esercizi": [
     {
      "nome": "Squat",
      "serie": 3,
      "reps": 5,
      "rec": 120,
      "sezione": "A · Forza",
      "eId": "E01",
      "nota": "Bilanciere, fatica 7-8/10"
     },
     {
      "nome": "Affondo all'indietro",
      "serie": 2,
      "reps": 6,
      "rec": 90,
      "sezione": "A · Forza",
      "eId": "E110",
      "nota": "Manubri lungo i fianchi",
      "perLato": true
     },
     {
      "nome": "Hip Thrust",
      "serie": 3,
      "reps": 6,
      "rec": 90,
      "sezione": "A · Forza",
      "eId": "E08"
     },
     {
      "nome": "Rematore Manubrio",
      "serie": 3,
      "reps": 8,
      "rec": 60,
      "sezione": "A · Forza",
      "eId": "E23",
      "perLato": true,
      "nota": "Leggero, stop se il gomito fa male"
     },
     {
      "nome": "Distensioni a terra",
      "serie": 3,
      "reps": 8,
      "rec": 60,
      "sezione": "A · Forza",
      "eId": "E139",
      "nota": "Manubri presa neutra, i gomiti si fermano a terra"
     },
     {
      "nome": "Nordic Curl",
      "serie": 2,
      "reps": 4,
      "rec": 90,
      "sezione": "A · Forza",
      "eId": "E15",
      "nota": "Scendi lento più che puoi"
     },
     {
      "nome": "Squat spagnolo",
      "serie": 2,
      "reps": 30,
      "rec": 60,
      "sezione": "A · Forza",
      "eId": "E114",
      "nota": "Isometria per il tendine rotuleo",
      "repsMode": "time"
     },
     {
      "nome": "External Rotation Cavo",
      "serie": 2,
      "reps": 12,
      "rec": 45,
      "sezione": "A · Forza",
      "eId": "E163",
      "nota": "Prevenzione spalla dell'attacco",
      "perLato": true
     },
     {
      "nome": "Stacco con trap bar",
      "serie": 2,
      "reps": 3,
      "rec": 0,
      "sezione": "B · Potenza",
      "eId": "E117",
      "nota": "Pesante ma veloce",
      "blocco": "cB"
     },
     {
      "nome": "Box Jump",
      "serie": 2,
      "reps": 3,
      "rec": 0,
      "sezione": "B · Potenza",
      "eId": "E207",
      "nota": "Esplosivo, atterra e scendi a piedi",
      "blocco": "cB"
     },
     {
      "nome": "Spostamento a muro 2 passi + salto",
      "serie": 2,
      "reps": 3,
      "rec": 60,
      "sezione": "B · Potenza",
      "nota": "Passo incrociato lungo la rete, salto a muro, stop",
      "perLato": true
     },
     {
      "nome": "Doppio salto: muro → primo tempo",
      "serie": 2,
      "reps": 2,
      "rec": 90,
      "sezione": "B · Potenza",
      "nota": "Salto a muro, atterra, girati, 2 passi e secondo salto"
     },
     {
      "nome": "Pulley Basso",
      "serie": 2,
      "reps": 8,
      "rec": 60,
      "sezione": "B · Potenza",
      "eId": "E26",
      "nota": "Presa neutra, scapole indietro"
     },
     {
      "nome": "Calf Raise Monopodalico",
      "serie": 2,
      "reps": 10,
      "rec": 45,
      "sezione": "B · Potenza",
      "eId": "E93",
      "nota": "Discesa lenta 3 secondi",
      "perLato": true
     },
     {
      "nome": "Pallof Press",
      "serie": 2,
      "reps": 10,
      "rec": 45,
      "sezione": "B · Potenza",
      "eId": "E49",
      "perLato": true
     }
    ]
   }
  }
 },
 {
  "id": "volley-centrale-prestagione",
  "categoria": "Pallavolo",
  "titolo": "Centrale U16 · pre-stagione Forza → Trasformazione → Mantenimento",
  "desc": "3 blocchi in una scheda (6 giorni): settimane 1-5 forza, 6-9 trasformazione con contrasto e footwork, dalla 10 mantenimento.",
  "dati": {
   "ptboard": "scheda",
   "v": 1,
   "scheda": {
    "nome": "Centrale U16 · Forza → Trasformazione → Mantenimento",
    "esercizi": [
     {
      "nome": "Drop squat (atterraggio con stop)",
      "serie": 2,
      "reps": 5,
      "rec": 60,
      "sezione": "1 Forza · A",
      "nota": "Dalle punte giù in mezzo squat, fermo 2 secondi"
     },
     {
      "eId": "E01",
      "nome": "Squat",
      "serie": 4,
      "reps": 6,
      "rec": 120,
      "sezione": "1 Forza · A",
      "nota": "Bilanciere, profondità piena"
     },
     {
      "eId": "E117",
      "nome": "Stacco con trap bar",
      "serie": 3,
      "reps": 6,
      "rec": 120,
      "sezione": "1 Forza · A"
     },
     {
      "eId": "E23",
      "nome": "Rematore Manubrio",
      "serie": 3,
      "reps": 8,
      "rec": 75,
      "sezione": "1 Forza · A",
      "perLato": true
     },
     {
      "eId": "E16",
      "nome": "Push-up",
      "serie": 3,
      "reps": 10,
      "rec": 60,
      "sezione": "1 Forza · A",
      "nota": "Corpo in linea, gomiti a 45 gradi"
     },
     {
      "eId": "E163",
      "nome": "External Rotation Cavo",
      "serie": 2,
      "reps": 15,
      "rec": 45,
      "sezione": "1 Forza · A",
      "nota": "Prevenzione spalla dell'attacco",
      "perLato": true
     },
     {
      "eId": "E114",
      "nome": "Squat spagnolo",
      "serie": 3,
      "reps": 30,
      "rec": 60,
      "sezione": "1 Forza · A",
      "nota": "Isometria per il tendine rotuleo",
      "repsMode": "time"
     },
     {
      "eId": "E209",
      "nome": "Lateral Bound",
      "serie": 2,
      "reps": 3,
      "rec": 60,
      "sezione": "1 Forza · B",
      "nota": "Basso e lento: solo atterraggio su una gamba con stop",
      "perLato": true
     },
     {
      "eId": "E110",
      "nome": "Affondo all'indietro",
      "serie": 3,
      "reps": 8,
      "rec": 90,
      "sezione": "1 Forza · B",
      "nota": "Manubri lungo i fianchi",
      "perLato": true
     },
     {
      "eId": "E08",
      "nome": "Hip Thrust",
      "serie": 3,
      "reps": 8,
      "rec": 90,
      "sezione": "1 Forza · B"
     },
     {
      "eId": "E24",
      "nome": "Lat Machine",
      "serie": 3,
      "reps": 8,
      "rec": 75,
      "sezione": "1 Forza · B",
      "nota": "Fino al petto"
     },
     {
      "eId": "E19",
      "nome": "Panca Manubri",
      "serie": 3,
      "reps": 8,
      "rec": 75,
      "sezione": "1 Forza · B"
     },
     {
      "eId": "E15",
      "nome": "Nordic Curl",
      "serie": 2,
      "reps": 5,
      "rec": 90,
      "sezione": "1 Forza · B",
      "nota": "Scendi lento più che puoi"
     },
     {
      "eId": "E93",
      "nome": "Calf Raise Monopodalico",
      "serie": 3,
      "reps": 10,
      "rec": 45,
      "sezione": "1 Forza · B",
      "nota": "Discesa lenta 3 secondi",
      "perLato": true
     },
     {
      "eId": "E49",
      "nome": "Pallof Press",
      "serie": 2,
      "reps": 10,
      "rec": 45,
      "sezione": "1 Forza · B",
      "perLato": true
     },
     {
      "eId": "E01",
      "nome": "Squat",
      "serie": 3,
      "reps": 4,
      "rec": 0,
      "sezione": "2 Trasformaz. · A",
      "nota": "Pesante, fatica 8/10",
      "blocco": "2-trasformazionecA"
     },
     {
      "eId": "E207",
      "nome": "Box Jump",
      "serie": 3,
      "reps": 3,
      "rec": 0,
      "sezione": "2 Trasformaz. · A",
      "nota": "Esplosivo, atterra e scendi a piedi",
      "blocco": "2-trasformazionecA"
     },
     {
      "nome": "Spostamento a muro 2 passi + salto",
      "serie": 3,
      "reps": 3,
      "rec": 60,
      "sezione": "2 Trasformaz. · A",
      "nota": "Passo incrociato lungo la rete, salto a muro, stop",
      "perLato": true
     },
     {
      "eId": "E218",
      "nome": "Wall Ball",
      "serie": 3,
      "reps": 6,
      "rec": 60,
      "sezione": "2 Trasformaz. · A",
      "nota": "Squat e lancio esplosivo"
     },
     {
      "eId": "E23",
      "nome": "Rematore Manubrio",
      "serie": 2,
      "reps": 8,
      "rec": 60,
      "sezione": "2 Trasformaz. · A",
      "perLato": true
     },
     {
      "eId": "E16",
      "nome": "Push-up",
      "serie": 2,
      "reps": 10,
      "rec": 60,
      "sezione": "2 Trasformaz. · A"
     },
     {
      "eId": "E114",
      "nome": "Squat spagnolo",
      "serie": 2,
      "reps": 30,
      "rec": 60,
      "sezione": "2 Trasformaz. · A",
      "repsMode": "time"
     },
     {
      "eId": "E163",
      "nome": "External Rotation Cavo",
      "serie": 2,
      "reps": 15,
      "rec": 45,
      "sezione": "2 Trasformaz. · A",
      "perLato": true
     },
     {
      "eId": "E08",
      "nome": "Hip Thrust",
      "serie": 3,
      "reps": 6,
      "rec": 0,
      "sezione": "2 Trasformaz. · B",
      "nota": "Pesante, fatica 8/10",
      "blocco": "2-trasformazionecB"
     },
     {
      "eId": "E209",
      "nome": "Lateral Bound",
      "serie": 3,
      "reps": 3,
      "rec": 0,
      "sezione": "2 Trasformaz. · B",
      "nota": "Esplosivo, stop all'atterraggio",
      "blocco": "2-trasformazionecB",
      "perLato": true
     },
     {
      "nome": "Doppio salto: muro → primo tempo",
      "serie": 3,
      "reps": 3,
      "rec": 90,
      "sezione": "2 Trasformaz. · B",
      "nota": "Salto a muro, atterra, girati, 2 passi e secondo salto"
     },
     {
      "nome": "Tenuta manubrio sopra la testa",
      "serie": 3,
      "reps": 20,
      "rec": 45,
      "sezione": "2 Trasformaz. · B",
      "nota": "Braccio teso, scapola attiva: stabilità a muro",
      "repsMode": "time",
      "perLato": true
     },
     {
      "eId": "E24",
      "nome": "Lat Machine",
      "serie": 2,
      "reps": 8,
      "rec": 60,
      "sezione": "2 Trasformaz. · B"
     },
     {
      "eId": "E15",
      "nome": "Nordic Curl",
      "serie": 2,
      "reps": 4,
      "rec": 90,
      "sezione": "2 Trasformaz. · B"
     },
     {
      "eId": "E93",
      "nome": "Calf Raise Monopodalico",
      "serie": 2,
      "reps": 10,
      "rec": 45,
      "sezione": "2 Trasformaz. · B",
      "perLato": true
     },
     {
      "eId": "E49",
      "nome": "Pallof Press",
      "serie": 2,
      "reps": 10,
      "rec": 45,
      "sezione": "2 Trasformaz. · B",
      "perLato": true
     },
     {
      "eId": "E01",
      "nome": "Squat",
      "serie": 2,
      "reps": 3,
      "rec": 150,
      "sezione": "3 Mantenim. · A",
      "nota": "Pesante ma veloce"
     },
     {
      "eId": "E207",
      "nome": "Box Jump",
      "serie": 2,
      "reps": 3,
      "rec": 90,
      "sezione": "3 Mantenim. · A"
     },
     {
      "eId": "E23",
      "nome": "Rematore Manubrio",
      "serie": 2,
      "reps": 8,
      "rec": 60,
      "sezione": "3 Mantenim. · A",
      "perLato": true
     },
     {
      "eId": "E16",
      "nome": "Push-up",
      "serie": 2,
      "reps": 8,
      "rec": 60,
      "sezione": "3 Mantenim. · A"
     },
     {
      "eId": "E114",
      "nome": "Squat spagnolo",
      "serie": 2,
      "reps": 30,
      "rec": 60,
      "sezione": "3 Mantenim. · A",
      "repsMode": "time"
     },
     {
      "eId": "E163",
      "nome": "External Rotation Cavo",
      "serie": 2,
      "reps": 12,
      "rec": 45,
      "sezione": "3 Mantenim. · A",
      "perLato": true
     },
     {
      "eId": "E117",
      "nome": "Stacco con trap bar",
      "serie": 2,
      "reps": 3,
      "rec": 150,
      "sezione": "3 Mantenim. · B",
      "nota": "Pesante ma veloce"
     },
     {
      "nome": "Spostamento a muro 2 passi + salto",
      "serie": 2,
      "reps": 2,
      "rec": 60,
      "sezione": "3 Mantenim. · B",
      "perLato": true
     },
     {
      "eId": "E08",
      "nome": "Hip Thrust",
      "serie": 2,
      "reps": 6,
      "rec": 90,
      "sezione": "3 Mantenim. · B"
     },
     {
      "eId": "E24",
      "nome": "Lat Machine",
      "serie": 2,
      "reps": 8,
      "rec": 60,
      "sezione": "3 Mantenim. · B"
     },
     {
      "eId": "E93",
      "nome": "Calf Raise Monopodalico",
      "serie": 2,
      "reps": 10,
      "rec": 45,
      "sezione": "3 Mantenim. · B",
      "perLato": true
     },
     {
      "eId": "E49",
      "nome": "Pallof Press",
      "serie": 2,
      "reps": 10,
      "rec": 45,
      "sezione": "3 Mantenim. · B",
      "perLato": true
     }
    ],
    "blocchi": {
     "2-trasformazionecA": {
      "tipo": "superset",
      "giri": 3,
      "recEx": 20,
      "recGiri": 150,
      "nota": "Contrasto: squat pesante, 20 secondi, poi 3 box jump esplosivi."
     },
     "2-trasformazionecB": {
      "tipo": "superset",
      "giri": 3,
      "recEx": 20,
      "recGiri": 150,
      "nota": "Contrasto: hip thrust pesante, 20 secondi, poi 3 balzi laterali per lato."
     }
    },
    "parti": {
     "1 Forza · A": {
      "risc": {
       "testo": "5' corsetta, skip e spostamenti laterali. Mobilità di caviglie, anche e torace. Attivazione: mini-band laterale 2×10 passi, ponte glutei 10, 3 atterraggi da fermo con stop.",
       "min": 10
      },
      "defat": {
       "testo": "Allungamento polpacci, quadricipiti e flessori dell'anca; spalla posteriore (cross-body) 30 secondi per lato.",
       "min": 5
      }
     },
     "1 Forza · B": {
      "risc": {
       "testo": "5' corsetta e spostamenti a muro senza salto. Mobilità di anche e torace, rotazioni con elastico per le spalle 10 per lato, 3 balzi laterali leggeri con stop.",
       "min": 10
      },
      "defat": {
       "testo": "Allungamento glutei, adduttori e femorali; spalla posteriore 30 secondi per lato.",
       "min": 5
      }
     },
     "2 Trasformaz. · A": {
      "risc": {
       "testo": "5' corsetta, skip e spostamenti laterali. Mobilità di caviglie, anche e torace. Attivazione: mini-band laterale 2×10 passi, ponte glutei 10, 3 atterraggi da fermo con stop.",
       "min": 10
      },
      "defat": {
       "testo": "Allungamento polpacci, quadricipiti e flessori dell'anca; spalla posteriore (cross-body) 30 secondi per lato.",
       "min": 5
      }
     },
     "2 Trasformaz. · B": {
      "risc": {
       "testo": "5' corsetta e spostamenti a muro senza salto. Mobilità di anche e torace, rotazioni con elastico per le spalle 10 per lato, 3 balzi laterali leggeri con stop.",
       "min": 10
      },
      "defat": {
       "testo": "Allungamento glutei, adduttori e femorali; spalla posteriore 30 secondi per lato.",
       "min": 5
      }
     },
     "3 Mantenim. · A": {
      "risc": {
       "testo": "5' corsetta, skip e spostamenti laterali. Mobilità di caviglie, anche e torace. Attivazione: mini-band laterale 2×10 passi, ponte glutei 10, 3 atterraggi da fermo con stop.",
       "min": 10
      },
      "defat": {
       "testo": "Allungamento polpacci, quadricipiti e flessori dell'anca; spalla posteriore (cross-body) 30 secondi per lato.",
       "min": 5
      }
     },
     "3 Mantenim. · B": {
      "risc": {
       "testo": "5' corsetta e spostamenti a muro senza salto. Mobilità di anche e torace, rotazioni con elastico per le spalle 10 per lato, 3 balzi laterali leggeri con stop.",
       "min": 10
      },
      "defat": {
       "testo": "Allungamento glutei, adduttori e femorali; spalla posteriore 30 secondi per lato.",
       "min": 5
      }
     }
    },
    "note": "Una sola scheda con i 3 blocchi in ordine: settimane 1-5 i giorni '1 Forza' (A e B), settimane 6-9 i giorni '2 Trasformaz.', dalla settimana 10 i giorni '3 Mantenim.'. 2 sedute a settimana (A e B). Test di salto (CMJ) alla fine di ogni blocco.",
    "regole": "Tecnica prima del carico: ogni ripetizione pulita, altrimenti togli peso.\nAtterraggi: ginocchia in linea con le punte, atterra morbido e fermati 2 secondi.\nSalti: pochi e al massimo dell'esplosività, recupero completo.\nDolore (non fatica) a ginocchia, spalla o gomito: fermati e avvisa il preparatore.\nMai palestra il giorno prima della partita; meglio 48 ore dopo.",
    "progressione": "FORZA (SETT. 1-5): Settimane 1-2: carichi moderati, impara la tecnica (fatica 6/10). Settimane 3-5: aumenta 2,5 kg sulle gambe e 1-2 kg sulla parte alta quando tutte le serie riescono pulite (fatica 7-8/10). Settimana 5: test CMJ e del carico usato sullo squat per 6 ripetizioni.\nTRASFORMAZIONE (SETT. 6-9): Contrasto: squat/hip thrust pesante (fatica 8/10), 20 secondi, poi i salti. Se l'altezza dei salti cala, ferma la serie. Settimane 6-7: 3 giri. Settimane 8-9: 4 giri se l'atterraggio resta pulito. Footwork: prima precisione, poi velocità.\nMANTENIMENTO (SETT. 10+): Carichi alti ma poche ripetizioni: mai arrivare stanchi alla partita. Se la settimana ha due partite, fai solo il Giorno A. Ogni 3 settimane test CMJ: se il salto cala, riduci ancora il volume."
   }
  }
 },
 {
  "id": "volley-centrale-prestagione-spalla",
  "categoria": "Pallavolo",
  "titolo": "Centrale U16 · pre-stagione · spalla/gomito",
  "desc": "I 3 blocchi in versione protetta per spalla e gomito.",
  "dati": {
   "ptboard": "scheda",
   "v": 1,
   "scheda": {
    "nome": "Centrale U16 spalla dx/gomito sx · Forza → Trasformazione → Mantenimento",
    "esercizi": [
     {
      "nome": "Drop squat (atterraggio con stop)",
      "serie": 2,
      "reps": 5,
      "rec": 60,
      "sezione": "1 Forza · A",
      "nota": "Dalle punte giù in mezzo squat, fermo 2 secondi"
     },
     {
      "eId": "E01",
      "nome": "Squat",
      "serie": 4,
      "reps": 6,
      "rec": 120,
      "sezione": "1 Forza · A",
      "nota": "Bilanciere, profondità piena"
     },
     {
      "eId": "E117",
      "nome": "Stacco con trap bar",
      "serie": 3,
      "reps": 6,
      "rec": 120,
      "sezione": "1 Forza · A"
     },
     {
      "eId": "E23",
      "nome": "Rematore Manubrio",
      "serie": 3,
      "reps": 8,
      "rec": 75,
      "sezione": "1 Forza · A",
      "perLato": true,
      "nota": "Leggero, stop se il gomito fa male"
     },
     {
      "eId": "E139",
      "nome": "Distensioni a terra",
      "serie": 3,
      "reps": 10,
      "rec": 60,
      "sezione": "1 Forza · A",
      "nota": "Manubri presa neutra, i gomiti si fermano a terra"
     },
     {
      "eId": "E163",
      "nome": "External Rotation Cavo",
      "serie": 2,
      "reps": 15,
      "rec": 45,
      "sezione": "1 Forza · A",
      "nota": "Prevenzione spalla dell'attacco",
      "perLato": true
     },
     {
      "eId": "E114",
      "nome": "Squat spagnolo",
      "serie": 3,
      "reps": 30,
      "rec": 60,
      "sezione": "1 Forza · A",
      "nota": "Isometria per il tendine rotuleo",
      "repsMode": "time"
     },
     {
      "eId": "E209",
      "nome": "Lateral Bound",
      "serie": 2,
      "reps": 3,
      "rec": 60,
      "sezione": "1 Forza · B",
      "nota": "Basso e lento: solo atterraggio su una gamba con stop",
      "perLato": true
     },
     {
      "eId": "E110",
      "nome": "Affondo all'indietro",
      "serie": 3,
      "reps": 8,
      "rec": 90,
      "sezione": "1 Forza · B",
      "nota": "Manubri lungo i fianchi",
      "perLato": true
     },
     {
      "eId": "E08",
      "nome": "Hip Thrust",
      "serie": 3,
      "reps": 8,
      "rec": 90,
      "sezione": "1 Forza · B"
     },
     {
      "eId": "E26",
      "nome": "Pulley Basso",
      "serie": 3,
      "reps": 8,
      "rec": 75,
      "sezione": "1 Forza · B",
      "nota": "Presa neutra, scapole indietro"
     },
     {
      "eId": "E66",
      "nome": "Chest Press Macchina",
      "serie": 3,
      "reps": 8,
      "rec": 75,
      "sezione": "1 Forza · B",
      "nota": "Presa neutra, carico leggero"
     },
     {
      "eId": "E15",
      "nome": "Nordic Curl",
      "serie": 2,
      "reps": 5,
      "rec": 90,
      "sezione": "1 Forza · B",
      "nota": "Scendi lento più che puoi"
     },
     {
      "eId": "E93",
      "nome": "Calf Raise Monopodalico",
      "serie": 3,
      "reps": 10,
      "rec": 45,
      "sezione": "1 Forza · B",
      "nota": "Discesa lenta 3 secondi",
      "perLato": true
     },
     {
      "eId": "E49",
      "nome": "Pallof Press",
      "serie": 2,
      "reps": 10,
      "rec": 45,
      "sezione": "1 Forza · B",
      "perLato": true
     },
     {
      "eId": "E01",
      "nome": "Squat",
      "serie": 3,
      "reps": 4,
      "rec": 0,
      "sezione": "2 Trasformaz. · A",
      "nota": "Pesante, fatica 8/10",
      "blocco": "2-trasformazionecA"
     },
     {
      "eId": "E207",
      "nome": "Box Jump",
      "serie": 3,
      "reps": 3,
      "rec": 0,
      "sezione": "2 Trasformaz. · A",
      "nota": "Esplosivo, atterra e scendi a piedi",
      "blocco": "2-trasformazionecA"
     },
     {
      "nome": "Spostamento a muro 2 passi + salto",
      "serie": 3,
      "reps": 3,
      "rec": 60,
      "sezione": "2 Trasformaz. · A",
      "nota": "Passo incrociato lungo la rete, salto a muro, stop",
      "perLato": true
     },
     {
      "eId": "E214",
      "nome": "Lancio rotazionale con palla medica",
      "serie": 3,
      "reps": 6,
      "rec": 60,
      "sezione": "2 Trasformaz. · A",
      "nota": "Lancio laterale, braccia sotto le spalle",
      "perLato": true
     },
     {
      "eId": "E23",
      "nome": "Rematore Manubrio",
      "serie": 2,
      "reps": 8,
      "rec": 60,
      "sezione": "2 Trasformaz. · A",
      "perLato": true,
      "nota": "Leggero, stop se il gomito fa male"
     },
     {
      "eId": "E139",
      "nome": "Distensioni a terra",
      "serie": 2,
      "reps": 10,
      "rec": 60,
      "sezione": "2 Trasformaz. · A",
      "nota": "Manubri presa neutra, i gomiti si fermano a terra"
     },
     {
      "eId": "E114",
      "nome": "Squat spagnolo",
      "serie": 2,
      "reps": 30,
      "rec": 60,
      "sezione": "2 Trasformaz. · A",
      "repsMode": "time"
     },
     {
      "eId": "E163",
      "nome": "External Rotation Cavo",
      "serie": 2,
      "reps": 15,
      "rec": 45,
      "sezione": "2 Trasformaz. · A",
      "perLato": true
     },
     {
      "eId": "E08",
      "nome": "Hip Thrust",
      "serie": 3,
      "reps": 6,
      "rec": 0,
      "sezione": "2 Trasformaz. · B",
      "nota": "Pesante, fatica 8/10",
      "blocco": "2-trasformazionecB"
     },
     {
      "eId": "E209",
      "nome": "Lateral Bound",
      "serie": 3,
      "reps": 3,
      "rec": 0,
      "sezione": "2 Trasformaz. · B",
      "nota": "Esplosivo, stop all'atterraggio",
      "blocco": "2-trasformazionecB",
      "perLato": true
     },
     {
      "nome": "Doppio salto: muro → primo tempo",
      "serie": 3,
      "reps": 3,
      "rec": 90,
      "sezione": "2 Trasformaz. · B",
      "nota": "Salto a muro, atterra, girati, 2 passi e secondo salto"
     },
     {
      "eId": "E26",
      "nome": "Pulley Basso",
      "serie": 2,
      "reps": 8,
      "rec": 60,
      "sezione": "2 Trasformaz. · B",
      "nota": "Presa neutra, scapole indietro"
     },
     {
      "eId": "E15",
      "nome": "Nordic Curl",
      "serie": 2,
      "reps": 4,
      "rec": 90,
      "sezione": "2 Trasformaz. · B"
     },
     {
      "eId": "E93",
      "nome": "Calf Raise Monopodalico",
      "serie": 2,
      "reps": 10,
      "rec": 45,
      "sezione": "2 Trasformaz. · B",
      "perLato": true
     },
     {
      "eId": "E49",
      "nome": "Pallof Press",
      "serie": 2,
      "reps": 10,
      "rec": 45,
      "sezione": "2 Trasformaz. · B",
      "perLato": true
     },
     {
      "eId": "E01",
      "nome": "Squat",
      "serie": 2,
      "reps": 3,
      "rec": 150,
      "sezione": "3 Mantenim. · A",
      "nota": "Pesante ma veloce"
     },
     {
      "eId": "E207",
      "nome": "Box Jump",
      "serie": 2,
      "reps": 3,
      "rec": 90,
      "sezione": "3 Mantenim. · A"
     },
     {
      "eId": "E23",
      "nome": "Rematore Manubrio",
      "serie": 2,
      "reps": 8,
      "rec": 60,
      "sezione": "3 Mantenim. · A",
      "perLato": true,
      "nota": "Leggero, stop se il gomito fa male"
     },
     {
      "eId": "E139",
      "nome": "Distensioni a terra",
      "serie": 2,
      "reps": 8,
      "rec": 60,
      "sezione": "3 Mantenim. · A",
      "nota": "Manubri presa neutra, i gomiti si fermano a terra"
     },
     {
      "eId": "E114",
      "nome": "Squat spagnolo",
      "serie": 2,
      "reps": 30,
      "rec": 60,
      "sezione": "3 Mantenim. · A",
      "repsMode": "time"
     },
     {
      "eId": "E163",
      "nome": "External Rotation Cavo",
      "serie": 2,
      "reps": 12,
      "rec": 45,
      "sezione": "3 Mantenim. · A",
      "perLato": true
     },
     {
      "eId": "E117",
      "nome": "Stacco con trap bar",
      "serie": 2,
      "reps": 3,
      "rec": 150,
      "sezione": "3 Mantenim. · B",
      "nota": "Pesante ma veloce"
     },
     {
      "nome": "Spostamento a muro 2 passi + salto",
      "serie": 2,
      "reps": 2,
      "rec": 60,
      "sezione": "3 Mantenim. · B",
      "perLato": true
     },
     {
      "eId": "E08",
      "nome": "Hip Thrust",
      "serie": 2,
      "reps": 6,
      "rec": 90,
      "sezione": "3 Mantenim. · B"
     },
     {
      "eId": "E26",
      "nome": "Pulley Basso",
      "serie": 2,
      "reps": 8,
      "rec": 60,
      "sezione": "3 Mantenim. · B",
      "nota": "Presa neutra, scapole indietro"
     },
     {
      "eId": "E93",
      "nome": "Calf Raise Monopodalico",
      "serie": 2,
      "reps": 10,
      "rec": 45,
      "sezione": "3 Mantenim. · B",
      "perLato": true
     },
     {
      "eId": "E49",
      "nome": "Pallof Press",
      "serie": 2,
      "reps": 10,
      "rec": 45,
      "sezione": "3 Mantenim. · B",
      "perLato": true
     }
    ],
    "blocchi": {
     "2-trasformazionecA": {
      "tipo": "superset",
      "giri": 3,
      "recEx": 20,
      "recGiri": 150,
      "nota": "Contrasto: squat pesante, 20 secondi, poi 3 box jump esplosivi."
     },
     "2-trasformazionecB": {
      "tipo": "superset",
      "giri": 3,
      "recEx": 20,
      "recGiri": 150,
      "nota": "Contrasto: hip thrust pesante, 20 secondi, poi 3 balzi laterali per lato."
     }
    },
    "parti": {
     "1 Forza · A": {
      "risc": {
       "testo": "5' corsetta, skip e spostamenti laterali. Mobilità di caviglie, anche e torace. Attivazione: mini-band laterale 2×10 passi, ponte glutei 10, 3 atterraggi da fermo con stop.",
       "min": 10
      },
      "defat": {
       "testo": "Allungamento polpacci, quadricipiti e flessori dell'anca; spalla posteriore (cross-body) 30 secondi per lato.",
       "min": 5
      }
     },
     "1 Forza · B": {
      "risc": {
       "testo": "5' corsetta e spostamenti a muro senza salto. Mobilità di anche e torace, rotazioni con elastico per le spalle 10 per lato, 3 balzi laterali leggeri con stop.",
       "min": 10
      },
      "defat": {
       "testo": "Allungamento glutei, adduttori e femorali; spalla posteriore 30 secondi per lato.",
       "min": 5
      }
     },
     "2 Trasformaz. · A": {
      "risc": {
       "testo": "5' corsetta, skip e spostamenti laterali. Mobilità di caviglie, anche e torace. Attivazione: mini-band laterale 2×10 passi, ponte glutei 10, 3 atterraggi da fermo con stop.",
       "min": 10
      },
      "defat": {
       "testo": "Allungamento polpacci, quadricipiti e flessori dell'anca; spalla posteriore (cross-body) 30 secondi per lato.",
       "min": 5
      }
     },
     "2 Trasformaz. · B": {
      "risc": {
       "testo": "5' corsetta e spostamenti a muro senza salto. Mobilità di anche e torace, rotazioni con elastico per le spalle 10 per lato, 3 balzi laterali leggeri con stop.",
       "min": 10
      },
      "defat": {
       "testo": "Allungamento glutei, adduttori e femorali; spalla posteriore 30 secondi per lato.",
       "min": 5
      }
     },
     "3 Mantenim. · A": {
      "risc": {
       "testo": "5' corsetta, skip e spostamenti laterali. Mobilità di caviglie, anche e torace. Attivazione: mini-band laterale 2×10 passi, ponte glutei 10, 3 atterraggi da fermo con stop.",
       "min": 10
      },
      "defat": {
       "testo": "Allungamento polpacci, quadricipiti e flessori dell'anca; spalla posteriore (cross-body) 30 secondi per lato.",
       "min": 5
      }
     },
     "3 Mantenim. · B": {
      "risc": {
       "testo": "5' corsetta e spostamenti a muro senza salto. Mobilità di anche e torace, rotazioni con elastico per le spalle 10 per lato, 3 balzi laterali leggeri con stop.",
       "min": 10
      },
      "defat": {
       "testo": "Allungamento glutei, adduttori e femorali; spalla posteriore 30 secondi per lato.",
       "min": 5
      }
     }
    },
    "note": "Una sola scheda con i 3 blocchi in ordine: settimane 1-5 i giorni '1 Forza' (A e B), settimane 6-9 i giorni '2 Trasformaz.', dalla settimana 10 i giorni '3 Mantenim.'. 2 sedute a settimana (A e B). Test di salto (CMJ) alla fine di ogni blocco. Spalla destra e gomito sinistro: niente esercizi con le braccia sopra la testa, niente push-up e lat machine finché c'è fastidio; visita da un medico dello sport prima di caricare di più.",
    "regole": "Tecnica prima del carico: ogni ripetizione pulita, altrimenti togli peso.\nAtterraggi: ginocchia in linea con le punte, atterra morbido e fermati 2 secondi.\nSalti: pochi e al massimo dell'esplosività, recupero completo.\nDolore (non fatica) a ginocchia, spalla o gomito: fermati e avvisa il preparatore.\nMai palestra il giorno prima della partita; meglio 48 ore dopo.",
    "progressione": "FORZA (SETT. 1-5): Settimane 1-2: carichi moderati, impara la tecnica (fatica 6/10). Settimane 3-5: aumenta 2,5 kg sulle gambe e 1-2 kg sulla parte alta quando tutte le serie riescono pulite (fatica 7-8/10). Settimana 5: test CMJ e del carico usato sullo squat per 6 ripetizioni.\nTRASFORMAZIONE (SETT. 6-9): Contrasto: squat/hip thrust pesante (fatica 8/10), 20 secondi, poi i salti. Se l'altezza dei salti cala, ferma la serie. Settimane 6-7: 3 giri. Settimane 8-9: 4 giri se l'atterraggio resta pulito. Footwork: prima precisione, poi velocità.\nMANTENIMENTO (SETT. 10+): Carichi alti ma poche ripetizioni: mai arrivare stanchi alla partita. Se la settimana ha due partite, fai solo il Giorno A. Ogni 3 settimane test CMJ: se il salto cala, riduci ancora il volume."
   }
  }
 },
 {
  "id": "ginocchia-femoro-rotulea",
  "categoria": "Ginocchia",
  "titolo": "Ricondizionamento ginocchia · condropatia femoro-rotulea",
  "desc": "Ragazzo giovane fermo da mesi, dolore davanti al ginocchio (condropatia femoro-rotulea, tilt rotuleo). 3 sedute: quadricipite, adduttori e muscoli dell'anca, piegamenti solo fino a 90°, niente salti né corsa; parte alta completa per la ricomposizione.",
  "dati": {
   "ptboard": "scheda",
   "v": 1,
   "scheda": {
    "nome": "Ricondizionamento ginocchia · condropatia femoro-rotulea · A/B/C",
    "note": "3 sedute a settimana da circa 60', giorni non consecutivi. Fermo da 7 mesi, ginocchia: condropatia femoro-rotulea bilaterale con tilt rotuleo (indicazione ortopedica: rinforzo di quadricipite, adduttori e muscoli dell'anca, prima a corpo libero poi con pesi; ginocchiera durante gli sforzi). Obiettivo: ricomposizione (meno grasso, più muscolo) e gambe più forti. Niente salti, corsa e piegamenti profondi del ginocchio sotto carico nelle prime 8 settimane.",
    "regole": "Dolore al ginocchio: va bene fino a 2-3/10 durante l'esercizio, se non aumenta il giorno dopo. Oltre, riduci ampiezza o carico.\nGinocchio in linea con la punta del piede: mai verso l'interno.\nAmpiezza: solo dove non fa male (leg press e squat non oltre i 90 gradi).\nGinocchiera durante gli esercizi per le gambe, come indicato dall'ortopedico.\nSalita controllata, discesa lenta in 3 secondi.",
    "progressione": "Settimane 1-4: corpo libero e carichi leggeri, fatica 6/10, impara la tecnica.\nSettimane 5-8: aumenta il carico quando fai il massimo delle ripetizioni senza dolore (fatica 7-8/10).\nDalla settimana 9: se il ginocchio è tranquillo, squat più profondo, affondi e step più alto.\nOgni 4 settimane: dolore su scala 0-10 nelle scale e nello squat a corpo libero, da annotare.",
    "parti": {
     "Giorno A": {
      "risc": {
       "testo": "6' cyclette con sellino alto. Poi: ponte glutei 2×10, passi laterali con mini-band 2×10 per lato, 10 squat parziali a corpo libero.",
       "min": 10
      },
      "defat": {
       "testo": "Allungamento quadricipiti, flessori dell'anca, femorali e polpacci. 30 secondi per posizione.",
       "min": 5
      }
     },
     "Giorno B": {
      "risc": {
       "testo": "6' cyclette. Poi: conchiglia con elastico 2×12 per lato, ponte glutei 2×10, 10 squat parziali.",
       "min": 10
      },
      "defat": {
       "testo": "Allungamento quadricipiti, adduttori e glutei. 30 secondi per posizione.",
       "min": 5
      }
     },
     "Giorno C": {
      "risc": {
       "testo": "6' cyclette. Poi: passi laterali con mini-band 2×10 per lato, 10 salite su gradino basso per gamba.",
       "min": 10
      },
      "defat": {
       "testo": "Allungamento quadricipiti, polpacci e bandelletta (laterale coscia). 30 secondi per posizione.",
       "min": 5
      }
     }
    },
    "esercizi": [
     {
      "eId": "E04",
      "nome": "Leg Press",
      "serie": 3,
      "reps": 12,
      "rec": 90,
      "sezione": "Giorno A",
      "nota": "Ginocchia fino a 90 gradi, non oltre"
     },
     {
      "eId": "E08",
      "nome": "Hip Thrust",
      "serie": 3,
      "reps": 12,
      "rec": 75,
      "sezione": "Giorno A"
     },
     {
      "eId": "E83",
      "nome": "Abduttori Macchina",
      "serie": 3,
      "reps": 15,
      "rec": 45,
      "sezione": "Giorno A",
      "nota": "Muscoli dell'anca: stabilizzano la rotula"
     },
     {
      "eId": "E24",
      "nome": "Lat Machine",
      "serie": 3,
      "reps": 10,
      "rec": 75,
      "sezione": "Giorno A"
     },
     {
      "eId": "E19",
      "nome": "Panca Manubri",
      "serie": 3,
      "reps": 10,
      "rec": 75,
      "sezione": "Giorno A"
     },
     {
      "eId": "E44",
      "nome": "Plank",
      "serie": 3,
      "reps": 30,
      "rec": 45,
      "sezione": "Giorno A",
      "repsMode": "time"
     },
     {
      "eId": "E55",
      "nome": "Cyclette",
      "serie": 1,
      "reps": 600,
      "rec": 0,
      "sezione": "Giorno A",
      "nota": "10' ritmo moderato, sellino alto",
      "repsMode": "time"
     },
     {
      "eId": "E114",
      "nome": "Squat spagnolo",
      "serie": 4,
      "reps": 30,
      "rec": 60,
      "sezione": "Giorno B",
      "nota": "Isometria: riduce il dolore alla rotula",
      "repsMode": "time"
     },
     {
      "eId": "E02",
      "nome": "Box Squat",
      "serie": 3,
      "reps": 10,
      "rec": 90,
      "sezione": "Giorno B",
      "nota": "Panca alta, scendi fino a sederti"
     },
     {
      "eId": "E82",
      "nome": "Adduttori Macchina",
      "serie": 3,
      "reps": 15,
      "rec": 45,
      "sezione": "Giorno B"
     },
     {
      "eId": "E104",
      "nome": "Ponte Glutei Monopodalico",
      "serie": 3,
      "reps": 10,
      "rec": 60,
      "sezione": "Giorno B",
      "perLato": true
     },
     {
      "eId": "E23",
      "nome": "Rematore Manubrio",
      "serie": 3,
      "reps": 10,
      "rec": 60,
      "sezione": "Giorno B",
      "perLato": true
     },
     {
      "eId": "E29",
      "nome": "Press Spalle Manubri",
      "serie": 3,
      "reps": 10,
      "rec": 75,
      "sezione": "Giorno B"
     },
     {
      "eId": "E45",
      "nome": "Dead Bug",
      "serie": 3,
      "reps": 8,
      "rec": 45,
      "sezione": "Giorno B",
      "perLato": true
     },
     {
      "eId": "E78",
      "nome": "Leg Extension",
      "serie": 3,
      "reps": 12,
      "rec": 75,
      "sezione": "Giorno C",
      "nota": "Solo da 90 a 45 gradi, carico leggero"
     },
     {
      "eId": "E10",
      "nome": "Salita sul gradino",
      "serie": 3,
      "reps": 8,
      "rec": 75,
      "sezione": "Giorno C",
      "nota": "Gradino basso (20 cm), ginocchio in linea",
      "perLato": true
     },
     {
      "eId": "E14",
      "nome": "Leg Curl",
      "serie": 3,
      "reps": 12,
      "rec": 60,
      "sezione": "Giorno C"
     },
     {
      "eId": "E242",
      "nome": "Conchiglia",
      "serie": 3,
      "reps": 15,
      "rec": 45,
      "sezione": "Giorno C",
      "nota": "Con elastico sopra le ginocchia",
      "perLato": true
     },
     {
      "eId": "E66",
      "nome": "Chest Press Macchina",
      "serie": 3,
      "reps": 10,
      "rec": 75,
      "sezione": "Giorno C"
     },
     {
      "eId": "E26",
      "nome": "Pulley Basso",
      "serie": 3,
      "reps": 12,
      "rec": 60,
      "sezione": "Giorno C"
     },
     {
      "eId": "E92",
      "nome": "Calf Raise Corpo Libero",
      "serie": 3,
      "reps": 15,
      "rec": 45,
      "sezione": "Giorno C"
     },
     {
      "eId": "E55",
      "nome": "Cyclette",
      "serie": 1,
      "reps": 600,
      "rec": 0,
      "sezione": "Giorno C",
      "nota": "10' ritmo moderato, sellino alto",
      "repsMode": "time"
     }
    ]
   }
  }
 },
 {
  "id": "condizione-lavoro-pesante",
  "categoria": "Condizione generale",
  "titolo": "Condizione generale · lavoro fisico pesante",
  "desc": "Uomo giovane con lavoro manuale pesante (es. edilizia), ripresa dopo un mese di stop. 3 sedute: forza a fatica 7/10, tecnica di sollevamento (trap bar, farmer walk), schiena e spalle protette; versione con fastidio dietro al ginocchio e ai femorali (tenute al posto del leg curl, scivolamenti del nervo).",
  "dati": {
   "ptboard": "scheda",
   "v": 1,
   "scheda": {
    "nome": "Condizione generale · lavoro fisico pesante · A/B/C",
    "note": "3 sedute a settimana da circa 60', giorni non consecutivi. Lavoro manuale pesante (edilizia): la palestra deve rendere il corpo più resistente, non stancarlo di più. Se la giornata in cantiere è stata molto dura, togli una serie per esercizio. Ripresa dopo 1 mese di stop. Ginocchia: fastidio dietro al ginocchio e ai femorali dopo essere stato seduto a lungo. Da seduto si alza ogni 30-45 minuti. Se il dolore dura più di qualche settimana, compare gonfiore dietro al ginocchio o al polpaccio, formicolii o perdita di forza, serve una visita (medico o fisioterapista).",
    "regole": "Fatica 7/10: devi poter fare ancora 2-3 ripetizioni. Mai a cedimento.\nSchiena neutra in tutti i sollevamenti: è la stessa tecnica che protegge la schiena al lavoro.\nSalita controllata, discesa lenta in 2-3 secondi.\nDolore (non fatica) a schiena, spalle o ginocchia: fermati e avvisa il PT.\nDietro al ginocchio e femorali: niente stretching forte dei femorali; va bene un fastidio fino a 2-3/10 che non aumenta il giorno dopo.",
    "progressione": "Settimana 1: carichi leggeri, ritrova la tecnica.\nFemorali: settimane 1-2 ponte glutei in tenuta; dalla 3, se il dolore è sparito, leg curl leggero 3×12 al posto del ponte.\nSettimane 2-5: quando fai il massimo delle ripetizioni in tutte le serie, aumenta il carico (+2,5 kg sopra, +5 kg gambe).\nSettimana 6: una serie in meno per esercizio, poi si rivaluta e si cambia la scheda.",
    "parti": {
     "Giorno A": {
      "risc": {
       "testo": "5' cyclette. Scivolamenti del nervo da seduto (stendi il ginocchio alzando la testa, piegalo abbassandola) 10 per gamba, mobilità di anche e torace, 10 ponti glutei, 2 serie leggere di squat.",
       "min": 8
      },
      "defat": {
       "testo": "Allungamento dolce di flessori dell'anca, dorsali e polpacci (niente stretching forte dei femorali). 30 secondi per posizione.",
       "min": 5
      }
     },
     "Giorno B": {
      "risc": {
       "testo": "5' vogatore leggero. Scivolamenti del nervo da seduto 10 per gamba, hip hinge con bastone 10, rotazioni toraciche a quattro zampe 8 per lato, 2 serie leggere di stacco.",
       "min": 8
      },
      "defat": {
       "testo": "Allungamento lombari (posizione del bambino), glutei e pettorali. 30 secondi per posizione.",
       "min": 5
      }
     },
     "Giorno C": {
      "risc": {
       "testo": "5' cyclette. Scivolamenti del nervo da seduto 10 per gamba, aperture con elastico 15, mobilità delle spalle, 10 squat a corpo libero.",
       "min": 8
      },
      "defat": {
       "testo": "Allungamento quadricipiti, pettorali e spalle. 30 secondi per posizione.",
       "min": 5
      }
     }
    },
    "esercizi": [
     {
      "eId": "E01",
      "nome": "Squat",
      "serie": 3,
      "reps": 8,
      "rec": 120,
      "sezione": "Giorno A",
      "nota": "Bilanciere, profondità comoda"
     },
     {
      "eId": "E24",
      "nome": "Lat Machine",
      "serie": 3,
      "reps": 10,
      "rec": 90,
      "sezione": "Giorno A",
      "nota": "Fino al petto"
     },
     {
      "eId": "E19",
      "nome": "Panca Manubri",
      "serie": 3,
      "reps": 10,
      "rec": 90,
      "sezione": "Giorno A"
     },
     {
      "eId": "E07",
      "nome": "Ponte Glutei",
      "serie": 3,
      "reps": 30,
      "repsMode": "time",
      "rec": 45,
      "sezione": "Giorno A",
      "nota": "Tenuta in alto: femorali senza allungarli. Dalla settimana 3 leg curl leggero"
     },
     {
      "eId": "E31",
      "nome": "Face Pull",
      "serie": 3,
      "reps": 15,
      "rec": 45,
      "sezione": "Giorno A",
      "nota": "Spalle sane per il lavoro con le braccia in alto"
     },
     {
      "eId": "E52",
      "nome": "Plank Laterale",
      "serie": 3,
      "reps": 30,
      "rec": 45,
      "sezione": "Giorno A",
      "repsMode": "time",
      "perLato": true
     },
     {
      "eId": "E55",
      "nome": "Cyclette",
      "serie": 1,
      "reps": 600,
      "rec": 0,
      "sezione": "Giorno A",
      "nota": "10' ritmo moderato",
      "repsMode": "time"
     },
     {
      "eId": "E117",
      "nome": "Stacco con trap bar",
      "serie": 3,
      "reps": 6,
      "rec": 120,
      "sezione": "Giorno B",
      "nota": "La tecnica giusta per sollevare: schiena neutra, spinta con le gambe"
     },
     {
      "eId": "E110",
      "nome": "Affondo all'indietro",
      "serie": 3,
      "reps": 8,
      "rec": 90,
      "sezione": "Giorno B",
      "nota": "Manubri lungo i fianchi",
      "perLato": true
     },
     {
      "eId": "E23",
      "nome": "Rematore Manubrio",
      "serie": 3,
      "reps": 10,
      "rec": 60,
      "sezione": "Giorno B",
      "perLato": true
     },
     {
      "eId": "E29",
      "nome": "Press Spalle Manubri",
      "serie": 3,
      "reps": 10,
      "rec": 75,
      "sezione": "Giorno B"
     },
     {
      "eId": "E49",
      "nome": "Pallof Press",
      "serie": 3,
      "reps": 10,
      "rec": 45,
      "sezione": "Giorno B",
      "perLato": true
     },
     {
      "eId": "E197",
      "nome": "Farmers Walk",
      "serie": 3,
      "reps": 30,
      "rec": 60,
      "sezione": "Giorno B",
      "nota": "Pesante, spalle basse, busto dritto",
      "repsMode": "dist"
     },
     {
      "eId": "E04",
      "nome": "Leg Press",
      "serie": 3,
      "reps": 12,
      "rec": 90,
      "sezione": "Giorno C"
     },
     {
      "eId": "E08",
      "nome": "Hip Thrust",
      "serie": 3,
      "reps": 10,
      "rec": 75,
      "sezione": "Giorno C"
     },
     {
      "eId": "E148",
      "nome": "Trazioni Assistite",
      "serie": 3,
      "reps": 8,
      "rec": 90,
      "sezione": "Giorno C"
     },
     {
      "eId": "E16",
      "nome": "Push-up",
      "serie": 3,
      "reps": 10,
      "rec": 60,
      "sezione": "Giorno C",
      "nota": "Corpo in linea"
     },
     {
      "eId": "E74",
      "nome": "Rear Delt Machine",
      "serie": 2,
      "reps": 15,
      "rec": 45,
      "sezione": "Giorno C"
     },
     {
      "eId": "E45",
      "nome": "Dead Bug",
      "serie": 3,
      "reps": 8,
      "rec": 45,
      "sezione": "Giorno C",
      "perLato": true
     },
     {
      "eId": "E57",
      "nome": "Vogatore",
      "serie": 1,
      "reps": 480,
      "rec": 0,
      "sezione": "Giorno C",
      "nota": "8': 1' forte / 1' facile",
      "repsMode": "time"
     }
    ]
   }
  }
 }
];
