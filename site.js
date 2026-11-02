'use strict';
const NICHES = {
  'Одежда и обувь': { cat: 'Каталог', order: 'Заказать', hero: ['Новая коллекция уже в магазине', 'Примерка при доставке, обмен размера в течение 14 дней.', 'Смотреть каталог'],
    feats: [['Примерка дома', 'Курьер подождёт, пока вы примерите.'], ['Обмен 14 дней', 'Не подошёл размер — поменяем без вопросов.'], ['Только оригинал', 'Привозим напрямую от производителей.']],
    rev: [['Взяла кроссовки на вечер — утром уже были у двери. Размер в размер.', 'Aýna, Ашхабад'], ['Поменяли размер за один день, без лишних вопросов.', 'Merdan, Мары'], ['Цены ниже, чем на базаре, а качество лучше.', 'Jeren, Ашхабад']],
    faq: [['Как узнать свой размер?', 'В карточке каждого товара есть таблица размеров. Если сомневаетесь — напишите нам.'], ['Сколько стоит доставка?', 'По Ашхабаду — 20 TMT, от 500 TMT — бесплатно.'], ['Можно оплатить при получении?', 'Да, наличными или картой курьеру.']],
    promo: ['−15% на первый заказ', 'Назовите промокод TAP15 при оформлении.', 'Выбрать товар'],
    about: ['Одежда, которую носят каждый день', 'Мы собираем коллекции под климат Туркменистана: лёгкие ткани летом, тёплые куртки зимой.'],
    prods: [['Кроссовки беговые белые', 890, 1100, 'Обувь', 'Лёгкие, дышащая сетка, размеры 36–45.'], ['Худи оверсайз', 450, null, 'Одежда', 'Плотный хлопок, 5 цветов.'], ['Джинсы прямые', 520, 610, 'Одежда', 'Классический крой, плотный деним.'], ['Кепка базовая', 150, null, 'Аксессуары', 'Регулируемый ремешок.'], ['Куртка демисезонная', 1290, null, 'Одежда', 'Водоотталкивающая ткань.'], ['Рюкзак городской', 380, 450, 'Аксессуары', 'Отделение для ноутбука 15".']] },
  'Ресторан и кафе': { cat: 'Меню', order: 'В заказ', hero: ['Горячий плов с 12:00 до последнего гостя', 'Готовим на огне в казане. Доставка по городу за 45 минут.', 'Открыть меню'],
    feats: [['Тамдыр каждый день', 'Свежий чурек к каждому заказу.'], ['Доставка за 45 минут', 'Привезём горячим в термосумке.'], ['Банкеты до 80 гостей', 'Свадьбы, дни рождения, корпоративы.']],
    rev: [['Лучший плов в городе, без шуток. Берём каждую пятницу.', 'Batyr, Ашхабад'], ['Заказали банкет на 40 человек — всё было идеально.', 'Gülälek, Мары'], ['Шашлык сочный, порции большие.', 'Döwlet, Ашхабад']],
    faq: [['Есть ли доставка?', 'Да, по городу за 45 минут. Бесплатно от 200 TMT.'], ['Можно забронировать стол?', 'Да, через сайт или по телефону.'], ['Есть детское меню?', 'Да, спросите у официанта.']],
    promo: ['Бизнес-ланч за 55 TMT', 'Суп, горячее и чай с 12:00 до 15:00 в будни.', 'Смотреть меню'],
    about: ['Кухня, как у бабушки', 'Готовим по семейным рецептам с 2009 года. Мясо — от фермеров Ахала.'],
    prods: [['Плов по-туркменски', 65, null, 'Горячее', 'Баранина, морковь, рис девзира.'], ['Шашлык из баранины', 90, null, 'Горячее', '300 г, с луком и зеленью.'], ['Манты, 6 шт', 48, null, 'Горячее', 'На пару, со сметаной.'], ['Чорба', 35, null, 'Супы', 'Густой суп из баранины.'], ['Чурек из тамдыра', 8, null, 'Хлеб', 'Прямо из печи.'], ['Чай зелёный, чайник', 12, null, 'Напитки', '0,8 л.']] },
  'Салон красоты': { cat: 'Услуги', order: 'Записаться', hero: ['Красота без очереди', 'Онлайн-запись к мастеру на удобное время. Напомним за час.', 'Записаться'],
    feats: [['Свободное время онлайн', 'Видно, кто из мастеров свободен.'], ['Стерильные инструменты', 'Сухожар и одноразовые пилки.'], ['Мастера с опытом от 5 лет', 'Обучение в Стамбуле и Москве.']],
    rev: [['Маникюр держится три недели, мастер — золото.', 'Maral, Ашхабад'], ['Записалась онлайн за минуту, никаких звонков.', 'Leýli, Ашхабад'], ['Сделали макияж на свадьбу сестры — все спрашивали, где.', 'Ogulgerek, Мары']],
    faq: [['Можно прийти без записи?', 'Да, если есть свободный мастер. С записью — без ожидания.'], ['Как отменить запись?', 'Напишите нам в чат за 2 часа.'], ['Есть подарочные сертификаты?', 'Да, от 200 TMT.']],
    promo: ['Второй визит −20%', 'Действует в течение месяца после первого.', 'Записаться'],
    about: ['Студия, куда хочется возвращаться', 'Шесть мастеров, уютный зал и кофе, пока сохнет покрытие.'],
    prods: [['Маникюр с покрытием', 180, 220, 'Ногти', '1,5 часа, стойкость до 3 недель.'], ['Педикюр', 220, null, 'Ногти', 'Аппаратный, с покрытием.'], ['Стрижка женская', 250, null, 'Волосы', 'С укладкой.'], ['Окрашивание', 600, null, 'Волосы', 'Цена зависит от длины.'], ['Макияж вечерний', 400, null, 'Макияж', 'Стойкий, 1 час.'], ['Брови: коррекция и окрашивание', 150, null, 'Брови', '40 минут.']] },
  'Электроника': { cat: 'Каталог', order: 'Заказать', hero: ['Гаджеты с официальной гарантией', 'Проверяем каждое устройство при вас. Гарантия 12 месяцев.', 'Смотреть каталог'],
    feats: [['Гарантия 12 месяцев', 'Сервисный центр в Ашхабаде.'], ['Проверка при получении', 'Курьер подождёт, пока вы проверите.'], ['Рассрочка', 'До 6 месяцев без переплаты.']],
    rev: [['Купил наушники — оригинал, проверил серийник.', 'Kerim, Ашхабад'], ['Привезли телефон в тот же день.', 'Aýgözel, Туркменабат'], ['Помогли выбрать ноутбук под учёбу.', 'Myrat, Ашхабад']],
    faq: [['Это оригинал?', 'Да, только официальные поставки, проверяйте серийный номер.'], ['Есть рассрочка?', 'Да, до 6 месяцев.'], ['Можно вернуть?', 'В течение 14 дней, если сохранена упаковка.']],
    promo: ['Чехол в подарок', 'К любому смартфону до конца месяца.', 'Выбрать смартфон'],
    about: ['Техника, в которой разбираемся', 'Консультируем честно: посоветуем дешевле, если хватит.'],
    prods: [['Наушники беспроводные Pro', 620, 750, 'Аудио', 'Шумоподавление, 30 ч работы.'], ['Смарт-часы Fit 5', 940, null, 'Гаджеты', 'Пульс, сон, уведомления.'], ['Смартфон 128 ГБ', 3900, 4300, 'Смартфоны', 'AMOLED, 5000 мА·ч.'], ['Повербанк 20000 мА·ч', 260, null, 'Аксессуары', 'Быстрая зарядка.'], ['Колонка портативная', 480, null, 'Аудио', 'Влагозащита IPX7.'], ['Ноутбук 15,6"', 7800, null, 'Ноутбуки', '16 ГБ, SSD 512 ГБ.']] },
  'Цветы и подарки': { cat: 'Букеты', order: 'Заказать', hero: ['Свежие цветы за 60 минут', 'Собираем букет при вас по видео и привозим с открыткой.', 'Выбрать букет'],
    feats: [['Фото перед отправкой', 'Пришлём фото букета в чат.'], ['Доставка за час', 'По Ашхабаду, с 8:00 до 23:00.'], ['Открытка бесплатно', 'Напишем ваш текст от руки.']],
    rev: [['Букет простоял две недели. Жена в восторге.', 'Serdar, Ашхабад'], ['Прислали фото до отправки — очень удобно.', 'Ene, Ашхабад'], ['Заказала из Стамбула маме — привезли через час.', 'Bägül, Стамбул']],
    faq: [['Можно заказать к точному времени?', 'Да, укажите время в заявке.'], ['Сколько стоит доставка?', 'По городу 25 TMT, от 600 TMT бесплатно.'], ['Что если букет не понравится?', 'Пересоберём бесплатно.']],
    promo: ['Пионы приехали', 'Сезон всего три недели — успейте.', 'Смотреть пионы'],
    about: ['Цветочная мастерская', 'Работаем с голландскими и местными фермами.'],
    prods: [['Букет 25 роз', 650, null, 'Розы', 'Красные, 60 см.'], ['Коробка с пионами', 480, 550, 'Пионы', '15 пионов в шляпной коробке.'], ['Букет тюльпанов', 320, null, 'Тюльпаны', '25 штук, микс.'], ['Композиция в корзине', 890, null, 'Композиции', 'Сезонные цветы.'], ['Шары гелиевые, 10 шт', 120, null, 'Шары', 'Любые цвета.'], ['Сладкий набор', 260, null, 'Подарки', 'Конфеты ручной работы.']] },
  'Другое': { cat: 'Каталог', order: 'Заказать', hero: ['Всё нужное — в одном месте', 'Оставьте заявку на сайте, мы перезвоним за 10 минут.', 'Смотреть каталог'],
    feats: [['Быстрый ответ', 'Перезвоним за 10 минут.'], ['Доставка по стране', 'Через курьерских партнёров.'], ['Оплата при получении', 'Наличными или картой.']],
    rev: [['Всё быстро и вежливо.', 'Aman, Ашхабад'], ['Удобно заказывать через сайт.', 'Bahar, Дашогуз'], ['Буду заказывать ещё.', 'Rahman, Мары']],
    faq: [['Как оформить заказ?', 'Нажмите «Заказать» и оставьте номер.'], ['Сколько стоит доставка?', 'Зависит от города, сообщим при звонке.'], ['Как оплатить?', 'При получении.']],
    promo: ['Скидка 10% новым клиентам', 'Скажите «TAP» при звонке.', 'Выбрать'],
    about: ['О нас', 'Работаем с 2018 года, тысячи довольных клиентов.'],
    prods: [['Товар 1', 100, null, 'Основное', 'Описание товара.'], ['Товар 2', 200, 240, 'Основное', 'Описание товара.'], ['Товар 3', 300, null, 'Другое', 'Описание товара.']] }
};

