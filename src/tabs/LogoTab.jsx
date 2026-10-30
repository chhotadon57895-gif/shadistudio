import React, { useRef, useState } from 'react';
import { Download, Image as ImageIcon } from 'lucide-react';
import { useNames } from '../store.jsx';
import Logo, { HEADERS, MODES, STYLES } from './logos.jsx';
import { downloadPng, downloadSvg } from '../exportUtils.js';

function Mockups({ n, styleId, mode, header }) {
  const L = (props) => <Logo n={n} styleId={styleId} mode={mode} header={header} {...props} />;
  const cardBase = 'rounded-2xl border border-gold/40 bg-white/70 p-3';
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Invite card */}
      <div className={cardBase}>
        <div className="mx-auto w-full max-w-[150px] rounded-md border-2 border-gold bg-ivory p-2 text-center shadow">
          <L className="mx-auto w-3/4" />
          <div className="mt-1 font-display text-[8px] font-bold text-sindoor">{n.t('Request the honour of your presence', 'आपकी उपस्थिति का आग्रह')}</div>
          <div className="font-display text-[8px] text-sindoor/70">{n.dateStr}</div>
        </div>
        <div className="mt-2 text-center text-[11px] font-semibold text-sindoor">{n.t('Invite card', 'निमंत्रण कार्ड')}</div>
      </div>

      {/* Gate welcome board */}
      <div className={cardBase}>
        <div className="mx-auto flex w-[130px] flex-col items-center rounded-t-full border-4 border-gold bg-sindoor px-2 pb-3 pt-6 shadow">
          <L className="w-full" mode={mode === 'full' ? 'dark' : mode} />
          <div className="font-display text-xs font-bold text-gold">{n.t('Welcome', 'स्वागतम्')}</div>
        </div>
        <div className="mt-2 text-center text-[11px] font-semibold text-sindoor">{n.t('Gate welcome board', 'गेट स्वागत बोर्ड')}</div>
      </div>

      {/* Mithai box stickers */}
      <div className={cardBase}>
        <div className="mx-auto grid w-[140px] grid-cols-2 gap-1.5 rounded-md bg-[#5b3a1e] p-2 shadow">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex aspect-square items-center justify-center overflow-hidden rounded-full border border-gold bg-ivory/90">
              <L className="w-[88%]" />
            </div>
          ))}
        </div>
        <div className="mt-2 text-center text-[11px] font-semibold text-sindoor">{n.t('Mithai box stickers', 'मिठाई बॉक्स स्टिकर')}</div>
      </div>

      {/* Instagram highlights */}
      <div className={cardBase}>
        <div className="flex justify-center gap-2">
          {[n.t('Haldi', 'हल्दी'), n.t('Sangeet', 'संगीत'), n.t('Shaadi', 'शादी')].map((l) => (
            <div key={l} className="text-center">
              <div className="rounded-full bg-gradient-to-tr from-marigold via-sindoor to-gold p-[2px]">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-ivory p-1">
                  <L className="w-full" />
                </div>
              </div>
              <div className="mt-0.5 text-[9px] font-semibold">{l}</div>
            </div>
          ))}
        </div>
        <div className="mt-2 text-center text-[11px] font-semibold text-sindoor">{n.t('Instagram highlight covers', 'इंस्टाग्राम हाइलाइट')}</div>
      </div>

      {/* Cake topper */}
      <div className={cardBase}>
        <div className="relative mx-auto h-[120px] w-[120px]">
          <div className="absolute left-1/2 top-0 w-[70px] -translate-x-1/2 overflow-hidden rounded-full border-2 border-gold bg-white p-1 shadow">
            <L className="w-full" />
          </div>
          <div className="absolute left-1/2 top-[68px] h-9 w-[2px] -translate-x-1/2 bg-gold" />
          <div className="absolute bottom-0 left-1/2 h-5 w-[110px] -translate-x-1/2 rounded-md bg-pink-100 shadow" />
          <div className="absolute bottom-5 left-1/2 h-5 w-[80px] -translate-x-1/2 rounded-md bg-pink-200 shadow" />
        </div>
        <div className="mt-2 text-center text-[11px] font-semibold text-sindoor">{n.t('Cake topper', 'केक टॉपर')}</div>
      </div>

      {/* Mehndi potli tags */}
      <div className={cardBase}>
        <div className="flex justify-center gap-3">
          {[-8, 6].map((r) => (
            <div key={r} className="relative" style={{ transform: `rotate(${r}deg)` }}>
              <div className="mx-auto h-3 w-px bg-gold" />
              <div className="w-[62px] rounded-md border border-gold bg-ivory p-1 shadow" style={{ clipPath: 'polygon(20% 0,80% 0,100% 18%,100% 100%,0 100%,0 18%)' }}>
                <div className="mx-auto mb-0.5 h-1.5 w-1.5 rounded-full bg-gold" />
                <L className="w-full" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 text-center text-[11px] font-semibold text-sindoor">{n.t('Mehndi potli tags', 'मेहंदी पोटली टैग')}</div>
      </div>
    </div>
  );
}

export default function LogoTab() {
  const n = useNames();
  const [styleId, setStyle] = useState('seal');
  const [mode, setMode] = useState('full');
  const [header, setHeader] = useState('vivah');
  const [busy, setBusy] = useState('');
  const ref = useRef(null);
  const base = `${n.bEn}-${n.gEn}-${styleId}-${mode}`.toLowerCase().replace(/[^a-z0-9-]+/g, '');

  const run = async (kind) => {
    if (!ref.current) return;
    setBusy(kind);
    try {
      if (kind === 'svg') await downloadSvg(ref.current, `${base}.svg`);
      else await downloadPng(ref.current, `${base}.png`, 3);
    } finally {
      setBusy('');
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-bold text-sindoor">{n.t('Couple logo & monogram studio', 'जोड़ी लोगो और मोनोग्राम स्टूडियो')}</h2>
        <p className="text-xs text-sindoor/60">{n.t('English + Hindi initials combine live. Change the ✦ initial selector in the top bar to switch स / श.', 'अंग्रेज़ी + हिन्दी अक्षर तुरंत जुड़ते हैं। स / श बदलने के लिए ऊपर ✦ चुनें।')}</p>
      </div>

      <div className="no-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3">
        {STYLES.map((s) => (
          <button key={s.id} onClick={() => setStyle(s.id)} className={`chip whitespace-nowrap ${styleId === s.id ? 'chip-on' : ''}`}>{s.en}</button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {HEADERS.map((h) => (
          <button key={h.id} onClick={() => setHeader(h.id)} className={`chip ${header === h.id ? 'chip-on' : ''}`}>{h.en}</button>
        ))}
      </div>

      <div className="card mx-auto max-w-sm">
        <div className={mode === 'foil' ? 'rounded-xl bg-[#3a2a12] p-2' : 'rounded-xl bg-[conic-gradient(#eee_25%,#fff_0_50%,#eee_0_75%,#fff_0)] bg-[length:16px_16px] p-2'}>
          <Logo ref={ref} n={n} styleId={styleId} mode={mode} header={header} className="w-full" />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {Object.entries(MODES).map(([k, m]) => (
            <button key={k} onClick={() => setMode(k)} className={`chip ${mode === k ? 'chip-on' : ''}`}>{m.label}</button>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <button className="btn-primary flex-1" onClick={() => run('svg')} disabled={!!busy}><Download size={16} /> SVG</button>
          <button className="btn-gold flex-1" onClick={() => run('png')} disabled={!!busy}><ImageIcon size={16} /> {busy === 'png' ? '…' : 'PNG (HD)'}</button>
        </div>
        <p className="mt-2 text-[11px] text-sindoor/60">{n.t('Exports embed the fonts when you are online. Gold-foil mode is a single colour for printers; transparent background.', 'ऑनलाइन होने पर फ़ॉन्ट एक्सपोर्ट में जुड़ जाते हैं। गोल्ड-फ़ॉइल मोड एक रंग का है, पारदर्शी बैकग्राउंड।')}</p>
      </div>

      <div>
        <h3 className="mb-2 font-display text-lg font-bold text-sindoor">{n.t('Live mockups', 'लाइव मॉकअप')}</h3>
        <Mockups n={n} styleId={styleId} mode={mode} header={header} />
      </div>
    </div>
  );
}
