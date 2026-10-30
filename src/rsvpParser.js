// "Smart WhatsApp Reply Paste Box" parser. Pure functions, no network.

const ALIASES = {
  roka: ['roka', 'रोका'],
  haldi: ['haldi', 'हल्दी'],
  mehndi: ['mehndi', 'mehendi', 'mehandi', 'मेहंदी'],
  sangeet: ['sangeet', 'संगीत'],
  wedding: ['wedding', 'shaadi', 'shadi', 'vivah', 'phere', 'baraat', 'शादी', 'विवाह'],
  reception: ['reception', 'रिसेप्शन'],
  nikah: ['nikah', 'निकाह'],
  patrika: ['patrika', 'marathi', 'पत्रिका'],
};

const WORD_NUM = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, ek: 1, do: 2, teen: 3, char: 4, paanch: 5, panch: 5 };
const DEVA_DIGITS = '०१२३४५६७८९';

const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function normalise(text) {
  let t = text.replace(/[०-९]/g, (d) => String(DEVA_DIGITS.indexOf(d)));
  t = t.replace(/\b(one|two|three|four|five|six|seven|eight|nine|ten|ek|do|teen|char|paanch|panch)\b/gi, (w) => String(WORD_NUM[w.toLowerCase()]));
  return t;
}

export function aliasesFor(fn) {
  const base = ALIASES[fn.id] || [];
  return [...new Set([...base, fn.en.toLowerCase(), fn.hi].filter(Boolean))];
}

const HEADER = /^\s*\[?\d{1,2}[/.]\d{1,2}[/.]\d{2,4},?\s+\d{1,2}:\d{2}(?::\d{2})?\s*(?:[ap]m)?\]?\s*-?\s*([^:]{1,60}):\s*(.*)$/i;
const NEG = /\b(can'?t|cannot|unable|sorry|regret|not (?:able|attending|coming|joining)|won'?t|nahi|nahin|nahi aa)\b/i;
const ALL = /\b(all|every|everything|sabhi|sab)\b/i;

export function splitMessages(raw) {
  const lines = raw.split(/\r?\n/);
  const msgs = [];
  let cur = null;
  let anon = 0;
  for (const line of lines) {
    if (!line.trim()) continue;
    const h = line.match(HEADER);
    if (h) {
      cur = { sender: h[1].trim(), text: h[2], hdr: true };
      msgs.push(cur);
      continue;
    }
    // "Sharma family: Haldi 3, Sangeet 2" style (checked before continuation lines)
    const plain = line.match(/^\s*([^:\d[\]]{2,40}):\s*(.+)$/);
    if (
      plain &&
      plain[1].trim().split(/\s+/).length <= 4 &&
      !/^(haldi|mehndi|mehendi|sangeet|wedding|reception|roka|nikah|patrika|shaadi|vivah)/i.test(plain[1].trim())
    ) {
      cur = { sender: plain[1].trim(), text: plain[2] };
      msgs.push(cur);
      continue;
    }
    // continuation line of a multi-line WhatsApp-export message
    if (cur && cur.hdr) {
      cur.text += ' ' + line;
      continue;
    }
    anon += 1;
    cur = { sender: `Message ${anon}`, text: line };
    msgs.push(cur);
  }
  return msgs;
}

export function parseReplies(raw, fns) {
  const rows = splitMessages(raw).map((m) => {
    const text = normalise(m.text);
    const low = text.toLowerCase();
    const counts = {};
    let found = 0;
    for (const fn of fns) {
      for (const a of aliasesFor(fn)) {
        const al = esc(a.toLowerCase());
        const r1 = new RegExp(`${al}\\W{0,15}?(\\d{1,3})(?!\\d)`, 'i');
        const r2 = new RegExp(`(\\d{1,3})\\s*(?:for|in|at|to|people|persons|members|ppl|pax|guests)?\\W{0,6}${al}`, 'i');
        const hit = low.match(r1) || low.match(r2);
        if (hit) { counts[fn.id] = parseInt(hit[1], 10); found += 1; break; }
      }
    }
    const nums = (low.match(/\d{1,3}/g) || []).map(Number);
    let status = 'ok';
    if (!found) {
      if (NEG.test(low)) {
        fns.forEach((f) => { counts[f.id] = 0; });
        status = 'declined';
      } else if (nums.length && ALL.test(low)) {
        fns.forEach((f) => { counts[f.id] = nums[0]; });
        status = 'all';
      } else {
        status = 'unclear';
      }
    }
    return { sender: m.sender, text: m.text, counts, status };
  });

  const totals = {};
  fns.forEach((f) => { totals[f.id] = 0; });
  rows.forEach((r) => Object.entries(r.counts).forEach(([k, v]) => { if (k in totals) totals[k] += v; }));
  return { rows, totals };
}
