import type { RequestProps } from "../types.ts";
import { Page } from "./Page.tsx";

export function AddonPage(props: RequestProps) {
  return (
    <Page {...props}>
      <header ahx-slot="header"></header>
      <main ahx-slot="content"></main>
      <footer ahx-slot="footer"></footer>
    </Page>
  );
}
