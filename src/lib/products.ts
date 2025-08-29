// 产品配置 - 测试和生产环境
export const PRODUCT_CONFIGS = {
  // 测试产品
  'prod_2sHye4uIbTVNvIll3ix9sL': {
    credits: 1,
    name: '测试套餐',
    price: 100, // $1.00
    currency: 'USD',
    type: 'onetime'
  },
  
  // 真实产品配置 (稍后启用)
  'prod_basic_real': {
    credits: 3,
    name: '基础套餐',
    price: 449, // $4.49
    currency: 'USD',
    type: 'onetime'
  },
  'prod_premium_real': {
    credits: 20,
    name: '专业套餐', 
    price: 1549, // $15.49
    currency: 'USD',
    type: 'onetime'
  }
} as const;

export type ProductId = keyof typeof PRODUCT_CONFIGS;

export function getProductConfig(productId: string) {
  return PRODUCT_CONFIGS[productId as ProductId];
}

// 获取所有有效产品
export function getActiveProducts() {
  // 测试阶段只返回测试产品
  const testMode = process.env.NODE_ENV !== 'production' || process.env.CREEM_API_KEY?.includes('test');
  
  if (testMode) {
    return [{
      id: 'prod_2sHye4uIbTVNvIll3ix9sL',
      ...PRODUCT_CONFIGS['prod_2sHye4uIbTVNvIll3ix9sL'],
      description: '测试模式下的图片生成服务'
    }];
  }
  
  // 生产环境返回真实产品
  return [
    {
      id: 'prod_basic_real',
      ...PRODUCT_CONFIGS['prod_basic_real'],
      description: '适合个人用户，可生成3张高质量AI宠物图片'
    },
    {
      id: 'prod_premium_real', 
      ...PRODUCT_CONFIGS['prod_premium_real'],
      description: '专业用户选择，可生成20张高质量AI宠物图片'
    }
  ];
}