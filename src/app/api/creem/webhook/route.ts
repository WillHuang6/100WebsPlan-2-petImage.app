import { NextRequest, NextResponse } from 'next/server';
import { creem } from '@/lib/creem';
import { prisma } from '@/lib/prisma';

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
      case 'subscription.active':
      case 'subscription.paid':
        await handleSubscriptionCreated(event.data || event);
        break;
      case 'subscription.canceled':  // 注意是单个 l
        await handleSubscriptionCancelled(event.data || event);
        break;
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

async function handleSubscriptionCreated(data: any) {
  try {
    console.log('处理订阅激活事件:', data);
    
    // 根据 Creem 的实际数据结构调整字段映射
    const subscriptionData = {
      id: data.subscription?.id || data.id || `sub_${Date.now()}`,
      userId: data.customer?.email || data.customerEmail || data.metadata?.userId || 'unknown',
      product: data.product?.id || data.productId || data.subscription?.productId || 'unknown',
      providerCustomerId: data.customer?.id || data.customerId || 'unknown',
      status: 'active',
    };
    
    // 使用 upsert 避免重复创建
    await prisma.subscription.upsert({
      where: { id: subscriptionData.id },
      update: { status: subscriptionData.status },
      create: subscriptionData,
    });
    
    console.log('订阅创建/更新成功:', subscriptionData.id);
  } catch (error) {
    console.error('处理订阅激活失败:', error);
    console.error('原始数据:', data);
  }
}

async function handleSubscriptionCancelled(data: any) {
  try {
    console.log('处理订阅取消事件:', data);
    
    const subscriptionId = data.subscription?.id || data.id;
    
    if (!subscriptionId) {
      console.error('无法获取订阅ID:', data);
      return;
    }
    
    await prisma.subscription.updateMany({
      where: { id: subscriptionId },
      data: { status: 'cancelled' },
    });
    
    console.log('订阅取消成功:', subscriptionId);
  } catch (error) {
    console.error('处理订阅取消失败:', error);
    console.error('原始数据:', data);
  }
}

async function handlePurchaseCompleted(data: any) {
  try {
    console.log('处理结账完成事件:', data);
    
    const purchaseData = {
      id: data.checkout?.id || data.id || `purchase_${Date.now()}`,
      userId: data.customer?.email || data.customerEmail || data.metadata?.userId || 'unknown',
      product: data.product?.id || data.productId || data.checkout?.productId || 'unknown',
      providerCustomerId: data.customer?.id || data.customerId || 'unknown',
    };
    
    // 使用 upsert 避免重复创建
    await prisma.oneTimePurchase.upsert({
      where: { id: purchaseData.id },
      update: { product: purchaseData.product },
      create: purchaseData,
    });
    
    console.log('一次性购买记录创建/更新成功:', purchaseData.id);
  } catch (error) {
    console.error('处理结账完成失败:', error);
    console.error('原始数据:', data);
  }
}