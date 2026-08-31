# Refusi

Lo sparatutto tipografico di **Arti Grafiche Fimognari**, dal 1950. Si è rovesciata la cassa:
le lettere piovono sul foglio, e tu stai in fondo con una piccola macchina da stampa che spara
biglietti da visita.

Gioca: https://francesco-agf.github.io/refusi/

## La regola, che è una sola

**Si spara a tutto.** Ogni lettera abbattuta fa punti. Ogni lettera che tocca la linea di base
va in stampa così com'è e ti costa una **bozza**: ne hai cinque, finite quelle il turno è chiuso.

## La parola da comporre

In cima al foglio c'è una parola del mestiere — *menabò*, *filigrana*, *quadricromia*. Le sue
lettere cadono in mezzo alle altre: abbattile **nell'ordine giusto** e la parola si compone una
lettera per volta. Quella che ti serve adesso è nel riquadro azzurro; sbagliare non costa niente.

Composta la parola arriva un **premio da trenta secondi**, più mille punti per tiratura e una
bozza indietro:

- **Tiratura d'oro** — tre biglietti per colpo, cadenza quasi doppia, punti ×3
- **Visto si stampi** — per trenta secondi le lettere che arrivano in fondo non ti costano niente

## Le munizioni

Ogni tanto scende una **bobina**: sparaci dentro e per venti secondi cambi quello che hai in canna.

| | | |
|---|---|---|
| **2** | Doppia stampa | due biglietti a ventaglio |
| **3** | Tripla stampa | tre biglietti |
| **»** | Rotativa | un biglietto solo, a raffica |
| **4** | Quadricromia | biglietti a colori, punti ×2 |

## Il Comic Sans

Ogni tanto una lettera cade composta in Comic Sans. Quello è il refuso vero: vale **tre volte**
gli altri.

## Punteggio

- Lettera abbattuta — 10 × tiratura, per il moltiplicatore della serie
- Lettera della parola — +50 × tiratura
- Parola composta — +1.000 × tiratura
- Serie — ogni quattro lettere di fila senza perdere una bozza il moltiplicatore sale, fino a ×5

Ogni venti lettere si sale di tiratura: cadono più fitte e più in fretta.

## Comandi

Frecce per spostare la macchina, spazio per stampare un biglietto, P per la pausa.
Da telefono: trascina il dito sul foglio per spostarti, tocca per sparare, oppure usa i tasti
sotto al campo.

## Tecnica

Un solo file. Nessuna dipendenza a parte i caratteri da Google Fonts, caricati con il solo
sottoinsieme delle lettere che servono. Il marchio è SVG in linea, la macchina, i biglietti e
le bobine sono disegnati su canvas, il rumore di sala è sintetizzato con la Web Audio API.
La classifica è quella condivisa della sala giochi.

`SHARE_URL`, in cima allo script, è l'indirizzo che compare in fondo al risultato condiviso.

## Il sorgente

`index.html` alla radice è **generato**: non modificarlo a mano. Si lavora su
`sorgente/refusi.html` e si rilancia `python3 sorgente/build.py` dopo ogni modifica.
In `sorgente/` ci sono anche i collaudi automatici. Istruzioni in
[`sorgente/LEGGIMI.md`](sorgente/LEGGIMI.md).

## Il gioco gemello

**Baseline**, il puzzle tipografico: https://francesco-agf.github.io/baseline/
La sala giochi: https://francesco-agf.github.io/
