// @ts-check
/// <reference path="./env.d.ts" />

async function handler(/** @type {FetchEvent} */ event) {
  const url = new URL(event.request.url);
  if (url.pathname == "/") return Response.redirect(BASE_URL, 307);

  if (url.pathname == "/_") {
    const list = await REDIRECTS.list();
    return new Response(list.keys.reduce((acc, val) => acc + val.name + "\n", ""));
  }

  const slug = url.pathname.split("/")[1];
  const cacheTtl = url.searchParams.has("nocache") ? 0 : 60 * 5;
  const redirectUrl = await REDIRECTS.get(slug, { cacheTtl });
  if (!redirectUrl) return Response.redirect(`${BASE_URL}/${slug}`, 307);
  return Response.redirect(redirectUrl, 307);
}

addEventListener("fetch", async (/** @type {FetchEvent} */ event) => {
  event.respondWith(handler(event));
});
