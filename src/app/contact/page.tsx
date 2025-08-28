import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <main className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
            <p className="text-gray-600">We'd love to hear from you</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">📧 Email Support</h3>
                <p className="text-gray-600 mb-2">
                  For questions, feedback, or technical support, please email us at:
                </p>
                <a 
                  href="mailto:support@petaiimages.com" 
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  support@petaiimages.com
                </a>
              </div>

              <div>
                <h3 className="font-semibold mb-2">🐛 Report Issues</h3>
                <p className="text-gray-600">
                  Encountered a bug or have a feature request? We want to know about it!
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">💡 Feedback</h3>
                <p className="text-gray-600">
                  Your feedback helps us improve. Tell us about your experience and suggestions for new features.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">⚡ Response Time</h3>
                <p className="text-gray-600">
                  We typically respond to emails within 24-48 hours during business days.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>🎯 Quick Tip:</strong> When contacting support, please include:
                  <br />• What you were trying to do
                  <br />• What happened instead
                  <br />• Your browser and device information
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}