import { createClient } from "@supabase/supabase-js";
import { Database } from "./types";

const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_API_KEY;
const supabaseURL = process.env.EXPO_PUBLIC_DB_URL;

if (!supabaseKey || !supabaseURL) {
  throw new Error(
    "Missing supabase credentials, please define SUPABASE_API_KEY and DB_SESSION_POOLER_URL in your .env",
  );
}

const supabase = createClient<Database>(supabaseURL, supabaseKey);
export default supabase;
