# aiterra-website

Маркетинговый сайт Aiterra (aiterra.co.il): Next.js 16 App Router, React 19, Tailwind 4, TypeScript. Двуязычный — иврит (основной, RTL) и английский: route-группы `src/app/(he)` и `src/app/(en)`. 3D-логотип на three.js / @react-three/fiber.

## Команды

- `npm run dev` — dev-сервер
- `npm run build` — прод-сборка (prebuild гоняет `scripts/sync-data-seeds.mjs`)
- `npm run lint` — ESLint
- `npm run ai-visibility` — проверка видимости в AI-поисковиках (DataForSEO)

## Архитектура

- Контент — JSON-файлы в `data/` (blog-posts, portfolio-projects, faq, site-seo, authors, site-leads). Правки контента = правки этих файлов, CMS нет.
- `src/middleware.ts` — cookie-аутентификация `/admin` по `ADMIN_PASSWORD`.
- Лид-формы: `/api/site-leads/submit` → сохранение в `data/site-leads.json` + email через SMTP (Google Workspace relay, порт 587 — только он открыт в firewall) + серверный форвардинг в Aiterra CRM (`CRM_API_URL`). Каждый из каналов опционален и деградирует молча.
- `/admin/printer` и `/admin/product` проксируют внешний shop/device-бекенд (`PRINTER_API_URL`); без него отвечают 501.
- `next.config.ts`: `output: 'standalone'`, редиректы со старых v2-путей.
- SEO/AEO-стратегия описана в `docs/aeo-strategy.md`, каталог `.geo-opt/` — рабочие материалы GEO-оптимизации.

## Деплой

GitHub Actions `.github/workflows/deploy.yml`: по SSH на сервер → `git pull` → `docker compose up -d --build`. Nginx-конфиг `nginx.docker.conf` бинд-маунтится в edge-контейнер. Env — только в серверном `.env` (см. `.env.example`), `NEXT_PUBLIC_*` инлайнятся на этапе сборки и должны попадать в build args compose.

## Иврит / RTL

Ивритские страницы — RTL: использовать CSS logical properties (`ms-`/`me-`, `ps-`/`pe-` в Tailwind), не left/right. Направленные иконки зеркалить.
