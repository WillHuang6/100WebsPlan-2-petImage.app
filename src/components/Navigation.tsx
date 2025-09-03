'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { useApp } from '@/contexts/AppContext'
import { Button } from '@/components/ui/button'

export const Navigation: React.FC = () => {
  const { user, signOut } = useAuth()
  const { openAuthModal } = useApp()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      console.log('Starting sign out...')
      await signOut()
      console.log('Sign out completed, redirecting to home...')
      // 重定向到首页
      window.location.href = '/'
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const handleAuthClick = () => {
    openAuthModal()
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm shadow-sm" style={{
      backgroundColor: 'rgba(255, 248, 240, 0.95)',
      borderBottom: '1px solid rgba(242, 153, 74, 0.2)'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 左侧 Logo 和导航 */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="relative w-10 h-10 rounded-full overflow-hidden p-0.5" style={{
                background: 'linear-gradient(135deg, #F2994A, #E17055)'
              }}>
                <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                  <Image
                    src="/images/logo.png"
                    alt="PetImage Logo"
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold" style={{ color: '#F2994A' }}>PetImage</span>
                <span className="text-xs -mt-1" style={{ color: '#8B4513' }}>AI Pet Art Generator</span>
              </div>
            </Link>

            {/* 主导航菜单 */}
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                href="/" 
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors"
                style={{ 
                  color: '#8B4513',
                }}
                onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#F2994A'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#8B4513'}
              >
                Features
              </Link>
              <Link 
                href="/pricing" 
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors"
                style={{ 
                  color: '#8B4513',
                }}
                onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#F2994A'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#8B4513'}
              >
                Pricing
              </Link>
              <Link 
                href="/faq" 
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors"
                style={{ 
                  color: '#8B4513',
                }}
                onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#F2994A'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#8B4513'}
              >
                FAQs
              </Link>
              {user && (
                <Link 
                  href="/history" 
                  className="px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  style={{ 
                    color: '#8B4513',
                  }}
                  onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#F2994A'}
                  onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#8B4513'}
                >
                  My Artworks History
                </Link>
              )}
            </div>
          </div>

          {/* 右侧工具栏 */}
          <div className="flex items-center space-x-4">
            {/* 用户账户区域 */}
            {user ? (
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-700 hover:text-rose-600 hover:bg-rose-50"
                  onClick={() => {
                    console.log('User menu toggle clicked!')
                    setIsUserMenuOpen(!isUserMenuOpen)
                  }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center text-white text-sm font-medium mr-2">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline">
                    {user.email?.split('@')[0]}
                  </span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Button>
                
                {/* 用户下拉菜单 */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <button
                        onClick={(e) => {
                          console.log('Sign Out button clicked from dropdown!')
                          e.preventDefault()
                          e.stopPropagation()
                          setIsUserMenuOpen(false)
                          handleSignOut()
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 hover:text-red-700 transition-colors cursor-pointer"
                      >
                        <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleAuthClick}
                  className="transition-colors"
                  style={{
                    color: '#8B4513',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = '#F2994A';
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(242, 153, 74, 0.1)'
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = '#8B4513';
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
                  }}
                >
                  Sign In
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleAuthClick}
                  className="text-white font-semibold"
                  style={{
                    background: 'linear-gradient(135deg, #F2994A, #E17055)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, #E17055, #D2691E)'
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, #F2994A, #E17055)'
                  }}
                >
                  Get Started
                </Button>
              </div>
            )}

            {/* 移动端菜单按钮 */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-700 hover:text-rose-600 hover:bg-rose-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation