import type { SecurePageProps } from "../types.ts";
import { Page } from "./Page.tsx";
import { UserWidget } from "./UserWidget.tsx";

export function ChatPage(props: SecurePageProps) {
  return (
    <Page {...props}>
      <header>
        <span>chat</span>
        <UserWidget {...props} />
      </header>

      <main>
        <div id="output" ahx-slot-name="output"></div>
      </main>

      <footer>
        <form id="prompt" ahx-slot-name="prompt">
          <textarea name="prompt" placeholder="Talk to me"></textarea>
          <button
            type="button"
            ahx-trigger="click"
            ahx-post="/chat/openai/prompt"
            ahx-include="#prompt"
            ahx-target="#output"
            ahx-swap="beforeEnd"
          >
            Submit
          </button>
        </form>
      </footer>
    </Page>
  );
}
