import { byMethod } from "$http_fns/by_method.ts";
import { ChatPage } from "../components/ChatPage.tsx";
import { renderSecure } from "../lib/render.ts";

export default byMethod({
  GET: renderSecure(ChatPage),
});
