import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-server';
import { getProductConfig } from '@/lib/products';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('creem-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // 验证webhook签名
    const webhookSecret = process.env.CREEM_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('CREEM_WEBHOOK_SECRET environment variable not set');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // 生成预期签名
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    // 验证签名
    if (signature !== expectedSignature) {
      console.error('Webhook signature verification failed');
      console.error('Expected:', expectedSignature);
      console.error('Received:', signature);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);

    // 处理不同的事件类型
    switch (event.eventType) {
      case 'checkout.completed':
        await handlePurchaseCompleted(event.object);
        break;
      case 'subscription.active':
      case 'subscription.paid':
        await handleSubscriptionActive(event.object);
        break;
      default:
        console.log(`未处理的事件类型: ${event.eventType}`);
        console.log('完整事件数据:', JSON.stringify(event, null, 2));
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook 处理失败:', error);
    return NextResponse.json(
      { error: 'Webhook 处理失败' },
      { status: 500 }
    );
  }
}

async function handlePurchaseCompleted(data: any) {
  try {
    console.log('处理结账完成事件:', data.id);
    
    // 提取关键信息
    const checkoutId = data.id;
    const customerEmail = data.customer?.email;
    const customerId = data.customer?.id;
    const productId = data.product?.id;
    const transactionId = data.order?.transaction;
    const amount = data.order?.amount || data.product?.price;
    
    if (!checkoutId || !customerEmail || !productId) {
      console.error('关键信息缺失:', { checkoutId, customerEmail, productId });
      return;
    }
    
    // 获取产品配置
    const productConfig = getProductConfig(productId);
    if (!productConfig) {
      console.error('未找到产品配置:', productId);
      return;
    }
    
    // 使用Supabase Admin客户端
    const supabase = createAdminClient();
    
    try {
      console.log('处理购买记录...');
      
      // 1. 查找用户profile（通过email）
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', customerEmail);
      
      if (profileError) {
        console.error('查询用户失败:', profileError);
        throw profileError;
      }
      
      if (!profiles || profiles.length === 0) {
        console.error('用户不存在:', customerEmail);
        throw new Error(`用户不存在: ${customerEmail}. 用户需要先注册账号。`);
      }
      
      const profile = profiles[0] as any;
      console.log('用户profile ID:', profile.id);
      
      // 2. 检查购买记录是否已存在
      const { data: existingPurchase, error: checkError } = await supabase
        .from('purchase')
        .select('id')
        .eq('id', checkoutId)
        .maybeSingle();
      
      if (checkError) {
        console.error('检查购买记录失败:', checkError);
        throw checkError;
      }
      
      if (existingPurchase) {
        console.log('购买记录已存在，跳过处理:', checkoutId);
        return;
      }
      
      // 3. 创建购买记录
      const { error: insertError } = await (supabase as any)
        .from('purchase')
        .insert({
          id: checkoutId,
          user_id: profile.id,
          product_id: productId,
          product_name: productConfig.name,
          amount: amount || productConfig.price,
          currency: productConfig.currency,
          credits: productConfig.credits,
          provider_customer_id: customerId,
          transaction_id: transactionId,
          status: 'completed'
        });
      
      if (insertError) {
        console.error('创建购买记录失败:', insertError);
        throw insertError;
      }
      
      // 4. 更新用户credits
      const newCredits = profile.credits + productConfig.credits;
      const newTotalCredits = (profile.total_credits || 0) + productConfig.credits;
      
      const { error: updateError } = await (supabase as any)
        .from('profiles')
        .update({
          credits: newCredits,
          total_credits: newTotalCredits,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);
      
      if (updateError) {
        console.error('更新用户credits失败:', updateError);
        throw updateError;
      }
      
      console.log(`购买处理成功: ${checkoutId}, 添加Credits: ${productConfig.credits}`);
      
    } catch (dbError) {
      console.error('数据库操作错误:', dbError);
      throw dbError;
    }
    
  } catch (error) {
    console.error('处理结账完成失败:', error);
    throw error;
  }
}

async function handleSubscriptionActive(data: any) {
  try {
    console.log('处理订阅激活事件:', data.id);
    
    const subscriptionId = data.id;
    const customerEmail = data.customer?.email;
    const productId = data.product?.id;
    
    if (!subscriptionId || !customerEmail || !productId) {
      console.error('关键信息缺失:', { subscriptionId, customerEmail, productId });
      return;
    }
    
    const productConfig = getProductConfig(productId);
    if (!productConfig) {
      console.error('未找到产品配置:', productId);
      return;
    }
    
    // 使用Supabase Admin客户端
    const supabase = createAdminClient();
    
    try {
      console.log('处理订阅激活...');
      
      // 查找用户profile
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', customerEmail);
      
      if (profileError) {
        console.error('查询用户失败:', profileError);
        throw profileError;
      }
      
      if (!profiles || profiles.length === 0) {
        console.error('未找到用户profile:', customerEmail);
        return;
      }
      
      const profile = profiles[0] as any;
      
      // 处理订阅激活（如果是付费订阅，添加credits）
      if (productConfig.credits > 0) {
        const newCredits = profile.credits + productConfig.credits;
        const newTotalCredits = (profile.total_credits || 0) + productConfig.credits;
        
        const { error: updateError } = await (supabase as any)
          .from('profiles')
          .update({
            credits: newCredits,
            total_credits: newTotalCredits,
            updated_at: new Date().toISOString()
          })
          .eq('id', profile.id);
        
        if (updateError) {
          console.error('更新用户credits失败:', updateError);
          throw updateError;
        }
      }
      
      console.log('订阅激活处理成功:', subscriptionId);
      
    } catch (dbError) {
      console.error('数据库操作错误:', dbError);
      throw dbError;
    }
    
  } catch (error) {
    console.error('处理订阅激活失败:', error);
    throw error;
  }
}