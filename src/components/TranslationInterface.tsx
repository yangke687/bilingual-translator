import { DetailedTranslationView } from '@/components/DetailedTranslation';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useTranslate } from '@/hooks/use-translate';
import { useToast } from '@/lib/ToastContext';
import { useTranslationStore } from '@/store/translation-store';
import { ChevronDown, ChevronUp, Copy, Languages, Loader2, Volume2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import LanguagesSwapButton from './LanguagesSwapButton';

export default function TranslationInterface() {
  const { toast } = useToast();
  const { translate } = useTranslate();
  const {
    sourceLang,
    targetLang,
    sourceText,
    translatedText,
    isTranslating,
    setSourceText,
    clearAll,
    history,
  } = useTranslationStore();

  // 获取最新的翻译详情
  const [showDetails, setShowDetails] = useState(false);
  const latestTranslation = history[0];
  const hasDetailedInfo =
    latestTranslation?.detailedResult &&
    latestTranslation.detailedResult.words.length > 0 &&
    latestTranslation.sourceText === sourceText &&
    latestTranslation.translatedText === translatedText;

  //
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
                  onClick={translate}
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

      {hasDetailedInfo && (
        <Card className="w-full">
          <Collapsible open={showDetails} onOpenChange={setShowDetails}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-lg">词汇详细信息</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {latestTranslation.detailedResult?.words.length} 个词汇
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    {showDetails ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <CardContent className="pt-0">
                <DetailedTranslationView detailed={latestTranslation.detailedResult!} />
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      )}
    </div>
  );
}
