// TAP AI proxy — Cloudflare Worker (бесплатный тариф: 100 000 запросов в день).
// Секреты (Settings → Variables → Secret): ANTHROPIC_API_KEY
// Переменная: ALLOWED_ORIGIN = https://hanchik000.github.io
const MODELS = { quick: 'claude-haiku-5-5', default: 'claude-sonnet-5-5', complex: 'claude-opus-5-5' };

export default {
  async fetch(req, env) {
    const origin = req.headers.get('Origin') || '';
    const allowed = env.ALLOWED_ORIGIN || 'https://hanchik000.github.io';
    const cors = { 'Access-Control-Allow-Origin': allowed, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'content-type', 'Vary': 'Origin' };
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (req.method !== 'POST') return new Response('Not found', { status: 404, headers: cors });
    if (origin !== allowed) return new Response('Forbidden', { status: 403, headers: cors });
    const raw = await req.text();
    if (raw.length > 6_000_000) return new Response('Too large', { status: 413, headers: cors });
    let body; try { body = JSON.parse(raw); } catch { return new Response('Bad JSON', { status: 400, headers: cors }); }
    if (!Array.isArray(body.messages) || !body.messages.length) return new Response('No messages', { status: 400, headers: cors });
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: MODELS[body.tier] || MODELS.default, max_tokens: 6000, messages: body.messages.slice(-12) })
    });
    const j = await r.json();
    if (!r.ok) return new Response(JSON.stringify({ error: j.error?.type || 'upstream' }), { status: r.status === 429 ? 429 : 502, headers: { ...cors, 'content-type': 'application/json' } });
    const text = (j.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
    return new Response(JSON.stringify({ text }), { headers: { ...cors, 'content-type': 'application/json' } });
  }
};
