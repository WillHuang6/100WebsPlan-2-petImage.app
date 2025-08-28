export interface Template {
  id: string
  name: string
  description: string
  prompt: string
  exampleImageUrl: string
  aspectRatio: '3:4' // 后续可扩展为 '1:1' | '3:4' | '16:9' 等
}

export const templates: Template[] = [
  {
    id: 'birthday-cake',
    name: '纪念日蛋糕氛围',
    description: '为你的宠物打造温馨的纪念日庆祝场景',
    prompt: 'A highly realistic photo of the uploaded pet celebrating a birthday. The pet is in the center, wearing a colorful birthday hat, with a birthday cake with candles, balloons, and confetti in the background. The style should be natural and photo-realistic, with sharp details, soft depth of field, and cinematic lighting. Colors should be warm and vibrant, creating a joyful birthday party atmosphere. The pet\'s face must be clear and highly detailed, closely resembling the original photo.',
    exampleImageUrl: '/images/examples/birthday-cake-example.jpg',
    aspectRatio: '3:4'
  },
  {
    id: 'birthday-cake-side',
    name: '纪念日蛋糕氛围（侧面）',
    description: '侧面角度的温馨纪念日场景，烛光柔和照亮',
    prompt: 'A warm and festive anniversary photo featuring the uploaded pet as the main subject. Show the pet in a natural **side view or 3/4 profile angle**, not a full front-facing pose. The pet is wearing a cute birthday or anniversary hat, sitting beside a small celebration cake with candles. The candlelight should softly illuminate the pet\'s face from the side, creating warm highlights and gentle shadows. Add subtle decorations such as balloons, confetti, and a celebratory sign (e.g., "Happy Birthday" or "Happy Anniversary"). The scene should feel cozy, emotional, and joyful, like a treasured keepsake photo. Keep the pet\'s facial details vivid and realistic and smile, ensuring clear resemblance to the original photo. Style: cinematic photography, warm tones, glowing candlelight, clean composition, high resolution, social-media friendly.',
    exampleImageUrl: '/images/examples/birthday-cake-side-example.jpg',
    aspectRatio: '3:4'
  },
  {
    id: 'balloon-bright',
    name: '明亮气球氛围',
    description: '充满活力的彩色气球庆祝场景，展现宠物快乐神情',
    prompt: 'A joyful and heartwarming anniversary photo featuring the uploaded pet as the main subject. The dog should look **happy and cheerful**, with a smiling expression, bright eyes, and a playful, lively mood. The pet is wearing a cute festive accessory (such as a party hat, bow, or collar) and sitting beside a colorful balloon arrangement and a small celebration cake with candles. The atmosphere should feel festive and warm, with pastel balloons, confetti, and gentle lighting that highlights the pet\'s fluffy fur. Ensure the dog\'s likeness is vivid and realistic, keeping the unique facial features and fluffy texture clear. Style: clean, high-resolution, social-media friendly, cozy photography with a cheerful, celebratory vibe.',
    exampleImageUrl: '/images/examples/balloon-bright-example.jpg',
    aspectRatio: '3:4'
  },
  {
    id: 'pet-figure',
    name: '宠物手办',
    description: '将你的宠物制作成精美的收藏手办模型',
    prompt: 'Please turn this photo into a character figure. Behind it, place a box with the character\'s image printed on it. Next to it, add a computer with its screen showing the Blender modeling process. In front of the box, add a round plastic base for the figure and have it stand on it. The PVC material of the base should have a crystal-clear, translucent texture, and set the entire scene indoors.',
    exampleImageUrl: '/images/examples/pet-figure-example.jpg',
    aspectRatio: '3:4'
  }
]

// 根据ID获取模板
export const getTemplateById = (id: string): Template | undefined => {
  return templates.find(template => template.id === id)
}

// 获取所有可用模板
export const getAvailableTemplates = (): Template[] => {
  return templates
}

// 默认模板ID
export const DEFAULT_TEMPLATE_ID = 'birthday-cake'