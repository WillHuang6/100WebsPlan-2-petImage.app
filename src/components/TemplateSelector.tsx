'use client'

import React, { useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Template, Theme } from '@/config/templates'
import ThemeSelector from './ThemeSelector'

interface TemplateSelectorProps {
  templates: Template[]
  themes: Theme[]
  selectedTemplate: Template | null
  selectedTheme: string | null
  onTemplateSelect: (templateId: string) => void
  onThemeSelect: (themeId: string) => void
  isLoading?: boolean
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  themes,
  selectedTemplate,
  selectedTheme,
  onTemplateSelect,
  onThemeSelect,
  isLoading = false
}) => {
  // Filter templates based on selected theme
  const filteredTemplates = useMemo(() => {
    if (!selectedTheme || selectedTheme === '') {
      return templates
    }
    
    return templates.filter(template => 
      template.themes.some(theme => 
        theme.toLowerCase() === selectedTheme.toLowerCase()
      )
    )
  }, [templates, selectedTheme])
  if (isLoading) {
    return (
      <section className="w-full">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            🎨 Pick a Style
          </h2>
          <p className="text-gray-600">
            Turn your pet photo into art with your favorite look
          </p>
        </div>
        
        {/* Theme selector skeleton */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 animate-pulse bg-gray-200 rounded-lg px-4 py-2 h-10 w-20"
              />
            ))}
          </div>
        </div>

        {/* Templates grid skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg aspect-[4/5] mb-2"></div>
              <div className="bg-gray-200 rounded h-4 mb-1"></div>
              <div className="bg-gray-200 rounded h-3 w-3/4"></div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (templates.length === 0) {
    return (
      <section className="w-full">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            🎨 Pick a Style
          </h2>
          <p className="text-gray-600">
            Turn your pet photo into art with your favorite look
          </p>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500">No templates available at the moment.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🎨 Pick a Style
        </h2>
        <p className="text-gray-600">
          Turn your pet photo into art with your favorite look
        </p>
      </div>

      {/* Theme Selector */}
      <div className="mb-6">
        <ThemeSelector
          themes={themes}
          selectedTheme={selectedTheme}
          onThemeSelect={onThemeSelect}
          isLoading={isLoading}
        />
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        {filteredTemplates.map((template) => {
          const isSelected = selectedTemplate?.id === template.id
          
          return (
            <Card
              key={template.id}
              className={cn(
                'cursor-pointer transition-all duration-200 hover:shadow-lg relative overflow-hidden',
                isSelected 
                  ? 'ring-2 ring-orange-500 shadow-lg' 
                  : 'hover:shadow-md border border-gray-200'
              )}
              onClick={() => onTemplateSelect(template.id)}
            >
              <CardContent className="p-0">
                {/* Template Preview Image */}
                <div className="relative aspect-[4/5] bg-gray-100">
                  <img 
                    src={template.exampleImageUrl}
                    alt={`${template.name} example`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  
                  {/* Selected indicator */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  
                </div>
                
                {/* Template name at bottom */}
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-900 text-center">
                    {template.name}
                  </h3>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* No templates message when filtered */}
      {filteredTemplates.length === 0 && selectedTheme && (
        <div className="text-center py-12">
          <p className="text-gray-500">No templates found for the selected theme.</p>
        </div>
      )}
      
      {/* Selected template indicator */}
      {selectedTemplate && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Selected: <span className="font-medium text-orange-600">{selectedTemplate.name}</span>
          </p>
        </div>
      )}
    </section>
  )
}

export default TemplateSelector