/* ===== product visuals (studio look, no photos needed) ===== */
const PI = {
  shoe: '<path d="M2 16.5h19.6c.3-1.7-.7-2.9-2.5-3.4l-5.2-1.4-3.1-3.4-2.3 1.2-1.7-1.3-3.4.7z"/><path d="M2 16.5v2.2h20v-2.2"/><path d="M8.7 10.4l1.3 1.4M10.7 9.5l1.3 1.4M6 18.7v-2.2"/>',
  top: '<path d="M8.2 3.2 12 5l3.8-1.8L21 7l-3 3.3-1.8-1.4V21H7.8V8.9L6 10.3 3 7z"/><path d="M10 5.6c.6 1.3 3.4 1.3 4 0"/>',
  pants: '<path d="M6.2 3h11.6l1.2 18h-5.3L12 9.6 10.3 21H5z"/><path d="M6.2 6h11.6M12 3v3"/>',
  dress: '<path d="M9.3 2.5l.7 3.6-2.6 4L4.5 21h15l-2.9-10.9-2.6-4 .7-3.6"/><path d="M10 6.1h4"/>',
  cap: '<path d="M4 14.8a8 8 0 0116 0z"/><path d="M3.5 14.8h17.5l-1.5 2.2H4.5z"/><circle cx="12" cy="6.4" r=".8"/>',
  bag: '<path d="M5 8.2h14l-1.1 12.8H6.1z"/><path d="M9 8.2V6.6a3 3 0 016 0v1.6"/>',
  sock: '<path d="M8.5 2.5h6.3V12l3.6 3.6a3 3 0 01-4.2 4.3l-5.7-5.7z"/><path d="M8.5 5.5h6.3"/>',
  bottle: '<path d="M10 2.5h4v2.8l1.6 2.2V20a1.6 1.6 0 01-1.6 1.6h-4A1.6 1.6 0 018.4 20V7.5L10 5.3z"/><path d="M8.4 11h7.2"/>',
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.6"/><path d="M11 18.6h2"/>',
  headphones: '<path d="M4 15v-3a8 8 0 0116 0v3"/><rect x="3" y="13.6" width="4.2" height="7.4" rx="1.6"/><rect x="16.8" y="13.6" width="4.2" height="7.4" rx="1.6"/>',
  watch: '<rect x="6.8" y="6.8" width="10.4" height="10.4" rx="3"/><path d="M9 6.8l1-4h4l1 4M9 17.2l1 4h4l1-4M12 9.6V12l1.6 1.2"/>',
  laptop: '<rect x="5" y="5" width="14" height="10" rx="1.6"/><path d="M2.5 18.2h19L20 15H4z"/>',
  battery: '<rect x="6.5" y="3" width="11" height="18" rx="2.6"/><path d="M12.6 7.8l-2.6 4.2h4l-2.6 4.2"/>',
  speaker: '<rect x="6" y="2.8" width="12" height="18.4" rx="3"/><circle cx="12" cy="14" r="3.6"/><circle cx="12" cy="6.9" r="1"/>',
  flower: '<path d="M12 12.2c-3.1 0-5-2.1-5-5.2 2 0 3.2.6 5 2.1 1.8-1.5 3-2.1 5-2.1 0 3.1-1.9 5.2-5 5.2z"/><path d="M12 9.1C10.6 7 10.9 4.6 12 3c1.1 1.6 1.4 4 0 6.1zM12 12.2V21M12 17.2c-1.8-2-3.8-2.2-5-1.2M12 15.4c1.8-2 3.8-2.2 5-1.2"/>',
  balloon: '<ellipse cx="12" cy="8.8" rx="5.2" ry="6.2"/><path d="M11.2 15h1.6l-.8 1.4zM12 16.4c0 2.2-2 2.4-2 4.6"/>',
  gift: '<rect x="4" y="9.5" width="16" height="11.5" rx="1"/><path d="M3 7h18v2.5H3zM12 7v14M12 7c-3.4 0-5.4-.8-5.4-2.6S9.8 3.2 12 7c2.2-3.8 5.4-4.4 5.4-2.6S15.4 7 12 7"/>',
  plate: '<path d="M2.8 13h18.4a9.2 6.2 0 01-18.4 0z"/><path d="M6 13c1-3 3.2-4.2 6-4.2s5 1.2 6 4.2M9.4 6c0-1 1-1.2 1-2.4M13.4 6c0-1 1-1.2 1-2.4"/>',
  skewer: '<path d="M3.5 20.5 20.5 3.5"/><rect x="5.6" y="12.6" width="4.4" height="4.4" rx="1.1" transform="rotate(-45 7.8 14.8)"/><rect x="9.6" y="8.6" width="4.4" height="4.4" rx="1.1" transform="rotate(-45 11.8 10.8)"/><rect x="13.6" y="4.6" width="4.4" height="4.4" rx="1.1" transform="rotate(-45 15.8 6.8)"/>',
  dumpling: '<path d="M3.5 15.5c0-4.3 3.8-7.4 8.5-7.4s8.5 3.1 8.5 7.4z"/><path d="M7.8 10l1 2.2M12 8.1v2.6M16.2 10l-1 2.2M2.5 18h19"/>',
  bowl: '<path d="M3 11.2h18a9 7 0 01-18 0z"/><path d="M8 3.8c0 2 1 2 1 4M12 3.8c0 2 1 2 1 4M16 3.8c0 2 1 2 1 4"/>',
  bread: '<ellipse cx="12" cy="13" rx="9" ry="6.2"/><circle cx="12" cy="13" r="2.6"/><path d="M12 6.8v1.6M12 17.6v1.6M5.6 13H4M20 13h-1.6"/>',
  cup: '<path d="M5 9h11v5.2a5 5 0 01-5 5h-1a5 5 0 01-5-5z"/><path d="M16 10.2h1.8a2 2 0 010 4H16M4 21.2h14M9 3.6c0 1.4 1 1.4 1 3M12.6 3.6c0 1.4 1 1.4 1 3"/>',
  polish: '<rect x="7" y="11" width="10" height="10" rx="2.2"/><path d="M9.4 11V8h5.2v3M11 8V2.8h2V8"/>',
  scissors: '<circle cx="6.2" cy="17.2" r="3"/><circle cx="17.8" cy="17.2" r="3"/><path d="M8.2 15 18 3M15.8 15 6 3"/>',
  lipstick: '<rect x="8" y="12" width="8" height="9.2" rx="1"/><path d="M9.4 12V8.2L14.6 5v7"/>',
  eye: '<path d="M2 12s3.8-6 10-6 10 6 10 6-3.8 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="2.6"/>',
  box: '<path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8M12 13v8"/>'
};
const PI_MAP = [[/кросс|кед|обув|ботин|туфл|кроссов/i, 'shoe'], [/худи|куртк|футбол|костюм|кофт|свитер|рубаш|пиджак/i, 'top'], [/джинс|брюк|шорт|штан/i, 'pants'], [/плать|юбк/i, 'dress'], [/кепк|шапк|панам/i, 'cap'], [/сумк|рюкзак|кошел/i, 'bag'], [/носк/i, 'sock'], [/бутылк|духи|парфюм/i, 'bottle'],
  [/смартфон|телефон|айфон/i, 'phone'], [/наушн/i, 'headphones'], [/часы/i, 'watch'], [/ноутбук|компьют/i, 'laptop'], [/повербанк|заряд|аккумул/i, 'battery'], [/колонк|акуст/i, 'speaker'],
  [/роз|букет|тюльпан|пион|цвет|композиц/i, 'flower'], [/шар/i, 'balloon'], [/подар|набор|сертиф/i, 'gift'], [/плов|дограм|горяч|блюд/i, 'plate'], [/шашлык|кебаб/i, 'skewer'], [/манты|пельм|хинкал|самса/i, 'dumpling'], [/суп|чорба|шурп/i, 'bowl'], [/хлеб|чурек|лепёш|лепеш/i, 'bread'], [/чай|кофе|напит|сок/i, 'cup'],
  [/маникюр|педикюр|ногт/i, 'polish'], [/стрижк|волос|окраш|укладк/i, 'scissors'], [/макияж|помад/i, 'lipstick'], [/бров|ресниц/i, 'eye']];
