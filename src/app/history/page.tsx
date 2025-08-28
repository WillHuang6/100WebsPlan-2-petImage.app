'use client'

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ArtworkHistory } from '@/components/ArtworkHistory'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function HistoryPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="w-20 h-20 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-3xl">🎨</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">需要登录查看历史记录</h2>
            <p className="text-gray-600 mb-6">
              登录后即可查看您的所有AI宠物艺术作品历史记录
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/">
                <Button variant="outline">
                  返回首页
                </Button>
              </Link>
              <Button 
                onClick={() => window.location.href = '/?login=true'}
                className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
              >
                立即登录
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <main className="max-w-6xl mx-auto">
          <ArtworkHistory />
        </main>
      </div>
    </div>
  )
}