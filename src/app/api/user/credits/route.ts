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

    // 查询用户credits
    const userRecord = await prisma.user.findUnique({
      where: { email: user.email! },
      select: {
        credits: true,
        totalCredits: true,
        purchases: {
          select: {
            id: true,
            productName: true,
            credits: true,
            amount: true,
            currency: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 10 // 最近10次购买记录
        },
        usages: {
          select: {
            id: true,
            imageUrl: true,
            prompt: true,
            creditsUsed: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 20 // 最近20次使用记录
        }
      }
    });

    if (!userRecord) {
      // 如果用户不存在，创建用户记录
      const newUser = await prisma.user.create({
        data: {
          email: user.email!,
          name: user.user_metadata?.name || user.email!.split('@')[0],
          emailVerified: true
        }
      });
      
      return NextResponse.json({
        credits: 0,
        totalCredits: 0,
        purchases: [],
        usages: []
      });
    }

    return NextResponse.json({
      credits: userRecord.credits,
      totalCredits: userRecord.totalCredits,
      purchases: userRecord.purchases,
      usages: userRecord.usages
    });

  } catch (error) {
    console.error('获取用户credits失败:', error);
    return NextResponse.json(
      { error: '获取用户credits失败' },
      { status: 500 }
    );
  }
}