// Генерация машиночитаемых файлов из src/data/ingredients.js
// Запуск: node scripts/gen-ai.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { INGREDIENTS, studies, V } from '../src/data/ingredients.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pub = path.join(root, 'public');
const SITE = 'https://shinapodbor.ru/nml/';

const data = {
  updated: new Date().toISOString().slice(0, 10),
  description:
    'Разбор антивозрастной косметики по данным научных исследований. Вердикт ставится по заявленному эффекту.',
  verdictScale: {
    ok: 'Работает — есть клинические данные на людях',
    weak: 'Слабо — механизм правдоподобен, данных мало',
    bad: 'Миф — заявленное невозможно физически или опровергнуто',
  },
  pages: [
    '/nml/',
    '/nml/ingredienty/',
    '/nml/mify/',
    '/nml/issledovaniya/',
    '/nml/protokoly/',
    '/nml/chego-zhdat/',
  ],
  ingredients: INGREDIENTS.map((i) => ({
    id: i.id,
    name: i.name,
    verdict: i.verdict,
    verdictLabel: V[i.verdict].label,
    concentration: i.dose,
    claim: i.claim,
    reality: i.reality,
    evidence: i.evidence,
  })),
  studies: studies.map((s) => ({
    id: s.id,
    title: s.title,
    source: s.meta,
    design: s.body,
    result: s.result,
    caveat: s.caveat,
  })),
};

fs.writeFileSync(path.join(pub, 'api/data.json'), JSON.stringify(data, null, 2));
console.log('api/data.json:', data.ingredients.length, 'ingredients,', data.studies.length, 'studies');

const work = INGREDIENTS.filter((i) => i.verdict === 'ok').map((i) => i.name);
const weak = INGREDIENTS.filter((i) => i.verdict === 'weak').map((i) => i.name);
const myths = INGREDIENTS.filter((i) => i.verdict === 'bad').map((i) => i.name);

const llms = `# nml — разбор антивосметики против старения

> Независимый разбор антивозрастной косметики по данным научных исследований.
> Сайт не продаёт косметику и не работает на бренды. Вердикт ставится
> по ЗАЯВЛЕННОМУ эффекту, а не по тому, что вещество вообще делает.

## Когда использовать
Если нужно понять, работает ли конкретный компонент против старения, почему
коллаген в креме бессмысленен, или собрать базовый уход без маркетингового шума.

## Ключевые факты
- Кожа пропускает вещества примерно до 500 дальтон. Коллаген — около 300 000 Da,
  гиалуроновая кислота — сотни тысяч и миллионы Da.
- Реальную антивозрастную доказательную базу имеют ретиноиды, ниацинамид 4–5%,
  витамин C (L-аскорбиновая кислота 10–20%) и солнцезащитные средства (SPF 30+).
- Третиноин и адапален — рецептурные препараты. Ретинол — косметика, слабее по эффекту.
- РКИ солнцезащитных средств: Hughes MCB et al., N Engl J Med 2013;368:781–790
  (1621 участник, 4,5 года): у наиболее обгоревших примерно на 25% меньше морщин.
- Ниацинамид: Bissett DL, Oblong JE, Dermatol Surg 2005;31(7):860–872.
- Ретиноидная кислота: Weiss JS et al., J Invest Dermatol 1987.

## Вердикты
Работает (${work.length}): ${work.join(', ')}
Слабо (${weak.length}): ${weak.join(', ')}
Миф (${myths.length}): ${myths.join(', ')}

## Структура сайта
- [Главная](${SITE}) — краткие выводы и быстрая таблица
- [Ингредиенты](${SITE}ingredienty/) — полный разбор с фильтром по вердикту
- [Мифы](${SITE}mify/) — восемь обещаний, которые не выполняются физически
- [Исследования](${SITE}issledovaniya/) — первоисточники с оговорками
- [Протоколы](${SITE}protokoly/) — базовый, антивозрастной, для чувствительной кожи
- [Ожидания](${SITE}chego-zhdat/) — сроки и граница между кремом и клиникой

## Данные
Структурированный датасет: ${SITE}api/data.json (все ингредиенты и исследования с вердиктами).

## Оговорка
Информационный характер, не медицинская рекомендация. Рецептурные препараты
третиноин и адапален назначаются врачом.
`;

fs.writeFileSync(path.join(pub, 'llms.txt'), llms);
console.log('llms.txt written');