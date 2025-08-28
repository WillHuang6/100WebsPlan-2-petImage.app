import { NextRequest, NextResponse } from 'next/server';
import { creem } from '@/lib/creem';
import { createClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    console.log('开始处理结账请求...');
    
    const { productId } = await request.json();
    console.log('产品ID:', productId);

    if (!productId) {
      console.log('错误: 缺少产品ID');
      return NextResponse.json(
        { error: '产品ID是必需的' },
        { status: 400 }
      );
    }

    // 检查环境变量
    const apiKey = process.env.CREEM_API_KEY;
    const successUrl = process.env.SUCCESS_URL || 'https://100-webs-plan-2-pet-image-app.vercel.app/account';
    
    console.log('API Key 是否存在:', !!apiKey);
    console.log('成功URL:', successUrl);

    if (!apiKey) {
      console.log('错误: CREEM_API_KEY 未配置');
      return NextResponse.json(
        { error: 'CREEM_API_KEY 未配置' },
        { status: 500 }
      );
    }

    // 获取当前用户（暂时简化，先不检查用户认证）
    let userEmail = 'test@example.com';
    let userId = 'test-user-id';

    try {
      const supabase = await createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (user && !authError) {
        userEmail = user.email || userEmail;
        userId = user.id || userId;
        console.log('用户认证成功:', userId);
      } else {
        console.log('用户未认证，使用测试用户');
      }
    } catch (authErr) {
      console.log('认证检查失败，使用测试用户:', authErr);
    }

    // 使用Creem SDK创建结账会话
    console.log('调用Creem API...');
    const checkoutSessionResponse = await creem.createCheckout({
      xApiKey: apiKey,
      createCheckoutRequest: {
        productId: productId,
        successUrl: successUrl,
        requestId: userId,
        metadata: {
          email: userEmail,
          userId: userId,
        },
      },
    });

    console.log('Creem响应:', checkoutSessionResponse);

    const checkoutUrl = checkoutSessionResponse.checkoutUrl || 
                       (checkoutSessionResponse as any).url ||
                       (checkoutSessionResponse as any).checkout_url;

    if (!checkoutUrl) {
      console.log('错误: 未获取到结账URL');
      console.log('完整响应:', JSON.stringify(checkoutSessionResponse, null, 2));
      return NextResponse.json(
        { error: '未获取到结账URL' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error('创建结账会话失败:', error);
    console.error('错误详情:', error instanceof Error ? error.message : '未知错误');
    console.error('错误堆栈:', error instanceof Error ? error.stack : '无堆栈信息');
    
    return NextResponse.json(
      { 
        error: '创建结账会话失败',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}