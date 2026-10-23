/*  Write back: the endpoint behind the three buttons at the foot of an entry (static/js/write-back.js).
    A POST of {kind, phrase, text, quote, title, url, mode} becomes a GitHub issue in the site's repo, labelled
    `reader` and with the kind (curious, gap or more), so a reader's note lands where the entries are written.
    Nothing about the reader is kept: no name, no address, no IP. Deploying: README.md beside this file. */

const KINDS = { curious: "I'm curious about…", gap: 'I see a gap…', more: 'I want to know more…' };

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
    const ok = allowed.includes(origin);
    const cors = ok
      ? { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type', 'Vary': 'Origin' }
      : {};
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST') return json({ error: 'POST only' }, 405, cors);
    if (!ok) return json({ error: 'origin not allowed' }, 403, cors);

    let p;
    try { p = await request.json(); } catch (e) { return json({ error: 'bad json' }, 400, cors); }
    if (typeof p.website === 'string' && p.website) return json({ ok: true }, 200, cors);   // a field only a robot fills

    const kind = KINDS[p.kind] ? p.kind : '';
    const text = clean(p.text, 2000);
    const quote = clean(p.quote, 300).replace(/\s+/g, ' ');
    const title = clean(p.title, 200).replace(/\s+/g, ' ');
    const url = clean(p.url, 500);
    if (!kind || !text || !title || !url) return json({ error: 'missing fields' }, 400, cors);
    if (!allowed.some((o) => url.startsWith(o + '/'))) return json({ error: 'url not on the site' }, 400, cors);
    const mode = p.mode === 'young' ? ' (the younger readers version)' : '';

    const body = [
      `**${KINDS[kind]}**`, '', text,
      ...(quote ? ['', `> ${quote}`] : []),
      '', `Entry: [${title}](${url})${mode}`,
      '', '_Sent from the entry page. No name or address was collected._',
    ].join('\n');

    const api = env.GITHUB_API || 'https://api.github.com';     // overridden only when testing against a stand-in
    const res = await fetch(`${api}/repos/${env.GITHUB_REPO}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'journal-write-back',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: `${KINDS[kind]} (${title})`, body, labels: ['reader', kind] }),
    });
    if (!res.ok) return json({ error: `github ${res.status}` }, 502, cors);
    const issue = await res.json();
    return json({ ok: true, issue: issue.html_url }, 200, cors);
  },
};

function clean(v, max) {
  return typeof v === 'string' ? v.replace(/\r/g, '').trim().slice(0, max) : '';
}
function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', ...headers } });
}
