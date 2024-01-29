import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { deleteCookie, getCookies, setCookie } from "$std/http/cookie.ts";
import { getItem, listItems, removeItem, setItem } from "$store";
import { ulid } from "$std/ulid/mod.ts";
import type { Awaitable } from "$http_fns/types.ts";
import { appendHeaders } from "$http_fns/response/append_headers.ts";
import { unauthorized } from "$http_fns/response/unauthorized.ts";

const KEY_PREFIX = "sb";
const COOKIE_NAME = "sb_session";

export function createSupabaseClient(req: Request, responseHeaders?: Headers) {
  const cookies = getCookies(req.headers);

  let sessionKey = cookies[COOKIE_NAME];

  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    {
      auth: {
        flowType: "pkce",
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: true,
        storage: {
          getItem: async (key) => {
            if (sessionKey) {
              const value = await getItem<string>([
                KEY_PREFIX,
                sessionKey,
                key,
              ]);
              // console.log('getItem', key, '=', value);
              return value ?? null;
            }
            return null;
          },
          setItem: async (key, value) => {
            // console.log('setItem', key, value);

            if (!sessionKey) {
              sessionKey = ulid();

              if (responseHeaders) {
                setCookie(responseHeaders, {
                  name: COOKIE_NAME,
                  value: sessionKey,
                  path: "/",
                  secure: req.url.startsWith("https:"),
                  sameSite: "Lax",
                  httpOnly: true,
                  maxAge: 60 * 60 * 1000,
                });
              }
            }

            await setItem([KEY_PREFIX, sessionKey, key], value);
          },
          removeItem: async (key) => {
            if (sessionKey) {
              // console.log('removeItem', key);
              await removeItem([KEY_PREFIX, sessionKey, key]);

              if (responseHeaders) {
                if (await isEmpty(listItems([KEY_PREFIX, sessionKey]))) {
                  deleteCookie(responseHeaders, COOKIE_NAME);
                }
              }
            }
          },
        },
      },
    },
  );
}

async function isEmpty(iter: AsyncIterable<unknown>) {
  for await (const _item of iter) {
    return false;
  }
  return true;
}

/**
 * Create a Request handler wrapper that supplies a Supabase client to it given handler, and sets appropriate headers on the response.
 *
 * @param handler a Request handler that accepts a Supabase client as it's second arg.
 * @returns a Request handler
 */
export function withSupabaseClient<A extends unknown[]>(
  handler: (
    request: Request,
    supabase: SupabaseClient,
    ...args: A
  ) => Awaitable<Response | null>,
) {
  return async (req: Request, ...args: A) => {
    const responseHeaders = new Headers();
    const supabase = createSupabaseClient(req, responseHeaders);

    const response = await handler(req, supabase, ...args);
    return response ? appendHeaders(response, responseHeaders) : response;
  };
}

/**
 * Create a Request handler wrapper that ensures we have an authenticated Supabase session,
 * otherwise we call the fallback handler, which defaults to a 401 Unauthorized response.
 *
 * @param handler a Request handler that accepts a Supabase client as it's second arg, and expects to have an authenticated session.
 * @returns a Request handler
 */
export function ensureSession<A extends unknown[]>(
  handler: (
    request: Request,
    supabase: SupabaseClient,
    ...args: A
  ) => Awaitable<Response | null>,
  fallback: (
    request: Request,
    supabase: SupabaseClient,
    ...args: A
  ) => Awaitable<Response> = () => unauthorized("Supabase"),
) {
  return async (req: Request, supabase: SupabaseClient, ...args: A) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return fallback(req, supabase, ...args);
    }
    return handler(req, supabase, ...args);
  };
}
