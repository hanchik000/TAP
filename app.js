'use strict';
/* ================= state ================= */
const S = Object.assign({ area: 'buyer', scr: 'land', phone: '', biz: { name: '', niche: 'Одежда и обувь', city: 'Ашхабад' }, site: null, slug: null, published: false, tariff: 'Бизнес', pay: 'Наличными менеджеру', dtab: 'home', smm: null, chat: [] }, LS.get('state', {}));
S.tap = { q: '', res: null, tab: 'home', city: '', fav: LS.get('fav', {}), subs: LS.get('subs', {}), mychats: LS.get('mychats', []) };
function save() { const { tap, ...rest } = S; LS.set('state', rest); }
const CITIES = ['Ашхабад', 'Мары', 'Туркменабат', 'Дашогуз', 'Балканабат', 'Аркадаг'];
const TARIFFS = [
  { n: 'Старт', p: 290, d: ['Сайт на адресе имя.tap.tm', 'До 100 товаров', 'ИИ-помощник в конструкторе', 'Заявки и SMS', 'QR-код и короткая ссылка', 'Магазин в поиске TAP'] },
  { n: 'Бизнес', p: 690, hot: 1, d: ['Всё из «Старт»', 'Без лимита товаров', 'Свой домен', 'ИИ-продавец в чатах', 'SMM-бот: 2 соцсети', 'Статистика'] },
  { n: 'Премиум', p: 1490, d: ['Всё из «Бизнес»', 'SMM-бот: все соцсети', 'Выше в выдаче TAP', '5 сотрудников', '1 съёмочный день в месяц'] },
  { n: 'Медиа', p: 4900, d: ['Всё из «Премиум»', 'Наша команда: видеограф, монтажёр, маркетолог', '12 Reels в месяц', 'Ведение соцсетей и рекламы'] }];
const ADDONS = [['SMM-бот', '290 TMT/мес'], ['ИИ-продавец в чатах', '190 TMT/мес'], ['Съёмочный день: видеограф и монтаж, 4 ролика', '900 TMT'], ['Поднятие в поиске TAP', '50 TMT/день'], ['Дизайн сайта нашим дизайнером', '1 500 TMT разово']];

/* ================= demo shops already on TAP ================= */
const DEMO_SHOPS = [
  { slug: 'sportline', name: 'SportLine', niche: 'Одежда и обувь', city: 'Ашхабад', tpl: 'koce', rating: 4.8, prods: [['Кроссовки беговые белые AirRun', 780, 950, 'Обувь'], ['Кроссовки чёрные для зала', 560, 690, 'Обувь'], ['Спортивный костюм', 890, null, 'Одежда'], ['Шорты беговые', 180, null, 'Одежда'], ['Бутылка для воды 0,75 л', 70, null, 'Аксессуары']] },
  { slug: 'stepmary', name: 'Step Mary', niche: 'Одежда и обувь', city: 'Мары', tpl: 'bazar', rating: 4.5, prods: [['Кроссовки беговые белые AirRun', 720, null, 'Обувь'], ['Кеды красные высокие', 390, null, 'Обувь'], ['Ботинки зимние', 980, 1150, 'Обувь'], ['Носки, 5 пар', 60, null, 'Аксессуары']] },
  { slug: 'modamerkez', name: 'Moda Merkez', niche: 'Одежда и обувь', city: 'Ашхабад', tpl: 'altyn', rating: 4.6, prods: [['Платье вечернее синее', 1250, 1500, 'Платья'], ['Кроссовки белые кожаные', 640, null, 'Обувь'], ['Худи оверсайз серое', 420, null, 'Одежда'], ['Сумка через плечо', 560, null, 'Сумки']] },
  { slug: 'gadgettm', name: 'Gadget TM', niche: 'Электроника', city: 'Ашхабад', tpl: 'tuss', rating: 4.7, prods: [['Наушники беспроводные Pro', 620, 750, 'Аудио'], ['Смарт-часы Fit 5', 940, null, 'Гаджеты'], ['Смартфон 128 ГБ', 3900, 4300, 'Смартфоны'], ['Повербанк 20000 мА·ч', 240, 280, 'Аксессуары'], ['Колонка портативная', 480, null, 'Аудио']] },
  { slug: 'yyldyzkafe', name: 'Ýyldyz Kafe', niche: 'Ресторан и кафе', city: 'Мары', tpl: 'sacak', rating: 4.9, prods: [['Плов по-туркменски', 60, null, 'Горячее'], ['Шашлык из баранины', 85, null, 'Горячее'], ['Манты, 6 шт', 45, null, 'Горячее'], ['Дограма', 55, null, 'Горячее'], ['Чай зелёный, чайник', 10, null, 'Напитки']] },
  { slug: 'guldunya', name: 'Gül Dünýä', niche: 'Цветы и подарки', city: 'Ашхабад', tpl: 'gozel', rating: 4.5, prods: [['Букет 25 красных роз', 620, null, 'Розы'], ['Коробка с пионами', 470, 520, 'Пионы'], ['Букет тюльпанов', 300, null, 'Тюльпаны'], ['Шары гелиевые, 10 шт', 110, null, 'Шары']] },
  { slug: 'beautylab', name: 'Beauty Lab', niche: 'Салон красоты', city: 'Ашхабад', tpl: 'gozel', rating: 4.9, prods: [['Маникюр с покрытием', 170, 210, 'Ногти'], ['Стрижка женская', 230, null, 'Волосы'], ['Макияж вечерний', 380, null, 'Макияж'], ['Окрашивание', 580, null, 'Волосы']] }
];
const DEMO_SITES = {};
DEMO_SHOPS.forEach(d => {
  const s = siteFromTemplate(d.tpl, { name: d.name, niche: d.niche, city: d.city });
  s.products = d.prods.map(([name, price, old, cat], i) => ({ id: d.slug + '-' + i, name, price, old, cat, desc: '', img: '' }));
  s.slug = d.slug; s.rating = d.rating; s.demo = true; DEMO_SITES[d.slug] = s;
});
let LIVE_SITES = {};

/* ================= shell ================= */
const ARWI = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const BUYER_NAV = [['buyer:home', IC.home, 'Главная'], ['buyer:cats', IC.grid, 'Категории'], ['buyer:deals', IC.star, 'Скидки'], ['buyer:chats', IC.chat, 'Чаты'], ['buyer:me', IC.heart, 'Избранное']];
const BIZ_KEYS = ['biz', 'ai', 'sys', 'agg', 'plans'];
function bizNav() {
  const g1 = [['biz:home', IC.home, S.published ? 'Обзор' : (S.phone ? 'Начало' : 'Регистрация')], ['biz:editor', IC.blocks, 'Конструктор сайта']];
  if (S.published) g1.push(['biz:prods', IC.box, 'Товары'], ['biz:orders', IC.inbox, 'Заявки'], ['biz:chats', IC.chat, 'Чаты'], ['biz:smm', IC.mega, 'SMM-бот']);
  return [['Мой бизнес', g1], ['Инструменты', [['ai', IC.spark, 'ИИ-функции'], ['sys', IC.grid, 'Готовые системы'], ['agg', IC.link, 'Агрегаторы'], ['plans', IC.crown, 'Тарифы']]]];
}
function navKey() { if (S.area === 'buyer') return 'buyer:' + S.tap.tab; if (S.area === 'biz') return S.scr === 'dash' ? 'biz:' + (S.dtab === 'home' ? 'home' : S.dtab) : 'biz:home'; return S.area; }
function sideHTML() {
  const cur = navKey(); const biz = BIZ_KEYS.includes(S.area);
  const item = ([k, ic, n]) => { const b = k === 'biz:orders' ? DASH.orders.filter(o => o.st === 'Новая').length : k === 'biz:chats' ? DASH.chats.filter(x => x.esc).length : k === 'buyer:chats' ? S.tap.mychats.length : 0; return `<button class="side-i ${cur === k ? 'on' : ''}" onclick="nav('${k}')">${ic}<span>${n}</span>${b ? `<em>${b}</em>` : ''}</button>`; };
  const body = biz
    ? `<button class="side-back" onclick="nav('buyer:home')">${IC.back}<span>К покупкам</span></button><div class="side-mode"><span>${LOGO_MARK}</span><div><b>TAP Business</b><small>${S.published ? esc(S.site.name) : 'Кабинет продавца'}</small></div>${S.published ? '<em class="dot-ok"></em>' : ''}</div>${bizNav().map(([g, items]) => `<div class="side-g"><div class="side-l">${g}</div>${items.map(item).join('')}</div>`).join('')}`
    : `<div class="side-g">${BUYER_NAV.map(item).join('')}</div><div class="side-g"><div class="side-l">Продавцам</div><button class="side-i biz-i" onclick="nav('biz')">${IC.bag}<span>Бизнес</span>${S.published ? '<em class="dot-ok"></em>' : ''}<i class="chev">${IC.back}</i></button></div>`;
  const cta = biz ? '' : `<div class="side-cta"><div class="dots-d"></div><b>${S.published ? esc(S.site.name) : 'Откройте свой магазин'}</b><span>${S.published ? 'Сайт работает · ' + esc(S.slug) + '.tap.tm' : 'Сайт, QR и место в поиске TAP за один вечер'}</span><button class="btn acc sm" onclick="nav('biz')">${S.published ? 'Кабинет' : 'Начать'} ${ARWI}</button></div>`;
  return `<aside class="side ${biz ? 'is-biz' : ''}" id="side"><div class="side-top"><a class="brand" onclick="nav('buyer:home')">${LOGO_MARK}<span>TAP</span>${biz ? '<em>business</em>' : ''}</a><button class="ib only-s" onclick="sideT(false)" aria-label="Закрыть меню">${IC.x}</button></div>${body}${cta}<div class="side-f">Developer Ovezov Emirhan<br>LTD EMIR LOGISTICS CO</div></aside><div class="side-ov" onclick="sideT(false)"></div>`;
}
function sideT(open) { document.body.classList.toggle('side-open', open); }
function nav(k) {
  sideT(false);
  if (k.startsWith('buyer:')) { S.area = 'buyer'; S.tap.tab = k.slice(6); if (S.tap.tab === 'home') S.tap.res = null; }
  else if (k === 'biz' || k === 'biz:home') { S.area = 'biz'; if (S.published) { S.scr = 'dash'; S.dtab = 'home'; } else if (!['reg', 'code', 'biz', 'start', 'publish', 'live'].includes(S.scr)) S.scr = S.phone ? (S.site ? 'start' : 'biz') : 'land'; }
  else if (k === 'biz:editor') { S.area = 'biz'; if (!S.phone) S.scr = 'reg'; else if (!S.site) S.scr = 'start'; else S.scr = 'editor'; }
  else if (k.startsWith('biz:')) { S.area = 'biz'; S.scr = 'dash'; S.dtab = k.slice(4); }
  else S.area = k;
  if (location.hash) history.replaceState(null, '', location.pathname);
  save(); render(); window.scrollTo(0, 0);
}
function topbar() {
  const title = S.area === 'buyer' ? '' : S.area === 'biz' ? '<em>business</em>' : '';
  return `<header class="tb"><button class="ib menu-b" onclick="sideT(true)" aria-label="Меню">${IC.menu}</button><a class="brand only-s" onclick="nav('buyer:home')">${LOGO_MARK}<span>TAP</span>${title}</a>
  ${S.area === 'buyer' && S.tap.tab === 'home' ? '' : `<div class="tb-t hide-s">${esc({ buyer: { cats: 'Категории', deals: 'Скидки', chats: 'Чаты', me: 'Избранное' }[S.tap.tab] || '', biz: 'Кабинет', ai: 'ИИ-функции', sys: 'Готовые системы', agg: 'Агрегаторы', plans: 'Тарифы' }[S.area] || '')}</div>`}
  <div class="tb-r">${S.area === 'buyer' ? `<button class="btn acc sm" onclick="nav('biz')">${IC.bag}<span class="hide-s">Открыть магазин</span></button>` : `<button class="btn ghost sm" onclick="nav('buyer:home')">${IC.search}<span class="hide-s">К покупкам</span></button>`}</div></header>`;
}
function setMode(m) { nav(m === 'tap' ? 'buyer:home' : 'biz'); }
function goHome() { nav(S.area === 'biz' && S.published ? 'biz' : 'buyer:home'); }
function go(scr) { S.area = 'biz'; S.scr = scr; save(); render(); window.scrollTo(0, 0); }
function shell(inner, after) {
  $('#app').innerHTML = `<div class="shell">${sideHTML()}<div class="main">${topbar()}<main class="pg">${inner}</main></div></div>` + (after || '');
}
function render() {
  const h = location.hash.slice(1);
  if (h.startsWith('site-')) return renderPublic(h.slice(5));
  document.body.className = '';
  if (S.area === 'buyer') return renderTap();
  if (S.area === 'ai') return shell(PAGES.ai());
  if (S.area === 'sys') return shell(PAGES.sys());
  if (S.area === 'plans') return shell(PAGES.plans());
  if (S.area === 'agg') return shell(PAGES.agg());
  if (S.scr === 'editor') return openEditor();
  const fn = SCR[S.scr] || SCR.land;
  shell(`<div class="pg-${S.scr}">${fn()}</div>`);
  AFTER[S.scr] && AFTER[S.scr]();
}
const SCR = {}, AFTER = {};

