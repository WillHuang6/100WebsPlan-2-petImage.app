'use client'

import React from 'react'
import Image from 'next/image'

interface MuseumHeroProps {
  children: React.ReactNode
}

interface ImagePosition {
  src: string
  size: string
  rotate: string
  top?: string
  bottom?: string
  left?: string
  right?: string
}

const MuseumHero: React.FC<MuseumHeroProps> = ({ children }) => {
  // 选择10张代表性图片用于博物馆展示
  const galleryImages = [
    'birthday-cake.jpg',
    'balloon-bright.jpg', 
    'Christmas.jpg',
    'Halloween.jpg',
    'Easter.jpg',
    'Gift Box.jpg',
    'Gryffindor.jpg',
    'birthday-cake-side.jpg',
    'Oil Painting.jpg',
    'Royal Majesty.jpg'
  ]

  // 桌面端图片位置（只保留顶部5张）
  const desktopImagePositions: ImagePosition[] = [
    // 左上区域 
    { src: galleryImages[0], size: 'large', top: '8%', left: '5%', rotate: '-3deg' },
    { src: galleryImages[1], size: 'medium', top: '15%', left: '20%', rotate: '2deg' },
    { src: galleryImages[2], size: 'small', top: '5%', left: '35%', rotate: '-1deg' },
    
    // 右上区域
    { src: galleryImages[3], size: 'medium', top: '10%', right: '8%', rotate: '1deg' },
    { src: galleryImages[4], size: 'large', top: '18%', right: '25%', rotate: '-2deg' },
  ]

  // 移动端简化布局（只保留顶部3张）
  const mobileImagePositions: ImagePosition[] = [
    { src: galleryImages[0], size: 'medium', top: '10%', left: '8%', rotate: '-2deg' },
    { src: galleryImages[1], size: 'small', top: '8%', right: '10%', rotate: '2deg' },
    { src: galleryImages[2], size: 'medium', top: '15%', left: '25%', rotate: '1deg' },
  ]

  const getSizeStyles = (size: string) => {
    switch (size) {
      case 'large':
        return { width: '220px', height: '280px' }
      case 'medium':
        return { width: '180px', height: '220px' }
      case 'small':
        return { width: '140px', height: '180px' }
      default:
        return { width: '180px', height: '220px' }
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ 
      background: 'linear-gradient(135deg, #FFF8F0 0%, #FFEAA7 20%, #F2994A 40%, #FDEBD0 60%, #FFF5E6 100%)' 
    }}>
      {/* 博物馆背景纹理 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,69,19,0.03)_1px,transparent_1px)] [background-size:24px_24px]" />
      
      {/* 径向渐变蒙版 - 中心亮边缘暗的聚光灯效果 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_45%,transparent_40%,rgba(0,0,0,0.15)_100%)]" />
      
      {/* 艺术展品背景图片 - 桌面端 */}
      <div className="hidden md:block">
        {desktopImagePositions.map((position, index) => (
          <div
            key={`desktop-${index}`}
            className="absolute group transition-all duration-300 hover:scale-105 hover:z-20"
            style={{
              top: position.top,
              bottom: position.bottom,
              left: position.left,
              right: position.right,
              transform: `rotate(${position.rotate})`,
              ...getSizeStyles(position.size)
            }}
          >
            {/* 画框效果 */}
            <div className="relative h-full w-full">
              {/* 外框阴影 */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg shadow-lg transform translate-x-1 translate-y-1" />
              
              {/* 主画框 */}
              <div className="relative h-full w-full bg-white rounded-lg shadow-xl border border-amber-100 p-3">
                {/* 内框装饰 */}
                <div className="relative h-full w-full border-2 border-gradient-to-br from-amber-200 to-amber-100 rounded-md overflow-hidden">
                  <Image
                    src={`/images/gallery/${position.src}`}
                    alt="Pet artwork"
                    fill
                    className="object-cover transition-all duration-500"
                    style={{
                      opacity: 0.6, // 降低到60%透明度，减少干扰
                      filter: 'sepia(15%) saturate(0.8) contrast(0.9) blur(1px)' // 降低饱和度，增加模糊
                    }}
                    {...(index < 2 ? { priority: true } : { loading: "lazy" })}
                    sizes="(max-width: 768px) 0px, (max-width: 1200px) 200px, 300px"
                  />
                  
                  {/* 博物馆玻璃反光效果 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
              
              {/* 悬浮时的聚光效果 */}
              <div className="absolute -inset-4 bg-gradient-radial from-amber-200/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full blur-xl" />
            </div>
          </div>
        ))}
      </div>

      {/* 移动端简化布局 */}
      <div className="md:hidden">
        {mobileImagePositions.map((position, index) => (
          <div
            key={`mobile-${index}`}
            className="absolute"
            style={{
              top: position.top,
              bottom: position.bottom,
              left: position.left,
              right: position.right,
              transform: `rotate(${position.rotate})`,
              ...getSizeStyles(position.size)
            }}
          >
            <div className="relative h-full w-full">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg shadow-md transform translate-x-1 translate-y-1" />
              <div className="relative h-full w-full bg-white rounded-lg shadow-lg border border-amber-100 p-2">
                <div className="relative h-full w-full border border-amber-200 rounded-md overflow-hidden">
                  <Image
                    src={`/images/gallery/${position.src}`}
                    alt="Pet artwork"
                    fill
                    className="object-cover"
                    style={{
                      opacity: 0.5, // 移动端更透明，降低干扰
                      filter: 'sepia(20%) saturate(0.7) contrast(0.8) blur(1px)' // 进一步降低饱和度和对比度
                    }}
                    {...(index === 0 ? { priority: true } : { loading: "lazy" })}
                    sizes="(max-width: 768px) 150px, 0px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 中央内容区域 */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center max-w-4xl mx-auto px-4">
          {children}
        </div>
      </div>
      
      {/* 底部渐变遮罩，确保内容可读性 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/80 via-white/40 to-transparent pointer-events-none" />
    </div>
  )
}

export default MuseumHero