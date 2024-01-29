import type { RequestProps } from "../types.ts";

export function asRequestProps(
  req: Request,
  match: URLPatternResult,
): RequestProps {
  return { req, match };
}
