import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { prisma } from '@/lib/prisma';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(request: NextRequest) {
  try {
    // 获取当前用户
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (!user || authError) {
      return NextResponse.json(
        { error: '用户未认证' },
        { status: 401 }
      );
    }

    const { prompt, petType, style } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: '缺少prompt参数' },
        { status: 400 }
      );
    }

    // 使用数据库事务确保credits扣除和生成记录的原子性
    const result = await prisma.$transaction(async (tx) => {
      // 1. 检查用户profile和credits
      const profile = await tx.profile.findUnique({
        where: { email: user.email! }
      });

      if (!profile) {
        throw new Error('用户profile不存在');
      }

      if (profile.credits < 1) {
        throw new Error('credits不足，请先购买套餐');
      }

      // 2. 扣除credits
      const updatedProfile = await tx.profile.update({
        where: { email: user.email! },
        data: {
          credits: { decrement: 1 }
        }
      });

      // 3. 生成图片
      console.log('开始生成图片，剩余credits:', updatedProfile.credits);
      
      // 构造完整的提示词
      const fullPrompt = `A ${style || 'realistic'} portrait of a ${petType || 'pet'}, ${prompt}, high quality, detailed`;

      const output = await replicate.run(
        "stability-ai/stable-diffusion:27b93a2413e7f36cd83da926f3656280b2931564ff050bf9575f1fdf9bcd7478",
        {
          input: {
            prompt: fullPrompt,
            negative_prompt: "blurry, low quality, distorted, ugly",
            width: 512,
            height: 512,
            num_inference_steps: 20,
            guidance_scale: 7.5,
            num_outputs: 1
          }
        }
      );

      const imageUrl = Array.isArray(output) ? output[0] : output;

      // 4. 创建generation记录
      const generation = await tx.generation.create({
        data: {
          user_id: profile.id,
          generated_image_url: imageUrl as string,
          template_id: `${petType || 'pet'}-${style || 'realistic'}`,
          status: 'completed'
        }
      });

      return {
        imageUrl,
        remainingCredits: updatedProfile.credits,
        generationId: generation.id
      };
    });

    console.log('图片生成成功:', result);
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('图片生成失败:', error);
    
    // 如果是credits不足的错误，返回特殊状态码
    if (error.message?.includes('credits不足')) {
      return NextResponse.json(
        { 
          error: error.message,
          needPurchase: true 
        },
        { status: 402 } // Payment Required
      );
    }

    return NextResponse.json(
      { 
        error: error.message || '图片生成失败',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}