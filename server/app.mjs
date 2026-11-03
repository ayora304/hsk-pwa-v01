import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createEcosystemHandler } from './ecosystem.mjs';
const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const bridge = createEcosystemHandler({ backendUrl: process.env.BOT_API_URL, serviceToken: process.env.BOT_SERVICE_TOKEN });
const mime = { '.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2','.woff':'font/woff','.ico':'image/x-icon' };
async function staticFile(req, res) {
  if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405);res.end();return; }
  let pathname;
  try { pathname=decodeURIComponent(new URL(req.url,'http://local').pathname); } catch { res.writeHead(400);res.end();return; }
  if (pathname.startsWith('/api/')) { res.writeHead(404,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'Endpoint unavailable.'}));return; }
  let filename=path.resolve(dist,'.'+pathname);
  if (!filename.startsWith(path.resolve(dist)+path.sep) && filename!==path.resolve(dist)) {res.writeHead(403);res.end();return;}
  try {
    try { if(!(await stat(filename)).isFile())filename=path.join(dist,'index.html'); } catch { if(path.extname(pathname)){res.writeHead(404);res.end();return;}filename=path.join(dist,'index.html'); }
    const info=await stat(filename);
    res.writeHead(200,{'Content-Type':mime[path.extname(filename)]||'application/octet-stream','Content-Length':info.size,'Cache-Control':pathname.startsWith('/assets/')?'public, max-age=31536000, immutable':'no-cache','X-Content-Type-Options':'nosniff'});
    if(req.method==='HEAD'){res.end();return;}createReadStream(filename).pipe(res);
  } catch {res.writeHead(503);res.end('Build the application before starting the server.');}
}
createServer((req,res)=>{bridge(req,res,()=>{void staticFile(req,res);}).catch(()=>{if(!res.headersSent)res.writeHead(500);res.end();});}).listen(Number(process.env.PORT||3000),'0.0.0.0',()=>console.log('HSK PWA server ready'));
