// Kjører et TypeScript-skript (f.eks. scripts/qa/stress.ts) med Vites egen modul-runner,
// slik at skriptene kan importere appens kode uten ekstra avhengigheter.
//   node scripts/qa/run-ts.mjs scripts/qa/stress.ts
import { resolve } from 'node:path';
import { runnerImport } from 'vite';

const file = process.argv[2];
if (!file) {
  console.error('Bruk: node scripts/qa/run-ts.mjs <fil.ts>');
  process.exit(1);
}
await runnerImport(resolve(file), { configFile: false, logLevel: 'error' });
