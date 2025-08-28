'use client'

import { useApp } from '@/contexts/AppContext'
import { AuthModal } from '@/components/AuthModal'

export const AuthModalWrapper: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal } = useApp()
  
  return (
    <AuthModal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
    />
  )
}

export default AuthModalWrapper