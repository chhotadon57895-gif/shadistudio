import React, { forwardRef, useId } from 'react';

const F = 'Playfair Display, Noto Serif Devanagari, serif';
const FD = 'Noto Serif Devanagari, Playfair Display, serif';

export const MODES = {
  full: { label: 'Full colour', bg: '#FAF6F0', ink: '#7A1C1C', acc: '#D4AF37', acc2: '#0F4C5C', txt: '#7A1C1C' },
  wax: { label: 'Wax seal', bg: 'wax', ink: '#3d0808', acc: '#c9605a', acc2: '#3d0808', txt: '#f2cfc8' },
  foil: { label: '1-colour gold foil', bg: 'none', ink: '#D4AF37', acc: '#D4AF37', acc2: '#D4AF37', txt: '#D4AF37' },
  dark: { label: 'Dark mode', bg: '#1a0f0f', ink: '#D4AF37', acc: '#D4AF37', acc2: '#F59E0B', txt: '#FAF6F0' },
};

export const STYLES = [
  { id: 'seal', en: 'Royal Seal' },
  { id: 'jharokha', en: 'Jharokha Arch' },
  { id: 'entwined', en: 'Entwined Initials' },
  { id: 'wreath', en: 'Floral Wreath' },
  { id: 'ring', en: 'Monogram Ring' },
  { id: 'oval', en: 'Oval Crest' },
  { id: 'story', en: 'Story Map' },
];

export const HEADERS = [
  { id: 'none', en: 'No header' },
  { id: 'vivah', en: 'Shubh Vivah', mark: '॥ शुभ विवाह ॥' },
  { id: 'ganesh', en: 'Shri Ganesh', mark: '॥ श्री गणेशाय नमः ॥' },
];

/* ---------- little illustrations ---------- */
const Peacock = ({ x, y, flip, p }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
    {[-50, -25, 0, 25, 50].map((a) => (
      <g key={a} transform={`rotate(${a} 0 10)`}>
        <line x1="0" y1="10" x2="0" y2="-34" stroke={p.acc2} strokeWidth="1.5" />
        <ellipse cx="0" cy="-38" rx="5" ry="7" fill={p.acc} stroke={p.acc2} strokeWidth="1" />
        <circle cx="0" cy="-38" r="2" fill={p.acc2} />
      </g>
    ))}
    <ellipse cx="0" cy="14" rx="9" ry="15" fill={p.acc2} />
    <path d="M0 2 Q-3 -14 3 -22" stroke={p.acc2} strokeWidth="5" fill="none" strokeLinecap="round" />
    <circle cx="4" cy="-24" r="5" fill={p.acc2} />
    <path d="M7 -25 L13 -23 L7 -22Z" fill={p.acc} />
  </g>
);

const Elephant = ({ x, y, flip, p }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
    <ellipse cx="0" cy="0" rx="24" ry="15" fill={p.ink} />
    <circle cx="-22" cy="-5" r="11" fill={p.ink} />
    <path d="M-30 0 Q-38 14 -32 24" stroke={p.ink} strokeWidth="6" fill="none" strokeLinecap="round" />
    <ellipse cx="-17" cy="-3" rx="6" ry="9" fill={p.acc} opacity=".85" />
    <path d="M-28 4 Q-33 8 -31 12" stroke={p.acc} strokeWidth="2.5" fill="none" />
    {[-12, -2, 10, 18].map((lx) => (
      <rect key={lx} x={lx - 3} y="8" width="6" height="15" rx="2" fill={p.ink} />
    ))}
    <path d="M-8 -14 Q0 -22 10 -14" fill={p.acc} stroke={p.acc2} />
  </g>
);

const Lotus = ({ x, y, s = 1, p }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-70, -35, 0, 35, 70].map((a) => (
      <ellipse key={a} cx="0" cy="-26" rx="11" ry="28" fill={a % 2 ? p.acc : p.ink} opacity=".88" stroke={p.bg === 'none' ? p.acc : p.acc2} strokeWidth="1" transform={`rotate(${a})`} />
    ))}
    <circle r="6" fill={p.acc} />
  </g>
);

