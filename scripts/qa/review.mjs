/**
 * Grundig visuell og tilgjengelighetsmessig gjennomgang: tar skjermbilder av alle sider og tilstander
 * (mobil/desktop × lys/mørk) og kjører axe-core på hver side.
 *   BASE=http://localhost:4173/ node scripts/qa/review.mjs   → test-results/review/*.png + review.json
 */
import { chromium } from 'playwright-core';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const BASE = process.env.BASE ?? 'http://localhost:4173/';
const data = JSON.parse(readFileSync('src/data/data.json', 'utf8'));
const OUT = 'test-results/review';
mkdirSync(OUT, { recursive: true });

const store = (answers) => JSON.stringify({ answers, index: 0, updated: 1 });
const patterned = {};
data.questions.forEach((q, i) => (patterned[q.id] = { value: i % 13 === 7 ? null : ((i * 5) % 7) - 3, importance: i % 11 === 3 ? 2 : i % 7 === 2 ? 1 : 0 }));
const hProfile = {};
for (const p of data.positions.filter((x) => x.party === 'H' && x.position !== null)) hProfile[p.question] = { value: p.position, importance: 0 };
const few = Object.fromEntries(data.questions.slice(0, 5).map((q) => [q.id, { value: 2, importance: 0 }]));

const SCENARIOS = [
  { name: 'home-empty', hash: '#/', answers: {} },
  { name: 'quiz-1-empty', hash: '#/sporsmal/1', answers: {} },
  { name: 'quiz-answered', hash: '#/sporsmal/2', answers: patterned, after: async (p) => { await p.getByRole('button', { name: /Hva handler dette om/ }).click().catch(() => {}); } },
  { name: 'quiz-last', hash: `#/sporsmal/${data.questions.length}`, answers: patterned },
  { name: 'overview', hash: '#/oversikt', answers: patterned },
  { name: 'results-few', hash: '#/resultat', answers: few },
  { name: 'results-weak', hash: '#/resultat', answers: patterned },
  { name: 'results-clear', hash: '#/resultat', answers: hProfile },
  { name: 'results-questions', hash: '#/resultat/sporsmal', answers: hProfile },
  { name: 'party-H', hash: '#/resultat/parti/H', answers: hProfile },
  { name: 'party-unknown', hash: '#/resultat/parti/XYZ', answers: hProfile },
  { name: 'question', hash: '#/sak/econ_tax_level', answers: hProfile },
  { name: 'question-unknown', hash: '#/sak/finnes_ikke', answers: {} },
  { name: 'method', hash: '#/metode', answers: {} },
  { name: 'why', hash: '#/hvorfor-ulikt', answers: {} },
  { name: 'sources', hash: '#/kilder', answers: {} },
  { name: 'sources-other', hash: '#/kilder/andre-partier', answers: {} },
];
const VIEWS = [
  { name: 'm', viewport: { width: 375, height: 812 }, dpr: 2 },
  { name: 'd', viewport: { width: 1280, height: 900 }, dpr: 1 },
];

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const report = [];
for (const theme of ['light', 'dark']) {
  for (const v of VIEWS) {
    for (const sc of SCENARIOS) {
      const ctx = await browser.newContext({ viewport: v.viewport, deviceScaleFactor: v.dpr, reducedMotion: 'reduce', colorScheme: theme, bypassCSP: true }); // CSP slås av bare for å kunne injisere axe-core
      await ctx.addInitScript(([s, t]) => { localStorage.setItem('valgomat2027:v1', s); localStorage.setItem('valgomat2027:theme', t); }, [store(sc.answers), theme]);
      const page = await ctx.newPage();
      const errors = [];
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
      page.on('pageerror', (e) => errors.push(String(e)));
      await page.goto(BASE + sc.hash);
      await page.waitForTimeout(500);
      if (sc.after) { await sc.after(page); await page.waitForTimeout(300); }
      const file = `${OUT}/${theme}-${v.name}-${sc.name}.png`;
      await page.screenshot({ path: file, fullPage: true });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      await page.addScriptTag({ content: axeSource });
      const axe = await page.evaluate(async () => {
        // @ts-ignore
        const r = await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] });
        return r.violations.map((x) => ({ id: x.id, impact: x.impact, help: x.help, nodes: x.nodes.slice(0, x.id === 'color-contrast' ? 400 : 4).map((n) => ({ target: n.target.join(' '), summary: n.failureSummary?.split('\n').slice(0, 3).join(' ') })) , count: x.nodes.length }));
      });
      const title = await page.title();
      report.push({ theme, view: v.name, scenario: sc.name, title, overflow, errors, axe });
      await ctx.close();
    }
  }
}
await browser.close();
writeFileSync(`${OUT}/review.json`, JSON.stringify(report, null, 2));
const sum = {};
for (const r of report) for (const a of r.axe) { const k = `${a.impact} ${a.id}: ${a.help}`; sum[k] = (sum[k] ?? 0) + a.count; }
console.log('Axe-brudd (antall noder totalt):');
for (const [k, n] of Object.entries(sum).sort((a, b) => b[1] - a[1])) console.log(`  ${n}× ${k}`);
console.log('Konsollfeil:', report.filter((r) => r.errors.length).map((r) => `${r.theme}/${r.view}/${r.scenario}: ${r.errors[0]}`));
console.log('Horisontal scroll:', report.filter((r) => r.overflow > 0).map((r) => `${r.theme}/${r.view}/${r.scenario} (${r.overflow}px)`));
console.log('Titler:', [...new Set(report.map((r) => `${r.scenario}=${r.title}`))].join(' | '));
