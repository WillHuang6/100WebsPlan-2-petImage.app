'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Template } from '@/config/templates'

interface TemplateSelectorProps {
  templates: Template[]
  selectedTemplate: Template | null
  onTemplateSelect: (templateId: string) => void
  isLoading?: boolean
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  selectedTemplate,
  onTemplateSelect,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <section className="mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">
          Choose a Style
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-64"></div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (templates.length === 0) {
    return (
      <section className="mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">
          Choose a Style
        </h2>
        <div className="text-center py-12">
          <p className="text-gray-500">No templates available at the moment.</p>
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🎨 Pick a Style
        </h2>
        <p className="text-gray-600">
          Turn your pet photo into art with your favorite look
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {templates.map((template) => {
          const isSelected = selectedTemplate?.id === template.id
          
          return (
            <Card
              key={template.id}
              className={cn(
                'cursor-pointer transition-all duration-200 hover:shadow-lg',
                isSelected 
                  ? 'ring-2 ring-blue-500 shadow-lg bg-blue-50' 
                  : 'hover:shadow-md'
              )}
              onClick={() => onTemplateSelect(template.id)}
            >
              <CardContent className="p-4">
                {/* 模板预览图 */}
                <div className="relative mb-3 aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={`/images/examples/${
                      template.id === 'birthday-cake' ? 'birthday-cake.jpg' :
                      template.id === 'birthday-cake-side' ? 'birthday-cake-side.jpg' :
                      template.id === 'balloon-bright' ? 'balloon-bright.jpg' :
                      template.id === 'pet-figure' ? 'pet-figure.jpg' : 
                      'placeholder.jpg'
                    }`}
                    alt={`${template.name} example`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-xs font-medium text-white drop-shadow-lg">
                      {template.id === 'birthday-cake' ? '🎂 生日庆祝' :
                       template.id === 'birthday-cake-side' ? '🕯️ 烛光氛围' :
                       template.id === 'balloon-bright' ? '🎈 气球派对' :
                       template.id === 'pet-figure' ? '🎮 3D手办' : 'Preview'}
                    </p>
                  </div>
                  
                  {/* 选中指示器 */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* 模板信息 */}
                <div className="text-center">
                  <h3 className="font-medium text-gray-900 mb-1">
                    {template.name}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {template.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      
      {selectedTemplate && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Selected: <span className="font-medium text-blue-600">{selectedTemplate.name}</span>
          </p>
        </div>
      )}
    </section>
  )
}

export default TemplateSelector