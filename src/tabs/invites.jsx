import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp, useNames } from '../store.jsx';

// Deterministic pseudo-random so falling petals don't jump on re-render.
const rnd = (i, salt = 1) => {
  const x = Math.sin(i * 12.9898 * salt) * 43758.5453;
  return x - Math.floor(x);
};

function Falling({ emoji = '🌼', count = 18, on = true }) {
  const items = useMemo(() => Array.from({ length: count }, (_, i) => i), [count]);
  if (!on) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((i) => (
        <motion.span
          key={i}
          className="absolute text-xl"
          style={{ left: `${rnd(i) * 95}%`, top: -30 }}
          animate={{ y: 650, rotate: 360 * (rnd(i, 2) > 0.5 ? 1 : -1), opacity: [0, 1, 1, 0] }}
          transition={{ duration: 4 + rnd(i, 3) * 3, delay: rnd(i, 4) * 3, repeat: Infinity, ease: 'linear' }}
        >
          {emoji}
        </motion.span>
      ))}
    </div>
  );
}

// Shared "invitation text" block
function Text({ color = '#FAF6F0', accent = '#D4AF37', small }) {
  const n = useNames();
  return (
    <div className="text-center" style={{ color }}>
      <div className="font-display text-[10px] tracking-[.3em]" style={{ color: accent }}>
        {n.t('TOGETHER WITH THEIR FAMILIES', 'अपने परिवारों के साथ')}
      </div>
      <div className={`font-display font-bold leading-tight ${small ? 'text-2xl' : 'text-4xl'} mt-2`}>{n.b}</div>
      <div className="font-display text-xl" style={{ color: accent }}>&amp;</div>
      <div className={`font-display font-bold leading-tight ${small ? 'text-2xl' : 'text-4xl'}`}>{n.g}</div>
      <div className="mt-3 font-display text-sm opacity-90">{n.dateStr}</div>
      <div className="font-display text-[10px] tracking-widest opacity-70">{n.t('REQUEST THE HONOUR OF YOUR PRESENCE', 'आपकी गरिमामयी उपस्थिति की प्रार्थना')}</div>
    </div>
  );
}

const Hint = ({ children }) => (
  <motion.div
    className="pointer-events-none absolute bottom-4 left-0 right-0 text-center text-xs font-semibold text-white/90"
    animate={{ opacity: [0.4, 1, 0.4] }}
    transition={{ duration: 1.6, repeat: Infinity }}
  >
    {children}
  </motion.div>
);

/* 1 — JHAROKHA */
export function Jharokha() {
  const n = useNames();
  const [open, setOpen] = useState(false);
  const door = (side) => (
    <motion.div
      className="absolute top-0 bottom-0 w-1/2"
      style={{
        [side]: 0,
        transformOrigin: side === 'left' ? 'left center' : 'right center',
        background:
          'repeating-linear-gradient(90deg,#5b3a1e 0 6px,#6e4627 6px 12px)',
        borderLeft: side === 'right' ? '4px solid #D4AF37' : 'none',
        borderRight: side === 'left' ? '4px solid #D4AF37' : 'none',
      }}
      animate={{ rotateY: open ? (side === 'left' ? -105 : 105) : 0 }}
      transition={{ duration: 1.4, ease: 'easeInOut' }}
    >
      <div className="absolute inset-3 rounded-t-full border-2 border-gold/80" />
      <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-gold" />
    </motion.div>
  );
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ perspective: 900, background: 'radial-gradient(circle at 50% 75%,#a02a1a,#2b0707)' }} onClick={() => setOpen(true)}>
      <div className="absolute inset-0 flex items-center justify-center p-6"><Text /></div>
      {open && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-around">
          {[0, 1, 2, 3].map((i) => (
            <motion.span key={i} className="text-2xl" animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.2, 1] }} transition={{ duration: 1.2 + i * 0.2, repeat: Infinity }}>🪔</motion.span>
          ))}
        </div>
      )}
      <Falling emoji="🌼" on={open} />
      {door('left')}
      {door('right')}
      {!open && <Hint>{n.t('Tap the doors', 'दरवाज़े छुएँ')}</Hint>}
    </div>
  );
}

