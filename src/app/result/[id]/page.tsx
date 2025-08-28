'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function ResultPage() {
  const params = useParams()
  const resultId = params.id as string

  // TODO: 在实际实现中，这里会根据 resultId 从数据库或存储中获取生成结果
  // 目前只是一个占位页面

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <main className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold mb-2">Your AI Pet Art</h1>
            <p className="text-gray-600">Result ID: {resultId}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Generated Image */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Generated Image</h2>
                <div className="aspect-[3/4] rounded-lg bg-gray-200 flex items-center justify-center mb-4">
                  <div className="text-center text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>Generated image will appear here</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">
                    📥 Download
                  </Button>
                  <Button variant="outline" className="flex-1">
                    🔗 Share
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Generation Details */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Template Used</label>
                    <p className="text-gray-900">Birthday Cake Style</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Generated</label>
                    <p className="text-gray-900">{new Date().toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Format</label>
                    <p className="text-gray-900">PNG, 3:4 aspect ratio</p>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="font-medium mb-2">Share on Social Media</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Twitter
                    </Button>
                    <Button variant="outline" size="sm">
                      Instagram
                    </Button>
                    <Button variant="outline" size="sm">
                      Facebook
                    </Button>
                  </div>
                </div>

                <div className="mt-8">
                  <Link href="/">
                    <Button variant="outline" className="w-full">
                      Create Another
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}