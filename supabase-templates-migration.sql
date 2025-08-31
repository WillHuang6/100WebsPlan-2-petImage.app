-- ================================================
-- 模板系统数据库迁移脚本
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
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 创建索引
CREATE INDEX IF NOT EXISTS idx_templates_active_sort ON templates (is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_templates_key ON templates (template_key);

-- 3. 插入现有模板数据
INSERT INTO templates (template_key, name, description, prompt, example_image_url, aspect_ratio, sort_order) VALUES
(
  'birthday-cake',
  '纪念日蛋糕氛围',
  '为你的宠物打造温馨的纪念日庆祝场景',
  'A highly realistic photo of the uploaded pet celebrating a birthday. The pet is in the center, wearing a colorful birthday hat, with a birthday cake with candles, balloons, and confetti in the background. The style should be natural and photo-realistic, with sharp details, soft depth of field, and cinematic lighting. Colors should be warm and vibrant, creating a joyful birthday party atmosphere. The pet''s face must be clear and highly detailed, closely resembling the original photo.',
  '/images/examples/birthday-cake-example.jpg',
  '3:4',
  1
),
(
  'birthday-cake-side',
  '纪念日蛋糕氛围（侧面）',
  '侧面角度的温馨纪念日场景，烛光柔和照亮',
  'A warm and festive anniversary photo featuring the uploaded pet as the main subject. Show the pet in a natural **side view or 3/4 profile angle**, not a full front-facing pose. The pet is wearing a cute birthday or anniversary hat, sitting beside a small celebration cake with candles. The candlelight should softly illuminate the pet''s face from the side, creating warm highlights and gentle shadows. Add subtle decorations such as balloons, confetti, and a celebratory sign (e.g., "Happy Birthday" or "Happy Anniversary"). The scene should feel cozy, emotional, and joyful, like a treasured keepsake photo. Keep the pet''s facial details vivid and realistic and smile, ensuring clear resemblance to the original photo. Style: cinematic photography, warm tones, glowing candlelight, clean composition, high resolution, social-media friendly.',
  '/images/examples/birthday-cake-side-example.jpg',
  '3:4',
  2
),
(
  'balloon-bright',
  '明亮气球氛围',
  '充满活力的彩色气球庆祝场景，展现宠物快乐神情',
  'A joyful and heartwarming anniversary photo featuring the uploaded pet as the main subject. The dog should look **happy and cheerful**, with a smiling expression, bright eyes, and a playful, lively mood. The pet is wearing a cute festive accessory (such as a party hat, bow, or collar) and sitting beside a colorful balloon arrangement and a small celebration cake with candles. The atmosphere should feel festive and warm, with pastel balloons, confetti, and gentle lighting that highlights the pet''s fluffy fur. Ensure the dog''s likeness is vivid and realistic, keeping the unique facial features and fluffy texture clear. Style: clean, high-resolution, social-media friendly, cozy photography with a cheerful, celebratory vibe.',
  '/images/examples/balloon-bright-example.jpg',
  '3:4',
  3
),
(
  'pet-figure',
  '宠物手办',
  '将你的宠物制作成精美的收藏手办模型',
  'Please turn this photo into a character figure. Behind it, place a box with the character''s image printed on it. Next to it, add a computer with its screen showing the Blender modeling process. In front of the box, add a round plastic base for the figure and have it stand on it. The PVC material of the base should have a crystal-clear, translucent texture, and set the entire scene indoors.',
  '/images/examples/pet-figure-example.jpg',
  '3:4',
  4
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