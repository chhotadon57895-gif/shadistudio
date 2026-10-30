// 10 canvas countdown / Instagram templates. Each draws on a 1080x1920 canvas.
export const W = 1080;
export const H = 1920;

const SERIF = '"Playfair Display", "Noto Serif Devanagari", serif';
const DEVA = '"Noto Serif Devanagari", "Playfair Display", serif';
const DEVA_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
export const toDeva = (num) => String(num).replace(/\d/g, (d) => DEVA_DIGITS[d]);

function T(ctx, str, x, y, size, color, o = {}) {
  ctx.save();
  ctx.font = `${o.weight || 700} ${size}px ${o.font || SERIF}`;
  ctx.fillStyle = color;
  ctx.textAlign = o.align || 'center';
  ctx.textBaseline = o.base || 'middle';
  if (o.spacing) ctx.letterSpacing = `${o.spacing}px`;
  if (o.rotate) {
    ctx.translate(x, y);
    ctx.rotate(o.rotate);
    ctx.fillText(str, 0, 0, o.maxW);
  } else {
    ctx.fillText(str, x, y, o.maxW);
  }
  ctx.restore();
}

const rect = (ctx, x, y, w, h, fill, r = 0, stroke, lw = 4) => {
  ctx.save();
  ctx.beginPath();
  if (r) ctx.roundRect(x, y, w, h, r);
  else ctx.rect(x, y, w, h);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
  ctx.restore();
};

const grad = (ctx, c1, c2) => {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, c1);
  g.addColorStop(1, c2);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
};

const archPath = (ctx, cx, top, w, bottom) => {
  ctx.beginPath();
  ctx.moveTo(cx - w / 2, bottom);
  ctx.lineTo(cx - w / 2, top + w / 2);
  ctx.bezierCurveTo(cx - w / 2, top + w * 0.15, cx - w * 0.1, top + w * 0.05, cx, top);
  ctx.bezierCurveTo(cx + w * 0.1, top + w * 0.05, cx + w / 2, top + w * 0.15, cx + w / 2, top + w / 2);
  ctx.lineTo(cx + w / 2, bottom);
  ctx.closePath();
};

const names = (d) => `${d.bEn} & ${d.gEn}`;
const namesHi = (d) => `${d.bHi} और ${d.gHi}`;
const dayWord = (d) => (d.days === 1 ? 'DAY' : 'DAYS');

