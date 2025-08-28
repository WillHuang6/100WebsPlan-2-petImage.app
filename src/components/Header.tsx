import React from 'react'

export const Header: React.FC = () => {
  return (
    <section className="text-center mb-8">
      {/* Logo and Brand */}
      <div className="flex items-center justify-center mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-400 via-rose-400 to-orange-400 flex items-center justify-center mr-3 shadow-lg">
          <span className="text-white font-bold text-xl">❤️</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Pet<span className="bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">Image</span>
        </h1>
      </div>

      {/* Warm Welcome Message */}
      <div className="mb-3">
        <p className="text-base text-rose-600 font-medium">💕 Made with love for pet parents 💕</p>
      </div>

      {/* Main Headline */}
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 bg-clip-text text-transparent leading-tight">
        Create stunning AI-generated pet images in seconds
      </h2>

      {/* Subtitle with warmer language */}
      <p className="text-base md:text-lg text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed">
        🌟 Turn precious moments with your furry family into beautiful, lasting memories 🌟
      </p>

      {/* Key Selling Points with warmer colors */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 px-4 py-2 rounded-full text-xs font-semibold shadow-sm border border-rose-200">
          ⚡ Lightning fast - 10 seconds
        </div>
        <div className="bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 px-4 py-2 rounded-full text-xs font-semibold shadow-sm border border-orange-200">
          🧠 Powered by Google Nano Banana
        </div>
        <div className="bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 px-4 py-2 rounded-full text-xs font-semibold shadow-sm border border-pink-200">
          🎨 Fresh templates added weekly
        </div>
      </div>

    </section>
  )
}

export default Header