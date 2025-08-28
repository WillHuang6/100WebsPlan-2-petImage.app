'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { useApp } from '@/contexts/AppContext'

interface GenerateButtonProps {
  onGenerate: () => void
  isDisabled?: boolean
  isLoading?: boolean
  loadingProgress?: number
  className?: string
  selectedTemplate?: string | null
  selectedImage?: File | null
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({
  onGenerate,
  isDisabled = false,
  isLoading = false,
  loadingProgress = 0,
  className,
  selectedTemplate,
  selectedImage
}) => {
  const { user } = useAuth()
  const { openAuthModal, setGuestSelectedTemplate, setGuestSelectedImage } = useApp()

  const handleGenerate = () => {
    // 检查用户是否已登录
    if (!user) {
      // 保存游客的选择数据
      if (selectedTemplate) {
        setGuestSelectedTemplate(selectedTemplate)
      }
      if (selectedImage) {
        setGuestSelectedImage(selectedImage)
      }
      // 打开登录Modal
      openAuthModal()
      return
    }
    
    // 用户已登录，继续生成
    onGenerate()
  }
  const getButtonText = () => {
    if (isLoading) {
      return `Generating... ${Math.round(loadingProgress)}%`
    }
    return 'Generate AI Image ✨'
  }

  const getButtonIcon = () => {
    if (isLoading) {
      return (
        <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    }
    return (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  }

  return (
    <section className={cn("text-center", className)}>
      <div className="max-w-md mx-auto">
        <Button
          onClick={handleGenerate}
          disabled={isDisabled || isLoading}
          size="lg"
          className={cn(
            "w-full text-lg font-medium transition-all duration-200",
            "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
            "shadow-lg hover:shadow-xl",
            isLoading && "cursor-not-allowed",
            isDisabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {getButtonIcon()}
          {getButtonText()}
        </Button>
        
        {/* Progress Bar */}
        {isLoading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <div className="mt-2 text-sm text-gray-600">
              <div className="flex justify-between items-center">
                <span>Processing your pet's photo...</span>
                <span className="font-medium">{Math.round(loadingProgress)}%</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Loading Messages */}
        {isLoading && (
          <div className="mt-4 text-sm text-gray-500">
            {loadingProgress < 30 && (
              <p className="animate-pulse">🔍 Analyzing your pet's features...</p>
            )}
            {loadingProgress >= 30 && loadingProgress < 60 && (
              <p className="animate-pulse">🎨 Applying AI magic...</p>
            )}
            {loadingProgress >= 60 && loadingProgress < 90 && (
              <p className="animate-pulse">✨ Adding finishing touches...</p>
            )}
            {loadingProgress >= 90 && (
              <p className="animate-pulse">🎉 Almost ready!</p>
            )}
          </div>
        )}
        
        {/* Disabled State Helper Text */}
        {isDisabled && !isLoading && (
          <p className="mt-4 text-sm text-gray-500">
            Please select a template and upload a photo to generate
          </p>
        )}
        
        {/* Estimated Time */}
        {!isDisabled && !isLoading && (
          <p className="mt-4 text-sm text-gray-500">
            ⚡ Estimated generation time: 10-15 seconds
          </p>
        )}
      </div>
    </section>
  )
}

export default GenerateButton