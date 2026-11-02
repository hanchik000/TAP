// Shared provider logic for the TAP AI proxy. Supports Google Gemini (default) and Anthropic Claude.
// Input: messages in Anthropic shape [{role:'user'|'assistant', content: string | [{type:'text'|'image', ...}]}]
export const GEMINI_MODELS = { quick: 'gemini-2.5-flash', default: 'gemini-2.5-flash', complex: 'gemini-2.5-pro' };
export const CLAUDE_MODELS = { quick: 'claude-haiku-5-5', default: 'claude-sonnet-5-5', complex: 'claude-opus-5-5' };

function toGemini(messages) {
  return messages.slice(-12).map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: (typeof m.content === 'string' ? [{ type: 'text', text: m.content }] : m.content).map(b =>
      b.type === 'image' ? { inlineData: { mimeType: b.source.media_type, data: b.source.data } } : { text: b.text })
  }));
}

export async function askAI(env, body) {
  const tier = body.tier in GEMINI_MODELS ? body.tier : 'default';
  if (env.GOOGLE_API_KEY) {
    const key = env.GOOGLE_API_KEY;
    const model = env['GEMINI_MODEL_' + tier.toUpperCase()] || GEMINI_MODELS[tier];
    // AI Studio keys start with "AIza"; Vertex AI express-mode keys (e.g. "AQ.…") use aiplatform.
    const url = key.startsWith('AIza')
      ? `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`
      : `https://aiplatform.googleapis.com/v1/publishers/google/models/${model}:generateContent?key=${key}`;
    const r = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ contents: toGemini(body.messages), generationConfig: { maxOutputTokens: 8192, temperature: 0.7 } }) });
    const j = await r.json();
    if (!r.ok) return { status: r.status === 429 ? 429 : 502, error: j.error?.status || j.error?.message || 'upstream' };
    const text = (j.candidates?.[0]?.content?.parts || []).map(p => p.text || '').join('');
    return text ? { text } : { status: 502, error: j.candidates?.[0]?.finishReason || 'empty' };
  }
  if (env.ANTHROPIC_API_KEY) {
    const r = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' }, body: JSON.stringify({ model: CLAUDE_MODELS[tier], max_tokens: 6000, messages: body.messages.slice(-12) }) });
    const j = await r.json();
    if (!r.ok) return { status: r.status === 429 ? 429 : 502, error: j.error?.type || 'upstream' };
    return { text: (j.content || []).filter(b => b.type === 'text').map(b => b.text).join('') };
  }
  return { status: 500, error: 'no_key' };
}
