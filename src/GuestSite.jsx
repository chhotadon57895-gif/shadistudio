import React, { useMemo, useState } from 'react';
import { Clock, ExternalLink, Languages, MapPin, MessageCircle, Minus, Music, Plus, Shirt, Wallet } from 'lucide-react';
import { fmtDate, fromB64, useNames } from './store.jsx';

export function FnCard({ f, hi }) {
  return (
    <div className="card">
      <div className="flex items-baseline justify-between">
        <h3 className="font-display text-lg font-bold text-sindoor">{hi ? f.hi : f.en}</h3>
        <span className="text-xs font-semibold text-peacock">{fmtDate(f.date, hi)}</span>
      </div>
      <div className="mt-1 space-y-1 text-xs text-[#4a2b2b]">
        {f.time && <div className="flex items-center gap-1.5"><Clock size={13} className="text-gold" /> {f.time}</div>}
        {f.venue && (
          <div className="flex items-center gap-1.5">
            <MapPin size={13} className="text-gold" /> {f.venue}
            {f.map && <a className="ml-1 inline-flex items-center gap-0.5 font-semibold text-peacock underline" href={f.map} target="_blank" rel="noreferrer">Map <ExternalLink size={11} /></a>}
          </div>
        )}
        {f.dress && <div className="flex items-center gap-1.5"><Shirt size={13} className="text-gold" /> {f.dress}</div>}
        {(f.contact || f.phone) && (
          <div className="text-[11px] text-sindoor/70">
            {hi ? 'संपर्क' : 'Contact'}: {f.contact} {f.phone && <a className="font-semibold underline" href={`tel:${f.phone}`}>{f.phone}</a>}
          </div>
        )}
      </div>
    </div>
  );
}

export function SongCard({ song, hi }) {
  if (!song || !song.title) return null;
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-peacock to-[#07242c] p-3 text-ivory shadow">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold text-sindoor"><Music /></div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-gold">{hi ? 'अभी बज रहा है' : 'Now playing'}</div>
        <div className="truncate font-display text-sm font-bold">{song.title}</div>
        <div className="truncate text-xs opacity-80">{song.artist}</div>
      </div>
      {song.url && (
        <a href={song.url} target="_blank" rel="noreferrer" className="btn-gold !px-3 !py-1.5 text-xs">{hi ? 'सुनें' : 'Play'}</a>
      )}
      <span className="flex items-end gap-0.5" aria-hidden>
        {[8, 14, 10, 16].map((h, i) => <span key={i} className="w-1 animate-pulse rounded bg-gold" style={{ height: h, animationDelay: `${i * 120}ms` }} />)}
      </span>
    </div>
  );
}

export function upiLink(upi, note = 'Shagun') {
  if (!upi?.id) return '';
  return `upi://pay?pa=${encodeURIComponent(upi.id)}&pn=${encodeURIComponent(upi.name || 'Shagun')}&cu=INR&tn=${encodeURIComponent(note)}`;
}

