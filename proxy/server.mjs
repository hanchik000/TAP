// TAP AI proxy for your own server (Node.js 18+). No dependencies.
// Run: GOOGLE_API_KEY=... ALLOWED_ORIGIN=https://hanchik000.github.io PORT=8787 node proxy/server.mjs
// (or ANTHROPIC_API_KEY=... for Claude). Put it behind HTTPS (nginx/caddy).
import http from 'node:http';
import { askAI } from './providers.js';
const env = process.env, ALLOWED = env.ALLOWED_ORIGIN || 'https://hanchik000.github.io';
if (!env.GOOGLE_API_KEY && !env.ANTHROPIC_API_KEY) { console.error('Set GOOGLE_API_KEY or ANTHROPIC_API_KEY'); process.exit(1); }
const hits = new Map(); // per-IP limit: 60 requests / 10 min
http.createServer(async (req, res) => {
  const cors = { 'Access-Control-Allow-Origin': ALLOWED, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'content-type' };
  if (req.method === 'OPTIONS') { res.writeHead(204, cors); return res.end(); }
  if (req.method === 'GET') { res.writeHead(200, { ...cors, 'content-type': 'application/json' }); return res.end(JSON.stringify({ ok: true, provider: env.GOOGLE_API_KEY ? 'gemini' : 'claude' })); }
  if (req.method !== 'POST' || req.headers.origin !== ALLOWED) { res.writeHead(403, cors); return res.end(); }
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress; const now = Date.now();
  const h = (hits.get(ip) || []).filter(t => now - t < 600000); h.push(now); hits.set(ip, h);
  if (h.length > 60) { res.writeHead(429, cors); return res.end(); }
  let raw = ''; for await (const c of req) { raw += c; if (raw.length > 6e6) { res.writeHead(413, cors); return res.end(); } }
  try {
    const out = await askAI(env, JSON.parse(raw));
    res.writeHead(out.text != null ? 200 : out.status, { ...cors, 'content-type': 'application/json' });
    res.end(JSON.stringify(out.text != null ? { text: out.text } : { error: out.error }));
  } catch (e) { res.writeHead(400, cors); res.end(); }
}).listen(env.PORT || 8787, () => console.log('TAP AI proxy on', env.PORT || 8787));
