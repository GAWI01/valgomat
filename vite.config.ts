import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' gjør at den bygde siden kan hostes fra hvilken som helst undermappe (f.eks. GitHub Pages).
export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
  },
});