function piOf(p) { const t = (p.name || '') + ' ' + (p.cat || ''); for (const [re, k] of PI_MAP) if (re.test(t)) return k; return 'bag'; }
function pvHTML(p, th, cls = '') {
  if (p && p.img && (String(p.img).startsWith('img:') || String(p.img).startsWith('data:'))) return `<div class="pv ${cls}"><div class="pv-ph zt" style="background-image:${imgCss(p.img, p.id, th)}"></div></div>`;
  const k = piOf(p || {}); const light = lum(th.bg) > 0.5; const s = (+(String(p && p.id || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0)) || 0) % 4;
  const a = light ? mix(th.sf, '#ffffff', .55) : mix(th.sf, '#ffffff', .1), b = light ? mix(th.bg, th.tx, .07 + s * .015) : mix(th.sf, '#000000', .25);
  const ink = light ? mix(th.tx, th.bg, .05) : mix(th.tx, th.bg, .1);
  return `<div class="pv ${cls}" style="background:radial-gradient(120% 90% at 50% 36%, ${a} 0%, ${b} 70%, ${mix(b, th.tx, .06)} 100%)"><i class="pv-sh"></i><svg class="pv-ic zt ${s % 2 ? 'tilt' : ''}" viewBox="0 0 24 24" fill="none" stroke="${ink}" stroke-width=".85" stroke-linecap="round" stroke-linejoin="round">${PI[k]}</svg></div>`;
}
function sceneHTML(x, seed = 0) {
  const ps = (x.products || []).slice(seed, seed + 3); while (ps.length < 3) ps.push({ id: 'x' + ps.length, name: (x.niche || '') + ps.length });
  return `<div class="scene"><div class="sc-glow"></div>${ps.map((p, i) => `<div class="sc-t sc-${i}">${pvHTML(p, x.th)}</div>`).join('')}</div>`;
}
function mapHTML(th) {
  const l = mix(th.sf, th.tx, .12), r = mix(th.sf, th.tx, .22);
  return `<svg class="ts-mapsvg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice"><rect width="400" height="300" fill="${mix(th.sf, th.bg, .3)}"/><g stroke="${l}" stroke-width="10" fill="none"><path d="M-10 90 L410 60"/><path d="M-10 210 L410 240"/><path d="M110 -10 L150 310"/><path d="M290 -10 L250 310"/></g><g stroke="${r}" stroke-width="3" fill="none"><path d="M-10 150 Q200 120 410 160"/><path d="M200 -10 Q210 150 190 310"/></g><circle cx="200" cy="140" r="34" fill="${th.p}" opacity=".18"/><path d="M200 112c-13 0-22 9-22 21 0 16 22 37 22 37s22-21 22-37c0-12-9-21-22-21z" fill="${th.p}"/><circle cx="200" cy="133" r="8" fill="${onC(th.p)}"/></svg>`;
}

