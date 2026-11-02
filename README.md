# TAP — маркетплейс и конструктор сайтов для бизнеса Туркменистана

**TAP** — поиск товаров по всем магазинам страны. **TAP Business** — кабинет продавца: ИИ собирает сайт-магазин, владелец правит его в конструкторе (как Tilda/Wix), публикует и получает QR-код и короткую ссылку.

Developer Ovezov Emirhan · LTD EMIR LOGISTICS CO

## Что внутри
- Витрина покупателя: поиск, категории, все товары, скидки, чаты, избранное
- Бизнес-кабинет: регистрация → конструктор → публикация → заявки, чаты, товары, SMM-бот
- Конструктор: 16 видов блоков, 8 макетов, Zero-блок, темы, шрифты, просмотр телефон/компьютер, отмена
- ИИ-функции: сборка сайта, правки словами, товар по фото, SMM-бот, умный поиск, поиск по фото, ИИ-продавец
- Готовые системы (Resto OS) и агрегаторы (доставка, оплата, соцсети, уведомления)

## Файлы
| Файл | Что делает |
| --- | --- |
| `index.html` | Стили и оболочка приложения |
| `core.js` | Утилиты, цвета, хранилище, вызовы ИИ, иконки |
| `site.js` | Блоки, макеты и отрисовка сайтов клиентов |
| `editor.js` | Конструктор сайта |
| `app.js` | Витрина, кабинет, публикация, поиск, чаты |

## Запуск
Статический сайт без сборки: откройте `index.html` или включите GitHub Pages (Settings → Pages → Source: GitHub Actions).

На GitHub Pages ИИ и общая база не работают — данные хранятся в браузере. Полная версия с ИИ (Claude) и общей базой работает как артефакт Claude.

## ИИ на GitHub Pages
API-ключ **никогда** не кладётся в код сайта — репозиторий публичный, ключ украдут. Ключ живёт только на прослойке (`proxy/`), сайт обращается к ней.
Поддерживаются Google Gemini (ключ Vertex AI `AQ.…` или AI Studio `AIza…`) и Anthropic Claude.

**Cloudflare Worker (бесплатно, 5 минут):**
1. dash.cloudflare.com → Workers & Pages → Create → Worker → назовите `tap-ai` → Deploy.
2. Edit code → загрузите `proxy/cloudflare-worker.js` и `proxy/providers.js` → Deploy.
3. Settings → Variables and Secrets: секрет `GOOGLE_API_KEY` = ваш ключ; текст `ALLOWED_ORIGIN` = `https://hanchik000.github.io`.
4. Откройте адрес воркера в браузере — должно быть `{"ok":true,"provider":"gemini"}`.
5. В `config.js`: `aiProxy: 'https://tap-ai.<аккаунт>.workers.dev'`.

**Render (настроено в `render.yaml`):** render.com → New → Blueprint → репозиторий `tap` → вставьте `GOOGLE_API_KEY` → Apply. Адрес `https://tap-ai.onrender.com` уже указан в `config.js`. Бесплатный сервер засыпает через 15 минут без запросов — первый ответ после сна идёт до минуты.

**Свой сервер:** `GOOGLE_API_KEY=... node proxy/server.mjs` за HTTPS, адрес — в `config.js`.

Модели по умолчанию: `gemini-2.5-flash` (поиск, чат, правки), `gemini-2.5-pro` (сложные задачи). Меняются переменными `GEMINI_MODEL_QUICK`, `GEMINI_MODEL_DEFAULT`, `GEMINI_MODEL_COMPLEX`.
