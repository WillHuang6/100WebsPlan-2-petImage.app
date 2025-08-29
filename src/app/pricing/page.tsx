'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/AuthModal';

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

export default function PricingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/creem/products');
      const data = await response.json();
      
      // 检查响应是否成功且数据是数组
      if (response.ok && Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error('API 响应错误:', data);
        setProducts([]); // 设置为空数组避免 map 错误
      }
    } catch (error) {
      console.error('获取产品失败:', error);
      setProducts([]); // 设置为空数组避免 map 错误
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (productId: string) => {
    // 测试模式下跳过用户验证
    // if (!user) {
    //   setShowAuthModal(true);
    //   return;
    // }

    setPurchaseLoading(productId);
    try {
      const response = await fetch('/api/creem/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || '创建结账会话失败');
      }
    } catch (error) {
      console.error('购买失败:', error);
      alert('购买失败，请稍后重试');
    } finally {
      setPurchaseLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              订阅套餐
            </h1>
            <div className="flex justify-center mt-8">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
            选择您的套餐
          </h1>
          <p className="text-gray-600 text-lg">
            解锁更多AI宠物图像生成功能
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPurchase={handlePurchase}
              loading={purchaseLoading === product.id}
            />
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">暂无可用产品</p>
          </div>
        )}

        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </div>
    </div>
  );
}