/* 2 — PICHWAI (press & hold) */
export function Pichwai() {
  const n = useNames();
  const [p, setP] = useState(0);
  const holding = useRef(false);
  useEffect(() => {
    const id = setInterval(() => {
      setP((v) => {
        const next = holding.current ? Math.min(1, v + 0.025) : v >= 1 ? 1 : Math.max(0, v - 0.04);
        return next;
      });
    }, 30);
    return () => clearInterval(id);
  }, []);
  const petals = 12;
  return (
    <div
      className="relative flex h-full w-full select-none items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(#0F4C5C,#07242c)', touchAction: 'none' }}
      onPointerDown={() => { holding.current = true; }}
      onPointerUp={() => { holding.current = false; }}
      onPointerLeave={() => { holding.current = false; }}
    >
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#D4AF37 1px,transparent 1px)', backgroundSize: '18px 18px' }} />
      <div className="relative h-64 w-64">
        {Array.from({ length: petals }).map((_, i) => {
          const ring = i % 2;
          const angle = (i / petals) * 360;
          return (
            <div key={i} className="absolute left-1/2 top-1/2" style={{ transform: `rotate(${angle}deg)` }}>
              <div
                style={{
                  width: 46, height: 100 - ring * 22, marginLeft: -23, transformOrigin: '50% 100%',
                  transform: `translateY(-100%) rotate(${(1 - p) * -70}deg) scaleY(${0.35 + p * 0.65})`,
                  background: ring ? 'linear-gradient(#f9a8d4,#ec4899)' : 'linear-gradient(#fbcfe8,#f472b6)',
                  borderRadius: '50% 50% 50% 50% / 80% 80% 20% 20%', opacity: 0.55 + p * 0.45,
                }}
              />
            </div>
          );
        })}
        <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_30px_#D4AF37]" />
      </div>
      <motion.div className="absolute inset-x-0 bottom-8 px-4" animate={{ opacity: p > 0.9 ? 1 : 0 }}>
        <Text small />
      </motion.div>
      {p < 0.9 && <Hint>{n.t('Press & hold the lotus', 'कमल को दबाए रखें')}</Hint>}
    </div>
  );
}

