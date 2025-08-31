export interface Template {
  id: string
  name: string
  description: string
  prompt: string
  exampleImageUrl: string
  aspectRatio: '3:4' // 后续可扩展为 '1:1' | '3:4' | '16:9' 等
}

// ===================================================================
// 注意: 模板数据已迁移至Supabase数据库
// 这些硬编码模板仅作为备份，实际使用请调用 /api/templates
// ===================================================================

// 根据ID获取模板 (已弃用，请使用数据库API)
export const getTemplateById = (id: string): Template | undefined => {
  console.warn('getTemplateById is deprecated. Use /api/templates or getTemplateByKeyFromDatabase instead')
  return undefined
}

// 获取所有可用模板 (已弃用，请使用数据库API)
export const getAvailableTemplates = (): Template[] => {
  console.warn('getAvailableTemplates is deprecated. Use /api/templates or getTemplatesFromDatabase instead')
  return []
}

// 默认模板ID
export const DEFAULT_TEMPLATE_ID = 'birthday-cake'