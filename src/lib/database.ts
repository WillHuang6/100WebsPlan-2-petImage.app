import { createClient } from '@/lib/supabase-server'

// 简化的类型定义，避免复杂的 TypeScript 推断问题
interface GenerationData {
  id?: string
  user_id: string
  template_id: string
  original_image_url: string
  generated_image_url?: string | null
  status?: string
  error_message?: string | null
  share_token?: string | null
  is_public?: boolean
  created_at?: string
  expires_at?: string
}

// 创建新的generation记录
export async function createGeneration(
  data: Partial<GenerationData>
): Promise<{ generation: any | null; error: string | null }> {
  try {
    const supabase = await createClient()
    
    // 直接使用 any 类型避免 TypeScript 推断问题
    const { data: generation, error } = await (supabase as any)
      .from('generations')
      .insert([data])
      .select()
      .single()
    
    if (error) {
      console.error('Database insert error:', error)
      return { generation: null, error: error.message }
    }
    
    return { generation, error: null }
  } catch (error: any) {
    console.error('Database insert exception:', error)
    return { generation: null, error: error.message }
  }
}

// 更新generation记录
export async function updateGeneration(
  id: string,
  updates: Partial<GenerationData>
): Promise<{ generation: any | null; error: string | null }> {
  try {
    const supabase = await createClient()
    
    const { data: generation, error } = await (supabase as any)
      .from('generations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Database update error:', error)
      return { generation: null, error: error.message }
    }
    
    return { generation, error: null }
  } catch (error: any) {
    console.error('Database update exception:', error)
    return { generation: null, error: error.message }
  }
}

// 获取单个generation记录
export async function getGeneration(
  id: string
): Promise<{ generation: any | null; error: string | null }> {
  try {
    const supabase = await createClient()
    
    const { data: generation, error } = await (supabase as any)
      .from('generations')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Database select error:', error)
      return { generation: null, error: error.message }
    }
    
    return { generation, error: null }
  } catch (error: any) {
    console.error('Database select exception:', error)
    return { generation: null, error: error.message }
  }
}

// 获取用户的generations列表
export async function getUserGenerations(
  userId: string,
  limit: number = 50
): Promise<{ generations: any[]; error: string | null }> {
  try {
    const supabase = await createClient()
    
    const { data: generations, error } = await (supabase as any)
      .from('generations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) {
      console.error('Database select error:', error)
      return { generations: [], error: error.message }
    }
    
    return { generations: generations || [], error: null }
  } catch (error: any) {
    console.error('Database select exception:', error)
    return { generations: [], error: error.message }
  }
}

// 生成唯一的分享token
export function generateShareToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}