/* ===== block catalogue ===== */
const BLOCKS = {
  header: { name: 'Шапка', vs: { a: 'Логотип слева', b: 'Логотип по центру' } },
  hero: { name: 'Обложка', vs: { stage: 'Тёмная сцена', split: 'Текст и витрина', center: 'По центру', type: 'Крупный шрифт', cover: 'На всю ширину' } },
  marquee: { name: 'Бегущая строка', vs: { a: 'Строка' } },
  slider: { name: 'Слайдер акций', vs: { a: 'Карусель' } },
  catalog: { name: 'Каталог товаров', vs: { grid: 'Сетка', rail: 'Лента', list: 'Меню-список' } },
  bento: { name: 'Преимущества-бенто', vs: { a: 'Бенто-сетка' } },
  stats: { name: 'Цифры', vs: { a: 'В ряд' } },
  features: { name: 'Преимущества', vs: { cols: 'Колонки', list: 'Список' } },
  promo: { name: 'Акция', vs: { band: 'Цветная полоса', card: 'Купон' } },
  text: { name: 'Текст', vs: { one: 'По центру', two: 'Две колонки' } },
  gallery: { name: 'Галерея', vs: { grid: 'Сетка', mosaic: 'Мозаика' } },
  reviews: { name: 'Отзывы', vs: { cards: 'Карточки', quote: 'Цитата' } },
  faq: { name: 'Вопросы', vs: { list: 'Раскрывающийся список' } },
  contacts: { name: 'Контакты', vs: { split: 'Карта и адрес' } },
  footer: { name: 'Подвал', vs: { a: 'Тёмный', b: 'Светлый' } },
  zero: { name: 'Zero-блок', vs: { free: 'Свободный холст' } }
};
const NICHE_EXTRA = {
  'Одежда и обувь': { eb: 'Новая коллекция', mq: ['Новинки каждую неделю', 'Примерка при доставке', 'Обмен 14 дней', 'Только оригинал', 'Доставка за 2 часа'], stats: [['12 000+', 'покупателей'], ['2 часа', 'доставка по городу'], ['14 дней', 'на обмен'], ['4.9', 'средняя оценка']] },
  'Ресторан и кафе': { eb: 'Кухня открыта', mq: ['Плов на огне', 'Тамдыр каждый день', 'Доставка 45 минут', 'Банкеты до 80 гостей', 'Мясо фермеров Ахала'], stats: [['45 мин', 'доставка'], ['2009', 'год открытия'], ['80', 'гостей в зале'], ['4.9', 'рейтинг в TAP']] },
  'Салон красоты': { eb: 'Запись онлайн', mq: ['Маникюр', 'Брови', 'Окрашивание', 'Макияж', 'Уход', 'Без очереди'], stats: [['6', 'мастеров'], ['5+ лет', 'опыт каждого'], ['3 недели', 'держится покрытие'], ['4.9', 'средняя оценка']] },
  'Электроника': { eb: 'Официальная гарантия', mq: ['Гарантия 12 месяцев', 'Проверка при получении', 'Рассрочка до 6 месяцев', 'Сервисный центр', 'Доставка сегодня'], stats: [['12 мес', 'гарантия'], ['6 мес', 'рассрочка'], ['3 000+', 'устройств продано'], ['4.8', 'рейтинг']] },
  'Цветы и подарки': { eb: 'Свежий завоз', mq: ['Розы', 'Пионы', 'Тюльпаны', 'Композиции', 'Открытка бесплатно', 'Доставка за час'], stats: [['60 мин', 'доставка'], ['14 дней', 'стоят букеты'], ['8 000+', 'букетов в год'], ['4.9', 'оценка']] },
  'Другое': { eb: 'Добро пожаловать', mq: ['Быстрый ответ', 'Доставка по стране', 'Оплата при получении', 'Гарантия качества'], stats: [['10 мин', 'ответ'], ['5 лет', 'на рынке'], ['1 000+', 'клиентов'], ['4.8', 'оценка']] }
};
function secMake(type, v, ctx = {}) {
  const C = NICHES[ctx.niche] || NICHES['Другое']; const X = NICHE_EXTRA[ctx.niche] || NICHE_EXTRA['Другое']; const name = ctx.name || 'Мой магазин';
  const d = {};
  switch (type) {
    case 'header': d.logo = name; break;
    case 'hero': d.eb = X.eb + ' · ' + (ctx.city || 'Ашхабад'); d.title = C.hero[0]; d.text = C.hero[1]; d.btn = C.hero[2]; d.btn2 = 'Написать нам'; d.img = ''; break;
    case 'marquee': d.items = X.mq.slice(); break;
    case 'slider': d.items = [{ e: 'Акция недели', t: C.promo[0], x: C.promo[1], btn: C.promo[2] }, { e: 'Новинки', t: C.hero[0], x: C.hero[1], btn: C.hero[2] }, { e: 'Доставка', t: C.feats[1][0], x: C.feats[1][1], btn: 'Заказать' }]; break;
    case 'bento': d.title = 'Почему к нам возвращаются'; d.items = [{ t: C.feats[0][0], x: C.feats[0][1] }, { t: C.feats[1][0], x: C.feats[1][1] }, { t: C.feats[2][0], x: C.feats[2][1] }, { t: X.stats[3][0] + ' ★', x: 'Средняя оценка покупателей в TAP' }]; break;
    case 'stats': d.items = X.stats.map(([n, t]) => ({ n, t })); break;
    case 'features': d.title = 'Почему выбирают нас'; d.items = C.feats.map(([t, x]) => ({ t, x })); break;
    case 'catalog': d.title = C.cat; d.sub = 'Цены в манатах · оплата при получении'; break;
    case 'promo': d.title = C.promo[0]; d.text = C.promo[1]; d.btn = C.promo[2]; break;
    case 'text': d.title = C.about[0]; d.text = C.about[1]; break;
    case 'gallery': d.title = 'Как у нас'; d.imgs = ['', '', '', '', '']; break;
    case 'reviews': d.title = 'Отзывы покупателей'; d.items = C.rev.map(([t, a]) => ({ t, a })); break;
    case 'faq': d.title = 'Частые вопросы'; d.items = C.faq.map(([q, a]) => ({ q, a })); break;
    case 'contacts': d.title = 'Как нас найти'; d.addr = (ctx.city || 'Ашхабад') + ', ул. Магтымгулы, 12'; d.phone = '+993 65 00 00 00'; d.hours = 'Каждый день 9:00–21:00'; d.btn = 'Написать нам'; d.img = ''; break;
    case 'footer': d.logo = name; d.text = '© ' + new Date().getFullYear() + ' ' + name + '. Сайт сделан на TAP Business.'; break;
    case 'zero': d.h = 560; d.items = [
      { k: 'shape', x: 0, y: 0, w: 46, h: 100, c: 'p', r: 0 },
      { k: 'img', x: 52, y: 10, w: 42, h: 80, src: '', r: 24 },
      { k: 'text', x: 5, y: 16, w: 38, h: 40, text: ctx.name || 'Свободный холст' },
      { k: 'text', x: 5, y: 58, w: 36, h: 14, text: 'Перетаскивайте элементы куда угодно.' },
      { k: 'btn', x: 5, y: 76, w: 22, h: 10, text: 'Подробнее' }];
      return { id: uid('s'), type, v: v || 'free', d, st: {}, es: { 'items.2.text': { fs: 64, fw: 800, c: 'onp' }, 'items.3.text': { fs: 20, c: 'onp' } } };
  }
  return { id: uid('s'), type, v: v || Object.keys(BLOCKS[type].vs)[0], d, st: {}, es: {} };
}

