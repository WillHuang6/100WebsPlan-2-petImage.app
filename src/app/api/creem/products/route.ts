import { NextResponse } from 'next/server';
import { getActiveProducts } from '@/lib/products';

export async function GET() {
  try {
    const products = getActiveProducts().map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: {
        amount: product.price,
        currency: product.currency
      },
      type: product.type,
      credits: product.credits // 添加credits信息给前端显示
    }));

    return NextResponse.json(products);
  } catch (error) {
    console.error('获取产品失败:', error);
    return NextResponse.json(
      { error: '获取产品失败' },
      { status: 500 }
    );
  }
}