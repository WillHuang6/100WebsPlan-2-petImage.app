import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'
import { Template, Theme } from '@/config/templates'
import { extractThemesFromTemplates } from '@/lib/templates'

// 缓存5分钟
export const revalidate = 300

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
    id: dbTemplate.template_key, // 使用template_key作为前端id
    name: dbTemplate.name,
    description: dbTemplate.description || '',
    prompt: dbTemplate.prompt,
    exampleImageUrl: dbTemplate.example_image_url || '',
    aspectRatio: dbTemplate.aspect_ratio as '3:4',
    themes: dbTemplate.themes || []
  }
}

// 静态模板作为降级方案 (English content with themes)
const FALLBACK_TEMPLATES: Template[] = [
  {
    id: 'birthday-cake',
    name: 'Birthday Celebration',
    description: 'Create a warm birthday celebration scene for your pet',
    prompt: 'A highly realistic photo of the uploaded pet celebrating a birthday. The pet is in the center, wearing a colorful birthday hat, with a birthday cake with candles, balloons, and confetti in the background. The style should be natural and photo-realistic, with sharp details, soft depth of field, and cinematic lighting. Colors should be warm and vibrant, creating a joyful birthday party atmosphere. The pet\'s face must be clear and highly detailed, closely resembling the original photo.',
    exampleImageUrl: '/images/examples/birthday-cake-example.jpg',
    aspectRatio: '3:4',
    themes: ['Birthday', 'Holiday']
  },
  {
    id: 'birthday-cake-side',
    name: 'Birthday Side View',
    description: 'Side angle birthday celebration with gentle candlelight',
    prompt: 'A warm and festive anniversary photo featuring the uploaded pet as the main subject. Show the pet in a natural **side view or 3/4 profile angle**, not a full front-facing pose. The pet is wearing a cute birthday or anniversary hat, sitting beside a small celebration cake with candles. The candlelight should softly illuminate the pet\'s face from the side, creating warm highlights and gentle shadows. Add subtle decorations such as balloons, confetti, and a celebratory sign (e.g., "Happy Birthday" or "Happy Anniversary"). The scene should feel cozy, emotional, and joyful, like a treasured keepsake photo. Keep the pet\'s facial details vivid and realistic and smile, ensuring clear resemblance to the original photo. Style: cinematic photography, warm tones, glowing candlelight, clean composition, high resolution, social-media friendly.',
    exampleImageUrl: '/images/examples/birthday-cake-side-example.jpg',
    aspectRatio: '3:4',
    themes: ['Birthday', 'Portrait']
  },
  {
    id: 'balloon-bright',
    name: 'Bright Balloon Party',
    description: 'Vibrant colorful balloon celebration showcasing your pet\'s joy',
    prompt: 'A joyful and heartwarming anniversary photo featuring the uploaded pet as the main subject. The dog should look **happy and cheerful**, with a smiling expression, bright eyes, and a playful, lively mood. The pet is wearing a cute festive accessory (such as a party hat, bow, or collar) and sitting beside a colorful balloon arrangement and a small celebration cake with candles. The atmosphere should feel festive and warm, with pastel balloons, confetti, and gentle lighting that highlights the pet\'s fluffy fur. Ensure the dog\'s likeness is vivid and realistic, keeping the unique facial features and fluffy texture clear. Style: clean, high-resolution, social-media friendly, cozy photography with a cheerful, celebratory vibe.',
    exampleImageUrl: '/images/examples/balloon-bright-example.jpg',
    aspectRatio: '3:4',
    themes: ['Birthday', 'Fun']
  },
  {
    id: 'pet-figure',
    name: 'Pet Figurine',
    description: 'Transform your pet into a collectible figurine model',
    prompt: 'Please turn this photo into a character figure. Behind it, place a box with the character\'s image printed on it. Next to it, add a computer with its screen showing the Blender modeling process. In front of the box, add a round plastic base for the figure and have it stand on it. The PVC material of the base should have a crystal-clear, translucent texture, and set the entire scene indoors.',
    exampleImageUrl: '/images/examples/pet-figure-example.jpg',
    aspectRatio: '3:4',
    themes: ['Artistic', 'Character']
  }
]

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    
    // 尝试从数据库获取模板
    const { data: templates, error } = await supabase
      .from('templates')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
    
    if (error) {
      console.warn('Database fetch failed, using fallback templates:', error.message)
      // 数据库连接失败或表不存在，使用静态模板
      const fallbackThemes = extractThemesFromTemplates(FALLBACK_TEMPLATES)
      return NextResponse.json({
        success: true,
        templates: FALLBACK_TEMPLATES,
        themes: fallbackThemes,
        count: FALLBACK_TEMPLATES.length,
        source: 'fallback'
      }, {
        headers: {
          'Cache-Control': 'public, max-age=60, s-maxage=60', // 降级时缩短缓存
        }
      })
    }

    if (!templates || templates.length === 0) {
      console.warn('No active templates found in database, using fallback')
      const fallbackThemes = extractThemesFromTemplates(FALLBACK_TEMPLATES)
      return NextResponse.json({
        success: true,
        templates: FALLBACK_TEMPLATES,
        themes: fallbackThemes,
        count: FALLBACK_TEMPLATES.length,
        source: 'fallback'
      }, {
        headers: {
          'Cache-Control': 'public, max-age=60, s-maxage=60',
        }
      })
    }

    // 转换为前端格式
    const transformedTemplates: Template[] = templates.map(transformDatabaseTemplate)
    
    // 提取主题信息
    const themes: Theme[] = extractThemesFromTemplates(transformedTemplates)

    console.log(`Successfully fetched ${transformedTemplates.length} templates from database`)
    
    return NextResponse.json({
      success: true,
      templates: transformedTemplates,
      themes: themes,
      count: transformedTemplates.length,
      source: 'database'
    }, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=300', // 5分钟缓存
      }
    })

  } catch (error: any) {
    console.error('Templates API error, using fallback:', error)
    // 完全错误时使用静态模板
    const fallbackThemes = extractThemesFromTemplates(FALLBACK_TEMPLATES)
    return NextResponse.json({
      success: true,
      templates: FALLBACK_TEMPLATES,
      themes: fallbackThemes,
      count: FALLBACK_TEMPLATES.length,
      source: 'fallback'
    }, {
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=60',
      }
    })
  }
}

// 支持CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}