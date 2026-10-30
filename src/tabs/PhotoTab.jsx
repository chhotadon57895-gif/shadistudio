import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Camera, Download, Loader2, Sparkles, Upload } from 'lucide-react';
import { fmtDate, useApp, useNames } from '../store.jsx';
import { TEMPLATES, drawTemplate } from './countdown.js';
import { saveBlob } from '../exportUtils.js';

const DESTS = [
  { id: 'patrika', name: 'Patrika Gate, Jaipur', r: 'Rajasthan', e: '🌈', p: 'Patrika Gate Jaipur colourful arches' },
  { id: 'amer', name: 'Amer Fort, Jaipur', r: 'Rajasthan', e: '🏰', p: 'Amer Fort Jaipur golden hour ramparts' },
  { id: 'pichola', name: 'Lake Pichola, Udaipur', r: 'Rajasthan', e: '🚤', p: 'Lake Pichola Udaipur city palace at dusk' },
  { id: 'gangaur', name: 'Gangaur Ghat, Udaipur', r: 'Rajasthan', e: '🪔', p: 'Gangaur Ghat Udaipur arches over the lake' },
  { id: 'jodhpur', name: 'Blue Lanes, Jodhpur', r: 'Rajasthan', e: '🔵', p: 'blue painted lanes of Jodhpur with Mehrangarh fort' },
  { id: 'jaisalmer', name: 'Dunes, Jaisalmer', r: 'Rajasthan', e: '🐪', p: 'Sam sand dunes Jaisalmer sunset camels' },
  { id: 'humayun', name: "Humayun's Tomb, Delhi", r: 'India', e: '🕌', p: "Humayun's Tomb Delhi red sandstone garden" },
  { id: 'bandstand', name: 'Bandstand, Mumbai', r: 'India', e: '🌊', p: 'Bandra Bandstand Mumbai sea promenade' },
  { id: 'taj', name: 'Taj Mahal, Agra', r: 'India', e: '🕍', p: 'Taj Mahal Agra at sunrise reflecting pool' },
  { id: 'kashmir', name: 'Kashmir', r: 'India', e: '🏔️', p: 'Dal Lake Kashmir shikara snow mountains' },
  { id: 'goa', name: 'Goa', r: 'India', e: '🏖️', p: 'Goa beach golden sunset palm trees' },
  { id: 'dubai', name: 'Dubai', r: 'International', e: '🏙️', p: 'Dubai skyline desert at golden hour' },
  { id: 'maldives', name: 'Maldives', r: 'International', e: '🏝️', p: 'Maldives overwater villa turquoise lagoon' },
  { id: 'bali', name: 'Bali', r: 'International', e: '🌴', p: 'Bali rice terraces and temple gate' },
  { id: 'cappadocia', name: 'Cappadocia, Turkey', r: 'International', e: '🎈', p: 'Cappadocia Turkey hot air balloons at sunrise' },
  { id: 'paris', name: 'Paris', r: 'International', e: '🗼', p: 'Paris Eiffel Tower Trocadero morning' },
  { id: 'swiss', name: 'Switzerland', r: 'International', e: '⛰️', p: 'Swiss Alps meadow lake and mountains' },
];

const REGIONS = ['All', 'Rajasthan', 'India', 'International'];

const LOOKS = [
  { id: 'haveli', en: 'In the Haveli', p: 'bride in red lehenga with gold jewellery and groom in ivory sherwani, haveli courtyard with carved arches' },
  { id: 'silk', en: 'Silk & Stone', p: 'couple in flowing silk saree and bandhgala, ancient sandstone architecture, soft light' },
  { id: 'cafe', en: 'Café Date', p: 'couple in casual chic outfits sharing chai at a cosy cafe, candid laughing' },
];

const pollinations = (prompt, seed, w = 768, h = 1024) =>
  `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${w}&height=${h}&seed=${seed}&nologo=true&model=flux`;

