import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { creem } from '@/lib/creem';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { subscriptionId } = await request.json();

    if (!subscriptionId) {
      return NextResponse.json(
        { error: '订阅ID是必需的' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: '用户未认证' },
        { status: 401 }
      );
    }

    // 验证订阅属于当前用户
    const subscription = await prisma.subscription.findFirst({
      where: {
        id: subscriptionId,
        userId: user.email || user.id,
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: '订阅不存在或不属于当前用户' },
        { status: 404 }
      );
    }

    // 通过 Creem API 取消订阅 (暂时跳过，需要实际API文档)
    // await creem.cancelSubscription(subscriptionId);

    // 更新本地数据库
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { status: 'cancelled' },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('取消订阅失败:', error);
    return NextResponse.json(
      { error: '取消订阅失败' },
      { status: 500 }
    );
  }
}