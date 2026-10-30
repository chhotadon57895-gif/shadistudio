/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FAF6F0',
        sindoor: '#7A1C1C',
        gold: '#D4AF37',
        peacock: '#0F4C5C',
        marigold: '#F59E0B',
      },
      fontFamily: {
        display: ['"Playfair Display"', '"Noto Serif Devanagari"', 'serif'],
        deva: ['"Noto Serif Devanagari"', '"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [],
};
