// 图片处理工具函数

/**
 * 将 File 对象转换为 base64 字符串
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * 将 File 对象转换为 Buffer (Node.js 环境)
 */
export async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

/**
 * 为临时文件生成唯一文件名
 */
export function generateTempFileName(originalName: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const extension = originalName.split('.').pop() || 'jpg'
  return `temp_${timestamp}_${random}.${extension}`
}

/**
 * 验证图片文件类型和大小
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // 检查文件类型
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPG and PNG files are supported' }
  }

  // 检查文件大小 (5MB)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 5MB' }
  }

  return { valid: true }
}

/**
 * 将文件上传到临时存储并返回公开访问的URL
 * 这里使用简单的方法：将图片转换为base64然后通过API返回
 */
export async function uploadTempImage(file: File): Promise<string> {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload-temp', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to upload temp image')
    }

    const data = await response.json()
    return data.url
  } catch (error) {
    console.error('Error uploading temp image:', error)
    throw error
  }
}