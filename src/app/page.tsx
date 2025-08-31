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
    themes,
    selectedTemplate,
    selectedTheme,
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
    handleThemeSelect,
    handleImageSelect,
    handleImageClear,
    handleStartGeneration,
    handleRetryGeneration,
    handleNewGeneration,
    clearError
  } = useAppState()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <main className="max-w-7xl mx-auto">
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
            // Main Generation Flow with 3:1 ratio
            <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6 lg:gap-8 mb-8">
              {/* Left side - Template Selection (3/4 width) */}
              <div className="lg:col-span-3 order-2 lg:order-1">
                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm min-h-[500px] lg:min-h-[600px]">
                  <TemplateSelector
                    templates={templates}
                    themes={themes}
                    selectedTemplate={selectedTemplate}
                    selectedTheme={selectedTheme}
                    onTemplateSelect={handleTemplateSelect}
                    onThemeSelect={handleThemeSelect}
                    isLoading={templatesLoading}
                  />
                </div>
              </div>
              
              {/* Right side - Image Upload and Generate (1/4 width) */}
              <div className="lg:col-span-1 order-1 lg:order-2">
                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm min-h-[400px] lg:min-h-[600px] flex flex-col">
                  <div className="mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                      💖 Make Pet Art
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600">
                      Upload a photo to start creating
                    </p>
                  </div>
                  
                  <div className="flex-1 flex flex-col space-y-4 sm:space-y-6">
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
              </div>
            </div>
          )}
        </main>
        
        <Footer />
      </div>
    </div>
  )
}