import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

// Client-side Supabase client (uses anon/publishable key — respects RLS policies)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side admin Supabase client (uses service role key — bypasses RLS)
// Set SUPABASE_SERVICE_ROLE_KEY in .env for admin operations
export const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null
