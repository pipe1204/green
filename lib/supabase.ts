import { createClient } from "@supabase/supabase-js";

const isTest = process.env.NODE_ENV === "test";
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  (isTest ? "http://localhost:54321" : "");
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || (isTest ? "test-anon-key" : "");

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For server-side operations that need elevated permissions
export const supabaseAdmin =
  process.env.SUPABASE_SERVICE_ROLE_KEY && !isTest
    ? createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null;
