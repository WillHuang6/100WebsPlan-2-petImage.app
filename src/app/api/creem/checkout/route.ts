import { NextRequest, NextResponse } from 'next/server';
import { creem } from '@/lib/creem';
import { createClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: '产品ID是必需的' },
        { status: 400 }
      );
    }

    // 获取当前用户
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: '用户未认证' },
        { status: 401 }
      );
    }

    const apiKey = process.env.CREEM_API_KEY;
    const successUrl = process.env.SUCCESS_URL || 'http://localhost:3000/account';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'CREEM_API_KEY 未配置' },
        { status: 500 }
      );
    }

    // 使用正确的Creem SDK方法创建结账会话
    const checkoutSessionResponse = await creem.createCheckout({
      xApiKey: apiKey,
      createCheckoutRequest: {
        productId: productId,
        successUrl: successUrl,
        requestId: user.id,
        metadata: {
          email: user.email || '',
          userId: user.id,
        },
      },
    });

    return NextResponse.json({ 
      url: checkoutSessionResponse.checkoutUrl
    });
  } catch (error) {
    console.error('创建结账会话失败:', error);
    return NextResponse.json(
      { error: '创建结账会话失败' },
      { status: 500 }
    );
  }
}