import init from "$http_fns/hosting/init_deploy.ts";
import handler from "./handler.ts";

await Deno.serve(await init(handler)).finished;
