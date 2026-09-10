// Разовая заливка локальной папки в подпапку на FTP (стейджинг), корень не трогает.
// Использование: FTP_S02_PASS=... node scripts/stage-upload.mjs /tmp/stage-metal /metal
// Либо берёт S02-доступ из .env (dotenv).
import 'dotenv/config';
import { Client } from 'basic-ftp';

const [, , localDir, remoteDir] = process.argv;
if (!localDir || !remoteDir) { console.error('usage: stage-upload.mjs <localDir> <remoteDir>'); process.exit(1); }
const pass = process.env.FTP_S02_PASS || process.env.FTP_PASS_S02;
const c = new Client();
try {
  await c.access({ host: process.env.FTP_HOST || '37.140.192.111', user: process.env.FTP_S02_USER || process.env.FTP_USER_S02, password: pass, secure: false });
  await c.ensureDir(remoteDir);
  await c.clearWorkingDir();
  await c.uploadFromDir(localDir);
  console.log('STAGE OK', remoteDir);
} finally { c.close(); }
