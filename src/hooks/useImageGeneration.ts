'use client'

import { useState, useCallback } from 'react'
import { Template } from '@/config/templates'

export interface GenerationResult {
  id: string
  imageUrl: string
  templateUsed: Template
  originalImage: File
  createdAt: Date
}

export interface GenerationState {
  isGenerating: boolean
  progress: number
  error: string | null
  result: GenerationResult | null
  needPurchase: boolean
}

export const useImageGeneration = () => {
  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    progress: 0,
    error: null,
    result: null,
    needPurchase: false
  })

  const generateImage = useCallback(async (template: Template, imageFile: File) => {
    setState(prev => ({
      ...prev,
      isGenerating: true,
      progress: 0,
      error: null,
      result: null,
      needPurchase: false
    }))

    try {
      // 模拟进度更新
      const progressInterval = setInterval(() => {
        setState(prev => {
          if (prev.progress >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return {
            ...prev,
            progress: prev.progress + Math.random() * 10
          }
        })
      }, 1000)

      // 准备表单数据
      const formData = new FormData()
      formData.append('image', imageFile)
      formData.append('templateId', template.id)

      // 调用生成API
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const errorData = await response.json()
        if (response.status === 402 || errorData.needPurchase) {
          // Credits不足错误
          setState({
            isGenerating: false,
            progress: 0,
            error: errorData.message || 'Credits不足，请先购买套餐',
            result: null,
            needPurchase: true
          })
          return
        }
        throw new Error(errorData.message || 'Generation failed')
      }

      const data = await response.json()
      
      // 创建结果对象
      const result: GenerationResult = {
        id: data.id || Date.now().toString(),
        imageUrl: data.imageUrl,
        templateUsed: template,
        originalImage: imageFile,
        createdAt: new Date()
      }

      setState({
        isGenerating: false,
        progress: 100,
        error: null,
        result,
        needPurchase: false
      })

      return result

    } catch (error) {
      console.error('Image generation failed:', error)
      setState({
        isGenerating: false,
        progress: 0,
        error: error instanceof Error ? error.message : 'Generation failed',
        result: null,
        needPurchase: false
      })
      throw error
    }
  }, [])

  const retryGeneration = useCallback((template: Template, imageFile: File) => {
    return generateImage(template, imageFile)
  }, [generateImage])

  const clearResult = useCallback(() => {
    setState({
      isGenerating: false,
      progress: 0,
      error: null,
      result: null,
      needPurchase: false
    })
  }, [])

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
      needPurchase: false
    }))
  }, [])

  return {
    ...state,
    generateImage,
    retryGeneration,
    clearResult,
    clearError,
    canGenerate: !state.isGenerating
  }
}

export default useImageGeneration