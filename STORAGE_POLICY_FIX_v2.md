# Storage策略修复 v2 - 索引问题

## 问题分析
PostgreSQL数组索引从1开始，不是从0。我们的策略可能有索引错误。

## 正确的策略设置

### USER-UPLOADS 桶策略：

**策略1 - INSERT权限：**
- Policy name: `Users can upload own files`
- Operation: `INSERT`
- Target roles: `authenticated`
- Policy definition:
```sql
bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]
```

**策略2 - SELECT权限：**
- Policy name: `Users can view own files`
- Operation: `SELECT`
- Target roles: `authenticated`
- Policy definition:
```sql
bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]
```

**策略3 - DELETE权限：**
- Policy name: `Users can delete own files`
- Operation: `DELETE`
- Target roles: `authenticated`
- Policy definition:
```sql
bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]
```

### GENERATED-IMAGES 桶策略：

**策略1 - INSERT权限：**
- Policy name: `Users can upload own files`
- Operation: `INSERT`
- Target roles: `authenticated`
- Policy definition:
```sql
bucket_id = 'generated-images' AND auth.uid()::text = (storage.foldername(name))[1]
```

**策略2 - SELECT权限：**
- Policy name: `Anyone can view files`
- Operation: `SELECT`
- Target roles: `authenticated`, `anon`
- Policy definition:
```sql
bucket_id = 'generated-images'
```

**策略3 - DELETE权限：**
- Policy name: `Users can delete own files`
- Operation: `DELETE`
- Target roles: `authenticated`
- Policy definition:
```sql
bucket_id = 'generated-images' AND auth.uid()::text = (storage.foldername(name))[1]
```

## 如果还不行，尝试简化版本：

### 简化的策略（更宽松）：

**USER-UPLOADS - INSERT:**
```sql
bucket_id = 'user-uploads' AND auth.role() = 'authenticated'
```

**USER-UPLOADS - SELECT:**
```sql
bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]
```

**GENERATED-IMAGES - INSERT:**
```sql
bucket_id = 'generated-images' AND auth.role() = 'authenticated'
```

**GENERATED-IMAGES - SELECT:**
```sql
bucket_id = 'generated-images'
```

## 调试步骤：

1. 删除所有现有策略
2. 先只创建INSERT策略，测试上传
3. 如果成功，再添加SELECT和DELETE策略

## 最简化版本（如果上面都不行）：

暂时使用最宽松的策略来测试：

**所有操作都用这个策略：**
```sql
auth.role() = 'authenticated'
```

这样可以确定是RLS逻辑问题还是其他问题。