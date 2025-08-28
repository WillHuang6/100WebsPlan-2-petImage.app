import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-server'
import { getUserGenerations } from '@/lib/database'

// GET /api/generations - 获取用户的生成历史
export async function GET(request: NextRequest) {
  try {
    // 用户认证检查
    const { user, error: authError } = await requireAuth()
    if (authError || !user) {
      return NextResponse.json(
        { message: 'Authentication required', error: authError },
        { status: 401 }
      )
    }

    // 获取查询参数
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')

    // 从数据库获取用户的生成记录
    const { generations, error: dbError } = await getUserGenerations(user.id, limit)
    
    if (dbError) {
      console.error('Failed to fetch user generations:', dbError)
      return NextResponse.json(
        { message: 'Failed to fetch generation history', error: dbError },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      generations,
      total: generations.length
    })

  } catch (error: any) {
    console.error('Generations API error:', error)
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}