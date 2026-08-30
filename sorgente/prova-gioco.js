const { chromium } = require('playwright');
const path = require('path');
// la pagina da provare è l'index.html rigenerato da sorgente/build.py
const USCITA = path.resolve(__dirname, 'uscita');
require('fs').mkdirSync(USCITA, { recursive: true });
const PAGINA = 'file://' + path.resolve(__dirname, '..', 'index.html');
const log = (...a) => console.log(...a);
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 940 } });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error' && !/ERR_|fonts.g/.test(m.text())) errors.push(m.text()); });
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  await page.addInitScript(() => { try { localStorage.setItem('agf.giocatore','Collaudo'); } catch(e){} });
  await page.route('**/rest/v1/**', r => r.fulfill({status:200, contentType:'application/json', body:'[]'}));
  await page.goto(PAGINA);
  await page.waitForTimeout(1200);

  // 1. si spara a tutto: nessuna lettera toglie bozze
  const t1 = await page.evaluate(async () => {
    const R = window.__refusi; R.comincia(); R.svuota();
    R.parolaA('BOZZA');
    const s0 = R.stato();
    for (const ch of ['Q','M','T']){
      const L = R.metti(ch, 200, 200);
      R.muovi(L.x); R.spara();
      await new Promise(r => setTimeout(r, 500));
    }
    const s = R.stato();
    return { bozzeInvariate: s.bozze === s0.bozze, presi: s.presi, punti: s.punti > 0, parola: s.parola, indice: s.indice };
  });
  log('1. spara tutto:', JSON.stringify(t1));

  // 2. la parola si compone in ordine
  const t2 = await page.evaluate(async () => {
    const R = window.__refusi; R.comincia(); R.svuota(); R.parolaA('BOZZA');
    const tappe = [];
    // prima una lettera sbagliata: non deve avanzare
    let L = R.metti('Z', 200, 200); R.muovi(L.x); R.spara();
    await new Promise(r => setTimeout(r, 500));
    tappe.push('dopo Z fuori ordine: ' + R.stato().indice);
    for (const ch of 'BOZZA'){
      L = R.metti(ch, 200, 200); R.muovi(L.x); R.spara();
      await new Promise(r => setTimeout(r, 500));
      tappe.push(ch + ' -> ' + R.stato().indice);
    }
    const s = R.stato();
    return { tappe: tappe, parolePrese: s.parolePrese, premio: s.premio,
             bozze: s.bozze, parolaNuova: s.parola !== 'BOZZA' };
  });
  log('2. la parola:', JSON.stringify(t2, null, 0));

  // 3. le bobine cambiano munizione
  const t3 = await page.evaluate(async () => {
    const R = window.__refusi; R.comincia(); R.svuota();
    const out = {};
    for (const k of ['doppia','tripla','rotativa','quadri']){
      R.svuota();
      const b = R.mettiBobina(k, 210, 200);
      R.muovi(b.x); R.spara();
      await new Promise(r => setTimeout(r, 500));
      out[k] = R.stato().munizione + ' / ' + R.stato().colpiPerSparo + ' colpi';
    }
    return out;
  });
  log('3. munizioni:', JSON.stringify(t3));

  // 4. la tripla spara davvero tre biglietti
  const t4 = await page.evaluate(async () => {
    const R = window.__refusi; R.comincia(); R.svuota();
    const b = R.mettiBobina('tripla', 210, 200); R.muovi(b.x); R.spara();
    await new Promise(r => setTimeout(r, 900));   // il biglietto deve arrivarci
    const presa = R.stato().munizione;
    R.svuota();
    R.spara();
    await new Promise(r => setTimeout(r, 60));
    return { munizione: presa, colpiInVolo: R.stato().colpi };
  });
  log('4. tripla stampa:', JSON.stringify(t4));

  // 5. una lettera che arriva in fondo costa una bozza; col premio «visto» no
  const t5 = await page.evaluate(async () => {
    const R = window.__refusi; R.comincia(); R.svuota();
    const b0 = R.stato().bozze;
    R.metti('M', 120, 300);
    await new Promise(r => setTimeout(r, 6000));
    return { prima: b0, dopo: R.stato().bozze, scappati: R.stato().scappati };
  });
  log('5. lettera in fondo:', JSON.stringify(t5));

  // 5b. col premio «visto si stampi» le lettere che arrivano in fondo non costano
  const t5b = await page.evaluate(async () => {
    const R = window.__refusi; R.comincia(); R.svuota(); R.parolaA('BO');
    for (const ch of 'BO'){ const L = R.metti(ch, 200, 200); R.muovi(L.x); R.spara(); await new Promise(r=>setTimeout(r,450)); }
    const dopoParola = R.stato();
    if (dopoParola.premio !== 'visto'){
      // il premio è a sorte: lo forzo rigiocando finché non esce
      for (let k = 0; k < 20 && R.stato().premio !== 'visto'; k++){
        R.parolaA('BO');
        for (const ch of 'BO'){ const L = R.metti(ch, 200, 200); R.muovi(L.x); R.spara(); await new Promise(r=>setTimeout(r,420)); }
      }
    }
    if (R.stato().premio !== 'visto') return { saltato: 'premio oro, non provato' };
    R.svuota();
    const b0 = R.stato().bozze;
    R.metti('M', 120, 300);
    await new Promise(r => setTimeout(r, 6000));
    return { premio: R.stato().premio, prima: b0, dopo: R.stato().bozze };
  });
  log('5b. visto si stampi:', JSON.stringify(t5b));

  // 6. cinque bozze e fine turno
  const t6 = await page.evaluate(async () => {
    const R = window.__refusi; R.comincia(); R.svuota();
    for (let i = 0; i < 5; i++){ R.metti('M', 100 + i * 30, 400); }
    await new Promise(r => setTimeout(r, 7000));
    return { fase: R.stato().fase, bozze: R.stato().bozze };
  });
  log('6. fine turno:', JSON.stringify(t6));

  // 7. parole disponibili
  log('7. parole:', await page.evaluate(() => window.__refusi.PAROLE.length + ' parole, da ' +
      window.__refusi.PAROLE[0] + ' a ' + window.__refusi.PAROLE[window.__refusi.PAROLE.length-1]));

  // 8. partita automatica
  const t8 = await page.evaluate(async () => {
    const R = window.__refusi; R.comincia();
    let n = 0;
    for (let i = 0; i < 400; i++){
      if (R.stato().fase !== 'play') break;
      const st = R.stato();
      R.spara(); n++;
      await new Promise(r => setTimeout(r, 45));
    }
    const s = R.stato();
    return { spari: n, fase: s.fase, punti: s.punti, passata: s.passata, presi: s.presi };
  });
  log('8. partita automatica:', JSON.stringify(t8));

  log('9. risultato:\n' + await page.evaluate(() => window.__refusi.testo()));

  await page.evaluate(async () => {
    const R = window.__refusi; R.comincia(); R.svuota(); R.parolaA('FILIGRANA');
    for (const ch of 'FIL'){ const L = R.metti(ch, 200, 200); R.muovi(L.x); R.spara(); await new Promise(r=>setTimeout(r,400)); }
    R.svuota();
    R.mettiBobina('tripla', 320, 180);
    for (let i = 0; i < 5; i++) R.metti('AGRIL'.charAt(i), 60 + i * 82, 120 + i * 52);
    R.spara();
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(USCITA, 'r2-desktop.png') });

  const mob = await browser.newPage({ viewport: { width: 390, height: 780 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await mob.addInitScript(() => { try { localStorage.setItem('agf.giocatore','Collaudo'); } catch(e){} });
  await mob.route('**/rest/v1/**', r => r.fulfill({status:200, contentType:'application/json', body:'[]'}));
  await mob.goto(PAGINA);
  await mob.waitForTimeout(1200);
  await mob.evaluate(async () => {
    const R = window.__refusi; R.comincia(); R.svuota(); R.parolaA('TORCHIO');
    for (const ch of 'TOR'){ const L = R.metti(ch, 200, 200); R.muovi(L.x); R.spara(); await new Promise(r=>setTimeout(r,350)); }
    R.svuota();
    R.mettiBobina('quadri', 240, 150);
    for (let i = 0; i < 4; i++) R.metti('CHIO'.charAt(i), 50 + i * 82, 200 + i * 60);
    R.muovi(180); R.spara();
  });
  await mob.waitForTimeout(400);
  await mob.screenshot({ path: path.join(USCITA, 'r2-mobile.png') });

  log('10. errori:', errors.length ? errors : 'nessuno');
  await browser.close();
})();
