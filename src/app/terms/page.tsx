export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">服务条款</h1>
            <p className="text-gray-600">生效日期：2024年8月28日</p>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. 接受条款</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              欢迎使用 PetImage AI 宠物艺术生成服务。通过访问和使用我们的服务，您同意遵守本服务条款。如果您不同意这些条款，请不要使用我们的服务。
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. 服务描述</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              PetImage 是一个基于人工智能的在线服务，允许用户上传宠物照片并生成艺术风格的图像。我们使用先进的AI技术来创建独特的艺术作品。
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. 用户账户</h2>
            <ul className="mb-6 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>您需要提供准确、完整的注册信息</li>
              <li>您有责任保护账户安全和密码</li>
              <li>一个人只能拥有一个账户</li>
              <li>我们有权在违反条款时暂停或终止账户</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. 使用限制</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">您同意不会：</p>
            <ul className="mb-6 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>上传包含暴力、色情或其他不当内容的图像</li>
              <li>侵犯他人的知识产权或隐私权</li>
              <li>尝试破坏或干扰服务的正常运行</li>
              <li>使用自动化工具大量生成内容</li>
              <li>将服务用于商业目的（除非另有约定）</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. 知识产权</h2>
            <ul className="mb-6 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>您保留对原始上传图像的所有权利</li>
              <li>生成的AI艺术图像的使用权归您所有</li>
              <li>我们的技术、软件和服务受知识产权法保护</li>
              <li>未经许可，您不得复制或分发我们的技术</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. 付费服务</h2>
            <ul className="mb-6 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>某些功能可能需要付费使用</li>
              <li>付费用户享有更多生成次数和高级功能</li>
              <li>订阅费用按月收取，可随时取消</li>
              <li>我们保留调整价格的权利，但会提前通知</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. 数据和隐私</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              我们重视您的隐私。上传的图像仅用于AI处理，处理完成后会在7天内自动删除。详细信息请查看我们的隐私政策。
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. 服务可用性</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              我们努力保持服务的稳定运行，但不保证服务100%可用。我们可能需要进行维护、更新或因技术原因暂时中断服务。
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. 免责声明</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              本服务"按现状"提供，我们不对服务的准确性、可靠性或适用性提供任何明示或暗示的保证。使用服务的风险由您自行承担。
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. 责任限制</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              在法律允许的最大范围内，我们对因使用服务而产生的任何直接、间接、偶然或后果性损害不承担责任。
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. 条款修改</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              我们可能会不时更新这些条款。重大变更将通过网站通知或电子邮件告知用户。继续使用服务即表示您接受修改后的条款。
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. 联系我们</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              如果您对这些服务条款有任何疑问，请通过以下方式联系我们：<br/>
              邮箱：support@petimage.ai<br/>
              网站：petimage.ai
            </p>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                本条款的最终解释权归 PetImage 所有。如有争议，应友好协商解决。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}