/* 3 — TEMPLE LAMP */
export function Temple() {
  const n = useNames();
  const [lit, setLit] = useState(0);
  const wicks = 5;
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(#2b1608,#120a04)' }} onClick={() => setLit((l) => Math.min(wicks, l + 1))}>
      <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 55%, rgba(245,158,11,${0.1 + lit * 0.08}), transparent 65%)` }} />
      <div className="relative -mt-24 flex h-40 items-end justify-center gap-5">
        {Array.from({ length: wicks }).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <motion.div
              animate={i < lit ? { scale: [1, 1.2, 1], opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="h-8 w-4 rounded-full bg-gradient-to-t from-marigold to-yellow-200 shadow-[0_0_18px_#F59E0B]"
            />
            <div className="h-6 w-1 bg-gold" />
          </div>
        ))}
      </div>
      <div className="absolute top-[56%] h-5 w-60 rounded-full bg-gradient-to-b from-yellow-500 to-yellow-800" />
      <div className="absolute top-[62%] h-16 w-6 bg-gradient-to-b from-yellow-700 to-yellow-900" />
      <div className="absolute top-[74%] h-4 w-28 rounded-t-3xl bg-yellow-800" />
      <motion.div className="absolute inset-x-4 top-8" animate={{ opacity: lit === wicks ? 1 : 0 }}>
        <Text small />
      </motion.div>
      {lit < wicks && <Hint>{n.t(`Tap to light the lamp (${lit}/${wicks})`, `दीप जलाने के लिए छुएँ (${lit}/${wicks})`)}</Hint>}
    </div>
  );
}

/* 4 — IVORY wax seal */
export function Ivory() {
  const n = useNames();
  const [step, setStep] = useState(0); // 0 sealed, 1 cracked, 2 open
  const go = () => {
    if (step === 0) { setStep(1); setTimeout(() => setStep(2), 700); }
  };
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#efe6d5]" onClick={go}>
      <div className="relative h-[300px] w-[250px]" style={{ perspective: 900 }}>
        <motion.div
          className="absolute inset-x-3 rounded-md bg-ivory p-4 shadow-lg"
          style={{ height: 270, top: 20 }}
          animate={{ y: step === 2 ? -190 : 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          <Text color="#7A1C1C" accent="#B8921F" small />
        </motion.div>
        <div className="absolute bottom-0 h-[190px] w-full rounded-b-md bg-[#f6ead3] shadow" style={{ clipPath: 'polygon(0 0,50% 55%,100% 0,100% 100%,0 100%)' }} />
        <motion.div
          className="absolute left-0 top-[70px] h-[130px] w-full origin-top rounded-t-md bg-[#fbf2de]"
          style={{ clipPath: 'polygon(0 0,100% 0,50% 100%)', transformStyle: 'preserve-3d' }}
          animate={{ rotateX: step === 2 ? 180 : 0, opacity: step === 2 ? 0.0 : 1 }}
          transition={{ duration: 0.8 }}
        />
        <AnimatePresence>
          {step < 2 && (
            <div className="absolute left-1/2 top-[150px] -translate-x-1/2">
              <motion.div animate={step === 1 ? { x: -14, rotate: -18 } : {}} className="absolute -left-6 flex h-12 w-6 items-center justify-center overflow-hidden rounded-l-full bg-sindoor shadow" exit={{ opacity: 0 }} />
              <motion.div animate={step === 1 ? { x: 14, rotate: 18 } : {}} className="absolute left-0 flex h-12 w-6 items-center justify-center overflow-hidden rounded-r-full bg-sindoor shadow" exit={{ opacity: 0 }} />
              <div className="pointer-events-none absolute -left-6 flex h-12 w-12 items-center justify-center font-display text-sm font-bold text-gold">
                {n.bI}&amp;{n.gI}
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
      {step === 0 && <div className="absolute bottom-5 w-full text-center text-xs font-semibold text-sindoor">{n.t('Tap the wax seal', 'मोहर को छुएँ')}</div>}
    </div>
  );
}

/* 5 — MEHFIL candles */
export function Mehfil() {
  const n = useNames();
  const [lit, setLit] = useState(0);
  const [running, setRunning] = useState(false);
  const total = 9;
  const start = () => {
    if (running) return;
    setRunning(true);
    for (let i = 1; i <= total; i++) setTimeout(() => setLit(i), i * 350);
  };
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: '#0b0716' }} onClick={start}>
      <div className="absolute inset-x-0 top-0 h-1/2" style={{ background: `radial-gradient(ellipse at 50% 0%, rgba(212,175,55,${lit / total * 0.5}), transparent 70%)` }} />
      <div className="absolute left-0 right-0 top-8 flex justify-center">
        <div className="h-40 w-52 rounded-t-full border-4 border-gold/70" style={{ background: 'linear-gradient(#3b1530,#12071a)' }} />
      </div>
      <div className="absolute inset-x-0 top-[200px] px-5" style={{ opacity: lit >= total ? 1 : 0.0, transition: 'opacity 1s' }}>
        <Text small />
      </div>
      <div className="absolute bottom-16 flex w-full items-end justify-around px-4">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <motion.div animate={i < lit ? { opacity: [0.8, 1, 0.8], scaleY: [1, 1.25, 1] } : { opacity: 0 }} transition={{ duration: 0.6, repeat: Infinity }} className="h-4 w-2 rounded-full bg-gradient-to-t from-marigold to-yellow-100 shadow-[0_0_14px_#F59E0B]" />
            <div className="h-10 w-2.5 bg-ivory" style={{ height: 24 + (i % 3) * 10 }} />
          </div>
        ))}
      </div>
      {!running && <Hint>{n.t('Tap the hall to light the candles', 'मोमबत्तियाँ जलाने के लिए छुएँ')}</Hint>}
    </div>
  );
}

/* 6 — AKHBAAR */
export function Akhbaar() {
  const n = useNames();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#cfc4ad]" style={{ perspective: 1000 }} onClick={() => setOpen(true)}>
      <motion.div
        className="w-[260px] origin-center bg-[#f3ecd9] p-3 text-[#2b2b2b] shadow-2xl"
        initial={{ scaleY: 0.18, scaleX: 0.5, rotateX: 60 }}
        animate={open ? { scaleY: 1, scaleX: 1, rotateX: 0 } : { scaleY: 0.18, scaleX: 0.5, rotateX: 60 }}
        transition={{ duration: 1.1, type: 'spring', damping: 14 }}
      >
        <div className="border-b-4 border-double border-black text-center font-display text-3xl font-black">{n.t('The Shaadi Times', 'शादी टाइम्स')}</div>
        <div className="flex justify-between border-b border-black py-0.5 text-[8px] font-semibold tracking-wider">
          <span>{n.dateStr}</span><span>{n.t('EXTRA! EXTRA!', 'ताज़ा ख़बर!')}</span><span>₹ 0.00</span>
        </div>
        <h2 className="mt-2 text-center font-display text-xl font-black leading-tight">
          {n.b.toUpperCase()} {n.t('SAYS YES TO', 'ने कहा हाँ')} {n.g.toUpperCase()}
        </h2>
        <p className="mt-1 text-center font-display text-[10px] italic">{n.t(`${n.bCity} meets ${n.gCity}: a love story`, `${n.bCity} मिला ${n.gCity} से: एक प्रेम कथा`)}</p>
        <div className="mt-2 grid grid-cols-2 gap-2 text-[8px] leading-tight">
          <div className="h-20 bg-[#d9cfb8]" style={{ backgroundImage: 'repeating-linear-gradient(0deg,#bdb299 0 2px,transparent 2px 5px)' }} />
          <p>{n.t('Sources close to both families confirm that wedding bells will ring. Mithai supplies are reportedly dangerously low.', 'दोनों परिवारों के सूत्रों के अनुसार शहनाइयाँ बजने वाली हैं। मिठाई का भंडार ख़तरनाक रूप से कम बताया जा रहा है।')}</p>
        </div>
        <p className="mt-2 text-center text-[9px] font-semibold">{n.t('Details inside — be there!', 'पूरा विवरण अंदर — पधारिएगा!')}</p>
      </motion.div>
      {!open && <Hint><span className="text-sindoor">{n.t('Tap to unfold the news', 'अख़बार खोलने के लिए छुएँ')}</span></Hint>}
    </div>
  );
}

/* 7 — GENDA marigold curtains */
export function Genda() {
  const n = useNames();
  const { fnsOn } = useFns();
  const [open, setOpen] = useState(false);
  const curtain = (side) => (
    <motion.div
      className="absolute top-0 bottom-0 w-1/2"
      style={{ [side]: 0, background: 'repeating-linear-gradient(90deg,#f59e0b 0 10px,#fbbf24 10px 18px,#ea580c 18px 24px)' }}
      animate={{ x: open ? (side === 'left' ? '-95%' : '95%') : 0 }}
      transition={{ duration: 1.3, ease: 'easeInOut' }}
    >
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="absolute text-lg" style={{ top: `${i * 10}%`, [side === 'left' ? 'right' : 'left']: 2 }}>🌼</div>
      ))}
    </motion.div>
  );
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#fff7e0]" onClick={() => setOpen(true)}>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
        <Text color="#7A1C1C" accent="#B45309" small />
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {fnsOn.filter((f) => ['haldi', 'mehndi'].includes(f.id)).map((f) => (
            <span key={f.id} className="rounded-full bg-marigold px-3 py-1 text-xs font-bold text-white">{n.hi ? f.hi : f.en} · {f.time}</span>
          ))}
        </div>
      </div>
      {curtain('left')}
      {curtain('right')}
      {!open && <Hint>{n.t('Tap the curtains to part them', 'पर्दा हटाने के लिए छुएँ')}</Hint>}
    </div>
  );
}

function useFns() {
  // live list of the couple's enabled functions, straight from the shared store
  const { s } = useApp();
  return { fnsOn: s.fns.filter((f) => f.on) };
}

/* 8 — HUM DONO scrapbook */
export function HumDono() {
  const n = useNames();
  const stickers = ['☕', '🎬', '📚', '✈️', '🏏', '🎨', '🍕', '🎧'];
  const [shift, setShift] = useState(0);
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden" style={{ background: '#e8dcc4', backgroundImage: 'radial-gradient(#c9b88f 1px,transparent 1px)', backgroundSize: '14px 14px' }} onClick={() => setShift((s) => s + 1)}>
      <motion.div className="relative w-[200px] bg-white p-3 pb-10 shadow-xl" animate={{ rotate: -4 + (shift % 2) * 8 }} transition={{ type: 'spring' }}>
        <div className="flex h-44 items-center justify-center bg-gradient-to-br from-peacock to-sindoor font-display text-4xl font-black text-gold">
          {n.bI}<span className="px-1 text-xl text-ivory">♥</span>{n.gI}
        </div>
        <div className="absolute inset-x-0 bottom-2 text-center font-display text-sm italic text-sindoor">{n.b} &amp; {n.g}</div>
        <div className="absolute -top-3 left-1/2 h-5 w-16 -translate-x-1/2 rotate-2 bg-marigold/70" />
      </motion.div>
      {stickers.map((st, i) => {
        const pos = (i + shift) % stickers.length;
        return (
          <motion.span
            key={i}
            className="absolute text-3xl"
            animate={{ left: `${10 + rnd(pos, 5) * 75}%`, top: `${6 + rnd(pos, 7) * 82}%`, rotate: rnd(pos, 9) * 60 - 30 }}
            transition={{ type: 'spring', damping: 12 }}
          >
            {st}
          </motion.span>
        );
      })}
      <div className="absolute bottom-3 w-full text-center font-display text-[11px] text-sindoor">{n.dateStr} · {n.t('tap to shuffle', 'हिलाने के लिए छुएँ')}</div>
    </div>
  );
}

/* 9 — PARDA velvet curtains */
export function Parda() {
  const n = useNames();
  const [open, setOpen] = useState(false);
  const cur = (side) => (
    <motion.div
      className="absolute top-0 bottom-0 w-[52%]"
      style={{ [side]: 0, background: 'repeating-linear-gradient(90deg,#5c0f0f 0 14px,#8b1a1a 14px 28px,#5c0f0f 28px 40px)', boxShadow: 'inset 0 -40px 60px rgba(0,0,0,.5)' }}
      animate={{ x: open ? (side === 'left' ? '-96%' : '96%') : 0, skewY: open ? (side === 'left' ? -4 : 4) : 0 }}
      transition={{ duration: 1.6, ease: 'easeInOut' }}
    />
  );
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: 'radial-gradient(circle at 50% 30%,#3b2a10,#0c0803)' }} onClick={() => setOpen(true)}>
      <div className="absolute inset-x-0 top-2 text-center text-4xl">
        <motion.span animate={{ opacity: open ? [0.7, 1, 0.7] : 0.3 }} transition={{ duration: 2, repeat: Infinity }}>🕯️</motion.span>
        <div className="-mt-3 text-xs text-gold">✦ ✦ ✦ ✦ ✦</div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center px-6 pt-10"><Text /></div>
      {cur('left')}
      {cur('right')}
      <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-[#3a0707] to-transparent" />
      {!open && <Hint>{n.t('Tap to raise the curtain', 'पर्दा उठाने के लिए छुएँ')}</Hint>}
    </div>
  );
}

/* 10 — SAFAR plane */
export function Safar() {
  const n = useNames();
  const [go, setGo] = useState(0);
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: 'linear-gradient(#f7e3c1,#f3c98a 60%,#e8a76a)' }} onClick={() => setGo((g) => g + 1)}>
      <svg viewBox="0 0 300 560" className="absolute inset-0 h-full w-full">
        <path d="M45 430 C 60 250, 240 330, 255 150" fill="none" stroke="#7A1C1C" strokeWidth="2" strokeDasharray="6 6" />
        <circle cx="45" cy="430" r="9" fill="#0F4C5C" />
        <circle cx="255" cy="150" r="9" fill="#7A1C1C" />
        <text x="45" y="456" textAnchor="middle" fontSize="13" fill="#0F4C5C" fontFamily="Playfair Display, Noto Serif Devanagari, serif" fontWeight="700">{n.bCity}</text>
        <text x="255" y="128" textAnchor="middle" fontSize="13" fill="#7A1C1C" fontFamily="Playfair Display, Noto Serif Devanagari, serif" fontWeight="700">{n.gCity}</text>
      </svg>
      <motion.div
        key={go}
        className="absolute left-0 top-0 text-3xl"
        initial={{ x: 30, y: 400, rotate: -40 }}
        animate={{ x: [30, 110, 180, 240], y: [400, 330, 250, 125], rotate: [-40, -10, -50, -55] }}
        transition={{ duration: 3.2, ease: 'easeInOut' }}
      >✈️</motion.div>
      <div className="absolute inset-x-6 bottom-20 rounded-xl bg-white/70 p-3">
        <Text color="#7A1C1C" accent="#B45309" small />
      </div>
      <div className="absolute top-3 w-full text-center font-display text-[10px] font-bold tracking-[.3em] text-sindoor">{n.t('TWO CITIES · ONE JOURNEY', 'दो शहर · एक सफ़र')}</div>
      <div className="absolute bottom-3 w-full text-center text-[11px] font-semibold text-sindoor/80">{n.t('tap to fly again', 'फिर उड़ाने के लिए छुएँ')}</div>
    </div>
  );
}

export const INVITES = [
  { id: 'jharokha', en: 'Jharokha', hi: 'झरोखा', hint: 'Haveli doors swing open', Comp: Jharokha, g: 'from-[#a02a1a] to-[#2b0707]', e: '🏯' },
  { id: 'pichwai', en: 'Pichwai', hi: 'पिछवाई', hint: 'Press & hold the lotus', Comp: Pichwai, g: 'from-[#0F4C5C] to-[#07242c]', e: '🪷' },
  { id: 'temple', en: 'Temple', hi: 'मंदिर', hint: 'Light the brass lamp', Comp: Temple, g: 'from-[#4a2a10] to-[#120a04]', e: '🛕' },
  { id: 'ivory', en: 'Ivory', hi: 'आइवरी', hint: 'Crack the wax seal', Comp: Ivory, g: 'from-[#f6ead3] to-[#d8c7a4]', e: '💌' },
  { id: 'mehfil', en: 'Mehfil', hi: 'महफ़िल', hint: 'Light the sangeet hall', Comp: Mehfil, g: 'from-[#3b1530] to-[#0b0716]', e: '🕯️' },
  { id: 'akhbaar', en: 'Akhbaar', hi: 'अख़बार', hint: 'The Shaadi Times unfolds', Comp: Akhbaar, g: 'from-[#e9e1cd] to-[#bfb394]', e: '📰' },
  { id: 'genda', en: 'Genda', hi: 'गेंदा', hint: 'Part the marigold curtains', Comp: Genda, g: 'from-[#fbbf24] to-[#ea580c]', e: '🌼' },
  { id: 'humdono', en: 'Hum Dono', hi: 'हम दोनों', hint: 'Scrapbook & stickers', Comp: HumDono, g: 'from-[#e8dcc4] to-[#c9b88f]', e: '📸' },
  { id: 'parda', en: 'Parda', hi: 'पर्दा', hint: 'Velvet curtains rise', Comp: Parda, g: 'from-[#8b1a1a] to-[#3a0707]', e: '🎭' },
  { id: 'safar', en: 'Safar', hi: 'सफ़र', hint: 'Plane between two cities', Comp: Safar, g: 'from-[#f7e3c1] to-[#e8a76a]', e: '✈️' },
];
