# AGF Arcade — Refusi — lo sparatutto tipografico

Contesto per Claude Code. Il **brief operativo** in corso e il piano di lavoro stanno in
`PASSAGGIO.md` nel repo della sala (`francesco-agf/francesco-agf.github.io`): leggilo prima di
toccare qualunque cosa.

## Cos'e' questo repo

Si e' rovesciata la cassa e le lettere piovono sul foglio, ognuna nel suo carattere.
Una macchina da stampa in fondo le abbatte: **si spara a tutte**, e quella evidenziata in cima
fa avanzare la parola da comporre. Ogni tre passate scende **il Comic Sans**, che contagia le
altre lettere finche' non lo abbatti. A fine partita resta **la bozza corretta**: la
composizione coi refusi cerchiati in rosso e «car. err.» in margine.

Fa parte di una **sala di cinque repository** — quattro giochi piu' la pagina d'ingresso — che
si comportano come un prodotto solo:

| Repo | Indirizzo pubblico |
|---|---|
| `francesco-agf/francesco-agf.github.io` | https://francesco-agf.github.io/ |
| `francesco-agf/baseline` | https://francesco-agf.github.io/baseline/ |
| `francesco-agf/refusi` | https://francesco-agf.github.io/refusi/ |
| `francesco-agf/leporello` | https://francesco-agf.github.io/leporello/ |
| `francesco-agf/tiratura` | https://francesco-agf.github.io/tiratura/ |

Repo separati per una ragione precisa: GitHub Pages accetta **un solo dominio personalizzato
per repository**. Gli indirizzi sono gia' stati condivisi e **non cambiano**.

## Le due forme dello stesso codice — la regola che rompe tutto se ignorata

    sorgente/refusi.html   il sorgente di lavoro. Non ha doctype ne' <head>.
    index.html        la versione pubblicata, con la testata completa.
                      E' GENERATA: non si modifica a mano.

Si modifica **sempre** `sorgente/refusi.html` e poi si rigenera:

    python3 sorgente/build.py

`build.py` incolla `sorgente/testa.html` davanti al corpo del sorgente. Va rilanciato **dopo
ogni modifica**: i collaudi girano su `index.html`, e le media query del telefono funzionano
solo li', perche' il sorgente non ha il meta viewport.

Se modifichi `index.html` a mano, la modifica sparisce alla prossima build. Se modifichi il
sorgente e non ricostruisci, pubblichi la versione vecchia.

## Come si collauda

Servono `playwright` e Chromium. Dalla cartella `sorgente/`:

    node prova-gioco.js         il giro completo
    node prova-bozza.js         la bozza corretta da scaricare
    node prova-classifica.js    l'invio del punteggio

Le prove aprono `index.html` da `file://` e pilotano il gioco dalle API di collaudo
(`window.__refusi`). Non aspettano tempi fissi: chiamano l'avanzamento a mano, perche'
`requestAnimationFrame` si ferma quando la scheda va in secondo piano.

## Pubblicazione

GitHub Pages, **branch `main`, cartella radice**, workflow automatico
`pages build and deployment`. Nessuna Action personalizzata, nessuna cartella `/docs`,
nessun `gh-pages`.

**Un branch di lavoro non e' pubblicato finche' non entra in `main`.** Il ciclo e':
branch -> collaudo -> merge in `main` -> attesa del workflow -> verifica dell'URL pubblico.

## Cose da non rompere

- **La famiglia.** I quattro giochi devono sembrare fatti dalla stessa mano. C'e' una prova
  che lo pretende: `sala/sorgente/prova-famiglia-stili.js` confronta gli stili calcolati dei
  quattro giochi e fallisce se divergono. Se cambi un pulsante qui, cambialo in tutti e quattro.
- **Il nome del giocatore** sta in `localStorage` sotto la chiave condivisa `agf.giocatore`,
  uguale per tutta la sala. La vecchia `baseline.nome` resta letta come ripiego.
- **La classifica** e' la tabella `public.scores` di Supabase, condivisa fra i quattro giochi,
  con la chiave pubblicabile nel client e RLS in sola lettura e inserimento. Non toccare lo
  schema remoto.
- **Gli indirizzi nel codice sono assoluti**, non relativi: i collegamenti fra i giochi
  funzionano anche fuori dal loro sottopercorso.
- **Niente `localhost`, IP privati, `file://` o percorsi del computer** in quello che va
  pubblicato.

## Attenzione, qui

- Il livello si chiama **passata**, non «tiratura»: «Tiratura» e' il nome del quarto gioco
  della sala e la parola non deve valere due cose.
- `--accent` e' `#EC2288`, il magenta di casa schiarito: il `#E20C7A` puro si ferma a 4,29:1
  sul fondo scuro e non passa il minimo di leggibilita'.
- Le dieci famiglie di caratteri arrivano da Google Fonts. Se non caricano, le lettere cadono
  su un fallback e il gioco perde senso: e' una dipendenza esterna nota.

## Il tono

Il progetto e' un pezzo di marketing di una tipografia milanese del 1950. Tutto — interfaccia,
regole, commenti nel codice, messaggi di commit — e' in **italiano**, e usa il vocabolario del
mestiere: forma, registro, segnatura, passata, bozza, sigillo, mazzetta. I commenti nel codice
spiegano **perche'** una cosa e' fatta cosi', non cosa fa la riga sotto. Mantieni questo tono.
