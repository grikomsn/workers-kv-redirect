// @ts-check
/// <reference path="./env.d.ts" />

async function handler(/** @type {FetchEvent} */ event) {
  const url = new URL(event.request.url);
  if (url.pathname == "/") return Response.redirect(BASE_URL, 307);

  const slug = url.pathname.split("/")[1];
  if (slug) {
    const redirectUrl = await REDIRECTS.get(slug, { cacheTtl: 60 * 5 });
    if (redirectUrl) return Response.redirect(redirectUrl, 307);
  }

  return Response.redirect(`${BASE_URL}/${slug}`, 307);
}

addEventListener("fetch", async (/** @type {FetchEvent} */ event) => {
  event.respondWith(handler(event));
});
