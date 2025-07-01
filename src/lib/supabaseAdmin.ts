import { createClient } from "@supabase/supabase-js";

const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

if (!url || !serviceKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabaseAdmin = createClient(url, serviceKey);
