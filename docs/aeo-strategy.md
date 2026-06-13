# Стратегия AEO/GEO + контент для AITERRA — путь к #1 в LLM-ответах и в Google (рынок Израиля)

*Финальная версия. Все факты сверены с живой кодовой базой. Критика учтена: исправлены две фактические ошибки исходного черновика (Приоритет 4 и Приоритет 8), добавлен реальный корневой дефект деплой-пайплайна, добавлены недостающие AEO-практики (hreflang/двуязычность, `speakable`, raster-logo, `dateModified`), новые коммерческие кластеры (нагишут/доступность, per-city, миграция, GA4/трекинг, comparison/alternative-страницы), а контент-календарь дедуплицирован против существующих 22 постов.*

---

## 0. TL;DR (управленческое резюме)

Контент и schema вторичны, пока **Cloudflare блокирует AI-ботов**. Это шлюз, который обнуляет всё остальное. Сначала разблокировка и её **настоящая** верификация (не просто `curl -A`, а проверка, что на реальных IP-диапазонах ботов не срабатывает challenge), затем — техническая база AEO (готова на ~70%, но «протекает» в нескольких местах), затем — контент против конкретных пробелов конкурентов.

Три приоритета, которые надо понять владельцу:
1. **Шлюз №0:** разблокировать AI-ботов в Cloudflare и подтвердить по firewall-событиям, что verified-боты реально проходят. Без этого пункты 2–5 не дают цитирования.
2. **Скрытый прод-дефект:** `scripts/sync-data-seeds.mjs` сидит только `blog-posts.json` и `portfolio-projects.json`, но **НЕ** `authors.json` и `faq.json`. На stale/свежем волюме `ensureFile()` запишет в прод **битые** био из `team-members.ts` как живые данные авторов. Это не «правка строки на 5 минут» — это дыра в пайплайне.
3. **Незакрытые ниши, где у вас нет конкурентов в израильском Hebrew-контенте:** ценовые «сколько стоит» с реальными числами, **автоматизация/CRM/израильский бухгалтерский стек** (Morning/Greeninvoice, חשבשבת, iCount, Rivhit, Priority, Fireberry/Powerlink), **локальный per-city интент Бат-Ям/Гуш-Дан** (у вас офис + LocalBusiness schema, но нет локальных лендингов), **коммерческий интент закона о доступности (ת"י 5568)** и **comparison/alternative-страницы против названных конкурентов**.

---

## 1. ПРЕДУСЛОВИЕ — разблокировка AI-ботов в Cloudflare (это шлюз ко всему)

**Без этого пункта пункты 2–5 не дают цитирования в LLM. Точка.**

Что происходит сейчас (подтверждено памятью + кодом):
- `src/app/robots.ts` корректно **разрешает** GPTBot, ClaudeBot, PerplexityBot, Applebot-Extended, Google-Extended (`allow: '/'`).
- **НО** Cloudflare на edge переопределяет это: включён managed **«Block AI bots»** (WAF возвращает 403) + managed robots.txt. Edge стоит *перед* вашим Next.js — ваш `robots.ts` AI-краулеры даже не видят.

Что сделать (дашборд Cloudflare, домен aiterra.co.il):
1. **Security → Bots** → отключить **«Block AI bots»** (или перевести AI-краулеров в «Allow»). Проверить также раздел **AI Audit / AI Crawl Control** — там может быть отдельный тумблер.
2. **Managed robots.txt:** если Cloudflare подменяет `/robots.txt` своим (с `Disallow` для GPTBot/ClaudeBot/CCBot/PerplexityBot/OAI-SearchBot) — отключить, чтобы наружу отдавался ваш `robots.ts`.
3. **WAF → Custom rules / Managed rules:** убедиться, что нет правила, блокирующего по `User-Agent`: `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `Claude-User`, `PerplexityBot`, `Perplexity-User`, `Google-Extended`, `Applebot-Extended`, `cohere-ai`, `Bytespider`, `Amazonbot`.

**Важно — два разных типа ботов, разрешить надо ОБА:**
- *Training/index боты* (GPTBot, ClaudeBot, PerplexityBot) — наполняют базу знаний модели.
- *Realtime «user» боты* (**OAI-SearchBot, ChatGPT-User, Perplexity-User, Claude-User**) — ходят на сайт в момент вопроса пользователя и дают живое цитирование со ссылкой. Их **нет** в вашем `robots.ts` — добавьте явно. Разблокировав только первую группу, вы попадёте в обучение через месяцы, но не получите немедленных цитат-ссылок.

**Верификация — НЕ только `curl` (важная поправка):**
`curl -A "GPTBot"` доказывает лишь, что ваш WAF не блокирует по строке User-Agent. Он **не** доказывает, что *verified*-бот реально проходит, потому что:
- OAI-SearchBot / Perplexity-User / Googlebot верифицируются по **reverse-DNS и опубликованным IP-диапазонам** — на их настоящих IP может срабатывать **JS-challenge / Managed Challenge**, которого spoof-`curl` не видит.
- Cloudflare-фичи «Block AI bots» / managed-robots могут **сами включиться обратно** при смене тарифа или обновлении managed-набора.

Поэтому верификация двухслойная:
```bash
# Слой 1 — UA не блокируется по строке (быстрая проверка):
curl -A "GPTBot"        -I https://aiterra.co.il/
curl -A "OAI-SearchBot" -I https://aiterra.co.il/
curl -A "PerplexityBot" -I https://aiterra.co.il/
curl -A "ClaudeBot"     -I https://aiterra.co.il/blog
curl                     https://aiterra.co.il/robots.txt   # должен вернуть ВАШ файл
```
Все должны вернуть `200` и ваш robots.txt — это необходимое, но **не достаточное** условие.
**Слой 2 (обязательно):** в **Cloudflare → Security → Events (Firewall Events)** и **Bot Analytics** убедиться, что на реальных запросах от verified bot-IP не висит `Managed Challenge` / `JS Challenge` / `Block`. Поставить раз в месяц напоминание перепроверять, что «Block AI bots» не переактивировался.

> Параллельно: конкуренты (combar, simply-smart, ildigital, ekd) AI-ботов **не блокируют** — их корпус уже ингестится. Каждый день блокировки = фора им. Горящий приоритет №0.

---

## 2. AEO/GEO ON-PAGE — технические правки по убыванию impact

### Приоритет 1 (HIGH) — entity-идентичность: `sameAs` сейчас пустой

**Файл:** `src/lib/contact.ts`, строки 14–18 — `SOCIAL_PROFILES` весь пустой. В `OrganizationSchema.tsx` строка 34 делает `Object.values(SOCIAL_PROFILES).filter(Boolean)` → `sameAs: []`. **У AITERRA сейчас НЕТ ни одного cross-web якоря идентичности** — LLM не может подтвердить, что это реальная сущность.

Действие: заполнить реальными URL — LinkedIn company page, Instagram, Facebook, **Google Business Profile (maps URL)**. Это разовая правка одной строки, эффект несоразмерно большой. (Crunchbase/Wikidata — см. понижение в п.3.)

### Приоритет 2 (HIGH) — обогатить Organization до полноценной сущности

**Файл:** `src/components/seo/OrganizationSchema.tsx`. Сейчас нет `founder`, `foundingDate`, `numberOfEmployees`, `knowsAbout`, `geo`, `openingHoursSpecification`, `availableLanguage`, `currenciesAccepted`.

Добавить:
```jsonc
"@type": ["LocalBusiness","ProfessionalService","Organization"],
"founder": [{ "@type":"Person", "@id": SITE_URL+"/blog/author/eric#person" }, ...],
"foundingDate": "20XX",          // ⚠ ПОДСТАВИТЬ РЕАЛЬНЫЙ ГОД — не публиковать "20XX"
"numberOfEmployees": { "@type":"QuantitativeValue", "value": 4 },  // подтвердить актуальность
"knowsAbout": [
  "בניית אתרים","SEO","קידום אתרים אורגני","אוטומציה עסקית","CRM",
  "בוטים לוואטסאפ","פרסום ממומן PPC","GEO","AEO","נגישות אתרים תקן 5568",
  "Morning חשבונית ירוקה","חשבשבת","iCount","Greeninvoice","Rivhit","Priority","Fireberry","Powerlink"
],
"availableLanguage": ["he","en","ru"],     // команда Hebrew/English/Russian — реальный сигнал
"currenciesAccepted": "ILS",
"paymentAccepted": "מזומן, כרטיס אשראי, העברה בנקאית",
"geo": { "@type":"GeoCoordinates", "latitude": <ГЕОКОДИРОВАТЬ>, "longitude": <ГЕОКОДИРОВАТЬ> },
"openingHoursSpecification": [{ "@type":"OpeningHoursSpecification",
  "dayOfWeek":["Sunday","Monday","Tuesday","Wednesday","Thursday"], "opens":"09:00","closes":"18:00" }]
```

**Поправки из критики (обязательны):**
- `geo`: **не** хардкодить `32.0167, 34.7500` (это приблизительный центроид Бат-Яма). **Геокодировать настоящий адрес** רחוב הרב ניסנבאום 37 — неправильный пин бьёт по локальному доверию.
- `foundingDate`: **не публиковать `"20XX"`** — placeholder в JSON-LD хуже отсутствия поля. Узнать реальный год.
- `numberOfEmployees: 4` — подтвердить, что цифра актуальна.
- `availableLanguage` + `currenciesAccepted: "ILS"` + `paymentAccepted` — дешёвые, высокорелевантные LocalBusiness-сигналы для «near me» и локальных AI-ответов.

`knowsAbout` — прямой сигнал LLM «о чём эта компания экспертна»; конкуренты его как Organization-узел не выставляют.

### Приоритет 3 (HIGH) — Author E-E-A-T: Person schema + страницы авторов

Проблема (подтверждено): `ArticleSchema.tsx` (строки 31–33) выводит автора как голый `Person {name, url?}` — без `jobTitle`/`description`/`image`/`sameAs`/`worksFor`. Богатые био из `data/authors.json` видны людям, но **отсутствуют в structured data**. Маршрута `/blog/author/[id]` нет.

Действия:
1. В `ArticleSchema.tsx` развернуть `author` в полный Person: `name`, `jobTitle` (= role), `description` (= bio), `image`, `worksFor: {"@id": SITE_URL+"#organization"}`, `url` → страница автора, `sameAs` (LinkedIn), `knowsAbout`.
2. Создать `src/app/blog/author/[id]/page.tsx`: рендер био + JSON-LD `ProfilePage` + `Person` (`@id` `…/author/eric#person`), связать с Organization через `founder`/`employee`. Линковать байлайны статей на эти страницы.
3. Заполнить `socials` в `data/authors.json` реальными LinkedIn-профилями (личный E-E-A-T = LinkedIn-якорь у каждого автора).

Это бьёт прямо в слабость всех конкурентов: у Daniel Zrihen Person-узел голый (имя+Gravatar), у Combar — `מערכת Combar`, у EKD/Simply-Smart/Fullpower авторов нет вовсе. Полноценный Person + ProfilePage сделает AITERRA сильнейшей по author-entity в нише.

### Приоритет 4 (HIGH, ИСПРАВЛЕНО vs черновик) — битые био авторов: это дефект ДЕПЛОЙ-ПАЙПЛАЙНА, а не «правка строки»

**Исходный черновик ошибался дважды, исправляю:**
- ❌ «Michael garbled в живых данных» — **неверно**. В `data/authors.json` (строка 18, git-tracked) био Michael **чистое**. Фрагмент `"...מול הלקוחות שלנו והכוחות שלו"` — это `team-members.ts` (строка 21), то есть **fallback**.
- ❌ «Достаточно починить `team-members.ts`» — **неверно**. `getAllAuthors()` (`authors-server.ts`, строка 79) мёржит `bio: author.bio || fallback.bio`; раз `authors.json` непустой — битый fallback **никогда не всплывёт для существующих авторов на здоровом волюме**. Починка одного `team-members.ts` визуально ничего не меняет.

**Настоящий дефект (корневой):**
`scripts/sync-data-seeds.mjs` (подтверждено, строки 6–9) сидит **только** `blog-posts.json` и `portfolio-projects.json` в `src/`. Блог защищён seed-override-мёржем против stale-волюма. **Авторы и FAQ — НЕТ**: `getAllAuthors()` / `faq-server.ts` читают `data/authors.json` и `data/faq.json` **прямо с персистентного волюма**. На свежем/stale-on-deploy волюме, где `data/authors.json` отсутствует, `ensureFile()` (строка 44) запишет `DEFAULT_AUTHORS` — то есть **битые иврит-био из `team-members.ts` становятся живыми прод-данными**. Это та же stale-volume-проблема, что мотивировала blog-seed-обходной путь, только тихо применяется к авторам/FAQ.

**Правильное действие (двойное):**
1. **(i)** Починить битый иврит в `src/data/team-members.ts` — Sean (строка 35: `"מגייל את האסטרטגיה הקדמית לקבל הועד הגנסים..."` — набор бессмысленных слов) и Michael (строка 21, обрывок). Привести к чистым версиям из `authors.json`.
2. **(ii) Главное:** добавить `data/authors.json` и `data/faq.json` в `sync-data-seeds.mjs` + применить такой же `rev`/seed-override-мёрж, как у блога, чтобы коммитнутый seed побеждал stale-волюм. Без (ii) дефект сохраняется даже с починенным fallback.

### Приоритет 5 (HIGH, ИСПРАВЛЕНО vs черновик) — FAQPage: проблема ПРОТИВОПОЛОЖНА заявленной

**Исходный черновик ошибался: «двойной FAQPage» — ложь, удалено.**
Проверено: `src/app/blog/[slug]/page.tsx` (строка 221) рендерит `FaqSection` **только** когда `post.faq.items.length > 0`. Глобального/унаследованного FAQ на блог-маршрутах нет; `data/faq.json` ключуется по точному маршруту (`/`, `/contact`, `/services/seo` …) и потребляется только своей страницей. На каждый URL уже ровно один FAQPage. Дедуплицировать нечего.

**Реальный пробел — обратный: у большинства постов `post.faq` нет вовсе → они отдают НОЛЬ FAQPage.** Подтверждено: `website-performance-2026` и `local-seo-small-business` имеют `faq: 0`. FAQPage — один из сильнейших AEO-форматов (прямое извлечение Q→A в AI-ответы).

**Действие:** добавить блок `faq` (3–5 вопросов) **в каждый** блог-пост и на каждую сервис/ключевую страницу, где его нет. Это и есть «action item», а не «слить дубли».

### Приоритет 6 (MEDIUM) — freshness: `dateModified` захардкожен (новое, из критики)

`ArticleSchema.tsx` строка 29: `dateModified: dateModified ?? datePublished`, и страница `dateModified` никогда не передаёт. То есть сигнал свежести **всегда равен дате публикации** — для AEO/freshness это потеря. Прокинуть `post.dateModified` (или таймстемп `rev`-бампа из админки/revalidatePath-флоу) через проп в `ArticleSchema`. При апдейте старого поста — обновлять `dateModified`.

### Приоритет 7 (MEDIUM) — `llms.txt` (отсутствует, подтверждено)

Создать `public/llms.txt` (Markdown): кто такая AITERRA (определение сущности + Бат-Ям + 4 услуги), канонические URL услуг, телефон/email, ссылки на топ-FAQ. Опционально `llms-full.txt` route, конкатенирующий описания услуг + ключевые FAQ + саммари блога. **Ни у одного из 8 конкурентов нет llms.txt** — будете первыми в нише.

### Приоритет 8 (MEDIUM) — Service schema: `hasOfferCatalog` + израильский стек

**Файл:** `src/components/seo/ServiceSchema.tsx` — сейчас только `name/description/url/provider/areaServed/serviceType/inLanguage`, а `areaServed` — одна `Country`. Добавить:
- `hasOfferCatalog` с суб-услугами: SEO → локальный SEO, технический SEO, линкбилдинг; автоматизация → WhatsApp-боты, CRM-интеграция, API, и **именованный израильский бухгалтерский стек: Morning (חשבונית ירוקה), חשבשבת, iCount, Greeninvoice, Rivhit, Priority, Fireberry/Powerlink**. Именно перечисление по именам делает вас цитируемым источником на запрос «לחבר CRM לחשבונית בישראל».
- Расширить `areaServed` списком городов (как в Organization), а не одной `Country`.
- Описания услуг в `src/data/services.ts` сейчас — маркетинговые слоганы; переписать в дефиниционные «X זה …» (LLM любит дефиниции).

### Приоритет 9 (MEDIUM) — двуязычность / hreflang / `inLanguage` (новое, из критики)

Сайт помечен `inLanguage: 'he'` only, но бренд и термины (SEO, PPC, CRM, React/Next.js) двуязычны, а покупатели часто ищут в транслитерации/английском. Сейчас нет `inLanguage`-массива, нет `hreflang`, нет английской поверхности. Минимально:
- На Organization добавить `alternateName` (англ. «AITERRA – Digital Marketing & Web Development Agency») и при необходимости языковые теги.
- Рассмотреть `inLanguage: ["he","en"]` там, где контент реально двуязычен.
- Стратегически — лёгкая английская entity-страница `/en` (об агентстве) как якорь для англоязычных/транслит-запросов и `sameAs`-связности. Не обязателен полный перевод сайта — достаточно одной сущностной страницы.

### Приоритет 10 (MEDIUM) — AggregateRating / Review (ужесточено по критике, чтобы избежать штрафа)

Сейчас нет нигде. Это доминирующий фактор, рекомендует ли AI-ассистент бизнес. **НО** (важная юридико-техническая поправка):
- Self-serving `AggregateRating` на `Organization`/`LocalBusiness` **без** узлов `Review` с реальным `author` и **без отображения на странице** — это нарушение Google Rich Results, провоцирующее **manual action**. Google к тому же перестал показывать org-level звёзды для многих типов сущностей.
- **Делать только так:** реальные узлы `Review` с настоящими именами авторов (`author`) и `reviewBody`, **физически отображённые на странице**, + `AggregateRating`, агрегирующий именно их. Иначе — **не размечать вообще**.

При корректной реализации это бьёт в слабость всех конкурентов: у Daniel (5.0/130), Clicky (4.9), Fullpower (5/5), EKD рейтинги есть, но **не размечены** — рич-сниппет со звёздами свободен.

### Приоритет 11 (MEDIUM) — raster-logo + `ImageObject` с размерами (новое, из критики)

`OrganizationSchema.tsx` (строки 15–18) указывает `logo: ${SITE_URL}/icons/logo.svg`. Google для logo предпочитает **растровый** формат с известными размерами; SVG может игнорироваться для rich results. Добавить PNG-логотип с `width`/`height`. Аналогично — у `ImageObject` авторских изображений указать `width`/`height` (и при наличии — `license`/`creator`).

### Приоритет 12 (LOW) — HowTo + `speakable`

- Для процедурных постов (keyword research, лендинг, GEO-шаги, GA4/пиксель, подключение WhatsApp к CRM) добавить `HowTo` с `HowToStep` — сильный формат для извлечения шагов в AI-ответы.
- Добавить `speakable` (SpeakableSpecification) на FAQ/дефиниционные блоки `mainEntity` — дешёвый AEO-сигнал для голосовых/answer-поверхностей.

### Паттерны «answer-shaped» контента (применять во всём новом контенте)

Слабости текущего контента из аудита:
1. **Нет статистики с источниками** — «2%→5% конверсия», «результат за 3–6 мес.» без ссылок. Добавлять атрибутируемые цифры (Pew, StatCounter, официальные доки Google) — LLM предпочитает атрибутируемые факты. Daniel Zrihen уже цитирует Pew Research 2025 и Univ. of Washington — догнать.
2. **Нет таблиц-сравнений** — WordPress-vs-code и SEO-vs-PPC спорят прозой. Таблица извлекается лучше. Везде, где «X מול Y» — markdown-таблица.
3. **Нет TL;DR-блока** в начале длинных постов — добавить 2–3-строчное саммари вверху (LLM лифтит его как ответ).
4. Открывать каждый пост **дефиницией** («GEO זה …»), H2 в форме вопросов, короткие абзацы, чек-листы.

### RTL-QA для новых таблиц/HowTo (новое, из критики — критично для иврита)

Блог рендерит markdown через `marked` с `dir="rtl"`. Новые таблицы-сравнения и `HowTo`-шаги в **смешанном иврит/латиница** (React, CRM, WhatsApp API, Next.js, GA4) регулярно ломают bidi-порядок: путается направление столбцов, нумерация шагов, позиция латинских токенов и цифр. **Если цитируемый артефакт рендерится «вверх ногами» — это прямо подрывает цель AEO.** Поэтому: для каждой новой таблицы/HowTo — обязательный шаг RTL-визуальной проверки (изолировать латинские токены в `<span dir="ltr">`/`<bdi>`, проверить порядок колонок и нумерацию шагов в проде). Это не опция, а часть Definition of Done для нового контента.

### Internal linking + entity clarity

- Хаб `/services` → дочерние услуги → связанные посты (topical clusters). Создать **pillar-page на автоматизацию** с под-кластером (CRM-сравнение, WhatsApp-бот, лид-флоу, израильский бухучёт). Существующий пост `business-automation-crm-whatsapp` делается «листом» этого pillar, а не дублируется.
- Каждый пост линкует на (а) релевантную услугу, (б) страницу автора, (в) 2–3 родственных поста. Daniel выигрывает за счёт `/top30`-хаба и плотной перелинковки — повторить.

---

## 3. E-E-A-T — авторитет, доказательства, off-site присутствие

**On-site (Experience/Expertise/Authoritativeness/Trust):**
- **Страницы авторов** с реальными credentials: годы опыта, `sameAs` → LinkedIn. 4 реальных именованных эксперта (Vadim = lead dev, Sean = SEO/Ads, Eric = стратегия/креатив, Michael = продажи/PM) — уже сильнее одно-авторских брендов; нужно сделать видимым машинам.
- **Google Partner / Meta Business Partner — переформулировано (из критики):** это **не** «schema» и **не** quick win. Google Partner требует порог ad-spend за 90 дней + экзамен + перформанс аккаунта; Meta — аналогично. Schema-типа для них нет (это изображения/ссылки, максимум через `sameAs`/`hasCredential`). Вести как **многомесячный off-site/EEAT-трек**; когда получены — выводить как `image` + ссылку, не обещать быстрого эффекта.
- **Кейсы с цифрами** (CaseStudy/Article + корректный Review): before/after — позиции, трафик %, лиды, ROAS, сэкономленные часы (для автоматизации). Бьёт слабость Simply-Smart/Fullpower (кейсы без метрик) и Extra (#1-позиции, но без schema). 3–4 численных кейса = цитируемое «доказательство результата».
- **Отзывы:** реальные Google-отзывы на сайт + `Review`/`AggregateRating` строго по правилам из п.2.10.
- **Страница «О нас/Команда/Сертификаты»** с founder, foundingDate — связать с Organization-узлом.

**Off-site (где «читают» LLM):**
- **Google Business Profile** — полностью заполнить (категории, услуги, фото), собирать отзывы. Фундамент для «near me» и для `sameAs`.
- Профили в израильских B2B-каталогах, которые LLM цитируют: **expert.co.il** (там сидят Extra/Fullpower), **bizmakebiz**, **XPlace**, **dapei-zahav/B144**, **Easy.co.il**.
- **LinkedIn** company page + личные профили авторов.
- **Wikidata — понижено/опционально (из критики):** агентство из 4 человек без независимого вторичного покрытия **не проходит порог notability Wikidata и будет удалено**, а items без sitelinks почти не питают Knowledge Graph. **Не приоритет.** Вместо этого — достижимые якоря: GBP + LinkedIn company page + верифицированные профили на `expert.co.il`/`B144`. К Wikidata вернуться только когда появится независимое медиа-покрытие.
- **Comparison/alternative off-site и on-site (новое, из критики):** под vendor-selection-промпты («סוכנות X לעומת Y», «אלטרנטיבה ל-X») LLM активно тянут сравнительный контент. Это контент, который конкуренты с голым Person-узлом защитить не могут. См. статью #17 в календаре.
- Ответы на **Reddit / профильных форумах / Quora** по «как выбрать агентство в Израиле», «сколько стоит сайт» — LLM активно тянут из обсуждений.
- Гостевые экспертные публикации в израильских digital/маркетинг-медиа (особенно AEO/GEO и автоматизация — там вы можете быть первоисточником).

---

## 4. КОНТЕНТ-КАЛЕНДАРЬ — 18 НОВЫХ статей (де-дуплицировано против 22 существующих)

**Дедупликация (что НЕ дублируем):** существующие посты уже покрывают: `business-automation-crm-whatsapp` (общая автоматизация — новые automation-статьи берут priced/comparison/HowTo-углы, не повтор), `website-building-services` (общий процесс «как выбрать компанию» — новая статья #1 берёт чисто **ценовой числовой** угол), `seo-services` (как выбрать SEO — новая #5 берёт **ценовой** угол), `wordpress-vs-custom-code` (#11 — **апгрейд**, не новая), `geo-ai-search-optimization` (GEO/AEO — **апгрейд**, не новая), `website-accessibility-israel` (информационный — новая #17 берёт **коммерческий/ценовой** угол), `local-seo-small-business` + `google-business-profile-guide` (общий локальный SEO — новые #2/#2b берут **per-city decision/price** угол), `google-ads-campaigns`/`facebook-instagram-ads` (#12 берёт **бюджет/immediacy**), `marketing-analytics-roi` (#13 берёт **how-to GA4/пиксель**).

P = приоритет (P1 = месяц 1). Все заголовки на иврите.

| # | P | Заголовок (Hebrew) | Целевой запрос / prompt | Пробел/кластер; связь с существующим | Формат | RTL-QA |
|---|---|---|---|---|---|---|
| 1 | P1 | כמה עולה לבנות אתר תדמית לעסק קטן בישראל ב-2026? המדריך עם טווחי מחירים | «כמה עולה לבנות אתר» | #1 demand-query; FAQ на `/contact` **отказывается** давать числа. Не дублирует `website-building-services` (тот про процесс) — это **числовой price-hub** (נחיתה 1,500–3,500₪ / תדמית 4,000–12,000₪ / חנות 12,000₪+) | Guide + price-таблица + FAQ + калькулятор | да (таблица) |
| 2 | P1 | חברה לבניית אתרים בבת ים — המדריך לבחירה ולמחירים | «חברה מומלצת לבניית אתרים בבת ים» | Локальный лендинг: HQ в Бат-Яме + LocalBusiness, но нет локального лендинга. Самый лёгкий high-value win | Local landing + LocalBusiness/FAQ | да |
| 2b | P2 | בניית אתרים בחולון, ראשון לציון ותל אביב — סוכנות גוש דן | «בניית אתרים [город] / near me» | Per-city (из критики): «near me» резолвится по городам. Не один лендинг Бат-Яма, а малый набор соседних городов (Холон, Ришон, ТА, Рамат-Ган) | Гео-лендинги (программатик-набор) | да |
| 3 | P1 | כמה עולה בוט וואטסאפ ואוטומציה עסקית לעסק קטן — ותוך כמה זה מחזיר את ההשקעה | «כמה עולה בוט וואטסאפ / אוטומציה» | **Ценовой/ROI угол** automation (существующий пост — общий, без цен). Пустой SERP, высокая маржа | Guide + ROI-таблица + FAQ | да (таблица) |
| 4 | P1 | איזו מערכת CRM הכי מתאימה לעסק קטן בישראל: Monday מול Fireberry מול HubSpot מול Zoho מול Pipedrive | «איזו CRM לעסק קטן בישראל» | Нет head-to-head израильских CRM ни у кого | Comparison + таблица | да (таблица, лат. имена) |
| 5 | P2 | כמה עולה קידום אורגני (SEO) בגוגל לחודש לעסק קטן ב-2026 | «כמה עולה SEO לחודש» | **Ценовой** угол (существующий `seo-services` — про выбор). MOFU recurring; со schema Offer/AggregateOffer | Guide + ценовые тиры + FAQ | да |
| 6 | P2 | פרילנסר מול חברת בניית אתרים — מה עדיף לעסק שלך ולמה | «פרילנסר או חברה לבניית אתרים» | Низкая конкуренция, ключевое возражение; почти не покрыто в Hebrew AI | Comparison | да (таблица) |
| 7 | P2 | איך בוחרים סוכנות דיגיטל אמינה: 9 דגלים אדומים שצריך להיזהר מהם | «איך בוחרים חברת בניית אתרים / דגלים אדומים» | Decision-stage BOFU; дисквалифицирует дешёвых конкурентов, строит trust | Listicle + FAQ | да |
| 8 | P2 | האם להיזהר מאתר זול מ-1,500 ₪? העלויות הנסתרות בבניית אתר | «אתר זול / עלויות נסתרות» | Защищает премиум-позиционирование; низкая конкуренция | Guide | да |
| 9 | P3 | חיבור וואטסאפ ביזנס (WhatsApp Business API) ל-CRM — מדריך מעשי לעסק ישראלי | «איך מחברים וואטסאפ ל-CRM» | Углубляет automation-pillar; чистый HowTo для извлечения шагов | HowTo + schema | да (шаги, лат. термины) |
| 10 | P3 | אתר תדמית מול חנות אונליין — מה צריך העסק וכמה עולה (WooCommerce מול Shopify מול Wix) | «אתר תדמית או חנות / WooCommerce vs Shopify» | Product+platform+price в одном; маршрутизирует к услуге | Comparison + таблица | да (таблица) |
| 11 | P3 | מה ההבדל במחיר בין אתר וורדפרס לאתר בקוד (React/Next.js) ומה עדיף לעסק | «וורדפרס מול קוד / React» | **АПГРЕЙД** `wordpress-vs-custom-code`: + ценовой угол, таблица, статистика CWV (ваш дифференциатор). Не новый URL | Comparison (апгрейд) | да (таблица) |
| 12 | P3 | קמפיין פרסום ממומן בגוגל/פייסבוק — מה התקציב המינימלי וכמה לוקח לראות לידים | «תקציב מינימלי לקמפיין PPC» | **Бюджет/immediacy** угол (существуют `google-ads-campaigns`/`facebook-instagram-ads` — общие). Числовой ответ | Guide + FAQ | да |
| 13 | P3 | התקנת GA4, Google Tag Manager ופיקסל + מדידת המרות — מדריך מעשי לעסק | «התקנת פיקסל / GA4 / מדידת המרות» | **Новое (из критики):** how-to/коммерческий угол к `marketing-analytics-roi`; дешёвый citable HowTo, смежно с PPC/automation | HowTo + schema | да (шаги, лат. термины) |
| 14 | P4 | כמה עולה תחזוקת אתר בשנה ומה כלול (אחסון, דומיין, עדכונים, אבטחה) | «כמה עולה תחזוקת אתר בשנה» | Низкая конкуренция, recurring-revenue, закрывает страх «скрытых расходов» | Guide + таблица | да (таблица) |
| 15 | P4 | אוטומציה עסקית לעסק קטן: 12 תהליכים שכדאי להפסיק לעשות ידנית | «אוטומציה לעסק קטן / מה לאוטמט» | TOFU automation-cluster; листикл с цифрами «X שעות/חודש» | Listicle | да |
| 16 | P4 | חיבור CRM לחשבונית ירוקה (Morning), חשבשבת ו-iCount — אוטומציית הנהלת חשבונות לעסק | «חיבור CRM לחשבונית ירוקה / חשבשבת» | Гипер-локальная automation-ниша (израильский бухучёт), нулевая конкуренция. **Перечислить весь стек** (Morning/Greeninvoice/חשבשבת/iCount/Rivhit/Priority) | HowTo | да (шаги, лат.+ивр.) |
| 17 | P3 | כמה עולה הנגשת אתר ותקן 5568 — מדריך לעמידה בחוק והימנעות מקנס | «כמה עולה הנגשת אתר / תקן 5568 / קנס נגישות» | **Новое (из критики):** коммерческий/ценовой угол к информационному `website-accessibility-israel`. High-fear, high-conversion (תקנות שוויון זכויות, ת"י 5568, WCAG 2.0 AA, קנס עד ~₪75K). Привязать к Service-offer «הנגשה» | Guide + price + FAQ + Service offer | да |
| 18 | P4 | העברת אתר מ-Wix/וורדפרס ובנייה מחדש של אתר ישן — מדריך ומחירים | «העברת אתר מ-Wix / בנייה מחדש / העברת דומיין ואחסון» | **Новое (из критики):** migration/redesign switching-кластер — высокий коммерческий интент, низкая конкуренция, отсутствует в наборе | Guide + checklist + price | да |

**Off-site comparison-ассет (не блог-пост, но обязателен — из критики):**
| #17b | P4 | «AITERRA לעומת [конкурент]» / «אלטרנטיבה ל-[X]» — страница сравнения/альтернативы | vendor-selection промпты | LLM цитируют сравнения под выбор подрядчика; конкуренты с голым Person это не защитят. Сделать минимум одну «как мы отличаемся / альтернативы» страницу | Comparison-страница | да |

> **GEO/AEO-апгрейд (не новый пост):** тема «מה זה GEO/AEO ואיך מופיעים בתשובות של ChatGPT» уже покрыта постом `geo-ai-search-optimization` — **не дублировать**, а **апгрейднуть**: TL;DR, таблица «SEO vs GEO vs AEO», статистика с источниками (Pew/StatCounter), self-proving («если ChatGPT цитирует ваш ответ про GEO — это и есть доказательство компетенции»). Сильнейший защищаемый дифференциатор.

**Каденс:** P1 (#1,2,3,4) — месяц 1; P2 (#2b,5,6,7,8) — месяц 2; P3 (#9,10,11,12,13,17) — месяц 3; P4 (#14,15,16,18,17b) — месяц 4+. **Definition of Done каждой статьи:** TL;DR-блок; дефиниция-открытие; H2-вопросы; ≥1 таблица/числовой блок с источником; **блок `faq` (3–5 Q) → FAQPage (Приоритет 5)**; автор с полным Person schema; перелинковка на услугу/автора/2–3 поста; **RTL-визуальная проверка таблиц/HowTo в проде**; актуальный `dateModified`.

---

## 5. QUICK WINS vs LONG-TERM — план 30/60/90

### 0–30 дней (Quick wins — в основном правки существующих файлов)
1. **Разблокировать AI-ботов в Cloudflare** + добавить user-ботов (OAI-SearchBot, ChatGPT-User, Perplexity-User, Claude-User) в `robots.ts`; верифицировать **двухслойно** (curl + firewall-события на bot-IP). Поставить ежемесячную перепроверку, что «Block AI bots» не вернулся. **(шлюз)**
2. Заполнить `SOCIAL_PROFILES` в `src/lib/contact.ts` → оживить `sameAs`.
3. **Починить деплой-дефект авторов/FAQ:** (i) исправить битые иврит-био в `team-members.ts` (Sean стр.35, Michael стр.21) И (ii) добавить `authors.json` + `faq.json` в `sync-data-seeds.mjs` с seed-override-мёржем. Без (ii) — прод-риск сохраняется.
4. Обогатить `OrganizationSchema.tsx`: `knowsAbout` (+ израильский стек), `founder`, **реальный** `foundingDate`, **геокодированный** `geo`, `openingHours`, `availableLanguage:["he","en","ru"]`, `currenciesAccepted:"ILS"`, тип `["LocalBusiness","ProfessionalService","Organization"]`; PNG-логотип с размерами.
5. **Добавить блок `faq` в посты, где его нет** (минимум `website-performance-2026`, `local-seo-small-business`) → FAQPage. Прокинуть `dateModified` в `ArticleSchema`.
6. Создать `public/llms.txt`.
7. Настроить Google Business Profile + начать сбор отзывов.
8. Опубликовать **P1: #1, #2, #3, #4** (цена сайта, локальный Бат-Ям, цена автоматизации, CRM-сравнение).

### 30–60 дней (фундамент E-E-A-T)
9. Person schema в `ArticleSchema.tsx` + маршрут `/blog/author/[id]` + ProfilePage/Person JSON-LD; заполнить `socials` в `authors.json`.
10. `hasOfferCatalog` в `ServiceSchema.tsx` (+ израильский бухгалтерский стек по именам); расширить `areaServed` городами; переписать описания услуг в дефиниционные.
11. Pillar-страница **автоматизация/CRM/WhatsApp** (существующий пост — лист этого pillar) + статьи #5, #6, #7, #8, #2b.
12. `Review`/`AggregateRating` **строго по правилам п.2.10** (реальные on-page отзывы с авторами) — иначе не размечать.
13. Английская entity-страница `/en` + `alternateName` (hreflang/двуязычность).
14. Off-site: профили expert.co.il, bizmakebiz, B144, LinkedIn company page + личные. **Wikidata — пропустить** (порог notability не пройден).

### 60–90 дней (масштаб и закрепление авторитета)
15. **2–4 кейса с цифрами** (CaseStudy + корректный Review schema).
16. **Апгрейд GEO-поста** + апгрейд `wordpress-vs-custom-code` (#11) с таблицами/статистикой/источниками.
17. HowTo + `speakable` на процедурные посты (#9, #13, #16); добавить недостающие `faq` по всему блогу.
18. Завершить P3/P4: #9, #10, #11, #12, #13, #17 (доступность — с привязкой к Service-offer), затем #14, #15, #16, #18; **off-site comparison/alternative-страница #17b**.
19. Google/Meta Partner-бейджи — вести как многомесячный off-site-трек (не quick win); выводить как image+link.
20. Off-site сидинг: экспертные ответы на форумах/Reddit/Quora; гостевые публикации по AEO/автоматизации.
21. **Мониторинг цитирования:** вручную проверять, цитируют ли ChatGPT/Perplexity/Gemini/Google AI Overviews `aiterra.co.il` по целевым запросам из таблицы; итерировать контент под недостающие.

---

### Релевантные файлы (абсолютные пути)
- `c:\Users\vadim\Downloads\aiterra-website\scripts\sync-data-seeds.mjs` — сидит только blog/portfolio, **НЕ** `authors.json`/`faq.json` (корень прод-риска битых био) → правка №3(ii).
- `c:\Users\vadim\Downloads\aiterra-website\src\lib\authors-server.ts` — строка 79 `bio: author.bio || fallback.bio` (чистый JSON побеждает на здоровом волюме); строка 44 `ensureFile()` пишет битые `DEFAULT_AUTHORS` при отсутствии файла на волюме.
- `c:\Users\vadim\Downloads\aiterra-website\data\authors.json` — git-tracked, био чистые (Michael здесь НЕ битый).
- `c:\Users\vadim\Downloads\aiterra-website\src\data\team-members.ts` — строки 21 (Michael, обрывок) и 35 (Sean, набор слов) битые — это fallback → правка №3(i).
- `c:\Users\vadim\Downloads\aiterra-website\src\lib\contact.ts` — `SOCIAL_PROFILES` пустой (строки 14–18) → правка №2.
- `c:\Users\vadim\Downloads\aiterra-website\src\components\seo\OrganizationSchema.tsx` — `sameAs` пустой (стр.34); нет founder/knowsAbout/geo/availableLanguage; logo — SVG (стр.17) → правки №4, №2.11.
- `c:\Users\vadim\Downloads\aiterra-website\src\app\robots.ts` — разрешает AI-ботов, но edge Cloudflare переопределяет; нет user-ботов → правка №1.
- `c:\Users\vadim\Downloads\aiterra-website\src\components\seo\ArticleSchema.tsx` — author голый Person (стр.31–33); `dateModified` захардкожен в `datePublished` (стр.29) → правки №9, №6.
- `c:\Users\vadim\Downloads\aiterra-website\src\components\seo\ServiceSchema.tsx` — тонкая Service, `areaServed` одна Country, нет hasOfferCatalog → правка №8.
- `c:\Users\vadim\Downloads\aiterra-website\src\app\blog\[slug]\page.tsx` — строка 221: FaqSection только при наличии `post.faq` → подтверждает «двойного FAQPage НЕТ»; реальный пробел — посты без faq (`website-performance-2026`, `local-seo-small-business`) → правка №5.
- `c:\Users\vadim\Downloads\aiterra-website\data\faq.json` — ключуется по маршруту (`/`, `/contact`, `/services/*`); ответ `/contact` «כמה עולה לבנות אתר?» уклоняется от чисел → подтверждает статью #1.
- `public/llms.txt` — отсутствует, создать → правка №6.
- `src/app/blog/author/[id]/` — маршрут отсутствует, создать → правка №9.