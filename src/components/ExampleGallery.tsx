'use client'

import React from 'react'
import Image from 'next/image'

interface ExampleImage {
  id: string
  src: string
  alt: string
  originalPet: string
}

// 基于真实生成效果的示例数据
const exampleImages: ExampleImage[] = [
  {
    id: '1',
    src: 'placeholder-birthday-cake',
    alt: '纪念日蛋糕氛围 - 正面庆祝场景',
    originalPet: '柯基犬'
  },
  {
    id: '2', 
    src: 'placeholder-side-cake',
    alt: '纪念日蛋糕氛围（侧面）- 烛光照亮',
    originalPet: '柯基犬'
  },
  {
    id: '3',
    src: 'placeholder-balloons', 
    alt: '明亮气球氛围 - 彩色气球派对',
    originalPet: '柯基犬'
  },
  {
    id: '4',
    src: 'placeholder-figure', 
    alt: '宠物手办 - 收藏级模型',
    originalPet: '柯基犬'
  }
]

export const ExampleGallery: React.FC = () => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">
        See What's Possible
      </h2>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
        Real transformations from pet parents like you
      </p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {exampleImages.map((image, index) => {
          // 为每个模板类型定义不同的样式
          const getStyleForType = (src: string) => {
            if (src.includes('birthday-cake')) return {
              gradient: 'from-pink-100 to-red-100',
              iconColor: 'text-pink-600',
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              )
            }
            if (src.includes('side-cake')) return {
              gradient: 'from-orange-100 to-yellow-100',
              iconColor: 'text-orange-600',
              icon: (
                <>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                </>
              )
            }
            if (src.includes('balloons')) return {
              gradient: 'from-purple-100 to-blue-100',
              iconColor: 'text-purple-600',
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              )
            }
            if (src.includes('figure')) return {
              gradient: 'from-green-100 to-teal-100',
              iconColor: 'text-green-600',
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              )
            }
            return {
              gradient: 'from-blue-100 to-purple-100',
              iconColor: 'text-blue-600',
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              )
            }
          }
          
          const style = getStyleForType(image.src)
          
          return (
            <div 
              key={image.id} 
              className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className={`bg-gradient-to-br ${style.gradient} aspect-[3/4] flex items-center justify-center`}>
                <div className="text-center p-4">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/30 flex items-center justify-center">
                    <svg className={`w-8 h-8 ${style.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {style.icon}
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-800">{image.alt}</p>
                  <p className="text-xs text-gray-600 mt-1">✨ AI Generated</p>
                  <div className="mt-2 text-xs text-gray-500">
                    来自用户: {image.originalPet}
                  </div>
                </div>
              </div>
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-white text-center">
                  <p className="text-sm font-medium mb-2">🎨 {image.alt}</p>
                  <p className="text-xs">上传图片体验此效果</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="text-center mt-8">
        <p className="text-sm text-gray-500">
          💡 Upload your pet's photo to create something amazing
        </p>
      </div>
    </section>
  )
}

export default ExampleGallery