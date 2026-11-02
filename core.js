'use strict';
/* ===== utils ===== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = (p = 'x') => p + Math.random().toString(36).slice(2, 9);
const clone = o => JSON.parse(JSON.stringify(o));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const fmt = n => (Math.round(+n || 0)).toLocaleString('ru-RU').replace(/,/g, ' ');
function getP(o, p) { return String(p).split('.').reduce((a, k) => (a == null ? a : a[k]), o); }
function setP(o, p, v) {
  const ks = String(p).split('.'); let a = o;
  for (let i = 0; i < ks.length - 1; i++) { if (a[ks[i]] == null) a[ks[i]] = /^\d+$/.test(ks[i + 1]) ? [] : {}; a = a[ks[i]]; }
  a[ks[ks.length - 1]] = v;
}
const LS = {
  get(k, d) { try { const v = localStorage.getItem('tap2_' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('tap2_' + k, JSON.stringify(v)); } catch (e) { } },
  del(k) { try { localStorage.removeItem('tap2_' + k); } catch (e) { } }
};
function translit(s) {
  const T = { а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sh', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya', ä: 'a', ç: 'c', ň: 'n', ö: 'o', ş: 's', ü: 'u', ý: 'y', ž: 'z' };
  return String(s || '').toLowerCase().split('').map(c => T[c] !== undefined ? T[c] : c).join('').replace(/[^a-z0-9]+/g, '').slice(0, 20);
}
const ARTIFACT_URL = 'https://claude.ai/artifact/AYCN6nYvomdpGDWk8matgE';
const SITE_BASE = /github\.io$/i.test(location.hostname) ? location.origin + location.pathname : ARTIFACT_URL;

/* ===== colours ===== */
function hx(h) { h = String(h || '#000').replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); const n = parseInt(h.slice(0, 6), 16) || 0; return [n >> 16, (n >> 8) & 255, n & 255]; }
function toHex(a) { return '#' + a.map(v => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join(''); }
function mix(a, b, t) { const x = hx(a), y = hx(b); return toHex(x.map((v, i) => v + (y[i] - v) * t)); }
function lum(h) { const [r, g, b] = hx(h); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; }
function onC(h) { return lum(h) > 0.62 ? '#15161c' : '#ffffff'; }
function validHex(h) { return /^#[0-9a-f]{6}$/i.test(String(h || '')); }

const FONTS = ['Onest', 'Unbounded', 'Manrope', 'Montserrat', 'Rubik', 'Comfortaa', 'Playfair Display', 'Lora', 'Oswald', 'Golos Text', 'Exo 2', 'Prata', 'Raleway', 'Nunito', 'Cormorant Garamond', 'Jost'];

/* ===== placeholder art (carpet-like geometry, never remote images) ===== */
function art(seed, p, bg) {
  let s = 7; for (const c of String(seed)) s = (s * 31 + c.charCodeAt(0)) >>> 0;
  const r = () => ((s = (s * 1103515245 + 12345) >>> 0) / 4294967296);
  const base = mix(bg, p, 0.16), c2 = mix(p, bg, 0.3), c3 = mix(p, '#000', 0.15), c4 = mix(bg, '#fff', 0.4);
  let g = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400' preserveAspectRatio='xMidYMid slice'><rect width='400' height='400' fill='${base}'/>`;
  const kind = Math.floor(r() * 4);
  const oct = (cx, cy, R, f) => `<polygon points='${[...Array(8)].map((_, i) => { const a = Math.PI / 8 + i * Math.PI / 4; return (cx + R * Math.cos(a)).toFixed(1) + ',' + (cy + R * Math.sin(a)).toFixed(1); }).join(' ')}' fill='${f}'/>`;
  if (kind === 0) {
    for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) { const cx = 67 + x * 133, cy = 67 + y * 133; g += oct(cx, cy, 46, (x + y) % 2 ? c2 : c3) + `<rect x='${cx - 13}' y='${cy - 13}' width='26' height='26' transform='rotate(45 ${cx} ${cy})' fill='${c4}'/>`; }
  } else if (kind === 1) {
    g += `<circle cx='${130 + r() * 140}' cy='${150 + r() * 80}' r='${120 + r() * 30}' fill='${c2}'/>`; for (let i = 0; i < 7; i++) g += `<rect x='0' y='${292 + i * 15}' width='400' height='7' fill='${c3}' opacity='${(0.35 + i * 0.09).toFixed(2)}'/>`;
  } else if (kind === 2) {
    g += `<polygon points='200,30 370,200 200,370 30,200' fill='${c2}'/><polygon points='200,100 300,200 200,300 100,200' fill='${c3}'/>` + oct(200, 200, 34, c4);
  } else {
    g += `<rect x='40' y='40' width='150' height='320' rx='75' fill='${c2}'/><rect x='210' y='40' width='150' height='150' fill='${c3}'/><circle cx='285' cy='285' r='75' fill='${c4}'/>`;
  }
  g += '</svg>';
  return "url('data:image/svg+xml," + encodeURIComponent(g).replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29') + "')";
}

