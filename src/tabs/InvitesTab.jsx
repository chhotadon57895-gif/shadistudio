import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, X } from 'lucide-react';
import { useNames } from '../store.jsx';
import { INVITES } from './invites.jsx';
import { WALKS, WalkExperience } from './walks.jsx';

function PhoneModal({ title, onClose, children }) {
  const [k, setK] = useState(0);
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="mb-3 flex w-[300px] items-center justify-between text-ivory" onClick={(e) => e.stopPropagation()}>
        <span className="font-display text-sm font-bold">{title}</span>
        <div className="flex gap-2">
          <button className="rounded-full bg-white/15 p-2" onClick={() => setK(k + 1)} aria-label="Replay"><RotateCcw size={16} /></button>
          <button className="rounded-full bg-white/15 p-2" onClick={onClose} aria-label="Close"><X size={16} /></button>
        </div>
      </div>
      <motion.div
        initial={{ y: 40, scale: 0.95 }} animate={{ y: 0, scale: 1 }}
        className="relative overflow-hidden rounded-[38px] border-[8px] border-black bg-black shadow-2xl"
        style={{ width: 300, height: 560 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute left-1/2 top-0 z-[200] h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-black" />
        <div key={k} className="h-full w-full">{children}</div>
      </motion.div>
    </motion.div>
  );
}

function Tile({ g, e, title, sub, onClick, children }) {
  return (
    <button onClick={onClick} className="group overflow-hidden rounded-2xl border border-gold/50 bg-white text-left shadow-sm active:scale-[.98]">
      <div className={`relative flex h-36 flex-col items-center justify-center bg-gradient-to-br ${g}`}>
        <span className="text-3xl opacity-90">{e}</span>
        {children}
      </div>
      <div className="p-2.5">
        <div className="font-display text-sm font-bold text-sindoor">{title}</div>
        <div className="text-[11px] text-sindoor/60">{sub}</div>
      </div>
    </button>
  );
}

export default function InvitesTab() {
  const n = useNames();
  const [open, setOpen] = useState(null); // {kind,id}

  const inv = open?.kind === 'invite' ? INVITES.find((i) => i.id === open.id) : null;
  const walk = open?.kind === 'walk' ? WALKS.find((w) => w.id === open.id) : null;

  return (
    <div className="space-y-6">
      <section>
        <h2 className="font-display text-xl font-bold text-sindoor">{n.t('Tap-to-open invites', 'छूकर खोलें निमंत्रण')}</h2>
        <p className="mb-3 text-xs text-sindoor/60">{n.t('10 interactive cards. Your names redraw live in every one.', '10 इंटरैक्टिव कार्ड। आपके नाम हर कार्ड में तुरंत बदलते हैं।')}</p>
        <div className="grid grid-cols-2 gap-3">
          {INVITES.map((i) => (
            <Tile key={i.id} g={i.g} e={i.e} title={n.hi ? i.hi : i.en} sub={i.hint} onClick={() => setOpen({ kind: 'invite', id: i.id })}>
              <span className="mt-1 rounded-full bg-black/25 px-2 py-0.5 font-display text-[11px] font-semibold text-white">
                {n.b} ♥ {n.g}
              </span>
            </Tile>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-bold text-sindoor">{n.t('Royal scroll-walk websites', 'शाही स्क्रॉल-वॉक वेबसाइट')}</h2>
        <p className="mb-3 text-xs text-sindoor/60">{n.t('Scroll to walk through archways, room by room — one room per function.', 'स्क्रॉल करके मेहराबों से गुज़रें — हर समारोह का एक कमरा।')}</p>
        <div className="grid grid-cols-2 gap-3">
          {WALKS.map((w, idx) => (
            <Tile
              key={w.id}
              g="from-sindoor to-black"
              e={w.e}
              title={n.hi ? w.hi : w.en}
              sub={w.sub}
              onClick={() => setOpen({ kind: 'walk', id: w.id })}
            >
              <span className="mt-1 font-display text-[11px] text-gold">{n.b} & {n.g}</span>
              <span className="absolute right-2 top-2 rounded-full bg-gold px-1.5 text-[10px] font-bold text-sindoor">{idx + 1}</span>
            </Tile>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {inv && (
          <PhoneModal key="inv" title={n.hi ? inv.hi : inv.en} onClose={() => setOpen(null)}>
            <inv.Comp />
          </PhoneModal>
        )}
        {walk && (
          <PhoneModal key="walk" title={n.hi ? walk.hi : walk.en} onClose={() => setOpen(null)}>
            <WalkExperience walk={walk} />
          </PhoneModal>
        )}
      </AnimatePresence>
    </div>
  );
}
