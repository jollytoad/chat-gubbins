import init from "$http_fns/hosting/init_localhost.ts";
import { lazy } from "$http_fns/lazy.ts";
import { getServerUrl } from "$http_fns/server_url.ts";
import { loadKeyAndCert } from "$http_fns/load_key_and_cert.ts";
import handler from "../app/handler.ts";
import generateRoutes from "./gen.ts";

await generateRoutes();

const servers = [];

Deno.env.set("ANON_EDIT", "true");

if (!Deno.env.has("REGISTRY_URL") || Deno.env.has("AHX_START_REGISTRY")) {
  // Env vars persist when restarting via the watcher, so we need to
  // record the fact that we started the registry even though the
  // REGISTRY_URL var was set.
  Deno.env.set("AHX_START_REGISTRY", "true");

  const keyAndCert = await loadKeyAndCert();

  const registryPort = getAvailablePort(8888);
  const registryServer = Deno.serve({
    ...await init(lazy(() => import("$ahx_hub/handler.ts"))),
    port: registryPort,
  });

  servers.push(registryServer.finished);

  Deno.env.set(
    "REGISTRY_URL",
    `${getServerUrl("localhost", registryPort, keyAndCert)}/gubbins`,
  );
}

servers.push(Deno.serve(await init(handler)).finished);

console.log("REGISTRY_URL:", Deno.env.get("REGISTRY_URL"));

await Promise.all(servers);

export function getAvailablePort(preferredPort = 0): number {
  try {
    const listener = Deno.listen({ port: preferredPort });
    listener.close();
    return (listener.addr as Deno.NetAddr).port;
  } catch (e) {
    if (preferredPort !== 0 && e instanceof Deno.errors.AddrInUse) {
      return getAvailablePort();
    } else {
      throw e;
    }
  }
}
