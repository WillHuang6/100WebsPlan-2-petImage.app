import { useState, useEffect } from 'react'
import { Template, DEFAULT_TEMPLATE_ID } from '@/config/templates'

export const useTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/templates', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        
        if (!data.success || !data.templates) {
          throw new Error(data.message || 'Failed to load templates')
        }

        const availableTemplates = data.templates as Template[]
        setTemplates(availableTemplates)
        
        // 默认选择指定模板，如果不存在则选择第一个
        let defaultTemplate = availableTemplates.find(t => t.id === DEFAULT_TEMPLATE_ID)
        if (!defaultTemplate && availableTemplates.length > 0) {
          defaultTemplate = availableTemplates[0]
        }
        
        if (defaultTemplate) {
          setSelectedTemplate(defaultTemplate)
        }
        
        console.log(`Successfully loaded ${availableTemplates.length} templates`)
      } catch (error: any) {
        console.error('Failed to load templates:', error)
        setError(error.message || 'Failed to load templates')
        setTemplates([])
        setSelectedTemplate(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadTemplates()
  }, [])

  const selectTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
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
    error,
    selectTemplate,
    clearSelection,
    hasTemplates: templates.length > 0
  }
}

export default useTemplates