import { staticRoute } from "$http_fns/static_route.ts";
import routes from "./routes.ts";
import { cascade } from "$http_fns/cascade.ts";
import { interceptResponse } from "$http_fns/intercept.ts";
import { unauthorizedRedirect } from "./lib/unauthorized_redirect.ts";

export default cascade(
  interceptResponse(
    routes,
    unauthorizedRedirect("/auth/signin", "Supabase"),
  ),
  staticRoute("/", import.meta.resolve("./static")),
);
