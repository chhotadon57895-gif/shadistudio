# Shaadi Studio

A 100% client-side, mobile-first Indian wedding design & RSVP app.
React + Tailwind + Framer Motion + Lucide. No backend, no database, no paid service.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # outputs dist/
```

## Deploy free

**Vercel**: import the repo, framework "Vite", done.

**GitHub Pages**: push to `main`. The included workflow (`.github/workflows/deploy.yml`)
builds and publishes. In the repo go to Settings → Pages → Source: "GitHub Actions".
`vite.config.js` uses `base: './'`, so sub-path hosting works.

## What is where

| Spec section | Files |
|---|---|
| Bilingual personalizer, transliteration, theme | `src/App.jsx`, `src/store.jsx`, `src/translit.js` |
| Tab 1: 10 invites | `src/tabs/invites.jsx`, `src/tabs/InvitesTab.jsx` |
| Tab 1: 5 scroll-walk experiences | `src/tabs/walks.jsx` |
| Tab 2: 7 logo styles, 4 modes, 6 mockups, SVG/PNG export | `src/tabs/logos.jsx`, `LogoTab.jsx`, `src/exportUtils.js` |
| Tab 3: gallery, selfie slider, 10 canvas templates | `src/tabs/PhotoTab.jsx`, `src/tabs/countdown.js` |
| Tab 4: functions, family links, QR, UPI, paste-box parser | `src/tabs/RsvpTab.jsx`, `src/GuestSite.jsx`, `src/rsvpParser.js` |

## Offline use

- The production build (`npm run build`) is ONE self-contained `dist/index.html` (JS, CSS and fonts inlined).
- **Offline invitation file:** in Tab 4 → Family links, tap **Offline file** on a family. It downloads
  `invitation-<family>.html`: the whole app with that family's greeting and permitted functions baked in.
  Send it on WhatsApp; the guest opens it in their phone browser with no internet. Only the
  "Reply on WhatsApp" button and the UPI link need a connection/app.
  This works from the built/deployed site (or `npm run preview`), not from `npm run dev`.
- **Hosted link:** after a guest opens the link once online, a small service worker (`public/sw.js`)
  caches it, so the same link opens offline later. The host can also "Add to Home Screen".
- AI photo generation (Pollinations) always needs internet.

## How the family links work

The host's data lives in `localStorage`. "Copy link" encodes the couple's names, the date and
**only that family's permitted functions** into a `?g=` query parameter. Opening that link renders
the guest page (greeting by family name, permitted functions only, a headcount stepper and a
"Reply on WhatsApp" button that pre-fills a message to the host number). No server is involved.

Note: the link contains the event details in readable (base64) form, so treat it as
"unlisted", not secret.

## Known limits (please read)

- **Selfie → Portrait** uses Pollinations' free text-to-image API. It cannot preserve your face; it
  produces a style preview next to your selfie. Your selfie never leaves the device.
- Pollinations is a free third-party service and may be slow or rate-limited.
- Hindi transliteration is rule-based plus a small names dictionary. Edit the Hindi box when it is off;
  pick स / श etc. with the ✦ selector.
- Fonts (Playfair Display + Noto Serif Devanagari) are bundled into the app via @fontsource, so there is no Google Fonts request and exports keep the right fonts offline.
- The WhatsApp paste parser handles common phrasings ("Haldi 3, Sangeet 2", "5 for wedding",
  "all 4 of us", "sorry can't make it") and flags anything else as `unclear`.
- Inspired by the idea of Saath Studio; all code, art and copy here is original.
