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

    // 使用数据库事务确保credits扣除和使用记录的原子性
    const result = await prisma.$transaction(async (tx) => {
      // 1. 检查用户credits
      const userRecord = await tx.user.findUnique({
        where: { email: user.email! }
      });

      if (!userRecord) {
        throw new Error('用户记录不存在');
      }

      if (userRecord.credits < 1) {
        throw new Error('credits不足，请先购买套餐');
      }

      // 2. 扣除credits
      const updatedUser = await tx.user.update({
        where: { email: user.email! },
        data: {
          credits: { decrement: 1 }
        }
      });

      // 3. 生成图片
      console.log('开始生成图片，剩余credits:', updatedUser.credits);
      
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

      // 4. 记录使用历史
      const usage = await tx.usage.create({
        data: {
          userId: userRecord.id,
          imageUrl: imageUrl as string,
          prompt: fullPrompt,
          model: 'stable-diffusion',
          creditsUsed: 1
        }
      });

      return {
        imageUrl,
        remainingCredits: updatedUser.credits,
        usageId: usage.id
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