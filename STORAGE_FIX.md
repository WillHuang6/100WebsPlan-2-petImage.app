# Storage上传错误修复指南

## 问题描述
用户上传图片时遇到错误：
```
Storage upload error: new row violates row-level security policy
```

## 解决方案 - 通过UI界面操作

### 步骤1：创建存储桶
1. 登录 Supabase Dashboard
2. 访问：https://supabase.com/dashboard/project/[你的项目ID]/storage/buckets
3. 点击 "New bucket" 创建两个桶：

**创建 pet-originals 桶：**
- Name: `pet-originals`  
- ❌ 不勾选 "Public bucket" (保持私有)
- 点击 "Create bucket"

**创建 pet-results 桶：**
- Name: `pet-results`
- ✅ 勾选 "Public bucket" (设为公开)
- 点击 "Create bucket"

### 步骤2：设置Storage策略（通过UI界面）

#### 为 pet-originals 设置策略：
1. 点击 `pet-originals` 桶
2. 进入 "Policies" 标签页
3. 点击 "New policy"
4. 选择 "Custom" 模板
5. 创建以下策略：

**策略1: 允许用户上传到自己的文件夹**
- Policy name: `Users can upload own files`
- Allowed operation: `INSERT`
- Target roles: `authenticated`
- USING expression: 
```sql
auth.uid()::text = (storage.foldername(name))[1]
```

**策略2: 允许用户查看自己的文件**
- Policy name: `Users can view own files`  
- Allowed operation: `SELECT`
- Target roles: `authenticated`
- USING expression:
```sql
auth.uid()::text = (storage.foldername(name))[1]
```

**策略3: 允许用户删除自己的文件**
- Policy name: `Users can delete own files`
- Allowed operation: `DELETE`  
- Target roles: `authenticated`
- USING expression:
```sql
auth.uid()::text = (storage.foldername(name))[1]
```

#### 为 pet-results 设置策略：
1. 点击 `pet-results` 桶
2. 进入 "Policies" 标签页  
3. 点击 "New policy"
4. 创建以下策略：

**策略1: 允许用户上传到自己的文件夹**
- Policy name: `Users can upload own files`
- Allowed operation: `INSERT`
- Target roles: `authenticated`
- USING expression:
```sql
auth.uid()::text = (storage.foldername(name))[1]
```

**策略2: 允许所有人查看文件（公开桶）**
- Policy name: `Anyone can view files`
- Allowed operation: `SELECT`  
- Target roles: `authenticated`, `anon`
- USING expression:
```sql
true
```

**策略3: 允许用户删除自己的文件**
- Policy name: `Users can delete own files`
- Allowed operation: `DELETE`
- Target roles: `authenticated`  
- USING expression:
```sql
auth.uid()::text = (storage.foldername(name))[1]
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