const PREFIX = '/rock-in-pictures';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === PREFIX) {
      url.pathname += '/';
      return Response.redirect(url.href, 308);
    }
    if (!url.pathname.startsWith(PREFIX + '/')) {
      return new Response('Not found', { status: 404 });
    }
    url.pathname = url.pathname.slice(PREFIX.length);
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
