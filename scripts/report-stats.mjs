// Сводка по 8 сервисам из API Яндекс.Метрики.
// Использование: METRIKA_TOKEN=... node scripts/report-stats.mjs [--days 30]
// Токен: https://oauth.yandex.ru/authorize?response_type=token&client_id=... (scope metrika:read)
// Счётчики: METRIKA_S01..S08 в .env (известны: S02=112400622, S04=112399017, S06=112589281).
// Пишет stats/report-YYYY-MM-DD.json и печатает таблицу. Код без токена — только таблица-инструкция.
import 'dotenv/config';
import fs from 'node:fs';

const DAYS = +(process.argv.find((a, i) => process.argv[i - 1] === '--days') || 30);
const TOKEN = process.env.METRIKA_TOKEN;
const SERVICES = [
  ['S01', 'formatjson.ru'], ['S02', 'shinapodbor.ru'], ['S03', 'prokatves.ru'], ['S04', 'sechenieprovoda.ru'],
  ['S05', 'fanerabox.ru'], ['S06', 'formgen.ru'], ['S07', 'promptaza.ru'], ['S08', 'domenpodbor.ru'],
];

function day(d) { return d.toISOString().slice(0, 10); }
async function api(counter, date1, date2, metrics, dimensions = '') {
  const q = new URLSearchParams({ ids: counter, metrics, date1, date2, accuracy: 'full', ...(dimensions ? { dimensions } : {}) });
  const r = await fetch('https://api-metrika.yandex.net/stat/v1/data?' + q, { headers: { Authorization: 'OAuth ' + TOKEN } });
  if (!r.ok) throw new Error(`HTTP ${r.status} (${counter})`);
  return r.json();
}

if (!TOKEN) {
  console.log('Нужен METRIKA_TOKEN (scope metrika:read). Как получить:');
  console.log('1. https://oauth.yandex.ru/client/new — создать приложение, права «Яндекс.Метрика: чтение статистики».');
  console.log('2. Открыть https://oauth.yandex.ru/authorize?response_type=token&client_id=ВАШ_ID');
  console.log('3. Положить токен в .env как METRIKA_TOKEN=... (не в git).');
  console.log('4. Счётчики в .env: METRIKA_S01..S08 (S02=112400622, S04=112399017, S06=112589281).');
  process.exit(0);
}

const end = new Date(), start = new Date(Date.now() - (DAYS - 1) * 864e5);
const d1 = day(start), d2 = day(end);
const rows = [];
for (const [code, domain] of SERVICES) {
  const id = process.env['METRIKA_' + code];
  if (!id) { rows.push({ code, domain, error: 'нет счётчика в .env' }); continue; }
  try {
    const [tot, src] = await Promise.all([
      api(id, d1, d2, 'ym:s:visits,ym:s:pageviews,ym:s:users'),
      api(id, d1, d2, 'ym:s:visits', 'ym:s:<attribution>TrafficSource').catch(() => null),
    ]);
    const t = tot.totals?.[0] || [0, 0, 0];
    rows.push({ code, domain, counter: id, visits: Math.round(t[0]), pageviews: Math.round(t[1]), users: Math.round(t[2]), sources: (src?.data || []).slice(0, 5).map(s => ({ src: s.dimensions?.[0]?.name, visits: Math.round(s.metrics?.[0]) })) });
  } catch (e) { rows.push({ code, domain, error: e.message }); }
  await new Promise(r => setTimeout(r, 300));
}

rows.sort((a, b) => (b.visits || 0) - (a.visits || 0));
const line = (r) => `${r.code} ${r.domain.padEnd(20)} ${r.error ? '— ' + r.error : `визиты ${r.visits}, просмотры ${r.pageviews}, юзеры ${r.users}`}`;
console.log(`Метрика за ${d1}..${d2} (топ — победитель):\n` + rows.map(line).join('\n'));
fs.mkdirSync('stats', { recursive: true });
const file = `stats/report-${d2}.json`;
fs.writeFileSync(file, JSON.stringify({ period: [d1, d2], rows }, null, 1));
console.log('\nJSON: ' + file);
