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

    // 查找用户的购买记录以获取客户ID
    const profile = await prisma.profile.findUnique({
      where: { email: user.email! },
      include: {
        purchases: {
          orderBy: { created_at: 'desc' },
          take: 1
        }
      }
    });

    if (!profile || profile.purchases.length === 0) {
      return NextResponse.json(
        { error: '未找到购买记录' },
        { status: 404 }
      );
    }

    // 一次性购买模式下，直接返回账户页面
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