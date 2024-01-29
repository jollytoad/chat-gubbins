import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./supabase/types.ts";

export type { Database, SupabaseClient };

export interface RequestProps {
  req: Request;
  match?: URLPatternResult;
}

export interface WithSupabase {
  supabase: SupabaseClient<Database>;
}

export type SecurePageProps = RequestProps & WithSupabase;
