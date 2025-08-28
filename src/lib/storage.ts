import { createClient } from '@/lib/supabase-client'
import { createAdminClient } from '@/lib/supabase-server'

// 上传文件到Supabase Storage
export async function uploadToStorage(
  file: File | Blob,
  bucket: string,
  path: string
): Promise<{ url: string | null; error: string | null }> {
  // 使用管理员客户端绕过RLS
  const supabase = createAdminClient()
  
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Storage upload error:', error)
      return { url: null, error: error.message }
    }

    // 获取公开URL (仅对public bucket有效)
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    return { url: urlData.publicUrl, error: null }
  } catch (error: any) {
    console.error('Storage upload exception:', error)
    return { url: null, error: error.message }
  }
}

// 从URL下载文件并转换为Blob
export async function downloadFileAsBlob(url: string): Promise<Blob | null> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`)
    }
    return await response.blob()
  } catch (error) {
    console.error('Failed to download file as blob:', error)
    return null
  }
}

// 生成文件路径
export function generateStoragePath(userId: string, generationId: string, filename: string): string {
  return `${userId}/${generationId}/${filename}`
}

// 从Storage URL提取路径
export function extractPathFromStorageUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/public\/[^\/]+\/(.+)$/)
    return pathMatch ? pathMatch[1] : null
  } catch {
    return null
  }
}