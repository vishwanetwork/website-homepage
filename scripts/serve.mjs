import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const port = Number(process.env.PORT || 4187);
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp', '.woff2':'font/woff2', '.ico':'image/x-icon', '.txt':'text/plain; charset=utf-8', '.json':'application/json' };
const server = http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400).end(); return; }
  const file = path.resolve(dist, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(dist + path.sep)) { res.writeHead(403).end(); return; }
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404).end('Not found'); return; }
  res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control':'no-store' });
  fs.createReadStream(file).pipe(res);
});
server.listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}`));
