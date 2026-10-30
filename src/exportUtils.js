// Client-side SVG / PNG export helpers (no server involved).

let fontCssPromise;

// Fetches the Google Fonts CSS once and inlines the font files as data URIs so the
// exported SVG / PNG keeps Playfair Display + Noto Serif Devanagari. If the user is
// offline this quietly falls back to system serif fonts.
// Fonts already bundled into the page (data: URIs in the production build) are reused first,
// so exports work offline too.
function bundledFontCss() {
  const out = [];
  try {
    for (const sheet of Array.from(document.styleSheets)) {
      let rules;
      try { rules = sheet.cssRules; } catch { continue; }
      for (const r of Array.from(rules || [])) {
        if (r.type === 5 && /url\(\s*["']?data:/.test(r.cssText)) out.push(r.cssText);
      }
    }
  } catch { /* ignore */ }
  return out.join('\n');
}

async function fontCss() {
  const local = bundledFontCss();
  if (local) return local;
  if (!fontCssPromise) {
    fontCssPromise = (async () => {
      try {
        const url =
          'https://fonts.googleapis.com/css2?family=Noto+Serif+Devanagari:wght@400;600;700&family=Playfair+Display:wght@400;600;700;900&display=swap';
        let css = await (await fetch(url)).text();
        const urls = [...new Set([...css.matchAll(/url\((https:[^)]+)\)/g)].map((m) => m[1]))];
        for (const u of urls) {
          const blob = await (await fetch(u)).blob();
          const data = await new Promise((resolve) => {
            const fr = new FileReader();
            fr.onload = () => resolve(fr.result);
            fr.readAsDataURL(blob);
          });
          css = css.split(u).join(data);
        }
        return css;
      } catch {
        return '';
      }
    })();
  }
  return fontCssPromise;
}

export async function svgToString(svgEl, w = 800, h = 880) {
  const c = svgEl.cloneNode(true);
  c.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  c.setAttribute('width', w);
  c.setAttribute('height', h);
  const css = await fontCss();
  if (css) {
    const st = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    st.textContent = css;
    c.insertBefore(st, c.firstChild);
  }
  return new XMLSerializer().serializeToString(c);
}

// Builds a standalone offline invitation: the app's own single-file HTML with one family's
// token pre-loaded. Pure function so it is easy to test.
export function makeOfflineHtml(html, token) {
  if (/<script[^>]+\ssrc=/i.test(html)) {
    throw new Error('NOT_SINGLE_FILE');
  }
  if (!/^[A-Za-z0-9_-]+$/.test(token)) throw new Error('BAD_TOKEN');
  const inject = `<script>window.__GUEST__=${JSON.stringify(token)};</script>`;
  return html.includes('<head>') ? html.replace('<head>', `<head>${inject}`) : inject + html;
}

export async function fetchSelfHtml() {
  const res = await fetch(`${window.location.origin}${window.location.pathname}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('FETCH_FAILED');
  return res.text();
}

export function saveBlob(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

export async function downloadSvg(svgEl, name) {
  const str = await svgToString(svgEl);
  saveBlob(new Blob([str], { type: 'image/svg+xml' }), name);
}

export async function downloadPng(svgEl, name, scale = 3) {
  const w = 400 * scale;
  const h = 440 * scale;
  const str = await svgToString(svgEl, w, h);
  const url = URL.createObjectURL(new Blob([str], { type: 'image/svg+xml;charset=utf-8' }));
  await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const cv = document.createElement('canvas');
      cv.width = w;
      cv.height = h;
      cv.getContext('2d').drawImage(img, 0, 0, w, h);
      cv.toBlob((b) => {
        saveBlob(b, name);
        resolve();
      }, 'image/png');
    };
    img.onerror = reject;
    img.src = url;
  });
  URL.revokeObjectURL(url);
}
