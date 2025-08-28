import { NextRequest, NextResponse } from 'next/server';
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

    // 使用 HTTP API 直接调用 Creem 而不是 SDK
    console.log('调用Creem API...');
    console.log('请求参数:', {
      productId,
      successUrl,
      requestId: userId,
      metadata: { email: userEmail, userId }
    });

    // 使用Creem文档中的正确API格式
    console.log('使用官方文档的API格式...');
    
    const requestBody = {
      product_id: productId,  // 使用下划线格式
      request_id: userId,     // 可选的追踪ID
      success_url: successUrl, // 自定义成功页面
    };
    
    console.log('请求体:', requestBody);
    
    const creemResponse = await fetch('https://api.creem.io/v1/checkouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,  // 使用文档中指定的header格式
      },
      body: JSON.stringify(requestBody),
    });
    
    console.log('Creem API 响应状态:', creemResponse.status);

    if (!creemResponse.ok) {
      const errorText = await creemResponse.text();
      console.log('Creem API 错误响应:', errorText);
      
      return NextResponse.json(
        { 
          error: 'Creem API 调用失败', 
          details: errorText,
          status: creemResponse.status
        },
        { status: 500 }
      );
    }

    const checkoutSessionResponse = await creemResponse.json();

    console.log('Creem响应:', checkoutSessionResponse);

    // 根据文档，响应应该包含checkout URL
    const checkoutUrl = checkoutSessionResponse.checkout_url || 
                       checkoutSessionResponse.url ||
                       checkoutSessionResponse.checkoutUrl;

    if (!checkoutUrl) {
      console.log('错误: 未获取到结账URL');
      console.log('完整响应:', JSON.stringify(checkoutSessionResponse, null, 2));
      return NextResponse.json(
        { 
          error: '未获取到结账URL',
          response: checkoutSessionResponse
        },
        { status: 500 }
      );
    }

    console.log('成功获取结账URL:', checkoutUrl);
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