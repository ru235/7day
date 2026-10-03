import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const appsDir = path.join(projectRoot, 'apps');
const only = process.argv[2]; // node scripts/build-all.mjs s04-sechenieprovoda
const apps = fs.readdirSync(appsDir).filter(d => d.startsWith('s') && (!only || d === only));
const CONCURRENCY = 3;

function build(app) {
  return new Promise((resolve) => {
    console.log(`\n=== build ${app} ===`);
    const t0 = Date.now();
    const child = execFile('npx', ['astro', 'build', '--root', `apps/${app}`], { cwd: projectRoot, shell: true }, (err) => {
      console.log(`=== ${app}: ${err ? 'FAIL' : 'OK'} in ${((Date.now() - t0) / 1000).toFixed(1)}s ===`);
      resolve(!err);
    });
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  });
}

const results = [];
for (let i = 0; i < apps.length; i += CONCURRENCY) {
  const chunk = await Promise.all(apps.slice(i, i + CONCURRENCY).map(build));
  results.push(...chunk);
}
if (!results.every(Boolean)) process.exitCode = 1;
console.log(results.every(Boolean) ? '\nAll built.' : '\nSome builds FAILED.');
