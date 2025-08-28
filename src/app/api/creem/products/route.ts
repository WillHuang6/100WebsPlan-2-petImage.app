import { NextResponse } from 'next/server';
import { creem } from '@/lib/creem';

export async function GET() {
  try {
    const apiKey = process.env.CREEM_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'CREEM_API_KEY 未配置' },
        { status: 500 }
      );
    }

    // 根据官方模板，需要使用正确的方法获取产品
    // 暂时返回示例数据，实际应该调用正确的API
    const products = [
      {
        id: 'basic_plan',
        name: '基础套餐',
        description: '适合个人用户的基础功能',
        price: {
          amount: 999,
          currency: 'CNY'
        },
        type: 'subscription',
        interval: 'month'
      },
      {
        id: 'pro_plan',
        name: '专业套餐',
        description: '适合专业用户的高级功能',
        price: {
          amount: 2999,
          currency: 'CNY'
        },
        type: 'subscription',
        interval: 'month'
      }
    ];

    return NextResponse.json(products);
  } catch (error) {
    console.error('获取产品失败:', error);
    return NextResponse.json(
      { error: '获取产品失败' },
      { status: 500 }
    );
  }
}