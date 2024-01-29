import type { Children } from "$jsx/types.ts";
import type { RequestProps } from "../types.ts";

export function Page(
  props: RequestProps & { children?: Children; content?: string },
) {
  return (
    <html lang="en" ahx-host="ref">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Gubbins</title>
        <link
          rel="stylesheet"
          href="https://unpkg.com/missing.css@1.1.1/dist/missing.min.css"
        />
        <link rel="stylesheet" href="/index.css" />

        <script src="/addons/-/index.js" defer />
        <script src="https://ghuc.cc/jollytoad/ahx@v0.1.0/dist/ahx.js" defer />
        <link rel="stylesheet" href="/addons/-/index.css" />
      </head>
      <body
        dangerouslySetInnerHTML={props.content
          ? { __html: props.content }
          : undefined}
      >
        {props?.children}
      </body>
    </html>
  );
}
