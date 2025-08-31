import { useState, useEffect } from 'react'
import { Template, Theme, DEFAULT_TEMPLATE_ID } from '@/config/templates'

export const useTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([])
  const [themes, setThemes] = useState<Theme[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
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
        const availableThemes = data.themes as Theme[] || []
        
        setTemplates(availableTemplates)
        setThemes(availableThemes)
        
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
        setThemes([])
        setSelectedTemplate(null)
        setSelectedTheme(null)
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

  const selectTheme = (themeId: string) => {
    setSelectedTheme(themeId || null)
  }

  const clearSelection = () => {
    setSelectedTemplate(null)
    setSelectedTheme(null)
  }

  return {
    templates,
    themes,
    selectedTemplate,
    selectedTheme,
    isLoading,
    error,
    selectTemplate,
    selectTheme,
    clearSelection,
    hasTemplates: templates.length > 0
  }
}

export default useTemplates