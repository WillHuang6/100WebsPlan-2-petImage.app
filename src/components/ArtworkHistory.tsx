'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ImageModal } from '@/components/ImageModal'
import { formatDate } from '@/lib/utils'
import { getTemplateById } from '@/config/templates'

interface Generation {
  id: string
  template_id: string
  template_used?: {
    id: string
    name: string
  }
  result_image_url: string
  created_at: string
  status: string
}

export const ArtworkHistory: React.FC = () => {
  const { user } = useAuth()
  const [generations, setGenerations] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<Generation | null>(null)

  // 安全获取模板名称的函数
  const getTemplateName = (generation: Generation): string => {
    if (generation.template_used?.name) {
      return generation.template_used.name
    }
    
    const template = getTemplateById(generation.template_id)
    return template?.name || '未知模板'
  }

  useEffect(() => {
    if (user) {
      fetchGenerations()
    }
  }, [user])

  const fetchGenerations = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/generations')
      
      if (!response.ok) {
        throw new Error('获取历史记录失败')
      }
      
      const data = await response.json()
      setGenerations(data.generations || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取历史记录失败')
    } finally {
      setLoading(false)
    }
  }

  const handleImageClick = (generation: Generation) => {
    setSelectedImage(generation)
  }

  const handleDownload = (generation: Generation) => {
    const link = document.createElement('a')
    link.href = generation.result_image_url
    link.download = `${getTemplateName(generation)}-${generation.id}.png`
    link.click()
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">加载历史记录中...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="bg-red-50 rounded-2xl p-8 border border-red-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h3 className="text-xl font-semibold text-red-800 mb-2">加载失败</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <Button 
            onClick={fetchGenerations}
            className="bg-red-600 hover:bg-red-700"
          >
            重试
          </Button>
        </div>
      </div>
    )
  }

  if (generations.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-gray-500 text-3xl">🎨</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">还没有创作历史</h3>
          <p className="text-gray-600 mb-6">
            开始创建您的第一个AI宠物艺术作品吧！
          </p>
          <Button 
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
          >
            立即创作
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
          My Artworks
        </h1>
        <p className="text-gray-600 text-lg">
          您的AI宠物艺术作品收藏 · 共 {generations.length} 件作品
        </p>
      </div>

      {/* 作品网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {generations.map((generation) => (
          <Card 
            key={generation.id} 
            className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
            onClick={() => handleImageClick(generation)}
          >
            <CardContent className="p-0">
              {/* 图片预览 */}
              <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
                <img
                  src={generation.result_image_url}
                  alt={getTemplateName(generation)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              
              {/* 作品信息 */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1">
                  {getTemplateName(generation)}
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  {formatDate(generation.created_at)}
                </p>
                
                {/* 状态标签 */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Completed
                  </span>
                  
                  {/* 下载按钮 */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDownload(generation)
                    }}
                    className="h-8 w-8 p-0 hover:bg-rose-50 hover:text-rose-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-4-4m4 4l4-4m-4-10l4 4m-4-4L8 10" />
                    </svg>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 图片放大模态框 */}
      <ImageModal 
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        generation={selectedImage}
        onDownload={() => selectedImage && handleDownload(selectedImage)}
      />
    </div>
  )
}

export default ArtworkHistory