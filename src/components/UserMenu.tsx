'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const UserMenu: React.FC = () => {
  const { user, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-full hover:bg-white/20 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-rose-400 to-orange-400 rounded-full flex items-center justify-center">
          {user.user_metadata?.avatar_url ? (
            <img 
              src={user.user_metadata.avatar_url} 
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <span className="text-white text-sm font-medium">
              {user.email?.charAt(0).toUpperCase() || '?'}
            </span>
          )}
        </div>
        <span className="text-gray-700 font-medium hidden md:block">
          {user.user_metadata?.display_name || user.email?.split('@')[0] || '用户'}
        </span>
        <svg 
          className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* 下拉菜单 */}
          <Card className="absolute right-0 top-full mt-2 w-64 z-20 shadow-lg">
            <CardContent className="p-4">
              <div className="border-b pb-3 mb-3">
                <p className="font-medium text-gray-900">
                  {user.user_metadata?.display_name || user.email?.split('@')[0]}
                </p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              
              <div className="space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-left p-2"
                  onClick={() => {
                    setIsOpen(false)
                    // TODO: 实现查看历史记录功能
                  }}
                >
                  📋 我的生成历史
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-left p-2"
                  onClick={() => {
                    setIsOpen(false)
                    // TODO: 实现个人设置功能
                  }}
                >
                  ⚙️ 个人设置
                </Button>
                
                <hr className="my-2" />
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-left p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleSignOut}
                >
                  🚪 退出登录
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

export default UserMenu