const Parakeet = ({ x, y, p }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M0 0 Q18 -4 24 14 Q10 30 -22 38 Q-4 20 0 0Z" fill={p.acc2} />
    <path d="M-22 38 L-36 58" stroke={p.acc} strokeWidth="3" strokeLinecap="round" />
    <circle cx="2" cy="-4" r="9" fill={p.acc2} />
    <path d="M8 -6 Q18 -4 14 4 Q10 0 8 -2Z" fill={p.acc} />
    <circle cx="4" cy="-6" r="1.8" fill={p.bg === 'dark' ? '#000' : '#fff'} />
  </g>
);

const Dots = ({ cx, cy, r, n, size = 2.5, fill }) =>
  Array.from({ length: n }).map((_, i) => {
    const a = (i / n) * Math.PI * 2;
    return <circle key={i} cx={cx + Math.cos(a) * r} cy={cy + Math.sin(a) * r} r={size} fill={fill} />;
  });

/* ---------- the seven styles ---------- */
function Seal({ p, n, id }) {
  return (
    <g>
      <circle cx="200" cy="235" r="152" fill="none" stroke={p.acc} strokeWidth="4" />
      <circle cx="200" cy="235" r="142" fill="none" stroke={p.ink} strokeWidth="1.5" />
      <circle cx="200" cy="235" r="102" fill="none" stroke={p.ink} strokeWidth="1.5" />
      <defs><path id={`${id}top`} d="M 78 235 a 122 122 0 1 1 244 0 a 122 122 0 1 1 -244 0" /></defs>
      <text fontFamily={F} fontSize="17" fontWeight="700" letterSpacing="4" fill={p.txt}>
        <textPath href={`#${id}top`} startOffset="25%" textAnchor="middle">{`${n.bEn.toUpperCase()}  ✦  ${n.gEn.toUpperCase()}  ✦`}</textPath>
      </text>
      <Dots cx={200} cy={235} r={122} n={0} fill={p.acc} />
      <text x="150" y="250" textAnchor="middle" fontFamily={F} fontSize="76" fontWeight="900" fill={p.ink}>{n.bI}</text>
      <text x="250" y="250" textAnchor="middle" fontFamily={F} fontSize="76" fontWeight="900" fill={p.ink}>{n.gI}</text>
      <text x="200" y="232" textAnchor="middle" fontFamily={F} fontSize="30" fill={p.acc}>♥</text>
      <text x="150" y="292" textAnchor="middle" fontFamily={FD} fontSize="32" fontWeight="700" fill={p.acc2}>{n.bH}</text>
      <text x="250" y="292" textAnchor="middle" fontFamily={FD} fontSize="32" fontWeight="700" fill={p.acc2}>{n.gH}</text>
      <text x="200" y="322" textAnchor="middle" fontFamily={F} fontSize="13" letterSpacing="3" fill={p.txt}>{n.dateStr.toUpperCase()}</text>
    </g>
  );
}

function JharokhaArch({ p, n }) {
  return (
    <g>
      <path d="M85 420 V205 Q85 85 200 55 Q315 85 315 205 V420 Z" fill="none" stroke={p.acc} strokeWidth="6" />
      <path d="M100 420 V208 Q100 100 200 74 Q300 100 300 208 V420 Z" fill="none" stroke={p.ink} strokeWidth="2" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const a = Math.PI + (i / 6) * Math.PI;
        return <circle key={i} cx={200 + Math.cos(a) * 112} cy={205 + Math.sin(a) * 140} r="5" fill={p.acc} />;
      })}
      <path d="M190 52 Q200 30 210 52Z" fill={p.acc} />
      <Peacock x={128} y={235} p={p} />
      <Peacock x={272} y={235} flip p={p} />
      <Elephant x={140} y={395} p={p} />
      <Elephant x={260} y={395} flip p={p} />
      <text x="200" y="165" textAnchor="middle" fontFamily={F} fontSize="52" fontWeight="900" fill={p.ink}>{n.bI}<tspan fill={p.acc} fontSize="26"> ♥ </tspan>{n.gI}</text>
      <text x="200" y="205" textAnchor="middle" fontFamily={FD} fontSize="28" fontWeight="700" fill={p.acc2}>{n.bH} · {n.gH}</text>
      <text x="200" y="260" textAnchor="middle" fontFamily={F} fontSize="22" fontWeight="700" fill={p.txt}>{n.bEn}</text>
      <text x="200" y="283" textAnchor="middle" fontFamily={F} fontSize="16" fill={p.acc}>&amp;</text>
      <text x="200" y="308" textAnchor="middle" fontFamily={F} fontSize="22" fontWeight="700" fill={p.txt}>{n.gEn}</text>
      <text x="200" y="340" textAnchor="middle" fontFamily={F} fontSize="11" letterSpacing="3" fill={p.txt}>{n.dateStr.toUpperCase()}</text>
    </g>
  );
}

