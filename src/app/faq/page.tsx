'use client'

import React, { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: "What is PetImage?",
    answer: "PetImage is an AI-powered tool that transforms your pet photos into stunning artistic creations. Using advanced machine learning algorithms, we can generate unique artwork in various styles and themes."
  },
  {
    question: "How does the AI image generation work?",
    answer: "Our AI model analyzes your uploaded pet photo and applies sophisticated artistic transformations based on the template you choose. The process typically takes 10-30 seconds and produces high-quality results."
  },
  {
    question: "What image formats are supported?",
    answer: "We support JPEG, PNG, and WEBP formats. Images should be at least 512x512 pixels for best results, with a maximum file size of 10MB."
  },
  {
    question: "Is my pet's photo stored on your servers?",
    answer: "We temporarily store your images during processing for security and quality purposes. Original photos are automatically deleted after 7 days, while generated artworks can be saved to your account."
  },
  {
    question: "Can I use the generated images commercially?",
    answer: "Yes! All images generated through PetImage are yours to use freely, including for commercial purposes. You retain full rights to the generated artwork."
  },
  {
    question: "What if I'm not satisfied with the result?",
    answer: "You can always try again with different templates or settings. Our AI continuously improves, and we're always adding new artistic styles to help you create the perfect artwork."
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a 30-day money-back guarantee for Pro and Enterprise subscribers. If you're not completely satisfied with our service, contact our support team for a full refund."
  },
  {
    question: "How can I contact support?",
    answer: "You can reach our support team through the contact form on our website, or email us directly at support@petimage.ai. We typically respond within 24 hours."
  }
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 text-lg">
            Everything you need to know about PetImage
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-medium text-gray-800">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-600 border-t border-gray-100 pt-4">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-600 mb-6">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <button className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3 rounded-lg font-medium hover:from-rose-600 hover:to-pink-600 transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  )
}