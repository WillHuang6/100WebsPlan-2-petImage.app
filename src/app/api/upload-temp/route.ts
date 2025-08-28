import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { generateTempFileName, validateImageFile } from '@/lib/imageUtils'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // 验证文件
    const validation = validateImageFile(file)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    // 生成临时文件名
    const fileName = generateTempFileName(file.name)
    
    // 确保临时目录存在
    const tempDir = join(process.cwd(), 'public', 'temp')
    try {
      await mkdir(tempDir, { recursive: true })
    } catch (error) {
      // 目录可能已存在，忽略错误
    }

    // 将文件保存到 public/temp 目录
    const filePath = join(tempDir, fileName)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    await writeFile(filePath, buffer)

    // 返回可访问的URL
    const publicUrl = `/temp/${fileName}`
    const fullUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${publicUrl}`

    return NextResponse.json({
      success: true,
      url: fullUrl,
      filename: fileName
    })

  } catch (error) {
    console.error('Temp upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}