function Entwined({ p, n }) {
  return (
    <g>
      <Parakeet x={278} y={110} p={p} />
      <text x="158" y="250" textAnchor="middle" fontFamily={F} fontSize="170" fontWeight="900" fill={p.ink} opacity=".92">{n.bI}</text>
      <text x="246" y="250" textAnchor="middle" fontFamily={F} fontSize="170" fontWeight="900" fill={p.acc2} opacity=".82">{n.gI}</text>
      <text x="172" y="252" textAnchor="middle" fontFamily={FD} fontSize="110" fontWeight="700" fill={p.acc} opacity=".9">{n.bH}</text>
      <text x="232" y="252" textAnchor="middle" fontFamily={FD} fontSize="110" fontWeight="700" fill={p.acc} opacity=".75">{n.gH}</text>
      <Lotus x={200} y={338} s={0.9} p={p} />
      <text x="200" y="392" textAnchor="middle" fontFamily={F} fontSize="19" fontWeight="700" fill={p.txt}>{n.bEn} &amp; {n.gEn}</text>
      <text x="200" y="412" textAnchor="middle" fontFamily={FD} fontSize="15" fill={p.txt}>{n.bHi} · {n.gHi}</text>
    </g>
  );
}

function Wreath({ p, n }) {
  const count = 18;
  return (
    <g>
      {Array.from({ length: count }).map((_, i) => {
        const a = (i / count) * Math.PI * 2;
        const x = 200 + Math.cos(a) * 138;
        const y = 235 + Math.sin(a) * 138;
        const deg = (a * 180) / Math.PI;
        return (
          <g key={i}>
            <ellipse cx={x} cy={y} rx="14" ry="5" fill={p.acc2} opacity=".7" transform={`rotate(${deg + 90} ${x} ${y})`} />
            {i % 2 === 0 && (
              <g>
                {[0, 72, 144, 216, 288].map((r) => (
                  <circle key={r} cx={x + Math.cos((r * Math.PI) / 180) * 7} cy={y + Math.sin((r * Math.PI) / 180) * 7} r="5.5" fill={p.acc} />
                ))}
                <circle cx={x} cy={y} r="4" fill={p.ink} />
              </g>
            )}
          </g>
        );
      })}
      <circle cx="200" cy="235" r="108" fill="none" stroke={p.ink} strokeWidth="1.5" />
      <text x="200" y="215" textAnchor="middle" fontFamily={F} fontSize="62" fontWeight="900" fill={p.ink}>{n.bI}<tspan fill={p.acc} fontSize="28"> &amp; </tspan>{n.gI}</text>
      <text x="200" y="252" textAnchor="middle" fontFamily={FD} fontSize="30" fontWeight="700" fill={p.acc2}>{n.bH} · {n.gH}</text>
      <text x="200" y="286" textAnchor="middle" fontFamily={F} fontSize="15" fontWeight="700" fill={p.txt}>{n.bEn} &amp; {n.gEn}</text>
      <text x="200" y="306" textAnchor="middle" fontFamily={F} fontSize="10" letterSpacing="3" fill={p.txt}>{n.dateStr.toUpperCase()}</text>
    </g>
  );
}

