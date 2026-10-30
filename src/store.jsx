import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { translit } from './translit.js';

const KEY = 'shaadi-studio-v1';

export const DEFAULT_FNS = [
  { id: 'roka', en: 'Roka', hi: 'रोका', on: true, date: '2027-01-10', time: '11:00', venue: '', map: '', dress: 'Pastel ethnic', contact: '', phone: '' },
  { id: 'haldi', en: 'Haldi', hi: 'हल्दी', on: true, date: '2027-02-12', time: '10:00', venue: '', map: '', dress: 'Yellow / marigold', contact: '', phone: '' },
  { id: 'mehndi', en: 'Mehndi', hi: 'मेहंदी', on: true, date: '2027-02-12', time: '16:00', venue: '', map: '', dress: 'Green & pastels', contact: '', phone: '' },
  { id: 'sangeet', en: 'Sangeet', hi: 'संगीत', on: true, date: '2027-02-13', time: '19:00', venue: '', map: '', dress: 'Glam Indo-western', contact: '', phone: '' },
  { id: 'wedding', en: 'Wedding', hi: 'विवाह', on: true, date: '2027-02-14', time: '18:00', venue: '', map: '', dress: 'Traditional / royal', contact: '', phone: '' },
  { id: 'reception', en: 'Reception', hi: 'रिसेप्शन', on: true, date: '2027-02-15', time: '20:00', venue: '', map: '', dress: 'Formal / cocktail', contact: '', phone: '' },
  { id: 'nikah', en: 'Nikah', hi: 'निकाह', on: false, date: '2027-02-14', time: '12:00', venue: '', map: '', dress: 'Modest traditional', contact: '', phone: '' },
  { id: 'patrika', en: 'Marathi Patrika', hi: 'मराठी पत्रिका', on: false, date: '2027-02-10', time: '10:00', venue: '', map: '', dress: 'Nauvari / kurta', contact: '', phone: '' },
];

const DEFAULTS = {
  lang: 'en',
  b: { en: 'Aanya', hi: 'आन्या', touched: false, ini: '' },
  g: { en: 'Kabir', hi: 'कबीर', touched: false, ini: '' },
  date: '2027-02-14',
  bCity: 'Jaipur',
  gCity: 'Mumbai',
  fns: DEFAULT_FNS,
  kids: [
    'हमारे भैया की शादी में ज़रूर आना — Aarav & Mira',
    'Our Mamu is getting married, come dance with us! — The Little Ones',
  ],
  families: [
    { id: 'f1', name: 'Sharma', fns: ['haldi', 'mehndi', 'sangeet', 'wedding', 'reception'] },
    { id: 'f2', name: 'Mehta', fns: ['sangeet', 'wedding', 'reception'] },
  ],
  song: { title: 'Tum Hi Ho', artist: 'Arijit Singh', url: '' },
  upi: { id: '', name: '' },
  hostPhone: '',
  siteUrl: '',
};

const Ctx = createContext(null);

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    const p = JSON.parse(raw);
    return { ...DEFAULTS, ...p, b: { ...DEFAULTS.b, ...p.b }, g: { ...DEFAULTS.g, ...p.g } };
  } catch {
    return DEFAULTS;
  }
}

export function AppProvider({ children }) {
  const [s, setS] = useState(load);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* storage may be blocked */ }
  }, [s]);

  const patch = useCallback((p) => setS((x) => ({ ...x, ...p })), []);

  const setName = useCallback((side, en) => {
    setS((x) => {
      const cur = x[side];
      return { ...x, [side]: { ...cur, en, hi: cur.touched ? cur.hi : translit(en) } };
    });
  }, []);

  const setHi = useCallback((side, hi) => {
    setS((x) => {
      // Clearing the Hindi box hands control back to auto-transliteration.
      if (hi.trim() === '') return { ...x, [side]: { ...x[side], hi: translit(x[side].en), touched: false } };
      return { ...x, [side]: { ...x[side], hi, touched: true } };
    });
  }, []);

  const setIni = useCallback((side, ini) => {
    setS((x) => ({ ...x, [side]: { ...x[side], ini } }));
  }, []);

  const value = useMemo(() => ({ s, patch, setName, setHi, setIni }), [s, patch, setName, setHi, setIni]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useApp = () => useContext(Ctx);

const firstChar = (str) => Array.from((str || '').trim())[0] || '';

export function fmtDate(iso, hi) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(hi ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function daysUntil(iso) {
  const d = new Date(iso + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((d - today) / 86400000));
}

// Everything that has to "redraw live" reads names through this hook.
export function useNames(override) {
  const { s } = useApp();
  const src = override || s;
  const hi = src.lang === 'hi';
  const bEn = (src.b.en || 'Bride').trim() || 'Bride';
  const gEn = (src.g.en || 'Groom').trim() || 'Groom';
  const bHi = (src.b.hi || '').trim() || bEn;
  const gHi = (src.g.hi || '').trim() || gEn;
  return {
    hi,
    t: (en, h) => (hi ? h : en),
    bEn, gEn, bHi, gHi,
    b: hi ? bHi : bEn,
    g: hi ? gHi : gEn,
    bI: bEn[0].toUpperCase(),
    gI: gEn[0].toUpperCase(),
    bH: src.b.ini || firstChar(bHi),
    gH: src.g.ini || firstChar(gHi),
    date: src.date,
    dateStr: fmtDate(src.date, hi),
    days: daysUntil(src.date),
    bCity: src.bCity || 'Jaipur',
    gCity: src.gCity || 'Mumbai',
  };
}

export const toB64 = (obj) =>
  btoa(unescape(encodeURIComponent(JSON.stringify(obj)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

export const fromB64 = (str) => {
  const pad = str.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(decodeURIComponent(escape(atob(pad + '='.repeat((4 - (pad.length % 4)) % 4)))));
};
