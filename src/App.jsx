import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Image as ImageIcon, Languages, Mail, Palette, Users } from 'lucide-react';
import { useApp, useNames } from './store.jsx';
import { INITIAL_OPTIONS } from './translit.js';
import InvitesTab from './tabs/InvitesTab.jsx';
import LogoTab from './tabs/LogoTab.jsx';
import PhotoTab from './tabs/PhotoTab.jsx';
import RsvpTab from './tabs/RsvpTab.jsx';
import GuestSite from './GuestSite.jsx';

const TABS = [
  { id: 'invites', en: 'Invites', hi: 'निमंत्रण', Icon: Mail, C: InvitesTab },
  { id: 'logo', en: 'Logo', hi: 'लोगो', Icon: Palette, C: LogoTab },
  { id: 'photo', en: 'Shoot', hi: 'फोटोशूट', Icon: ImageIcon, C: PhotoTab },
  { id: 'rsvp', en: 'RSVP', hi: 'आरएसवीपी', Icon: Users, C: RsvpTab },
];

function IniSelect({ side }) {
  const { s, setIni } = useApp();
  const n = useNames();
  const eng = (side === 'b' ? n.bI : n.gI) || 'A';
  const opts = INITIAL_OPTIONS[eng] || [];
  const cur = s[side].ini;
  return (
    <select
      aria-label={`${side === 'b' ? 'Bride' : 'Groom'} Hindi initial`}
      className="field !w-16 !px-1 text-center font-deva"
      value={cur}
      onChange={(e) => setIni(side, e.target.value)}
    >
      <option value="">{side === 'b' ? n.bH : n.gH} ✦</option>
      {opts.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}

function Personalizer() {
  const { s, patch, setName, setHi } = useApp();
  const [more, setMore] = useState(false);
  const hi = s.lang === 'hi';
  return (
    <header className="sticky top-0 z-40 border-b border-gold/50 bg-ivory/95 backdrop-blur">
      <div className="mx-auto max-w-3xl px-3 pt-2 pb-2">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-base font-bold text-sindoor">
            {hi ? 'शादी स्टूडियो' : 'Shaadi Studio'} <span className="text-gold">✦</span>
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => patch({ lang: hi ? 'en' : 'hi' })}
              className="btn-gold !px-3 !py-1 text-xs"
              aria-label="Toggle language"
            >
              <Languages size={14} /> {hi ? 'English' : 'हिन्दी'}
            </button>
            <button onClick={() => setMore(!more)} className="btn-ghost !px-2 !py-1" aria-label="More">
              {more ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2">
          <input className="field" placeholder="Bride (English)" value={s.b.en} onChange={(e) => setName('b', e.target.value)} />
          <input className="field" placeholder="Groom (English)" value={s.g.en} onChange={(e) => setName('g', e.target.value)} />
          <div className="flex gap-1">
            <input className="field font-deva" placeholder="दुल्हन (हिन्दी)" value={s.b.hi} onChange={(e) => setHi('b', e.target.value)} />
            <IniSelect side="b" />
          </div>
          <div className="flex gap-1">
            <input className="field font-deva" placeholder="दूल्हा (हिन्दी)" value={s.g.hi} onChange={(e) => setHi('g', e.target.value)} />
            <IniSelect side="g" />
          </div>
        </div>

        {more && (
          <div className="mt-2 grid grid-cols-3 gap-2">
            <div>
              <label className="label">{hi ? 'विवाह तिथि' : 'Wedding date'}</label>
              <input type="date" className="field" value={s.date} onChange={(e) => patch({ date: e.target.value })} />
            </div>
            <div>
              <label className="label">{hi ? 'दुल्हन का शहर' : "Bride's city"}</label>
              <input className="field" value={s.bCity} onChange={(e) => patch({ bCity: e.target.value })} />
            </div>
            <div>
              <label className="label">{hi ? 'दूल्हे का शहर' : "Groom's city"}</label>
              <input className="field" value={s.gCity} onChange={(e) => patch({ gCity: e.target.value })} />
            </div>
            <p className="col-span-3 text-[11px] text-sindoor/60">
              {hi
                ? 'अंग्रेज़ी नाम लिखने पर हिन्दी अपने-आप बनती है। हिन्दी बॉक्स में बदलाव करें तो ऑटो बंद हो जाता है।'
                : 'Hindi auto-fills as you type English. Edit the Hindi box yourself and auto-fill pauses for that name. Pick स / श etc. with the ✦ selector.'}
            </p>
          </div>
        )}
      </div>
    </header>
  );
}

export default function App() {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  // ?g=<token> (hosted link) or window.__GUEST__ (downloaded offline invitation file)
  const guest = params.get('g') || window.__GUEST__;
  const { s } = useApp();
  const [tab, setTab] = useState('invites');
  const hi = s.lang === 'hi';

  if (guest) return <GuestSite token={guest} />;

  const Active = TABS.find((t) => t.id === tab).C;
  return (
    <div className="min-h-screen pb-24">
      <Personalizer />
      <main className="mx-auto max-w-3xl px-3 pt-3">
        <Active />
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/60 bg-sindoor pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto grid max-w-3xl grid-cols-4">
          {TABS.map(({ id, en, hi: h, Icon }) => (
            <button
              key={id}
              onClick={() => { setTab(id); window.scrollTo({ top: 0 }); }}
              className={`flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold ${tab === id ? 'text-gold' : 'text-ivory/70'}`}
            >
              <Icon size={20} />
              {hi ? h : en}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