function Tile({ dest, look, seed }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const gen = () => {
    setErr(false);
    setLoading(true);
    setUrl(pollinations(`${look.p}, Indian couple pre-wedding photoshoot at ${dest.p}, cinematic, photorealistic, 85mm`, seed + dest.id.length));
  };
  return (
    <div className="overflow-hidden rounded-2xl border border-gold/50 bg-white shadow-sm">
      <div className="relative flex aspect-[3/4] items-center justify-center bg-gradient-to-br from-peacock to-sindoor">
        {!url && <span className="text-5xl">{dest.e}</span>}
        {url && !err && (
          <img
            src={url}
            alt={dest.name}
            className="absolute inset-0 h-full w-full object-cover"
            onLoad={() => setLoading(false)}
            onError={() => { setLoading(false); setErr(true); }}
          />
        )}
        {loading && <Loader2 className="absolute animate-spin text-gold" size={28} />}
        {err && <span className="absolute px-3 text-center text-xs text-white">Couldn’t reach the free AI service. Try again.</span>}
        <button onClick={gen} className="btn-gold absolute bottom-2 !px-3 !py-1 text-[11px]">
          <Sparkles size={12} /> {url ? 'Redo' : 'Generate'}
        </button>
      </div>
      <div className="p-2">
        <div className="font-display text-xs font-bold text-sindoor">{dest.name}</div>
        <div className="text-[10px] text-sindoor/60">{look.en}</div>
      </div>
    </div>
  );
}

function BeforeAfter() {
  const [selfie, setSelfie] = useState('');
  const [after, setAfter] = useState('');
  const [pos, setPos] = useState(50);
  const [loading, setLoading] = useState(false);
  const [look, setLook] = useState(LOOKS[0]);
  const [dest, setDest] = useState(DESTS[2]);

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (f) { setSelfie(URL.createObjectURL(f)); setAfter(''); }
  };
  const gen = () => {
    setLoading(true);
    setAfter(pollinations(`${look.p}, portrait at ${dest.p}, cinematic wedding portrait, photorealistic`, Math.floor(Math.random() * 99999)));
  };

  return (
    <div className="card space-y-3">
      <div>
        <h3 className="font-display text-lg font-bold text-sindoor">Selfie → Portrait</h3>
        <p className="text-[11px] text-sindoor/60">
          Your selfie stays on your phone (never uploaded). The portrait is generated from the look + place text by the free Pollinations service, so it is a style preview, not your face.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <select className="field" value={look.id} onChange={(e) => setLook(LOOKS.find((l) => l.id === e.target.value))}>
          {LOOKS.map((l) => <option key={l.id} value={l.id}>{l.en}</option>)}
        </select>
        <select className="field" value={dest.id} onChange={(e) => setDest(DESTS.find((d) => d.id === e.target.value))}>
          {DESTS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>
      <div className="flex gap-2">
        <label className="btn-ghost flex-1 cursor-pointer"><Upload size={16} /> Selfie<input type="file" accept="image/*" className="hidden" onChange={onFile} /></label>
        <button className="btn-primary flex-1" onClick={gen}><Sparkles size={16} /> Generate</button>
      </div>
      {(selfie || after) && (
        <div className="relative mx-auto aspect-[3/4] w-full max-w-xs select-none overflow-hidden rounded-xl bg-black/10">
          {after ? (
            <img src={after} alt="After" className="absolute inset-0 h-full w-full object-cover" onLoad={() => setLoading(false)} onError={() => setLoading(false)} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-sindoor/60">Tap Generate for the “after”</div>
          )}
          {selfie && (
            <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
              <img src={selfie} alt="Before" className="h-full w-full object-cover" />
            </div>
          )}
          <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow" style={{ left: `${pos}%` }} />
          <input type="range" min="0" max="100" value={pos} onChange={(e) => setPos(+e.target.value)} className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0" aria-label="Before / after" />
          <span className="absolute left-2 top-2 rounded bg-black/50 px-1.5 text-[10px] text-white">Before</span>
          <span className="absolute right-2 top-2 rounded bg-black/50 px-1.5 text-[10px] text-white">After</span>
          {loading && <Loader2 className="absolute right-3 bottom-3 animate-spin text-gold" size={22} />}
        </div>
      )}
    </div>
  );
}

