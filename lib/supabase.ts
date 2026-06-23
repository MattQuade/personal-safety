import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://puyctlnjpsflqdglparn.supabase.co'
const supabaseAnonKey = 'sb_publishable_6eqolRMT7NRbXuXC9DM5FA_2qLtI4hz'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)