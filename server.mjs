import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const port = Number(process.env.PORT || 5173);
const root = process.cwd();

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

createServer(async (req, res) => {
  try {
    const urlPath = req.url === '/' ? '/index.html' : req.url.split('?')[0];
    const safePath = normalize(urlPath).replace(/^\.\.(\/|\\|$)/, '');
    const filePath = join(root, safePath);
    const data = await readFile(filePath);
    const type = mime[extname(filePath)] || 'text/plain; charset=utf-8';
    res.writeHead(200, { 'Content-Type': type });
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
}).listen(port, () => {
  console.log(`Dev server running at http://127.0.0.1:${port}`);
});
