import { temporaryRedirect } from "$http_fns/response/temporary_redirect.ts";

/**
 * A ResponseInterceptor that will catch an Unauthorized response and redirect the user to the login page
 */
export function unauthorizedRedirect(location: string, challenge?: string) {
  return (_req: unknown, res: Response | null) =>
    res?.status === 401 &&
      (challenge ? res?.headers.get("WWW-Authenticate") === challenge : true)
      ? temporaryRedirect(location, res.headers)
      : undefined;
}
