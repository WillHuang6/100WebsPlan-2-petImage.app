'use client'

import React from 'react'
import Header from '@/components/Header'
import TemplateSelector from '@/components/TemplateSelector'
import ImageUploader from '@/components/ImageUploader'
import GenerateButton from '@/components/GenerateButton'
import Footer from '@/components/Footer'
import MuseumHero from '@/components/MuseumHero'
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
    <>
      {currentStep === 'result' && generationResult ? (
        // Result Display - 使用简洁背景
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <main className="max-w-7xl mx-auto">
              <Header />
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
            </main>
            <Footer />
          </div>
        </div>
      ) : (
        // Main Generation Flow - 使用博物馆风格背景
        <MuseumHero>
          <div className="relative">
            <Header />
            
            {/* 主要内容区域 */}
            <div className="mt-8 mb-16">
              {/* 品牌标题区域 */}
              <div className="text-center mb-12 relative">
                {/* 渐变聚光背景 - 从中心向外扩散 */}
                <div className="absolute inset-0 -inset-x-24 -inset-y-16">
                  <div className="w-full h-full bg-gradient-radial from-white/80 via-white/40 to-transparent rounded-full blur-2xl"></div>
                </div>
                
                {/* 标题内容 */}
                <div className="relative z-10">
                  {/* 主标题 - 合并为一行 */}
                  <h1 className="text-4xl md:text-5xl font-bold mb-8 relative leading-tight" style={{
                    textShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    <span style={{ color: '#F2994A' }}>PetImage</span>
                    <span style={{ color: '#8B4513' }}> - Create stunning AI pet portraits in seconds</span>
                  </h1>
                  
                  {/* 功能特点 - 浮动标签 */}
                  <div className="flex flex-wrap justify-center gap-3">
                    <div className="px-4 py-2 rounded-full shadow-md" style={{ backgroundColor: '#FFF5E6' }}>
                      <span className="text-sm font-semibold" style={{ color: '#D2691E' }}>Super Fast</span>
                    </div>
                    <div className="px-4 py-2 rounded-full shadow-md" style={{ backgroundColor: '#FDEBD0' }}>
                      <span className="text-sm font-semibold" style={{ color: '#8B4513' }}>Powered by Google Nano</span>
                    </div>
                    <div className="px-4 py-2 rounded-full shadow-md" style={{ backgroundColor: '#FFE8D6' }}>
                      <span className="text-sm font-semibold" style={{ color: '#CD853F' }}>Weekly update</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 功能区域 */}
              <div className="max-w-6xl mx-auto">
                <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6 lg:gap-8">
                  {/* Left side - Template Selection (3/4 width = 75%) */}
                  <div className="lg:col-span-3 order-2 lg:order-1">
                    <div className="rounded-2xl p-6 shadow-2xl min-h-[500px] lg:min-h-[600px] relative overflow-hidden" style={{
                      backgroundColor: 'rgba(255, 248, 240, 0.95)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(242, 153, 74, 0.3)'
                    }}>
                      {/* 内部聚光效果 */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none"></div>
                      <div className="relative z-10">
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
                  </div>
                  
                  {/* Right side - Image Upload and Generate (1/4 width = 25%) */}
                  <div className="lg:col-span-1 order-1 lg:order-2">
                    <div className="rounded-2xl p-6 shadow-2xl min-h-[400px] lg:min-h-[600px] flex flex-col relative overflow-hidden" style={{
                      backgroundColor: 'rgba(255, 248, 240, 0.95)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(242, 153, 74, 0.3)'
                    }}>
                      {/* 内部聚光效果 */}
                      <div className="absolute inset-0 bg-gradient-to-tl from-white/40 via-transparent to-transparent pointer-events-none"></div>
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="mb-6">
                          <h2 className="text-xl font-bold mb-2" style={{
                            color: '#8B4513',
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}>
                            💖 Make Art
                          </h2>
                          <p className="font-medium" style={{ color: '#A0522D' }}>
                            Upload a photo to start creating
                          </p>
                        </div>
                        
                        <div className="flex-1 flex flex-col space-y-6">
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
                </div>
              </div>
            </div>
            
            <Footer />
          </div>
        </MuseumHero>
      )}
    </>
  )
}