import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const publicKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !serviceKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabaseAdmin = createClient(url, serviceKey);
export const supabasePublic = createClient(url, publicKey);
