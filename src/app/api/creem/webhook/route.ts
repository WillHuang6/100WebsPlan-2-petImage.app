import { NextRequest, NextResponse } from 'next/server';
import { creem } from '@/lib/creem';
import { Client } from 'pg';
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
    
    // 提取关键信息 - 数据已经在object层级
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
    
    // 使用原生PostgreSQL客户端，优化连接参数
    const databaseUrl = process.env.DATABASE_URL;
    const connectionString = databaseUrl?.includes('sslmode=') 
      ? databaseUrl 
      : `${databaseUrl}${databaseUrl?.includes('?') ? '&' : '?'}sslmode=require`;
    
    const client = new Client({
      connectionString,
      connectionTimeoutMillis: 5000,  // 5秒连接超时
      statement_timeout: 15000,       // 15秒语句超时
      ssl: {
        rejectUnauthorized: false
      },
    });
    
    try {
      console.log('正在连接数据库...');
      await client.connect();
      console.log('数据库连接成功');
      
      // 开始事务
      await client.query('BEGIN');
      console.log('事务开始');
      
      // 1. 使用UPSERT操作查找或创建用户profile
      const upsertProfileQuery = `
        INSERT INTO profiles (email, display_name, credits, total_credits, created_at, updated_at)
        VALUES ($1, $2, 0, 0, NOW(), NOW())
        ON CONFLICT (email) DO UPDATE SET updated_at = NOW()
        RETURNING id, email, display_name, credits, total_credits
      `;
      const profileResult = await client.query(upsertProfileQuery, [
        customerEmail,
        data.customer?.name || 'User'
      ]);
      
      const profile = profileResult.rows[0];
      console.log('用户profile ID:', profile.id);
      
      // 2. 使用单一UPSERT操作处理购买记录和更新credits
      const upsertPurchaseQuery = `
        WITH purchase_insert AS (
          INSERT INTO purchase (
            id, user_id, product_id, product_name, amount, currency,
            credits, provider_customer_id, transaction_id, status,
            created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'completed', NOW(), NOW())
          ON CONFLICT (id) DO NOTHING
          RETURNING credits
        ),
        credit_update AS (
          UPDATE profiles 
          SET 
            credits = credits + COALESCE((SELECT credits FROM purchase_insert), 0),
            total_credits = total_credits + COALESCE((SELECT credits FROM purchase_insert), 0),
            updated_at = NOW()
          WHERE id = $2
          RETURNING credits
        )
        SELECT 
          (SELECT COUNT(*) FROM purchase_insert) as inserted,
          (SELECT credits FROM credit_update) as new_credits
      `;
      
      const result = await client.query(upsertPurchaseQuery, [
        checkoutId,
        profile.id,
        productId,
        productConfig.name,
        amount || productConfig.price,
        productConfig.currency,
        productConfig.credits,
        customerId,
        transactionId
      ]);
      
      const { inserted, new_credits } = result.rows[0];
      if (inserted > 0) {
        console.log('购买处理成功，Credits已更新:', new_credits);
      } else {
        console.log('购买记录已存在，跳过处理:', checkoutId);
      }
      
      // 提交事务
      await client.query('COMMIT');
      console.log('事务提交成功');
      
      console.log('购买处理成功:', checkoutId);
      
    } catch (dbError) {
      console.error('数据库操作错误:', dbError);
      try {
        // 回滚事务
        await client.query('ROLLBACK');
        console.log('事务已回滚');
      } catch (rollbackError) {
        console.error('回滚失败:', rollbackError);
      }
      throw dbError;
    } finally {
      try {
        // 关闭连接
        await client.end();
        console.log('数据库连接已关闭');
      } catch (endError) {
        console.error('关闭连接失败:', endError);
      }
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
    const customerId = data.customer?.id;
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
    
    const databaseUrl = process.env.DATABASE_URL;
    const connectionString = databaseUrl?.includes('sslmode=') 
      ? databaseUrl 
      : `${databaseUrl}${databaseUrl?.includes('?') ? '&' : '?'}sslmode=require`;
    
    const client = new Client({
      connectionString,
      connectionTimeoutMillis: 5000,
      statement_timeout: 15000,
      ssl: {
        rejectUnauthorized: false
      },
    });
    
    try {
      await client.connect();
      await client.query('BEGIN');
      
      // 创建或更新用户profile
      const upsertProfileQuery = `
        INSERT INTO profiles (email, display_name, credits, total_credits, created_at, updated_at)
        VALUES ($1, $2, 0, 0, NOW(), NOW())
        ON CONFLICT (email) DO UPDATE SET updated_at = NOW()
        RETURNING id, email, display_name, credits, total_credits
      `;
      const profileResult = await client.query(upsertProfileQuery, [
        customerEmail,
        data.customer?.name || 'User'
      ]);
      
      const profile = profileResult.rows[0];
      
      // 处理订阅激活（如果是付费订阅，添加credits）
      if (productConfig.credits > 0) {
        const updateCreditsQuery = `
          UPDATE profiles 
          SET 
            credits = credits + $1,
            total_credits = total_credits + $2,
            updated_at = NOW()
          WHERE id = $3
        `;
        
        await client.query(updateCreditsQuery, [
          productConfig.credits,
          productConfig.credits,
          profile.id
        ]);
      }
      
      await client.query('COMMIT');
      console.log('订阅激活处理成功:', subscriptionId);
      
    } catch (dbError) {
      await client.query('ROLLBACK');
      throw dbError;
    } finally {
      await client.end();
    }
    
  } catch (error) {
    console.error('处理订阅激活失败:', error);
    throw error;
  }
}