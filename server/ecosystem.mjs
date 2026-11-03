import { createServer } from 'node:http';
import { pathToFileURL } from 'node:url';

export function createEcosystemHandler({ backendUrl, serviceToken, request = fetch } = {}) {
  const requests = new Map();
  return async (req, res, next = () => { res.writeHead(404); res.end(); }) => {
    const pathname = req.url?.split('?')[0] || '';
    const route = pathname.match(/^\/api\/(handwriting-review|translate)(?:\/([a-f0-9]{48}))?$/);
    const branding = pathname === '/api/ecosystem/branding';
    if (!route && !branding) return next();
    const reply = (status, data) => { res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(data)); };
    if (req.headers.origin) {
      try { if (new URL(req.headers.origin).host !== req.headers.host) return reply(403, { error: 'Requests must come from this app.' }); }
      catch { return reply(403, { error: 'Invalid request origin.' }); }
    }
    const isJob = Boolean(route?.[2]);
    if (req.method !== (branding || isJob ? 'GET' : 'POST')) return reply(405, { error: 'Method not allowed.' });
    if (!backendUrl || (!branding && !serviceToken)) return reply(503, { error: 'The bot service is not connected yet. Your work is saved on this device.' });
    let base;
    try { base = new URL(backendUrl); if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password) throw Error(); }
    catch { return reply(503, { error: 'The bot service address is not configured correctly.' }); }
    let body;
    if (req.method === 'POST') {
      if (!req.headers['content-type']?.startsWith('application/json')) return reply(415, { error: 'Expected a JSON request.' });
      const now = Date.now();
      for (const [key, value] of requests) if (now - value.start >= 60000) requests.delete(key);
      const ip = req.socket.remoteAddress || 'local';
      const current = requests.get(ip) || { count: 0, start: now };
      if (current.count >= 6) return reply(429, { error: 'Please wait a minute before requesting more reviews.' });
      if (requests.size >= 500 && !requests.has(ip)) return reply(429, { error: 'The service is busy. Please try later.' });
      current.count++; requests.set(ip, current);
      let raw = '', size = 0;
      for await (const chunk of req) { size += Buffer.byteLength(chunk); if (size > 2 * 1024 * 1024) return reply(413, { error: 'This drawing is too large. Select one character.' }); raw += chunk; }
      try { body = JSON.parse(raw); } catch { return reply(400, { error: 'Invalid JSON.' }); }
      if (route[1] === 'handwriting-review' && (!body || typeof body.character !== 'string' || !/^\p{Script=Han}$/u.test(body.character) || typeof body.image !== 'string' || !/^data:image\/png;base64,[A-Za-z0-9+/]+={0,2}$/.test(body.image))) return reply(400, { error: 'Select one handwritten Chinese character to review.' });
      if (route[1] === 'translate' && (!body || typeof body.text !== 'string' || !body.text.trim() || body.text.length > 1500 || !['en', 'zh'].includes(body.target))) return reply(400, { error: 'Enter up to 1500 characters and select Chinese or English.' });
    }
    try {
      const suffix = branding ? 'branding' : route[1] + (isJob ? '/' + route[2] : '');
      const response = await request(new URL('/api/pwa/' + suffix, base), {
        method: req.method, redirect: 'error', signal: AbortSignal.timeout(15000),
        headers: { ...(branding ? {} : { Authorization: 'Bearer ' + serviceToken }), ...(body ? { 'Content-Type': 'application/json' } : {}) },
        ...(body ? { body: JSON.stringify(body) } : {})
      });
      const data = await response.json();
      return reply(response.status, data);
    } catch { return reply(502, { error: 'Could not reach the bot service. Your work is still saved locally.' }); }
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  createServer(createEcosystemHandler({ backendUrl: process.env.BOT_API_URL, serviceToken: process.env.BOT_SERVICE_TOKEN }))
    .listen(8787, '127.0.0.1', () => console.log('PWA service bridge listening on http://127.0.0.1:8787'));
}
