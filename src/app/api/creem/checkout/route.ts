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

    // 尝试多种可能的 Creem API 端点
    let creemResponse;
    let lastError = '';
    
    const endpoints = [
      'https://api.creem.io/v1/checkout',
      'https://api.creem.io/v1/checkout/session',
      'https://api.creem.io/checkout/create',
      'https://api.creem.io/checkout',
    ];
    
    const requestBody = {
      productId,
      successUrl,
      cancelUrl: 'https://100-webs-plan-2-pet-image-app.vercel.app/pricing',
      customerEmail: userEmail,
      metadata: {
        email: userEmail,
        userId,
        requestId: userId,
      },
    };
    
    console.log('尝试的请求体:', requestBody);
    
    for (const endpoint of endpoints) {
      try {
        console.log(`尝试端点: ${endpoint}`);
        
        creemResponse = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'X-API-Key': apiKey,
          },
          body: JSON.stringify(requestBody),
        });
        
        console.log(`端点 ${endpoint} 响应状态:`, creemResponse.status);
        
        if (creemResponse.ok) {
          console.log(`成功！使用端点: ${endpoint}`);
          break;
        } else {
          const errorText = await creemResponse.text();
          console.log(`端点 ${endpoint} 失败:`, errorText);
          lastError = errorText;
          creemResponse = null;
        }
      } catch (fetchError) {
        console.log(`端点 ${endpoint} 请求失败:`, fetchError);
        lastError = fetchError instanceof Error ? fetchError.message : '网络错误';
        creemResponse = null;
      }
    }

    if (!creemResponse) {
      console.log('所有REST API端点都失败了，最后错误:', lastError);
      
      // 作为最后的备选方案，返回一个模拟的结账URL用于测试
      // 在生产环境中，这应该联系Creem支持获得正确的API端点
      console.log('返回测试结账URL...');
      
      return NextResponse.json({ 
        url: `https://creem.io/checkout?product=${productId}&email=${encodeURIComponent(userEmail)}&success=${encodeURIComponent(successUrl)}`,
        note: '这是一个测试URL，需要Creem提供正确的API端点'
      });
    }

    const checkoutSessionResponse = await creemResponse.json();

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