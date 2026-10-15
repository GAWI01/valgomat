// Røyktest i ekte nettleser: går gjennom hele testen på mobil og desktop, tar skjermbilder,
// sjekker horisontal scrolling, konsollfeil og at resultatsidene fungerer.
// Bruk: npx vite preview --port 4173 & node scripts/qa/smoke.mjs
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE ?? 'http://localhost:4173/';
const OUT = process.env.OUT ?? 'test-results/screens';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath: process.env.CHROME ?? '/opt/pw-browsers/chromium' });
const problems = [];

async function run(name, viewport, opts = {}) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2, colorScheme: opts.dark ? 'dark' : 'light', isMobile: viewport.width < 600, hasTouch: viewport.width < 600 });
  const page = await ctx.newPage();
  page.on('console', (m) => m.type() === 'error' && problems.push(`${name}: console: ${m.text()}`));
  page.on('pageerror', (e) => problems.push(`${name}: pageerror: ${e.message}`));
  const shot = async (n) => page.screenshot({ path: `${OUT}/${name}-${n}.png`, fullPage: true });
  const noHScroll = async (where) => {
    const w = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
    if (w[0] > w[1] + 1) problems.push(`${name}: horisontal scroll på ${where} (${w[0]} > ${w[1]})`);
  };

  await page.goto(BASE);
  await shot('01-home');
  await noHScroll('forside');
  await page.getByRole('link', { name: /Start testen/ }).click();
  await page.waitForSelector('#question-text');
  await page.getByRole('button', { name: /Hva handler dette om/ }).click();
  await shot('02-question-explained');
  await noHScroll('spørsmål');

  // Svar på alle spørsmål med et variert mønster, inkl. noen «vet ikke» og viktige saker
  const total = await page.evaluate(() => Number(document.querySelector('#question-text')?.closest('div.mx-auto')?.querySelector('p span')?.textContent?.replace(/\D/g, '') ?? 0));
  for (let i = 0; i < 80; i++) {
    const v = ((i * 5) % 7) - 3;
    if (i % 13 === 7) {
      await page.getByRole('button', { name: /Vet ikke/ }).click();
    } else {
      await page.getByRole('radio').nth(v + 3).click();
      if (i % 11 === 3) await page.getByRole('button', { name: /En av mine viktigste/ }).click();
      else if (i % 7 === 2) await page.getByRole('button', { name: /Viktig for meg/ }).click();
    }
    if (i === 20) await shot('03-question-answered');
    const next = page.getByRole('button', { name: /Neste|Se resultat|Hopp over/ });
    await next.click();
    await page.waitForTimeout(30);
  }
  await page.waitForSelector('text=Alle partier rangert');
  await shot('04-results');
  await noHScroll('resultat');
  const verdict = await page.getByRole('status').first().textContent();
  console.log(`${name}: ${total ? `${total} spm. ` : ''}verdict: ${verdict?.slice(0, 120)}`);
  const firstParty = await page.locator('ol li a').first().getAttribute('href');
  await page.goto(BASE + firstParty);
  await page.waitForSelector('text=Dere er mest enige om');
  await shot('05-party');
  await noHScroll('parti');
  await page.goto(BASE + '#/resultat/sporsmal');
  await shot('06-all-questions');
  await noHScroll('alle spørsmål');
  await page.goto(BASE + '#/sak/imm_quota');
  await page.waitForSelector('text=Partienes standpunkter');
  await shot('07-question-detail');
  await noHScroll('sak');
  for (const [r, n] of [['#/metode', '08-method'], ['#/hvorfor-ulikt', '09-why'], ['#/kilder', '10-sources'], ['#/oversikt', '11-overview']]) {
    await page.goto(BASE + r);
    await page.waitForTimeout(100);
    await shot(n);
    await noHScroll(r);
  }
  // Autolagring: last siden på nytt og sjekk at svarene er der
  await page.goto(BASE);
  await page.reload();
  const cont = await page.getByRole('link', { name: /Fortsett/ }).count();
  if (!cont) problems.push(`${name}: autosave fungerer ikke (ingen «Fortsett»-knapp etter reload)`);
  // Start på nytt med bekreftelse
  await page.getByRole('button', { name: 'Start på nytt' }).click();
  await page.getByRole('button', { name: 'Ja, slett' }).click();
  if (!(await page.getByRole('link', { name: /Start testen/ }).count())) problems.push(`${name}: «Start på nytt» nullstilte ikke`);
  await ctx.close();
}

await run('mobil', { width: 375, height: 812 });
await run('mobil-smal', { width: 320, height: 640 }, { dark: true });
await run('desktop', { width: 1280, height: 900 });
await browser.close();
if (problems.length) {
  console.log('\nProblemer:\n- ' + problems.join('\n- '));
  process.exit(1);
}
console.log('\n✓ Ingen problemer funnet');
