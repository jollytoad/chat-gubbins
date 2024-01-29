import type { Database, SupabaseClient } from "../types.ts";

export async function getProfileForCurrentUser(
  supabase: SupabaseClient<Database>,
) {
  return (await supabase.from("profiles").select("*").single()).data ??
    undefined;
}
