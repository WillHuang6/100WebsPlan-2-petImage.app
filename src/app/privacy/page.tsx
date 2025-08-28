export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">隐私政策</h1>
            <p className="text-gray-600">最后更新：2024年8月28日</p>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. 简介</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              PetImage 尊重并保护用户隐私。本隐私政策解释了我们如何收集、使用、存储和保护您的个人信息。使用我们的服务即表示您同意本政策描述的数据处理方式。
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. 我们收集的信息</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">2.1 账户信息</h3>
            <ul className="mb-4 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>电子邮箱地址（用于账户创建和登录）</li>
              <li>显示名称（可选）</li>
              <li>账户创建和最后登录时间</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">2.2 上传内容</h3>
            <ul className="mb-4 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>您上传的宠物图像</li>
              <li>AI生成的艺术图像</li>
              <li>生成历史记录和偏好设置</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">2.3 使用数据</h3>
            <ul className="mb-6 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>服务使用频率和模式</li>
              <li>设备信息（浏览器类型、操作系统）</li>
              <li>IP地址和访问日志</li>
              <li>错误报告和性能数据</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. 信息使用目的</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">我们使用收集的信息用于：</p>
            <ul className="mb-6 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>提供和维护AI图像生成服务</li>
              <li>处理和改进AI模型性能</li>
              <li>用户身份验证和账户管理</li>
              <li>客户支持和技术问题解决</li>
              <li>服务优化和新功能开发</li>
              <li>防止欺诈和滥用</li>
              <li>遵守法律法规要求</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. 数据存储和安全</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">4.1 存储期限</h3>
            <ul className="mb-4 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>原始上传图像：处理完成后7天内自动删除</li>
              <li>生成的AI图像：用户可选择保存到个人账户</li>
              <li>账户数据：账户活跃期间保留，删除账户后清除</li>
              <li>使用日志：保留90天用于服务优化</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">4.2 安全措施</h3>
            <ul className="mb-6 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>使用HTTPS加密传输所有数据</li>
              <li>数据存储在安全的云服务提供商</li>
              <li>定期进行安全审计和更新</li>
              <li>访问控制和权限管理</li>
              <li>数据备份和灾难恢复计划</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. 数据共享</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">我们不会出售、出租或交易您的个人信息。仅在以下情况下可能共享数据：</p>
            <ul className="mb-6 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>获得您的明确同意</li>
              <li>与可信的第三方服务提供商（如云存储、支付处理）</li>
              <li>法律要求或政府部门要求</li>
              <li>保护我们的权利和安全</li>
              <li>业务转让或合并（将提前通知）</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. 第三方服务</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">我们的服务可能使用以下第三方服务：</p>
            <ul className="mb-6 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>Supabase - 数据库和用户认证</li>
              <li>Replicate - AI模型处理</li>
              <li>Vercel - 网站托管</li>
              <li>支付处理商 - 处理付费订阅</li>
            </ul>
            <p className="mb-6 text-gray-700 leading-relaxed">
              这些服务提供商有自己的隐私政策，我们建议您查看它们的政策。
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. 您的权利</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">您有权：</p>
            <ul className="mb-6 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>访问和查看我们持有的您的个人数据</li>
              <li>请求更正不准确的个人信息</li>
              <li>请求删除您的个人数据</li>
              <li>限制或反对某些数据处理</li>
              <li>数据可携带性（导出您的数据）</li>
              <li>随时撤回同意</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Cookie和追踪技术</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              我们使用Cookie和类似技术来改善用户体验、记住登录状态、分析网站使用情况。您可以通过浏览器设置控制Cookie的使用，但这可能影响某些功能的正常使用。
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. 儿童隐私</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              我们的服务不针对13岁以下的儿童。我们不会故意收集13岁以下儿童的个人信息。如果我们发现收集了此类信息，将立即删除。
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. 国际数据传输</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              您的数据可能被传输到您所在国家/地区以外的地方进行处理。我们将确保采取适当的保护措施，符合适用的数据保护法律。
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. 政策更新</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              我们可能会不时更新本隐私政策。重大变更将通过网站通知或电子邮件告知。继续使用服务表示您接受更新后的政策。
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. 联系我们</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              如果您对本隐私政策有任何疑问或需要行使您的权利，请联系我们：<br/>
              邮箱：privacy@petimage.ai<br/>
              网站：petimage.ai<br/>
              我们将在30天内回复您的请求。
            </p>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                <strong>重要提醒：</strong>我们致力于保护您的隐私。如果您对数据处理有任何担忧，请随时联系我们。您的信任对我们非常重要。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}