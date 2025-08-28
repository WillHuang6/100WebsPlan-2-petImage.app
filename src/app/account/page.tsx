'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthGuard } from '@/components/AuthGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Subscription {
  id: string;
  product: string;
  status: string;
  created_at: string;
}

interface OneTimePurchase {
  id: string;
  product: string;
  created_at: string;
}

export default function AccountPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [purchases, setPurchases] = useState<OneTimePurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUserSubscriptions();
    }
  }, [user]);

  const fetchUserSubscriptions = async () => {
    try {
      const response = await fetch('/api/creem/user-subscriptions');
      const data = await response.json();
      setSubscriptions(data.subscriptions || []);
      setPurchases(data.purchases || []);
    } catch (error) {
      console.error('获取用户订阅失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    if (!confirm('确定要取消此订阅吗？')) return;

    try {
      const response = await fetch(`/api/creem/cancel-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId }),
      });

      if (response.ok) {
        alert('订阅已取消');
        fetchUserSubscriptions(); // 重新获取数据
      } else {
        throw new Error('取消订阅失败');
      }
    } catch (error) {
      console.error('取消订阅失败:', error);
      alert('取消订阅失败，请稍后重试');
    }
  };

  const handleManageBilling = async () => {
    try {
      const response = await fetch('/api/creem/customer-portal', {
        method: 'POST',
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || '打开客户门户失败');
      }
    } catch (error) {
      console.error('打开客户门户失败:', error);
      alert('打开客户门户失败，请稍后重试');
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4">加载中...</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">账户管理</h1>

        <div className="grid gap-6">
          {/* 用户信息 */}
          <Card>
            <CardHeader>
              <CardTitle>用户信息</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>邮箱:</strong> {user?.email}</p>
              <p><strong>注册时间:</strong> {user?.created_at ? new Date(user.created_at).toLocaleDateString('zh-CN') : '未知'}</p>
            </CardContent>
          </Card>

          {/* 订阅管理 */}
          <Card>
            <CardHeader>
              <CardTitle>我的订阅</CardTitle>
              <CardDescription>管理您的订阅服务</CardDescription>
            </CardHeader>
            <CardContent>
              {subscriptions.length > 0 ? (
                <div className="space-y-4">
                  {subscriptions.map((subscription) => (
                    <div key={subscription.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">产品 ID: {subscription.product}</p>
                        <p className="text-sm text-gray-500">状态: {subscription.status}</p>
                        <p className="text-sm text-gray-500">
                          订阅时间: {new Date(subscription.created_at).toLocaleDateString('zh-CN')}
                        </p>
                      </div>
                      <div className="space-x-2">
                        {subscription.status === 'active' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelSubscription(subscription.id)}
                          >
                            取消订阅
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">您还没有任何订阅</p>
              )}
            </CardContent>
          </Card>

          {/* 购买记录 */}
          <Card>
            <CardHeader>
              <CardTitle>购买记录</CardTitle>
              <CardDescription>您的一次性购买记录</CardDescription>
            </CardHeader>
            <CardContent>
              {purchases.length > 0 ? (
                <div className="space-y-4">
                  {purchases.map((purchase) => (
                    <div key={purchase.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">产品 ID: {purchase.product}</p>
                        <p className="text-sm text-gray-500">
                          购买时间: {new Date(purchase.created_at).toLocaleDateString('zh-CN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">您还没有任何购买记录</p>
              )}
            </CardContent>
          </Card>

          {/* 计费管理 */}
          <Card>
            <CardHeader>
              <CardTitle>计费管理</CardTitle>
              <CardDescription>管理您的支付方式和账单</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleManageBilling}>
                打开客户门户
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}