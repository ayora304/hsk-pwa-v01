import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createHandwritingHandler } from './handwriting.mjs';
async function withServer(options, run) {
  const server = createServer(createHandwritingHandler(options));
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try { await run(`http://127.0.0.1:${server.address().port}`); }
  finally { await new Promise(resolve => server.close(resolve)); }
}
const payload = { character: '永', image: 'data:image/png;base64,iVBORw0KGgo=' };
const post = (url, body = payload) => fetch(`${url}/api/handwriting-review`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
test('missing credentials return setup message without calling provider', () => withServer({ request: () => { throw Error('Must not call provider'); } }, async url => {
  const response = await post(url); assert.equal(response.status, 503); assert.match((await response.json()).error, /server API key/);
}));
test('invalid targets and cross-origin requests are rejected', () => withServer({ apiKey: 'test-only' }, async url => {
  assert.equal((await post(url, { ...payload, character: 'hello' })).status, 400);
  assert.equal((await fetch(`${url}/api/handwriting-review`, { method: 'POST', headers: { Origin: 'https://other.example' } })).status, 403);
}));
test('image is sent as vision input and structured feedback is returned', () => {
  const review = { score: 72, summary: 'Recognizable.', strengths: ['Clear structure.'], improvements: ['Shorten the horizontal stroke.'] };
  return withServer({ apiKey: 'test-only', request: async (_url, options) => {
    const body = JSON.parse(options.body); assert.equal(body.store, false); assert.equal(body.text.format.strict, true);
    assert.equal(body.input[0].content[1].image_url, payload.image);
    return Response.json({ status: 'completed', output: [{ content: [{ type: 'output_text', text: JSON.stringify(review) }] }] });
  } }, async url => { const response = await post(url); assert.equal(response.status, 200); assert.deepEqual(await response.json(), review); });
});
test('malformed provider feedback never becomes a score', () => withServer({ apiKey: 'test-only', request: async () => Response.json({ status: 'completed', output: [{ content: [{ type: 'output_text', text: '{"score":999}' }] }] }) }, async url => {
  assert.equal((await post(url)).status, 502);
}));
test('provider failures and oversized input are handled', () => withServer({ apiKey: 'test-only', request: async () => new Response('', { status: 429 }) }, async url => {
  assert.equal((await post(url)).status, 429);
  assert.equal((await post(url, { ...payload, image: 'a'.repeat(2 * 1024 * 1024) })).status, 413);
}));
