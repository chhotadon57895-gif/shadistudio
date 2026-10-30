import React, { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { Check, Copy, Download, ExternalLink, Link2, MessageCircle, Plus, Printer, Trash2, Users } from 'lucide-react';
import { fetchSelfHtml, makeOfflineHtml, saveBlob } from '../exportUtils.js';
import { toB64, useApp, useNames } from '../store.jsx';
import { parseReplies } from '../rsvpParser.js';
import { FnCard, SongCard, upiLink } from '../GuestSite.jsx';

const baseUrl = () => `${window.location.origin}${window.location.pathname}`;

function useQr(text, width = 220) {
  const [src, setSrc] = useState('');
  useEffect(() => {
    let live = true;
    if (!text) { setSrc(''); return undefined; }
    QRCode.toDataURL(text, { margin: 1, width, color: { dark: '#7A1C1C', light: '#FAF6F0' } })
      .then((u) => { if (live) setSrc(u); })
      .catch(() => { if (live) setSrc(''); });
    return () => { live = false; };
  }, [text, width]);
  return src;
}

const Section = ({ title, hint, children }) => (
  <section className="card space-y-3">
    <div>
      <h3 className="font-display text-lg font-bold text-sindoor">{title}</h3>
      {hint && <p className="text-[11px] text-sindoor/60">{hint}</p>}
    </div>
    {children}
  </section>
);

/* ---------- functions editor ---------- */
function FunctionsEditor() {
  const { s, patch } = useApp();
  const n = useNames();
  const [open, setOpen] = useState('wedding');
  const upd = (id, p) => patch({ fns: s.fns.map((f) => (f.id === id ? { ...f, ...p } : f)) });
  const add = () => {
    const id = `c${Date.now().toString(36)}`;
    patch({ fns: [...s.fns, { id, en: 'New function', hi: 'नया समारोह', on: true, date: s.date, time: '18:00', venue: '', map: '', dress: '', contact: '', phone: '', custom: true }] });
    setOpen(id);
  };
  return (
    <Section title={n.t('Functions', 'समारोह')} hint={n.t('Switch on the ones you are hosting, then fill the details.', 'जो समारोह हैं उन्हें चालू करें, फिर विवरण भरें।')}>
      <div className="space-y-2">
        {s.fns.map((f) => (
          <div key={f.id} className={`rounded-xl border ${f.on ? 'border-gold' : 'border-gold/30 opacity-70'} bg-white/70`}>
            <div className="flex items-center gap-2 p-2">
              <input type="checkbox" className="h-5 w-5 accent-[#7A1C1C]" checked={f.on} onChange={(e) => upd(f.id, { on: e.target.checked })} />
              <button className="flex-1 text-left font-display text-sm font-bold text-sindoor" onClick={() => setOpen(open === f.id ? '' : f.id)}>
                {n.hi ? f.hi : f.en} <span className="font-sans text-[11px] font-normal text-sindoor/60">{f.date} · {f.time}</span>
              </button>
              {f.custom && <button className="p-1 text-sindoor/60" onClick={() => patch({ fns: s.fns.filter((x) => x.id !== f.id) })} aria-label="Delete"><Trash2 size={16} /></button>}
            </div>
            {open === f.id && (
              <div className="grid grid-cols-2 gap-2 border-t border-gold/30 p-2">
                {f.custom && <>
                  <div><label className="label">Name</label><input className="field" value={f.en} onChange={(e) => upd(f.id, { en: e.target.value })} /></div>
                  <div><label className="label">नाम</label><input className="field font-deva" value={f.hi} onChange={(e) => upd(f.id, { hi: e.target.value })} /></div>
                </>}
                <div><label className="label">Date</label><input type="date" className="field" value={f.date} onChange={(e) => upd(f.id, { date: e.target.value })} /></div>
                <div><label className="label">Time</label><input type="time" className="field" value={f.time} onChange={(e) => upd(f.id, { time: e.target.value })} /></div>
                <div className="col-span-2"><label className="label">Venue</label><input className="field" value={f.venue} placeholder="e.g. Jai Mahal Palace, Jaipur" onChange={(e) => upd(f.id, { venue: e.target.value })} /></div>
                <div className="col-span-2"><label className="label">Map link (Google Maps)</label><input className="field" value={f.map} placeholder="https://maps.app.goo.gl/…" onChange={(e) => upd(f.id, { map: e.target.value })} /></div>
                <div className="col-span-2"><label className="label">Dress code</label><input className="field" value={f.dress} onChange={(e) => upd(f.id, { dress: e.target.value })} /></div>
                <div><label className="label">Family contact</label><input className="field" value={f.contact} onChange={(e) => upd(f.id, { contact: e.target.value })} /></div>
                <div><label className="label">Phone</label><input className="field" inputMode="tel" value={f.phone} onChange={(e) => upd(f.id, { phone: e.target.value })} /></div>
              </div>
            )}
          </div>
        ))}
      </div>
      <button className="btn-ghost w-full" onClick={add}><Plus size={16} /> {n.t('Add a function', 'समारोह जोड़ें')}</button>
    </Section>
  );
}

/* ---------- extras: kids, song, UPI, elders' card ---------- */
function Extras() {
  const { s, patch } = useApp();
  const n = useNames();
  const site = s.siteUrl || baseUrl();
  const qr = useQr(site);
  const upi = upiLink(s.upi);
  const upiQr = useQr(upi);
  const fns = s.fns.filter((f) => f.on);
  return (
    <>
      <Section title="Bal Manuhar ✦ बाल मनुहार" hint={n.t('Cute kids’ lines for the invite — one per line.', 'बच्चों की प्यारी पंक्तियाँ — हर पंक्ति अलग।')}>
        <textarea className="field min-h-[90px]" value={s.kids.join('\n')} onChange={(e) => patch({ kids: e.target.value.split('\n') })} />
      </Section>

      <Section title={n.t('“Now Playing” couple song', '“अभी बज रहा है” — हमारा गाना')}>
        <div className="grid grid-cols-2 gap-2">
          <input className="field" placeholder="Song" value={s.song.title} onChange={(e) => patch({ song: { ...s.song, title: e.target.value } })} />
          <input className="field" placeholder="Artist" value={s.song.artist} onChange={(e) => patch({ song: { ...s.song, artist: e.target.value } })} />
          <input className="field col-span-2" placeholder="Spotify / YouTube link" value={s.song.url} onChange={(e) => patch({ song: { ...s.song, url: e.target.value } })} />
        </div>
        <SongCard song={s.song} hi={n.hi} />
      </Section>

      <Section title={n.t('Shagun (UPI)', 'शगुन (UPI)')} hint={n.t('Guests tap a button that opens their UPI app. Nothing is stored anywhere but your browser and the links you share.', 'मेहमान बटन दबाकर अपना UPI ऐप खोलते हैं। डेटा सिर्फ़ आपके ब्राउज़र और साझा लिंक में रहता है।')}>
        <div className="grid grid-cols-2 gap-2">
          <input className="field" placeholder="UPI ID (name@bank)" value={s.upi.id} onChange={(e) => patch({ upi: { ...s.upi, id: e.target.value } })} />
          <input className="field" placeholder="Payee name" value={s.upi.name} onChange={(e) => patch({ upi: { ...s.upi, name: e.target.value } })} />
        </div>
        {upi && (
          <div className="flex items-center gap-3">
            {upiQr && <img src={upiQr} alt="UPI QR" className="h-24 w-24 rounded" />}
            <a className="btn-gold" href={upi}>Test shagun link</a>
          </div>
        )}
      </Section>

      <Section title={n.t('Elders’ card (printable)', 'बड़ों का कार्ड (प्रिंट)')} hint={n.t('A paper card with a QR to your wedding site, for relatives who skip WhatsApp.', 'WhatsApp न चलाने वाले बड़ों के लिए QR वाला कागज़ी कार्ड।')}>
        <input className="field" placeholder={`Site link for the QR (default: ${baseUrl()})`} value={s.siteUrl} onChange={(e) => patch({ siteUrl: e.target.value })} />
        <div className="print-area mx-auto max-w-sm rounded-xl border-4 border-double border-gold bg-ivory p-5 text-center">
          <div className="font-deva text-sindoor">॥ श्री गणेशाय नमः ॥</div>
          <h4 className="mt-2 font-display text-2xl font-black text-sindoor">{n.bHi} <span className="text-gold">&amp;</span> {n.gHi}</h4>
          <h4 className="font-display text-xl font-bold text-sindoor">{n.bEn} &amp; {n.gEn}</h4>
          <p className="mt-1 font-display text-sm text-peacock">{n.dateStr}</p>
          <ul className="mt-3 space-y-0.5 text-sm">
            {fns.map((f) => <li key={f.id}><b>{f.hi} / {f.en}</b> — {f.date} · {f.time}{f.venue ? ` · ${f.venue}` : ''}</li>)}
          </ul>
          {qr && <img src={qr} alt="QR" className="mx-auto mt-3 h-36 w-36" />}
          <p className="text-[11px] text-sindoor/70">{n.t('Scan for the full wedding website', 'पूरी वेबसाइट के लिए स्कैन करें')}</p>
        </div>
        <button className="btn-primary w-full" onClick={() => window.print()}><Printer size={16} /> {n.t('Print / save as PDF', 'प्रिंट / PDF')}</button>
      </Section>
    </>
  );
}

/* ---------- family link tokenizer ---------- */
function Families() {
  const { s, patch } = useApp();
  const n = useNames();
  const [copied, setCopied] = useState('');
  const [preview, setPreview] = useState('');
  const [busy, setBusy] = useState('');
  const fns = s.fns.filter((f) => f.on);

  const upd =(id, p) => patch({ families: s.families.map((f) => (f.id === id ? { ...f, ...p } : f)) });
  const toggle = (fam, fid) => upd(fam.id, { fns: fam.fns.includes(fid) ? fam.fns.filter((x) => x !== fid) : [...fam.fns, fid] });

  const link = (fam) => {
    const allowed = s.fns.filter((f) => f.on && fam.fns.includes(f.id));
    const payload = {
      v: 1, fam: fam.name || 'Guest', lang: s.lang,
      b: { en: s.b.en, hi: s.b.hi }, g: { en: s.g.en, hi: s.g.hi },
      date: s.date, host: s.hostPhone, upi: s.upi, song: s.song,
      kids: s.kids.filter(Boolean),
      fns: allowed.map(({ id, en, hi, date, time, venue, map, dress, contact, phone }) => ({ id, en, hi, date, time, venue, map, dress, contact, phone })),
    };
    return `${baseUrl()}?g=${toB64(payload)}`;
  };
  const copy = async (fam) => {
    const u = link(fam);
    try { await navigator.clipboard.writeText(u); } catch { window.prompt('Copy this link', u); }
    setCopied(fam.id);
    setTimeout(() => setCopied(''), 1500);
  };
  const offline = async (fam) => {
    setBusy(fam.id);
    try {
      const token = link(fam).split('?g=')[1];
      const html = makeOfflineHtml(await fetchSelfHtml(), token);
      const slug = (fam.name || 'guest').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'guest';
      saveBlob(new Blob([html], { type: 'text/html' }), `invitation-${slug}.html`);
    } catch (e) {
      window.alert(
        e.message === 'NOT_SINGLE_FILE'
          ? 'Offline files only work from the built site (npm run build, then open the deployed or `npm run preview` page), not from the dev server.'
          : 'Could not create the offline file. Open the deployed site while online and try again.'
      );
    } finally {
      setBusy('');
    }
  };
  const shareWa = (fam) => {
    const t = `🙏 ${fam.name} family, you are warmly invited to the wedding of ${s.b.en} & ${s.g.en}!\nYour personal invitation: ${link(fam)}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(t)}`, '_blank');
  };
  const previewing = s.families.find((f) => f.id === preview);

  return (
    <Section title={n.t('Family links', 'परिवार के लिंक')} hint={n.t('Each family gets their own link that greets them by name and shows only the functions you tick. Everything is encoded in the link itself, so no server is needed.', 'हर परिवार को अपना लिंक मिलता है जो नाम से स्वागत करता है और सिर्फ़ चुने हुए समारोह दिखाता है। सब कुछ लिंक में ही है — सर्वर की ज़रूरत नहीं।')}>
      <div>
        <label className="label">{n.t('Your WhatsApp number (for guest replies, with country code)', 'आपका WhatsApp नंबर (देश कोड सहित)')}</label>
        <input className="field" inputMode="tel" placeholder="919876543210" value={s.hostPhone} onChange={(e) => patch({ hostPhone: e.target.value })} />
      </div>
      <div className="space-y-3">
        {s.families.map((fam) => (
          <div key={fam.id} className="rounded-xl border border-gold/60 bg-white/70 p-3">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-gold" />
              <input className="field !py-1" placeholder="Family name" value={fam.name} onChange={(e) => upd(fam.id, { name: e.target.value })} />
              <button className="p-1 text-sindoor/60" aria-label="Remove" onClick={() => patch({ families: s.families.filter((x) => x.id !== fam.id) })}><Trash2 size={16} /></button>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {fns.map((f) => (
                <button key={f.id} onClick={() => toggle(fam, f.id)} className={`chip ${fam.fns.includes(f.id) ? 'chip-on' : ''}`}>{n.hi ? f.hi : f.en}</button>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <button className="btn-ghost !px-3 !py-1.5 text-xs" onClick={() => copy(fam)}>{copied === fam.id ? <Check size={14} /> : <Copy size={14} />} {copied === fam.id ? 'Copied' : 'Copy link'}</button>
              <button className="btn-gold !px-3 !py-1.5 text-xs" onClick={() => shareWa(fam)}><MessageCircle size={14} /> WhatsApp</button>
              <button className="btn-primary !px-3 !py-1.5 text-xs" disabled={busy === fam.id} onClick={() => offline(fam)}>
                <Download size={14} /> {busy === fam.id ? '…' : n.t('Offline file', 'ऑफ़लाइन फ़ाइल')}
              </button>
              <button className="btn-ghost !px-3 !py-1.5 text-xs" onClick={() => setPreview(preview === fam.id ? '' : fam.id)}><Link2 size={14} /> Preview</button>
              <a className="btn-ghost !px-3 !py-1.5 text-xs" href={link(fam)} target="_blank" rel="noreferrer"><ExternalLink size={14} /> Open</a>
            </div>
          </div>
        ))}
      </div>
      <button className="btn-ghost w-full" onClick={() => patch({ families: [...s.families, { id: `f${Date.now().toString(36)}`, name: '', fns: fns.map((f) => f.id) }] })}>
        <Plus size={16} /> {n.t('Add a family', 'परिवार जोड़ें')}
      </button>
      {previewing && (
        <div className="space-y-2 rounded-xl bg-ivory p-3">
          <div className="font-display text-sm font-bold text-sindoor">{n.t(`${previewing.name || 'Guest'} family will see:`, `${previewing.name || 'मेहमान'} परिवार को दिखेगा:`)}</div>
          {fns.filter((f) => previewing.fns.includes(f.id)).map((f) => <FnCard key={f.id} f={f} hi={n.hi} />)}
          {!previewing.fns.length && <p className="text-xs">{n.t('No functions ticked yet.', 'अभी कोई समारोह नहीं चुना।')}</p>}
        </div>
      )}
    </Section>
  );
}

/* ---------- smart reply paste box ---------- */
function PasteBox() {
  const { s } = useApp();
  const n = useNames();
  const [raw, setRaw] = useState('');
  const fns = s.fns.filter((f) => f.on);
  const res = useMemo(() => parseReplies(raw, fns), [raw, fns]);
  const grand = Object.values(res.totals).reduce((a, b) => a + b, 0);
  return (
    <Section title={n.t('Smart WhatsApp reply box', 'स्मार्ट WhatsApp रिप्लाई बॉक्स')} hint={n.t('Paste replies (or a WhatsApp chat export). We read lines like “Haldi 3, Sangeet 2”, “5 for wedding”, “all 4 of us”, “sorry can’t make it”.', 'जवाब (या WhatsApp चैट एक्सपोर्ट) पेस्ट करें। “Haldi 3, Sangeet 2”, “5 for wedding”, “all 4”, “sorry can’t” जैसी पंक्तियाँ समझी जाती हैं।')}>
      <textarea className="field min-h-[140px] font-mono text-xs" placeholder={'Sharma family: Haldi 3, Sangeet 2, Wedding 4\n[12/10/26, 5:30 pm] Mehta Aunty: 5 for wedding and reception\nVerma: sorry can\'t make it'} value={raw} onChange={(e) => setRaw(e.target.value)} />
      {raw.trim() && (
        <>
          <div className="overflow-x-auto rounded-xl border border-gold/50 bg-white">
            <table className="w-full text-center text-xs">
              <thead className="bg-sindoor text-ivory">
                <tr><th className="p-2 text-left">{n.t('Function', 'समारोह')}</th><th className="p-2">{n.t('Attending', 'आ रहे')}</th></tr>
              </thead>
              <tbody>
                {fns.map((f) => (
                  <tr key={f.id} className="border-t border-gold/30"><td className="p-2 text-left font-semibold">{n.hi ? f.hi : f.en}</td><td className="p-2 text-base font-bold text-sindoor">{res.totals[f.id]}</td></tr>
                ))}
                <tr className="border-t-2 border-gold bg-gold/10"><td className="p-2 text-left font-bold">{n.t('Sum of all', 'कुल योग')}</td><td className="p-2 font-bold">{grand}</td></tr>
              </tbody>
            </table>
          </div>
          <div className="space-y-1.5">
            {res.rows.map((r, i) => (
              <div key={i} className="rounded-lg bg-white/70 p-2 text-[11px]">
                <div className="flex justify-between font-semibold">
                  <span>{r.sender}</span>
                  <span className={r.status === 'unclear' ? 'text-marigold' : r.status === 'declined' ? 'text-sindoor' : 'text-peacock'}>{r.status}</span>
                </div>
                <div className="text-sindoor/70">{r.text}</div>
                {r.status !== 'unclear' && <div className="mt-0.5">{fns.filter((f) => r.counts[f.id] !== undefined).map((f) => `${f.en} ${r.counts[f.id]}`).join(' · ')}</div>}
              </div>
            ))}
          </div>
          <p className="text-[11px] text-sindoor/60">{n.t('“unclear” rows have no number we could match — add them by hand.', '“unclear” पंक्तियों में कोई संख्या नहीं मिली — हाथ से जोड़ें।')}</p>
        </>
      )}
    </Section>
  );
}

export default function RsvpTab() {
  const n = useNames();
  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-bold text-sindoor">{n.t('Wedding website, family links & RSVP', 'वेडिंग वेबसाइट, परिवार लिंक और RSVP')}</h2>
        <p className="text-xs text-sindoor/60">{n.t('100% in your browser — saved on this device, shared through links.', '100% आपके ब्राउज़र में — इसी डिवाइस पर सेव, लिंक से साझा।')}</p>
      </div>
      <FunctionsEditor />
      <Families />
      <PasteBox />
      <Extras />
    </div>
  );
}
