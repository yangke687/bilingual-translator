import { useToast } from '@/lib/ToastContext';
import { translationManager } from '@/lib/translation-apis';
import { useTranslationStore } from '../store/translation-store';

export const useTranslate = () => {
  const {
    sourceLang,
    targetLang,
    sourceText,
    setIsTranslating,
    setError,
    currentAPIIndex,
    setTranslatedText,
  } = useTranslationStore();

  const { toast } = useToast();

  const translate = async () => {
    const fromLang = sourceLang;
    const toLang = targetLang;

    if (!fromLang || !toLang) {
      toast({
        variant: 'destructive',
        title: '错误',
        description: '源语言类别或目标语言类别不能为空',
      });

      return;
    }

    if (!sourceText.trim()) {
      toast({
        variant: 'destructive',
        title: '错误',
        description: '请输入要翻译的文本',
      });
      return;
    }

    try {
      setIsTranslating(true);
      const result = await translationManager.translate(
        sourceText.trim(),
        fromLang,
        toLang,
        currentAPIIndex || 0,
      );

      if (!result || !result.translatedText) {
        throw new Error('未收到翻译结果');
      }

      setTranslatedText(result.translatedText);
    } catch (err: any) {
      const errorMessage = err.message || '翻译失败';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: '翻译失败',
        description: errorMessage,
      });
    } finally {
      setIsTranslating(false);
    }
  };

  return {
    translate,
  };
};
