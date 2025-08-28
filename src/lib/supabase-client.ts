import { createBrowserClient } from '@supabase/ssr'
import { Database } from './supabase-types'

export function createClient() {
  // 构建时环境变量检查
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key-for-build'

  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseKey
  )
}