/* ===== templates ===== */
const TEMPLATES = [
  { id: 'atlas', name: 'Atlas', note: 'Строгий, как CARGO ONE', th: { p: '#c2612a', bg: '#f5f5f3', tx: '#111111', sf: '#ffffff', fh: 'Unbounded', fb: 'Onest', r: 24, btn: 'pill', up: true },
    secs: [['header', 'a'], ['hero', 'stage'], ['marquee', 'a'], ['catalog', 'rail'], ['bento', 'a'], ['stats', 'a'], ['reviews', 'cards'], ['faq', 'list'], ['contacts', 'split'], ['footer', 'a']] },
  { id: 'noir', name: 'Noir', note: 'Тёмный люкс', th: { p: '#d4b06a', bg: '#0c0c0d', tx: '#f2efe9', sf: '#17171a', fh: 'Cormorant Garamond', fb: 'Jost', r: 2, btn: 'line', up: false },
    secs: [['header', 'b'], ['hero', 'cover'], ['marquee', 'a'], ['catalog', 'grid', { cols: 3 }], ['slider', 'a'], ['reviews', 'quote'], ['contacts', 'split'], ['footer', 'a']] },
  { id: 'volt', name: 'Volt', note: 'Техно, тёмный', th: { p: '#5b7cff', bg: '#0b0d12', tx: '#eef1f8', sf: '#151925', fh: 'Exo 2', fb: 'Onest', r: 18, btn: 'pill', up: true },
    secs: [['header', 'a'], ['hero', 'stage'], ['marquee', 'a'], ['catalog', 'rail'], ['stats', 'a'], ['bento', 'a'], ['faq', 'list'], ['contacts', 'split'], ['footer', 'a']] },
  { id: 'bazar', name: 'Bazar', note: 'Как маркетплейс', th: { p: '#ff4f1a', bg: '#f4f5f7', tx: '#121317', sf: '#ffffff', fh: 'Montserrat', fb: 'Onest', r: 20, btn: 'pill', up: false },
    secs: [['header', 'a'], ['slider', 'a'], ['stats', 'a'], ['catalog', 'grid', { cols: 4 }], ['bento', 'a'], ['faq', 'list'], ['contacts', 'split'], ['footer', 'a']] },
  { id: 'sacak', name: 'Saçak', note: 'Ресторан и кафе', th: { p: '#a8401f', bg: '#f3ece2', tx: '#24170f', sf: '#fffaf3', fh: 'Prata', fb: 'Golos Text', r: 16, btn: 'fill', up: false },
    secs: [['header', 'b'], ['hero', 'split'], ['marquee', 'a'], ['catalog', 'list'], ['gallery', 'mosaic'], ['reviews', 'quote'], ['contacts', 'split'], ['footer', 'a']] },
  { id: 'gozel', name: 'Gözel', note: 'Нежно, для бьюти', th: { p: '#b4466e', bg: '#fbf3f1', tx: '#33202a', sf: '#ffffff', fh: 'Comfortaa', fb: 'Nunito', r: 28, btn: 'pill', up: false },
    secs: [['header', 'a'], ['hero', 'split'], ['stats', 'a'], ['catalog', 'grid', { cols: 3 }], ['bento', 'a'], ['reviews', 'cards'], ['faq', 'list'], ['contacts', 'split'], ['footer', 'b']] },
  { id: 'tuss', name: 'Tüss', note: 'Чистый минимализм', th: { p: '#111111', bg: '#ffffff', tx: '#111111', sf: '#f3f3f1', fh: 'Manrope', fb: 'Manrope', r: 6, btn: 'fill', up: false },
    secs: [['header', 'a'], ['hero', 'type'], ['catalog', 'grid', { cols: 4 }], ['text', 'two'], ['reviews', 'quote'], ['contacts', 'split'], ['footer', 'b']] },
  { id: 'zero', name: 'Zero', note: 'Свободный холст', th: { p: '#0e7c66', bg: '#f4f7f6', tx: '#10201c', sf: '#ffffff', fh: 'Unbounded', fb: 'Onest', r: 20, btn: 'pill', up: false },
    secs: [['header', 'a'], ['zero', 'free'], ['catalog', 'rail'], ['contacts', 'split'], ['footer', 'a']] }
];
const PALETTES = [
  ['Медь', '#c2612a', '#f5f5f3', '#111111', '#ffffff'], ['Ковёр', '#a8202e', '#faf6f1', '#22140e', '#ffffff'], ['Индиго', '#3a47b8', '#f3f4f8', '#12142b', '#ffffff'], ['Шафран', '#e0a100', '#0f0f10', '#f4efe6', '#1b1a18'],
  ['Бирюза', '#0e8a7a', '#f1f7f6', '#0d2622', '#ffffff'], ['Гранат', '#8e1537', '#fff6f7', '#2a0d16', '#ffffff'], ['Ночь', '#7c6cff', '#0b0d16', '#eceefe', '#151827'], ['Золото', '#d4b06a', '#0c0c0d', '#f2efe9', '#17171a']
];
function siteFromTemplate(tid, ctx) {
  const t = TEMPLATES.find(x => x.id === tid) || TEMPLATES[0];
  const C = NICHES[ctx.niche] || NICHES['Другое'];
  return {
    v: 3, name: ctx.name, niche: ctx.niche, city: ctx.city, tpl: t.id, th: clone(t.th),
    secs: t.secs.map(([ty, v, st]) => { const s = secMake(ty, v, ctx); if (st) s.st = Object.assign({}, st); return s; }),
    products: C.prods.map(([name, price, old, cat, desc]) => ({ id: uid('p'), name, price, old, cat, desc, img: '' }))
  };
}

