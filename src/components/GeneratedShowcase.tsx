'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface GeneratedExample {
  id: string
  title: string
  description: string
  templateType: string
  features: string[]
}

const showcaseExamples: GeneratedExample[] = [
  {
    id: '1',
    title: '宠物手办效果',
    description: '完美还原 3D 手办质感，包含建模过程和包装盒',
    templateType: '宠物手办',
    features: ['3D手办模型', 'Blender建模界面', '精美包装盒', '透明底座']
  },
  {
    id: '2',
    title: '正面生日蛋糕',
    description: '温馨的正面庆祝场景，蛋糕烛光营造节日氛围',
    templateType: '纪念日蛋糕氛围',
    features: ['彩色生日帽', '精美蛋糕', '节日气球', '彩色纸屑']
  },
  {
    id: '3',
    title: '侧面烛光效果',
    description: '侧面角度展现，烛光柔和照亮宠物面部',
    templateType: '纪念日蛋糕氛围（侧面）',
    features: ['侧面角度', '烛光照明', 'Happy Anniversary标语', '温馨氛围']
  },
  {
    id: '4',
    title: '彩色气球派对',
    description: '活力满满的气球场景，展现宠物快乐神情',
    templateType: '明亮气球氛围',
    features: ['彩色气球束', '派对帽', '蝴蝶结装饰', '快乐表情']
  }
]

export const GeneratedShowcase: React.FC = () => {
  return (
    <section className="mb-16 bg-white/50 py-12 rounded-2xl">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ✨ 真实生成效果展示
          </h2>
          <p className="text-lg text-gray-600">
            看看其他用户使用我们的 AI 模板生成的精美作品
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {showcaseExamples.map((example, index) => {
            const getGradientForTemplate = (templateType: string) => {
              if (templateType.includes('手办')) return 'from-green-500 to-teal-500'
              if (templateType.includes('侧面')) return 'from-orange-500 to-yellow-500'
              if (templateType.includes('气球')) return 'from-purple-500 to-pink-500'
              return 'from-blue-500 to-indigo-500'
            }

            return (
              <Card key={example.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className={`h-4 bg-gradient-to-r ${getGradientForTemplate(example.templateType)}`}></div>
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <span className="text-2xl">🎨</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {example.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {example.description}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-500 mb-2">
                      模板: {example.templateType}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {example.features.map((feature, i) => (
                        <span 
                          key={i}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t text-center">
                    <span className="text-xs text-green-600 font-medium">
                      ✅ 真实用户生成
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
        
        <div className="text-center mt-10">
          <p className="text-gray-500 text-sm mb-4">
            🔥 每一张都是用户的真实生成结果
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-sm text-gray-700">
              <strong>💡 温馨提示：</strong>上传清晰的宠物照片，选择喜欢的模板，即可获得同样精美的效果！
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GeneratedShowcase