import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useVocabStore } from '@/store/vocab-store';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Search,
  BookOpen,
  FileText,
  Volume2,
  Trash2,
  Edit3,
  SortAsc,
  SortDesc,
  Save,
  Calendar,
  Hash,
  Copy,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useVocab } from '@/hooks/use-vocab';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const VocabularyList = ({ category }: { category?: string }) => {
  const {
    words,
    isWordsLoading,
    categories,
    hasMore,
    sortField,
    sortDirection,
    setSortField,
    setSortDirection,
  } = useVocabStore();
  const { scrollLoadwords, loadWords } = useVocab();

  const { word } = useParams<{ word: string }>();
  const [searchTerm, setSearchTerm] = useState<string>('');
  // const [sortBy, setSortBy] = useState<'createdAt' | 'word'>('createdAt');
  // const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loaderRef = useRef(null);

  const handleCopyText = async (text: string, wordId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(wordId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const playPronunciation = (text: string, language: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'en' ? 'en-US' : 'zh-CN';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const getCategoryName = (categoryId?: string | null) => {
    if (!categoryId) {
      return '全部生词';
    }

    const category = categories.find((c) => c.id === categoryId);
    return category?.name || '未知分类';
  };

  // 初始化搜索
  useEffect(() => {
    setSearchTerm(word || '');
  }, [word]);

  // 排序
  useEffect(() => {
    loadWords(category, searchTerm);
  }, [sortField, sortDirection]);

  // 下拉监听
  useEffect(() => {
    if (!loaderRef.current) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isWordsLoading) {
        scrollLoadwords(category, searchTerm);
      }
    });

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [scrollLoadwords, hasMore, isWordsLoading]);

  // 编辑"备注"
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesText, setNotesText] = useState('');

  const handleEditNotes = (wordId: string, currentNotes?: string) => {
    setEditingNotes(wordId);
    setNotesText(currentNotes || '');
  };

  const handleSaveNotes = (wordId: string) => {
    // updateWord(wordId, { notes: notesText.trim() || undefined });
    setEditingNotes(null);
    setNotesText('');
  };

  const handleCancelEditNotes = () => {
    setEditingNotes(null);
    setNotesText('');
  };

  return (
    <div className="flex flex-col h-[calc(100%_-_70px)]">
      {/* 头部区域 */}
      <div className="p-6 border-b border-border bg-background">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-semibold">{getCategoryName(category)}</h1>
            <Badge variant="secondary" className="text-sm">
              0 个生词
            </Badge>
          </div>

          {/* 排序和筛选按钮 */}
          <div className="flex items-center gap-2">
            <Button
              variant={sortField === 'createdAt' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortField('createdAt')}
              className="gap-2"
            >
              <Calendar className="w-4 h-4" />
              时间
            </Button>
            <Button
              variant={sortField === 'word' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortField('word')}
              className="gap-2"
            >
              <Hash className="w-4 h-4" />
              字母
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              className="gap-2"
            >
              {sortDirection === 'asc' ? (
                <SortAsc className="w-4 h-4" />
              ) : (
                <SortDesc className="w-4 h-4" />
              )}
              排序
            </Button>
          </div>
        </div>

        {/* 搜索和筛选区域 */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="搜索生词或翻译..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={'outline'}
              size="sm"
              onClick={() => loadWords(category, searchTerm)}
              className="gap-2"
            >
              <Search className="w-4 h-4" />
              查找
            </Button>
          </div>
        </div>
      </div>

      {/* 生词列表 */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          {words.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                {searchTerm ? '未找到匹配的生词' : '暂无生词'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm ? '尝试调整搜索条件' : '开始翻译并收藏生词吧'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {words.map((word) => (
                <Card key={word.id} className="group hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* 原文和翻译 */}
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-medium">{word.word}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => playPronunciation(word.word, word.sourceLang)}
                            >
                              <Volume2 className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleCopyText(word.word, word.id)}
                            >
                              {copiedId === word.id ? (
                                <CheckCircle2 className="w-3 h-3 text-green-500" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-base text-muted-foreground">
                              {word.translatedText}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() =>
                                playPronunciation(word.translatedText, word.targetLang)
                              }
                            >
                              <Volume2 className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() =>
                                handleCopyText(word.translatedText, `${word.id}-translation`)
                              }
                            >
                              {copiedId === `${word.id}-translation` ? (
                                <CheckCircle2 className="w-3 h-3 text-green-500" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* 词汇详情 */}
                        <div className="text-sm text-muted-foreground space-y-1 mb-3">
                          {word.phonetic && <div>音标: {word.phonetic}</div>}
                          {word.partOfSpeech && (
                            <div>
                              词性:{' '}
                              {Array.isArray(word.partOfSpeech) ? (
                                word.partOfSpeech.map((partOfSpeech) => (
                                  <Badge variant="outline" className="text-xs" key={partOfSpeech}>
                                    {partOfSpeech}
                                  </Badge>
                                ))
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-xs"
                                  key={word.partOfSpeech}
                                >
                                  {word.partOfSpeech}
                                </Badge>
                              )}
                            </div>
                          )}
                          {word.definitions && word.definitions.length > 0 && (
                            <div>
                              定义:
                              <ul className="space-y-1 ml-6">
                                {word.definitions.map((definition, index) => (
                                  <li key={index} className="text-sm text-gray-800 leading-relaxed">
                                    • {definition}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* 备注区域 */}
                        <div className="mb-3">
                          {editingNotes === word.id ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <FileText className="w-4 h-4" />
                                编辑备注
                              </div>
                              <Textarea
                                value={notesText}
                                onChange={(e) => setNotesText(e.target.value)}
                                placeholder="添加个人备注，如记忆技巧、使用场景等..."
                                className="min-h-[80px] text-sm"
                                autoFocus
                              />
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleSaveNotes(word.id)}
                                  className="h-7 px-3 text-xs"
                                >
                                  <Save className="w-3 h-3 mr-1" />
                                  保存
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={handleCancelEditNotes}
                                  className="h-7 px-3 text-xs"
                                >
                                  <X className="w-3 h-3 mr-1" />
                                  取消
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              {word.notes ? (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm font-medium text-muted-foreground">
                                      备注
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="w-4 h-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                      onClick={() => handleEditNotes(word.id, word.notes)}
                                    >
                                      <Edit3 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                  <div className="text-sm text-foreground bg-muted/30 rounded-md p-2 border-l-2 border-primary/20">
                                    {word.notes}
                                  </div>
                                </div>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => handleEditNotes(word.id)}
                                >
                                  <FileText className="w-3 h-3 mr-1" />
                                  添加备注
                                </Button>
                              )}
                            </>
                          )}
                        </div>

                        {/* 标签和时间 */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(word.createdAt), 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                          </div>
                        </div>
                      </div>

                      {/* 操作按钮 */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            'h-8 w-8 p-0',
                            word.isFavorite && 'text-yellow-500 hover:text-yellow-600',
                          )}
                          onClick={() => toggleFavorite(word.id)}
                        >
                          {word.isFavorite ? (
                            <Star className="w-4 h-4 fill-current" />
                          ) : (
                            <StarOff className="w-4 h-4" />
                          )}
                        </Button> */}
                        {/* <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit3 className="w-4 h-4" />
                        </Button> */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          onClick={() => {
                            // deleteWord(word.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {isWordsLoading && (
            <p className="flex justify-center text-xs text-muted-foreground">加载中...</p>
          )}
          <div ref={loaderRef} style={{ height: '20px' }} />
          {!hasMore && !isWordsLoading && words.length > 0 && (
            <p className="flex justify-center text-xs text-muted-foreground">没有更多了</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default VocabularyList;
