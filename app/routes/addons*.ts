import { renderHTML } from "$http_render_fns/render_html.tsx";
import { interceptResponse } from "$http_fns/intercept.ts";
import { notFound } from "$http_fns/response/not_found.ts";
import { Page } from "../components/Page.tsx";

const FULL_PAGE_HEADER = "AHX-Full-Page";
const BASE_REQ_URL_HEADER = "AHX-Base-Req-URL";

export default interceptResponse(
  registryProxy,
  fullPage,
);

function registryProxy(req: Request, info: URLPatternResult) {
  const registryUrl = Deno.env.get("REGISTRY_URL");

  if (!registryUrl) {
    console.warn("REGISTRY_URL env var not set!");
    return notFound();
  }

  const rest = info.pathname.groups[0] || "";

  const url = new URL(`${registryUrl}${rest}`);
  url.search = info.search.input;

  const { method, body } = req;

  const headers = new Headers(req.headers);
  headers.set(BASE_REQ_URL_HEADER, new URL(basePath(info), req.url).href);

  return fetch(url, { method, headers, body, redirect: "manual" });
}

function basePath({ pathname }: URLPatternResult) {
  return pathname.input.slice(
    0,
    -(pathname.groups?.[0]?.length || 0) || undefined,
  );
}

async function fullPage(req: Request, res: Response | null) {
  if (isHtml(res) && isFullPage(res)) {
    return renderHTML(Page)(req, {
      req,
      // TODO: stream content
      content: await res.text(),
    });
  }
}

function isHtml(res: Response | null): res is Response {
  return res?.headers.get("content-type")?.startsWith("text/html") || false;
}

function isFullPage(res: Response | null): res is Response {
  return res?.headers.has(FULL_PAGE_HEADER) || false;
}