export default function GuestSite({ token }) {
  const data = useMemo(() => {
    try { return fromB64(token); } catch { return null; }
  }, [token]);
  const [lang, setLang] = useState(data?.lang || 'en');
  const [counts, setCounts] = useState({});
  const n = useNames({
    lang,
    b: { en: data?.b?.en, hi: data?.b?.hi, ini: '' },
    g: { en: data?.g?.en, hi: data?.g?.hi, ini: '' },
    date: data?.date,
  });

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-sindoor">Link looks incomplete</h1>
          <p className="mt-2 text-sm">Please ask the family for the invitation link again.</p>
          <a className="btn-primary mt-4" href={window.location.pathname}>Open Shaadi Studio</a>
        </div>
      </div>
    );
  }

  const hi = n.hi;
  const fns = data.fns || [];
  const setC = (id, v) => setCounts((c) => ({ ...c, [id]: Math.max(0, Math.min(20, v)) }));
  const msg = [
    `${data.fam} ${hi ? 'परिवार — RSVP' : 'family RSVP'} 🙏`,
    ...fns.map((f) => `${f.en}: ${counts[f.id] ?? 0}`),
  ].join('\n');
  const wa = `https://wa.me/${(data.host || '').replace(/[^\d]/g, '')}?text=${encodeURIComponent(msg)}`;
  const upi = upiLink(data.upi);

  return (
    <div className="min-h-screen pb-16">
      <div className="relative overflow-hidden bg-gradient-to-b from-sindoor to-[#3a0707] px-5 pb-10 pt-8 text-center text-ivory">
        <button onClick={() => setLang(hi ? 'en' : 'hi')} className="btn-gold absolute right-3 top-3 !px-3 !py-1 text-xs"><Languages size={14} /> {hi ? 'English' : 'हिन्दी'}</button>
        <div className="font-deva text-gold">॥ श्री गणेशाय नमः ॥</div>
        <p className="mt-5 font-display text-sm tracking-widest text-gold">{hi ? `नमस्ते, ${data.fam} परिवार` : `NAMASTE, ${String(data.fam).toUpperCase()} FAMILY`}</p>
        <h1 className="mt-3 font-display text-4xl font-black leading-tight">{n.b}</h1>
        <div className="font-display text-2xl text-gold">&amp;</div>
        <h1 className="font-display text-4xl font-black leading-tight">{n.g}</h1>
        <p className="mt-4 font-display text-sm opacity-90">{hi ? 'आपको सादर आमंत्रित करते हैं' : 'warmly invite you to celebrate with us'}</p>
        <p className="font-display text-lg font-semibold text-gold">{n.dateStr}</p>
      </div>

      <div className="mx-auto -mt-4 max-w-xl space-y-4 px-4">
        <h2 className="pt-6 font-display text-xl font-bold text-sindoor">{hi ? 'आपके लिए समारोह' : 'Your celebrations'}</h2>
        {fns.map((f) => <FnCard key={f.id} f={f} hi={hi} />)}

        {data.kids?.length > 0 && (
          <div className="card bg-marigold/10">
            <h3 className="font-display text-sm font-bold text-sindoor">{hi ? 'बाल मनुहार' : 'Bal Manuhar 🧒'}</h3>
            <ul className="mt-1 space-y-1 text-xs">{data.kids.map((k, i) => <li key={i}>✦ {k}</li>)}</ul>
          </div>
        )}

        <SongCard song={data.song} hi={hi} />

        <div className="card">
          <h3 className="font-display text-lg font-bold text-sindoor">{hi ? 'कितने लोग आएँगे?' : 'How many of you can come?'}</h3>
          <div className="mt-2 space-y-2">
            {fns.map((f) => (
              <div key={f.id} className="flex items-center justify-between">
                <span className="text-sm font-semibold">{hi ? f.hi : f.en}</span>
                <div className="flex items-center gap-3">
                  <button className="rounded-full border border-gold p-1.5" onClick={() => setC(f.id, (counts[f.id] ?? 0) - 1)} aria-label="less"><Minus size={14} /></button>
                  <span className="w-5 text-center font-bold">{counts[f.id] ?? 0}</span>
                  <button className="rounded-full border border-gold p-1.5" onClick={() => setC(f.id, (counts[f.id] ?? 0) + 1)} aria-label="more"><Plus size={14} /></button>
                </div>
              </div>
            ))}
          </div>
          <a href={wa} target="_blank" rel="noreferrer" className={`btn-primary mt-4 w-full ${data.host ? '' : 'pointer-events-none opacity-50'}`}>
            <MessageCircle size={16} /> {hi ? 'WhatsApp पर जवाब दें' : 'Reply on WhatsApp'}
          </a>
          {!data.host && <p className="mt-1 text-center text-[11px] text-sindoor/60">{hi ? 'होस्ट ने अभी WhatsApp नंबर नहीं जोड़ा है।' : 'The hosts haven’t added a WhatsApp number yet.'}</p>}
        </div>

        {upi && (
          <a href={upi} className="btn-gold w-full"><Wallet size={16} /> {hi ? 'शगुन भेजें (UPI)' : 'Send shagun (UPI)'}</a>
        )}

        <p className="pt-4 text-center text-[11px] text-sindoor/50">
          Made with Shaadi Studio
          {window.location.protocol.startsWith('http') && (
            <> · <a className="underline" href={window.location.pathname}>{hi ? 'अपना बनाएँ' : 'make your own'}</a></>
          )}
        </p>
      </div>
    </div>
  );
}
