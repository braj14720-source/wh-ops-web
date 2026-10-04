// wh-ops-web — serves the Flutter web build via Workers Static Assets.
//
// All routes are handled by the ASSETS binding (configured in wrangler.toml).
// index.html is served for unknown paths so Flutter's client-side router
// can take over. This Worker code itself does nothing for asset requests.

export default {
  async fetch(request, env) {
    // Try to serve a static asset first.
    const assetResp = await env.ASSETS.fetch(request);
    if (assetResp.status !== 404) return assetResp;

    // For unknown paths under /, serve index.html (SPA fallback).
    const url = new URL(request.url);
    if (url.pathname === '/' || !url.pathname.includes('.')) {
      const indexReq = new Request(new URL('/', url), request);
      return env.ASSETS.fetch(indexReq);
    }

    return assetResp;
  },
};