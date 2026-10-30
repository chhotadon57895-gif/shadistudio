import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useApp, useNames, fmtDate } from '../store.jsx';

// Arch cut-outs (evenodd so you can see through to the next layer)
const SHAPES = {
  mughal: 'M0 0H300V400H0Z M45 400V170Q45 120 150 40Q255 120 255 170V400Z',
  round: 'M0 0H300V400H0Z M40 400V150Q40 50 150 50Q260 50 260 150V400Z',
  scallop: 'M0 0H300V400H0Z M40 400V140Q40 100 70 100Q90 70 120 80Q150 50 180 80Q210 70 230 100Q260 100 260 140V400Z',
  rect: 'M0 0H300V400H0Z M50 400V70H250V400Z',
};

// Inner height of the phone frame (560 outer minus 2 x 8px bezel)
const PHONE_H = 544;

export const WALKS = [
  { id: 'haveli', en: 'The Haveli Walk', hi: 'हवेली वॉक', sub: 'Courtyard to courtyard', shape: 'scallop', colors: ['#7A1C1C', '#9a3412', '#b45309', '#D4AF37'], sky: '#2b0707', e: '🏯' },
  { id: 'jheel', en: 'Jheel Mahal, Udaipur', hi: 'झील महल, उदयपुर', sub: 'Boat to palace', shape: 'mughal', colors: ['#0F4C5C', '#115e73', '#1e7f93', '#D4AF37'], sky: '#07242c', e: '🚤' },
  { id: 'mandapam', en: 'Mandapam at Dawn', hi: 'भोर का मंडपम', sub: 'The kolam corridor', shape: 'rect', colors: ['#78350f', '#b45309', '#F59E0B', '#fde68a'], sky: '#2a1405', e: '🪔' },
  { id: 'gulabi', en: 'Gulabi Gali, Jaipur', hi: 'गुलाबी गली, जयपुर', sub: 'The pink lane', shape: 'round', colors: ['#be185d', '#db2777', '#ec4899', '#f9a8d4'], sky: '#3b0a22', e: '🌸' },
  { id: 'saatrang', en: 'Saat Rang Mahal', hi: 'सात रंग महल', sub: 'A palace that shifts colour', shape: 'mughal', colors: null, sky: '#120a2a', e: '🌈' },
];

function Layer({ i, total, progress, walk, label, sub }) {
  const scale = useTransform(progress, (p) => {
    const d = i - p * (total - 1);
    return d >= 0 ? 1 / (1 + d * 0.75) : 1 + -d * 3.5;
  });
  const opacity = useTransform(progress, (p) => {
    const d = i - p * (total - 1);
    if (d < -0.9) return 0;
    if (d > 4) return 0;
    return d > 0 ? Math.max(0.15, 1 - d * 0.18) : 1 + d * 1.1;
  });
  const labelOp = useTransform(progress, (p) => {
    const d = Math.abs(i - p * (total - 1));
    return Math.max(0, 1 - d * 1.7);
  });
  const fill = useTransform(progress, (p) => {
    if (walk.colors) return walk.colors[i % walk.colors.length];
    return `hsl(${(i * 55 + p * 360) % 360} 70% 38%)`;
  });
  return (
    <motion.div className="absolute inset-0 flex items-center justify-center" style={{ scale, opacity, zIndex: 100 - i }}>
      <svg viewBox="0 0 300 400" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <motion.path d={SHAPES[walk.shape]} fillRule="evenodd" style={{ fill }} stroke="#D4AF37" strokeWidth="3" />
        <path d="M0 400H300V380H0Z" fill="rgba(0,0,0,.25)" />
        {[70, 150, 230].map((x) => (
          <circle key={x} cx={x} cy="30" r="4" fill="#D4AF37" opacity=".8" />
        ))}
      </svg>
      <motion.div className="absolute inset-x-6 top-[38%] text-center text-white" style={{ opacity: labelOp }}>
        <div className="font-display text-3xl font-black drop-shadow-[0_2px_8px_rgba(0,0,0,.7)]">{label}</div>
        <div className="mt-1 font-display text-sm tracking-widest text-gold drop-shadow">{sub}</div>
      </motion.div>
    </motion.div>
  );
}

export function WalkExperience({ walk }) {
  const n = useNames();
  const { s } = useApp();
  const scroller = useRef(null);
  const { scrollYProgress } = useScroll({ container: scroller });
  const fns = s.fns.filter((f) => f.on);
  const rooms = [
    { label: `${n.b} & ${n.g}`, sub: n.t('Scroll to walk in ↓', 'अंदर चलने के लिए स्क्रॉल करें ↓') },
    ...fns.map((f) => ({ label: n.hi ? f.hi : f.en, sub: `${fmtDate(f.date, n.hi)} · ${f.time}` })),
    { label: n.t('Welcome!', 'स्वागतम्!'), sub: n.t('We can’t wait to celebrate with you', 'आपके साथ जश्न मनाने का इंतज़ार है') },
  ];
  const total = rooms.length;
  return (
    <div ref={scroller} className="no-scrollbar h-full w-full overflow-y-scroll" style={{ background: walk.sky }}>
      <div style={{ height: total * PHONE_H }}>
        <div className="sticky top-0 w-full overflow-hidden" style={{ height: PHONE_H }}>
          <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 55%, ${walk.colors ? walk.colors[3] : '#fff'}55, ${walk.sky} 70%)` }} />
          {rooms.map((r, i) => (
            <Layer key={i} i={i} total={total} progress={scrollYProgress} walk={walk} label={r.label} sub={r.sub} />
          ))}
        </div>
      </div>
    </div>
  );
}