/* ===== images: store as img:<id>, cache data URLs ===== */
const IMG = {};
const IMG_WAIT = {};
let onImgLoaded = () => { };
function imgCss(val, seed, th) {
  if (val && String(val).startsWith('img:')) {
    const id = val.slice(4);
    if (!IMG[id]) { const l = LS.get('img_' + id, null); if (l) IMG[id] = l; }
    if (IMG[id]) return `url('${IMG[id]}')`;
    if (!IMG_WAIT[id]) { IMG_WAIT[id] = 1; Store.get('imgs', id).then(r => { if (r && r.d) { IMG[id] = r.d; onImgLoaded(); } }); }
  } else if (val && String(val).startsWith('data:image/jp')) return `url('${val}')`;
  return art(seed, th.p, th.bg);
}
function fileToData(file, max = 1100) {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file); const im = new Image();
    im.onload = () => {
      let w = im.width, h = im.height; const k = Math.min(1, max / Math.max(w, h)); w = Math.round(w * k); h = Math.round(h * k);
      const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d');
      x.fillStyle = '#fff'; x.fillRect(0, 0, w, h); x.drawImage(im, 0, 0, w, h);
      let q = 0.82, d = c.toDataURL('image/jpeg', q);
      while (d.length > 185000 && q > 0.35) { q -= 0.1; d = c.toDataURL('image/jpeg', q); }
      if (d.length > 185000) { c.width = Math.round(w * 0.6); c.height = Math.round(h * 0.6); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); d = c.toDataURL('image/jpeg', 0.6); }
      URL.revokeObjectURL(url); res(d);
    };
    im.onerror = () => rej(new Error('bad image')); im.src = url;
  });
}
async function addImage(file) { const d = await fileToData(file); const id = uid('i'); IMG[id] = d; LS.set('img_' + id, d); return 'img:' + id; }
function dominantColor(dataUrl) {
  return new Promise(res => {
    const im = new Image(); im.onload = () => {
      const c = document.createElement('canvas'); c.width = c.height = 48; const x = c.getContext('2d'); x.drawImage(im, 0, 0, 48, 48);
      const d = x.getImageData(0, 0, 48, 48).data; const cnt = {};
      for (let i = 0; i < d.length; i += 4) { if (d[i + 3] < 128) continue; const k = (d[i] >> 5) + ',' + (d[i + 1] >> 5) + ',' + (d[i + 2] >> 5); cnt[k] = (cnt[k] || 0) + 1; }
      let best = null, bs = -1; for (const k in cnt) { const [r, g, b] = k.split(',').map(n => n * 32 + 16); const mx = Math.max(r, g, b), mn = Math.min(r, g, b); const sat = mx ? (mx - mn) / mx : 0; const sc = cnt[k] * (0.2 + sat); if (sat > 0.25 && mx > 50 && sc > bs) { bs = sc; best = [r, g, b]; } }
      res(best ? toHex(best) : null);
    }; im.onerror = () => res(null); im.src = dataUrl;
  });
}

