// Runs in GitHub Actions: prepares AI data for the static site with the GOOGLE_API_KEY secret.
// Output: ai-data.json (no keys inside) — smart-search tags and descriptions, ready AI site builds, SMM plans.
// Results are cached between runs (.ai-cache/), so a rebuild spends no AI calls unless REFRESH=1.
import fs from 'node:fs';
import vm from 'node:vm';
import { askAI } from '../proxy/providers.js';

const env = process.env;
const CACHE = '.ai-cache/ai-data.json';
const refresh = env.REFRESH === 'true' || env.REFRESH === '1';
let data = {};
try { data = JSON.parse(fs.readFileSync(CACHE, 'utf8')); } catch { }
if (refresh) data = {};
data.tags ||= {}; data.sites ||= {}; data.smm ||= {};

function publish() { fs.mkdirSync('.ai-cache', { recursive: true }); data.updated = new Date().toISOString(); fs.writeFileSync(CACHE, JSON.stringify(data)); fs.writeFileSync('ai-data.json', JSON.stringify(data)); }
if (!env.GOOGLE_API_KEY && !env.ANTHROPIC_API_KEY) { console.log('No AI key secret — publishing cached data only.'); if (Object.keys(data.tags).length) publish(); process.exit(0); }

// Read the demo catalogue and niche copy straight from the site code.
const src = fs.readFileSync('app.js', 'utf8'); const site = fs.readFileSync('site.js', 'utf8');
const pick = (code, start, end) => { const i = code.indexOf(start); return code.slice(i + start.length - 1, code.indexOf(end, i) + 1); };
const SHOPS = vm.runInNewContext('(' + pick(src, 'const DEMO_SHOPS = [', '];\nconst DEMO_SITES') + ')');
const NICHES = Object.keys(vm.runInNewContext('(' + site.slice(site.indexOf('const NICHES = {') + 15, site.indexOf('/* ===== product visuals')).trim().replace(/;$/, '') + ')'));
const FONTS = vm.runInNewContext(pick(fs.readFileSync('core.js', 'utf8'), 'const FONTS = [', '];'));

let calls = 0; const MAX = +env.AI_MAX_CALLS || 40;
async function ask(prompt, tier = 'quick') {
  for (let attempt = 0; attempt < 2; attempt++) {
    if (calls++ >= MAX) throw new Error('call limit');
    const out = await askAI(env, { tier, messages: [{ role: 'user', content: prompt + '\n\nОтветь только JSON, без пояснений и без markdown.' }] });
    if (out.text == null) { console.warn('AI error', out.status, out.error); if (out.status === 429) await new Promise(r => setTimeout(r, 20000)); continue; }
    const t = out.text.trim(); const f = t.match(/```(?:json)?\s*([\s\S]*?)```/); const c = f ? f[1] : t.slice(Math.min(...['{', '['].map(x => t.indexOf(x)).filter(i => i >= 0)), Math.max(t.lastIndexOf('}'), t.lastIndexOf(']')) + 1);
    try { return JSON.parse(c); } catch { console.warn('bad JSON, retry'); }
  }
  return null;
}

try {
  // 1) Smart search: tags + descriptions for every product, one call per shop.
  for (const sh of SHOPS) {
    const items = sh.prods.map((p, i) => ({ id: sh.slug + '-' + i, name: p[0], cat: p[3], price: p[1] }));
    if (items.every(it => data.tags[it.id])) continue;
    const r = await ask(`Ты готовишь поисковый индекс маркетплейса TAP (Туркменистан). Магазин «${sh.name}» (${sh.niche}, ${sh.city}).
Для каждого товара дай: tags — 15-25 слов и коротких фраз, по которым его будут искать: синонимы, разговорные слова, частые опечатки, туркменские слова, английские слова, транслит, для кого и по какому поводу (например «подарок девушке», «на свадьбу», «для бега»), цвет и материал если понятно; ru — одно предложение описания по-русски; tm — то же по-туркменски.
Товары: ${JSON.stringify(items)}
Формат: {"<id>":{"tags":["…"],"ru":"…","tm":"…"}}`);
    if (r) for (const it of items) if (r[it.id] && Array.isArray(r[it.id].tags)) data.tags[it.id] = { tags: r[it.id].tags.map(String).slice(0, 30), ru: String(r[it.id].ru || ''), tm: String(r[it.id].tm || '') };
    console.log('tags', sh.slug, r ? 'ok' : 'fail');
  }
  // 2) Ready AI site builds: every niche × three moods.
  const MOODS = { dark: 'тёмный, дорогой, строгий, премиальный', bright: 'яркий, молодёжный, смелый, современный', soft: 'светлый, мягкий, уютный, дружелюбный' };
  for (const niche of NICHES) for (const [mood, desc] of Object.entries(MOODS)) {
    if (data.sites[niche]?.[mood]) continue;
    const r = await ask(`Ты — сильный веб-дизайнер конструктора сайтов TAP Business (Туркменистан). Собери главную страницу сайта-магазина. Сфера: ${niche}. Город: Ашхабад. Стиль: ${desc}.
Формат: {"theme":{"p":"#hex основной","bg":"#hex фон","tx":"#hex текст","sf":"#hex карточки","fh":"шрифт заголовков","fb":"шрифт текста","r":0-28,"btn":"fill|line|pill","up":true|false},"sections":[{"type":"…","v":"…","st":{"bg":"p|sf (необязательно)"},"d":{поля}}],"products":[{"name":"","price":число TMT,"old":число или null,"cat":"","desc":""}]}
Шрифты: ${FONTS.join(', ')}.
Типы и поля: header a|b {logo}; hero stage|split|center|cover|type {eb,title,text,btn,btn2}; marquee a {items:["5 фраз"]}; slider a {items:[{e,t,x,btn}] 3}; bento a {title,items:[{t,x}] 4}; stats a {items:[{n,t}] 4}; features cols|list {title,items:[{t,x}] 3}; catalog grid|rail|list {title,sub}; promo band|card {title,text,btn}; text one|two {title,text}; reviews cards|quote {title,items:[{t,a}] 3}; faq list {title,items:[{q,a}] 3}; contacts split {title,addr,phone,hours,btn}; footer a|b {logo,text}.
Правила: 7–10 секций, первая header, последняя footer, обязательно catalog. В logo пиши «Ваш бренд». Тексты по-русски, коротко, конкретно, без штампов. Высокий контраст. 5–6 товаров с реалистичными ценами в манатах.`, 'default');
    if (r && Array.isArray(r.sections)) (data.sites[niche] ||= {})[mood] = r;
    console.log('site', niche, mood, r ? 'ok' : 'fail');
  }
  // 3) SMM plans per niche.
  for (const niche of NICHES) {
    if (data.smm[niche]) continue;
    const r = await ask(`Ты — SMM-менеджер для бизнеса в Туркменистане, сфера: ${niche}. Составь план на неделю для Instagram, Telegram и TikTok.
Формат: {"advice":["3 конкретных совета"],"plan":[{"day":"Пн","time":"20:00","net":"Instagram","type":"Сторис|Пост|Reels","title":"до 6 слов","caption":"1-2 предложения с призывом"}] — 5 пунктов,"script":{"title":"","shots":[{"t":"0–3 с","shot":"что в кадре","say":"текст"}] — 4 кадра},"idea":"идея акции"}. Всё по-русски.`);
    if (r && Array.isArray(r.plan)) data.smm[niche] = r;
    console.log('smm', niche, r ? 'ok' : 'fail');
  }
} catch (e) { console.warn('stopped:', e.message); }
console.log('AI calls used:', calls);
publish();