function Ring({ p, n, id }) {
  return (
    <g>
      <circle cx="200" cy="235" r="150" fill="none" stroke={p.acc} strokeWidth="5" />
      <circle cx="200" cy="235" r="90" fill="none" stroke={p.ink} strokeWidth="1.5" />
      <defs>
        <path id={`${id}t`} d="M 80 235 a 120 120 0 0 1 240 0" />
        <path id={`${id}b`} d="M 70 235 a 130 130 0 0 0 260 0" />
      </defs>
      <text fontFamily={F} fontSize="20" fontWeight="700" letterSpacing="5" fill={p.txt}>
        <textPath href={`#${id}t`} startOffset="50%" textAnchor="middle">{`${n.bEn.toUpperCase()} & ${n.gEn.toUpperCase()}`}</textPath>
      </text>
      <text fontFamily={FD} fontSize="18" fontWeight="600" letterSpacing="2" fill={p.acc2}>
        <textPath href={`#${id}b`} startOffset="50%" textAnchor="middle">{`${n.bHi} · ${n.gHi}`}</textPath>
      </text>
      <text x="165" y="255" textAnchor="middle" fontFamily={F} fontSize="64" fontWeight="900" fill={p.ink}>{n.bI}</text>
      <text x="238" y="255" textAnchor="middle" fontFamily={F} fontSize="64" fontWeight="900" fill={p.acc2}>{n.gI}</text>
      <text x="200" y="285" textAnchor="middle" fontFamily={FD} fontSize="26" fontWeight="700" fill={p.acc}>{n.bH}{n.gH}</text>
      <text x="200" y="222" textAnchor="middle" fontFamily={F} fontSize="16" fill={p.acc}>✦</text>
      <text x="200" y="402" textAnchor="middle" fontFamily={F} fontSize="11" letterSpacing="3" fill={p.txt}>{n.dateStr.toUpperCase()}</text>
    </g>
  );
}

function Oval({ p, n }) {
  return (
    <g>
      <path d="M170 76 L178 56 L190 70 L200 48 L210 70 L222 56 L230 76Z" fill={p.acc} />
      <ellipse cx="200" cy="245" rx="128" ry="170" fill="none" stroke={p.acc} strokeWidth="5" />
      <ellipse cx="200" cy="245" rx="116" ry="158" fill="none" stroke={p.ink} strokeWidth="1.5" />
      <Dots cx={200} cy={245} r={0} n={0} fill={p.acc} />
      <text x="200" y="170" textAnchor="middle" fontFamily={F} fontSize="56" fontWeight="900" fill={p.ink}>{n.bI}<tspan fill={p.acc} fontSize="26"> ♥ </tspan>{n.gI}</text>
      <text x="200" y="208" textAnchor="middle" fontFamily={FD} fontSize="28" fontWeight="700" fill={p.acc2}>{n.bH} · {n.gH}</text>
      <path d="M130 228 H270" stroke={p.acc} strokeWidth="1.5" />
      <text x="200" y="262" textAnchor="middle" fontFamily={F} fontSize="22" fontWeight="700" fill={p.txt}>{n.bEn}</text>
      <text x="200" y="284" textAnchor="middle" fontFamily={F} fontSize="15" fill={p.acc}>&amp;</text>
      <text x="200" y="310" textAnchor="middle" fontFamily={F} fontSize="22" fontWeight="700" fill={p.txt}>{n.gEn}</text>
      <path d="M95 345 Q200 375 305 345 L305 372 Q200 402 95 372Z" fill={p.ink} />
      <text x="200" y="372" textAnchor="middle" fontFamily={F} fontSize="11" letterSpacing="3" fill={p.bg === 'none' ? '#000' : p.bg === 'wax' ? '#f2cfc8' : p.bg} >{n.dateStr.toUpperCase()}</text>
    </g>
  );
}

