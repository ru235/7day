import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const appsDir = path.join(projectRoot, 'apps');
const apps = fs.readdirSync(appsDir).filter(d => d.startsWith('s'));
for (const app of apps) {
  console.log(`\n=== build ${app} ===`);
  execSync(`npx astro build --root apps/${app}`, { cwd: projectRoot, stdio: 'inherit', shell: true });
}
console.log('\nAll built.');
