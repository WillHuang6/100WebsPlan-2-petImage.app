import { NextRequest, NextResponse } from 'next/server'
import { getTemplateById } from '@/config/templates'
import { validateImageFile } from '@/lib/imageUtils'
import { requireAuth } from '@/lib/auth-server'
import { createGeneration, updateGeneration, generateShareToken } from '@/lib/database'
import { uploadToStorage, downloadFileAsBlob, generateStoragePath } from '@/lib/storage'
import Replicate from 'replicate'

// 初始化 Replicate
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function POST(request: NextRequest) {
  try {
    // 1. 用户认证检查
    const { user, error: authError } = await requireAuth()
    if (authError || !user) {
      return NextResponse.json(
        { message: 'Authentication required', error: authError },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const image = formData.get('image') as File
    const templateId = formData.get('templateId') as string

    // 2. 基础验证
    if (!image) {
      return NextResponse.json({ message: 'No image provided' }, { status: 400 })
    }

    if (!templateId) {
      return NextResponse.json({ message: 'No template ID provided' }, { status: 400 })
    }

    // 3. 检查模板是否存在
    const template = getTemplateById(templateId)
    if (!template) {
      return NextResponse.json({ message: 'Template not found' }, { status: 404 })
    }

    // 4. 验证图片文件
    const validation = validateImageFile(image)
    if (!validation.valid) {
      return NextResponse.json({ message: validation.error || 'Invalid image file' }, { status: 400 })
    }

    console.log(`Starting generation for user: ${user.id}, template: ${templateId}`)

    // 5. 创建数据库记录 (status: pending)
    const { generation, error: dbError } = await createGeneration({
      user_id: user.id,
      template_id: templateId,
      original_image_url: '', // 待上传后填入
      status: 'pending'
    })

    if (dbError || !generation) {
      console.error('Failed to create generation record:', dbError)
      return NextResponse.json(
        { message: 'Failed to create generation record', error: dbError },
        { status: 500 }
      )
    }

    try {
      // 6. 上传原始图片到私有桶
      const originalImagePath = generateStoragePath(user.id, generation.id, 'original.jpg')
      const { url: originalImageUrl, error: uploadError } = await uploadToStorage(
        image,
        'user-uploads',
        originalImagePath
      )

      if (uploadError || !originalImageUrl) {
        console.error('Failed to upload original image:', uploadError)
        await updateGeneration(generation.id, { 
          status: 'failed', 
          error_message: `Upload failed: ${uploadError}` 
        })
        return NextResponse.json(
          { message: 'Failed to upload image', error: uploadError },
          { status: 500 }
        )
      }

      // 7. 更新数据库记录添加原图URL并设置为processing
      await updateGeneration(generation.id, {
        original_image_url: originalImageUrl,
        status: 'processing'
      })

      console.log('Calling Replicate API...')

      // 8. 转换图片为base64供Replicate使用
      const arrayBuffer = await image.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString('base64')
      const mimeType = image.type
      const dataUri = `data:${mimeType};base64,${base64}`

      // 9. 调用Replicate API
      const input = {
        prompt: template.prompt,
        image_input: [dataUri],
      }

      const output = await replicate.run("google/nano-banana", { input })
      
      console.log('Replicate response received:', Array.isArray(output) ? `${output.length} results` : typeof output)

      // 10. 处理Replicate结果
      let replicateImageUrl: string
      
      if (output && typeof output === 'object' && 'url' in output) {
        replicateImageUrl = (output as any).url()
      } else if (typeof output === 'string') {
        replicateImageUrl = output
      } else if (Array.isArray(output) && output.length > 0) {
        replicateImageUrl = output[0]
      } else {
        await updateGeneration(generation.id, {
          status: 'failed',
          error_message: 'Replicate API returned unexpected format'
        })
        return NextResponse.json(
          { message: 'Failed to generate image - unexpected AI response format' },
          { status: 500 }
        )
      }

      // 11. 下载生成的图片并上传到公开桶
      const generatedBlob = await downloadFileAsBlob(replicateImageUrl)
      if (!generatedBlob) {
        await updateGeneration(generation.id, {
          status: 'failed',
          error_message: 'Failed to download generated image'
        })
        return NextResponse.json(
          { message: 'Failed to process generated image' },
          { status: 500 }
        )
      }

      const generatedImagePath = generateStoragePath(user.id, generation.id, 'result.jpg')
      const { url: generatedImageUrl, error: generatedUploadError } = await uploadToStorage(
        generatedBlob,
        'generated-images',
        generatedImagePath
      )

      if (generatedUploadError || !generatedImageUrl) {
        console.error('Failed to upload generated image:', generatedUploadError)
        await updateGeneration(generation.id, {
          status: 'failed',
          error_message: `Generated image upload failed: ${generatedUploadError}`
        })
        return NextResponse.json(
          { message: 'Failed to save generated image', error: generatedUploadError },
          { status: 500 }
        )
      }

      // 12. 更新数据库记录为完成状态
      const { generation: finalGeneration, error: finalUpdateError } = await updateGeneration(generation.id, {
        generated_image_url: generatedImageUrl,
        status: 'completed',
        share_token: generateShareToken()
      })

      if (finalUpdateError) {
        console.error('Failed to update generation record:', finalUpdateError)
        // 即使更新失败，也返回成功结果，因为图片已经生成了
      }

      console.log(`Generation completed successfully: ${generation.id}`)

      // 13. 返回成功结果
      return NextResponse.json({
        success: true,
        generationId: generation.id,
        imageUrl: generatedImageUrl,
        template: {
          id: template.id,
          name: template.name,
        },
        shareToken: finalGeneration?.share_token || null,
        message: 'Image generated successfully'
      })

    } catch (error: any) {
      console.error('Generation process error:', error)
      
      // 更新数据库记录为失败状态
      await updateGeneration(generation.id, {
        status: 'failed',
        error_message: error.message || 'Unknown error during generation'
      })

      return NextResponse.json(
        { message: 'Generation failed', error: error.message },
        { status: 500 }
      )
    }

  } catch (error: any) {
    console.error('API route error:', error)
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}

// OPTIONS 方法支持 CORS
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