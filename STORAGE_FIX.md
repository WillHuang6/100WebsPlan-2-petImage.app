# Storage上传错误修复指南

## 问题描述
用户上传图片时遇到错误：
```
Storage upload error: new row violates row-level security policy
```

## 解决方案 - 使用现有存储桶

### 步骤1：确认现有存储桶设置
你已经有了两个存储桶，我们直接使用它们：

**现有的 user-uploads 桶：**
- 用途：存储用户上传的原始宠物照片
- 设置：应该是私有桶 (如果是公开桶请改为私有)

**现有的 generated-images 桶：**
- 用途：存储AI生成的结果图片  
- 设置：应该是公开桶 (如果不是公开桶请改为公开)

### 步骤2：设置Storage策略（通过UI界面）

#### 为 user-uploads 桶设置策略：
1. 点击 `user-uploads` 桶
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

#### 为 generated-images 桶设置策略：
1. 点击 `generated-images` 桶
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
user-uploads/
  └── [user-id]/
      └── [generation-id]/
          └── original.jpg

generated-images/
  └── [user-id]/
      └── [generation-id]/
          └── result.jpg
```

## 测试检查点
- [ ] 确认 user-uploads 存储桶设置为私有
- [ ] 确认 generated-images 存储桶设置为公开
- [ ] 为 user-uploads 桶设置了3个RLS策略
- [ ] 为 generated-images 桶设置了3个RLS策略
- [ ] 用户可以成功上传图片
- [ ] AI生成功能正常工作
- [ ] 历史记录页面显示图片

如果问题依然存在，请检查：
1. 用户是否已正确登录（有有效的JWT token）
2. 存储桶名称是否与代码中的完全匹配
3. RLS策略是否正确应用（可以在Dashboard中查看）