import { translationManager } from '@/lib/translation-apis';
import { useTranslationStore } from '@/store/translation-store';
import { CheckCircle, Info, Settings, XCircle } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';

export default function TranslationSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const availableAPIs = translationManager.getAvailableAPIs();
  const { currentAPIIndex, setCurrentAPIIndex } = useTranslationStore();

  const apiInfo = [
    {
      name: 'MyMemory',
      description: '免费翻译服务, 每日1000次请求限制',
      requiresAuth: false,
      isAvailable: availableAPIs.some((api) => api.name === 'MyMemory'),
      pros: ['完全免费', '无需注册', '支持多种语言'],
      cons: ['每日请求限制', '翻译质量一般'],
      setup: '无需配置，开箱即用',
    },
    // {
    //   name: 'LibreTranslate',
    //   description: '开源免费翻译服务',
    //   requiresAuth: false,
    //   isAvailable: availableAPIs.some((api) => api.name === 'LibreTranslate'),
    //   pros: ['开源免费', '隐私保护', '无请求限制'],
    //   cons: ['服务稳定性依赖公共实例', '翻译质量中等'],
    //   setup: '无需配置，开箱即用',
    // },
    {
      name: 'Google Translate',
      description: 'Google 翻译备用服务（通过公共代理）',
      requiresAuth: false,
      isAvailable: availableAPIs.some((api) => api.name === 'Google Translate'),
      pros: ['翻译质量高', '支持语言广泛', '响应速度快'],
      cons: ['依赖代理服务稳定性', '可能有使用限制'],
      setup: '无需配置，作为备用服务使用',
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="w-4 h-4" />
          翻译设置
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>翻译服务配置</DialogTitle>
          <DialogDescription>
            管理第三方翻译API服务。系统会自动选择可用的最佳服务进行翻译。
          </DialogDescription>
        </DialogHeader>

        <div className="grid mt-4 gap-4" key={currentAPIIndex}>
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-muted-foreground">
              当前可用服务: {availableAPIs.length} 个
            </span>
          </div>

          {apiInfo.map((api, idx) => (
            <Card key={api.name} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {api.name}
                    {api.isAvailable ? (
                      <Badge variant="secondary" className="gap-1">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        可用
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1">
                        <XCircle className="w-3 h-3 text-red-500" />
                        不可用
                      </Badge>
                    )}
                    {api.requiresAuth && <Badge variant="outline">需要配置</Badge>}
                  </CardTitle>
                  <Checkbox
                    className="border-muted bg-muted text-muted-foreground"
                    defaultChecked={idx === currentAPIIndex}
                    onCheckedChange={(checked: boolean) => {
                      if (checked) {
                        setCurrentAPIIndex(idx);
                      }
                    }}
                  />
                </div>
                <CardDescription>{api.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm text-green-600 mb-2">优势</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {api.pros.map((pro, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-green-500 rounded-full" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-amber-600 mb-2">限制</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {api.cons.map((con, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-amber-500 rounded-full" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <h4 className="font-medium text-sm mb-2">配置说明</h4>
                  <p className="text-sm text-muted-foreground">{api.setup}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
