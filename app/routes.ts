// IMPORTANT: This file has been automatically generated, DO NOT edit by hand.

import { byPattern } from "$http_fns/by_pattern.ts";
import { cascade } from "$http_fns/cascade.ts";
import { lazy } from "$http_fns/lazy.ts";

export default cascade(
  byPattern("/chat/openai/prompt", lazy(() => import("./routes/chat/openai/prompt.tsx"))),
  byPattern("/chat", lazy(() => import("./routes/chat.ts"))),
  byPattern("/auth/signout", lazy(() => import("./routes/auth/signout.ts"))),
  byPattern("/auth/signin", lazy(() => import("./routes/auth/signin.ts"))),
  byPattern("/auth/callback", lazy(() => import("./routes/auth/callback.ts"))),
  byPattern("/addons*", lazy(() => import("./routes/addons*.ts"))),
  byPattern("/", lazy(() => import("./routes/index.ts"))),
);
