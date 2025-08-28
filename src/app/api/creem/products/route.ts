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

    // 使用你在 Creem 中创建的实际产品
    const products = [
      {
        id: 'prod_2YRPVlkhs0lCrdOgVQomZT',
        name: 'PetImage 基础版',
        description: '适合个人用户的AI宠物图像生成服务',
        price: {
          amount: 449,  // $4.49 = 449 cents
          currency: 'USD'
        },
        type: 'subscription',
        interval: 'month'
      },
      {
        id: 'prod_nmwW7Mttc1hpOtsaO5bVs',
        name: 'PetImage 专业版',
        description: '专业用户的高级AI图像生成功能，包含更多模板和高分辨率输出',
        price: {
          amount: 1999,  // $19.99 = 1999 cents
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