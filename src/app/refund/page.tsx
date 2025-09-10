export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Refund Policy</h1>
            <p className="text-gray-600">Effective Date: August 30, 2025</p>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Refund Commitment</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              PetImage is committed to providing high-quality AI image generation services to users. We understand that sometimes the service may not meet your expectations, so we provide a fair and reasonable refund policy to ensure your rights are protected.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Refund Conditions</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">2.1 Eligible for Refund</h3>
            <ul className="mb-4 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>Within 7 days of subscription and having used less than 50% of service quota</li>
              <li>Service has major technical issues and cannot be used normally</li>
              <li>AI generation quality consistently below expected standards</li>
              <li>Accidental duplicate subscriptions or billing errors</li>
              <li>Service features significantly differ from description</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">2.2 Not Eligible for Refund</h3>
            <ul className="mb-6 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>Subscriptions that have used more than 50% of service quota</li>
              <li>Subscription period has exceeded 30 days</li>
              <li>Unsatisfactory results due to user operational errors</li>
              <li>Poor generation results due to uploaded image quality issues</li>
              <li>Different subjective aesthetic preferences</li>
              <li>Accounts that violate Terms of Service</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Refund Process</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">3.1 Requesting a Refund</h3>
            <ol className="mb-4 text-gray-700 leading-relaxed list-decimal pl-6 space-y-2">
              <li>Log into your account and view subscription details</li>
              <li>Send refund request to refund@petimage.ai</li>
              <li>Provide order number and reason for refund</li>
              <li>If necessary, provide relevant screenshots or proof</li>
            </ol>

            <h3 className="text-xl font-medium text-gray-800 mb-3">3.2 Request Email Should Include</h3>
            <ul className="mb-4 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>Registered email address</li>
              <li>Order or transaction number</li>
              <li>Detailed explanation of refund reason</li>
              <li>Preferred resolution</li>
              <li>Contact information</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">3.3 Processing Time</h3>
            <ul className="mb-6 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>We will respond to your request within 2 business days</li>
              <li>After approval, refund will be processed within 3-5 business days</li>
              <li>Refund will be returned to your original payment method</li>
              <li>Bank processing may require an additional 3-10 business days</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Refund Rules for Different Plans</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">4.1 Free Users</h3>
            <p className="mb-4 text-gray-700 leading-relaxed">
              Free users do not need refunds and can stop using the service at any time.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mb-3">4.2 Essential Plan ($4 one-time)</h3>
            <ul className="mb-4 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>Can request full refund within 7 days of purchase</li>
              <li>Usage must not exceed 50% of credits</li>
              <li>Proportional refund: remaining credits ÷ total credits × purchase price</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">4.3 Professional Plan ($14 one-time)</h3>
            <ul className="mb-6 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>Can request full refund within 7 days of purchase</li>
              <li>Usage must not exceed 50% of credits</li>
              <li>Includes satisfaction guarantee for premium users</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Special Circumstances</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">5.1 Technical Failures</h3>
            <p className="mb-4 text-gray-700 leading-relaxed">
              If service interruption or functional abnormalities occur due to our technical issues, we will:
            </p>
            <ul className="mb-4 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>Extend your subscription period as compensation</li>
              <li>Provide additional free generation credits</li>
              <li>Offer partial or full refunds based on the situation</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">5.2 Account Disputes</h3>
            <p className="mb-6 text-gray-700 leading-relaxed">
              In case of account disputes such as mistaken suspensions or billing errors, we will prioritize handling and provide temporary access if necessary to ensure your normal usage is not affected.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Alternative Solutions</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
              When processing refund requests, we may offer the following alternatives:
            </p>
            <ul className="mb-6 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>Free subscription period extension</li>
              <li>Upgrade to a higher-tier plan</li>
              <li>Provide additional technical support and guidance</li>
              <li>Personalized service optimization</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Subscription Cancellation</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
              You can cancel your subscription at any time:
            </p>
            <ul className="mb-6 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>Click "Cancel Subscription" in account settings</li>
              <li>Continue using until current billing cycle ends after cancellation</li>
              <li>Will not auto-renew</li>
              <li>Historical data will be retained for 30 days</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Dispute Resolution</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              If you are dissatisfied with the refund decision, you can:
            </p>
            <ul className="mb-6 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>Contact our customer service manager for a second review</li>
              <li>Provide additional relevant supporting materials</li>
              <li>Explain your situation in detail via email</li>
              <li>We will provide a final response within 5 business days</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Contact Information</h2>
            <div className="mb-6 text-gray-700 leading-relaxed">
              <p className="mb-2"><strong>Refund Hotline:</strong> refund@petimage.ai</p>
              <p className="mb-2"><strong>Customer Service:</strong> support@petimage.ai</p>
              <p className="mb-2"><strong>Website:</strong> petimage.ai</p>
              <p className="mb-2"><strong>Business Hours:</strong> Monday to Friday 9:00-18:00 (GMT+8)</p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Policy Updates</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              We reserve the right to modify this refund policy. Any significant changes will be communicated to users 30 days in advance. Modified policies will only apply to new subscriptions and transactions.
            </p>

            <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-700">
                <strong>Friendly Reminder:</strong> We recommend trying the free version first to understand service quality before subscribing. If you have any questions, feel free to contact our customer service team at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}