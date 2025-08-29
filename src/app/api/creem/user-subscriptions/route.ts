import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: '用户未认证' },
        { status: 401 }
      );
    }

    // 查找用户购买记录
    const userRecord = await prisma.user.findUnique({
      where: { email: user.email! },
      include: {
        purchases: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!userRecord) {
      return NextResponse.json({
        purchases: [],
        credits: 0
      });
    }

    return NextResponse.json({
      purchases: userRecord.purchases,
      credits: userRecord.credits,
      totalCredits: userRecord.totalCredits
    });
  } catch (error) {
    console.error('获取用户订阅失败:', error);
    return NextResponse.json(
      { error: '获取用户订阅失败' },
      { status: 500 }
    );
  }
}