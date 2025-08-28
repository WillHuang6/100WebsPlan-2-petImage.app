import { useState, useEffect } from 'react'
import { Template, getAvailableTemplates, getTemplateById, DEFAULT_TEMPLATE_ID } from '@/config/templates'

export const useTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 模拟加载过程，实际项目中这里可能会从API获取模板
    const loadTemplates = async () => {
      setIsLoading(true)
      try {
        const availableTemplates = getAvailableTemplates()
        setTemplates(availableTemplates)
        
        // 默认选择第一个模板
        const defaultTemplate = getTemplateById(DEFAULT_TEMPLATE_ID)
        if (defaultTemplate) {
          setSelectedTemplate(defaultTemplate)
        }
      } catch (error) {
        console.error('Failed to load templates:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTemplates()
  }, [])

  const selectTemplate = (templateId: string) => {
    const template = getTemplateById(templateId)
    if (template) {
      setSelectedTemplate(template)
    }
  }

  const clearSelection = () => {
    setSelectedTemplate(null)
  }

  return {
    templates,
    selectedTemplate,
    isLoading,
    selectTemplate,
    clearSelection,
    hasTemplates: templates.length > 0
  }
}

export default useTemplates