export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-600">Last updated: August 28, 2024</p>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              PetImage respects and protects user privacy. This privacy policy explains how we collect, use, store, and protect your personal information. By using our services, you agree to the data processing methods described in this policy.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">2.1 Account Information</h3>
            <ul className="mb-4 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>Email address (for account creation and login)</li>
              <li>Display name (optional)</li>
              <li>Account creation and last login times</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">2.2 Uploaded Content</h3>
            <ul className="mb-4 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>Pet images you upload</li>
              <li>AI-generated artistic images</li>
              <li>Generation history and preference settings</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">2.3 Usage Data</h3>
            <ul className="mb-6 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>Service usage frequency and patterns</li>
              <li>Device information (browser type, operating system)</li>
              <li>IP addresses and access logs</li>
              <li>Error reports and performance data</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. How We Use Information</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">We use the collected information for:</p>
            <ul className="mb-6 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>Providing and maintaining AI image generation services</li>
              <li>Processing and improving AI model performance</li>
              <li>User authentication and account management</li>
              <li>Customer support and technical issue resolution</li>
              <li>Service optimization and new feature development</li>
              <li>Preventing fraud and abuse</li>
              <li>Complying with legal and regulatory requirements</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Data Storage and Security</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">4.1 Storage Duration</h3>
            <ul className="mb-4 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>Original uploaded images: automatically deleted within 7 days after processing</li>
              <li>AI-generated images: users can choose to save to personal accounts</li>
              <li>Account data: retained during account active period, cleared after account deletion</li>
              <li>Usage logs: retained for 90 days for service optimization</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">4.2 Security Measures</h3>
            <ul className="mb-6 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>All data transmitted using HTTPS encryption</li>
              <li>Data stored with secure cloud service providers</li>
              <li>Regular security audits and updates</li>
              <li>Access control and permission management</li>
              <li>Data backup and disaster recovery plans</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Data Sharing</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">We do not sell, rent, or trade your personal information. Data may only be shared in the following circumstances:</p>
            <ul className="mb-6 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>With your explicit consent</li>
              <li>With trusted third-party service providers (such as cloud storage, payment processing)</li>
              <li>When required by law or government agencies</li>
              <li>To protect our rights and security</li>
              <li>Business transfer or merger (with advance notice)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Third-Party Services</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">Our service may use the following third-party services:</p>
            <ul className="mb-6 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>Supabase - Database and user authentication</li>
              <li>Replicate - AI model processing</li>
              <li>Vercel - Website hosting</li>
              <li>Payment processors - Handle paid subscriptions</li>
            </ul>
            <p className="mb-6 text-gray-700 leading-relaxed">
              These service providers have their own privacy policies, and we recommend you review their policies.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Your Rights</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">You have the right to:</p>
            <ul className="mb-6 text-gray-700 leading-relaxed list-disc pl-6 space-y-2">
              <li>Access and view your personal data we hold</li>
              <li>Request correction of inaccurate personal information</li>
              <li>Request deletion of your personal data</li>
              <li>Restrict or object to certain data processing</li>
              <li>Data portability (export your data)</li>
              <li>Withdraw consent at any time</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Cookies and Tracking Technologies</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              We use cookies and similar technologies to improve user experience, remember login status, and analyze website usage. You can control cookie usage through browser settings, but this may affect the normal use of certain features.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Children's Privacy</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13. If we discover we have collected such information, we will delete it immediately.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. International Data Transfers</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              Your data may be transferred to and processed in locations outside your country or region. We will ensure appropriate safeguards are in place, in compliance with applicable data protection laws.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Policy Updates</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              We may update this privacy policy from time to time. Significant changes will be communicated through website notifications or email. Continued use of the service indicates your acceptance of the updated policy.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. Contact Us</h2>
            <p className="mb-6 text-gray-700 leading-relaxed">
              If you have any questions about this privacy policy or need to exercise your rights, please contact us:<br/>
              Email: privacy@petimage.ai<br/>
              Website: petimage.ai<br/>
              We will respond to your request within 30 days.
            </p>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                <strong>Important Notice:</strong> We are committed to protecting your privacy. If you have any concerns about data processing, please contact us at any time. Your trust is very important to us.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}