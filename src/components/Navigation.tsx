'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { useApp } from '@/contexts/AppContext'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const Navigation: React.FC = () => {
  const { user, signOut } = useAuth()
  const { openAuthModal } = useApp()
  const [language, setLanguage] = useState('中文')

  const handleSignOut = async () => {
    await signOut()
  }

  const handleAuthClick = () => {
    openAuthModal()
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 左侧 Logo 和导航 */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-rose-500 to-pink-500 p-0.5">
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
                <span className="text-xl font-bold text-gray-900">PetImage</span>
                <span className="text-xs text-gray-500 -mt-1">AI Pet Art Generator</span>
              </div>
            </Link>

            {/* 主导航菜单 */}
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-rose-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Features
              </Link>
              <Link 
                href="/pricing" 
                className="text-gray-700 hover:text-rose-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Pricing
              </Link>
              <Link 
                href="/faq" 
                className="text-gray-700 hover:text-rose-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                FAQs
              </Link>
              {user && (
                <Link 
                  href="/history" 
                  className="text-gray-700 hover:text-rose-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  My Artworks
                </Link>
              )}
            </div>
          </div>

          {/* 右侧工具栏 */}
          <div className="flex items-center space-x-4">
            {/* 语言选择器 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-700 hover:text-rose-600 hover:bg-rose-50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21L6.8 10.6a11.05 11.05 0 005.6 5.6l1.213-3.424a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {language}
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem onClick={() => setLanguage('中文')}>
                  🇨🇳 中文
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('English')}>
                  🇺🇸 English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 用户账户区域 */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-700 hover:text-rose-600 hover:bg-rose-50"
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
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/history" className="w-full">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      My Artworks
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleAuthClick}
                  className="text-gray-700 hover:text-rose-600 hover:bg-rose-50"
                >
                  Sign In
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleAuthClick}
                  className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
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