/* ================= landing ================= */
const ACTS = [['ИИ-сборка', 'Сайт по описанию, логотипу или фото', IC.spark, "go('reg')"], ['Конструктор', 'Любой текст, цвет, шрифт и блок', IC.blocks, 'quickDemo()'], ['SMM-бот', 'Сторис и посты на ваше «Да»', IC.mega, "go('reg')"], ['Поиск TAP', 'Покупатели находят ваши товары', IC.search, "setMode('tap')"], ['Resto OS', 'Готовая система для ресторана', IC.grid, "go('reg')", 1]];
SCR.land = () => `<section class="l-hero stagger">
  <div class="eyebrow"><i></i>Конструктор сайтов · Туркменистан</div>
  <h1>Свой сайт-магазин за один вечер</h1>
  <form class="ask" onsubmit="event.preventDefault();landGo()">${IC.spark}<input id="landQ" placeholder="Опишите бизнес: магазин обуви в Ашхабаде, тёмный стиль…" autocomplete="off"><button class="btn red"><span class="hide-s">Собрать сайт</span>${ARWI}</button></form>
  <div class="chips"><button class="chip ic" onclick="go('reg')"><span>${IC.img}</span>Из логотипа</button><button class="chip ic" onclick="go('reg')"><span>${IC.cam}</span>По фото витрины</button><button class="chip ic" onclick="quickDemo()"><span>${IC.blocks}</span>Открыть редактор</button></div>
</section>
<nav class="act-rail stagger">${ACTS.map(a => `<button class="act ${a[4] ? 'dk' : ''}" onclick="${a[3]}"><span>${a[2]}</span><span><b>${a[0]}</b><small>${a[1]}</small></span></button>`).join('')}</nav>
<section class="dk-hero"><div class="dots-d"></div>
  <div class="l"><div class="eyebrow"><i></i>TAP Business</div><h2>Один сайт —<br><span class="grad-t">любой стиль</span></h2>
   <ul class="dk-list stagger"><li><span class="mono">01</span>ИИ собирает сайт за минуту</li><li><span class="mono">02</span>Вы правите всё сами, как в Tilda</li><li><span class="mono">03</span>Публикация, QR и ссылка tap.tm</li><li><span class="mono">04</span>Заявки, чаты и SMM — в одном окне</li></ul>
   <div class="row g8 wrap"><button class="btn acc lg sheen" onclick="go('reg')">Открыть свой сайт ${ARWI}</button><button class="btn glass lg" onclick="quickDemo()">${IC.blocks} Пример</button></div></div>
  <div class="r"><div class="ld-phone float"><div class="ld-screen" id="ldScreen"></div></div><div class="ld-cap" id="ldCap"></div></div>
</section>
<div class="sec-h"><div><h2>Раздел «Бизнес»</h2><p>Всё для продавца в одном месте</p></div></div><div class="biz-tabs">${bizNav()[1][1].map(([k, ic, n]) => `<button class="card row lift" onclick="nav('${k}')"><span class="ai-i sm">${ic}</span><b>${n}</b><span class="ml">${ARWI}</span></button>`).join('')}</div>
<div class="mq"><div class="mq-t">${[0, 1].map(() => `<span>${['Магазины одежды', 'Рестораны', 'Салоны красоты', 'Электроника', 'Цветы', 'Услуги', 'Кафе', 'Подарки'].map(t => `${t}<i>✦</i>`).join('')}</span>`).join('')}</div></div>
<div class="sec-h"><div><h2>Трендовые макеты</h2><p>Нажмите — откроется редактор с этим макетом</p></div></div>
<div class="rail">${TEMPLATES.map(t => `<button class="tcard lift" onclick="S.biz.name=S.biz.name||'Aýdyň Style';fromTpl('${t.id}')"><div class="tpl-th"><div class="thumb-in">${renderSite(siteFromTemplate(t.id, { name: 'Aýdyň Style', niche: t.id === 'sacak' ? 'Ресторан и кафе' : t.id === 'gozel' ? 'Салон красоты' : t.id === 'volt' ? 'Электроника' : 'Одежда и обувь', city: 'Ашхабад' }), { still: true })}</div></div><div class="tpl-n"><b>${t.name}</b><span>${t.note}</span></div></button>`).join('')}</div>
<div class="sec-h"><div><h2>Всё для бизнеса</h2><p>Одна подписка — сайт, продажи и соцсети</p></div></div>
<section class="eco"><div class="dk"><div class="dots-d"></div><span class="tag acc">Готовая система</span><h3>Resto OS</h3><p>QR-меню и заказ со стола, кухня, касса и склад. Покупка один раз, установка под ключ.</p><button class="btn inv" onclick="go('reg')">Подробнее ${ARWI}</button></div><div><h3>Поиск TAP</h3><p>Покупатель пишет «белые кроссовки до 800» — и видит товары всех магазинов с ценами.</p><button class="btn ghost" onclick="setMode('tap')">Открыть TAP ${ARWI}</button></div><div><h3>ИИ-продавец</h3><p>Отвечает покупателям в чате и знает ваши цены. Скидки — только с вашего согласия.</p></div></section>
<footer class="foot"><b>TAP</b><span>Developer Ovezov Emirhan · LTD EMIR LOGISTICS CO</span><span class="mono">tap.tm</span></footer>`;
function landGo() { S.brief = ($('#landQ').value || '').trim(); save(); go('reg'); }
let ldT;
AFTER.land = () => {
  clearInterval(ldT); let i = 0; const scr = $('#ldScreen'), cap = $('#ldCap'); if (!scr) return;
  const list = [['atlas', 'Aýdyň Style', 'Одежда и обувь'], ['noir', 'Altyn Saat', 'Электроника'], ['sacak', 'Saçak', 'Ресторан и кафе'], ['volt', 'Volt Store', 'Электроника'], ['gozel', 'Gözel Studio', 'Салон красоты'], ['bazar', 'Bazar TM', 'Одежда и обувь']];
  const sites = list.map(([t, n, ni]) => siteFromTemplate(t, { name: n, niche: ni, city: 'Ашхабад' }));
  const show = () => { const s = sites[i % sites.length]; scr.innerHTML = `<div class="ld-in">${renderSite(s)}</div>`; siteMotion(scr.firstChild); cap.textContent = TEMPLATES.find(t => t.id === s.tpl).name + ' · ' + s.name; i++; };
  show(); if (!matchMedia('(prefers-reduced-motion: reduce)').matches) ldT = setInterval(() => { if (!$('#ldScreen')) return clearInterval(ldT); show(); }, 3200);
};

/* ================= onboarding ================= */
const steps = n => `<div class="steps" aria-label="Шаг ${n} из 4">${[1, 2, 3, 4].map(i => `<i class="${i <= n ? 'on' : ''}"></i>`).join('')}</div>`;
SCR.reg = () => `<div class="narrow">${steps(1)}<h2>Вход по номеру</h2><p class="mut">Пароль не нужен — пришлём код по SMS.</p>
  <label class="in-l">Номер телефона<input id="ph" inputmode="tel" autocomplete="tel" placeholder="+993 6X XX XX XX" value="${esc(S.phone)}"></label>
  <button class="btn red full lg" onclick="sendCode()">Получить код</button></div>`;
function sendCode() { S.phone = $('#ph').value.trim() || '+993 65 00 00 00'; S.code = String(1000 + Math.floor(Math.random() * 9000)); go('code'); setTimeout(() => toast('SMS: код ' + S.code, 'В демо код показан здесь'), 500); }
SCR.code = () => `<div class="narrow">${steps(1)}<h2>Код из SMS</h2><p class="mut">Отправили на ${esc(S.phone)}</p>
  <input id="cd" class="code-in" inputmode="numeric" maxlength="4" placeholder="····" value="${esc(S.code || '')}">
  <button class="btn red full lg" onclick="if($('#cd').value.trim()===S.code)go('biz');else toast('Неверный код','Проверьте SMS')">Войти</button><button class="btn ghost full" onclick="sendCode()">Отправить ещё раз</button></div>`;
SCR.biz = () => `<div class="narrow">${steps(2)}<h2>Расскажите о бизнесе</h2>
  <label class="in-l">Название<input id="bn" placeholder="Например, Aýdyň Style" value="${esc(S.biz.name)}"></label>
  <div class="fl">Чем занимаетесь</div><div class="chips big">${Object.keys(NICHES).map(n => `<button class="chip ${S.biz.niche === n ? 'on' : ''}" data-niche="${esc(n)}">${n}</button>`).join('')}</div>
  <div class="fl">Город</div><div class="chips">${CITIES.map(c => `<button class="chip ${S.biz.city === c ? 'on' : ''}" data-city="${c}">${c}</button>`).join('')}</div>
  <button class="btn red full lg" onclick="S.biz.name=$('#bn').value.trim()||'Aýdyň Style';go('start')">Дальше</button></div>`;
AFTER.biz = () => { $$('[data-niche]').forEach(b => b.onclick = () => { S.biz.name = $('#bn').value; S.biz.niche = b.dataset.niche; render(); }); $$('[data-city]').forEach(b => b.onclick = () => { S.biz.name = $('#bn').value; S.biz.city = b.dataset.city; render(); }); };
let BUILD_IMGS = [];
SCR.start = () => `<div class="wide">${steps(3)}<h2>Как соберём сайт для «${esc(S.biz.name)}»?</h2>
 <div class="start-g">
  <div class="ai-card"><div class="dots-d"></div><div class="eyebrow" style="color:rgba(255,255,255,.5)"><i></i>ИИ соберёт за вас</div><h3>Опишите — получите сайт</h3>
   <label class="in-l">Опишите бизнес и пожелания<textarea id="brief" rows="4" placeholder="Например: магазин молодёжной обуви в Ашхабаде, хотим тёмный стильный сайт, акцент на новинки и доставку за час">${esc(S.brief || '')}</textarea></label>
   <div class="fl">Логотип, брендбук или фото витрины — по желанию</div>
   <div class="up-row" id="upRow">${BUILD_IMGS.map((b, i) => `<span class="up-th" style="background-image:url('${b.url}')"><button onclick="BUILD_IMGS.splice(${i},1);render()" aria-label="Убрать">${IC.x}</button></span>`).join('')}<label class="up-add">${IC.upload}<span>Добавить</span><input type="file" accept="image/*" multiple hidden onchange="addBuildImgs(this)"></label></div>
   <button class="btn acc full lg sheen" id="buildBtn" onclick="aiBuild()">${IC.spark} Собрать сайт</button><div id="buildSt"></div></div>
  <div class="tpls"><div class="fl">Или начните с макета</div><div class="tpl-g stagger">${TEMPLATES.map(t => `<button class="tpl lift" onclick="fromTpl('${t.id}')"><div class="tpl-th">${tplThumb(t.id)}</div><div class="tpl-n"><b>${t.name}</b><span>${t.note}</span></div></button>`).join('')}</div></div>
 </div></div>`;
