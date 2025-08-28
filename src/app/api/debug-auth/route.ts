import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-server'

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await requireAuth()
    
    if (error || !user) {
      return NextResponse.json({
        authenticated: false,
        error: error || 'No user found',
        user: null
      })
    }

    return NextResponse.json({
      authenticated: true,
      error: null,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        // 不返回敏感信息
      },
      debug: {
        userIdType: typeof user.id,
        userIdLength: user.id.length,
        samplePath: `${user.id}/test-generation-id/original.jpg`,
        foldernameParts: `${user.id}/test-generation-id/original.jpg`.split('/'),
      }
    })
  } catch (err: any) {
    return NextResponse.json({
      authenticated: false,
      error: err.message,
      user: null
    }, { status: 500 })
  }
}