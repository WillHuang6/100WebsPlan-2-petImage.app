import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 使用你在 Creem 中创建的实际产品信息
    const products = [
      {
        id: 'prod_2sHye4uIbTVNvIll3ix9sL',
        name: 'PetImage 测试版',
        description: '测试模式下的AI宠物图像生成服务',
        price: {
          amount: 100,  // $1.00 for testing
          currency: 'USD'
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