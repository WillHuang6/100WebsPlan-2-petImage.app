'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface Product {
  id: string;
  name: string;
  description: string;
  price: {
    amount: number;
    currency: string;
  };
  type: 'onetime' | 'subscription';
  credits?: number;
}

interface ProductCardProps {
  product: Product;
  onPurchase: (productId: string) => void;
  loading?: boolean;
}

export function ProductCard({ product, onPurchase, loading }: ProductCardProps) {
  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const getPriceText = () => {
    return formatPrice(product.price.amount, product.price.currency);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{getPriceText()}</div>
        <div className="text-sm text-gray-500 mt-1">
          {product.credits && `获得 ${product.credits} 张图片生成次数`}
        </div>
        <div className="text-sm text-gray-400 mt-1">
          一次性购买
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => onPurchase(product.id)}
          disabled={loading}
          className="w-full"
        >
          {loading ? '处理中...' : '立即购买'}
        </Button>
      </CardFooter>
    </Card>
  );
}