/* ===== rendering ===== */
function colorOf(k, th) { return k === 'p' ? th.p : k === 'sf' ? th.sf : k === 'bg' ? th.bg : k === 'tx' ? th.tx : k === 'onp' ? onC(th.p) : validHex(k) ? k : th.tx; }
function styleOf(o, th, zero) {
  if (!o) return ''; let s = '';
  if (o.fs) s += zero ? `font-size:calc(${+o.fs}cqw / 12);` : `font-size:clamp(${Math.min(+o.fs, 15)}px, ${(+o.fs / 9).toFixed(2)}cqw, ${+o.fs}px);`;
  if (o.fw) s += `font-weight:${+o.fw};`; if (o.it) s += 'font-style:italic;'; if (o.al) s += `text-align:${o.al};`;
  if (o.c) s += `color:${colorOf(o.c, th)};`; if (o.ff) s += `font-family:'${o.ff}';`;
  if (o.lh) s += `line-height:${+o.lh};`; if (o.ls != null && o.ls !== '') s += `letter-spacing:${+o.ls}em;`; if (o.up) s += 'text-transform:uppercase;';
  return s;
}
function siteVars(th) {
  const tx = th.tx, bg = th.bg; const p2 = mix(th.p, '#ffffff', .22), p3 = mix(th.p, '#000000', .22);
  return `--p:${th.p};--p2:${p2};--p3:${p3};--onp:${onC(th.p)};--bg:${bg};--tx:${tx};--sf:${th.sf};--mut:${mix(tx, bg, 0.4)};--line:${mix(bg, tx, 0.12)};--ink:${lum(bg) > .5 ? mix(tx, '#000', .2) : mix(th.sf, '#000', .35)};--onink:${lum(bg) > .5 ? '#f5f5f3' : tx};--fh:'${th.fh}';--fb:'${th.fb}';--r:${+th.r || 0}px;--r2:${Math.max(0, (+th.r || 0) - 6)}px;`;
}
function renderSite(site, opt = {}) {
  const C = NICHES[site.niche] || NICHES['Другое'];
  const x = { th: site.th, edit: !!opt.edit, products: site.products || [], niche: site.niche, catWord: C.cat, orderWord: C.order, still: !!opt.still };
  return `<div class="ts ${x.edit ? 'edit' : ''} ${x.still ? 'still' : ''} btn-${site.th.btn || 'fill'} ${site.th.up ? 'up' : ''} ${lum(site.th.bg) > .5 ? 'lt' : 'dk'}" style="${siteVars(site.th)}">${(site.secs || []).map(s => secHTML(s, x)).join('')}</div>`;
}
function secHTML(s, x) {
  const st = s.st || {}; let style = '';
  if (st.bg) {
    const c = colorOf(st.bg, x.th); const t = Math.abs(lum(c) - lum(x.th.tx)) > 0.42 ? x.th.tx : onC(c);
    style += `background:${c};--tx:${t};color:${t};--mut:${mix(t, c, 0.32)};--line:${mix(c, t, 0.16)};--sf:${mix(c, t, 0.07)};`;
    if (Math.abs(lum(c) - lum(x.th.p)) < 0.12) style += `--p:${t};--onp:${c};`;
  }
  if (st.pt != null) style += `--pt:${+st.pt}px;`; if (st.pb != null) style += `--pb:${+st.pb}px;`;
  if (st.al) style += `text-align:${st.al};`;
  const fn = SR[s.type]; if (!fn) return '';
  return `<section class="ts-sec ts-${s.type} v-${s.v}" data-sid="${s.id}" data-type="${s.type}" style="${style}">${fn(s, x)}</section>`;
}
function T(s, f, tag, cls, x, extra = '') {
  const v = getP(s.d, f); const st = styleOf(s.es && s.es[f], x.th, s.type === 'zero');
  return `<${tag} class="${cls || ''}" data-f="${f}"${st ? ` style="${st}"` : ''}${extra}>${esc(v == null ? '' : v)}</${tag}>`;
}
function hasPhoto(v) { return v && (String(v).startsWith('img:') || String(v).startsWith('data:')); }
function I(s, f, cls, x, fallback) {
  const v = getP(s.d, f);
  if (hasPhoto(v)) return `<div class="ts-img ${cls}" data-img="${f}" style="background-image:${imgCss(v, s.id + f, x.th)}"></div>`;
  return `<div class="ts-img ${cls} ph" data-img="${f}">${fallback || sceneHTML(x)}</div>`;
}
const ARW = '<svg class="arw" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const SR = {};
SR.header = (s, x) => `<div class="ts-in ts-hd">${T(s, 'logo', 'div', 'ts-logo', x)}<nav class="ts-nav"><a data-act="catalog">${esc(x.catWord)}</a><a data-act="about">О нас</a><a data-act="contacts">Контакты</a></nav><div class="ts-ico"><a data-act="search" aria-label="Поиск">${IC.search}</a><a data-act="cart" class="ts-cart" aria-label="Корзина">${IC.bag}</a></div></div>`;
SR.hero = (s, x) => {
  const B = T(s, 'btn', 'a', 'ts-btn sheen', x, ' data-act="catalog"'); const B2 = s.d.btn2 ? T(s, 'btn2', 'a', 'ts-btn ghost', x, ' data-act="chat"') : '';
  const EB = s.d.eb ? `<div class="ts-eb"><i></i>${T(s, 'eb', 'span', '', x)}</div>` : '';
  if (s.v === 'stage') return `<div class="ts-in"><div class="ts-stage"><div class="ts-dots"></div><div class="ts-st-t rise">${EB}${T(s, 'title', 'h1', 'ts-h1 xl', x)}${T(s, 'text', 'p', 'ts-lead', x)}<div class="ts-btns">${B}${B2}</div></div>${I(s, 'img', 'ts-st-i', x)}</div></div>`;
  if (s.v === 'split') return `<div class="ts-in g2 ts-hs"><div class="ts-hs-t rise">${EB}${T(s, 'title', 'h1', 'ts-h1', x)}${T(s, 'text', 'p', 'ts-lead', x)}<div class="ts-btns">${B}${B2}</div></div>${I(s, 'img', 'ts-hs-i', x)}</div>`;
  if (s.v === 'center') return `<div class="ts-in ts-hc rise">${EB}${T(s, 'title', 'h1', 'ts-h1 xl', x)}${T(s, 'text', 'p', 'ts-lead', x)}<div class="ts-btns">${B}${B2}</div></div>`;
  if (s.v === 'cover') return `${I(s, 'img', 'ts-cov-i', x, `<div class="ts-cov-art"><div class="ts-dots"></div>${sceneHTML(x)}</div>`)}<div class="ts-cov-sh"></div><div class="ts-in ts-cov-t rise">${EB}${T(s, 'title', 'h1', 'ts-h1 xl', x)}${T(s, 'text', 'p', 'ts-lead', x)}<div class="ts-btns">${B}</div></div>`;
  return `<div class="ts-in rise">${EB}${T(s, 'title', 'h1', 'ts-mega', x)}<div class="ts-row">${T(s, 'text', 'p', 'ts-lead', x)}<div class="ts-btns">${B}</div></div>${I(s, 'img', 'ts-strip', x)}</div>`;
};
SR.marquee = (s, x) => { const it = s.d.items || []; const one = it.map((t, i) => `<span>${T(s, `items.${i}`, 'b', '', x)}<i>✦</i></span>`).join(''); return `<div class="ts-mq"><div class="ts-mq-tr">${one}<span aria-hidden="true" class="dup">${it.map(t => `<span><b>${esc(t)}</b><i>✦</i></span>`).join('')}</span></div></div>`; };
SR.slider = (s, x) => { const it = s.d.items || []; const tones = ['ink', 'acc', 'sand']; return `<div class="ts-in"><div class="ts-sl" data-n="${it.length}">${it.map((sl, i) => `<div class="ts-sli ${tones[i % 3]} ${i === 0 ? 'on' : ''}"><div class="ts-dots"></div><div class="ts-sli-t"><div class="ts-chip">${T(s, `items.${i}.e`, 'span', '', x)}</div>${T(s, `items.${i}.t`, 'h2', 'ts-h2 m0', x)}${T(s, `items.${i}.x`, 'p', 'ts-sli-x', x)}${T(s, `items.${i}.btn`, 'a', 'ts-btn inv', x, ' data-act="catalog"')}</div><div class="ts-sli-a">${sceneHTML(x, i)}</div></div>`).join('')}<div class="ts-sl-bar">${it.map((_, i) => `<span role="button" tabindex="0" data-sl="${i}" class="${i === 0 ? 'on' : ''}" aria-label="Слайд ${i + 1}"><i></i></span>`).join('')}</div></div></div>`; };
SR.bento = (s, x) => { const it = s.d.items || []; const p0 = x.products[0] || { id: 'b0', name: x.niche }; return `<div class="ts-in">${T(s, 'title', 'h2', 'ts-h2', x)}<div class="ts-bento">${it.map((b, i) => `<div class="ts-bc b${i}">${i === 0 ? `<div class="ts-dots"></div><div class="ts-bc-v">${pvHTML(p0, x.th)}</div>` : `<div class="ts-bc-n">0${i + 1}</div>`}<div class="ts-bc-t">${T(s, `items.${i}.t`, 'h3', 'ts-h3', x)}${T(s, `items.${i}.x`, 'p', 'ts-mut', x)}</div></div>`).join('')}</div></div>`; };
SR.stats = (s, x) => `<div class="ts-in"><div class="ts-stats">${(s.d.items || []).map((it, i) => `<div class="ts-stat">${T(s, `items.${i}.n`, 'b', 'ts-num', x)}${T(s, `items.${i}.t`, 'span', 'ts-mut', x)}</div>`).join('')}</div></div>`;
SR.features = (s, x) => `<div class="ts-in">${T(s, 'title', 'h2', 'ts-h2', x)}<div class="${s.v === 'list' ? 'ts-fl' : 'ts-fc'}">${(s.d.items || []).map((it, i) => `<div class="ts-f"><div class="ts-gl">0${i + 1}</div><div>${T(s, `items.${i}.t`, 'h3', 'ts-h3', x)}${T(s, `items.${i}.x`, 'p', 'ts-mut', x)}</div></div>`).join('')}</div></div>`;
function pcard(p, s, x) {
  const sale = p.old && p.old > p.price ? `<span class="ts-sale">−${Math.round(100 - p.price / p.old * 100)}%</span>` : '';
  if (s.v === 'list') return `<div class="ts-pl" data-pid="${p.id}" data-cat="${esc(p.cat || '')}">${pvHTML(p, x.th, 'ts-pli')}<div class="ts-plt"><div class="ts-pn">${esc(p.name)}</div><div class="ts-mut ts-pd">${esc(p.desc || '')}</div></div><div class="ts-plp"><b class="ts-num">${fmt(p.price)} TMT</b><a class="ts-btn sm" data-act="order" data-pid="${p.id}">${esc(x.orderWord)}</a></div></div>`;
  return `<div class="ts-pc lift" data-pid="${p.id}" data-cat="${esc(p.cat || '')}"><div class="ts-pi">${pvHTML(p, x.th)}${sale}<a class="ts-add" data-act="order" data-pid="${p.id}" aria-label="${esc(x.orderWord)}">${IC.plus}</a></div><div class="ts-pc-b"><div class="ts-pc-c">${esc(p.cat || '')}</div><div class="ts-pn">${esc(p.name)}</div><div class="ts-pp"><b class="ts-num">${fmt(p.price)} TMT</b>${p.old ? `<s>${fmt(p.old)}</s>` : ''}</div></div></div>`;
}
SR.catalog = (s, x) => {
  const ps = x.products; const cats = [...new Set(ps.map(p => p.cat).filter(Boolean))];
  const head = `<div class="ts-chead"><div>${T(s, 'title', 'h2', 'ts-h2 m0', x)}${s.d.sub != null ? T(s, 'sub', 'p', 'ts-mut ts-csub', x) : ''}</div>${s.v === 'rail' ? `<div class="ts-rnav"><a data-rail="-1" aria-label="Назад">${ARW}</a><a data-rail="1" aria-label="Вперёд">${ARW}</a></div>` : ''}</div>`;
  const chips = cats.length > 1 && s.v !== 'rail' ? `<div class="ts-cats"><a class="on" data-cat="">Все</a>${cats.map(c => `<a data-cat="${esc(c)}">${esc(c)}</a>`).join('')}</div>` : '';
  const body = !ps.length ? `<div class="ts-empty">Здесь появятся ваши товары</div>` : s.v === 'list' ? `<div class="ts-plist">${ps.map(p => pcard(p, s, x)).join('')}</div>` : s.v === 'rail' ? `<div class="ts-rail">${ps.map(p => pcard(p, s, x)).join('')}</div>` : `<div class="ts-pgrid" style="--cols:${+(s.st && s.st.cols) || 3}">${ps.map(p => pcard(p, s, x)).join('')}</div>`;
  return `<div class="ts-in">${head}${chips}${body}</div>`;
};
SR.promo = (s, x) => s.v === 'card' ? `<div class="ts-in"><div class="ts-coupon"><div>${T(s, 'title', 'h2', 'ts-h2 m0', x)}${T(s, 'text', 'p', 'ts-mut', x)}</div>${T(s, 'btn', 'a', 'ts-btn', x, ' data-act="catalog"')}</div></div>`
  : `<div class="ts-in"><div class="ts-band"><div class="ts-dots"></div><div>${T(s, 'title', 'h2', 'ts-h2 m0', x)}${T(s, 'text', 'p', '', x)}</div>${T(s, 'btn', 'a', 'ts-btn inv', x, ' data-act="catalog"')}</div></div>`;
