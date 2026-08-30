const { chromium } = require('playwright');
const path = require('path');
// la pagina da provare è l'index.html rigenerato da sorgente/build.py
const USCITA = path.resolve(__dirname, 'uscita');
require('fs').mkdirSync(USCITA, { recursive: true });
const PAGINA = 'file://' + path.resolve(__dirname, '..', 'index.html');
const log = (...a) => console.log(...a);
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type()==='error' && !/ERR_|fonts.g/.test(m.text())) errors.push(m.text()); });

  // finge il database
  const inviati = [];
  const finte = [
    { name:'Proto', score:9800, level:6, lines:41, dati:{precisione:88}, day:20260829 },
    { name:'Anna',  score:5400, level:4, lines:22, dati:{precisione:74}, day:20260830 },
    { name:'anna',  score:3100, level:3, lines:14, dati:{precisione:61}, day:20260828 }
  ];
  await page.route('**/rest/v1/**', async (route) => {
    const req = route.request();
    if (req.method() === 'POST'){ inviati.push(JSON.parse(req.postData())); return route.fulfill({ status: 201, body: '' }); }
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(finte) });
  });

  await page.goto(PAGINA);
  await page.waitForTimeout(1200);

  log('1. classifica caricata:', await page.evaluate(() =>
    [...document.querySelectorAll('#boardList li')].map(li => li.querySelector('.board-name').textContent)));

  // 2. senza nome non si comincia
  const t2 = await page.evaluate(async () => {
    document.getElementById('nameInput').value = '';
    document.getElementById('startBtn').click();
    await new Promise(r => setTimeout(r, 200));
    return { fase: window.__refusi.stato().fase, nota: document.getElementById('nameNote').textContent };
  });
  log('2. senza nome:', JSON.stringify(t2));

  // 3. col nome si comincia e a fine turno il punteggio parte
  const t3 = await page.evaluate(async () => {
    const R = window.__refusi;
    document.getElementById('nameInput').value = 'Francesco';
    document.getElementById('startBtn').click();
    await new Promise(r => setTimeout(r, 200));
    const partito = R.stato().fase;
    R.svuota();
    for (let i = 0; i < 3; i++){
      const L = R.metti('R', true, 200, 200);
      R.muovi(L.x); R.spara();
      await new Promise(r => setTimeout(r, 500));
    }
    R.fine();
    await new Promise(r => setTimeout(r, 900));
    return { partito: partito, msg: document.getElementById('signupMsg').textContent,
             nomeSalvato: localStorage.getItem('agf.giocatore') };
  });
  log('3. turno + invio:', JSON.stringify(t3));
  log('   inviato al database:', JSON.stringify(inviati));

  // 4. il nome della sala arriva da Baseline
  const t4 = await page.evaluate(async () => {
    localStorage.removeItem('agf.giocatore');
    localStorage.setItem('baseline.nome', 'Fimognari');
    location.reload();
  });
  await page.waitForTimeout(1400);
  log('4. nome ereditato da Baseline:', await page.evaluate(() => document.getElementById('nameInput').value + ' | ' + document.getElementById('nameNote').textContent));

  await page.evaluate(() => { document.getElementById('boardOpen').click(); });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(USCITA, 'r-classifica.png') });
  await page.evaluate(() => { document.getElementById('boardClose').click(); });
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(USCITA, 'r-board-inline.png'), fullPage: true });

  log('5. errori:', errors.length ? errors : 'nessuno');
  await browser.close();
})();
