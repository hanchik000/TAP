// TAP AI proxy for your own server (Node.js 18+). No dependencies.
// Run: ANTHROPIC_API_KEY=... ALLOWED_ORIGIN=https://hanchik000.github.io PORT=8787 node proxy/server.mjs
// Put it behind HTTPS (nginx/caddy) — GitHub Pages can only call https:// addresses.
import http from 'node:http';
const MODELS = { quick: 'claude-haiku-5-5', default: 'claude-sonnet-5-5', complex: 'claude-opus-5-5' };
const KEY = process.env.ANTHROPIC_API_KEY, ALLOWED = process.env.ALLOWED_ORIGIN || 'https://hanchik000.github.io';
if (!KEY) { console.error('Set ANTHROPIC_API_KEY'); process.exit(1); }
const hits = new Map(); // simple per-IP limit: 60 requests / 10 min
http.createServer(async (req, res) => {
  const cors = { 'Access-Control-Allow-Origin': ALLOWED, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'content-type' };
  if (req.method === 'OPTIONS') { res.writeHead(204, cors); return res.end(); }
  if (req.method !== 'POST' || req.headers.origin !== ALLOWED) { res.writeHead(403, cors); return res.end(); }
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress; const now = Date.now();
  const h = (hits.get(ip) || []).filter(t => now - t < 600000); h.push(now); hits.set(ip, h);
  if (h.length > 60) { res.writeHead(429, cors); return res.end(); }
  let raw = ''; for await (const c of req) { raw += c; if (raw.length > 6e6) { res.writeHead(413, cors); return res.end(); } }
  try {
    const body = JSON.parse(raw);
    const r = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'x-api-key': KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' }, body: JSON.stringify({ model: MODELS[body.tier] || MODELS.default, max_tokens: 6000, messages: (body.messages || []).slice(-12) }) });
    const j = await r.json();
    if (!r.ok) { res.writeHead(r.status === 429 ? 429 : 502, { ...cors, 'content-type': 'application/json' }); return res.end(JSON.stringify({ error: j.error?.type || 'upstream' })); }
    res.writeHead(200, { ...cors, 'content-type': 'application/json' });
    res.end(JSON.stringify({ text: (j.content || []).filter(b => b.type === 'text').map(b => b.text).join('') }));
  } catch (e) { res.writeHead(400, cors); res.end(); }
}).listen(process.env.PORT || 8787, () => console.log('TAP AI proxy on', process.env.PORT || 8787));