function tplThumb(id) { return `<div class="thumb-in">${renderSite(siteFromTemplate(id, S.biz), { still: true })}</div>`; }
async function addBuildImgs(inp) { for (const f of [...inp.files].slice(0, 3 - BUILD_IMGS.length)) { try { const d = await fileToData(f, 1000); BUILD_IMGS.push({ url: d }); } catch (e) { } } render(); }
function fromTpl(id) { S.site = siteFromTemplate(id, S.biz); S.chat = []; save(); go('editor'); }
const BUILD_STAGES = ['Изучаю ваш бизнес…', 'Подбираю цвета и шрифты…', 'Пишу тексты для обложки…', 'Собираю блоки страницы…', 'Придумываю товары для примера…', 'Проверяю, чтобы всё читалось…'];
async function aiBuild() {
  const brief = ($('#brief').value || '').trim(); const btn = $('#buildBtn'); btn.disabled = true;
  const st = $('#buildSt'); let k = 0; st.innerHTML = `<div class="ai-wait"><span class="spin"></span> <span id="bstage">${BUILD_STAGES[0]}</span><small>Обычно 20–60 секунд</small></div>`;
  const tm = setInterval(() => { k = Math.min(k + 1, BUILD_STAGES.length - 1); const e = $('#bstage'); if (e) e.textContent = BUILD_STAGES[k]; }, 6000);
  let hint = ''; if (BUILD_IMGS[0]) { const c = await dominantColor(BUILD_IMGS[0].url); if (c) hint = `Главный цвет на первом изображении примерно ${c}.`; }
  const blobs = []; for (const b of BUILD_IMGS) blobs.push(await (await fetch(b.url)).blob());
  const r = await AI.json(`Ты — сильный веб-дизайнер конструктора сайтов TAP Business (Туркменистан). Собери главную страницу сайта-магазина.
Бизнес: «${S.biz.name}», сфера: ${S.biz.niche}, город: ${S.biz.city}.
Пожелания владельца: ${brief || 'нет, предложи сам лучшее решение для этой сферы'}.
${blobs.length ? 'Приложены изображения владельца (логотип, брендбук или фото витрины): возьми из них цвета бренда, настроение и стиль. ' + hint : ''}
Ответь ТОЛЬКО JSON:
{"theme":{"p":"#hex основной цвет бренда","bg":"#hex фон","tx":"#hex текст","sf":"#hex фон карточек","fh":"шрифт заголовков","fb":"шрифт текста","r":число 0-28,"btn":"fill|line|pill","up":true|false — заголовки прописными},
"sections":[{"type":"…","v":"…","st":{"bg":"p|sf|#hex (необязательно)"},"d":{поля}}],
"products":[{"name":"","price":число TMT,"old":число или null,"cat":"","desc":"одно предложение"}]}
Шрифты: ${FONTS.join(', ')}.
Типы, варианты и поля d: header a|b {logo}; hero stage|split|center|cover|type {eb:"короткая надпись над заголовком",title,text,btn,btn2}; marquee a {items:["5 коротких фраз"]}; slider a {items:[{e:"ярлык",t:"заголовок",x:"текст",btn}] 3 шт}; bento a {title,items:[{t,x}] 4 шт}; stats a {items:[{n:"12 000+",t:"подпись"}] 4 шт}; features cols|list {title,items:[{t,x}] 3 шт}; catalog grid|rail|list {title,sub}; promo band|card {title,text,btn}; text one|two {title,text}; gallery grid|mosaic {title}; reviews cards|quote {title,items:[{t,a}] 3 шт}; faq list {title,items:[{q,a}] 3 шт}; contacts split {title,addr,phone,hours,btn}; footer a {logo,text}.
Правила: 7–10 секций, сайт должен выглядеть дорого и современно: используй hero stage или split, marquee, catalog rail или grid, bento, stats; первая header, последняя footer; обязательно catalog (для ресторанов — вариант list). Тексты по-русски: коротко, конкретно, про этот бизнес, без штампов вроде «качество и надёжность». Заголовок обложки — до 7 слов. Адрес в городе ${S.biz.city}. Контраст текста к фону высокий. 5–6 товаров с реалистичными ценами в туркменских манатах.`, { images: blobs.length && AI.imgs ? blobs : undefined });
  clearInterval(tm); btn.disabled = false;
  if (!r || !Array.isArray(r.sections)) { st.innerHTML = `<p class="err">ИИ не собрал сайт. Нажмите ещё раз или выберите макет справа.</p>`; return; }
  S.site = siteFromAI(r); S.chat = [{ ai: 1, t: 'Собрал сайт по вашему описанию. Нажмите на любой текст, чтобы поправить, или напишите мне, что изменить.' }];
  if (BUILD_IMGS[0]) { const v = 'img:' + uid('i'); IMG[v.slice(4)] = BUILD_IMGS[0].url; const hero = S.site.secs.find(s => s.type === 'hero' && 'img' in s.d); if (hero && !/лого|logo/i.test(brief)) hero.d.img = v; }
  save(); go('editor');
}
function siteFromAI(r) {
  const base = siteFromTemplate('atlas', S.biz); const th = Object.assign({}, base.th);
  const t = r.theme || {}; ['p', 'bg', 'tx', 'sf'].forEach(k => { if (validHex(t[k])) th[k] = t[k]; }); ['fh', 'fb'].forEach(k => { if (FONTS.includes(t[k])) th[k] = t[k]; });
  if (t.r != null) th.r = clamp(+t.r || 0, 0, 28); if (['fill', 'line', 'pill'].includes(t.btn)) th.btn = t.btn; th.up = !!t.up;
  if (Math.abs(lum(th.tx) - lum(th.bg)) < 0.45) th.tx = onC(th.bg);
  const secs = [];
  for (const x of r.sections.slice(0, 10)) {
    if (!BLOCKS[x.type] || x.type === 'zero') continue; const s = secMake(x.type, BLOCKS[x.type].vs[x.v] ? x.v : null, S.biz);
    if (x.d && typeof x.d === 'object') for (const [k, v] of Object.entries(x.d)) { if (!(k in s.d)) continue; if (Array.isArray(s.d[k]) && Array.isArray(v) && k === 'items') s.d.items = typeof s.d.items[0] === 'string' ? v.slice(0, 10).map(t => String(t).slice(0, 60)) : v.slice(0, 6).map((it, i) => Object.assign({}, s.d.items[i] || s.d.items[0], typeof it === 'object' ? it : {})); else if (typeof v === 'string') s.d[k] = v.slice(0, 400); }
    if (x.st && x.st.bg && (validHex(x.st.bg) || ['p', 'sf', 'bg', 'tx'].includes(x.st.bg))) s.st.bg = x.st.bg;
    secs.push(s);
  }
  if (!secs.length || secs[0].type !== 'header') secs.unshift(secMake('header', 'a', S.biz));
  if (!secs.some(s => s.type === 'catalog')) secs.splice(2, 0, secMake('catalog', S.biz.niche === 'Ресторан и кафе' ? 'list' : 'grid', S.biz));
  if (secs[secs.length - 1].type !== 'footer') secs.push(secMake('footer', 'a', S.biz));
  const products = Array.isArray(r.products) && r.products.length ? r.products.slice(0, 8).map(p => ({ id: uid('p'), name: String(p.name || 'Товар').slice(0, 80), price: Math.round(+p.price || 0), old: p.old ? Math.round(+p.old) : null, cat: String(p.cat || '').slice(0, 30), desc: String(p.desc || '').slice(0, 300), img: '' })) : base.products;
  return { v: 2, name: S.biz.name, niche: S.biz.niche, city: S.biz.city, tpl: 'ai', th, secs, products };
}
function quickDemo() {
  S.biz = { name: 'Aýdyň Style', niche: 'Одежда и обувь', city: 'Ашхабад' }; S.site = siteFromTemplate('atlas', S.biz);
  S.chat = []; save(); go('editor'); toast('Это редактор', 'Нажмите на любой текст или блок');
}

/* ================= editor bridge ================= */
function openEditor() {
  if (!S.site) { S.scr = 'start'; return render(); }
  document.body.className = 'in-ed';
  edOpen(S.site, { chat: S.chat, onSave: () => { S.chat = ED.chat; save(); }, onExit: () => { S.area = 'biz'; S.scr = S.published ? 'dash' : 'start'; save(); render(); }, onPublish: () => { S.area = 'biz'; S.scr = 'publish'; save(); render(); } });
}

/* ================= publish ================= */
SCR.publish = () => `<div class="wide">${steps(4)}<h2>${S.published ? 'Обновить сайт' : 'Публикация'}</h2><p class="mut">Собрать и редактировать сайт — бесплатно. Чтобы сайт работал для покупателей, выберите тариф. Оплата раз в месяц.</p>
  <div class="tar-g">${TARIFFS.map(t => `<button class="tar ${S.tariff === t.n ? 'on' : ''}" data-tar="${t.n}">${t.hot ? '<span class="tar-hot">Чаще выбирают</span>' : ''}<b>${t.n}</b><div class="tar-p">${fmt(t.p)} <small>TMT в месяц</small></div><ul>${t.d.map(x => `<li>${IC.check}${x}</li>`).join('')}</ul></button>`).join('')}</div>
  <div class="fl">Как оплатите</div><div class="seg wide pay">${['Наличными менеджеру', 'Через Töleg (Tole)'].map(p => `<button class="${S.pay === p ? 'on' : ''}" data-pay="${p}">${p}</button>`).join('')}</div>
  <div class="row g8 wrap pub-act"><button class="btn acc lg sheen" id="pubBtn" onclick="publish()">${S.published ? 'Обновить сайт' : 'Опубликовать сайт'}</button><button class="btn ghost lg" onclick="go('editor')">Вернуться в редактор</button></div><div id="pubSt"></div></div>`;
AFTER.publish = () => { $$('[data-tar]').forEach(b => b.onclick = () => { S.tariff = b.dataset.tar; render(); }); $$('[data-pay]').forEach(b => b.onclick = () => { S.pay = b.dataset.pay; render(); }); };
async function publish() {
  const btn = $('#pubBtn'); btn.disabled = true; $('#pubSt').innerHTML = `<div class="ai-wait"><span class="spin"></span> Публикую на сервере TAP, загружаю фото, создаю QR-код…</div>`;
  await Store.ready;
  if (!S.slug) {
    let base = translit(S.site.name) || 'shop'; if (DEMO_SITES[base]) base += '-tm'; let slug = base;
    const ex = await Store.get('sites', slug); if (ex) slug = base + '-' + Math.floor(100 + Math.random() * 900); S.slug = slug;
  }
  await uploadImagesOf(S.site);
  const doc = Object.assign(clone(S.site), { slug: S.slug, published: true, tariff: S.tariff, phone: S.phone, ts: Date.now(), rating: 5 });
  const ok = await Store.put('sites', S.slug, doc);
  btn.disabled = false;
  if (!ok) { $('#pubSt').innerHTML = `<p class="err">Не удалось сохранить сайт на сервере. Проверьте, что вы вошли в Claude, и попробуйте ещё раз.</p>`; return; }
  S.published = true; save(); go('live');
}
const siteURL = () => SITE_BASE + '#site-' + S.slug;
SCR.live = () => `<div class="narrow center"><div class="live-ok">${IC.check}</div><h2>Сайт работает</h2><p class="mut">Покупатели уже могут открыть его и оставить заявку. Товары появились в поиске TAP.</p>
  <div class="card live-c"><div class="qr" id="qr"></div><div class="live-l"><div><span>Адрес</span><b>${esc(S.slug)}.tap.tm</b></div><div><span>Короткая ссылка</span><b>tap.tm/${esc(S.slug)}</b></div><p class="hint">В демо QR-код открывает рабочую копию сайта.</p></div></div>
  <div class="row g8 wrap center"><button class="btn red" onclick="location.hash='site-'+S.slug">${IC.eye} Открыть сайт</button><button class="btn ghost" onclick="copyLink()">${IC.link} Скопировать ссылку</button></div>
  <button class="btn red full lg" onclick="S.dtab='home';go('dash')">Перейти в панель бизнеса ${ARWI}</button></div>`;
