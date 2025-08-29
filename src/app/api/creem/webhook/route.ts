import { NextRequest, NextResponse } from 'next/server';
import { creem } from '@/lib/creem';
import { PrismaClient } from '@prisma/client';
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
    
    // 创建独立的Prisma Client避免prepared statement冲突
    const webhookPrisma = new PrismaClient();
    
    try {
      // 使用原始SQL查询避免prepared statement问题
      
      // 1. 查找或创建用户profile
      let profileResult = await webhookPrisma.$queryRaw`
        SELECT id, email, display_name, credits, total_credits 
        FROM profiles 
        WHERE email = ${customerEmail}
      ` as any[];
      
      let profile = profileResult[0];
      
      if (!profile) {
        // 创建新用户profile
        const newProfileResult = await webhookPrisma.$queryRaw`
          INSERT INTO profiles (email, display_name, credits, total_credits, created_at, updated_at)
          VALUES (${customerEmail}, ${data.object?.customer?.name || 'User'}, 0, 0, NOW(), NOW())
          RETURNING id, email, display_name, credits, total_credits
        ` as any[];
        
        profile = newProfileResult[0];
        console.log('创建新用户profile:', profile.id);
      }
      
      // 2. 检查购买记录是否已存在
      const existingPurchaseResult = await webhookPrisma.$queryRaw`
        SELECT id FROM purchase WHERE id = ${checkoutId}
      ` as any[];
      
      if (existingPurchaseResult.length > 0) {
        console.log('购买记录已存在，跳过处理:', checkoutId);
        return;
      }
      
      // 3. 使用原始SQL在事务中处理
      await webhookPrisma.$transaction(async (tx) => {
        // 插入购买记录
        await tx.$executeRaw`
          INSERT INTO purchase (
            id, user_id, product_id, product_name, amount, currency, 
            credits, provider_customer_id, transaction_id, status, 
            created_at, updated_at
          ) VALUES (
            ${checkoutId}, ${profile.id}::uuid, ${productId}, ${productConfig.name},
            ${amount || productConfig.price}, ${productConfig.currency},
            ${productConfig.credits}, ${customerId}, ${transactionId}, 'completed',
            NOW(), NOW()
          )
        `;
        
        // 更新用户credits
        await tx.$executeRaw`
          UPDATE profiles 
          SET 
            credits = credits + ${productConfig.credits},
            total_credits = total_credits + ${productConfig.credits},
            updated_at = NOW()
          WHERE id = ${profile.id}::uuid
        `;
        
        console.log('购买处理成功:', {
          purchaseId: checkoutId,
          profileId: profile.id,
          creditsAdded: productConfig.credits
        });
      });
      
    } finally {
      // 确保断开连接
      await webhookPrisma.$disconnect();
    }
    
  } catch (error) {
    console.error('处理结账完成失败:', error);
    console.error('原始数据:', data);
    throw error; // 让webhook返回错误状态，Creem会重试
  }
}