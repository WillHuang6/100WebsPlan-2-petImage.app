'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase-client'
import type { Database } from '@/lib/supabase-types'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  signInWithProvider: (provider: 'google' | 'github') => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        // User profile will be automatically created by database trigger
        // No manual profile creation needed here
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setLoading(false)
    return { error }
  }

  const signUp = async (email: string, password: string, displayName?: string) => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName || email,
        },
      },
    })
    setLoading(false)
    return { error }
  }

  const signOut = async () => {
    console.log('AuthContext: signOut called')
    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('AuthContext: signOut error:', error)
        throw error
      }
      console.log('AuthContext: signOut successful')
      // 清除本地状态
      setUser(null)
      setSession(null)
    } catch (error) {
      console.error('AuthContext: signOut exception:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signInWithProvider = async (provider: 'google' | 'github') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    return { error }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithProvider,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}