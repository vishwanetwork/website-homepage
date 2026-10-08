import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = name => fs.readFileSync(path.join(root, 'partials', name), 'utf8');
const preview = process.argv.includes('--preview');
const siteUrl = process.env.SITE_URL || (preview ? 'http://127.0.0.1:4187/' : 'https://vishwalab.com/');
const dist = path.join(root, 'dist');
fs.mkdirSync(dist, { recursive: true });
fs.cpSync(path.join(root, 'public'), dist, { recursive: true });

const intro = read('intro.html').replace('<!-- VISHWA_GATE -->', read('gate.html'));
let html = read('shell.html').replace('<!-- VISHWA_CONTENT -->', intro + read('compute.html') + read('tail.html'));
html = html.replaceAll('{{PAGE_TITLE}}', preview ? 'Vishwa — Visual Homepage Preview' : 'Vishwa | Financial Infrastructure for Autonomous Agents')
  .replaceAll('{{ROBOTS}}', preview ? 'noindex,nofollow' : 'index,follow')
  .replaceAll('{{SITE_URL}}', siteUrl);
fs.writeFileSync(path.join(dist, 'index.html'), html);
fs.writeFileSync(path.join(dist, 'preview.css'), ['preview.css', 'gate.css', 'compute.css', 'tail.css'].map(read).join('\n'));
for (const name of ['preview.js', 'gate.js', 'compute.js', 'tail.js']) {
  fs.copyFileSync(path.join(root, 'partials', name), path.join(dist, name));
}
fs.writeFileSync(path.join(dist, 'robots.txt'), preview ? 'User-agent: *\nDisallow: /\n' : 'User-agent: *\nAllow: /\n');
console.log(`Built ${preview ? 'preview' : 'production'} static site: ${dist}`);
