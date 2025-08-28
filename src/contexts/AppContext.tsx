'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface AppState {
  // 登录Modal控制
  isAuthModalOpen: boolean
  openAuthModal: () => void
  closeAuthModal: () => void
  
  // 游客状态下的临时数据
  guestSelectedTemplate: string | null
  guestSelectedImage: File | null
  setGuestSelectedTemplate: (templateId: string | null) => void
  setGuestSelectedImage: (image: File | null) => void
  clearGuestData: () => void
}

const AppContext = createContext<AppState | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [guestSelectedTemplate, setGuestSelectedTemplate] = useState<string | null>(null)
  const [guestSelectedImage, setGuestSelectedImage] = useState<File | null>(null)

  const openAuthModal = () => setIsAuthModalOpen(true)
  const closeAuthModal = () => setIsAuthModalOpen(false)
  
  const clearGuestData = () => {
    setGuestSelectedTemplate(null)
    setGuestSelectedImage(null)
  }

  const value = {
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    guestSelectedTemplate,
    guestSelectedImage,
    setGuestSelectedTemplate,
    setGuestSelectedImage,
    clearGuestData
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}