AFTER.live = () => drawQR('#qr', 180);
function drawQR(sel, size) { const e = $(sel); if (!e) return; e.innerHTML = ''; if (window.QRCode) new QRCode(e, { text: siteURL(), width: size, height: size, colorDark: '#15182e', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.M }); else e.innerHTML = `<div class="qr-fb">${IC.qr}</div>`; }
function copyLink() { const u = siteURL(); try { navigator.clipboard.writeText(u).then(() => toast('Ссылка скопирована'), () => toast('Ссылка', u)); } catch (e) { toast('Ссылка', u); } }

/* ================= dashboard ================= */
let DASH = { orders: [], chats: [], uo: null, uc: null };
function dashWatch() {
  if (!S.slug || DASH.slug === S.slug) return; DASH.slug = S.slug; DASH.uo && DASH.uo(); DASH.uc && DASH.uc();
  let first = true, knownO = new Set(), knownE = new Set();
  DASH.uo = Store.watch('orders', ['slug', S.slug], rows => { rows.sort((a, b) => b.ts - a.ts); if (!first) rows.forEach(o => { if (!knownO.has(o.id)) toast('Новая заявка', `${o.name}: ${o.item}`); }); rows.forEach(o => knownO.add(o.id)); first = false; DASH.orders = rows; if (S.area === 'biz' && S.scr === 'dash' && ['home', 'orders'].includes(S.dtab)) render(); else updBadges(); });
  DASH.uc = Store.watch('chats', ['slug', S.slug], rows => { rows.sort((a, b) => b.ts - a.ts); rows.forEach(c => { if (c.esc && !knownE.has(c.id + c.msgs.length)) { knownE.add(c.id + c.msgs.length); if (DASH.chats.length) toast('Покупатель ждёт вашего ответа', c.reason || 'Вопрос о скидке'); } }); DASH.chats = rows; if (S.area === 'biz' && S.scr === 'dash' && S.dtab === 'chats' && !document.activeElement.closest?.('.chat-c')) render(); else updBadges(); });
}
function updBadges() { const sd = $('#side'); if (sd && BIZ_KEYS.includes(S.area)) { const w = document.createElement('div'); w.innerHTML = sideHTML(); sd.replaceWith(w.firstElementChild); } const b = $('#bdO'); if (b) b.textContent = DASH.orders.filter(o => o.st === 'Новая').length || ''; const c = $('#bdC'); if (c) c.textContent = DASH.chats.filter(x => x.esc).length || ''; }
function dashNav() {
  const it = [['home', IC.home, 'Обзор'], ['orders', IC.inbox, 'Заявки', 'bdO', DASH.orders.filter(o => o.st === 'Новая').length], ['chats', IC.chat, 'Чаты', 'bdC', DASH.chats.filter(x => x.esc).length], ['smm', IC.mega, 'SMM-бот'], ['sys', IC.grid, 'Системы']];
  return `<nav class="dnav">${it.map(([k, i, n, id, b]) => `<button class="${S.dtab === k ? 'on' : ''}" onclick="S.dtab='${k}';save();render()">${i}<span>${n}</span>${id ? `<em id="${id}">${b || ''}</em>` : ''}</button>`).join('')}</nav>`;
}
SCR.dash = () => { dashWatch(); return `<div class="dash">${(DT[S.dtab] || DT.home)()}</div>`; };
AFTER.dash = () => { if (S.dtab === 'home') { drawQR('#qrs', 96); const t = $('#dashThumb'); if (t) t.innerHTML = `<div class="ld-in">${renderSite(S.site, { still: true })}</div>`; } if (S.dtab === 'prods') prodList($('#prodBox'), () => syncSite()); };
const DT = {};
DT.home = () => {
  const o = DASH.orders; const nw = o.filter(x => x.st === 'Новая').length; const esc_ = DASH.chats.filter(x => x.esc).length; const sum = o.filter(x => x.st !== 'Отменена').reduce((a, x) => a + (+x.price || 0), 0);
  return `<section class="d-hero"><div class="dots-d"></div><div class="l stagger"><div class="eyebrow"><i></i>Сайт работает · тариф ${esc(S.tariff)}</div><h2>${esc(S.site.name)}</h2><div class="lnk"><b>${esc(S.slug)}.tap.tm</b> · tap.tm/${esc(S.slug)}</div>
   <div class="row g8 wrap"><button class="btn acc sheen" onclick="go('editor')">${IC.blocks} Редактировать сайт</button><button class="btn glass" onclick="location.hash='site-'+S.slug">${IC.eye} Открыть</button><button class="btn glass" onclick="copyLink()">${IC.link} Ссылка</button></div></div>
   <div class="r"><div class="site-ph float"><div id="dashThumb"></div></div><div class="qr sm" id="qrs"></div></div></section>
  <div class="stats stagger"><button class="stat" onclick="S.dtab='orders';render()"><span>Новые заявки</span><b>${nw}</b></button><button class="stat" onclick="S.dtab='chats';render()"><span>Ждут ответа</span><b>${esc_}</b></button><div class="stat"><span>Заявок всего</span><b>${o.length}</b></div><div class="stat"><span>Сумма заявок</span><b>${fmt(sum)} <small>TMT</small></b></div></div>
  <div class="tiles stagger"><button class="tile" onclick="S.dtab='prods';render()"><span>${IC.box}</span><span><b>Товары</b><small>${S.site.products.length} шт. · по фото с ИИ</small></span></button><button class="tile" onclick="S.dtab='smm';render()"><span>${IC.mega}</span><span><b>SMM-бот</b><small>Посты и сторис</small></span></button><button class="tile" onclick="nav('ai')"><span>${IC.spark}</span><span><b>ИИ-функции</b><small>Все помощники</small></span></button><button class="tile" onclick="nav('agg')"><span>${IC.link}</span><span><b>Агрегаторы</b><small>Доставка, оплата, соцсети</small></span></button><button class="tile dk" onclick="nav('sys')"><span>${IC.grid}</span><span><b>Resto OS</b><small>Готовые системы</small></span></button></div>`;
};
const OST = ['Новая', 'Подтверждена', 'У курьера', 'Выполнена', 'Отменена'];
DT.orders = () => `<div class="dh"><h2>Заявки</h2></div>${DASH.orders.length ? `<div class="list">${DASH.orders.map(o => `<div class="card ord"><div class="row"><b>${esc(o.name)}</b><span class="tag ${o.st === 'Новая' ? 'warn' : o.st === 'Выполнена' ? 'ok' : o.st === 'Отменена' ? 'bad' : ''}">${o.st}</span><span class="mut sm ml">${new Date(o.ts).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span></div><div class="ord-i">${esc(o.item)} — <b>${fmt(o.price)} TMT</b></div><div class="mut sm">${esc(o.phone)} · номер подтверждён по SMS${o.addr ? ' · ' + esc(o.addr) : ''} · ${esc(o.src || 'сайт')}</div><div class="row g8 wrap">${o.st === 'Новая' ? `<button class="btn acc sm" onclick="setOrd('${o.id}','Подтверждена')">Подтвердить</button><button class="btn ghost sm" onclick="setOrd('${o.id}','Отменена')">Отменить</button>` : o.st === 'Подтверждена' ? `<button class="btn red sm" onclick="courier('${o.id}')">${IC.truck} Вызвать курьера</button>` : o.st === 'У курьера' ? `<button class="btn red sm" onclick="setOrd('${o.id}','Выполнена')">Доставлено</button>` : ''}</div></div>`).join('')}</div>` : `<div class="empty"><b>Заявок пока нет</b><p>Откройте свой сайт или найдите свой товар в TAP и оставьте тестовую заявку — она появится здесь сразу.</p><div class="row g8 wrap center"><button class="btn red" onclick="location.hash='site-'+S.slug">Открыть сайт</button><button class="btn ghost" onclick="setMode('tap')">Открыть TAP</button></div></div>`}`;
async function setOrd(id, st) { const ok = await Store.patch('orders', id, { st }); if (ok) toast('Статус: ' + st, 'Покупатель получил SMS и push'); }
function courier(id) { sheet(`<h3 class="sh-t">Курьерская служба</h3><p class="mut">Партнёры TAP в вашем городе</p><div class="list">${[['Ýol Express', '45 мин', 25], ['Çalt Eltip', '1 час', 20], ['Kuryer TM', '2 часа', 15]].map(c => `<button class="card row cour" onclick="closeSheet();setOrd('${id}','У курьера');toast('${c[0]} принял заказ','Курьер будет через ${c[1]}')"><b>${c[0]}</b><span class="mut ml">${c[1]} · ${c[2]} TMT</span></button>`).join('')}</div>`); }
DT.chats = () => `<div class="dh"><div><h2>Чаты с покупателями</h2><p class="mut">ИИ-продавец отвечает сам и знает ваши цены. Скидки и сложные вопросы он передаёт вам.</p></div></div>${DASH.chats.length ? `<div class="list">${DASH.chats.map(c => `<div class="card chat-c ${c.esc ? 'hl' : ''}"><div class="row"><b>${esc(c.buyer || 'Покупатель')}</b><span class="tag">${esc(c.item || '')}</span>${c.esc ? '<span class="tag warn ml">Нужен ваш ответ</span>' : ''}</div><div class="msgs">${(c.msgs || []).slice(-8).map(m => `<div class="msg ${m.w === 'c' ? 'in' : m.w === 'own' ? 'own' : 'ai'}"><small>${m.w === 'c' ? 'Покупатель' : m.w === 'own' ? 'Вы' : 'ИИ-продавец'}</small>${esc(m.t)}</div>`).join('')}</div>${c.esc ? `<div class="esc-box"><b>${esc(c.reason || 'Покупатель просит скидку')}</b><div class="row g8 wrap"><button class="btn red sm" onclick="ownReply('${c.id}','Хорошо, для вас скидка 5%. Оформляю заявку?')">Дать 5%</button><button class="btn red sm" onclick="ownReply('${c.id}','Договорились — скидка 10% для вас. Оформляю?')">Дать 10%</button><button class="btn ghost sm" onclick="ownReply('${c.id}','Цена уже минимальная, но доставку сделаем бесплатно.')">Отказать вежливо</button></div></div>` : ''}<form class="row g8" onsubmit="event.preventDefault();ownReply('${c.id}',this.r.value)"><input name="r" placeholder="Ответить самому…"><button class="ib red" aria-label="Отправить">${IC.send}</button></form></div>`).join('')}</div>` : `<div class="empty"><b>Чатов пока нет</b><p>Откройте TAP, найдите свой товар, нажмите «Написать» и попросите скидку — увидите, как ИИ передаст вопрос вам.</p><button class="btn red" onclick="setMode('tap')">Открыть TAP</button></div>`}`;
async function ownReply(id, t) { t = String(t || '').trim(); if (!t) return; const c = DASH.chats.find(x => x.id === id); if (!c) return; const msgs = (c.msgs || []).concat([{ w: 'own', t, ts: Date.now() }]); await Store.patch('chats', id, { msgs, esc: false }); toast('Ответ отправлен', 'Покупатель получил push'); }
DT.prods = () => `<div class="dh"><div><h2>Товары</h2><p class="mut">Изменения сразу видны на сайте и в поиске TAP.</p></div><button class="btn ghost" onclick="S.dtab='home';render()">${IC.back} Обзор</button></div><div class="card"><div id="prodBox"></div></div>`;
async function syncSite() { save(); if (S.published) { await uploadImagesOf(S.site); await Store.put('sites', S.slug, Object.assign(clone(S.site), { slug: S.slug, published: true, tariff: S.tariff, ts: Date.now(), rating: 5 })); } }
DT.plan = () => `<div class="dh"><h2>Тариф: ${esc(S.tariff)}</h2><button class="btn ghost" onclick="S.dtab='home';render()">${IC.back} Обзор</button></div><div class="tar-g">${TARIFFS.map(t => `<div class="tar ${S.tariff === t.n ? 'on' : ''}"><b>${t.n}</b><div class="tar-p">${fmt(t.p)} <small>TMT в месяц</small></div><ul>${t.d.map(x => `<li>${IC.check}${x}</li>`).join('')}</ul>${S.tariff !== t.n ? `<button class="btn soft full" onclick="S.tariff='${t.n}';save();render();toast('Тариф изменён','${t.n}. Менеджер свяжется для оплаты')">Перейти</button>` : '<div class="tag ok">Ваш тариф</div>'}</div>`).join('')}</div>
<h3 class="h3s">Дополнительно</h3><div class="list">${ADDONS.map(a => `<div class="card row"><b>${a[0]}</b><span class="mut ml">${a[1]}</span><button class="btn soft sm" onclick="toast('Заявка отправлена','${a[0]} — менеджер позвонит')">Подключить</button></div>`).join('')}</div><p class="hint">Оплата наличными менеджеру или через Töleg. При оплате за год — 2 месяца в подарок.</p>`;

