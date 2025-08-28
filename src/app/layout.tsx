import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { AppProvider } from '@/contexts/AppContext'
import { AuthGuard } from '@/components/AuthGuard'
import { AuthModalWrapper } from '@/components/AuthModalWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PetImage - AI Pet Art Generator',
  description: 'Create stunning AI-generated pet images in seconds',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <AuthProvider>
          <AppProvider>
            <AuthGuard>
              {children}
            </AuthGuard>
            <AuthModalWrapper />
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  )
}