// TAP AI proxy — Cloudflare Worker (free plan: 100 000 requests/day).
// Secrets (Settings → Variables and Secrets → Secret): GOOGLE_API_KEY  (or ANTHROPIC_API_KEY)
// Variable: ALLOWED_ORIGIN = https://hanchik000.github.io
// Upload both files: cloudflare-worker.js (main) and providers.js.
import { askAI } from './providers.js';

export default {
  async fetch(req, env) {
    const allowed = env.ALLOWED_ORIGIN || 'https://hanchik000.github.io';
    const cors = { 'Access-Control-Allow-Origin': allowed, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'content-type', 'Vary': 'Origin' };
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (req.method === 'GET') return new Response(JSON.stringify({ ok: true, provider: env.GOOGLE_API_KEY ? 'gemini' : env.ANTHROPIC_API_KEY ? 'claude' : 'none' }), { headers: { ...cors, 'content-type': 'application/json' } });
    if (req.method !== 'POST') return new Response('Not found', { status: 404, headers: cors });
    if ((req.headers.get('Origin') || '') !== allowed) return new Response('Forbidden', { status: 403, headers: cors });
    const raw = await req.text();
    if (raw.length > 6_000_000) return new Response('Too large', { status: 413, headers: cors });
    let body; try { body = JSON.parse(raw); } catch { return new Response('Bad JSON', { status: 400, headers: cors }); }
    if (!Array.isArray(body.messages) || !body.messages.length) return new Response('No messages', { status: 400, headers: cors });
    const out = await askAI(env, body);
    return new Response(JSON.stringify(out.text != null ? { text: out.text } : { error: out.error }), { status: out.text != null ? 200 : out.status, headers: { ...cors, 'content-type': 'application/json' } });
  }
};
