# Supabase Setup Instructions

完整设置Supabase以支持模板系统的步骤。

## 1. 创建Storage Bucket

在Supabase Dashboard中：

1. 进入 **Storage** 页面
2. 点击 **New bucket**
3. 设置以下参数：
   - **Name**: `template-examples`
   - **Public bucket**: ✅ 启用 (必须为public才能直接访问)
   - **File size limit**: `52428800` (50MB)
   - **Allowed MIME types**: 
     - `image/jpeg`
     - `image/png`
     - `image/webp`

## 2. 上传模板示例图片

上传以下图片文件到 `template-examples` bucket：

### 现有图片 (从public/images/examples/复制)
- `birthday-cake.jpg`
- `birthday-cake-side.jpg`
- `balloon-bright.jpg`
- `pet-figure.jpg`

### 新模板占位符图片 (需要创建)
- `cartoon-style.jpg`
- `vintage-portrait.jpg`  
- `superhero.jpg`
- `christmas-theme.jpg`

## 3. 执行数据库迁移

在Supabase Dashboard的 **SQL Editor** 中执行：

```sql
-- 复制并执行 supabase-templates-migration.sql 的全部内容
```

## 4. 更新迁移脚本中的URL

在执行迁移脚本前，需要将脚本中的 `https://your-project.supabase.co` 替换为你的实际Supabase项目URL。

找到你的项目URL：
1. 在Supabase Dashboard中
2. 进入 **Settings** > **API**
3. 复制 **Project URL**
4. 替换迁移脚本中的URL

例如：
```sql
-- 将这个
'https://your-project.supabase.co/storage/v1/object/public/template-examples/birthday-cake.jpg'

-- 替换为
'https://abcdefghijklmnop.supabase.co/storage/v1/object/public/template-examples/birthday-cake.jpg'
```

## 5. 验证设置

执行迁移后，验证：

1. **数据库表**: 检查 `templates` 表是否有8条记录
2. **Storage**: 确认 `template-examples` bucket中有所有图片
3. **URL访问**: 测试图片URL是否可以直接访问

示例测试URL：
```
https://your-project.supabase.co/storage/v1/object/public/template-examples/birthday-cake.jpg
```

## 6. 应用部署

1. 推送代码到GitHub
2. Vercel自动部署
3. 检查网站上的模板图片是否正常显示

## 故障排除

### 图片无法加载
- 检查bucket是否设置为public
- 确认图片文件名和扩展名匹配
- 验证Supabase项目URL是否正确

### 模板数据不显示
- 检查数据库连接
- 确认templates表已创建且有数据
- 查看浏览器开发者工具的网络请求

### 降级模式
如果数据库连接失败，应用会自动使用降级模式：
- 显示占位符图片
- 使用静态模板数据
- 控制台会显示相关警告信息