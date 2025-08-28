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

    // 使用邮箱查找用户订阅（临时方案，实际应该用正确的用户ID映射）
    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: user.email || user.id,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    const purchases = await prisma.oneTimePurchase.findMany({
      where: {
        userId: user.email || user.id,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return NextResponse.json({
      subscriptions,
      purchases,
    });
  } catch (error) {
    console.error('获取用户订阅失败:', error);
    return NextResponse.json(
      { error: '获取用户订阅失败' },
      { status: 500 }
    );
  }
}