/* ---------- SMM bot ---------- */
const NETS = ['Instagram', 'TikTok', 'Telegram', 'Facebook', 'YouTube'];
function smm() { if (!S.smm) S.smm = { nets: { Instagram: true, Telegram: true, TikTok: false, Facebook: false, YouTube: false }, lang: 'RU', res: null, st: {} }; return S.smm; }
DT.smm = () => {
  const m = smm(); const r = m.res;
  return `<div class="dh"><div><h2>SMM-бот</h2><p class="mut">Бот готовит посты, сторис и сценарии видео. Ничего не публикует без вашего «Да».</p></div></div>
  <div class="card"><div class="fl">Подключённые соцсети</div><div class="chips">${NETS.map(n => `<button class="chip ${m.nets[n] ? 'on' : ''}" onclick="smm().nets['${n}']=!smm().nets['${n}'];save();render();${m.nets[n] ? '' : `toast('${n} подключён','Вход через официальный бизнес-аккаунт')`}">${m.nets[n] ? IC.check : IC.plus} ${n}</button>`).join('')}</div>
  <div class="fl">Язык контента</div><div class="seg">${[['TM', 'Türkmen'], ['RU', 'Русский'], ['TR', 'Türkçe'], ['EN', 'English']].map(([k, n]) => `<button class="${m.lang === k ? 'on' : ''}" onclick="smm().lang='${k}';save();render()">${n}</button>`).join('')}</div>
  <button class="btn acc lg sheen" id="smmBtn" onclick="smmGen()" style="margin-top:16px">${IC.spark} ${r ? 'Новый план на неделю' : 'Составить план на неделю'}</button><div id="smmSt"></div></div>
  ${r ? `<div class="card"><h3>Разбор и советы</h3><ul class="adv">${(r.advice || []).map(a => `<li>${esc(a)}</li>`).join('')}</ul><p class="hint">Сейчас бот опирается на ваш сайт и каталог. Со статистикой подключённых аккаунтов советы станут точнее.</p></div>
  <h3 class="h3s">Контент-план — ждёт вашего «Да»</h3><div class="list">${(r.plan || []).map((p, i) => { const s = m.st[i] || 'wait'; return `<div class="card plan"><div class="row g8 wrap"><span class="tag">${esc(p.day)} ${esc(p.time || '')}</span><span class="tag">${esc(p.net)}</span><span class="tag">${esc(p.type)}</span><span class="tag ${s === 'ok' ? 'ok' : s === 'no' ? 'bad' : 'warn'} ml">${s === 'ok' ? 'Одобрено' : s === 'no' ? 'Отклонено' : 'Ждёт ответа'}</span></div><b>${esc(p.title)}</b><p class="mut">${esc(p.caption)}</p><div class="row g8 wrap"><button class="btn ghost sm" onclick="storyPrev(${i})">${IC.eye} Превью</button>${s === 'wait' ? `<button class="btn red sm" onclick="smmSet(${i},'ok')">Да, публиковать</button><button class="btn ghost sm" onclick="smmSet(${i},'no')">Нет</button>` : ''}</div></div>`; }).join('')}</div>
  ${r.script ? `<div class="card"><h3>${IC.bolt} Сценарий Reels: ${esc(r.script.title || '')}</h3><ol class="shots">${(r.script.shots || []).map(s => `<li><b>${esc(s.t)}</b> ${esc(s.shot)}<div class="mut">Текст: ${esc(s.say)}</div></li>`).join('')}</ol><p class="hint">Снимите сами или закажите съёмочную команду TAP — 900 TMT за день, 4 ролика.</p></div>` : ''}
  ${r.idea ? `<div class="card hl"><h3>Бот предлагает</h3><p>${esc(r.idea)}</p><div class="row g8"><button class="btn red sm" onclick="toast('Идея принята','Бот подготовит материалы и пришлёт на одобрение')">Да, делай</button><button class="btn ghost sm" onclick="smmGen()">Другая идея</button></div></div>` : ''}` : ''}`;
};
async function smmGen() {
  const m = smm(); const btn = $('#smmBtn'); btn.disabled = true; $('#smmSt').innerHTML = `<div class="ai-wait"><span class="spin"></span> Бот изучает ваш сайт и каталог…<small>20–40 секунд</small></div>`;
  const nets = NETS.filter(n => m.nets[n]); const L = { TM: 'туркменском', RU: 'русском', TR: 'турецком', EN: 'английском' }[m.lang];
  const r = await AI.json(`Ты — SMM-менеджер для бизнеса в Туркменистане. Бизнес: «${S.site.name}», ${S.site.niche}, ${S.site.city}. Соцсети: ${nets.join(', ') || 'Instagram'}.
Товары: ${S.site.products.slice(0, 12).map(p => `${p.name} — ${p.price} TMT${p.old ? ' (было ' + p.old + ')' : ''}`).join('; ')}.
Сайт: tap.tm/${S.slug}. Сегодня ${new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}; учитывай ближайшие праздники и сезон.
Все тексты постов (title, caption, say) пиши на ${L} языке; advice и idea — по-русски.
Ответь ТОЛЬКО JSON: {"advice":["3 конкретных совета по ведению аккаунтов этого бизнеса"],"plan":[{"day":"Пн","time":"20:00","net":"одна из соцсетей","type":"Сторис|Пост|Reels","title":"заголовок на картинке, до 6 слов","caption":"подпись 1-2 предложения с призывом"}] — 5 пунктов на неделю,"script":{"title":"","shots":[{"t":"0–3 с","shot":"что в кадре","say":"текст на экране или голос"}] — 4 кадра на 15 секунд},"idea":"одна идея акции или серии контента по-русски"}`);
  btn.disabled = false; if (!r) { $('#smmSt').innerHTML = ''; return; }
  m.res = r; m.st = {}; save(); render();
}
function smmSet(i, s) { smm().st[i] = s; save(); render(); if (s === 'ok') toast('Одобрено', 'Бот опубликует в назначенное время'); }
function storyPrev(i) {
  const p = smm().res.plan[i]; const th = S.site.th; const pr = S.site.products[i % Math.max(1, S.site.products.length)] || {};
  sheet(`<h3 class="sh-t">${esc(p.type)} · ${esc(p.net)}</h3><p class="mut">Собрано в цветах и шрифтах вашего бренда</p><div class="story" style="background:${th.p};color:${onC(th.p)}"><div class="st-top">${esc(S.site.name)}</div><div class="st-img">${pvHTML(pr.id ? pr : { id: 'x', name: S.site.niche }, th)}</div><div class="st-t" style="font-family:'${th.fh}'">${esc(p.title)}</div><div class="st-b" style="background:${th.bg};color:${th.tx}">${pr.price ? fmt(pr.price) + ' TMT · ' : ''}tap.tm/${esc(S.slug)}</div></div><p>${esc(p.caption)}</p><div class="row g8">${(smm().st[i] || 'wait') === 'wait' ? `<button class="btn red" onclick="closeSheet();smmSet(${i},'ok')">Да, публиковать</button>` : ''}<button class="btn ghost" onclick="closeSheet()">Закрыть</button></div>`);
}

/* ---------- ready-made systems ---------- */
DT.sys = () => `<div class="dh"><div><h2>Готовые системы</h2><p class="mut">Посмотрите презентацию, попробуйте демо и закажите установку.</p></div></div>
<div class="card sys-main"><div class="dots-d"></div><div class="sys-ic">${IC.grid}</div><div><div class="row g8"><h3>Resto OS</h3><span class="tag acc">Доступно</span></div><p>Всё для ресторана и кафе в одной системе: QR-меню и заказ со стола, бронь и доставка, экран кухни и официанты, склад, касса и отчёты.</p><div class="row g12 wrap"><b class="price">9 900 TMT</b><span class="mut">разовая покупка, установка включена</span></div><div class="row g8 wrap"><button class="btn acc" onclick="resto('pres')">Презентация</button><button class="btn glass" onclick="resto('demo')">Попробовать демо</button><button class="btn glass" onclick="resto('buy')">Заказать установку</button></div></div></div>
<div class="sys-g">${[['Shop OS', 'Касса, склад и штрихкоды для магазина'], ['Beauty OS', 'Онлайн-запись в салоны, напоминания'], ['Clinic OS', 'Запись и карты пациентов'], ['Edu OS', 'Расписание и оплата курсов']].map(x => `<div class="card dim"><div class="row"><h3>${x[0]}</h3><span class="tag ml">В разработке</span></div><p class="mut">${x[1]}</p></div>`).join('')}</div>`;
let RESTO = { order: [], k: '' };
function resto(tab) {
  const menu = [['Плов', 60], ['Шашлык', 85], ['Манты', 45], ['Чай', 10]]; const sum = RESTO.order.reduce((a, i) => a + menu[i][1], 0);
  const tabs = `<div class="seg wide">${[['pres', 'Презентация'], ['demo', 'Демо'], ['buy', 'Заказать']].map(([k, n]) => `<button class="${tab === k ? 'on' : ''}" onclick="resto('${k}')">${n}</button>`).join('')}</div>`;
  let b = '';
  if (tab === 'pres') b = `<div class="pres"><p class="lead">Гость сканирует QR на столе и заказывает. Кухня видит заказ на экране. Официант приносит. Касса и склад считаются сами.</p><ol class="how">${[['QR-меню и заказ со стола', 'Без бумажного меню и ожидания официанта.'], ['Бронь, доставка, самовывоз', 'Заказы с сайта и из TAP — в одном окне.'], ['Экран кухни', 'Статусы: принят, готовится, готов.'], ['Склад, касса, отчёты', 'Выручка за день, остатки, лучшие блюда.']].map(x => `<li><b>${x[0]}</b><span>${x[1]}</span></li>`).join('')}</ol><button class="btn red" onclick="resto('demo')">Попробовать демо</button></div>`;
  if (tab === 'demo') b = `<div class="rdemo"><div class="card"><div class="fl">Гость · стол 4</div>${menu.map((m, i) => `<button class="rrow" onclick="RESTO.order.push(${i});resto('demo')"><span>${m[0]}</span><b>${m[1]} TMT</b><i>${IC.plus}</i></button>`).join('')}<button class="btn red full" ${RESTO.order.length ? '' : 'disabled'} onclick="restoGo()">Заказать · ${sum} TMT</button></div><div class="card"><div class="fl">Экран кухни</div><b>Стол 4</b><p class="mut">${RESTO.order.length ? RESTO.order.map(i => menu[i][0]).join(', ') : 'Заказов нет'}</p>${RESTO.k ? `<span class="tag ${RESTO.k === 'Готов' ? 'ok' : 'warn'}">${RESTO.k}</span>` : ''}<div class="fl" style="margin-top:16px">Касса</div><b>${RESTO.k === 'Готов' ? sum : 0} TMT</b></div></div>`;
  if (tab === 'buy') b = `<form class="list" onsubmit="event.preventDefault();closeSheet();toast('Заявка на Resto OS принята','Менеджер позвонит в течение часа')"><label class="in-l">Заведение<input required placeholder="Название"></label><label class="in-l">Телефон<input required inputmode="tel" placeholder="+993"></label><label class="in-l">Адрес<input placeholder="Город, улица"></label><button class="btn red full">Заказать установку · 9 900 TMT</button></form>`;
  sheet(`<h3 class="sh-t">Resto OS</h3>${tabs}<div style="margin-top:14px">${b}</div>`);
}
function restoGo() { RESTO.k = 'Принят'; resto('demo'); setTimeout(() => { RESTO.k = 'Готовится'; if ($('.rdemo')) resto('demo'); }, 1400); setTimeout(() => { RESTO.k = 'Готов'; if ($('.rdemo')) resto('demo'); }, 3000); }

