const PREFIX = '/rock-in-pictures';
const ARCHIVE_PATH = '/downloads/all-photos.zip';

async function downloadArchive(request, env) {
  if (!['GET', 'HEAD'].includes(request.method)) {
    return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
  }
  const assetUrl = new URL(request.url);
  assetUrl.pathname = '/downloads/manifest.json';
  assetUrl.search = '';
  const manifestResponse = await env.ASSETS.fetch(new Request(assetUrl));
  if (!manifestResponse.ok) return new Response('Download temporarily unavailable', { status: 503 });
  const manifest = await manifestResponse.json();
  const parts = manifest.parts;
  if (!Array.isArray(parts) || !parts.length || parts.length > 100 ||
      !parts.every(p => /^downloads\/parts\/[a-f0-9]{12}-\d{3}\.bin$/.test(p.path) && Number.isSafeInteger(p.size) && p.size > 0) ||
      !Number.isSafeInteger(manifest.totalBytes) || parts.reduce((n, p) => n + p.size, 0) !== manifest.totalBytes) {
    return new Response('Download temporarily unavailable', { status: 503 });
  }
  const headers = {
    'Content-Type': 'application/zip',
    'Content-Disposition': 'attachment; filename="sound-in-sight-60-photos.zip"',
    'Content-Length': String(manifest.totalBytes),
    'Cache-Control': 'public, max-age=0, must-revalidate',
    'X-Content-Type-Options': 'nosniff'
  };
  if (request.method === 'HEAD') return new Response(null, { headers });
  let index = 0;
  let reader;
  const body = new ReadableStream({
    async pull(controller) {
      try {
        while (true) {
          if (!reader) {
            if (index === parts.length) { controller.close(); return; }
            assetUrl.pathname = '/' + parts[index++].path;
            const response = await env.ASSETS.fetch(new Request(assetUrl));
            if (!response.ok || !response.body) throw new Error('Archive part unavailable');
            reader = response.body.getReader();
          }
          const { value, done } = await reader.read();
          if (done) { reader.releaseLock(); reader = undefined; continue; }
          controller.enqueue(value);
          return;
        }
      } catch (error) { controller.error(error); }
    },
    cancel(reason) { return reader?.cancel(reason); }
  });
  return new Response(body, { headers });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === PREFIX) {
      url.pathname += '/';
      return Response.redirect(url.href, 308);
    }
    if (!url.pathname.startsWith(PREFIX + '/')) return new Response('Not found', { status: 404 });
    url.pathname = url.pathname.slice(PREFIX.length);
    if (url.pathname === ARCHIVE_PATH) return downloadArchive(request, env);
    const response = await env.ASSETS.fetch(new Request(url, request));
    const location = response.headers.get('Location');
    if (!location) return response;
    const target = new URL(location, url);
    if (target.origin !== url.origin) return response;
    target.pathname = PREFIX + target.pathname;
    const redirected = new Response(response.body, response);
    redirected.headers.set('Location', target.href);
    return redirected;
  }
};
