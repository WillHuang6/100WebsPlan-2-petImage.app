export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-gray-600">Effective Date: August 28, 2024</p>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              Welcome to PetImage AI pet art generation service. By accessing and using our service, you agree to abide by these Terms of Service. If you do not agree to these terms, please do not use our service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Service Description</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              PetImage is an AI-powered online service that allows users to upload pet photos and generate artistic-style images. We use advanced AI technology to create unique works of art.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. User Accounts</h2>
            <ul className="mb-6 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>You must provide accurate and complete registration information</li>
              <li>You are responsible for protecting account security and passwords</li>
              <li>One person may only have one account</li>
              <li>We have the right to suspend or terminate accounts for violation of terms</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Usage Restrictions</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">You agree not to:</p>
            <ul className="mb-6 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>Upload images containing violence, pornography, or other inappropriate content</li>
              <li>Infringe on others' intellectual property or privacy rights</li>
              <li>Attempt to damage or interfere with normal service operation</li>
              <li>Use automated tools to generate content in bulk</li>
              <li>Use the service for commercial purposes (unless otherwise agreed)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Intellectual Property</h2>
            <ul className="mb-6 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>You retain all rights to your original uploaded images</li>
              <li>Usage rights to AI-generated artistic images belong to you</li>
              <li>Our technology, software, and services are protected by intellectual property laws</li>
              <li>You may not copy or distribute our technology without permission</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Paid Services</h2>
            <ul className="mb-6 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>Some features may require payment to use</li>
              <li>Paid users enjoy more generation credits and advanced features</li>
              <li>Subscription fees are charged monthly and can be cancelled at any time</li>
              <li>We reserve the right to adjust prices, but will provide advance notice</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Data and Privacy</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              We value your privacy. Uploaded images are used only for AI processing and will be automatically deleted within 7 days after processing. For detailed information, please see our Privacy Policy.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Service Availability</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              We strive to maintain stable service operation, but do not guarantee 100% service availability. We may need to perform maintenance, updates, or temporarily interrupt service for technical reasons.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Disclaimer</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              This service is provided "as is," and we do not provide any express or implied warranties regarding the accuracy, reliability, or suitability of the service. You use the service at your own risk.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Limitation of Liability</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              To the maximum extent permitted by law, we shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of the service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Terms Modification</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              We may update these terms from time to time. Significant changes will be communicated to users through website notifications or email. Continued use of the service indicates your acceptance of the modified terms.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. Contact Us</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us through the following means:<br/>
              Email: support@petimage.ai<br/>
              Website: petimage.ai
            </p>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                PetImage reserves the final interpretation rights of these terms. In case of disputes, they should be resolved through friendly consultation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}