/* ================= side pages: AI, systems, plans ================= */
const PAGES = {};
const AIF = [
  ['ИИ-сборка сайта', 'Опишите бизнес или загрузите логотип — ИИ подберёт цвета, шрифты, блоки и напишет тексты.', IC.spark, "go(S.phone ? 'start' : 'reg')", 'Собрать сайт', 1],
  ['ИИ-редактор', 'Пишете «сделай дороже и темнее» или «добавь отзывы» — сайт меняется сам.', IC.blocks, "aiTry('edit')", 'Открыть редактор'],
  ['Товар по фото', 'Сфотографировали товар — ИИ заполнит название, категорию, цену и описание на русском и туркменском.', IC.cam, "aiTry('photo')", 'Попробовать'],
  ['SMM-бот', 'План постов на неделю, сторис в цветах бренда и сценарии Reels. Публикует только после вашего «Да».', IC.mega, "aiTry('smm')", 'Открыть бота'],
  ['ИИ-поиск TAP', 'Покупатель пишет как говорит: «подарок девушке до 500» — ИИ находит товары во всех магазинах.', IC.search, "nav('buyer:home');setTimeout(()=>tapSearch('подарок девушке до 500'),50)", 'Попробовать'],
  ['Поиск по фото', 'Покупатель присылает фото вещи — TAP находит похожие товары и цены.', IC.img, "nav('buyer:home');setTimeout(()=>$('.sb-ic input')&&$('.sb-ic input').click(),80)", 'Загрузить фото'],
  ['ИИ-продавец', 'Отвечает покупателям в чате, знает ваши цены и наличие. Скидки передаёт владельцу.', IC.chat, "chatOpen('sportline','sportline-0')", 'Написать продавцу'],
  ['ИИ-тексты', 'Перепишет любой текст сайта: короче, продающе, на туркменский, турецкий или английский.', IC.text, "aiTry('edit')", 'Попробовать']];
function bizTabs(cur) { return `<div class="sec-h"><div><h2>Ещё в разделе «Бизнес»</h2></div></div><div class="biz-tabs">${bizNav()[1][1].filter(x => x[0] !== cur).map(([k, ic, n]) => `<button class="card row lift" onclick="nav('${k}')"><span class="ai-i sm">${ic}</span><b>${n}</b><span class="ml">${ARWI}</span></button>`).join('')}</div>`; }
PAGES.ai = () => `<section class="pg-hero"><div class="dots-d"></div><div class="eyebrow"><i></i>Работает на Claude</div><h1>ИИ-функции TAP</h1><p>Восемь помощников, которые делают работу дизайнера, копирайтера, SMM-менеджера и продавца.</p></section>
<div class="ai-g stagger">${AIF.map(a => `<div class="ai-c ${a[5] ? 'dk' : ''}">${a[5] ? '<div class="dots-d"></div>' : ''}<span class="ai-i">${a[2]}</span><h3>${a[0]}</h3><p>${a[1]}</p><button class="btn ${a[5] ? 'acc' : 'soft'} sm" onclick="${a[3]}">${a[4]} ${ARWI}</button></div>`).join('')}</div>${bizTabs('ai')}`;
function aiTry(k) {
  if (!S.site) { S.biz = { name: S.biz.name || 'Aýdyň Style', niche: S.biz.niche || 'Одежда и обувь', city: S.biz.city || 'Ашхабад' }; S.site = siteFromTemplate('atlas', S.biz); S.chat = []; }
  if (k === 'smm') { if (S.published) { S.area = 'biz'; S.scr = 'dash'; S.dtab = 'smm'; save(); return render(); } toast('SMM-бот — в кабинете', 'Сначала опубликуйте сайт'); return go('editor'); }
  go('editor'); setTimeout(() => { ED.panel = k === 'photo' ? 'prod' : 'ai'; edPanel(); }, 60);
}
const AGG = [
  ['Доставка', 'Курьерские партнёры', ['Ýol Express', 'Çalt Eltip', 'Kuryer TM'], IC.truck],
  ['Оплата', 'Приём платежей', ['Töleg', 'Наличные курьеру'], IC.crown],
  ['Соцсети', 'Публикации SMM-бота', ['Instagram', 'TikTok', 'Telegram', 'Facebook', 'YouTube'], IC.mega],
  ['Уведомления', 'SMS и push', ['SMS-шлюз', 'Push TAP'], IC.chat]];
PAGES.sys = () => `<section class="pg-hero"><div class="dots-d"></div><div class="eyebrow"><i></i>Готовые системы и агрегаторы</div><h1>Подключите и работайте</h1><p>Готовые программы для вашей сферы и сервисы, которые уже встроены в TAP.</p></section>
<div class="sys-big"><div class="dots-d"></div><div class="l"><span class="tag acc">Доступно</span><h2>Resto OS</h2><p>Всё для ресторана и кафе в одной системе: QR-меню и заказ со стола, бронь и доставка, экран кухни и официанты, склад, касса и отчёты.</p><div class="row g12 wrap"><b class="price">9 900 TMT</b><span>разовая покупка, установка включена</span></div><div class="row g8 wrap"><button class="btn acc" onclick="resto('pres')">Презентация</button><button class="btn glass" onclick="resto('demo')">Попробовать демо</button><button class="btn glass" onclick="resto('buy')">Заказать установку</button></div></div><div class="r">${['yyldyzkafe'].map(k => DEMO_SITES[k].products.slice(0, 3).map((p, i) => `<div class="bp-t bp-${i}">${pvHTML(p, DEMO_SITES[k].th)}</div>`).join('')).join('')}</div></div>
<div class="sec-h"><div><h2>Скоро</h2><p>Системы в разработке</p></div></div>
<div class="sys-g">${[['Shop OS', 'Касса, склад и штрихкоды для магазина'], ['Beauty OS', 'Онлайн-запись в салоны, напоминания'], ['Clinic OS', 'Запись и карты пациентов'], ['Edu OS', 'Расписание и оплата курсов']].map(x => `<div class="card"><div class="row"><h3>${x[0]}</h3><span class="tag ml">В разработке</span></div><p class="mut">${x[1]}</p><button class="btn soft sm" onclick="toast('Вы в списке ожидания','Сообщим, когда ${x[0]} будет готова')">Сообщить о запуске</button></div>`).join('')}</div>
${bizTabs('sys')}<div class="biz-more" hidden><button class="card row lift" onclick="nav('agg')"><span class="ai-i sm">${IC.link}</span><div><b>Агрегаторы</b><div class="mut sm">Доставка, оплата, соцсети, уведомления</div></div><span class="ml">${ARWI}</span></button></div>`;
PAGES.agg = () => `<section class="pg-hero"><div class="dots-d"></div><div class="eyebrow"><i></i>Бизнес · агрегаторы</div><h1>Всё уже подключено</h1><p>Доставка, оплата, соцсети и уведомления встроены в TAP. Включаются в кабинете одной кнопкой.</p></section>
<div class="agg-g">${AGG.map(a => `<div class="card agg"><div class="row"><span class="ai-i sm">${a[3]}</span><div><h3>${a[0]}</h3><span class="mut sm">${a[1]}</span></div></div><div class="chips">${a[2].map(n => `<span class="chip">${IC.check}${n}</span>`).join('')}</div><button class="btn soft sm" onclick="nav('biz')">Подключить в кабинете ${ARWI}</button></div>`).join('')}</div>${bizTabs('agg')}`;
PAGES.plans = () => `<section class="pg-hero"><div class="dots-d"></div><div class="eyebrow"><i></i>Тарифы TAP Business</div><h1>Собрать — бесплатно</h1><p>Платите только когда сайт работает для покупателей. Оплата раз в месяц, наличными менеджеру или через Töleg.</p></section>
<div class="tar-g">${TARIFFS.map(t => `<div class="tar ${t.hot ? 'on' : ''}">${t.hot ? '<span class="tar-hot">Чаще выбирают</span>' : ''}<b>${t.n}</b><div class="tar-p">${fmt(t.p)} <small>TMT в месяц</small></div><ul>${t.d.map(x => `<li>${IC.check}${x}</li>`).join('')}</ul><button class="btn ${t.hot ? 'acc' : 'soft'} full" onclick="S.tariff='${t.n}';save();nav('biz')">Выбрать</button></div>`).join('')}</div>
<div class="sec-h"><div><h2>Дополнительно</h2><p>Подключаются к любому тарифу</p></div></div><div class="list">${ADDONS.map(a => `<div class="card row"><b>${a[0]}</b><span class="mut ml">${a[1]}</span></div>`).join('')}</div><p class="hint">При оплате за год — 2 месяца в подарок.</p>${bizTabs('plans')}`;

