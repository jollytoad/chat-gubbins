import { renderHTML } from "$http_render_fns/render_html.tsx";
import type { ComponentType } from "$jsx/types.ts";
import type { RequestProps, SupabaseClient, WithSupabase } from "../types.ts";
import { ensureSession, withSupabaseClient } from "./supabase.ts";

export function renderSecure(
  Component: ComponentType<RequestProps & WithSupabase>,
  headers?: HeadersInit,
) {
  return withSupabaseClient(ensureSession(
    (req: Request, supabase: SupabaseClient, match: URLPatternResult) =>
      renderHTML(Component, headers, {
        deferredTimeout: req.headers.has("Ahx-Request") ? false : 10,
      })(req, { req, supabase, match }),
  ));
}