/* ===== storage: artifact db, with local fallback ===== */
const Store = {
  db: null, mem: LS.get('mem', { sites: {}, orders: {}, chats: {}, imgs: {} }), subs: [], ready: null,
  async init() {
    try { if (window.claude && window.claude.use) this.db = await window.claude.use('db'); } catch (e) { this.db = null; }
    for (const k of ['sites', 'orders', 'chats', 'imgs']) this.mem[k] = this.mem[k] || {};
  },
  _emit() { const m = clone(this.mem); m.imgs = {}; LS.set('mem', m); this.subs.forEach(f => { try { f(); } catch (e) { console.warn(e); } }); },
  watch(name, where, cb) {
    if (this.db) {
      let q = this.db.collection(name); if (where) q = q.where(where[0], '==', where[1]);
      return q.onSnapshot(s => cb(s.docs.map(d => Object.assign({ id: d.id }, d.data()))), e => console.warn('db', e));
    }
    const f = () => cb(Object.entries(this.mem[name] || {}).map(([id, v]) => Object.assign({ id }, v)).filter(r => !where || r[where[0]] === where[1]));
    this.subs.push(f); setTimeout(f, 0); return () => { this.subs = this.subs.filter(x => x !== f); };
  },
  watchDoc(name, id, cb) {
    if (this.db) return this.db.doc(name + '/' + id).onSnapshot(s => cb(s.exists ? s.data() : null), e => console.warn(e));
    const f = () => cb(this.mem[name][id] || null); this.subs.push(f); setTimeout(f, 0); return () => { this.subs = this.subs.filter(x => x !== f); };
  },
  async put(name, id, data) { if (this.db) { try { await this.db.doc(name + '/' + id).set(data); return true; } catch (e) { console.warn(e); toast('Не сохранилось', e.code === 'quota_exceeded' ? 'База переполнена' : 'Нет доступа к базе — проверьте вход в Claude'); return false; } } this.mem[name][id] = clone(data); this._emit(); return true; },
  async patch(name, id, data) { if (this.db) { try { await this.db.doc(name + '/' + id).update(data); return true; } catch (e) { console.warn(e); return false; } } this.mem[name][id] = Object.assign(this.mem[name][id] || {}, clone(data)); this._emit(); return true; },
  async get(name, id) { if (this.db) { try { const s = await this.db.doc(name + '/' + id).get(); return s.exists ? s.data() : null; } catch (e) { return null; } } return this.mem[name][id] || null; }
};
const UPLOADED = {};
async function uploadImagesOf(obj) {
  const ids = new Set(); JSON.stringify(obj, (k, v) => { if (typeof v === 'string' && v.startsWith('img:')) ids.add(v.slice(4)); return v; });
  for (const id of ids) { if (UPLOADED[id] || !IMG[id]) continue; const ok = await Store.put('imgs', id, { d: IMG[id] }); if (ok) UPLOADED[id] = 1; }
}

