import assert from 'node:assert/strict';
import worker from '../worker.mjs';
let seen;
const env = { ASSETS: { async fetch(request) { seen = request; return new Response('asset', {headers: {'Content-Type': 'image/webp'}}); } } };
const base = 'https://xiaosang.cc';
let response = await worker.fetch(new Request(base + '/rock-in-pictures?from=qr'), env);
assert.equal(response.status, 308);
assert.equal(response.headers.get('Location'), base + '/rock-in-pictures/?from=qr');
response = await worker.fetch(new Request(base + '/rock-in-pictures/assets/02.webp?v=1', {method:'HEAD'}), env);
assert.equal(seen.url, base + '/assets/02.webp?v=1');
assert.equal(seen.method, 'HEAD');
assert.equal(response.headers.get('Content-Type'), 'image/webp');
await worker.fetch(new Request(base + '/rock-in-pictures/'), env);
assert.equal(seen.url, base + '/');
response = await worker.fetch(new Request(base + '/unrelated'), env);
assert.equal(response.status, 404);
response = await worker.fetch(new Request(base + '/rock-in-pictures-other'), env);
assert.equal(response.status, 404);
const redirectEnv = { ASSETS: { fetch: async () => Response.redirect(base + '/?x=1', 308) } };
response = await worker.fetch(new Request(base + '/rock-in-pictures/index.html'), redirectEnv);
assert.equal(response.headers.get('Location'), base + '/rock-in-pictures/?x=1');
console.log('PASS: subpath routing, trailing slash, query, HEAD, asset redirects, and namespace isolation');

const parts = [
  {path:'downloads/parts/aaaaaaaaaaaa-001.bin',size:3},
  {path:'downloads/parts/aaaaaaaaaaaa-002.bin',size:3}
];
let fetchedParts = 0;
const archiveEnv = { ASSETS: { async fetch(request) {
  const pathname = new URL(request.url).pathname;
  if (pathname === '/downloads/manifest.json') return Response.json({parts,totalBytes:6});
  fetchedParts++;
  return new Response(pathname.endsWith('001.bin') ? 'ABC' : 'DEF');
} } };
response = await worker.fetch(new Request(base + '/rock-in-pictures/downloads/all-photos.zip', {method:'HEAD'}), archiveEnv);
assert.equal(response.headers.get('Content-Type'), 'application/zip');
assert.equal(response.headers.get('Content-Length'), '6');
assert.equal(fetchedParts, 0, 'HEAD must not fetch the archive chunks');
response = await worker.fetch(new Request(base + '/rock-in-pictures/downloads/all-photos.zip'), archiveEnv);
assert.equal(await response.text(), 'ABCDEF', 'Chunk boundaries must preserve exact ZIP bytes');
assert.equal(fetchedParts, 2);
assert.match(response.headers.get('Content-Disposition'), /attachment/);
response = await worker.fetch(new Request(base + '/rock-in-pictures/downloads/all-photos.zip', {method:'POST'}), archiveEnv);
assert.equal(response.status, 405);
const brokenEnv = { ASSETS: { fetch: async () => Response.json({parts:[{path:'../private',size:6}],totalBytes:6}) } };
response = await worker.fetch(new Request(base + '/rock-in-pictures/downloads/all-photos.zip'), brokenEnv);
assert.equal(response.status, 503);
console.log('PASS: ZIP streaming byte order, HEAD without chunk transfer, attachment headers, and invalid manifest protection');
