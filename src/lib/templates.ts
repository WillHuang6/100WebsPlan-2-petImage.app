import { createAdminClient } from '@/lib/supabase-server'
import { Template } from '@/config/templates'

interface DatabaseTemplate {
  id: string
  template_key: string
  name: string
  description: string | null
  prompt: string
  example_image_url: string | null
  aspect_ratio: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

// 将数据库模板转换为前端模板格式
function transformDatabaseTemplate(dbTemplate: DatabaseTemplate): Template {
  return {
    id: dbTemplate.template_key,
    name: dbTemplate.name,
    description: dbTemplate.description || '',
    prompt: dbTemplate.prompt,
    exampleImageUrl: dbTemplate.example_image_url || '',
    aspectRatio: dbTemplate.aspect_ratio as '3:4'
  }
}

// 从数据库获取所有活跃模板
export async function getTemplatesFromDatabase(): Promise<{ templates: Template[], error?: string }> {
  try {
    const supabase = createAdminClient()
    
    const { data: templates, error } = await supabase
      .from('templates')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
    
    if (error) {
      console.error('Failed to fetch templates from database:', error)
      return { templates: [], error: error.message }
    }

    if (!templates || templates.length === 0) {
      console.warn('No active templates found in database')
      return { templates: [], error: 'No templates available' }
    }

    const transformedTemplates = templates.map(transformDatabaseTemplate)
    return { templates: transformedTemplates }

  } catch (error: any) {
    console.error('Templates database error:', error)
    return { templates: [], error: error.message }
  }
}

// 静态模板降级方案
const FALLBACK_TEMPLATES_MAP: Record<string, Template> = {
  'birthday-cake': {
    id: 'birthday-cake',
    name: '纪念日蛋糕氛围',
    description: '为你的宠物打造温馨的纪念日庆祝场景',
    prompt: 'A highly realistic photo of the uploaded pet celebrating a birthday. The pet is in the center, wearing a colorful birthday hat, with a birthday cake with candles, balloons, and confetti in the background. The style should be natural and photo-realistic, with sharp details, soft depth of field, and cinematic lighting. Colors should be warm and vibrant, creating a joyful birthday party atmosphere. The pet\'s face must be clear and highly detailed, closely resembling the original photo.',
    exampleImageUrl: '/images/examples/birthday-cake-example.jpg',
    aspectRatio: '3:4'
  },
  'birthday-cake-side': {
    id: 'birthday-cake-side',
    name: '纪念日蛋糕氛围（侧面）',
    description: '侧面角度的温馨纪念日场景，烛光柔和照亮',
    prompt: 'A warm and festive anniversary photo featuring the uploaded pet as the main subject. Show the pet in a natural **side view or 3/4 profile angle**, not a full front-facing pose. The pet is wearing a cute birthday or anniversary hat, sitting beside a small celebration cake with candles. The candlelight should softly illuminate the pet\'s face from the side, creating warm highlights and gentle shadows. Add subtle decorations such as balloons, confetti, and a celebratory sign (e.g., "Happy Birthday" or "Happy Anniversary"). The scene should feel cozy, emotional, and joyful, like a treasured keepsake photo. Keep the pet\'s facial details vivid and realistic and smile, ensuring clear resemblance to the original photo. Style: cinematic photography, warm tones, glowing candlelight, clean composition, high resolution, social-media friendly.',
    exampleImageUrl: '/images/examples/birthday-cake-side-example.jpg',
    aspectRatio: '3:4'
  },
  'balloon-bright': {
    id: 'balloon-bright',
    name: '明亮气球氛围',
    description: '充满活力的彩色气球庆祝场景，展现宠物快乐神情',
    prompt: 'A joyful and heartwarming anniversary photo featuring the uploaded pet as the main subject. The dog should look **happy and cheerful**, with a smiling expression, bright eyes, and a playful, lively mood. The pet is wearing a cute festive accessory (such as a party hat, bow, or collar) and sitting beside a colorful balloon arrangement and a small celebration cake with candles. The atmosphere should feel festive and warm, with pastel balloons, confetti, and gentle lighting that highlights the pet\'s fluffy fur. Ensure the dog\'s likeness is vivid and realistic, keeping the unique facial features and fluffy texture clear. Style: clean, high-resolution, social-media friendly, cozy photography with a cheerful, celebratory vibe.',
    exampleImageUrl: '/images/examples/balloon-bright-example.jpg',
    aspectRatio: '3:4'
  },
  'pet-figure': {
    id: 'pet-figure',
    name: '宠物手办',
    description: '将你的宠物制作成精美的收藏手办模型',
    prompt: 'Please turn this photo into a character figure. Behind it, place a box with the character\'s image printed on it. Next to it, add a computer with its screen showing the Blender modeling process. In front of the box, add a round plastic base for the figure and have it stand on it. The PVC material of the base should have a crystal-clear, translucent texture, and set the entire scene indoors.',
    exampleImageUrl: '/images/examples/pet-figure-example.jpg',
    aspectRatio: '3:4'
  }
}

// 根据template_key获取单个模板
export async function getTemplateByKeyFromDatabase(templateKey: string): Promise<{ template?: Template, error?: string }> {
  try {
    const supabase = createAdminClient()
    
    const { data: template, error } = await supabase
      .from('templates')
      .select('*')
      .eq('template_key', templateKey)
      .eq('is_active', true)
      .single()
    
    if (error) {
      console.warn(`Database fetch failed for template ${templateKey}, using fallback:`, error.message)
      // 数据库查询失败，使用静态模板
      const fallbackTemplate = FALLBACK_TEMPLATES_MAP[templateKey]
      if (fallbackTemplate) {
        return { template: fallbackTemplate }
      }
      return { error: 'Template not found' }
    }

    if (!template) {
      // 数据库中没有找到，尝试静态模板
      const fallbackTemplate = FALLBACK_TEMPLATES_MAP[templateKey]
      if (fallbackTemplate) {
        return { template: fallbackTemplate }
      }
      return { error: 'Template not found' }
    }

    return { template: transformDatabaseTemplate(template) }

  } catch (error: any) {
    console.error('Template database error, using fallback:', error)
    // 发生异常，使用静态模板
    const fallbackTemplate = FALLBACK_TEMPLATES_MAP[templateKey]
    if (fallbackTemplate) {
      return { template: fallbackTemplate }
    }
    return { error: error.message }
  }
}