/* ===== AI (Claude via the artifact's sample capability) ===== */
const AI = {
  s: null, imgs: false, ready: null,
  async init() {
    try { if (window.claude && window.claude.use) this.s = await window.claude.use('sample'); } catch (e) { this.s = null; }
    if (this.s) { try { const l = await this.s.limits(); this.imgs = !!(l && l.images); } catch (e) { } } else if (this.proxy()) { this.imgs = true; fetch(this.proxy()).catch(() => { }); /* wake the free server early */ }
  },
  msg(e) {
    const m = { not_granted: 'ИИ не разрешён. Обновите страницу и нажмите «Разрешить».', sampling_disabled: 'ИИ недоступен для этого аккаунта.', rate_limited: 'Слишком много запросов — попробуйте через минуту.', refused: 'ИИ не стал это делать — сформулируйте иначе.', invalid_json: 'ИИ ответил неразборчиво — нажмите ещё раз.', image_rejected: 'Фото не подошло — выберите JPG или PNG.', images_unavailable: 'Здесь нельзя отправить фото в ИИ.', session_expired: 'Войдите в Claude заново.', prompt_too_large: 'Слишком много данных для ИИ.' };
    return m[e && e.code] || 'ИИ не ответил. Попробуйте ещё раз.';
  },
  /* Without Claude (e.g. GitHub Pages) the page calls our own proxy; the API key lives only on the proxy. */
  proxy() { return (window.TAP_CONFIG && window.TAP_CONFIG.aiProxy) || ''; },
  async viaProxy(prompt, o, wantJson) {
    const msgs = typeof prompt === 'string' ? [{ role: 'user', content: prompt }] : prompt.map(m => ({ role: m.role, content: m.content }));
    if (wantJson) msgs[msgs.length - 1].content += '\n\nОтветь только JSON, без пояснений и без markdown.';
    const imgs = o.images ? (o.images instanceof Blob ? [o.images] : [...o.images]) : [];
    if (imgs.length) {
      const blocks = [];
      for (const b of imgs.slice(0, 4)) { const d = await new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(b); }); const m = String(d).match(/^data:(image\/[a-z]+);base64,(.*)$/); if (m) blocks.push({ type: 'image', source: { type: 'base64', media_type: m[1], data: m[2] } }); }
      const last = msgs[msgs.length - 1]; last.content = [...blocks, { type: 'text', text: last.content }];
    }
    const r = await fetch(this.proxy(), { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ messages: msgs, tier: o.modelTier || 'default' }) });
    if (!r.ok) throw { code: r.status === 429 ? 'rate_limited' : 'upstream_error' };
    const j = await r.json(); const text = String(j.text || '');
    if (!wantJson) return text;
    const t = text.trim(); const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/);
    const cand = fence ? fence[1] : t.slice(Math.min(...['{', '['].map(c => t.indexOf(c)).filter(i => i >= 0)), Math.max(t.lastIndexOf('}'), t.lastIndexOf(']')) + 1);
    try { return JSON.parse(cand); } catch (e) { throw { code: 'invalid_json' }; }
  },
  async json(prompt, o = {}) {
    await this.ready;
    try {
      if (this.s) return await this.s.json(prompt, o);
      if (this.proxy()) return await this.viaProxy(prompt, o, true);
      toast('ИИ не подключён', 'Укажите адрес ИИ-прокси в config.js'); return null;
    } catch (e) { if (e && e.code !== 'cancelled') toast('ИИ', this.msg(e)); return null; }
  },
  async text(prompt, o = {}) {
    await this.ready;
    try {
      if (this.s) { const r = await this.s(prompt, o); return r.text; }
      if (this.proxy()) return await this.viaProxy(prompt, o, false);
      toast('ИИ не подключён', 'Укажите адрес ИИ-прокси в config.js'); return null;
    } catch (e) { if (e && e.code !== 'cancelled') toast('ИИ', this.msg(e)); return null; }
  }
};
AI.ready = AI.init();
Store.ready = Store.init();

/* ===== toast / sheet ===== */
let _tt;
function toast(t, d) {
  const el = $('#toast'); if (!el) return;
  el.innerHTML = `<div class="t-mark">${LOGO_MARK}</div><div><b>${esc(t)}</b>${d ? `<span>${esc(d)}</span>` : ''}</div>`;
  el.classList.add('show'); clearTimeout(_tt); _tt = setTimeout(() => el.classList.remove('show'), 3600);
}
function sheet(html, cls = '') {
  const m = $('#sheet'); m.className = 'sheet-wrap show ' + cls;
  m.innerHTML = `<div class="sheet" role="dialog"><button class="sheet-x" aria-label="Закрыть" onclick="closeSheet()">${IC.x}</button>${html}</div>`;
  m.onclick = e => { if (e.target === m) closeSheet(); };
}
function closeSheet() { const m = $('#sheet'); m.className = 'sheet-wrap'; m.innerHTML = ''; }

