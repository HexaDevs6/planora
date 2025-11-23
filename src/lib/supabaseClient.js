// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// Load keys from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a single supabase client for the whole app
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
    },
});
/**
 *  This file initializes the Supabase client once.
 * You can import { supabase } anywhere in your project
 * to access authentication, database, and storage APIs.
 */
if (typeof window !== "undefined") {
    window.supabase = supabase;
}