function Story({ p, n }) {
  return (
    <g>
      <rect x="35" y="55" width="330" height="360" rx="26" fill="none" stroke={p.acc} strokeWidth="4" />
      <circle cx="285" cy="150" r="26" fill={p.acc} opacity=".9" />
      <path d="M35 330 L110 210 L160 280 L215 190 L290 300 L330 250 L365 330 V389 Q365 415 339 415 H61 Q35 415 35 389Z" fill={p.acc2} opacity=".9" />
      <path d="M62 300 C 120 190, 260 260, 335 175" fill="none" stroke={p.bg === 'dark' ? '#fff' : p.acc} strokeWidth="2.5" strokeDasharray="6 6" />
      <text x="320" y="170" fontSize="20" fontFamily={F} fill={p.ink} transform="rotate(-40 320 170)">✈</text>
      <text x="62" y="322" textAnchor="middle" fontFamily={F} fontSize="10" fontWeight="700" fill={p.txt}>{n.bCity}</text>
      <text x="335" y="195" textAnchor="middle" fontFamily={F} fontSize="10" fontWeight="700" fill={p.txt}>{n.gCity}</text>
      <text x="200" y="118" textAnchor="middle" fontFamily={F} fontSize="30" fontWeight="900" fill={p.ink}>{n.bEn}</text>
      <text x="200" y="146" textAnchor="middle" fontFamily={F} fontSize="16" fill={p.acc}>&amp; {n.gEn}</text>
      {/* chai */}
      <g transform="translate(170 340)">
        <path d="M0 0 H40 V22 Q40 40 20 40 Q0 40 0 22Z" fill={p.bg === 'none' ? p.acc : p.ink} />
        <path d="M40 8 Q56 10 52 24 Q48 32 38 30" fill="none" stroke={p.bg === 'none' ? p.acc : p.ink} strokeWidth="4" />
        <path d="M10 -6 Q4 -14 10 -22 M22 -6 Q16 -14 22 -22 M33 -6 Q27 -14 33 -22" stroke={p.acc} strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
      <text x="200" y="395" textAnchor="middle" fontFamily={FD} fontSize="14" fontWeight="700" fill={p.txt}>{n.bHi} · {n.gHi}</text>
      <text x="200" y="406" textAnchor="middle" fontFamily={F} fontSize="0" fill={p.txt}>.</text>
      <text x="200" y="82" textAnchor="middle" fontFamily={F} fontSize="10" letterSpacing="4" fill={p.txt}>{n.dateStr.toUpperCase()}</text>
    </g>
  );
}

const RENDER = { seal: Seal, jharokha: JharokhaArch, entwined: Entwined, wreath: Wreath, ring: Ring, oval: Oval, story: Story };

const Logo = forwardRef(function Logo({ styleId = 'seal', mode = 'full', header = 'none', n, className, style }, ref) {
  const id = useId().replace(/:/g, '');
  const pal = MODES[mode] || MODES.full;
  const p = { ...pal, bg: pal.bg };
  const Body = RENDER[styleId] || Seal;
  const hdr = HEADERS.find((h) => h.id === header);
  return (
    <svg ref={ref} viewBox="0 0 400 440" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      {pal.bg === 'wax' ? (
        <g>
          <path d="M200 20 C290 8 372 70 384 160 C398 262 352 372 250 410 C150 444 40 390 20 290 C2 200 40 100 120 52 C150 34 174 24 200 20Z" fill="#7A1C1C" />
          <path d="M200 38 C280 28 356 84 366 164 C378 258 336 358 246 392 C152 424 56 376 38 288 C22 208 58 116 128 70 C156 52 178 42 200 38Z" fill="#8f2424" />
        </g>
      ) : pal.bg !== 'none' ? (
        <rect width="400" height="440" rx="26" fill={pal.bg} />
      ) : null}
      {hdr && hdr.mark && (
        <text x="200" y="36" textAnchor="middle" fontFamily={FD} fontSize="19" fontWeight="700" fill={pal.acc}>{hdr.mark}</text>
      )}
      <Body p={p} n={n} id={id} />
    </svg>
  );
});

export default Logo;
