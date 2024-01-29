import { byMethod } from "$http_fns/by_method.ts";
import type { Provider } from "@supabase/supabase-js";
import { withSupabaseClient } from "../../lib/supabase.ts";
import { plainError } from "$http_fns/response/plain_error.ts";
import { temporaryRedirect } from "$http_fns/response/temporary_redirect.ts";

export default byMethod({
  GET: withSupabaseClient(async (req, supabase) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: Deno.env.get("AUTH_PROVIDER")! as Provider,
      options: {
        redirectTo: new URL("/auth/callback?next=%2Fchat", req.url).href,
        skipBrowserRedirect: true,
      },
    });

    if (error) {
      console.error(error);
      return plainError(500, "Internal Server Error", error.message);
    }

    return temporaryRedirect(data.url);
  }),
});
