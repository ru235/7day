import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const appsDir = new URL('../apps/', import.meta.url);
const apps = fs.readdirSync(appsDir).filter(d => d.startsWith('s'));
for (const app of apps) {
  console.log(`\n=== build ${app} ===`);
  execSync(`npx astro build --root apps/${app}`, { cwd: path.join(new URL('.', import.meta.url).pathname, '..'), stdio: 'inherit' });
}
console.log('\nAll built.');