function Countdown() {
  const { s } = useApp();
  const n = useNames();
  const [tpl, setTpl] = useState(TEMPLATES[0]);
  const ref = useRef(null);
  const data = useMemo(
    () => ({
      bEn: n.bEn, gEn: n.gEn, bHi: n.bHi, gHi: n.gHi, bI: n.bI, gI: n.gI,
      days: n.days, date: s.date, bCity: n.bCity, gCity: n.gCity,
      dateStr: fmtDate(s.date, false), dateStrHi: fmtDate(s.date, true),
    }),
    [n.bEn, n.gEn, n.bHi, n.gHi, n.bI, n.gI, n.days, s.date, n.bCity, n.gCity]
  );

  useEffect(() => {
    if (ref.current) drawTemplate(ref.current, tpl, data);
  }, [tpl, data]);

  const dl = () => ref.current?.toBlob((b) => saveBlob(b, `countdown-${tpl.id}-${n.days}days.png`), 'image/png');

  return (
    <div className="card space-y-3">
      <div>
        <h3 className="font-display text-lg font-bold text-sindoor">{n.t('Countdown & Instagram templates', 'काउंटडाउन और इंस्टा टेम्पलेट')}</h3>
        <p className="text-[11px] text-sindoor/60">{n.t(`${n.days} days to the wedding on ${n.dateStr}. HD 1080×1920 PNG, made on your phone.`, `विवाह (${n.dateStr}) में ${n.days} दिन बाकी। HD 1080×1920 PNG।`)}</p>
      </div>
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        {TEMPLATES.map((t) => (
          <button key={t.id} onClick={() => setTpl(t)} className={`chip whitespace-nowrap ${tpl.id === t.id ? 'chip-on' : ''}`}>{t.en}</button>
        ))}
      </div>
      <canvas ref={ref} className="mx-auto w-full max-w-[260px] rounded-xl border border-gold/50 shadow" style={{ aspectRatio: '1080/1920' }} />
      <button className="btn-primary w-full" onClick={dl}><Download size={16} /> {n.t('Download HD PNG', 'HD PNG डाउनलोड')}</button>
    </div>
  );
}

export default function PhotoTab() {
  const n = useNames();
  const [region, setRegion] = useState('All');
  const [look, setLook] = useState(LOOKS[0]);
  const list = DESTS.filter((d) => region === 'All' || d.r === region);
  return (
    <div className="space-y-5">
      <div>
        <h2 className="flex items-center gap-2 font-display text-xl font-bold text-sindoor"><Camera size={20} /> {n.t('Pre-wedding photoshoot studio', 'प्री-वेडिंग फोटोशूट स्टूडियो')}</h2>
        <p className="text-xs text-sindoor/60">{n.t('15+ destinations × 3 looks. Images are generated on demand by the free Pollinations API.', '15+ जगहें × 3 लुक। चित्र ज़रूरत पर मुफ़्त Pollinations API से बनते हैं।')}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {LOOKS.map((l) => (
          <button key={l.id} onClick={() => setLook(l)} className={`chip ${look.id === l.id ? 'chip-on' : ''}`}>{l.en}</button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {REGIONS.map((r) => (
          <button key={r} onClick={() => setRegion(r)} className={`chip ${region === r ? 'chip-on' : ''}`}>{r}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {list.map((d, i) => <Tile key={d.id + look.id} dest={d} look={look} seed={101 + i} />)}
      </div>
      <BeforeAfter />
      <Countdown />
    </div>
  );
}
