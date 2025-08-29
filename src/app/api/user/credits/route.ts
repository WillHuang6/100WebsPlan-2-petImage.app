import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
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

    // 查询用户profile和相关数据
    const profile = await prisma.profile.findUnique({
      where: { email: user.email! },
      select: {
        credits: true,
        total_credits: true,
        purchases: {
          select: {
            id: true,
            product_name: true,
            credits: true,
            amount: true,
            currency: true,
            created_at: true
          },
          orderBy: { created_at: 'desc' },
          take: 10 // 最近10次购买记录
        },
        generations: {
          select: {
            id: true,
            generated_image_url: true,
            template_id: true,
            status: true,
            created_at: true
          },
          orderBy: { created_at: 'desc' },
          take: 20 // 最近20次生成记录
        }
      }
    });

    if (!profile) {
      // 如果用户profile不存在，创建profile记录
      const newProfile = await prisma.profile.create({
        data: {
          email: user.email!,
          display_name: user.user_metadata?.name || user.email!.split('@')[0]
        }
      });
      
      return NextResponse.json({
        credits: 0,
        total_credits: 0,
        purchases: [],
        generations: []
      });
    }

    return NextResponse.json({
      credits: profile.credits,
      total_credits: profile.total_credits,
      purchases: profile.purchases,
      generations: profile.generations
    });

  } catch (error) {
    console.error('获取用户credits失败:', error);
    return NextResponse.json(
      { error: '获取用户credits失败' },
      { status: 500 }
    );
  }
}