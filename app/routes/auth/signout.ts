import { byMethod } from "$http_fns/by_method.ts";
import { withSupabaseClient } from "../../lib/supabase.ts";
import { temporaryRedirect } from "$http_fns/response/temporary_redirect.ts";

export default byMethod({
  GET: withSupabaseClient(async (_req, supabase) => {
    await supabase.auth.signOut();

    return temporaryRedirect("/");
  }),
});
