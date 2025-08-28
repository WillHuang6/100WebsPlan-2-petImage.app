# Storage上传错误修复指南

## 问题描述
用户上传图片时遇到错误：
```
Storage upload error: new row violates row-level security policy
```

## 解决方案

### 步骤1：登录Supabase Dashboard
访问 https://supabase.com/dashboard/project/[你的项目ID]/storage/buckets

### 步骤2：创建存储桶
如果还没有创建，需要创建以下两个存储桶：

1. **pet-originals** (私有桶)
   - 用途：存储用户上传的原始宠物照片
   - 设置：Private (不勾选 "Public bucket")
   
2. **pet-results** (公开桶)
   - 用途：存储AI生成的结果图片
   - 设置：Public (勾选 "Public bucket")

### 步骤3：设置RLS策略
1. 进入 SQL Editor: https://supabase.com/dashboard/project/[你的项目ID]/sql
2. 执行以下SQL代码：

```sql
-- 确保存储对象表启用RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 删除可能存在的旧策略（如果有）
DROP POLICY IF EXISTS "Users can upload to pet-originals" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own files in pet-originals" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files in pet-originals" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload to pet-results" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view pet-results" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files in pet-results" ON storage.objects;

-- 为 pet-originals 存储桶设置策略
CREATE POLICY "Users can upload to pet-originals" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'pet-originals' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view own files in pet-originals" ON storage.objects
FOR SELECT USING (
  bucket_id = 'pet-originals' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own files in pet-originals" ON storage.objects
FOR DELETE USING (
  bucket_id = 'pet-originals' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 为 pet-results 存储桶设置策略
CREATE POLICY "Users can upload to pet-results" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'pet-results' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view pet-results" ON storage.objects
FOR SELECT USING (bucket_id = 'pet-results');

CREATE POLICY "Users can delete own files in pet-results" ON storage.objects
FOR DELETE USING (
  bucket_id = 'pet-results' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### 步骤4：验证修复
1. 重新部署应用（Vercel会自动处理）
2. 登录用户账户
3. 尝试上传图片并生成AI作品
4. 应该能够成功上传和生成

## 文件路径结构
修复后，文件将按以下结构存储：
```
pet-originals/
  └── [user-id]/
      └── [generation-id]/
          └── original.jpg

pet-results/
  └── [user-id]/
      └── [generation-id]/
          └── result.jpg
```

## 测试检查点
- [ ] 创建了 pet-originals 存储桶（私有）
- [ ] 创建了 pet-results 存储桶（公开）
- [ ] 执行了所有RLS策略SQL
- [ ] 用户可以成功上传图片
- [ ] AI生成功能正常工作
- [ ] 历史记录页面显示图片

如果问题依然存在，请检查：
1. 用户是否已正确登录（有有效的JWT token）
2. 存储桶名称是否与代码中的完全匹配
3. RLS策略是否正确应用（可以在Dashboard中查看）