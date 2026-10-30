import React from 'react';
import { createRoot } from 'react-dom/client';
// Fonts are bundled (no Google Fonts request), so everything works offline.
import '@fontsource/playfair-display/latin-400.css';
import '@fontsource/playfair-display/latin-600.css';
import '@fontsource/playfair-display/latin-700.css';
import '@fontsource/playfair-display/latin-900.css';
import '@fontsource/noto-serif-devanagari/devanagari-400.css';
import '@fontsource/noto-serif-devanagari/devanagari-700.css';
import '@fontsource/noto-serif-devanagari/latin-400.css';
import '@fontsource/noto-serif-devanagari/latin-700.css';
import App from './App.jsx';
import { AppProvider } from './store.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <AppProvider>
    <App />
  </AppProvider>
);

// Offline cache for the hosted site (not for the downloaded .html files, which are already offline).
if (import.meta.env.PROD && 'serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
