-- Supabase Storage RLS 策略设置
-- 注意：不要在SQL编辑器中执行此文件！
-- Storage策略需要通过Dashboard UI设置

-- 此文件仅供参考，实际操作请按照 STORAGE_FIX.md 中的UI操作步骤

-- 文件路径结构参考：
-- pet-originals/[user-id]/[generation-id]/original.jpg
-- pet-results/[user-id]/[generation-id]/result.jpg

-- 策略逻辑参考：
-- 1. 用户只能操作自己用户ID文件夹下的文件
-- 2. pet-originals: 私有桶，用户只能访问自己的文件  
-- 3. pet-results: 公开桶，所有人可以查看，但只能删除自己的文件