import type { SecurePageProps } from "../types.ts";

export function UserWidget(props: SecurePageProps) {
  return (
    <div class="user-widget signed-in">
      <a href="/auth/signout">Sign Out</a>
    </div>
  );
}
