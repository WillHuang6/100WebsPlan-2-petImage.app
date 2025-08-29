import { NextRequest, NextResponse } from 'next/server'
import { getTemplateById } from '@/config/templates'
import { validateImageFile } from '@/lib/imageUtils'
import { requireAuth } from '@/lib/auth-server'
import { createGeneration, updateGeneration, generateShareToken } from '@/lib/database'
import { uploadToStorage, downloadFileAsBlob, generateStoragePath } from '@/lib/storage'
import { createAdminClient } from '@/lib/supabase-server'
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
    console.log('=== DEBUG INFO ===')
    console.log('User ID:', user.id)
    console.log('User ID type:', typeof user.id)
    console.log('User ID length:', user.id.length)
    console.log('User email:', user.email)
    console.log('User role:', user.role)

    // 5. 检查用户credits并扣除
    const supabase = createAdminClient();
    
    // 查找用户profile
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id);
    
    if (profileError || !profiles || profiles.length === 0) {
      console.error('用户profile查询失败:', profileError);
      return NextResponse.json(
        { message: '用户profile不存在，请先完成注册' },
        { status: 400 }
      );
    }
    
    const profile = profiles[0] as any;
    
    // 检查credits余额
    if (profile.credits < 1) {
      console.log('用户credits不足:', profile.credits);
      return NextResponse.json(
        { 
          message: 'Credits不足，请先购买套餐',
          needPurchase: true,
          currentCredits: profile.credits 
        },
        { status: 402 } // Payment Required
      );
    }
    
    // 扣除1个credit
    const { error: updateError } = await (supabase as any)
      .from('profiles')
      .update({
        credits: profile.credits - 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);
    
    if (updateError) {
      console.error('扣除credits失败:', updateError);
      return NextResponse.json(
        { message: '扣除credits失败，请重试' },
        { status: 500 }
      );
    }
    
    console.log(`Credits扣除成功，剩余: ${profile.credits - 1}`);

    // 6. 创建数据库记录 (status: pending)
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
      // 7. 上传原始图片到私有桶
      const originalImagePath = generateStoragePath(user.id, generation.id, 'original.jpg')
      console.log('=== STORAGE DEBUG ===')
      console.log('Generation ID:', generation.id)
      console.log('Storage path:', originalImagePath)
      console.log('Path parts:', originalImagePath.split('/'))
      console.log('Expected folder[1]:', originalImagePath.split('/')[0])
      console.log('User ID matches folder[1]:', user.id === originalImagePath.split('/')[0])
      
      const { url: originalImageUrl, error: uploadError } = await uploadToStorage(
        image,
        'pet-originals',
        originalImagePath
      )

      if (uploadError || !originalImageUrl) {
        console.error('Failed to upload original image:', uploadError)
        console.error('Upload error details:', {
          error: uploadError,
          url: originalImageUrl,
          path: originalImagePath,
          bucket: 'user-uploads',
          userId: user.id,
          generationId: generation.id
        })
        await updateGeneration(generation.id, { 
          status: 'failed', 
          error_message: `Upload failed: ${uploadError}` 
        })
        return NextResponse.json(
          { 
            message: 'Failed to upload image', 
            error: uploadError,
            details: {
              path: originalImagePath,
              bucket: 'user-uploads',
              userId: user.id
            }
          },
          { status: 500 }
        )
      }

      // 8. 更新数据库记录添加原图URL并设置为processing
      await updateGeneration(generation.id, {
        original_image_url: originalImageUrl,
        status: 'processing'
      })

      console.log('Calling Replicate API...')

      // 9. 转换图片为base64供Replicate使用
      const arrayBuffer = await image.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString('base64')
      const mimeType = image.type
      const dataUri = `data:${mimeType};base64,${base64}`

      // 10. 调用Replicate API
      const input = {
        prompt: template.prompt,
        image_input: [dataUri],
      }

      const output = await replicate.run("google/nano-banana", { input })
      
      console.log('Replicate response received:', Array.isArray(output) ? `${output.length} results` : typeof output)

      // 11. 处理Replicate结果
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

      // 12. 下载生成的图片并上传到公开桶
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
        'pet-results',
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

      // 13. 更新数据库记录为完成状态
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

      // 14. 返回成功结果
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
      console.error('Error stack:', error.stack)
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        cause: error.cause
      })
      
      // 更新数据库记录为失败状态
      if (generation?.id) {
        await updateGeneration(generation.id, {
          status: 'failed',
          error_message: error.message || 'Unknown error during generation'
        })
      }

      return NextResponse.json(
        { 
          message: 'Generation failed', 
          error: error.message,
          errorName: error.name,
          stack: error.stack?.split('\n').slice(0, 5) // 只返回前5行堆栈信息
        },
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