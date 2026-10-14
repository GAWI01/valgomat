/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#14162b', soft: '#3a3d5c' },
        brand: { 50: '#f1f0fd', 100: '#e4e1fb', 200: '#c9c3f6', 400: '#8c7fe8', 500: '#6c5ce0', 600: '#5847c9', 700: '#4636a8', 800: '#382c85', 900: '#241c57' },
        sand: { 50: '#fbfaf7', 100: '#f4f2ec', 200: '#e8e4d9' },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      keyframes: {
        rise: { '0%': { opacity: 0, transform: 'translateY(6px)' }, '100%': { opacity: 1, transform: 'none' } },
      },
      animation: { rise: 'rise 220ms ease-out both' },
    },
  },
  plugins: [],
};
