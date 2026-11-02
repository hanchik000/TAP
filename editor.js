'use strict';
/* ================= TAP Business — site editor ================= */
const ED = { site: null, sel: null, dev: 'desk', hist: [], fut: [], panel: null, insertAfter: null, chat: [], onExit: null, onPublish: null, editing: false, saveT: null };
const isNarrow = () => window.innerWidth < 980;

function edOpen(site, opts) {
  ED.site = site; ED.sel = null; ED.hist = []; ED.fut = []; ED.onExit = opts.onExit; ED.onPublish = opts.onPublish; ED.onSave = opts.onSave;
  ED.panel = isNarrow() ? null : 'add'; ED.chat = opts.chat || []; ED.dev = isNarrow() ? 'mob' : 'desk';
  const root = $('#app');
  root.innerHTML = `<div class="ed">
  <header class="ed-top">
    <button class="ib" onclick="edExit()" aria-label="Выйти из редактора">${IC.back}</button>
    <div class="ed-name"><b>${esc(site.name)}</b><span id="edSaved">Черновик сохранён</span></div>
    <div class="seg ed-dev"><button data-dev="desk" class="${ED.dev === 'desk' ? 'on' : ''}" aria-label="Компьютер">${IC.desk}</button><button data-dev="mob" class="${ED.dev === 'mob' ? 'on' : ''}" aria-label="Телефон">${IC.mob}</button></div>
    <div class="ed-hist"><button class="ib" onclick="edUndo()" aria-label="Отменить">${IC.undo}</button><button class="ib" onclick="edRedo()" aria-label="Повторить">${IC.redo}</button></div>
    <button class="btn ghost hide-s" onclick="edPreview()">${IC.eye}<span>Просмотр</span></button>
    <button class="btn acc" onclick="edPublish()">Опубликовать</button>
  </header>
  <div class="ed-main">
    <nav class="ed-rail">
      <button data-p="add">${IC.blocks}<span>Блоки</span></button>
      <button data-p="theme">${IC.palette}<span>Дизайн</span></button>
      <button data-p="prod">${IC.box}<span>Товары</span></button>
      <button data-p="ai" class="ai">${IC.spark}<span>ИИ</span></button>
      <button data-p="prev" class="only-s">${IC.eye}<span>Просмотр</span></button>
    </nav>
    <aside class="ed-panel" id="edPanel"></aside>
    <div class="ed-stage" id="edStage"><div class="ed-frame" id="edFrame"></div></div>
    <aside class="ed-insp" id="edInsp"></aside>
  </div></div>`;
  $$('.ed-dev button').forEach(b => b.onclick = () => { ED.dev = b.dataset.dev; $$('.ed-dev button').forEach(x => x.classList.toggle('on', x === b)); edCanvas(); });
  $$('.ed-rail button').forEach(b => b.onclick = () => { if (b.dataset.p === 'prev') return edPreview(); ED.panel = ED.panel === b.dataset.p ? null : b.dataset.p; if (isNarrow()) { ED.sel = null; edMarkSel(); edInsp(); } edPanel(); });
  const fr = $('#edFrame');
  fr.addEventListener('click', edClick);
  fr.addEventListener('dblclick', edDbl);
  fr.addEventListener('pointerdown', edZeroDown);
  fr.addEventListener('input', edInput);
  fr.addEventListener('focusout', e => { if (e.target.isContentEditable) { e.target.contentEditable = 'false'; ED.editing = false; } });
  onImgLoaded = () => { if (!ED.editing && $('#edFrame')) edCanvas(); };
  edCanvas(); edPanel(); edInsp();
}
function edExit() { edFlush(); onImgLoaded = () => { }; ED.onExit && ED.onExit(); }
function edFlush() { clearTimeout(ED.saveT); ED.onSave && ED.onSave(ED.site); }
function edSaved() { clearTimeout(ED.saveT); const s = $('#edSaved'); if (s) s.textContent = 'Сохраняю…'; ED.saveT = setTimeout(() => { ED.onSave && ED.onSave(ED.site); const s2 = $('#edSaved'); if (s2) s2.textContent = 'Черновик сохранён'; }, 600); }
function snap() { ED.hist.push(JSON.stringify(ED.site)); if (ED.hist.length > 80) ED.hist.shift(); ED.fut = []; }
function replaceSite(json) { const o = JSON.parse(json); Object.keys(ED.site).forEach(k => delete ED.site[k]); Object.assign(ED.site, o); }
function edUndo() { if (!ED.hist.length) return toast('Нечего отменять'); ED.fut.push(JSON.stringify(ED.site)); replaceSite(ED.hist.pop()); ED.sel = null; edAll(); }
function edRedo() { if (!ED.fut.length) return; ED.hist.push(JSON.stringify(ED.site)); replaceSite(ED.fut.pop()); ED.sel = null; edAll(); }
function edAll() { edCanvas(); edPanel(); edInsp(); edSaved(); }
function secById(id) { return ED.site.secs.find(s => s.id === id); }
function edChange(fn, opts = {}) { snap(); fn(); if (opts.canvas !== false) edCanvas(); if (opts.insp !== false) edInsp(); if (opts.panel) edPanel(); edSaved(); }

