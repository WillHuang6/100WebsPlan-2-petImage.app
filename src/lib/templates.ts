import { createAdminClient } from '@/lib/supabase-server'
import { Template, Theme } from '@/config/templates'
import { TEMPLATE_IMAGE_URLS } from '@/lib/image-urls'

interface DatabaseTemplate {
  id: string
  template_key: string
  name: string
  description: string | null
  prompt: string
  example_image_url: string | null
  aspect_ratio: string
  themes: string[]
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
    aspectRatio: dbTemplate.aspect_ratio as '3:4',
    themes: dbTemplate.themes || []
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

// 静态模板降级方案 (English content with themes and Supabase URLs)
const FALLBACK_TEMPLATES_MAP: Record<string, Template> = {
  'birthday-cake': {
    id: 'birthday-cake',
    name: 'Birthday Celebration',
    description: 'Create a warm birthday celebration scene for your pet',
    prompt: 'A highly realistic photo of the uploaded pet celebrating a birthday. The pet is in the center, wearing a colorful birthday hat, with a birthday cake with candles, balloons, and confetti in the background. The style should be natural and photo-realistic, with sharp details, soft depth of field, and cinematic lighting. Colors should be warm and vibrant, creating a joyful birthday party atmosphere. The pet\'s face must be clear and highly detailed, closely resembling the original photo.',
    exampleImageUrl: TEMPLATE_IMAGE_URLS['birthday-cake'],
    aspectRatio: '3:4',
    themes: ['Birthday', 'Holiday']
  },
  'birthday-cake-side': {
    id: 'birthday-cake-side',
    name: 'Birthday Side View',
    description: 'Side angle birthday celebration with gentle candlelight',
    prompt: 'A warm and festive anniversary photo featuring the uploaded pet as the main subject. Show the pet in a natural **side view or 3/4 profile angle**, not a full front-facing pose. The pet is wearing a cute birthday or anniversary hat, sitting beside a small celebration cake with candles. The candlelight should softly illuminate the pet\'s face from the side, creating warm highlights and gentle shadows. Add subtle decorations such as balloons, confetti, and a celebratory sign (e.g., "Happy Birthday" or "Happy Anniversary"). The scene should feel cozy, emotional, and joyful, like a treasured keepsake photo. Keep the pet\'s facial details vivid and realistic and smile, ensuring clear resemblance to the original photo. Style: cinematic photography, warm tones, glowing candlelight, clean composition, high resolution, social-media friendly.',
    exampleImageUrl: TEMPLATE_IMAGE_URLS['birthday-cake-side'],
    aspectRatio: '3:4',
    themes: ['Birthday', 'Portrait']
  },
  'balloon-bright': {
    id: 'balloon-bright',
    name: 'Bright Balloon Party',
    description: 'Vibrant colorful balloon celebration showcasing your pet\'s joy',
    prompt: 'A joyful and heartwarming anniversary photo featuring the uploaded pet as the main subject. The dog should look **happy and cheerful**, with a smiling expression, bright eyes, and a playful, lively mood. The pet is wearing a cute festive accessory (such as a party hat, bow, or collar) and sitting beside a colorful balloon arrangement and a small celebration cake with candles. The atmosphere should feel festive and warm, with pastel balloons, confetti, and gentle lighting that highlights the pet\'s fluffy fur. Ensure the dog\'s likeness is vivid and realistic, keeping the unique facial features and fluffy texture clear. Style: clean, high-resolution, social-media friendly, cozy photography with a cheerful, celebratory vibe.',
    exampleImageUrl: TEMPLATE_IMAGE_URLS['balloon-bright'],
    aspectRatio: '3:4',
    themes: ['Birthday', 'Fun']
  },
  'pet-figure': {
    id: 'pet-figure',
    name: 'Pet Figurine',
    description: 'Transform your pet into a collectible figurine model',
    prompt: 'Please turn this photo into a character figure. Behind it, place a box with the character\'s image printed on it. Next to it, add a computer with its screen showing the Blender modeling process. In front of the box, add a round plastic base for the figure and have it stand on it. The PVC material of the base should have a crystal-clear, translucent texture, and set the entire scene indoors.',
    exampleImageUrl: TEMPLATE_IMAGE_URLS['pet-figure'],
    aspectRatio: '3:4',
    themes: ['Artistic', 'Character']
  },
  'cartoon-style': {
    id: 'cartoon-style',
    name: 'Cartoon Style',
    description: 'Turn your pet into an adorable cartoon character',
    prompt: 'Transform the uploaded pet photo into a vibrant cartoon illustration. The style should be colorful, playful, and whimsical with bold outlines, exaggerated features that enhance cuteness, and bright saturated colors. The pet should maintain its key characteristics but with a fun, animated appearance similar to Disney or Pixar style. Add a simple, complementary background that doesn\'t distract from the main subject.',
    exampleImageUrl: TEMPLATE_IMAGE_URLS['cartoon-style'],
    aspectRatio: '3:4',
    themes: ['Artistic', 'Fun']
  },
  'vintage-portrait': {
    id: 'vintage-portrait',
    name: 'Vintage Portrait',
    description: 'Classic vintage-style portrait of your beloved pet',
    prompt: 'Create a sophisticated vintage portrait of the uploaded pet in the style of classic oil paintings from the 19th century. Use warm, muted tones with soft lighting and elegant composition. The pet should be posed formally, wearing a vintage collar or accessory if appropriate. The background should be subtle with classic textures, creating a timeless, aristocratic feel.',
    exampleImageUrl: TEMPLATE_IMAGE_URLS['vintage-portrait'],
    aspectRatio: '3:4',
    themes: ['Portrait', 'Artistic']
  },
  'superhero': {
    id: 'superhero',
    name: 'Superhero Pet',
    description: 'Transform your pet into a mighty superhero',
    prompt: 'Turn the uploaded pet into an epic superhero character. The pet should be wearing a colorful superhero costume with cape flowing in the wind. Place them in a dynamic action pose against a dramatic cityscape background with a heroic sunset. Use bold, cinematic lighting with strong contrasts. The style should be realistic but with comic book-inspired drama and energy.',
    exampleImageUrl: TEMPLATE_IMAGE_URLS['superhero'],
    aspectRatio: '3:4',
    themes: ['Character', 'Fun']
  },
  'christmas-theme': {
    id: 'christmas-theme',
    name: 'Christmas Magic',
    description: 'Festive Christmas celebration with your pet',
    prompt: 'Create a magical Christmas scene featuring the uploaded pet. The pet should be wearing festive accessories like a Santa hat or reindeer antlers. Surround them with Christmas decorations including a beautifully decorated tree, twinkling lights, wrapped presents, and falling snow. Use warm, cozy lighting that creates a magical holiday atmosphere. The style should be photorealistic with a touch of magical sparkle.',
    exampleImageUrl: TEMPLATE_IMAGE_URLS['christmas-theme'],
    aspectRatio: '3:4',
    themes: ['Holiday', 'Character']
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

// 从模板数组中提取所有可用主题
export function extractThemesFromTemplates(templates: Template[]): Theme[] {
  const themeMap = new Map<string, number>()
  
  // 统计每个主题的出现次数
  templates.forEach(template => {
    template.themes.forEach(theme => {
      themeMap.set(theme, (themeMap.get(theme) || 0) + 1)
    })
  })
  
  // 转换为主题对象数组，按名称排序
  const themes: Theme[] = Array.from(themeMap.entries())
    .map(([name, count]) => ({
      id: name.toLowerCase(),
      name,
      count,
      icon: getThemeIcon(name)
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
  
  return themes
}

// 获取主题图标
function getThemeIcon(themeName: string): string {
  const iconMap: Record<string, string> = {
    'Birthday': '🎂',
    'Holiday': '🎉', 
    'Portrait': '📷',
    'Artistic': '🎨',
    'Character': '🎭',
    'Fun': '😄',
  }
  
  return iconMap[themeName] || '✨'
}