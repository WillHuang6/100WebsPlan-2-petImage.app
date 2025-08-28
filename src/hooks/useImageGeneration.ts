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
}

export const useImageGeneration = () => {
  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    progress: 0,
    error: null,
    result: null
  })

  const generateImage = useCallback(async (template: Template, imageFile: File) => {
    setState(prev => ({
      ...prev,
      isGenerating: true,
      progress: 0,
      error: null,
      result: null
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
        result
      })

      return result

    } catch (error) {
      console.error('Image generation failed:', error)
      setState({
        isGenerating: false,
        progress: 0,
        error: error instanceof Error ? error.message : 'Generation failed',
        result: null
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
      result: null
    })
  }, [])

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null
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