/* ---------- canvas ---------- */
function edCanvas() {
  const fr = $('#edFrame'); if (!fr) return;
  const sc = $('#edStage').scrollTop;
  fr.className = 'ed-frame ' + ED.dev;
  fr.innerHTML = renderSite(ED.site, { edit: true }) + `<button class="ed-addend" onclick="ED.insertAfter=null;ED.panel='add';edPanel()">${IC.plus} Добавить блок</button>`;
  edMarkSel(); $('#edStage').scrollTop = sc;
}
function edMarkSel() {
  const fr = $('#edFrame'); if (!fr) return;
  $$('[data-sel]', fr).forEach(e => e.removeAttribute('data-sel')); $$('.ed-stb,.zr', fr).forEach(e => e.remove());
  const sel = ED.sel; if (!sel) return;
  const sec = fr.querySelector(`[data-sid="${sel.sid}"]`); if (!sec) return;
  sec.setAttribute('data-sel', 'sec');
  const s = secById(sel.sid); const i = ED.site.secs.indexOf(s);
  const tb = document.createElement('div'); tb.className = 'ed-stb';
  tb.innerHTML = `<span class="ed-stb-n">${esc(BLOCKS[s.type].name)}</span><button title="Выше" onclick="edMove('${s.id}',-1)" ${i === 0 ? 'disabled' : ''}>${IC.up}</button><button title="Ниже" onclick="edMove('${s.id}',1)" ${i === ED.site.secs.length - 1 ? 'disabled' : ''}>${IC.down}</button><button title="Копия" onclick="edDup('${s.id}')">${IC.copy}</button><button title="Настройки" onclick="edSelSec('${s.id}')">${IC.cog}</button><button title="Удалить" onclick="edDel('${s.id}')">${IC.trash}</button><button class="add" title="Блок ниже" onclick="ED.insertAfter='${s.id}';ED.panel='add';edPanel()">${IC.plus}</button>`;
  sec.appendChild(tb);
  if (sel.k === 'text' || sel.k === 'img') { const el = sec.querySelector(sel.k === 'text' ? `[data-f="${CSS.escape(sel.f)}"]` : `[data-img="${CSS.escape(sel.f)}"]`); if (el) el.setAttribute('data-sel', 'el'); }
  if (sel.k === 'zi') { const z = sec.querySelector(`[data-zi="${sel.zi}"]`); if (z) { z.setAttribute('data-sel', 'el'); const h = document.createElement('i'); h.className = 'zr'; z.appendChild(h); } }
}
function edClick(e) {
  if (e.target.closest('.ed-stb') || e.target.closest('.ed-addend')) return;
  const sec = e.target.closest('[data-sid]'); if (!sec) return;
  e.preventDefault();
  if (e.target.isContentEditable) return;
  const sid = sec.dataset.sid; const zi = e.target.closest('[data-zi]');
  if (zi) { if (ED._dragged) { ED._dragged = false; return; } const fe = zi.querySelector('[data-f]'); ED.sel = { sid, k: 'zi', zi: +zi.dataset.zi, f: fe ? fe.dataset.f : null }; }
  else {
    const fe = e.target.closest('[data-f]'); const ie = e.target.closest('[data-img]'); const pc = e.target.closest('[data-pid]');
    if (fe) { ED.sel = { sid, k: 'text', f: fe.dataset.f }; edMarkSel(); edInsp(); edStartEdit(fe); return; }
    if (ie) ED.sel = { sid, k: 'img', f: ie.dataset.img };
    else if (pc) { ED.sel = { sid, k: 'sec' }; edMarkSel(); edInsp(); return prodEdit(pc.dataset.pid, () => edCanvas()); }
    else ED.sel = { sid, k: 'sec' };
  }
  if (isNarrow()) ED.panel = null;
  edMarkSel(); edPanel(); edInsp();
}
function edDbl(e) { const zi = e.target.closest('[data-zi]'); if (!zi) return; const fe = zi.querySelector('[data-f]'); if (fe) edStartEdit(fe); }
function edStartEdit(el) {
  if (el.isContentEditable) return; el.contentEditable = 'true'; el.spellcheck = false; ED.editing = true; ED._snapped = false; el.focus();
  try { const r = document.createRange(); r.selectNodeContents(el); r.collapse(false); const s = getSelection(); s.removeAllRanges(); s.addRange(r); } catch (_) { }
}
function edInput(e) {
  const el = e.target; if (!el.isContentEditable) return; const sec = el.closest('[data-sid]'); const s = secById(sec.dataset.sid);
  if (!ED._snapped) { snap(); ED._snapped = true; }
  setP(s.d, el.dataset.f, el.innerText.replace(/\n{3,}/g, '\n\n').replace(/\n$/, '')); edSaved();
}
function edSelSec(sid) { ED.sel = { sid, k: 'sec' }; if (isNarrow()) ED.panel = null; edMarkSel(); edPanel(); edInsp(); }
function edMove(sid, d) { const a = ED.site.secs; const i = a.findIndex(s => s.id === sid), j = i + d; if (j < 0 || j >= a.length) return; edChange(() => { [a[i], a[j]] = [a[j], a[i]]; }); setTimeout(() => { const el = $(`#edFrame [data-sid="${sid}"]`); el && el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, 30); }
function edDup(sid) { const a = ED.site.secs; const i = a.findIndex(s => s.id === sid); edChange(() => { const c = clone(a[i]); c.id = uid('s'); a.splice(i + 1, 0, c); ED.sel = { sid: c.id, k: 'sec' }; }); }
function edDel(sid) { edChange(() => { ED.site.secs = ED.site.secs.filter(s => s.id !== sid); ED.sel = null; }); toast('Блок удалён', 'Вернуть — кнопка «Отменить»'); }

/* ---------- zero-block drag & resize ---------- */
function edZeroDown(e) {
  const z = e.target.closest('[data-zi]'); if (!z || e.target.isContentEditable || e.button > 0) return;
  const secEl = z.closest('[data-sid]'); const s = secById(secEl.dataset.sid); const i = +z.dataset.zi; const it = s.d.items[i];
  const box = z.parentElement.getBoundingClientRect(); const rs = e.target.classList.contains('zr');
  const sx = e.clientX, sy = e.clientY, o = Object.assign({}, it); let moved = false;
  ED._dragged = false;
  const mv = ev => {
    const dx = (ev.clientX - sx) / box.width * 100, dy = (ev.clientY - sy) / box.height * 100;
    if (!moved && Math.abs(ev.clientX - sx) + Math.abs(ev.clientY - sy) > 4) { moved = true; snap(); ED.sel = { sid: s.id, k: 'zi', zi: i, f: it.k === 'text' || it.k === 'btn' ? `items.${i}.text` : null }; edMarkSel(); }
    if (!moved) return; ev.preventDefault();
    if (rs) { it.w = +clamp(o.w + dx, 3, 100).toFixed(1); it.h = +clamp(o.h + dy, 3, 100).toFixed(1); z.style.width = it.w + '%'; z.style.height = it.h + '%'; }
    else { it.x = +clamp(o.x + dx, -10, 98).toFixed(1); it.y = +clamp(o.y + dy, -10, 98).toFixed(1); z.style.left = it.x + '%'; z.style.top = it.y + '%'; }
  };
  const up = () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); if (moved) { ED._dragged = true; edSaved(); edInsp(); setTimeout(() => ED._dragged = false, 50); } };
  window.addEventListener('pointermove', mv, { passive: false }); window.addEventListener('pointerup', up);
}

