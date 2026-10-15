import { createHash } from 'node:crypto';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Content-Security-Policy i den bygde siden (ikke i dev, der Vite trenger websocket for HMR).
 * connect-src 'none' betyr at nettleseren nekter siden å sende noe som helst over nettet – svarene
 * kan dermed ikke lekke selv om det skulle komme inn kode som prøver. Det eneste inline-skriptet
 * (mørk/lys modus før første tegning) tillates via sin SHA-256.
 */
function csp(): Plugin {
  return {
    name: 'valgomat-csp',
    apply: 'build',
    transformIndexHtml(html) {
      const hashes = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(
        (m) => `'sha256-${createHash('sha256').update(m[1]).digest('base64')}'`,
      );
      const policy = [
        "default-src 'none'",
        `script-src 'self' ${hashes.join(' ')}`,
        "style-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'none'",
        "base-uri 'none'",
        "form-action 'none'",
      ].join('; ');
      return html.replace('<meta charset="UTF-8" />', `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${policy}" />`);
    },
  };
}

// base: './' gjør at den bygde siden kan hostes fra hvilken som helst undermappe (f.eks. GitHub Pages).
export default defineConfig({
  base: './',
  plugins: [react(), csp()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
  },
});
