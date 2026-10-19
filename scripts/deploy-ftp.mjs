// Читает .env, заливает apps/*/dist на reg.ru FTP. Зависимость: basic-ftp (npm i -D basic-ftp dotenv)
import 'dotenv/config';
import { Client } from 'basic-ftp';
import path from 'node:path';

const MAP = [
  ['s01-formatjson', 'S01'], ['s02-shinapodbor', 'S02'], ['s03-prokatves', 'S03'],
  ['s04-sechenieprovoda', 'S04'], ['s05-fanerabox', 'S05'], ['s06-kartonkorob', 'S06'],
  ['s07-promptaza', 'S07'], ['s08-domenpodbor', 'S08'],
];
const only = process.argv[2]; // напр. node scripts/deploy-ftp.mjs s04-sechenieprovoda

// Подпапки, залитые через stage-upload.mjs. Их нельзя сносить при деплое основного сайта:
// clearWorkingDir() удалил бы /nml/, /metal/, /box/, /fefco/ вместе с остальным.
const KEEP = (process.env.FTP_KEEP_DIRS || 'nml,metal,box,fefco')
  .split(',').map((s) => s.trim()).filter(Boolean);

async function clearExcept(client, keep) {
  const items = await client.list();
  for (const it of items) {
    if (it.isDirectory && keep.includes(it.name)) continue;
    if (it.isDirectory) await client.removeDir(it.name);
    else await client.remove(it.name);
  }
}

for (const [app, key] of MAP) {
  if (only && only !== app) continue;
  const client = new Client();
  try {
    await client.access({
      host: process.env.FTP_HOST, user: process.env[`FTP_USER_${key}`],
      password: process.env[`FTP_PASS_${key}`], secure: false,
    });
    await client.ensureDir(process.env[`FTP_DIR_${key}`] || `/${app}/`);
    await clearExcept(client, KEEP);
    await client.uploadFromDir(path.resolve(`apps/${app}/dist`));
    console.log(`OK ${app} (kept: ${KEEP.join(', ')})`);
  } catch (e) { console.error(`FAIL ${app}:`, e.message); } finally { client.close(); }
}
