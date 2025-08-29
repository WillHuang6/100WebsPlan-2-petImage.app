import { NextRequest, NextResponse } from 'next/server';
import { creem } from '@/lib/creem';
import { prisma } from '@/lib/prisma';
import { getProductConfig } from '@/lib/products';

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

    // 验证 webhook (暂时跳过验证，需要实际API文档)
    // const event = creem.webhooks.constructEvent(body, signature);
    
    // 暂时解析原始数据
    const event = JSON.parse(body);

    // 处理不同的事件类型 - 使用 Creem 实际的事件名称
    switch (event.eventType || event.type) {
      case 'checkout.completed':
        await handlePurchaseCompleted(event.data || event);
        break;
      default:
        console.log(`未处理的事件类型: ${event.eventType || event.type}`);
        console.log('完整事件数据:', event);
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
    console.log('处理结账完成事件:', data);
    
    // 提取关键信息
    const checkoutId = data.object?.id || data.id;
    const customerEmail = data.object?.customer?.email;
    const customerId = data.object?.customer?.id;
    const productId = data.object?.product?.id;
    const transactionId = data.object?.order?.transaction;
    const amount = data.object?.order?.amount || data.object?.product?.price;
    
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
    
    // 使用数据库事务确保数据一致性
    await prisma.$transaction(async (tx) => {
      // 1. 查找或创建用户profile
      let profile = await tx.profile.findUnique({
        where: { email: customerEmail }
      });
      
      if (!profile) {
        profile = await tx.profile.create({
          data: {
            email: customerEmail,
            display_name: data.object?.customer?.name || 'User'
          }
        });
        console.log('创建新用户profile:', profile.id);
      }
      
      // 2. 创建购买记录
      const purchase = await tx.purchase.upsert({
        where: { id: checkoutId },
        update: {
          status: 'completed'
        },
        create: {
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
        }
      });
      
      // 3. 增加用户credits
      await tx.profile.update({
        where: { id: profile.id },
        data: {
          credits: { increment: productConfig.credits },
          total_credits: { increment: productConfig.credits }
        }
      });
      
      console.log('购买处理成功:', {
        purchaseId: purchase.id,
        profileId: profile.id,
        creditsAdded: productConfig.credits
      });
    });
    
  } catch (error) {
    console.error('处理结账完成失败:', error);
    console.error('原始数据:', data);
    throw error; // 让webhook返回错误状态，Creem会重试
  }
}