/* ---------- left panel ---------- */
function edPanel() {
  $$('.ed-rail button').forEach(b => b.classList.toggle('on', b.dataset.p === ED.panel));
  const p = $('#edPanel'); if (!p) return;
  p.classList.toggle('open', !!ED.panel);
  if (!ED.panel) { p.innerHTML = ''; return; }
  const head = (t, sub) => `<div class="pn-h"><div><b>${t}</b>${sub ? `<span>${sub}</span>` : ''}</div><button class="ib only-s" onclick="ED.panel=null;edPanel()" aria-label="Закрыть">${IC.x}</button></div>`;
  if (ED.panel === 'add') {
    const after = ED.insertAfter ? secById(ED.insertAfter) : null;
    p.innerHTML = head('Добавить блок', after ? 'после «' + BLOCKS[after.type].name + '»' : 'в конец страницы') + `<div class="pn-b">${Object.entries(BLOCKS).map(([t, b]) => `<div class="lib-g"><div class="lib-n">${b.name}</div><div class="lib-vs">${Object.entries(b.vs).map(([v, n]) => `<button class="lib-v" onclick="edAdd('${t}','${v}')"><div class="thumb">${thumbOf(t, v)}</div><span>${n}</span></button>`).join('')}</div></div>`).join('')}</div>`;
  } else if (ED.panel === 'theme') p.innerHTML = head('Дизайн сайта', 'меняется на всех страницах') + `<div class="pn-b">${themeHTML()}</div>`;
  else if (ED.panel === 'prod') p.innerHTML = head('Товары', ED.site.products.length + ' шт.') + `<div class="pn-b" id="prodBox"></div>`, prodList($('#prodBox'), () => edCanvas());
  else if (ED.panel === 'ai') { p.innerHTML = head('ИИ-помощник', 'правит сайт по вашим словам') + `<div class="pn-b ai-b">${aiPanelHTML()}</div>`; aiScroll(); }
}
function thumbOf(t, v) {
  const s = secMake(t, v, { niche: ED.site.niche, name: ED.site.name, city: ED.site.city });
  if (t === 'hero' && v === 'center') s.st = { bg: 'p' };
  const site = { th: ED.site.th, products: ED.site.products.slice(0, 4), niche: ED.site.niche, secs: [s] };
  return `<div class="thumb-in">${renderSite(site)}</div>`;
}
function edAdd(t, v) {
  const s = secMake(t, v, { niche: ED.site.niche, name: ED.site.name, city: ED.site.city });
  edChange(() => {
    const a = ED.site.secs; let i = ED.insertAfter ? a.findIndex(x => x.id === ED.insertAfter) + 1 : a.length;
    if (!ED.insertAfter && a.length && a[a.length - 1].type === 'footer') i = a.length - 1;
    a.splice(i, 0, s); ED.sel = { sid: s.id, k: 'sec' }; ED.insertAfter = null;
  });
  if (isNarrow()) { ED.panel = null; edPanel(); }
  setTimeout(() => { const el = $(`#edFrame [data-sid="${s.id}"]`); el && el.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, 40);
  toast(BLOCKS[t].name + ' добавлен', 'Нажмите на текст, чтобы изменить');
}

/* ---------- theme ---------- */
function themeHTML() {
  const th = ED.site.th;
  const col = (k, n) => `<label class="col-in"><input type="color" value="${th[k]}" oninput="edTheme('${k}',this.value,true)" onchange="edTheme('${k}',this.value)"><span>${n}</span><code>${th[k]}</code></label>`;
  return `<div class="fld"><div class="fl">Готовые палитры</div><div class="pal-g">${PALETTES.map((p, i) => `<button class="pal" onclick="edPalette(${i})" title="${p[0]}"><i style="background:${p[2]}"><b style="background:${p[1]}"></b><b style="background:${p[3]}"></b></i><span>${p[0]}</span></button>`).join('')}</div></div>
  <div class="fld"><div class="fl">Цвета</div><div class="cols">${col('p', 'Основной')}${col('bg', 'Фон')}${col('tx', 'Текст')}${col('sf', 'Карточки')}</div></div>
  <div class="fld"><div class="fl">Шрифт заголовков</div><div class="fonts">${FONTS.map(f => `<button class="${th.fh === f ? 'on' : ''}" style="font-family:'${f}'" onclick="edTheme('fh','${f}')">${f}</button>`).join('')}</div></div>
  <div class="fld"><div class="fl">Шрифт текста</div><div class="fonts">${FONTS.map(f => `<button class="${th.fb === f ? 'on' : ''}" style="font-family:'${f}'" onclick="edTheme('fb','${f}')">${f}</button>`).join('')}</div></div>
  <div class="fld"><div class="fl">Скругление углов <b id="rv">${th.r}px</b></div><input type="range" min="0" max="32" value="${th.r}" oninput="ED.site.th.r=+this.value;$('#rv').textContent=this.value+'px';edCanvas()" onchange="edSaved()"></div>
  <div class="fld"><div class="fl">Заголовки</div><div class="seg wide"><button class="${!th.up ? 'on' : ''}" onclick="edTheme('up',false)">Обычные</button><button class="${th.up ? 'on' : ''}" onclick="edTheme('up',true)">ПРОПИСНЫЕ</button></div></div>
  <div class="fld"><div class="fl">Кнопки</div><div class="seg wide">${[['fill', 'Заливка'], ['line', 'Контур'], ['pill', 'Таблетка']].map(([k, n]) => `<button class="${(th.btn || 'fill') === k ? 'on' : ''}" onclick="edTheme('btn','${k}')">${n}</button>`).join('')}</div></div>
  <div class="fld"><div class="fl">Стиль макета (тексты останутся)</div><div class="tpl-mini">${TEMPLATES.map(t => `<button onclick="edTplStyle('${t.id}')"><i style="background:${t.th.bg};color:${t.th.tx};font-family:'${t.th.fh}'">Aa<b style="background:${t.th.p}"></b></i><span>${t.name}</span></button>`).join('')}</div></div>`;
}
function edTheme(k, v, live) { if (live) { ED.site.th[k] = v; edCanvas(); return; } edChange(() => { ED.site.th[k] = v; }, { panel: true }); }
function edPalette(i) { const p = PALETTES[i]; edChange(() => Object.assign(ED.site.th, { p: p[1], bg: p[2], tx: p[3], sf: p[4] }), { panel: true }); }
function edTplStyle(id) { const t = TEMPLATES.find(x => x.id === id); edChange(() => { ED.site.th = clone(t.th); ED.site.tpl = id; }, { panel: true }); toast('Стиль «' + t.name + '» применён', 'Тексты и товары на месте'); }

/* ---------- inspector ---------- */
function edInsp() {
  const box = $('#edInsp'); if (!box) return;
  const sel = ED.sel; box.classList.toggle('open', !!sel);
  if (!sel) { box.innerHTML = isNarrow() ? '' : `<div class="ins-empty"><div class="ie-i">${IC.blocks}</div><b>Нажмите на любой элемент сайта</b><p>Текст редактируется прямо на странице. Справа появятся настройки шрифта, цвета и отступов.</p><button class="btn soft" onclick="ED.panel='ai';edPanel()">${IC.spark} Попросить ИИ</button></div>`; return; }
  const s = secById(sel.sid); if (!s) { ED.sel = null; return edInsp(); }
  let h = `<div class="ins-h"><div><span>${esc(BLOCKS[s.type].name)}</span><b>${sel.k === 'sec' ? 'Настройки блока' : sel.k === 'img' ? 'Изображение' : sel.k === 'zi' ? 'Элемент холста' : 'Текст'}</b></div><button class="ib" onclick="ED.sel=null;edMarkSel();edInsp()" aria-label="Закрыть">${IC.x}</button></div><div class="ins-b">`;
  if (sel.k === 'text') h += textInsp(s, sel.f);
  else if (sel.k === 'img') h += imgInsp(s, sel.f);
  else if (sel.k === 'zi') h += zeroItemInsp(s, sel);
  else h += secInsp(s);
  box.innerHTML = h + '</div>';
}
function swatches(cur, on) {
  const th = ED.site.th; const opts = [['', 'Авто'], ['tx', th.tx], ['p', th.p], ['bg', th.bg], ['sf', th.sf], ['#ffffff', '#ffffff'], ['#111111', '#111111']];
  return `<div class="sw-row">${opts.map(([k, c]) => `<button class="sw ${(cur || '') === k ? 'on' : ''}" ${k ? `style="background:${c}"` : ''} onclick="${on}('${k}')" title="${k || 'Как в теме'}">${k ? '' : 'А'}</button>`).join('')}<label class="sw pick" title="Свой цвет"><input type="color" value="${validHex(cur) ? cur : '#888888'}" onchange="${on}(this.value)"></label></div>`;
}
function textInsp(s, f) {
  const st = (s.es && s.es[f]) || {}; const base = s.type === 'zero' ? 0 : 0;
  ED._tf = { sid: s.id, f };
  return `<div class="fld"><div class="fl">Шрифт</div><select onchange="edTS('ff',this.value)"><option value="">Как в дизайне сайта</option>${FONTS.map(x => `<option ${st.ff === x ? 'selected' : ''}>${x}</option>`).join('')}</select></div>
  <div class="fld"><div class="fl">Размер <b id="fsv">${st.fs ? st.fs + 'px' : 'авто'}</b></div><input type="range" min="10" max="140" value="${st.fs || 24}" oninput="edTSlive('fs',this.value)" onchange="edTS('fs',+this.value)"></div>
  <div class="fld two"><div><div class="fl">Начертание</div><div class="seg wide">${[[400, 'Обычн.'], [600, 'Полуж.'], [800, 'Жирн.']].map(([w, n]) => `<button class="${+st.fw === w ? 'on' : ''}" onclick="edTS('fw',${w})">${n}</button>`).join('')}</div></div></div>
  <div class="fld"><div class="fl">Выравнивание</div><div class="seg wide">${[['left', 'Слева'], ['center', 'Центр'], ['right', 'Справа']].map(([a, n]) => `<button class="${st.al === a ? 'on' : ''}" onclick="edTS('al','${a}')">${n}</button>`).join('')}<button class="${st.it ? 'on' : ''}" onclick="edTS('it',${!st.it})"><i>Курсив</i></button></div></div>
  <div class="fld"><div class="fl">Цвет текста</div>${swatches(st.c, 'edTSc')}</div>
  <div class="fld two"><div><div class="fl">Межстрочный <b>${st.lh || 'авто'}</b></div><input type="range" min="0.8" max="2" step="0.05" value="${st.lh || 1.3}" onchange="edTS('lh',+this.value)"></div><div><div class="fl">Разрядка <b>${st.ls != null ? st.ls : 'авто'}</b></div><input type="range" min="-0.08" max="0.3" step="0.01" value="${st.ls != null ? st.ls : 0}" onchange="edTS('ls',+this.value)"></div></div>
  <div class="fld"><button class="chip ${st.up ? 'on' : ''}" onclick="edTS('up',${!st.up})">ПРОПИСНЫЕ</button> <button class="chip" onclick="edTSreset()">Сбросить стиль</button></div>
  <div class="fld ai-mini"><div class="fl">${IC.spark} ИИ перепишет этот текст</div><div class="chips">${['Короче', 'Продающе', 'Официальнее', 'На туркменский', 'На английский', 'На турецкий'].map(m => `<button class="chip" onclick="aiRewrite('${m}')">${m}</button>`).join('')}</div></div>`;
}
function edTSlive(k, v) { const { sid, f } = ED._tf; const s = secById(sid); s.es = s.es || {}; s.es[f] = Object.assign({}, s.es[f], { [k]: +v }); const fsv = $('#fsv'); if (fsv) fsv.textContent = v + 'px'; const el = $(`#edFrame [data-sid="${sid}"] [data-f="${CSS.escape(f)}"]`); if (el) el.setAttribute('style', styleOf(s.es[f], ED.site.th, s.type === 'zero')); }
function edTS(k, v) { const { sid, f } = ED._tf; edChange(() => { const s = secById(sid); s.es = s.es || {}; const o = Object.assign({}, s.es[f]); if (v === '' || v === false) delete o[k]; else o[k] = v; s.es[f] = o; }); }
function edTSc(v) { edTS('c', v); }
function edTSreset() { const { sid, f } = ED._tf; edChange(() => { const s = secById(sid); if (s.es) delete s.es[f]; }); }
function imgInsp(s, f) {
  const v = getP(s.d, f);
  return `${hasPhoto(v) ? `<div class="img-prev" style="background-image:${imgCss(v, s.id + f, ED.site.th)}"></div>` : `<p class="hint">Сейчас здесь витрина из ваших товаров — она меняется вместе с каталогом. Загрузите фото, если хотите своё.</p>`}
  <label class="btn soft full">${IC.upload} Загрузить фото<input type="file" accept="image/*" hidden onchange="edImg(this,'${s.id}','${f}')"></label>
  <button class="btn ghost full" onclick="edChange(()=>setP(secById('${s.id}').d,'${f}',''))">Вернуть узор</button>
  <p class="hint">Фото сжимается автоматически. Без фото показывается узор в цветах вашего бренда.</p>`;
}
async function edImg(inp, sid, f) { const file = inp.files[0]; if (!file) return; try { const v = await addImage(file); edChange(() => setP(secById(sid).d, f, v)); } catch (e) { toast('Не удалось открыть фото', 'Выберите JPG или PNG'); } }
function secInsp(s) {
  const st = s.st || {}; let h = '';
  const vs = BLOCKS[s.type].vs; if (Object.keys(vs).length > 1) h += `<div class="fld"><div class="fl">Вариант блока</div><div class="var-g">${Object.entries(vs).map(([v, n]) => `<button class="var ${s.v === v ? 'on' : ''}" onclick="edSec('v','${v}')"><div class="thumb sm">${thumbOf(s.type, v)}</div><span>${n}</span></button>`).join('')}</div></div>`;
  h += `<div class="fld"><div class="fl">Фон блока</div>${swatches(st.bg, 'edSecBg')}</div>`;
  if (s.type !== 'zero') h += `<div class="fld two"><div><div class="fl">Отступ сверху <b>${st.pt != null ? st.pt : 'авто'}</b></div><input type="range" min="0" max="200" value="${st.pt != null ? st.pt : 80}" onchange="edSecSt('pt',+this.value)"></div><div><div class="fl">Снизу <b>${st.pb != null ? st.pb : 'авто'}</b></div><input type="range" min="0" max="200" value="${st.pb != null ? st.pb : 80}" onchange="edSecSt('pb',+this.value)"></div></div>`;
  if (s.type === 'catalog' && s.v === 'grid') h += `<div class="fld"><div class="fl">Колонок на компьютере</div><div class="seg wide">${[2, 3, 4].map(n => `<button class="${(+st.cols || 3) === n ? 'on' : ''}" onclick="edSecSt('cols',${n})">${n}</button>`).join('')}</div><button class="btn soft full" style="margin-top:10px" onclick="ED.panel='prod';edPanel()">${IC.box} Управлять товарами</button></div>`;
  if (s.type === 'zero') h += `<div class="fld"><div class="fl">Высота холста <b>${s.d.h}px</b></div><input type="range" min="240" max="1200" step="20" value="${s.d.h}" onchange="edChange(()=>secById('${s.id}').d.h=+this.value)"></div><div class="fld"><div class="fl">Добавить на холст</div><div class="zadd"><button onclick="edZAdd('text')">${IC.text}Текст</button><button onclick="edZAdd('btn')">${IC.link}Кнопка</button><button onclick="edZAdd('img')">${IC.img}Фото</button><button onclick="edZAdd('shape')">${IC.square}Фигура</button></div><p class="hint">Тяните элементы мышью или пальцем, угол справа снизу — размер. Двойной клик — редактировать текст.</p></div>`;
  if (['features', 'reviews', 'faq'].includes(s.type)) h += `<div class="fld"><div class="fl">Пункты</div><div class="row g8"><button class="btn soft" onclick="edItem(1)">${IC.plus} Добавить пункт</button><button class="btn ghost" onclick="edItem(-1)">Убрать последний</button></div></div>`;
  if (s.type === 'gallery') h += `<div class="fld"><div class="fl">Фото в галерее</div><div class="row g8"><button class="btn soft" onclick="edChange(()=>secById('${s.id}').d.imgs.push(''))">${IC.plus} Ещё фото</button><button class="btn ghost" onclick="edChange(()=>secById('${s.id}').d.imgs.pop())">Убрать</button></div><p class="hint">Нажмите на фото в блоке, чтобы загрузить своё.</p></div>`;
  h += `<div class="fld"><div class="row g8 wrap"><button class="btn ghost" onclick="edMove('${s.id}',-1)">${IC.up} Выше</button><button class="btn ghost" onclick="edMove('${s.id}',1)">${IC.down} Ниже</button><button class="btn ghost" onclick="edDup('${s.id}')">${IC.copy} Копия</button><button class="btn ghost danger" onclick="edDel('${s.id}')">${IC.trash} Удалить</button></div></div>`;
  ED._sec = s.id; return h;
}
function edSec(k, v) { edChange(() => { secById(ED._sec)[k] = v; }); }
function edSecSt(k, v) { edChange(() => { const s = secById(ED._sec); s.st = Object.assign({}, s.st, { [k]: v }); }); }
function edSecBg(v) { edChange(() => { const s = secById(ED._sec); s.st = Object.assign({}, s.st); if (v) s.st.bg = v; else delete s.st.bg; }); }
function edItem(d) { edChange(() => { const s = secById(ED._sec); const it = s.d.items; if (d > 0) it.push(clone(it[it.length - 1] || { t: 'Новый пункт', x: 'Описание' })); else if (it.length > 1) it.pop(); }); }
function edZAdd(k) {
  edChange(() => {
    const s = secById(ED._sec); const n = { k, x: 30, y: 30, w: k === 'text' ? 34 : k === 'btn' ? 18 : 24, h: k === 'text' ? 14 : k === 'btn' ? 10 : 30 };
    if (k === 'text') n.text = 'Новый текст'; if (k === 'btn') n.text = 'Кнопка'; if (k === 'img') n.src = ''; if (k === 'shape') { n.c = 'p'; n.r = 0; }
    s.d.items.push(n); const i = s.d.items.length - 1; if (k === 'text') { s.es = s.es || {}; s.es[`items.${i}.text`] = { fs: 32, fw: 700 }; }
    ED.sel = { sid: s.id, k: 'zi', zi: i, f: (k === 'text' || k === 'btn') ? `items.${i}.text` : null };
  });
}
function zeroItemInsp(s, sel) {
  const it = s.d.items[sel.zi]; if (!it) return '';
  const num = (k, n) => `<label class="num"><span>${n}</span><input type="number" step="0.5" value="${it[k]}" onchange="edZ('${k}',+this.value)"></label>`;
  let h = `<div class="fld"><div class="fl">Положение и размер, %</div><div class="nums">${num('x', 'X')}${num('y', 'Y')}${num('w', 'Ш')}${num('h', 'В')}</div></div>`;
  if (it.k === 'shape') h += `<div class="fld"><div class="fl">Цвет фигуры</div>${swatches(it.c, 'edZc')}</div>`;
  if (it.k === 'shape' || it.k === 'img') h += `<div class="fld"><div class="fl">Скругление <b>${it.r || 0}px</b></div><input type="range" min="0" max="300" value="${it.r || 0}" onchange="edZ('r',+this.value)"></div>`;
  if (it.k === 'img') h += `<label class="btn soft full">${IC.upload} Загрузить фото<input type="file" accept="image/*" hidden onchange="edImg(this,'${s.id}','items.${sel.zi}.src')"></label>`;
  if (sel.f) { h += `<div class="sep"></div>` + textInsp(s, sel.f); }
  h += `<div class="fld"><div class="row g8 wrap"><button class="btn ghost" onclick="edZLayer(1)">На передний план</button><button class="btn ghost" onclick="edZLayer(-1)">Назад</button><button class="btn ghost danger" onclick="edZDel()">${IC.trash} Удалить</button></div></div>`;
  ED._zi = { sid: s.id, i: sel.zi }; return h;
}
function edZ(k, v) { const { sid, i } = ED._zi; edChange(() => { secById(sid).d.items[i][k] = v; }); }
function edZc(v) { edZ('c', v || 'p'); }
function edZDel() { const { sid, i } = ED._zi; edChange(() => { const s = secById(sid); s.d.items.splice(i, 1); remapZeroStyles(s, i, null); ED.sel = { sid, k: 'sec' }; }); }
function edZLayer(d) {
  const { sid, i } = ED._zi; const s = secById(sid); const j = d > 0 ? s.d.items.length - 1 : 0; if (i === j) return;
  edChange(() => { const [it] = s.d.items.splice(i, 1); const old = s.es && s.es[`items.${i}.text`]; remapZeroStyles(s, i, null); s.d.items.splice(j, 0, it); remapZeroStyles(s, j, 'ins'); if (old) s.es[`items.${j}.text`] = old; ED.sel = { sid, k: 'zi', zi: j, f: it.text != null ? `items.${j}.text` : null }; });
}
function remapZeroStyles(s, idx, mode) {
  if (!s.es) return; const out = {};
  for (const [k, v] of Object.entries(s.es)) { const m = k.match(/^items\.(\d+)\.(.+)$/); if (!m) { out[k] = v; continue; } let n = +m[1]; if (mode === null) { if (n === idx) continue; if (n > idx) n--; } else { if (n >= idx) n++; } out[`items.${n}.${m[2]}`] = v; }
  s.es = out;
}

/* ---------- preview ---------- */
function edPreview() {
  sheet(`<div class="pv-h"><b>Просмотр</b><div class="seg"><button class="on" onclick="pvDev(this,'desk')">${IC.desk}</button><button onclick="pvDev(this,'mob')">${IC.mob}</button></div></div><div class="pv-box"><div class="pv-frame desk" id="pvF">${renderSite(ED.site)}</div></div>`, 'full');
  wireSite($('#pvF'), ED.site, { preview: true });
}
function pvDev(b, d) { $$('.pv-h .seg button').forEach(x => x.classList.toggle('on', x === b)); $('#pvF').className = 'pv-frame ' + d; }
function edPublish() { edFlush(); ED.onPublish && ED.onPublish(ED.site); }

/* ---------- products ---------- */
function prodList(box, after) {
  const site = ED.site || S.site; const ps = site.products;
  box.innerHTML = `<div class="prod-acts"><label class="btn acc full">${IC.cam} Добавить по фото — ИИ заполнит<input type="file" accept="image/*" hidden onchange="prodByPhoto(this)"></label>
  <div class="row g8"><button class="btn soft" onclick="prodEdit(null)">${IC.plus} Вручную</button><label class="btn ghost">${IC.upload} Excel / CSV<input type="file" accept=".csv,text/csv,.txt" hidden onchange="prodCSV(this)"></label></div></div>
  <div id="prodSt"></div>
  <div class="prod-l">${ps.map(p => `<button class="prow" onclick="prodEdit('${p.id}')"><i>${pvHTML(p, site.th)}</i><span><b>${esc(p.name)}</b><small>${esc(p.cat || 'Без категории')}</small></span><em>${fmt(p.price)} TMT</em></button>`).join('') || '<p class="hint">Товаров пока нет.</p>'}</div>
  <p class="hint">CSV: название; цена; старая цена; категория; описание — по строке на товар.</p>`;
  PROD_AFTER = () => { prodList(box, after); after && after(); };
}
let PROD_AFTER = () => { };
function curSite() { return (ED.site && $('#edFrame')) ? ED.site : S.site; }
function prodEdit(id, after) {
  const site = curSite(); if (after) PROD_AFTER = after;
  const p = id ? site.products.find(x => x.id === id) : { id: uid('p'), name: '', price: '', old: null, cat: '', desc: '', img: '' };
  if (!p) return;
  sheet(`<h3 class="sh-t">${id ? 'Товар' : 'Новый товар'}</h3><div class="pe">
  <label class="pe-img" id="peImg">${pvHTML(p, site.th)}<input type="file" accept="image/*" hidden onchange="peImg(this,'${p.id}')"><span>${IC.cam} Фото</span></label>
  <div class="pe-f"><label class="in-l">Название<input id="pe_n" value="${esc(p.name)}"></label>
  <div class="row g8"><label class="in-l">Цена, TMT<input id="pe_p" inputmode="numeric" value="${esc(p.price)}"></label><label class="in-l">Старая цена<input id="pe_o" inputmode="numeric" value="${esc(p.old || '')}"></label></div>
  <div class="row g8"><label class="in-l">Категория<input id="pe_c" value="${esc(p.cat || '')}"></label><label class="in-l">Мин. цена для торга<input id="pe_m" inputmode="numeric" value="${esc(p.min || '')}" placeholder="видите только вы"></label></div>
  <label class="in-l">Описание<textarea id="pe_d" rows="3">${esc(p.desc || '')}</textarea></label>
  ${p.tm ? `<p class="hint">TM: ${esc(p.tm)}</p>` : ''}</div></div>
  <div class="row g8"><button class="btn red" onclick="prodSave('${p.id}',${!id})">Сохранить</button>${id ? `<button class="btn ghost danger" onclick="prodDel('${p.id}')">${IC.trash} Удалить</button>` : ''}</div>`);
  ED._pimg = p.img;
}
async function peImg(inp, pid) { const f = inp.files[0]; if (!f) return; ED._pimg = await addImage(f); const pv = $('#peImg .pv'); if (pv) pv.outerHTML = pvHTML({ id: pid, img: ED._pimg }, curSite().th); }
function prodSave(id, isNew) {
  const site = curSite(); const doIt = () => {
    let p = site.products.find(x => x.id === id); if (!p) { p = { id }; site.products.push(p); }
    p.name = $('#pe_n').value.trim() || 'Новый товар'; p.price = +$('#pe_p').value || 0; p.old = +$('#pe_o').value || null; p.cat = $('#pe_c').value.trim(); p.desc = $('#pe_d').value.trim(); p.min = +$('#pe_m').value || null; p.img = ED._pimg || p.img || '';
  };
  if (site === ED.site) { snap(); doIt(); edSaved(); } else doIt();
  closeSheet(); PROD_AFTER(); toast(isNew ? 'Товар добавлен' : 'Товар сохранён', 'Он сразу появится в поиске TAP');
}
function prodDel(id) { const site = curSite(); if (site === ED.site) snap(); site.products = site.products.filter(p => p.id !== id); if (site === ED.site) edSaved(); closeSheet(); PROD_AFTER(); }
async function prodByPhoto(inp) {
  const f = inp.files[0]; if (!f) return; const site = curSite();
  const st = $('#prodSt'); if (st) st.innerHTML = `<div class="ai-wait"><span class="spin"></span> ИИ смотрит на фото и заполняет карточку…</div>`;
  let img; try { img = await addImage(f); } catch (e) { st && (st.innerHTML = ''); return toast('Не удалось открыть фото'); }
  const blob = await (await fetch(IMG[img.slice(4)])).blob();
  await AI.ready; if (!AI.live()) { if (st) st.innerHTML = ''; const p = { id: uid('p'), name: '', price: 0, cat: '', desc: '', img }; site.products.unshift(p); PROD_AFTER(); toast('Фото добавлено', 'Заполните название и цену — распознавание фото работает с живым ИИ'); return prodEdit(p.id); }
  const r = await AI.json(`Ты помогаешь продавцу в Туркменистане завести товар в интернет-магазин «${site.name}» (${site.niche}). На фото — товар. Определи, что это, и ответь ТОЛЬКО JSON:
{"name":"короткое название по-русски, 2-5 слов","tm":"название по-туркменски","cat":"категория одним-двумя словами","price":число — реалистичная цена в туркменских манатах (TMT) для розницы в Ашхабаде,"desc":"1-2 предложения по-русски: материал, особенности, для кого — без восклицаний"}
Существующие категории магазина: ${[...new Set(site.products.map(p => p.cat).filter(Boolean))].join(', ') || 'нет'}.`, { images: [blob], modelTier: 'quick' });
  if (st) st.innerHTML = '';
  if (!r) { const p = { id: uid('p'), name: 'Новый товар', price: 0, cat: '', desc: '', img }; site.products.unshift(p); PROD_AFTER(); return prodEdit(p.id); }
  const p = { id: uid('p'), name: String(r.name || 'Товар').slice(0, 80), tm: r.tm ? String(r.tm).slice(0, 80) : '', price: Math.round(+r.price || 0), old: null, cat: String(r.cat || '').slice(0, 30), desc: String(r.desc || '').slice(0, 300), img };
  if (site === ED.site) snap(); site.products.unshift(p); if (site === ED.site) edSaved(); PROD_AFTER(); prodEdit(p.id);
  toast('ИИ заполнил карточку', 'Проверьте цену и описание');
}
function prodCSV(inp) {
  const f = inp.files[0]; if (!f) return; const rd = new FileReader();
  rd.onload = () => {
    const site = curSite(); const rows = String(rd.result).split(/\r?\n/).map(l => l.split(/[;\t,]/)).filter(r => r[0] && r[0].trim() && isFinite(parseFloat(r[1])));
    if (!rows.length) return toast('Не нашёл товары в файле', 'Формат: название; цена; старая цена; категория; описание');
    if (site === ED.site) snap();
    rows.forEach(r => site.products.push({ id: uid('p'), name: r[0].trim(), price: parseFloat(r[1]) || 0, old: parseFloat(r[2]) || null, cat: (r[3] || '').trim(), desc: (r[4] || '').trim(), img: '' }));
    if (site === ED.site) edSaved(); PROD_AFTER(); toast('Загружено товаров: ' + rows.length);
  }; rd.readAsText(f);
}

/* ---------- AI assistant (real Claude) ---------- */
function aiPanelHTML() {
  const msgs = ED.chat.length ? ED.chat : [{ ai: 1, t: 'Я правлю сайт по вашим словам. Например: «сделай сайт дороже и темнее», «добавь блок с отзывами после каталога», «перепиши обложку под акцию к Новому году», «поставь цены на 10% ниже».' }];
  return `<div class="ai-msgs" id="aiMsgs">${msgs.map(m => `<div class="msg ${m.ai ? 'ai' : 'me'}">${esc(m.t)}</div>`).join('')}</div>
  <div class="chips">${['Сделай дороже и строже', 'Добавь отзывы и вопросы', 'Перепиши тексты продающе', 'Что улучшить на сайте?'].map(c => `<button class="chip" onclick="aiAsk('${c}')">${c}</button>`).join('')}</div>
  <form class="ai-in" onsubmit="event.preventDefault();aiAsk($('#aiQ').value)"><textarea id="aiQ" rows="2" placeholder="Напишите, что изменить…" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();aiAsk(this.value)}"></textarea><button class="ib red" aria-label="Отправить">${IC.send}</button></form>`;
}
function aiScroll() { const m = $('#aiMsgs'); if (m) m.scrollTop = 1e6; }
function siteBrief(site) {
  return JSON.stringify({ name: site.name, niche: site.niche, theme: site.th, sections: site.secs.map(s => ({ sid: s.id, type: s.type, v: s.v, d: s.type === 'zero' ? { items: s.d.items.map(i => ({ k: i.k, text: i.text })) } : Object.fromEntries(Object.entries(s.d).filter(([k, v]) => !/img/.test(k))), st: s.st })), products: site.products.map(p => ({ id: p.id, name: p.name, price: p.price, old: p.old, cat: p.cat })) });
}
const OPS_DOC = `Операции (массив ops):
{"op":"theme","set":{"p":"#hex","bg":"#hex","tx":"#hex","sf":"#hex","fh":"шрифт","fb":"шрифт","r":0-32,"btn":"fill|line|pill","up":true|false}}
{"op":"text","sid":"…","f":"поле, напр. title, text, btn, items.0.t","value":"…"}
{"op":"style","sid":"…","f":"поле","set":{"fs":px,"fw":400|600|800,"c":"#hex","al":"left|center|right","it":true}}
{"op":"secStyle","sid":"…","set":{"bg":"#hex или p|sf|bg|tx","pt":px,"pb":px,"cols":2|3|4}}
{"op":"variant","sid":"…","v":"вариант"}
{"op":"add","type":"тип","v":"вариант","after":"sid или null","d":{поля}}
{"op":"remove","sid":"…"}
{"op":"move","sid":"…","dir":-1|1}
{"op":"product","id":"id или null для нового","set":{"name":"","price":число,"old":число|null,"cat":"","desc":""}}
{"op":"removeProduct","id":"…"}
Типы блоков и варианты: header a|b {logo}; hero stage|split|center|cover|type {eb,title,text,btn,btn2}; marquee a {items:["короткие фразы"]}; slider a {items:[{e,t,x,btn}]}; bento a {title,items:[{t,x}] 4 шт}; stats a {items:[{n:"12 000+",t:"подпись"}] 4 шт}; catalog grid|rail|list {title,sub}; features cols|list {title,items:[{t,x}]}; promo band|card {title,text,btn}; text one|two {title,text}; gallery grid|mosaic {title}; reviews cards|quote {title,items:[{t,a}]}; faq list {title,items:[{q,a}]}; contacts split {title,addr,phone,hours,btn}; footer a {logo,text}.
Шрифты: ${FONTS.join(', ')}.`;
async function aiAsk(q) {
  q = String(q || '').trim(); if (!q) return; ED.chat.push({ t: q }); edPanel();
  const ta = $('#aiQ'); if (ta) ta.value = '';
  const box = $('#aiMsgs'); box.insertAdjacentHTML('beforeend', `<div class="msg ai wait" id="aiWait"><span class="spin"></span> Думаю…</div>`); aiScroll();
  await AI.ready;
  if (!AI.live()) { const w0 = $('#aiWait'); w0 && w0.remove(); ED.chat.push({ ai: 1, t: localEdit(q) }); edCanvas(); edPanel(); edInsp(); edSaved(); return; }
  const hist = ED.chat.slice(-6, -1).map(m => (m.ai ? 'ИИ: ' : 'Владелец: ') + m.t).join('\n');
  const r = await AI.json(`Ты — ИИ-помощник конструктора сайтов TAP Business. Владелец бизнеса в Туркменистане просит изменить свой сайт. Выполни просьбу через операции над сайтом. Если просят совет — дай короткий конкретный совет (3-4 пункта) и при желании предложи операции. Пиши по-русски, коротко, дружелюбно, без воды. Соблюдай читаемость: контраст текста к фону высокий.
${OPS_DOC}
Текущий сайт (JSON): ${siteBrief(ED.site)}
${hist ? 'Недавний диалог:\n' + hist + '\n' : ''}Просьба владельца: «${q}»
Ответь ТОЛЬКО JSON: {"reply":"что сделал или совет, 1-4 предложения","ops":[...]}`, { modelTier: 'quick', cache: false });
  const w = $('#aiWait'); w && w.remove();
  if (!r) { ED.chat.push({ ai: 1, t: 'Не получилось связаться с ИИ. Попробуйте ещё раз.' }); edPanel(); return; }
  const n = Array.isArray(r.ops) ? applyOps(ED.site, r.ops) : 0;
  ED.chat.push({ ai: 1, t: String(r.reply || 'Готово.') + (n ? ` (изменений: ${n})` : '') });
  edCanvas(); edPanel(); edInsp(); edSaved();
}
function applyOps(site, ops) {
  if (site === ED.site) snap(); let n = 0; const sec = id => site.secs.find(s => s.id === id);
  for (const o of ops.slice(0, 40)) {
    try {
      if (o.op === 'theme' && o.set) { for (const [k, v] of Object.entries(o.set)) { if (['p', 'bg', 'tx', 'sf'].includes(k) && validHex(v)) site.th[k] = v; if (['fh', 'fb'].includes(k) && FONTS.includes(v)) site.th[k] = v; if (k === 'r') site.th.r = clamp(+v || 0, 0, 32); if (k === 'btn' && ['fill', 'line', 'pill'].includes(v)) site.th.btn = v; if (k === 'up') site.th.up = !!v; } n++; }
      else if (o.op === 'text' && sec(o.sid) && o.f) { setP(sec(o.sid).d, String(o.f), String(o.value ?? '').slice(0, 600)); n++; }
      else if (o.op === 'style' && sec(o.sid) && o.f && o.set) { const s = sec(o.sid); s.es = s.es || {}; const c = Object.assign({}, s.es[o.f]); const st = o.set; if (st.fs) c.fs = clamp(+st.fs, 10, 160); if (st.fw) c.fw = +st.fw; if (st.c && (validHex(st.c) || ['p', 'tx', 'bg', 'sf'].includes(st.c))) c.c = st.c; if (st.al) c.al = st.al; if (st.it != null) c.it = !!st.it; s.es[o.f] = c; n++; }
      else if (o.op === 'secStyle' && sec(o.sid) && o.set) { const s = sec(o.sid); s.st = Object.assign({}, s.st); const st = o.set; if (st.bg && (validHex(st.bg) || ['p', 'sf', 'bg', 'tx'].includes(st.bg))) s.st.bg = st.bg; if (st.bg === null || st.bg === '') delete s.st.bg; if (st.pt != null) s.st.pt = clamp(+st.pt, 0, 240); if (st.pb != null) s.st.pb = clamp(+st.pb, 0, 240); if (st.cols) s.st.cols = clamp(+st.cols, 2, 4); n++; }
      else if (o.op === 'variant' && sec(o.sid) && BLOCKS[sec(o.sid).type].vs[o.v]) { sec(o.sid).v = o.v; n++; }
      else if (o.op === 'add' && BLOCKS[o.type] && o.type !== 'zero') { const s = secMake(o.type, BLOCKS[o.type].vs[o.v] ? o.v : null, { niche: site.niche, name: site.name, city: site.city }); if (o.d && typeof o.d === 'object') for (const [k, v] of Object.entries(o.d)) if (k in s.d && typeof v === typeof s.d[k] && Array.isArray(v) === Array.isArray(s.d[k])) s.d[k] = v; let i = o.after ? site.secs.findIndex(x => x.id === o.after) + 1 : site.secs.length; if (i <= 0) i = site.secs.length; if (!o.after && site.secs.at(-1) && site.secs.at(-1).type === 'footer') i = site.secs.length - 1; site.secs.splice(i, 0, s); n++; }
      else if (o.op === 'remove' && sec(o.sid)) { site.secs = site.secs.filter(s => s.id !== o.sid); n++; }
      else if (o.op === 'move' && sec(o.sid)) { const a = site.secs, i = a.findIndex(s => s.id === o.sid), j = i + (o.dir > 0 ? 1 : -1); if (j >= 0 && j < a.length) { [a[i], a[j]] = [a[j], a[i]]; n++; } }
      else if (o.op === 'product' && o.set) { let p = o.id && site.products.find(x => x.id === o.id); if (!p) { p = { id: uid('p'), name: 'Товар', price: 0, img: '' }; site.products.push(p); } const st = o.set; if (st.name) p.name = String(st.name).slice(0, 80); if (st.price != null) p.price = Math.max(0, Math.round(+st.price || 0)); if ('old' in st) p.old = st.old ? Math.round(+st.old) : null; if (st.cat != null) p.cat = String(st.cat).slice(0, 30); if (st.desc != null) p.desc = String(st.desc).slice(0, 300); n++; }
      else if (o.op === 'removeProduct') { const before = site.products.length; site.products = site.products.filter(p => p.id !== o.id); if (site.products.length < before) n++; }
    } catch (e) { console.warn('op', o, e); }
  }
  if (!site.secs.some(s => s.type === 'catalog')) site.secs.splice(Math.min(2, site.secs.length), 0, secMake('catalog', 'grid', site));
  return n;
}
function localEdit(q) {
  const l = q.toLowerCase(); const th = ED.site.th; snap();
  const cols = { красн: '#c62828', син: '#2a47c8', зел: '#1f9d63', золот: '#c9a24a', розов: '#c93f74', фиолет: '#6d4bd8', оранж: '#e0631c', медн: '#c2612a', черн: '#111111', чёрн: '#111111', бирюз: '#0e8a7a' };
  if (/темн|тёмн|черн|чёрн|ночн/.test(l) && /фон|сайт|тем|сделай/.test(l)) { Object.assign(th, { bg: '#0c0c0d', tx: '#f2efe9', sf: '#17171a' }); return 'Сделал сайт тёмным.'; }
  if (/светл|бел/.test(l) && /фон|сайт|тем/.test(l)) { Object.assign(th, { bg: '#f5f5f3', tx: '#111111', sf: '#ffffff' }); return 'Сделал сайт светлым.'; }
  const ck = Object.keys(cols).find(k => l.includes(k)); if (ck) { th.p = cols[ck]; return 'Поменял основной цвет.'; }
  if (/дорож|люкс|строж|строг/.test(l)) { Object.assign(th, { fh: 'Cormorant Garamond', fb: 'Jost', r: 2, btn: 'line' }); return 'Сделал стиль дороже и строже: шрифт Cormorant, тонкие кнопки.'; }
  if (/молод|ярч|смел/.test(l)) { Object.assign(th, { fh: 'Unbounded', fb: 'Onest', r: 20, btn: 'pill', up: true }); return 'Сделал стиль смелее: Unbounded и круглые кнопки.'; }
  const add = Object.entries({ reviews: 'отзыв', faq: 'вопрос', stats: 'цифр', marquee: 'бегущ', slider: 'слайдер', bento: 'бенто', promo: 'акци', gallery: 'галер', contacts: 'контакт' }).find(([k, w]) => l.includes(w));
  if (add && /добав|вставь|нужн/.test(l)) { const s = secMake(add[0], null, ED.site); const a = ED.site.secs; a.splice(a.length && a[a.length - 1].type === 'footer' ? a.length - 1 : a.length, 0, s); return 'Добавил блок «' + BLOCKS[add[0]].name + '».'; }
  if (add && /убер|удал|скрой/.test(l)) { const n = ED.site.secs.length; ED.site.secs = ED.site.secs.filter(s => s.type !== add[0]); return ED.site.secs.length < n ? 'Убрал блок «' + BLOCKS[add[0]].name + '».' : 'Такого блока нет на сайте.'; }
  const pct = l.match(/(\d+)\s*%/); if (pct && /цен/.test(l)) { const k = (/ниже|дешев|скид|умен/.test(l) ? -1 : 1) * +pct[1] / 100; ED.site.products.forEach(p => { if (k < 0) p.old = p.old || p.price; p.price = Math.round(p.price * (1 + k)); }); return `Изменил цены на ${pct[1]}%.`; }
  ED.hist.pop();
  return 'В этой версии я понимаю простые команды: «сделай тёмным», «цвет синий», «дороже и строже», «добавь отзывы», «убери вопросы», «цены ниже на 10%». Свободные просьбы — в версии с живым ИИ.';
}
async function aiRewrite(mode) {
  await AI.ready; if (!AI.live()) return toast('Переписывание текста', 'Работает в версии с живым ИИ');
  const { sid, f } = ED._tf; const s = secById(sid); const cur = getP(s.d, f); if (!cur) return;
  toast('ИИ переписывает…');
  const t = await AI.text(`Перепиши текст для сайта бизнеса «${ED.site.name}» (${ED.site.niche}, Туркменистан). Задача: ${mode}. Сохрани смысл и примерно ту же длину (для «Короче» — вдвое короче). Без кавычек, без пояснений, только новый текст.\n\nТекст: ${cur}`, { modelTier: 'quick', cache: false });
  if (t) edChange(() => setP(s.d, f, t.trim().replace(/^["«]|["»]$/g, '')));
}
