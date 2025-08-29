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
    needPurchase,
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
                    error={generationError}
                    needPurchase={needPurchase}
                    onClearError={clearError}
                  />
                </div>
              </div>
              
            </>
          )}
        </main>
        
        <Footer />
      </div>
    </div>
  )
}