/* ================= public site (#site-slug) ================= */
let PUB = { slug: null, site: null, unsub: null };
async function renderPublic(slug) {
  document.body.className = 'pub';
  if (PUB.slug !== slug) {
    PUB.slug = slug; PUB.site = null; PUB.unsub && PUB.unsub();
    $('#app').innerHTML = `<div class="pub-load"><span class="spin"></span> Открываю сайт…</div>`;
    if (DEMO_SITES[slug]) PUB.site = DEMO_SITES[slug];
    else { await Store.ready; PUB.unsub = Store.watchDoc('sites', slug, d => { PUB.site = d; if (location.hash === '#site-' + slug) drawPublic(); }); return; }
  }
  drawPublic();
}
function drawPublic() {
  const s = PUB.site;
  if (!s) { $('#app').innerHTML = `<div class="pub-load"><b>Сайт не найден</b><p class="mut">Возможно, он ещё не опубликован.</p><button class="btn red" onclick="nav('buyer:home')">На главную TAP</button></div>`; return; }
  onImgLoaded = () => { if (location.hash.startsWith('#site-')) drawPublic(); };
  const y = window.scrollY;
  $('#app').innerHTML = `<div class="pub-bar"><a onclick="nav('buyer:home')">${LOGO_MARK}<span>TAP</span></a><span>${esc(PUB.slug)}.tap.tm</span><button onclick="nav(S.area==='biz'?'biz':'buyer:home')" aria-label="Закрыть">${IC.x}</button></div><div id="pubSite">${renderSite(s)}</div><button class="pub-chat" onclick="chatOpen('${esc(PUB.slug)}',null)">${IC.chat}<span>Спросить продавца</span></button>`;
  wireSite($('#pubSite'), s, { slug: PUB.slug }); window.scrollTo(0, y);
}
function wireSite(root, site, opt) {
  siteMotion(root);
  root.onclick = e => {
    const a = e.target.closest('[data-act]'); const cat = e.target.closest('[data-cat]'); const card = e.target.closest('.ts-pc,.ts-pl');
    if (cat && cat.tagName === 'A') { e.preventDefault(); const c = cat.dataset.cat; $$('.ts-cats a', root).forEach(x => x.classList.toggle('on', x === cat)); $$('[data-pid].ts-pc,[data-pid].ts-pl', root).forEach(x => x.style.display = !c || x.dataset.cat === c ? '' : 'none'); return; }
    if (a) {
      e.preventDefault(); const act = a.dataset.act;
      if (act === 'order') { if (opt.preview) return toast('Это просмотр', 'На опубликованном сайте откроется заявка'); return orderSheet(opt.slug, a.dataset.pid); }
      if (act === 'chat') { if (opt.preview) return toast('Это просмотр'); return chatOpen(opt.slug, null); }
      const target = act === 'catalog' ? '.ts-catalog' : act === 'about' ? '[data-anchor="about"]' : act === 'contacts' ? '.ts-contacts' : null;
      const el = target && root.querySelector(target); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (card && !opt.preview) productSheet(opt.slug, card.dataset.pid);
  };
}

/* ================= TAP buyer app ================= */
let TAP_UNSUB = null;
function tapWatch() { if (TAP_UNSUB) return; Store.ready.then(() => { TAP_UNSUB = Store.watch('sites', null, rows => { LIVE_SITES = {}; rows.forEach(r => { if (r.published && r.slug) LIVE_SITES[r.slug] = r; }); if (S.area === 'buyer' && !location.hash.startsWith('#site-')) renderTap(true); }); }); }
function allSites() { return Object.assign({}, DEMO_SITES, LIVE_SITES); }
function siteOf(slug) { return LIVE_SITES[slug] || DEMO_SITES[slug] || (PUB.slug === slug ? PUB.site : null); }
function catalog() { const out = []; for (const [slug, s] of Object.entries(allSites())) for (const p of s.products || []) out.push({ k: slug + '|' + p.id, slug, s, p }); return out; }
function renderTap(soft) {
  tapWatch(); const t = S.tap; S.area = 'buyer';
  if (soft && document.activeElement && document.activeElement.id === 'tq') return;
  if (location.hash.startsWith('#site-')) return;
  shell(`<div class="tap">${(TV[t.tab] || TV.home)()}</div>`);
}
const TV = {};
const CATS = [['Обувь', 'кроссовки обувь кеды ботинки', 'shoe'], ['Одежда', 'одежда худи платье костюм джинсы', 'top'], ['Электроника', 'электроника наушники смартфон часы', 'phone'], ['Еда', 'плов шашлык манты еда', 'plate'], ['Цветы', 'цветы букет розы пионы', 'flower'], ['Красота', 'маникюр стрижка макияж', 'polish'], ['Подарки', 'подарок шары набор', 'gift'], ['Аксессуары', 'кепка сумка рюкзак носки', 'bag']];
function catIc(k) { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${PI[k]}</svg>`; }
const SORTS = [['', 'Рекомендуем'], ['cheap', 'Сначала дешевле'], ['sale', 'Со скидкой']];
TV.home = () => {
  const t = S.tap; const sites = Object.values(allSites());
  let all = catalog(); if (t.city) all = all.filter(x => x.s.city === t.city);
  if (t.sort === 'cheap') all = all.slice().sort((a, b) => a.p.price - b.p.price); else if (t.sort === 'sale') all = all.filter(x => x.p.old && x.p.old > x.p.price);
  else all = all.slice().sort((a, b) => (a.slug === S.slug ? -1 : 0) - (b.slug === S.slug ? -1 : 0) || (a.k.length % 7) - (b.k.length % 7));
  return `<section class="b-top"><form class="sbar" onsubmit="event.preventDefault();tapSearch($('#tq').value)"><span>${IC.search}</span><input id="tq" placeholder="Найти: белые кроссовки до 800 манат" value="${esc(t.q)}" autocomplete="off"><label class="sb-ic" title="Найти по фото">${IC.cam}<input type="file" accept="image/*" hidden onchange="tapPhoto(this)"></label><button class="btn red"><span class="hide-s">Найти</span>${ARWI}</button></form>
  <div class="cats">${CATS.map(c => `<button class="cat press" onclick="tapSearch('${c[0].toLowerCase()} ${c[1]}')"><span>${catIc(c[2])}</span><b>${c[0]}</b></button>`).join('')}</div></section>
  ${t.res ? `<div id="tres">${t.res.loading ? `<div class="ai-wait"><span class="spin"></span> ИИ ищет по всем магазинам…</div>` : resHTML()}</div>` : `
  <div class="sec-h first"><div><h2>Товары</h2><p>${all.length} товаров из ${sites.length} магазинов · ${t.city || 'все города'}</p></div><div class="row g8 wrap fl-r"><select onchange="S.tap.city=this.value;renderTap()" aria-label="Город"><option value="">Все города</option>${CITIES.map(c => `<option ${t.city === c ? 'selected' : ''}>${c}</option>`).join('')}</select><select onchange="S.tap.sort=this.value;renderTap()" aria-label="Сортировка">${SORTS.map(([k, n]) => `<option value="${k}" ${(t.sort || '') === k ? 'selected' : ''}>${n}</option>`).join('')}</select></div></div>
  <div class="pgrid">${all.slice(0, 10).map(cardHTML).join('')}</div>
  <section class="b-promo"><div class="dots-d"></div><div class="l"><div class="eyebrow"><i></i>Для бизнеса</div><h2>Откройте свой магазин на TAP</h2><p>ИИ соберёт сайт за минуту, а ваши товары появятся здесь — в поиске для всей страны.</p><div class="row g8 wrap"><button class="btn acc" onclick="nav('biz')">Открыть магазин ${ARWI}</button><button class="btn glass" onclick="nav('ai')">${IC.spark} ИИ-функции</button></div></div><div class="r">${['sportline', 'gadgettm', 'guldunya'].map((k, i) => { const s = DEMO_SITES[k]; return `<div class="bp-t bp-${i}">${pvHTML(s.products[0], s.th)}</div>`; }).join('')}</div></section>
  <div class="sec-h"><div><h2>Магазины на TAP</h2><p>Сайты, собранные в TAP Business</p></div></div>
  <div class="shops">${sites.map(s => `<button class="shop" onclick="location.hash='site-${esc(s.slug)}'"><i style="background:${s.th.p};color:${onC(s.th.p)};font-family:'${s.th.fh}'">${esc((s.name || '?')[0])}</i><b>${esc(s.name)}</b><span>${esc(s.niche)} · ${esc(s.city)}</span>${s.demo ? '' : '<em>Новый</em>'}</button>`).join('')}</div>
  ${all.length > 10 ? `<div class="sec-h"><div><h2>Ещё товары</h2></div></div><div class="pgrid">${all.slice(10).map(cardHTML).join('')}</div>` : ''}`}`;
};
TV.cats = () => `<h2>Категории</h2><p class="mut">Выберите — покажем товары всех магазинов</p><div class="cat-g">${CATS.map(c => `<button class="cat-c lift" onclick="S.tap.tab='home';tapSearch('${c[0].toLowerCase()} ${c[1]}')"><span>${catIc(c[2])}</span><b>${c[0]}</b><small>${catalog().filter(x => new RegExp(c[1].split(' ').map(w => w.slice(0, 5)).join('|'), 'i').test(x.p.name + ' ' + x.p.cat)).length} товаров</small></button>`).join('')}</div>`;
function cardHTML(x) { const f = S.tap.fav[x.k]; return `<div class="pc" data-k="${esc(x.k)}" onclick="productSheet('${esc(x.slug)}','${esc(x.p.id)}')"><div class="pc-i">${pvHTML(x.p, x.s.th)}${x.p.old && x.p.old > x.p.price ? `<span class="sale">−${Math.round(100 - x.p.price / x.p.old * 100)}%</span>` : ''}<button class="fav ${f ? 'on' : ''}" onclick="event.stopPropagation();favT('${esc(x.k)}')" aria-label="В избранное">${IC.heart}</button></div><div class="pc-b"><div class="pc-n">${esc(x.p.name)}</div><div class="pc-p"><b>${fmt(x.p.price)} TMT</b>${x.p.old ? `<s>${fmt(x.p.old)}</s>` : ''}</div><div class="pc-s">${esc(x.s.name)} · ${esc(x.s.city)} · ★ ${x.s.rating || 5}</div></div></div>`; }
function favT(k) { S.tap.fav[k] = !S.tap.fav[k]; LS.set('fav', S.tap.fav); renderTap(); }
function resHTML() { const r = S.tap.res; const shops = new Set(r.items.map(x => x.slug)); return `<div class="understood">${IC.spark}<div><b>${esc(r.understood || 'Ищу: ' + S.tap.q)}</b><span>Найдено ${r.items.length} в ${shops.size} магазинах${r.ai ? '' : ' · простой поиск'}</span></div><button class="ib" onclick="S.tap.res=null;S.tap.q='';renderTap()" aria-label="Сбросить">${IC.x}</button></div>${r.items.length ? `<div class="pgrid">${r.items.map(cardHTML).join('')}</div>` : `<div class="empty"><b>Ничего не нашлось</b><p>Опишите иначе или уберите фильтр города.</p></div>`}`; }
function stem(w) { return w.replace(/(иями|ями|ами|ого|ему|ыми|ими|ые|ий|ая|ое|ых|ой|ей|ам|ах|ов|ев|ы|и|а|я|е|у|ю|о)$/, ''); }
function localSearch(q) {
  const l = q.toLowerCase(); const mx = (l.match(/до\s*(\d+)/) || [])[1]; const ws = l.replace(/\d+/g, ' ').split(/[^a-zа-яёäçňöşüýž]+/i).filter(w => w.length > 2 && !['для', 'где', 'манат', 'тмт', 'хочу', 'нужен', 'нужна', 'купить'].includes(w)).map(stem).filter(w => w.length > 2);
  return catalog().map(x => { const t = (x.p.name + ' ' + (x.p.cat || '') + ' ' + x.s.niche + ' ' + x.s.city).toLowerCase(); return { x, sc: ws.reduce((a, w) => a + (t.includes(w) ? 1 : 0), 0) }; }).filter(o => o.sc > 0 && (!mx || o.x.p.price <= +mx)).sort((a, b) => b.sc - a.sc || a.x.p.price - b.x.p.price).map(o => o.x);
}
async function tapSearch(q, img) {
  q = String(q || '').trim(); if (!q && !img) return; S.tap.q = q; S.tap.res = { loading: 1 }; renderTap();
  let cat = catalog(); if (S.tap.city) cat = cat.filter(x => x.s.city === S.tap.city);
  const lines = cat.slice(0, 400).map((x, i) => `${i}|${x.p.name}|${x.p.cat || ''}|${x.p.price}${x.p.old ? '(было ' + x.p.old + ')' : ''}|${x.s.name}|${x.s.niche}|${x.s.city}`).join('\n');
  const r = await AI.json(`Ты — умный поиск TAP по товарам и услугам магазинов Туркменистана. Покупатель ${img ? 'прислал фото того, что ищет' + (q ? ' и написал: «' + q + '»' : '') : 'ищет: «' + q + '»'}.
Пойми смысл (синонимы, опечатки, туркменские и английские слова, бюджет «до N», город, повод — например «подарок девушке»). Выбери подходящие позиции из каталога ниже, лучшие первыми, не больше 24. Не добавляй неподходящее ради количества.
Каталог (номер|название|категория|цена TMT|магазин|сфера|город):
${lines}
Ответь ТОЛЬКО JSON: {"understood":"как ты понял запрос, коротко по-русски, напр. «Белые беговые кроссовки до 800 TMT»","ids":[номера]}`, { modelTier: 'quick', images: img ? [img] : undefined });
  let items, ai = false, understood = '';
  if (r && Array.isArray(r.ids)) { items = r.ids.map(i => cat[+i]).filter(Boolean); ai = true; understood = r.understood; }
  else items = localSearch(q).filter(x => !S.tap.city || x.s.city === S.tap.city);
  S.tap.res = { items, ai, understood }; if (img && !q) S.tap.q = understood || 'Поиск по фото'; renderTap();
}
async function tapPhoto(inp) { const f = inp.files[0]; if (!f) return; const d = await fileToData(f, 1000); const b = await (await fetch(d)).blob(); tapSearch('', b); }
TV.deals = () => `<h2>Скидки и акции</h2><p class="mut">Товары со скидкой во всех магазинах TAP</p><div class="pgrid">${catalog().filter(x => x.p.old && x.p.old > x.p.price).map(cardHTML).join('')}</div>`;
TV.me = () => { const fav = catalog().filter(x => S.tap.fav[x.k]); const subs = Object.keys(S.tap.subs).filter(k => S.tap.subs[k]).map(siteOf).filter(Boolean); return `<h2>Моё</h2><h3 class="h3s">Избранное</h3>${fav.length ? `<div class="pgrid">${fav.map(cardHTML).join('')}</div>` : '<p class="mut">Нажмите на сердечко у товара, чтобы сохранить его.</p>'}<h3 class="h3s">Подписки на магазины</h3>${subs.length ? `<div class="list">${subs.map(s => `<button class="card row" onclick="location.hash='site-${esc(s.slug)}'"><b>${esc(s.name)}</b><span class="mut ml">${esc(s.city)}</span></button>`).join('')}</div>` : '<p class="mut">Подпишитесь на магазин, чтобы видеть новинки и акции.</p>'}<div class="card"><b>Аккаунт</b><p class="mut">Регистрация не обязательна. Push-уведомления о статусе заявок и акциях работают и без неё.</p><button class="btn ghost" onclick="toast('Вход по номеру','В демо вход не нужен')">Войти по номеру</button></div>`; };

/* ---------- product, order, chat ---------- */
function productSheet(slug, pid) {
  const s = siteOf(slug); if (!s) return; const p = s.products.find(x => x.id === pid); if (!p) return;
  const same = catalog().filter(x => x.p.name.toLowerCase() === p.name.toLowerCase() && !(x.slug === slug && x.p.id === pid));
  const sub = S.tap.subs[slug];
  sheet(`<div class="ps"><div class="ps-i">${pvHTML(p, s.th)}</div><div class="ps-b"><h3 class="sh-t">${esc(p.name)}</h3><div class="ps-p"><b>${fmt(p.price)} TMT</b>${p.old ? `<s>${fmt(p.old)}</s>` : ''}</div>${p.desc ? `<p class="mut">${esc(p.desc)}</p>` : ''}
  <div class="shop-row"><i style="background:${s.th.p};color:${onC(s.th.p)}">${esc(s.name[0])}</i><div><b>${esc(s.name)}</b><span>${esc(s.city)} · ★ ${s.rating || 5}</span></div><button class="btn ${sub ? 'ghost' : 'soft'} sm" onclick="S.tap.subs['${esc(slug)}']=!S.tap.subs['${esc(slug)}'];LS.set('subs',S.tap.subs);productSheet('${esc(slug)}','${esc(pid)}')">${sub ? 'Вы подписаны' : 'Подписаться'}</button></div>
  ${same.length ? `<div class="fl">Этот товар в других магазинах</div><div class="cmp">${[{ s, p, slug }, ...same].sort((a, b) => a.p.price - b.p.price).map((x, i) => `<div class="${x.slug === slug ? 'me' : ''}"><span>${esc(x.s.name)}, ${esc(x.s.city)}</span>${i === 0 ? '<em>дешевле всех</em>' : ''}<b>${fmt(x.p.price)} TMT</b></div>`).join('')}</div>` : ''}
  <div class="row g8 ps-act"><button class="btn ghost" onclick="chatOpen('${esc(slug)}','${esc(pid)}')">${IC.chat} Написать</button><button class="btn red" onclick="orderSheet('${esc(slug)}','${esc(pid)}')">Оставить заявку</button></div>
  <button class="link" onclick="closeSheet();location.hash='site-${esc(slug)}'">Открыть сайт магазина</button></div></div>`);
}
function orderSheet(slug, pid) {
  const s = siteOf(slug); const p = s && s.products.find(x => x.id === pid); if (!p) return;
  const code = String(1000 + Math.floor(Math.random() * 9000));
  sheet(`<h3 class="sh-t">Заявка</h3><p class="mut">${esc(p.name)} · ${fmt(p.price)} TMT · оплата при получении</p><form class="list" id="ordF"><label class="in-l">Имя<input name="n" required autocomplete="name"></label><label class="in-l">Телефон<input name="ph" required inputmode="tel" placeholder="+993 6X XX XX XX"></label><label class="in-l">Адрес доставки<input name="a" placeholder="Можно не указывать"></label><div id="codeBox"></div><button class="btn red full lg" id="ordB">Получить SMS-код</button></form>`);
  $('#ordF').onsubmit = async e => {
    e.preventDefault(); const f = e.target;
    if (!f.c) { $('#codeBox').innerHTML = `<label class="in-l">Код из SMS<input name="c" class="code-in" inputmode="numeric" maxlength="4" value="${code}"></label>`; $('#ordB').textContent = 'Подтвердить заявку'; toast('SMS: код ' + code, 'В демо код подставлен сам'); return; }
    if (f.c.value.trim() !== code) return toast('Неверный код');
    $('#ordB').disabled = true;
    const o = { slug, shop: s.name, item: p.name, pid, price: p.price, name: f.n.value.trim(), phone: f.ph.value.trim(), addr: f.a.value.trim(), st: 'Новая', ts: Date.now(), src: location.hash.startsWith('#site-') ? 'сайт' : 'TAP' };
    if (!s.demo) await Store.put('orders', uid('o'), o);
    closeSheet(); toast('Заявка отправлена', `${s.name} свяжется с вами. Статус придёт push-уведомлением`);
  };
}
let CH = { id: null, unsub: null, data: null, busy: false };
async function chatOpen(slug, pid) {
  const s = siteOf(slug); if (!s) return; const p = pid ? s.products.find(x => x.id === pid) : null;
  const id = 'c' + uid(''); const greet = `Здравствуйте! Я ИИ-помощник магазина ${s.name}.${p ? ` ${p.name} — ${fmt(p.price)} TMT.` : ''} Подскажу по товарам, ценам и доставке.`;
  const c = { slug, shop: s.name, item: p ? p.name : 'Вопрос по магазину', buyer: 'Покупатель из ' + (location.hash.startsWith('#site-') ? 'сайта' : 'TAP'), msgs: [{ w: 'ai', t: greet, ts: Date.now() }], esc: false, ts: Date.now() };
  if (!s.demo) await Store.put('chats', id, c);
  S.tap.mychats = [{ id, slug, item: c.item, shop: s.name, demo: !!s.demo, local: s.demo ? c : null }, ...S.tap.mychats.filter(x => x.id !== id)].slice(0, 20); LS.set('mychats', S.tap.mychats);
  chatView(id);
}
function chatView(id) {
  const ref = S.tap.mychats.find(x => x.id === id); if (!ref) return; CH.unsub && CH.unsub(); CH.id = id; CH.data = ref.local || null;
  sheet(`<div class="chat-h"><b>${esc(ref.shop)}</b><span>Отвечает ИИ-помощник, владелец на связи</span></div><div class="msgs big" id="chM"></div><div class="chips" id="chQ">${['Есть в наличии?', 'Сделаете скидку?', 'Сколько доставка?', 'Хочу оформить'].map(x => `<button class="chip" onclick="chatSend('${x}')">${x}</button>`).join('')}</div><form class="row g8" onsubmit="event.preventDefault();chatSend(this.m.value);this.m.value=''"><input name="m" placeholder="Сообщение…" autocomplete="off"><button class="ib red" aria-label="Отправить">${IC.send}</button></form>`, 'chat');
  if (ref.demo) chatDraw(); else CH.unsub = Store.watchDoc('chats', id, d => { if (CH.id !== id) return; const had = CH.data; CH.data = d; chatDraw(); if (had && d && d.msgs.length > had.msgs.length && d.msgs.at(-1).w === 'own') toast('Ответ владельца', d.msgs.at(-1).t); });
}
function chatDraw() { const m = $('#chM'); if (!m || !CH.data) return; m.innerHTML = CH.data.msgs.map(x => `<div class="msg ${x.w === 'c' ? 'me' : x.w === 'own' ? 'own' : 'ai'}"><small>${x.w === 'c' ? 'Вы' : x.w === 'own' ? 'Владелец магазина' : 'ИИ-помощник'}</small>${esc(x.t)}</div>`).join('') + (CH.busy ? '<div class="msg ai"><span class="spin"></span></div>' : ''); m.scrollTop = 1e6; }
async function chatSend(t) {
  t = String(t || '').trim(); if (!t || !CH.data || CH.busy) return; const ref = S.tap.mychats.find(x => x.id === CH.id); const s = siteOf(ref.slug); const c = CH.data;
  c.msgs = c.msgs.concat([{ w: 'c', t, ts: Date.now() }]); CH.busy = true; chatDraw(); if (!ref.demo) await Store.patch('chats', CH.id, { msgs: c.msgs, ts: Date.now() });
  const rules = `Ты — ИИ-продавец магазина «${s.name}» (${s.niche}, ${s.city}, Туркменистан) в приложении TAP. Отвечай коротко (1-3 предложения), вежливо, на языке покупателя. Знаешь только этот каталог:
${s.products.map(p => `- ${p.name}: ${p.price} TMT${p.old ? ' (было ' + p.old + ')' : ''}${p.cat ? ', ' + p.cat : ''}${p.desc ? ', ' + p.desc : ''}`).join('\n')}
Доставка по городу курьером-партнёром, обычно 20–25 TMT, оплата при получении. Чтобы заказать — кнопка «Оставить заявку».
Правила: никогда не обещай скидку и не меняй цену сам. Если просят скидку, торгуются, спрашивают то, чего нет в каталоге, или хотят живого человека — ответь, что передал вопрос владельцу и он ответит здесь, и поставь escalate=true. Не выдумывай наличие размеров и сроков, которых нет в каталоге — тогда тоже escalate=true.
Ответ ТОЛЬКО JSON: {"reply":"…","escalate":true|false,"reason":"если escalate — суть для владельца, напр. «Просит скидку 10% на 2 пары»"}`;
  const turns = [{ role: 'user', content: rules }]; c.msgs.slice(-10).forEach(m => { turns.push({ role: m.w === 'c' ? 'user' : 'assistant', content: (m.w === 'own' ? '[Владелец]: ' : '') + m.t }); });
  while (turns.length > 1 && turns[1].role === 'assistant') turns.splice(1, 1);
  const r = await AI.json(turns, { modelTier: 'quick', cache: false });
  CH.busy = false; const reply = r && r.reply ? String(r.reply) : 'Передал ваш вопрос владельцу — он ответит здесь.';
  const esc_ = r ? !!r.escalate : true;
  c.msgs = c.msgs.concat([{ w: 'ai', t: reply, ts: Date.now() }]);
  if (ref.demo) { ref.local = c; LS.set('mychats', S.tap.mychats); chatDraw(); if (esc_) setTimeout(() => toast(`Владелец ${s.name} получил уведомление`, 'Он ответит в этом чате'), 800); }
  else { await Store.patch('chats', CH.id, { msgs: c.msgs, esc: esc_ || c.esc, reason: esc_ ? (r && r.reason) || t : (c.reason || ''), ts: Date.now() }); chatDraw(); if (esc_) toast('Вопрос передан владельцу', 'Ответ придёт сюда и push-уведомлением'); }
  if (/оформ|заказ/i.test(t) && !esc_ && ref.slug) { const p = s.products.find(x => x.name === c.item); if (p) setTimeout(() => orderSheet(ref.slug, p.id), 900); }
}
TV.chats = () => `<h2>Чаты с магазинами</h2>${S.tap.mychats.length ? `<div class="list">${S.tap.mychats.map(c => `<button class="card row" onclick="chatView('${c.id}')"><div><b>${esc(c.shop)}</b><div class="mut sm">${esc(c.item)}</div></div><span class="ml">${IC.chat}</span></button>`).join('')}</div>` : '<p class="mut">Откройте товар и нажмите «Написать» — ответит ИИ-помощник магазина.</p>'}`;

/* ================= boot ================= */
window.addEventListener('hashchange', () => { closeSheet(); const h = location.hash.slice(1); if (h === 'tap') S.area = 'buyer'; if (!h.startsWith('site-')) { PUB.slug = null; PUB.unsub && PUB.unsub(); PUB.unsub = null; } render(); });
(function boot() { S.area = 'buyer'; S.tap.tab = 'home'; if (S.scr === 'editor') S.scr = S.published ? 'dash' : (S.site ? 'start' : 'land'); if (location.hash === '#tap') history.replaceState(null, '', location.pathname); render(); })();