SR.text = (s, x) => s.v === 'two' ? `<div class="ts-in g2 ts-t2" data-anchor="about">${T(s, 'title', 'h2', 'ts-h2', x)}${T(s, 'text', 'p', 'ts-lead', x)}</div>` : `<div class="ts-in ts-t1" data-anchor="about">${T(s, 'title', 'h2', 'ts-h2', x)}${T(s, 'text', 'p', 'ts-lead', x)}</div>`;
SR.gallery = (s, x) => `<div class="ts-in">${T(s, 'title', 'h2', 'ts-h2', x)}<div class="${s.v === 'mosaic' ? 'ts-gm' : 'ts-gg'}">${(s.d.imgs || []).map((_, i) => I(s, `imgs.${i}`, 'ts-gi', x, pvHTML(x.products[i % Math.max(1, x.products.length)] || { id: 'g' + i, name: '' }, x.th))).join('')}</div></div>`;
SR.reviews = (s, x) => {
  const it = s.d.items || [];
  if (s.v === 'quote') return `<div class="ts-in ts-q"><div class="ts-qm">“</div>${it[0] ? T(s, 'items.0.t', 'blockquote', 'ts-qt', x) + T(s, 'items.0.a', 'div', 'ts-mut', x) : ''}</div>`;
  return `<div class="ts-in">${T(s, 'title', 'h2', 'ts-h2', x)}<div class="ts-rc">${it.map((r, i) => `<div class="ts-r lift"><div class="ts-stars">★★★★★</div>${T(s, `items.${i}.t`, 'p', '', x)}<div class="ts-ra"><i>${esc(String(r.a || '?')[0])}</i>${T(s, `items.${i}.a`, 'span', 'ts-mut', x)}</div></div>`).join('')}</div></div>`;
};
SR.faq = (s, x) => `<div class="ts-in ts-faq">${T(s, 'title', 'h2', 'ts-h2', x)}${(s.d.items || []).map((q, i) => `<details${x.edit ? ' open' : ''}><summary>${T(s, `items.${i}.q`, 'span', '', x)}<i>+</i></summary>${T(s, `items.${i}.a`, 'p', 'ts-mut', x)}</details>`).join('')}</div>`;
SR.contacts = (s, x) => `<div class="ts-in"><div class="ts-ctb g2" data-anchor="contacts"><div>${T(s, 'title', 'h2', 'ts-h2', x)}<div class="ts-cl"><div>${IC.pin}${T(s, 'addr', 'span', '', x)}</div><div>${IC.chat}${T(s, 'phone', 'span', '', x)}</div><div>${IC.check}${T(s, 'hours', 'span', '', x)}</div></div>${T(s, 'btn', 'a', 'ts-btn', x, ' data-act="chat"')}</div>${I(s, 'img', 'ts-map', x, mapHTML(x.th))}</div></div>`;
SR.footer = (s, x) => `<div class="ts-in ts-ft">${T(s, 'logo', 'div', 'ts-logo', x)}<nav><a data-act="catalog">${esc(x.catWord)}</a><a data-act="contacts">Контакты</a></nav>${T(s, 'text', 'p', 'ts-mut', x)}</div>`;
SR.zero = (s, x) => `<div class="ts-zero" style="--zh:${+s.d.h || 560}">${(s.d.items || []).map((it, i) => {
  const pos = `left:${+it.x}%;top:${+it.y}%;width:${+it.w}%;height:${+it.h}%;`; const f = `items.${i}`;
  let inner = '';
  if (it.k === 'img') inner = hasPhoto(it.src) ? `<div class="ts-img" data-img="${f}.src" style="width:100%;height:100%;border-radius:${+it.r || 0}px;background-image:${imgCss(it.src, s.id + i, x.th)}"></div>` : `<div class="ts-img ph" data-img="${f}.src" style="width:100%;height:100%;border-radius:${+it.r || 0}px;overflow:hidden">${sceneHTML(x)}</div>`;
  else if (it.k === 'shape') inner = `<div style="width:100%;height:100%;border-radius:${+it.r || 0}px;background:${colorOf(it.c || 'p', x.th)}"></div>`;
  else if (it.k === 'btn') inner = T(s, f + '.text', 'a', 'ts-btn ts-zb', x, ' data-act="catalog"');
  else inner = T(s, f + '.text', 'div', 'ts-zt', x);
  return `<div class="ts-zi" data-zi="${i}" style="${pos}">${inner}</div>`;
}).join('')}</div>`;

