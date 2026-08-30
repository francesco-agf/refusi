/* La bozza corretta — l'oggetto che Refusi lascia a fine partita.

   Era l'unico dei quattro giochi a non lasciare niente: Baseline ha la prova di
   stampa e la mazzetta, Leporello il pieghevole steso, Tiratura la bolla di
   consegna. Adesso Refusi lascia il foglio: la composizione che hai corretto,
   ogni lettera nella faccia in cui è caduta, i Comic Sans cerchiati in rosso
   con «car. err.» in margine — il segno sul testo e il segno in margine, come
   su una bozza vera — e in fondo quelle che sono andate in stampa così.

   Dalla cartella refusi/sorgente/: `node prova-bozza.js`.
*/
const { chromium } = require('playwright');
const path = require('path');

const PAGINA = 'file://' + path.resolve(__dirname, '..', 'index.html');
let falliti = 0;
const esito = (nome, ok, extra) => {
  if (!ok) falliti++;
  console.log((ok ? '  ok  ' : '  KO  ') + nome + (extra !== undefined ? '  ' + JSON.stringify(extra) : ''));
};

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 950 }, acceptDownloads: true });
  const errori = [];
  p.on('pageerror', e => errori.push('JS: ' + e.message));
  p.on('console', m => { if (m.type() === 'error' && !/ERR_|fonts\.g/.test(m.text())) errori.push(m.text().slice(0, 110)); });
  await p.addInitScript(() => {
    try {
      localStorage.setItem('agf.giocatore', 'Collaudo');
      localStorage.setItem('agf.guida.refusi', '1');
    } catch (e) {}
  });
  await p.route('**/rest/v1/**', r => r.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
  await p.goto(PAGINA);
  await p.waitForTimeout(1200);

  // 1 · a fine partita il foglio si offre
  const t1 = await p.evaluate(async () => {
    const R = window.__refusi;
    document.getElementById('startBtn').click();
    await new Promise(r => setTimeout(r, 400));
    const primaDelLaFine = document.getElementById('scarica').hidden;
    R.riempiBozza(78, 7);
    R.fine();
    await new Promise(r => setTimeout(r, 800));
    return { nascostoDurante: primaDelLaFine,
             offerto: !document.getElementById('scarica').hidden };
  });
  esito('durante il turno non si scarica niente', t1.nascostoDurante, t1);
  esito('a fine partita il foglio si offre  ', t1.offerto, t1);

  // 2 · il foglio si disegna, e cresce con quello che c'è sopra
  const t2 = await p.evaluate(() => {
    const R = window.__refusi;
    const misura = function(n, ogni){
      R.riempiBozza(n, ogni);
      const cv = document.createElement('canvas');
      window.__disegnaProva(cv.getContext('2d'));
      return [cv.width, cv.height];
    };
    const corto = misura(12, 5);
    const lungo = misura(120, 7);
    const vuoto = (function(){
      R.riempiBozza(0, 99);
      const cv = document.createElement('canvas');
      window.__disegnaProva(cv.getContext('2d'));
      return [cv.width, cv.height];
    })();
    return { corto: corto, lungo: lungo, vuoto: vuoto };
  });
  esito('il foglio è largo mille           ',
        t2.corto[0] === 1000 && t2.lungo[0] === 1000, t2);
  esito('e si allunga con la composizione  ',
        t2.lungo[1] > t2.corto[1], { corto: t2.corto[1], lungo: t2.lungo[1] });
  /* Anche a mani vuote deve uscire un foglio: chi perde subito si porta via
     una bozza bianca, non un errore. */
  esito('anche il foglio bianco si stampa  ',
        t2.vuoto[0] === 1000 && t2.vuoto[1] >= 700, { vuoto: t2.vuoto });

  // 3 · il pulsante consegna davvero un file
  const [scaricato] = await Promise.all([
    p.waitForEvent('download').catch(() => null),
    p.evaluate(async () => {
      window.__refusi.riempiBozza(60, 8);
      document.getElementById('dlBozza').click();
    })
  ]);
  esito('e il pulsante lo consegna         ',
        !!scaricato && /^bozza-.*\.jpg$/.test(scaricato ? scaricato.suggestedFilename() : ''),
        scaricato ? scaricato.suggestedFilename() : null);

  esito('console pulita                    ', errori.length === 0, errori.slice(0, 2));

  await b.close();
  console.log(falliti ? '\n' + falliti + ' PROVE FALLITE' : '\ntutto a posto');
  process.exit(falliti ? 1 : 0);
})();
