// 调试存储上传问题的脚本
// 这个脚本可以帮助我们了解存储路径和用户ID的详细信息

console.log('=== Storage Upload Debug Info ===');

// 模拟我们的存储路径生成逻辑
function generateStoragePath(userId, generationId, filename) {
  return `${userId}/${generationId}/${filename}`
}

// 示例用户ID和生成ID
const exampleUserId = 'abc123-def456-ghi789';
const exampleGenerationId = 'gen_789xyz';
const filename = 'original.jpg';

const path = generateStoragePath(exampleUserId, exampleGenerationId, filename);
console.log('Generated path:', path);

// 模拟foldername函数的行为
function mockFoldername(path) {
  return path.split('/');
}

const folders = mockFoldername(path);
console.log('Folder parts:', folders);
console.log('First folder (should be user ID):', folders[0]);

// 测试RLS条件
console.log('\n=== RLS Policy Test ===');
console.log(`Path: ${path}`);
console.log(`storage.foldername(name): [${folders.map(f => `'${f}'`).join(', ')}]`);
console.log(`(storage.foldername(name))[1]: '${folders[0]}'`);
console.log(`auth.uid()::text should equal: '${exampleUserId}'`);

console.log('\n=== Policy Check ===');
console.log('Condition: auth.uid()::text = (storage.foldername(name))[1]');
console.log(`Becomes: '${exampleUserId}' = '${folders[0]}'`);
console.log(`Result: ${exampleUserId === folders[0]}`);