export const TEMPLATES = [
  {
    id: 'jharokha', en: 'Jharokha',
    draw(ctx, d) {
      grad(ctx, '#7A1C1C', '#2b0707');
      archPath(ctx, W / 2, 330, 760, 1500);
      ctx.fillStyle = '#FAF6F0'; ctx.fill();
      ctx.lineWidth = 16; ctx.strokeStyle = '#D4AF37'; ctx.stroke();
      T(ctx, '॥ शुभ विवाह ॥', W / 2, 250, 56, '#D4AF37', { font: DEVA });
      T(ctx, String(d.days), W / 2, 820, 360, '#7A1C1C', { weight: 900 });
      T(ctx, `${dayWord(d)} TO GO`, W / 2, 1060, 64, '#0F4C5C', { spacing: 10 });
      T(ctx, names(d), W / 2, 1230, 78, '#7A1C1C');
      T(ctx, namesHi(d), W / 2, 1330, 54, '#0F4C5C', { font: DEVA });
      T(ctx, d.dateStr, W / 2, 1650, 52, '#D4AF37');
    },
  },
  {
    id: 'boarding', en: 'Boarding Pass',
    draw(ctx, d) {
      grad(ctx, '#0F4C5C', '#07242c');
      rect(ctx, 90, 420, 900, 1000, '#FAF6F0', 40);
      rect(ctx, 90, 420, 900, 170, '#7A1C1C', 40);
      T(ctx, 'SHAADI AIRLINES · BOARDING PASS', W / 2, 505, 40, '#D4AF37', { spacing: 4 });
      T(ctx, d.bCity.slice(0, 3).toUpperCase(), 270, 760, 150, '#7A1C1C', { weight: 900 });
      T(ctx, '✈', W / 2, 760, 110, '#D4AF37');
      T(ctx, d.gCity.slice(0, 3).toUpperCase(), 810, 760, 150, '#7A1C1C', { weight: 900 });
      T(ctx, d.bCity, 270, 860, 40, '#0F4C5C'); T(ctx, d.gCity, 810, 860, 40, '#0F4C5C');
      ctx.setLineDash([16, 14]); ctx.strokeStyle = '#999'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(130, 960); ctx.lineTo(950, 960); ctx.stroke(); ctx.setLineDash([]);
      T(ctx, 'PASSENGERS', 270, 1030, 32, '#888', { spacing: 4 });
      T(ctx, names(d), 270, 1100, 56, '#7A1C1C', { align: 'left', maxW: 760 });
      T(ctx, 'DATE', 270, 1210, 32, '#888', { align: 'left', spacing: 4 });
      T(ctx, d.dateStr, 130, 1270, 52, '#7A1C1C', { align: 'left' });
      T(ctx, `${d.days}`, 860, 1215, 130, '#D4AF37', { weight: 900 });
      T(ctx, `${dayWord(d)} TO BOARD`, 860, 1320, 34, '#0F4C5C', { spacing: 3 });
    },
  },
  {
    id: 'shaadicard', en: 'Shaadi Card',
    draw(ctx, d) {
      rect(ctx, 0, 0, W, H, '#FAF6F0');
      rect(ctx, 60, 60, W - 120, H - 120, null, 0, '#D4AF37', 10);
      rect(ctx, 90, 90, W - 180, H - 180, null, 0, '#7A1C1C', 3);
      T(ctx, '॥ श्री गणेशाय नमः ॥', W / 2, 260, 60, '#7A1C1C', { font: DEVA });
      T(ctx, 'SAVE THE DATE', W / 2, 400, 40, '#D4AF37', { spacing: 12 });
      T(ctx, d.bEn, W / 2, 620, 130, '#7A1C1C', { weight: 900 });
      T(ctx, '&', W / 2, 760, 90, '#D4AF37');
      T(ctx, d.gEn, W / 2, 900, 130, '#7A1C1C', { weight: 900 });
      T(ctx, `${d.days} ${dayWord(d)} TO GO`, W / 2, 1160, 70, '#0F4C5C', { spacing: 6 });
      T(ctx, d.dateStr, W / 2, 1300, 56, '#7A1C1C');
      T(ctx, `${d.bHi} · ${d.gHi}`, W / 2, 1500, 66, '#7A1C1C', { font: DEVA });
    },
  },
  {
    id: 'bada', en: 'Hindi Bada Number',
    draw(ctx, d) {
      grad(ctx, '#F59E0B', '#b45309');
      T(ctx, toDeva(d.days), W / 2, 780, 700, '#7A1C1C', { font: DEVA, weight: 700 });
      T(ctx, 'दिन बाकी', W / 2, 1230, 160, '#FAF6F0', { font: DEVA });
      T(ctx, namesHi(d), W / 2, 1450, 78, '#2b0707', { font: DEVA });
      T(ctx, d.dateStrHi, W / 2, 1580, 54, '#2b0707', { font: DEVA });
    },
  },
  {
    id: 'polaroid', en: 'Polaroid',
    draw(ctx, d) {
      grad(ctx, '#0F4C5C', '#115e73');
      ctx.save(); ctx.translate(W / 2, 900); ctx.rotate(-0.06);
      ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 25;
      rect(ctx, -400, -620, 800, 1060, '#fff', 8);
      ctx.shadowColor = 'transparent';
      const g = ctx.createLinearGradient(0, -580, 0, 160); g.addColorStop(0, '#7A1C1C'); g.addColorStop(1, '#D4AF37');
      rect(ctx, -360, -580, 720, 740, g);
      T(ctx, `${d.bI} ♥ ${d.gI}`, 0, -280, 200, '#FAF6F0', { weight: 900 });
      T(ctx, String(d.days), 0, -60, 220, '#FAF6F0', { weight: 900 });
      T(ctx, `${dayWord(d)} TO GO`, 0, 90, 50, '#FAF6F0', { spacing: 8 });
      T(ctx, names(d), 0, 290, 60, '#7A1C1C', { weight: 600 });
      T(ctx, d.dateStr, 0, 370, 40, '#555', { weight: 400 });
      ctx.restore();
    },
  },
  {
    id: 'bold', en: 'Bold Block',
    draw(ctx, d) {
      rect(ctx, 0, 0, W, H, '#F59E0B');
      rect(ctx, 60, 120, W - 120, 560, '#111');
      T(ctx, String(d.days), W / 2, 400, 460, '#F59E0B', { weight: 900 });
      rect(ctx, 60, 720, W - 120, 200, '#7A1C1C');
      T(ctx, `${dayWord(d)} TO GO`, W / 2, 820, 110, '#FAF6F0', { weight: 900 });
      rect(ctx, 60, 960, W - 120, 420, '#FAF6F0');
      T(ctx, d.bEn.toUpperCase(), W / 2, 1060, 120, '#111', { weight: 900, maxW: 900 });
      T(ctx, '×', W / 2, 1170, 90, '#7A1C1C');
      T(ctx, d.gEn.toUpperCase(), W / 2, 1280, 120, '#111', { weight: 900, maxW: 900 });
      T(ctx, d.dateStr.toUpperCase(), W / 2, 1560, 60, '#111', { spacing: 4 });
    },
  },
  {
    id: 'calendar', en: 'Calendar',
    draw(ctx, d) {
      grad(ctx, '#FAF6F0', '#e8dcc4');
      ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.3)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 20;
      rect(ctx, 120, 330, 840, 1200, '#fff', 30);
      ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.roundRect(120, 330, 840, 250, [30, 30, 0, 0]); ctx.fillStyle = '#7A1C1C'; ctx.fill(); ctx.restore();
      const dt = new Date(d.date + 'T00:00:00');
      T(ctx, dt.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }).toUpperCase(), W / 2, 455, 72, '#D4AF37', { spacing: 8 });
      T(ctx, String(dt.getDate()), W / 2, 940, 520, '#7A1C1C', { weight: 900 });
      T(ctx, dt.toLocaleDateString('en-IN', { weekday: 'long' }).toUpperCase(), W / 2, 1290, 70, '#0F4C5C', { spacing: 10 });
      T(ctx, `${d.days} ${dayWord(d)} TO GO`, W / 2, 1420, 52, '#D4AF37', { spacing: 4 });
      T(ctx, names(d), W / 2, 1680, 72, '#7A1C1C');
    },
  },
  {
    id: 'magazine', en: 'Magazine Cover',
    draw(ctx, d) {
      grad(ctx, '#2b0707', '#7A1C1C');
      T(ctx, 'THE SHAADI EDIT', W / 2, 210, 130, '#FAF6F0', { weight: 900, maxW: 960 });
      T(ctx, `ISSUE NO. ${d.days} · ${d.dateStr.toUpperCase()}`, W / 2, 330, 36, '#D4AF37', { spacing: 6 });
      const g = ctx.createRadialGradient(W / 2, 1000, 50, W / 2, 1000, 600);
      g.addColorStop(0, '#D4AF37'); g.addColorStop(1, 'rgba(212,175,55,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 400, W, 1200);
      T(ctx, `${d.bI}${d.gI}`, W / 2, 980, 520, 'rgba(250,246,240,.92)', { weight: 900 });
      T(ctx, names(d).toUpperCase(), 80, 1470, 80, '#FAF6F0', { align: 'left', maxW: 920 });
      T(ctx, `${d.days} ${dayWord(d)} TO THE BIG DAY`, 80, 1560, 48, '#F59E0B', { align: 'left' });
      T(ctx, 'Inside: mithai, mehndi & 5 meltdowns', 80, 1640, 40, '#FAF6F0', { align: 'left', weight: 400 });
      T(ctx, namesHi(d), 80, 1740, 52, '#D4AF37', { align: 'left', font: DEVA });
    },
  },
  {
    id: 'savedate', en: 'Save the Date',
    draw(ctx, d) {
      rect(ctx, 0, 0, W, H, '#FAF6F0');
      ctx.save(); ctx.globalAlpha = 0.12;
      for (let i = 0; i < 14; i++) for (let j = 0; j < 24; j++) T(ctx, '✦', 40 + i * 78, 40 + j * 80, 40, '#D4AF37');
      ctx.restore();
      T(ctx, 'SAVE', W / 2, 520, 190, '#7A1C1C', { weight: 900, spacing: 10 });
      T(ctx, 'the', W / 2, 640, 80, '#D4AF37', { weight: 400 });
      T(ctx, 'DATE', W / 2, 780, 190, '#7A1C1C', { weight: 900, spacing: 10 });
      T(ctx, d.dateStr, W / 2, 1000, 70, '#0F4C5C');
      T(ctx, names(d), W / 2, 1220, 84, '#7A1C1C');
      T(ctx, namesHi(d), W / 2, 1320, 56, '#7A1C1C', { font: DEVA });
      T(ctx, `${d.days} ${dayWord(d)} TO GO`, W / 2, 1560, 56, '#D4AF37', { spacing: 6 });
    },
  },
  {
    id: 'grid', en: 'Story Grid',
    draw(ctx, d) {
      rect(ctx, 0, 0, W, H, '#111');
      const cells = [
        ['#7A1C1C', String(d.days), '#FAF6F0', 220], ['#D4AF37', dayWord(d), '#7A1C1C', 120], ['#0F4C5C', 'TO GO', '#FAF6F0', 110],
        ['#FAF6F0', d.bI, '#7A1C1C', 300], ['#F59E0B', '♥', '#7A1C1C', 260], ['#FAF6F0', d.gI, '#0F4C5C', 300],
        ['#0F4C5C', d.bCity, '#FAF6F0', 70], ['#7A1C1C', '✈', '#D4AF37', 200], ['#D4AF37', d.gCity, '#7A1C1C', 70],
      ];
      const s = 330; const gap = 20; const ox = (W - (s * 3 + gap * 2)) / 2; const oy = 300;
      cells.forEach(([bg, txt, col, size], i) => {
        const x = ox + (i % 3) * (s + gap); const y = oy + Math.floor(i / 3) * (s + gap);
        rect(ctx, x, y, s, s, bg, 24);
        T(ctx, txt, x + s / 2, y + s / 2, size, col, { weight: 900, maxW: s - 30 });
      });
      T(ctx, names(d).toUpperCase(), W / 2, 1450, 70, '#FAF6F0', { maxW: 960 });
      T(ctx, d.dateStr, W / 2, 1550, 50, '#D4AF37');
    },
  },
];

export async function drawTemplate(canvas, tpl, data) {
  try {
    await Promise.all([
      document.fonts.load(`700 80px ${SERIF}`),
      document.fonts.load(`900 80px ${SERIF}`),
      document.fonts.load(`700 80px ${DEVA}`),
    ]);
  } catch { /* fonts optional */ }
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);
  tpl.draw(ctx, data);
}