/* ===== icons ===== */
const sv = (p, w = 20) => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const IC = {
  back: sv('<path d="M15 18l-6-6 6-6"/>'), x: sv('<path d="M18 6L6 18M6 6l12 12"/>'), plus: sv('<path d="M12 5v14M5 12h14"/>'),
  desk: sv('<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>'), mob: sv('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>'),
  undo: sv('<path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 010 10h-3"/>'), redo: sv('<path d="M15 14l5-5-5-5"/><path d="M20 9H9a5 5 0 000 10h3"/>'),
  eye: sv('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
  blocks: sv('<rect x="3" y="3" width="18" height="6" rx="1.5"/><rect x="3" y="12" width="8" height="9" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/>'),
  palette: sv('<path d="M12 3a9 9 0 100 18c1.1 0 1.5-.8 1.5-1.6 0-1.2-1-1.5-1-2.6 0-1 .8-1.8 1.8-1.8H17a4 4 0 004-4c0-4.4-4-8-9-8z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>'),
  box: sv('<path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>'),
  spark: sv('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>'),
  trash: sv('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>'), copy: sv('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 00-1-1H5a1 1 0 00-1 1v10a1 1 0 001 1h3"/>'),
  up: sv('<path d="M12 19V5M5 12l7-7 7 7"/>'), down: sv('<path d="M12 5v14M19 12l-7 7-7-7"/>'), cog: sv('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/>'),
  bag: sv('<path d="M6 7h12l1 13H5L6 7z"/><path d="M9 7a3 3 0 016 0"/>'), search: sv('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>'),
  cam: sv('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>'), pin: sv('<path d="M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
  heart: sv('<path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z"/>'), chat: sv('<path d="M4 5h16v11H9l-5 4z"/>'),
  home: sv('<path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z"/>'), inbox: sv('<path d="M3 13l3-8h12l3 8v6H3z"/><path d="M3 13h5l1 3h6l1-3h5"/>'),
  mega: sv('<path d="M3 10v4h4l6 5V5L7 10z"/><path d="M17 8a5 5 0 010 8"/>'), grid: sv('<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>'),
  crown: sv('<path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z"/>'), check: sv('<path d="M5 12l5 5 9-10"/>'), img: sv('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 17l-5-5-9 8"/>'),
  text: sv('<path d="M5 6h14M12 6v13M9 19h6"/>'), square: sv('<rect x="5" y="5" width="14" height="14" rx="2"/>'), link: sv('<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/>'),
  send: sv('<path d="M4 12l16-8-6 16-3-7z"/>'), upload: sv('<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v4h16v-4"/>'), star: sv('<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>'),
  qr: sv('<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM18 18h3v3h-3z"/>'), menu: sv('<path d="M4 7h16M4 12h16M4 17h16"/>'),
  truck: sv('<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>'), bolt: sv('<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>')
};
const LOGO_MARK = `<svg viewBox="0 0 32 32" width="100%" height="100%" aria-hidden="true"><defs><linearGradient id="tapg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E3925A"/><stop offset="1" stop-color="#B4531F"/></linearGradient></defs><rect width="32" height="32" rx="10" fill="#111"/><polygon points="25.2,19.8 19.8,25.2 12.2,25.2 6.8,19.8 6.8,12.2 12.2,6.8 19.8,6.8 25.2,12.2" fill="none" stroke="url(#tapg)" stroke-width="3"/><rect x="13.4" y="13.4" width="5.2" height="5.2" transform="rotate(45 16 16)" fill="#F5F5F3"/></svg>`;

/* scale live thumbnails (sites rendered at full width, shrunk to fit) */
function fitThumbs() {
  $$('.thumb-in,.ld-in').forEach(el => { const base = el.classList.contains('ld-in') ? 390 : 1200; const w = el.parentElement.clientWidth; if (w) el.style.transform = `scale(${w / base})`; });
  $$('.ed-frame.desk,.pv-frame.desk').forEach(el => { const w = el.parentElement.clientWidth - (el.classList.contains('ed-frame') ? 32 : 0); el.style.zoom = w < 1200 ? (w / 1200).toFixed(4) : ''; });
  $$('.ed-frame.mob,.pv-frame.mob').forEach(el => el.style.zoom = '');
}
let _fitQ = 0;
new MutationObserver(() => { if (_fitQ) return; _fitQ = requestAnimationFrame(() => { _fitQ = 0; fitThumbs(); }); }).observe(document.documentElement, { childList: true, subtree: true });
window.addEventListener('resize', () => fitThumbs());
