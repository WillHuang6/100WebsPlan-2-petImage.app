'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { getTemplateById } from '@/config/templates'

interface Generation {
  id: string
  template_id: string
  template_used?: {
    id: string
    name: string
  }
  generated_image_url: string
  created_at: string
  status: string
}

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  generation: Generation | null
  onDownload: () => void
}

export const ImageModal: React.FC<ImageModalProps> = ({ 
  isOpen, 
  onClose, 
  generation, 
  onDownload 
}) => {
  if (!isOpen || !generation) return null

  // 安全获取模板名称的函数
  const getTemplateName = (generation: Generation): string => {
    if (generation.template_used?.name) {
      return generation.template_used.name
    }
    
    const template = getTemplateById(generation.template_id)
    return template?.name || '未知模板'
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* 背景遮罩 */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal内容 */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 flex items-center justify-center transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex flex-col lg:flex-row">
            {/* 左侧 - 图片展示 */}
            <div className="flex-1 bg-gray-50 flex items-center justify-center p-6">
              <div className="max-w-full max-h-[70vh] lg:max-h-[80vh]">
                <img
                  src={generation.generated_image_url}
                  alt={getTemplateName(generation)}
                  className="w-full h-full object-contain rounded-lg shadow-lg"
                />
              </div>
            </div>

            {/* 右侧 - 作品信息 */}
            <div className="lg:w-80 p-6 bg-white border-t lg:border-t-0 lg:border-l border-gray-200">
              {/* 作品标题 */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {getTemplateName(generation)}
                </h2>
                <p className="text-gray-500">
                  创建于 {formatDate(generation.created_at)}
                </p>
              </div>

              {/* 状态信息 */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium text-gray-700">状态</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✓ 已完成
                  </span>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p className="mb-1">作品ID: {generation.id.slice(-8)}</p>
                  <p>模板: {getTemplateName(generation)}</p>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="space-y-3">
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDownload()
                  }}
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-4-4m4 4l4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  下载高清图片
                </Button>

                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/'}
                  className="w-full border-rose-200 text-rose-700 hover:bg-rose-50"
                >
                  创作新作品
                </Button>
              </div>

              {/* 分享提示 */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 text-blue-600 mt-0.5">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-800 mb-1">
                      分享您的作品
                    </p>
                    <p className="text-xs text-blue-600">
                      即将支持分享到社交媒体
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageModal