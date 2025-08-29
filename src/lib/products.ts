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
  
  // 真实产品配置
  'prod_2YRPVlkhs0lCrdOgVQomZT': {
    credits: 5,
    name: 'PetImage_4.49$',
    price: 449, // $4.49
    currency: 'USD',
    type: 'onetime'
  },
  'prod_nmwW7Mttc1hpOtsaO5bVs': {
    credits: 15,
    name: 'PetImage_14.49$', 
    price: 1449, // $14.49
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
      id: 'prod_2YRPVlkhs0lCrdOgVQomZT',
      ...PRODUCT_CONFIGS['prod_2YRPVlkhs0lCrdOgVQomZT'],
      description: '基础套餐，可生成5张高质量AI宠物图片'
    },
    {
      id: 'prod_nmwW7Mttc1hpOtsaO5bVs', 
      ...PRODUCT_CONFIGS['prod_nmwW7Mttc1hpOtsaO5bVs'],
      description: '专业套餐，可生成15张高质量AI宠物图片，更超值的选择'
    }
  ];
}