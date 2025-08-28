import React from 'react'
import Link from 'next/link'

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <h3 className="font-bold text-lg mb-3 text-gray-800">PetImage</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Turn precious moments with your furry family into beautiful, lasting AI-generated memories.
              </p>
              <div className="mt-4">
                <span className="text-xs text-gray-500">Powered by advanced AI technology</span>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold mb-3 text-gray-800">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="text-gray-600 hover:text-rose-600 transition-colors">
                    AI Generator
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-gray-600 hover:text-rose-600 transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/history" className="text-gray-600 hover:text-rose-600 transition-colors">
                    My Artworks
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-600 hover:text-rose-600 transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-3 text-gray-800">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="text-gray-600 hover:text-rose-600 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-600 hover:text-rose-600 transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/refund" className="text-gray-600 hover:text-rose-600 transition-colors">
                    Refund Policy
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 hover:text-rose-600 transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-3 text-gray-800">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a 
                    href="mailto:support@petimage.ai" 
                    className="text-gray-600 hover:text-rose-600 transition-colors"
                  >
                    📧 support@petimage.ai
                  </a>
                </li>
                <li>
                  <a 
                    href="mailto:refund@petimage.ai" 
                    className="text-gray-600 hover:text-rose-600 transition-colors"
                  >
                    💰 refund@petimage.ai
                  </a>
                </li>
                <li>
                  <span className="text-gray-600">
                    🕒 Response: 24-48 hours
                  </span>
                </li>
                <li>
                  <span className="text-gray-600">
                    🌍 Available Worldwide
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <p className="text-sm text-gray-500">
                  © 2024 PetImage AI. All rights reserved.
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Made with 💕 for pet parents everywhere
                </p>
              </div>
              
              <div className="flex items-center space-x-4 text-xs text-gray-400">
                <span>🔒 Secure & Private</span>
                <span>⚡ Lightning Fast</span>
                <span>🎨 AI Powered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer