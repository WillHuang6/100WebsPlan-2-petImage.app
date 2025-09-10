'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/AuthModal';
import { Check, Zap, Droplets } from 'lucide-react';

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

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  billingType: string;
  description: string;
  credits: number;
  features: PlanFeature[];
  isPopular?: boolean;
  buttonText: string;
  buttonVariant: 'default' | 'premium' | 'popular';
}

export default function PricingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  // Static pricing plans data matching the screenshot design
  const pricingPlans: PricingPlan[] = [
    {
      id: 'free',
      name: 'Starter',
      price: 'Free',
      billingType: '',
      description: 'Perfect for getting started',
      credits: 1,
      features: [
        { text: 'Only 1 credit', included: true },
        { text: 'Basic image generation', included: true },
        { text: 'No watermarks', included: true },
        { text: 'Community support', included: false },
        { text: 'Fast generation', included: false }
      ],
      buttonText: 'Get Started',
      buttonVariant: 'default'
    },
    {
      id: 'prod_2YRPVlkhs0lCrdOgVQomZT',
      name: 'Essential',
      price: '$4',
      billingType: '/one-time',
      description: 'Great for regular users',
      credits: 5,
      features: [
        { text: '5 credits included', included: true },
        { text: 'High quality generations', included: true },
        { text: 'Fast generation', included: true },
        { text: 'No watermarks', included: true },
        { text: 'Email support', included: true },
        { text: 'Commercial usage', included: true }
      ],
      buttonText: 'Purchase Credits',
      buttonVariant: 'premium'
    },
    {
      id: 'prod_nmwW7Mttc1hpOtsaO5bVs',
      name: 'Professional',
      price: '$14',
      billingType: '/one-time',
      description: 'Best value for power users',
      credits: 15,
      features: [
        { text: '15 credits included', included: true },
        { text: 'Premium quality generations', included: true },
        { text: 'Fastest generation', included: true },
        { text: 'No watermarks', included: true },
        { text: 'Priority support', included: true },
        { text: 'Commercial usage', included: true }
      ],
      isPopular: true,
      buttonText: 'Purchase Credits',
      buttonVariant: 'popular'
    }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/creem/products');
      const data = await response.json();
      
      if (response.ok && Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error('API response error:', data);
        setProducts([]);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (planId: string) => {
    if (planId === 'free') {
      // Handle free plan signup logic here
      return;
    }

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setPurchaseLoading(planId);
    try {
      const response = await fetch('/api/creem/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: planId }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed, please try again');
    } finally {
      setPurchaseLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#8B4513' }}>
              Choose Your Plan
            </h1>
            <div className="flex justify-center mt-8">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{ borderColor: '#F2994A' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: '#8B4513' }}>
            Choose Your Plan
          </h1>
          <p className="text-xl mb-12 max-w-3xl mx-auto" style={{ color: '#A0522D' }}>
            Get the best of PetImage AI with faster generation and commercial usage
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-8 transition-all duration-300 hover:scale-105 ${
                plan.isPopular
                  ? 'shadow-2xl border-2'
                  : 'shadow-lg border hover:shadow-xl'
              }`}
              style={{
                backgroundColor: plan.isPopular ? 'rgba(255, 248, 240, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                borderColor: plan.isPopular ? '#F2994A' : 'rgba(242, 153, 74, 0.3)',
                boxShadow: plan.isPopular ? '0 25px 50px -12px rgba(242, 153, 74, 0.25)' : '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
              }}
            >
              {/* Popular Badge */}
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="text-white px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: '#F2994A' }}>
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2" style={{ color: '#8B4513' }}>{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl md:text-5xl font-bold" style={{ color: '#8B4513' }}>{plan.price}</span>
                  {plan.billingType && (
                    <span className="text-lg" style={{ color: '#A0522D' }}>{plan.billingType}</span>
                  )}
                  {plan.billingType && (
                    <div className="text-sm mt-1" style={{ color: '#A0522D' }}>Billed Annually</div>
                  )}
                </div>
                <p style={{ color: '#CD853F' }}>{plan.description}</p>
              </div>

              {/* Features List */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div
                      className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: feature.included ? 'rgba(34, 197, 94, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                        color: feature.included ? '#22c55e' : '#6b7280'
                      }}
                    >
                      <Check className="w-3 h-3" />
                    </div>
                    <span
                      className={`text-sm ${feature.included ? '' : 'line-through'}`}
                      style={{ color: feature.included ? '#8B4513' : '#6b7280' }}
                    >
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handlePurchase(plan.id)}
                disabled={purchaseLoading === plan.id}
                className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${purchaseLoading === plan.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{
                  backgroundColor: plan.buttonVariant === 'popular' 
                    ? '#F2994A' 
                    : plan.buttonVariant === 'premium' 
                    ? '#8B4513' 
                    : 'rgba(139, 69, 19, 0.1)',
                  color: plan.buttonVariant === 'default' ? '#8B4513' : '#ffffff',
                  border: plan.buttonVariant === 'default' ? '2px solid rgba(139, 69, 19, 0.3)' : 'none',
                  boxShadow: plan.buttonVariant === 'popular' 
                    ? '0 10px 25px -5px rgba(242, 153, 74, 0.3)' 
                    : plan.buttonVariant === 'premium'
                    ? '0 10px 25px -5px rgba(139, 69, 19, 0.3)'
                    : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  if (!purchaseLoading) {
                    const target = e.target as HTMLButtonElement;
                    if (plan.buttonVariant === 'popular') {
                      target.style.backgroundColor = '#E8845A';
                      target.style.transform = 'scale(1.05)';
                    } else if (plan.buttonVariant === 'premium') {
                      target.style.backgroundColor = '#7A3F17';
                    } else {
                      target.style.backgroundColor = 'rgba(139, 69, 19, 0.2)';
                    }
                  }
                }}
                onMouseLeave={(e) => {
                  if (!purchaseLoading) {
                    const target = e.target as HTMLButtonElement;
                    if (plan.buttonVariant === 'popular') {
                      target.style.backgroundColor = '#F2994A';
                      target.style.transform = 'scale(1)';
                    } else if (plan.buttonVariant === 'premium') {
                      target.style.backgroundColor = '#8B4513';
                    } else {
                      target.style.backgroundColor = 'rgba(139, 69, 19, 0.1)';
                    }
                  }
                }}
              >
                {purchaseLoading === plan.id ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  plan.buttonText
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Features Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#F2994A' }}>
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-semibold mb-2" style={{ color: '#8B4513' }}>Lightning Fast</h4>
            <p style={{ color: '#A0522D' }}>Generate stunning pet portraits in seconds with our optimized AI pipeline</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#F2994A' }}>
              <Droplets className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-semibold mb-2" style={{ color: '#8B4513' }}>No Watermarks</h4>
            <p style={{ color: '#A0522D' }}>Clean, professional results without any branding or watermarks</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#F2994A' }}>
              <Check className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-semibold mb-2" style={{ color: '#8B4513' }}>Commercial Rights</h4>
            <p style={{ color: '#A0522D' }}>Use your generated images for commercial purposes with our premium plans</p>
          </div>
        </div>

        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </div>
    </div>
  );
}