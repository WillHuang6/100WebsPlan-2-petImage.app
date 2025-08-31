'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { Template } from '@/config/templates'
import { useTemplates } from './useTemplates'
import { useImageGeneration, GenerationResult } from './useImageGeneration'
import { useAuth } from '@/contexts/AuthContext'
import { useApp } from '@/contexts/AppContext'

export interface AppState {
  selectedTemplate: Template | null
  selectedImage: File | null
  step: 'selection' | 'generating' | 'result'
}

export const useAppState = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const { user } = useAuth()
  const { 
    guestSelectedTemplate, 
    guestSelectedImage, 
    clearGuestData, 
    closeAuthModal 
  } = useApp()
  
  // 使用模板管理hook
  const {
    templates,
    themes,
    selectedTemplate,
    selectedTheme,
    isLoading: templatesLoading,
    selectTemplate,
    selectTheme,
    clearSelection: clearTemplateSelection
  } = useTemplates()

  // 监听用户登录状态变化，恢复游客数据
  useEffect(() => {
    if (user && (guestSelectedTemplate || guestSelectedImage)) {
      // 用户刚登录，恢复游客数据
      if (guestSelectedTemplate && !selectedTemplate) {
        selectTemplate(guestSelectedTemplate)
      }
      if (guestSelectedImage && !selectedImage) {
        setSelectedImage(guestSelectedImage)
      }
      // 清除游客数据并关闭登录Modal
      clearGuestData()
      closeAuthModal()
    }
  }, [user, guestSelectedTemplate, guestSelectedImage, selectedTemplate, selectedImage, selectTemplate, clearGuestData, closeAuthModal])

  // 使用图片生成hook
  const {
    isGenerating,
    progress,
    error: generationError,
    result: generationResult,
    needPurchase,
    generateImage,
    retryGeneration,
    clearResult,
    clearError,
    canGenerate
  } = useImageGeneration()

  // 计算当前步骤
  const currentStep = useMemo(() => {
    if (generationResult) return 'result'
    if (isGenerating) return 'generating'
    return 'selection'
  }, [isGenerating, generationResult])

  // 检查是否可以开始生成
  const canStartGeneration = useMemo(() => {
    return selectedTemplate && selectedImage && canGenerate
  }, [selectedTemplate, selectedImage, canGenerate])

  // 处理图片选择
  const handleImageSelect = useCallback((file: File) => {
    setSelectedImage(file)
    // 清除之前的生成结果和错误
    clearResult()
    clearError()
  }, [clearResult, clearError])

  // 处理图片清除
  const handleImageClear = useCallback(() => {
    setSelectedImage(null)
    clearResult()
  }, [clearResult])

  // 处理模板选择
  const handleTemplateSelect = useCallback((templateId: string) => {
    selectTemplate(templateId)
    // 清除之前的生成结果和错误
    clearResult()
    clearError()
  }, [selectTemplate, clearResult, clearError])

  // 处理主题选择
  const handleThemeSelect = useCallback((themeId: string) => {
    selectTheme(themeId)
    // 主题切换时不需要清除选中的模板和结果
  }, [selectTheme])

  // 开始生成
  const handleStartGeneration = useCallback(async () => {
    if (!selectedTemplate || !selectedImage) {
      throw new Error('Please select a template and upload an image')
    }

    try {
      const result = await generateImage(selectedTemplate, selectedImage)
      return result
    } catch (error) {
      console.error('Generation failed:', error)
      throw error
    }
  }, [selectedTemplate, selectedImage, generateImage])

  // 重试生成
  const handleRetryGeneration = useCallback(() => {
    if (!selectedTemplate || !selectedImage) return Promise.reject(new Error('Missing template or image'))
    
    return retryGeneration(selectedTemplate, selectedImage)
  }, [selectedTemplate, selectedImage, retryGeneration])

  // 重新开始
  const handleRestart = useCallback(() => {
    setSelectedImage(null)
    clearTemplateSelection()
    clearResult()
    clearError()
  }, [clearTemplateSelection, clearResult, clearError])

  // 新建生成（保持模板选择，清除其他状态）
  const handleNewGeneration = useCallback(() => {
    setSelectedImage(null)
    clearResult()
    clearError()
  }, [clearResult, clearError])

  return {
    // 状态
    templates,
    themes,
    selectedTemplate,
    selectedTheme,
    selectedImage,
    currentStep,
    templatesLoading,
    
    // 生成相关状态
    isGenerating,
    generationProgress: progress,
    generationError,
    generationResult,
    needPurchase,
    
    // 计算状态
    canStartGeneration,
    
    // 操作方法
    handleTemplateSelect,
    handleThemeSelect,
    handleImageSelect,
    handleImageClear,
    handleStartGeneration,
    handleRetryGeneration,
    handleRestart,
    handleNewGeneration,
    clearError
  }
}

export default useAppState