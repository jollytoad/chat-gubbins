import type { RequestProps } from "../types.ts";
import { Page } from "./Page.tsx";

export function HomePage(props: RequestProps) {
  return (
    <Page {...props}>
      <main>
        <p>
          <a href="/chat">Start chatting</a>
        </p>
      </main>
    </Page>
  );
}
