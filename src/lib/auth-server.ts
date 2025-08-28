import { createClient } from '@/lib/supabase-server'
import { User } from '@supabase/supabase-js'

// 从请求中获取认证用户
export async function getAuthUser(): Promise<{ user: User | null; error: string | null }> {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      return { user: null, error: error.message }
    }
    
    if (!user) {
      return { user: null, error: 'User not authenticated' }
    }
    
    return { user, error: null }
  } catch (error: any) {
    return { user: null, error: error.message || 'Authentication failed' }
  }
}

// 验证用户是否已认证 (中间件风格)
export async function requireAuth(): Promise<{ user: User; error: null } | { user: null; error: string }> {
  const { user, error } = await getAuthUser()
  
  if (error || !user) {
    return { user: null, error: error || 'Authentication required' }
  }
  
  return { user, error: null }
}