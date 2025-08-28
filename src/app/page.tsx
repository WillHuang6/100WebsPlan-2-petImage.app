'use client'

import React from 'react'
import Header from '@/components/Header'
import TemplateSelector from '@/components/TemplateSelector'
import ImageUploader from '@/components/ImageUploader'
import GenerateButton from '@/components/GenerateButton'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAppState } from '@/hooks/useAppState'

export default function Home() {
  const {
    templates,
    selectedTemplate,
    selectedImage,
    currentStep,
    templatesLoading,
    isGenerating,
    generationProgress,
    generationError,
    generationResult,
    canStartGeneration,
    handleTemplateSelect,
    handleImageSelect,
    handleImageClear,
    handleStartGeneration,
    handleRetryGeneration,
    handleNewGeneration,
    clearError
  } = useAppState()

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <main className="max-w-6xl mx-auto">
          <Header />
          
          {currentStep === 'result' && generationResult ? (
            // Result Display
            <div className="max-w-2xl mx-auto">
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold mb-2">🎉 Your AI Pet Art is Ready!</h2>
                    <p className="text-gray-600">Here's your magical transformation</p>
                  </div>
                  
                  <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 mb-6">
                    <img 
                      src={generationResult.imageUrl} 
                      alt="Generated pet art"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={() => {
                        const link = document.createElement('a')
                        link.href = generationResult.imageUrl
                        link.download = `pet-ai-art-${Date.now()}.png`
                        link.click()
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      📥 Download Image
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleNewGeneration}
                    >
                      🎨 Create Another
                    </Button>
                  </div>
                  
                  <div className="mt-6 text-center text-sm text-gray-500">
                    <p>Template used: {generationResult.templateUsed.name}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            // Main Generation Flow
            <>
              {/* Two-column layout for template selection and image upload */}
              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                {/* Left side - Template Selection */}
                <div className="space-y-6">
                  <TemplateSelector
                    templates={templates}
                    selectedTemplate={selectedTemplate}
                    onTemplateSelect={handleTemplateSelect}
                    isLoading={templatesLoading}
                  />
                </div>
                
                {/* Right side - Image Upload and Generate */}
                <div className="space-y-6">
                  <ImageUploader
                    onImageSelect={handleImageSelect}
                    selectedImage={selectedImage}
                    isDisabled={isGenerating}
                  />
                  
                  <GenerateButton
                    onGenerate={handleStartGeneration}
                    isDisabled={!canStartGeneration}
                    isLoading={isGenerating}
                    loadingProgress={generationProgress}
                    selectedTemplate={selectedTemplate}
                    selectedImage={selectedImage}
                  />
                </div>
              </div>
              
              {/* Error Display */}
              {generationError && (
                <div className="max-w-2xl mx-auto mt-6">
                  <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-grow">
                          <h3 className="font-medium text-red-900 mb-1">Generation Failed</h3>
                          <p className="text-red-700 text-sm mb-3">{generationError}</p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={handleRetryGeneration}
                              disabled={!canStartGeneration}
                            >
                              🔄 Try Again
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={clearError}
                              className="text-red-600 hover:text-red-800"
                            >
                              Dismiss
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )}
        </main>
        
        <Footer />
      </div>
    </div>
  )
}