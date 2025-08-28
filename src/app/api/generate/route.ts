import { NextRequest, NextResponse } from 'next/server'
import { getTemplateById } from '@/config/templates'
import { validateImageFile } from '@/lib/imageUtils'
import Replicate from 'replicate'

// 初始化 Replicate
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File
    const templateId = formData.get('templateId') as string

    // Validation
    if (!image) {
      return NextResponse.json({ message: 'No image provided' }, { status: 400 })
    }

    if (!templateId) {
      return NextResponse.json({ message: 'No template ID provided' }, { status: 400 })
    }

    // Check if template exists
    const template = getTemplateById(templateId)
    if (!template) {
      return NextResponse.json({ message: 'Template not found' }, { status: 404 })
    }

    // Validate image file
    const validation = validateImageFile(image)
    if (!validation.valid) {
      return NextResponse.json({ message: validation.error }, { status: 400 })
    }

    console.log(`🚀 Processing image generation: ${image.name}, template: ${template.name}`)

    // Step 1: Convert image to base64 data URI (alternative to file upload)
    console.log('📤 Converting image to base64...')
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const mimeType = image.type
    const dataUri = `data:${mimeType};base64,${base64}`
    
    console.log('✅ Image converted to base64, size:', Math.round(base64.length / 1024), 'KB')

    // Step 2: Call Replicate API
    console.log('🎨 Calling Replicate API...')
    const input = {
      prompt: template.prompt,
      image_input: [dataUri], // Try base64 data URI instead of URL
    }

    console.log('📝 Replicate input:', { 
      prompt: input.prompt.substring(0, 100) + '...', 
      image_count: input.image_input.length 
    })

    const output = await replicate.run("google/nano-banana", { input })
    console.log('🎉 Replicate generation completed!')

    // Step 3: Process output
    let resultImageUrl: string
    
    if (output && typeof output === 'object' && 'url' in output) {
      // If output has a url method
      resultImageUrl = (output as any).url()
    } else if (typeof output === 'string') {
      // If output is directly a URL string
      resultImageUrl = output
    } else if (Array.isArray(output) && output.length > 0) {
      // If output is an array, take the first result
      resultImageUrl = output[0]
    } else {
      throw new Error('Unexpected output format from Replicate')
    }

    console.log('📸 Generated image URL:', resultImageUrl)

    // Return success response
    return NextResponse.json({
      success: true,
      id: `gen_${Date.now()}`,
      imageUrl: resultImageUrl,
      message: 'Image generated successfully',
      templateUsed: template
    })

  } catch (error) {
    console.error('❌ Generation API error:', error)
    
    // Return detailed error for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { 
        message: 'Image generation failed', 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}

// 添加 OPTIONS 方法支持 CORS
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