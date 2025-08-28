import React from 'react'
import Link from 'next/link'

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <h3 className="font-bold text-lg mb-3">Pet AI Images</h3>
              <p className="text-sm text-gray-600">
                Transform your pet photos into magical AI-generated art
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="text-gray-600 hover:text-blue-600">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 hover:text-blue-600">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a 
                    href="mailto:support@petaiimages.com" 
                    className="text-gray-600 hover:text-blue-600"
                  >
                    📧 Email Support
                  </a>
                </li>
                <li>
                  <span className="text-gray-600">
                    🕒 Response: 24-48 hours
                  </span>
                </li>
                <li>
                  <span className="text-gray-600">
                    📱 Mobile Friendly
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t text-center">
            <p className="text-sm text-gray-500">
              © 2024 Pet AI Images. Made with ❤️ for pet parents everywhere.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer