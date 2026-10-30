// Lightweight Roman -> Devanagari transliteration tuned for Indian first names.
// Not perfect (no transliterator is), so every Hindi field stays editable.

const DICT = {
  aanya: 'आन्या', ananya: 'अनन्या', aditya: 'आदित्य', aditi: 'अदिति', aarav: 'आरव',
  arjun: 'अर्जुन', priya: 'प्रिया', riya: 'रिया', rahul: 'राहुल', rohan: 'रोहन',
  rohit: 'रोहित', simran: 'सिमरन', sneha: 'स्नेहा', shreya: 'श्रेया', shivam: 'शिवम',
  shiv: 'शिव', siddharth: 'सिद्धार्थ', sita: 'सीता', ram: 'राम', radha: 'राधा',
  krishna: 'कृष्णा', kabir: 'कबीर', kavya: 'काव्या', kriti: 'कृति', karan: 'करण',
  neha: 'नेहा', nikhil: 'निखिल', pooja: 'पूजा', puja: 'पूजा', prateek: 'प्रतीक',
  vikram: 'विक्रम', vivek: 'विवेक', vedant: 'वेदांत', isha: 'ईशा', ishaan: 'ईशान',
  ayush: 'आयुष', ankit: 'अंकित', anjali: 'अंजलि', amit: 'अमित', amita: 'अमिता',
  sanya: 'सान्या', saanvi: 'सान्वी', tanvi: 'तन्वी', tanya: 'तान्या', meera: 'मीरा',
  mohit: 'मोहित', manish: 'मनीष', nisha: 'निशा', deepak: 'दीपक', divya: 'दिव्या',
  harsh: 'हर्ष', himani: 'हिमानी', jaya: 'जया', gaurav: 'गौरव', gauri: 'गौरी',
  ishita: 'इशिता', lakshmi: 'लक्ष्मी', mahima: 'महिमा', tanishq: 'तनिष्क', yash: 'यश',
  utkarsh: 'उत्कर्ष', swati: 'स्वाति', sakshi: 'साक्षी', sachin: 'सचिन', suresh: 'सुरेश',
  rajesh: 'राजेश', ritu: 'ऋतु', kunal: 'कुणाल', varun: 'वरुण', ved: 'वेद', zoya: 'ज़ोया',
};

const CONS = [
  ['ksh', 'क्ष'], ['chh', 'छ'], ['kh', 'ख'], ['gh', 'घ'], ['ch', 'च'], ['jh', 'झ'],
  ['th', 'थ'], ['dh', 'ध'], ['ph', 'फ'], ['bh', 'भ'], ['sh', 'श'],
  ['k', 'क'], ['g', 'ग'], ['j', 'ज'], ['t', 'त'], ['d', 'द'], ['n', 'न'], ['p', 'प'],
  ['f', 'फ'], ['b', 'ब'], ['m', 'म'], ['y', 'य'], ['r', 'र'], ['l', 'ल'], ['v', 'व'],
  ['w', 'व'], ['s', 'स'], ['h', 'ह'], ['z', 'ज़'], ['q', 'क'], ['c', 'क'], ['x', 'क्स'],
];

// [roman, independent, matra]
const VOW = [
  ['aa', 'आ', 'ा'], ['ai', 'ऐ', 'ै'], ['au', 'औ', 'ौ'], ['ee', 'ई', 'ी'], ['ii', 'ई', 'ी'],
  ['oo', 'ऊ', 'ू'], ['uu', 'ऊ', 'ू'], ['a', 'अ', ''], ['e', 'ए', 'े'], ['i', 'इ', 'ि'],
  ['o', 'ओ', 'ो'], ['u', 'उ', 'ु'],
];

function tokenize(w) {
  const toks = [];
  let i = 0;
  while (i < w.length) {
    let hit = null;
    for (const [r, dev] of CONS) {
      if (w.startsWith(r, i)) { hit = { t: 'c', dev, len: r.length }; break; }
    }
    if (!hit) {
      for (const [r, ind, mat] of VOW) {
        if (w.startsWith(r, i)) { hit = { t: 'v', ind, mat, raw: r, len: r.length }; break; }
      }
    }
    if (!hit) { i += 1; continue; }
    toks.push(hit);
    i += hit.len;
  }
  return toks;
}

function word(w) {
  const lw = w.toLowerCase().replace(/[^a-z]/g, '');
  if (!lw) return w;
  if (DICT[lw]) return DICT[lw];
  const toks = tokenize(lw);
  const n = toks.length;
  // Name-friendly endings
  if (n >= 2 && toks[n - 1].t === 'v' && toks[n - 2].t === 'c') {
    if (toks[n - 1].raw === 'a') toks[n - 1] = { ...toks[n - 1], mat: 'ा', raw: 'aa' };
    else if (toks[n - 1].raw === 'i') toks[n - 1] = { ...toks[n - 1], mat: 'ी', raw: 'ii' };
  }
  if (n >= 3 && toks[n - 1].t === 'c' && toks[n - 2].raw === 'i' && toks[n - 3].t === 'c') {
    toks[n - 2] = { ...toks[n - 2], mat: 'ी', ind: 'ई', raw: 'ii' };
  }
  let out = '';
  let pending = false;
  for (const t of toks) {
    if (t.t === 'c') {
      if (pending) out += '्';
      out += t.dev;
      pending = true;
    } else {
      out += pending ? t.mat : t.ind;
      pending = false;
    }
  }
  return out;
}

export function translit(text) {
  return String(text || '')
    .split(/(\s+)/)
    .map((p) => (/\s+/.test(p) ? p : word(p)))
    .join('');
}

// Hindi initial choices for an English first letter (the स vs श problem).
export const INITIAL_OPTIONS = {
  A: ['अ', 'आ', 'ए'], B: ['ब', 'भ'], C: ['च', 'क', 'स'], D: ['द', 'ड', 'ध'], E: ['ए', 'ई'],
  F: ['फ'], G: ['ग', 'घ'], H: ['ह'], I: ['इ', 'ई'], J: ['ज', 'झ'], K: ['क', 'ख'],
  L: ['ल'], M: ['म'], N: ['न', 'ण'], O: ['ओ'], P: ['प', 'फ'], Q: ['क'], R: ['र', 'ऋ'],
  S: ['स', 'श', 'ष'], T: ['त', 'ट', 'थ'], U: ['उ', 'ऊ'], V: ['व'], W: ['व'], X: ['क्स'],
  Y: ['य'], Z: ['ज़'],
};
