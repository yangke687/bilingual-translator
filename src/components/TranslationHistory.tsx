import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/lib/ToastContext';
import { type Translation, useTranslationStore } from '@/store/translation-store';
import { BookOpen, Copy, History, Trash2, Volume2, X } from 'lucide-react';
import { useState } from 'react';
import { DetailedTranslationView } from './DetailedTranslation';

export const TranslationHistory = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedDetails, setExpandedDetails] = useState<Set<string>>(new Set());
  const {
    history,
    clearHistory,
    removeFromHistory,
    setSourceText,
    setTranslatedText,
    sourceLang,
    targetLang,
    setSourceLang,
    setTargetLang,
  } = useTranslationStore();
  const { toast } = useToast();

  const toggleDetails = (translationId: string) => {
    const newExpanded = new Set(expandedDetails);
    if (newExpanded.has(translationId)) {
      newExpanded.delete(translationId);
    } else {
      newExpanded.add(translationId);
    }
    setExpandedDetails(newExpanded);
  };

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

  const reuseTranslation = (translation: Translation) => {
    setSourceText(translation.sourceText);
    setTranslatedText(translation.translatedText);
    setSourceLang(translation.sourceLang);
    setTargetLang(translation.targetLang);
    setIsOpen(false);
    toast({
      title: 'Translation loaded',
      description: 'Previous translation has been loaded',
    });
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getLanguageLabel = (lang: 'en' | 'zh') => {
    return lang === 'en' ? 'English' : '中文';
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <History className="w-4 h-4" />
        History ({history.length})
      </Button>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">Translation History</CardTitle>
        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearHistory}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No translation history yet</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {history.map((translation) => {
                const hasDetails =
                  translation.detailedResult && translation.detailedResult.words.length > 0;
                const isDetailsExpanded = expandedDetails.has(translation.id);

                return (
                  <Card key={translation.id} className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {getLanguageLabel(translation.sourceLang)} →{' '}
                          {getLanguageLabel(translation.targetLang)}
                        </Badge>
                        {hasDetails && (
                          <Badge variant="secondary" className="text-xs">
                            <Volume2 className="w-3 h-3 mr-1" />
                            详细信息
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatTime(translation.timestamp)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => reuseTranslation(translation)}
                          className="h-6 px-2 text-xs"
                        >
                          Reuse
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromHistory(translation.id)}
                          className="h-6 px-2 text-xs text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="p-2 bg-muted rounded text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-muted-foreground">Source</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(translation.sourceText)}
                            className="h-5 px-1"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="break-words">{translation.sourceText}</p>
                      </div>

                      <div className="p-2 bg-secondary/20 rounded text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-muted-foreground">
                            Translation
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(translation.translatedText)}
                            className="h-5 px-1"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="break-words">{translation.translatedText}</p>
                      </div>

                      {/* Detailed Information Toggle */}
                      {hasDetails && (
                        <Collapsible
                          open={isDetailsExpanded}
                          onOpenChange={() => toggleDetails(translation.id)}
                        >
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-center text-xs mt-2"
                            >
                              <BookOpen className="w-3 h-3 mr-1" />
                              {isDetailsExpanded ? '隐藏' : '显示'}词汇详情 (
                              {translation.detailedResult?.words.length} 个词汇)
                            </Button>
                          </CollapsibleTrigger>

                          <CollapsibleContent className="mt-2">
                            <div className="border-t pt-2">
                              <DetailedTranslationView
                                detailed={translation.detailedResult!}
                                className="text-xs"
                              />
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
