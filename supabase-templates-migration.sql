-- ================================================
-- 模板系统数据库迁移脚本
-- 注意：执行前需要先创建 'template-examples' Storage Bucket (public)
-- 并上传示例图片到该bucket
-- ================================================

-- 1. 创建模板表
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_key VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  prompt TEXT NOT NULL,
  example_image_url TEXT,
  aspect_ratio VARCHAR(10) DEFAULT '3:4',
  themes TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 创建索引
CREATE INDEX IF NOT EXISTS idx_templates_active_sort ON templates (is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_templates_key ON templates (template_key);
CREATE INDEX IF NOT EXISTS idx_templates_themes ON templates USING GIN (themes);

-- 3. 创建 Storage Bucket (需要在 Supabase Dashboard 中手动创建)
-- Bucket名称: template-examples
-- 设置为 Public
-- 允许的文件类型: image/jpeg, image/png, image/webp

-- 4. 插入现有模板数据 (使用 Supabase Storage URLs)
INSERT INTO templates (template_key, name, description, prompt, example_image_url, aspect_ratio, themes, sort_order) VALUES
(
  'birthday-cake',
  'Birthday Celebration',
  'Create a warm birthday celebration scene for your pet',
  'A highly realistic photo of the uploaded pet celebrating a birthday. The pet is in the center, wearing a colorful birthday hat, with a birthday cake with candles, balloons, and confetti in the background. The style should be natural and photo-realistic, with sharp details, soft depth of field, and cinematic lighting. Colors should be warm and vibrant, creating a joyful birthday party atmosphere. The pet''s face must be clear and highly detailed, closely resembling the original photo.',
  '/images/examples/birthday-cake-example.jpg',
  '3:4',
  ARRAY['Birthday', 'Holiday'],
  1
),
(
  'birthday-cake-side',
  'Birthday Side View',
  'Side angle birthday celebration with gentle candlelight',
  'A warm and festive anniversary photo featuring the uploaded pet as the main subject. Show the pet in a natural **side view or 3/4 profile angle**, not a full front-facing pose. The pet is wearing a cute birthday or anniversary hat, sitting beside a small celebration cake with candles. The candlelight should softly illuminate the pet''s face from the side, creating warm highlights and gentle shadows. Add subtle decorations such as balloons, confetti, and a celebratory sign (e.g., "Happy Birthday" or "Happy Anniversary"). The scene should feel cozy, emotional, and joyful, like a treasured keepsake photo. Keep the pet''s facial details vivid and realistic and smile, ensuring clear resemblance to the original photo. Style: cinematic photography, warm tones, glowing candlelight, clean composition, high resolution, social-media friendly.',
  '/images/examples/birthday-cake-side-example.jpg',
  '3:4',
  ARRAY['Birthday', 'Portrait'],
  2
),
(
  'balloon-bright',
  'Bright Balloon Party',
  'Vibrant colorful balloon celebration showcasing your pet''s joy',
  'A joyful and heartwarming anniversary photo featuring the uploaded pet as the main subject. The dog should look **happy and cheerful**, with a smiling expression, bright eyes, and a playful, lively mood. The pet is wearing a cute festive accessory (such as a party hat, bow, or collar) and sitting beside a colorful balloon arrangement and a small celebration cake with candles. The atmosphere should feel festive and warm, with pastel balloons, confetti, and gentle lighting that highlights the pet''s fluffy fur. Ensure the dog''s likeness is vivid and realistic, keeping the unique facial features and fluffy texture clear. Style: clean, high-resolution, social-media friendly, cozy photography with a cheerful, celebratory vibe.',
  '/images/examples/balloon-bright-example.jpg',
  '3:4',
  ARRAY['Birthday', 'Fun'],
  3
),
(
  'pet-figure',
  'Pet Figurine',
  'Transform your pet into a collectible figurine model',
  'Please turn this photo into a character figure. Behind it, place a box with the character''s image printed on it. Next to it, add a computer with its screen showing the Blender modeling process. In front of the box, add a round plastic base for the figure and have it stand on it. The PVC material of the base should have a crystal-clear, translucent texture, and set the entire scene indoors.',
  '/images/examples/pet-figure-example.jpg',
  '3:4',
  ARRAY['Artistic', 'Character'],
  4
),
-- Add more diverse templates
(
  'cartoon-style',
  'Cartoon Style',
  'Turn your pet into an adorable cartoon character',
  'Transform the uploaded pet photo into a vibrant cartoon illustration. The style should be colorful, playful, and whimsical with bold outlines, exaggerated features that enhance cuteness, and bright saturated colors. The pet should maintain its key characteristics but with a fun, animated appearance similar to Disney or Pixar style. Add a simple, complementary background that doesn''t distract from the main subject.',
  '/images/examples/cartoon-style-example.jpg',
  '3:4',
  ARRAY['Artistic', 'Fun'],
  5
),
(
  'vintage-portrait',
  'Vintage Portrait',
  'Classic vintage-style portrait of your beloved pet',
  'Create a sophisticated vintage portrait of the uploaded pet in the style of classic oil paintings from the 19th century. Use warm, muted tones with soft lighting and elegant composition. The pet should be posed formally, wearing a vintage collar or accessory if appropriate. The background should be subtle with classic textures, creating a timeless, aristocratic feel.',
  '/images/examples/vintage-portrait-example.jpg',
  '3:4',
  ARRAY['Portrait', 'Artistic'],
  6
),
(
  'superhero',
  'Superhero Pet',
  'Transform your pet into a mighty superhero',
  'Turn the uploaded pet into an epic superhero character. The pet should be wearing a colorful superhero costume with cape flowing in the wind. Place them in a dynamic action pose against a dramatic cityscape background with a heroic sunset. Use bold, cinematic lighting with strong contrasts. The style should be realistic but with comic book-inspired drama and energy.',
  '/images/examples/superhero-example.jpg',
  '3:4',
  ARRAY['Character', 'Fun'],
  7
),
(
  'christmas-theme',
  'Christmas Magic',
  'Festive Christmas celebration with your pet',
  'Create a magical Christmas scene featuring the uploaded pet. The pet should be wearing festive accessories like a Santa hat or reindeer antlers. Surround them with Christmas decorations including a beautifully decorated tree, twinkling lights, wrapped presents, and falling snow. Use warm, cozy lighting that creates a magical holiday atmosphere. The style should be photorealistic with a touch of magical sparkle.',
  '/images/examples/christmas-theme-example.jpg',
  '3:4',
  ARRAY['Holiday', 'Character'],
  8
);

-- 4. 启用行级安全策略 (RLS)
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- 5. 创建策略：允许所有用户读取活跃模板
CREATE POLICY "Allow read active templates" ON templates
  FOR SELECT
  USING (is_active = true);

-- 6. 创建策略：只允许管理员修改模板 (可选，通过service_role执行)
-- CREATE POLICY "Allow admin manage templates" ON templates
--   FOR ALL
--   USING (auth.role() = 'service_role');

-- 7. 创建触发器自动更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_templates_updated_at
    BEFORE UPDATE ON templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- 迁移完成提示
-- ================================================
-- 请在 Supabase Dashboard 中执行此脚本
-- 执行后可以在 Templates 表中看到 4 个预设模板
-- ================================================