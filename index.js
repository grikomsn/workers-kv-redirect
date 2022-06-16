// @ts-check
/// <reference path="./env.d.ts" />

async function handler(/** @type {FetchEvent} */ event) {
  const url = new URL(event.request.url);
  if (url.pathname == "/") return Response.redirect(BASE_URL, 307);

  if (url.pathname == "/_" && url.searchParams.get("token") == SECRET_TOKEN) {
    const list = await REDIRECTS.list();
    const links = await Promise.all(list.keys.map(async ({ name }) => `${name}\t${await REDIRECTS.get(name)}`));
    return new Response(links.join("\n"));
  }

  const slug = url.pathname.split("/")[1];
  const redirectUrl = await REDIRECTS.get(slug, url.searchParams.has("nocache") ? {} : { cacheTtl: 60 * 5 });
  if (!redirectUrl) return Response.redirect(`${BASE_URL}/${slug}`, 307);
  return Response.redirect(redirectUrl, 307);
}

addEventListener("fetch", async (/** @type {FetchEvent} */ event) => {
  event.respondWith(handler(event));
});
