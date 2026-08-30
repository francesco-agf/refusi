# Refusi

Lo sparatutto tipografico di **Arti Grafiche Fimognari**, dal 1950. Sei alla correzione di
bozze: dalla macchina esce una composizione e tu hai l'ultima possibilità di fermare un
errore prima che vada in tiratura.

Gioca: https://francesco-agf.github.io/refusi/

## La regola, che è una sola

In alto c'è scritto qual è il **carattere in macchina**, con un saggio di come si presenta.
Le lettere che cadono in quel carattere sono **giuste**: lasciale passare, vanno in stampa.
Le lettere composte in un **carattere diverso** sono refusi: quelle vanno abbattute con un
biglietto da visita.

Sparare a una lettera giusta è bucare la composizione: perdi una bozza. Lasciar passare un
refuso è peggio — quello finisce stampato su diecimila copie. Anche lì perdi una bozza.
Tre bozze bruciate e il turno è finito.

## La difficoltà non è la velocità, è la somiglianza

| Tiratura | In macchina | Il refuso |
|---|---|---|
| 1ª | Archivo | Comic Neue |
| 2ª | Bodoni Moda | Archivo |
| 3ª | Archivo | Anton |
| 4ª | Bodoni Moda | Playfair Display |
| 5ª | EB Garamond | Libre Baskerville |
| 6ª | Inter | Roboto |
| 7ª | EB Garamond | Cormorant Garamond |

Si comincia con un Comic Sans in mezzo a un bastone, che si vede dall'altra parte della
strada. Si finisce con due Garamond. A metà strada ci sono due neogrotesche in cui l'unica
differenza onesta è la **R**, la **G** e la coda della **y**.

## Punteggio

- **Refuso abbattuto** — 100 × tiratura, per il moltiplicatore della serie in corso
- **Lettera giusta stampata** — 10 punti: hai avuto la pazienza di non sparare
- **Serie** — ogni refuso di fila senza errori alza il moltiplicatore fino a ×5; a quattro
  di fila la macchina va in quadricromia e i biglietti escono a colori, valgono una volta e mezzo
- **Prova pulita** — bonus di fine tiratura se non hai bucato niente

## Comandi

Frecce per spostare la macchina, spazio per stampare un biglietto, P per la pausa.
Da telefono: trascina il dito sul foglio per spostarti, tocca per sparare, oppure usa
i tasti sotto al campo.

## Tecnica

Un solo file, `index.html`. Nessuna dipendenza a parte i caratteri da Google Fonts, caricati
con il solo sottoinsieme delle lettere che servono. Il marchio è SVG in linea, la macchina e
i biglietti sono disegnati su canvas, il rumore di sala è sintetizzato con la Web Audio API.

`SHARE_URL`, in cima allo script, è l'indirizzo che compare in fondo al risultato condiviso.

## Il gioco gemello

**Baseline**, il tetris tipografico: https://francesco-agf.github.io/baseline/
