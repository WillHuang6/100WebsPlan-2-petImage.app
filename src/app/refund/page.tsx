export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">退款政策</h1>
            <p className="text-gray-600">生效日期：2024年8月28日</p>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. 退款承诺</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              PetImage 致力于为用户提供优质的AI图像生成服务。我们理解有时服务可能不符合您的期望，因此提供公平合理的退款政策，确保您的权益得到保障。
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. 退款条件</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">2.1 符合退款的情况</h3>
            <ul className="mb-4 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>订阅后7天内，未使用超过50%的服务配额</li>
              <li>服务存在重大技术问题，无法正常使用</li>
              <li>AI生成质量持续低于预期标准</li>
              <li>意外重复订阅或计费错误</li>
              <li>服务功能与描述严重不符</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">2.2 不符合退款的情况</h3>
            <ul className="mb-6 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>已使用超过50%服务配额的订阅</li>
              <li>订阅期已超过30天</li>
              <li>因用户操作错误导致的不满意结果</li>
              <li>上传图片质量问题导致的生成效果不佳</li>
              <li>主观审美偏好不同</li>
              <li>违反服务条款的账户</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. 退款流程</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">3.1 申请退款</h3>
            <ol className="mb-4 text-gray-700 leading-relaxed list-decimal pl-6 space-y-2">
              <li>登录您的账户，查看订阅详情</li>
              <li>发送退款申请至 refund@petimage.ai</li>
              <li>提供订单号和退款原因</li>
              <li>如有必要，提供相关截图或证明</li>
            </ol>

            <h3 className="text-xl font-medium text-gray-800 mb-3">3.2 申请邮件应包含</h3>
            <ul className="mb-4 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>注册邮箱地址</li>
              <li>订单或交易号</li>
              <li>退款原因详细说明</li>
              <li>希望的解决方案</li>
              <li>联系方式</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">3.3 处理时间</h3>
            <ul className="mb-6 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>我们将在2个工作日内回复您的申请</li>
              <li>审核通过后，3-5个工作日内处理退款</li>
              <li>退款将原路返回到您的付款方式</li>
              <li>银行处理时间可能需要额外3-10个工作日</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. 不同套餐的退款规则</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">4.1 免费用户</h3>
            <p className="mb-4 text-gray-700 leading-relaxed">
              免费用户无需退款，可随时停止使用服务。
            </p>

            <h3 className="text-xl font-medium text-gray-800 mb-3">4.2 Pro 月度订阅 ($9.99/月)</h3>
            <ul className="mb-4 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>订阅后7天内可申请全额退款</li>
              <li>使用量不超过当月配额的50%</li>
              <li>按比例退款：剩余天数 ÷ 30 × 订阅费用</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">4.3 Enterprise 月度订阅 ($29.99/月)</h3>
            <ul className="mb-6 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>订阅后7天内可申请全额退款</li>
              <li>使用量不超过当月配额的50%</li>
              <li>提供14天试用期，试用期内可无理由退款</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. 特殊情况处理</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">5.1 技术故障</h3>
            <p className="mb-4 text-gray-700 leading-relaxed">
              如因我们的技术问题导致服务中断或功能异常，我们将：
            </p>
            <ul className="mb-4 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>延长您的订阅期限作为补偿</li>
              <li>提供额外的免费生成次数</li>
              <li>根据情况提供部分或全额退款</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">5.2 账户争议</h3>
            <p className="mb-6 text-gray-700 leading-relaxed">
              如遇到账户被误封、计费错误等争议，我们将优先处理，必要时提供临时访问权限，确保不影响您的正常使用。
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. 替代解决方案</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
              在处理退款申请时，我们可能提供以下替代方案：
            </p>
            <ul className="mb-6 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>免费延长订阅期限</li>
              <li>升级到更高级的套餐</li>
              <li>提供额外的技术支持和指导</li>
              <li>个性化的服务优化</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. 取消订阅</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
              您可以随时取消订阅：
            </p>
            <ul className="mb-6 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>在账户设置中点击"取消订阅"</li>
              <li>取消后仍可使用至当前计费周期结束</li>
              <li>不会自动续费</li>
              <li>历史数据将保留30天</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. 争议解决</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              如果您对退款决定不满意，可以：
            </p>
            <ul className="mb-6 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>联系我们的客服主管进行二次审核</li>
              <li>提供更多相关证明材料</li>
              <li>通过邮件详细说明您的情况</li>
              <li>我们将在5个工作日内给予最终答复</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. 联系方式</h2>
            <div className="mb-6 text-gray-700 leading-relaxed">
              <p className="mb-2"><strong>退款专线：</strong>refund@petimage.ai</p>
              <p className="mb-2"><strong>客服邮箱：</strong>support@petimage.ai</p>
              <p className="mb-2"><strong>官网：</strong>petimage.ai</p>
              <p className="mb-2"><strong>工作时间：</strong>周一至周五 9:00-18:00 (GMT+8)</p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. 政策更新</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              我们保留修改此退款政策的权利。任何重大变更将提前30天通知用户。修改后的政策将仅适用于新的订阅和交易。
            </p>

            <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-700">
                <strong>友情提醒：</strong>我们建议在订阅前先试用免费版本，了解服务质量。如有任何疑问，欢迎随时联系我们的客服团队。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}