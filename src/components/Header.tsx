import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useApp } from '@/contexts/AppContext'
import { UserMenu } from '@/components/UserMenu'
import { Button } from '@/components/ui/button'

export const Header: React.FC = () => {
  const { user } = useAuth()
  const { openAuthModal } = useApp()

  return (
    <section className="text-center mb-16 relative">
      {/* Logo and Brand */}
      <div className="flex items-center justify-center mb-8">
        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-400 via-rose-400 to-orange-400 flex items-center justify-center mr-4 shadow-lg">
          <span className="text-white font-bold text-2xl">❤️</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Pet<span className="bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">Image</span>
        </h1>
      </div>

      {/* Warm Welcome Message */}
      <div className="mb-6">
        <p className="text-lg text-rose-600 font-medium mb-2">💕 Made with love for pet parents 💕</p>
      </div>

      {/* Main Headline */}
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 bg-clip-text text-transparent leading-tight">
        Create stunning AI-generated pet images in seconds
      </h2>

      {/* Subtitle with warmer language */}
      <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-4xl mx-auto leading-relaxed">
        🌟 Turn precious moments with your furry family into beautiful, lasting memories 🌟
      </p>

      {/* Key Selling Points with warmer colors */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <div className="bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 px-6 py-3 rounded-full text-sm font-semibold shadow-sm border border-rose-200">
          ⚡ Lightning fast - 10 seconds
        </div>
        <div className="bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 px-6 py-3 rounded-full text-sm font-semibold shadow-sm border border-orange-200">
          🧠 Powered by Google Nano Banana
        </div>
        <div className="bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 px-6 py-3 rounded-full text-sm font-semibold shadow-sm border border-pink-200">
          🎨 Fresh templates added weekly
        </div>
      </div>

      {/* Trust indicators with warm messaging */}
      <div className="bg-gradient-to-r from-rose-50 to-orange-50 rounded-2xl p-6 max-w-2xl mx-auto border border-rose-100">
        <p className="text-sm text-rose-600 font-medium flex items-center justify-center gap-2">
          <span>🏆</span> 
          Trusted by thousands of loving pet parents worldwide
          <span>🐕</span>
          <span>🐱</span>
        </p>
      </div>

      {/* User Menu / Login Button */}
      <div className="absolute top-0 right-0">
        {user ? (
          <UserMenu />
        ) : (
          <Button
            onClick={openAuthModal}
            variant="outline"
            className="bg-white/80 backdrop-blur-sm hover:bg-white border-rose-200 text-rose-700 hover:text-rose-800"
          >
            登录 / 注册
          </Button>
        )}
      </div>
    </section>
  )
}

export default Header