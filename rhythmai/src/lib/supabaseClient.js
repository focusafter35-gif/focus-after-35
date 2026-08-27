import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseConfigured = !!(url && anonKey)

// When no project is configured yet (e.g. running the old local-only build),
// `supabase` stays null and callers fall back to local-only behavior instead
// of crashing on import.
export const supabase = supabaseConfigured ? createClient(url, anonKey) : null
