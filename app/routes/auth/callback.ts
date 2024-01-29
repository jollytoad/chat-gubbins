import { temporaryRedirect } from "$http_fns/response/temporary_redirect.ts";
import { byMethod } from "$http_fns/by_method.ts";
import { withSupabaseClient } from "../../lib/supabase.ts";

export default byMethod({
  GET: withSupabaseClient(async (req, supabase) => {
    const requestUrl = new URL(req.url);
    const code = requestUrl.searchParams.get("code");
    const next = requestUrl.searchParams.get("next");

    if (code) {
      const authResponse = await supabase.auth.exchangeCodeForSession(code);

      console.log(JSON.stringify(authResponse, null, 2));
    }

    return temporaryRedirect(new URL(next || "/", req.url));
  }),
});
