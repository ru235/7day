# Второй компьютер (Windows 10 + opencode) — настройка за 15 минут

## 1. Поставить базу
- Node.js **22 LTS** (https://nodejs.org) — проверить: `node -v` → v22.x
- Git for Windows (https://git-scm.com) + `gh` (https://cli.github.com): `gh auth login`

## 2. Забрать проект
```powershell
gh repo clone ru235/7day service555
cd service555
npm install
```

## 3. Секреты (.env) — в репо их нет, скопировать с Mac
На Mac лежит готовый `.env`. Скопируй его содержимое на Windows в `service555\.env`
(флешка, мессенджер себе, Bitwarden — как удобно). Состав:
`FTP_HOST`, `FTP_USER_S01..S08`, `FTP_PASS_S01..S08`, `FTP_DIR_S01..S08`,
`GA4_ID`, `METRIKA_ID`. Шаблон с пустыми полями — в `.env.example`.

## 4. Скиллы (дублируют Mac)
Сами навыки уже в репо (`.agents/skills`, 76 файлов). Для привязки к opencode на Windows:
```powershell
npx impeccable install
npx skills@latest add emilkowalski/skills
```

## 5. Авторизация opencode
```powershell
opencode auth login
```
Залогиниться тем же провайдером, что на Mac.

## 6. Проверка
```powershell
node scripts/build-all.mjs
npx impeccable detect apps/s04-sechenieprovoda/src/ packages/ui/
```
Должно: все app собираются, `0 anti-patterns`. Dev-сервер: `npx astro dev --root apps/s04-sechenieprovoda --port 4321`.

## 7. Регламент совместной работы
- Перед работой: `git pull origin main`
- После: `git add -A && git commit -m "..." && git push origin main`
- Деплой на reg.ru — только с машины, где есть `.env` (обе после шага 3).
- Мобильную вёрстку проверять рендером (см. процесс в чате: Playwright + channel chrome).

## Не переносится (и не нужно)
- `node_modules/`, `dist/`, `.astro/` — пересоздаются (`npm install`, `astro build`).
- `opencode auth` — отдельный логин на каждой машине.
- `/tmp/*.mjs`, `/tmp/pwtest` — временные скрипты с Mac, в репо есть аналоги (`scripts/`).
