-- Supabase Storage RLS 策略设置
-- 需要在Supabase SQL编辑器中执行

-- 1. 创建存储桶（如果还没有创建）
-- 这些需要在Supabase Dashboard > Storage 中手动创建：
-- - pet-originals (私有桶) - 存储用户上传的原始宠物照片
-- - pet-results (公开桶) - 存储AI生成的结果图片

-- 注意：创建桶时的设置
-- pet-originals: Private (不公开访问)
-- pet-results: Public (允许公开访问)

-- 2. 为 pet-originals 存储桶设置RLS策略
-- 允许已登录用户上传文件到自己的文件夹
CREATE POLICY "Users can upload to pet-originals" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'pet-originals' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 允许已登录用户查看自己的文件
CREATE POLICY "Users can view own files in pet-originals" ON storage.objects
FOR SELECT USING (
  bucket_id = 'pet-originals' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 允许已登录用户删除自己的文件  
CREATE POLICY "Users can delete own files in pet-originals" ON storage.objects
FOR DELETE USING (
  bucket_id = 'pet-originals' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 3. 为 pet-results 存储桶设置RLS策略
-- 允许已登录用户上传文件到自己的文件夹
CREATE POLICY "Users can upload to pet-results" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'pet-results' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 允许所有人查看结果图片（因为这是公开桶）
CREATE POLICY "Anyone can view pet-results" ON storage.objects
FOR SELECT USING (bucket_id = 'pet-results');

-- 允许已登录用户删除自己的结果文件
CREATE POLICY "Users can delete own files in pet-results" ON storage.objects
FOR DELETE USING (
  bucket_id = 'pet-results' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 4. 确保存储桶的RLS是启用的
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;