/* ===== live motion for published sites: slider autoplay, rails, count-up ===== */
function siteMotion(root) {
  if (!root || root._motion) return; root._motion = true;
  const red = matchMedia('(prefers-reduced-motion: reduce)').matches;
  $$('.ts-sl', root).forEach(sl => {
    const n = +sl.dataset.n || 0; let i = 0; let t;
    const show = k => { i = (k + n) % n; $$('.ts-sli', sl).forEach((e, j) => e.classList.toggle('on', j === i)); $$('.ts-sl-bar [data-sl]', sl).forEach((e, j) => { e.classList.toggle('on', j === i); e.classList.toggle('done', j < i); }); };
    const play = () => { clearInterval(t); if (!red && n > 1) t = setInterval(() => { if (!document.body.contains(sl)) return clearInterval(t); show(i + 1); }, 5200); };
    sl.addEventListener('click', e => { const b = e.target.closest('[data-sl]'); if (b) { e.stopPropagation(); show(+b.dataset.sl); play(); } });
    play();
  });
  root.addEventListener('click', e => { const a = e.target.closest('[data-rail]'); if (!a) return; e.stopPropagation(); const r = a.closest('.ts-in').querySelector('.ts-rail'); if (r) r.scrollBy({ left: +a.dataset.rail * r.clientWidth * .8, behavior: 'smooth' }); });
  if (!red && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return; io.unobserve(en.target); const el = en.target; const raw = el.textContent; const m = raw.match(/[\d\s.,]+/); if (!m) return;
      const num = parseFloat(m[0].replace(/\s/g, '').replace(',', '.')); if (!isFinite(num) || num === 0) return; const dec = (m[0].split(/[.,]/)[1] || '').length; const t0 = performance.now();
      const step = now => { const k = Math.min(1, (now - t0) / 1100); const e = 1 - Math.pow(1 - k, 3); const v = (num * e).toFixed(dec); el.textContent = raw.replace(m[0].trim(), dec ? v : Number(v).toLocaleString('ru-RU').replace(/,/g, ' ')); if (k < 1) requestAnimationFrame(step); else el.textContent = raw; };
      requestAnimationFrame(step);
    }), { threshold: .6 });
    $$('.ts-num', root).forEach(n => { if (!n.closest('.ts-pc,.ts-pl')) io.observe(n); });
  }
}
