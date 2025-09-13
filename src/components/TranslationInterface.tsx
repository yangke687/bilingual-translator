import { useToast } from '@/lib/ToastContext';
import { Copy, Languages, Loader2 } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import LanguagesSwapButton from './LanguagesSwapButton';
import { useTranslationStore } from '@/store/translation-store';

export default function TranslationInterface() {
  const { toast } = useToast();
  const {
    sourceLang,
    targetLang,
    sourceText,
    translatedText,
    isTranslating,
    setSourceText,
    clearAll,
  } = useTranslationStore();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied!',
        description: 'Text copied to clipboard',
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Copy failed',
        description: 'Failed to copy text to clipboard',
      });
    }
  };

  const getLanguageLabel = (text: 'en' | 'zh') => {
    return text === 'en' ? 'English' : '中文';
  };

  const getPlaceholder = (lang: 'en' | 'zh') => {
    return lang === 'en' ? 'Enter English text to translate...' : '输入中文文本进行翻译...';
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/** Header */}
      <div className="text-center space-y-2">
        {/** Title */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <Languages className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Bilingual Translator</h1>
        </div>

        {/** Swap Button */}
        <div className="flex items-center justify-center gap-4">
          <Badge variant={'outline'} className="px-3 py-1">
            {getLanguageLabel(sourceLang)}
          </Badge>
          <LanguagesSwapButton />
          <Badge variant={'outline'} className="px-3 py-1">
            {getLanguageLabel(targetLang)}
          </Badge>
        </div>
      </div>

      {/** Translation Inteface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/** source text */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <span>{getLanguageLabel(sourceLang)}</span>
              <div className="flex items-center gap-2">
                {sourceText && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(sourceText)}
                    className="h-8 px-2"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder={getPlaceholder(sourceLang)}
              className="min-h-[200px] resize-none text-lg leading-relaxed"
              disabled={isTranslating}
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{sourceText.length} characters</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAll}
                  disabled={isTranslating || (!sourceText && !translatedText)}
                >
                  Clear
                </Button>
                <Button
                  onClick={() => null} // todo
                  disabled={isTranslating || !sourceText.trim()}
                  className="min-w-[100px]"
                >
                  {isTranslating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Translating...
                    </>
                  ) : (
                    'Translate'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/** translated text */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <span>{getLanguageLabel(targetLang)}</span>
              <div className="flex items-center gap-2">
                {translatedText && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(translatedText)}
                    className="h-8 px-2"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="min-h-[200px] p-3 border rounded-md bg-muted/30">
              {isTranslating ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Translating your text...</span>
                  </div>
                </div>
              ) : translatedText ? (
                <p className="text-lg leading-relaxed whitespace-pre-wrap break-words">
                  {translatedText}
                </p>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground text-center">Translation will appear here</p>
                </div>
              )}
            </div>
            {translatedText && (
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {translatedText.length} characters
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
