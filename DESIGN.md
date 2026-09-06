# DESIGN.md (Google Stitch spec, единый для 8 сервисов)

Primary: oklch(55% 0.12 250) — спокойный синий. Accent: oklch(70% 0.14 150) только для результата расчёта.
Wordmark: 600, tight. Body: system-ui/Inter, Regular 400, 16/1.6.
Radii: 10px cards, 8px inputs. Spacing: 8px scale x6.
Components: Button(primary/ghost), Card(flat, без вложенности), Input/Select, CalcResult, DataTable, FaqAccordion, AnswerBlock(TL;DR), Breadcrumbs.
Rules: светлая тема по умолчанию + тёмная; hero без eyebrow-chip; цифры моно; таблицы нативные <table>; контраст AA.
