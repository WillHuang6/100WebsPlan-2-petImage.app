import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { creem } from '@/lib/creem';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: '用户未认证' },
        { status: 401 }
      );
    }

    // 查找用户的订阅以获取客户ID
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: user.email || user.id,
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: '未找到有效订阅' },
        { status: 404 }
      );
    }

    // 创建客户门户链接 (暂时跳过，需要实际API文档)
    // const portalUrl = await creem.customerPortal.create({
    //   customerId: subscription.providerCustomerId,
    //   returnUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000/account',
    // });

    // 暂时返回当前页面
    return NextResponse.json({ 
      url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000/account' 
    });
  } catch (error) {
    console.error('创建客户门户链接失败:', error);
    return NextResponse.json(
      { error: '创建客户门户链接失败' },
      { status: 500 }
    );
  }
}