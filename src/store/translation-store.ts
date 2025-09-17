import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface WordDetail {
  word: string;
  phonetic?: string; // 音标
  phoneticAudio?: string; // 音标mp3
  partOfSpeech?: string; // 词性
  definitions: string[]; // 定义/释义
  examples?: string[]; // 例句
  synonyms?: string[]; // 同义词
}

export interface DetailedTranslation {
  basicTranslation: string; // 基础翻译
  words: WordDetail[]; // 单词详细信息
  service: string; // 使用的翻译服务
  confidence?: number; // 置信度
}

export interface Translation {
  id: string;
  sourceText: string;
  translatedText: string;
  detailedResult?: DetailedTranslation; // 详细翻译信息
  sourceLang: 'en' | 'zh';
  targetLang: 'en' | 'zh';
  timestamp: number;
}

interface TranslationState {
  sourceText: string;
  translatedText: string;
  sourceLang: 'en' | 'zh';
  targetLang: 'zh' | 'en';

  history: Translation[];

  currentAPIIndex: number; // 调用的API序号
  isTranslating: boolean;
  error: string | null;

  setSourceText: (text: string) => void;
  setTranslatedText: (text: string) => void;
  setSourceLang: (sourceLang: 'en' | 'zh') => void;
  setTargetLang: (targetLang: 'zh' | 'en') => void;
  swapLanguages: () => void;
  clearAll: () => void;

  setCurrentAPIIndex: (currentAPIIndex: number) => void;
  setIsTranslating: (isTranslating: boolean) => void;
  setError: (error: string | null) => void;

  addToHistory: (translation: Translation) => void;
  clearHistory: () => void;
  removeFromHistory: (id: string) => void;
}

export const useTranslationStore = create<TranslationState>()(
  persist(
    devtools((set, get) => ({
      sourceText: '',
      translatedText: '',
      sourceLang: 'en',
      targetLang: 'zh',

      history: [],

      currentAPIIndex: 0,
      error: null,
      isTranslating: false,

      setSourceText: (sourceText: string) => set({ sourceText }),
      setTranslatedText: (translatedText: string) => set({ translatedText }),
      setSourceLang: (sourceLang: 'zh' | 'en') => set({ sourceLang }),
      setTargetLang: (targetLang: 'zh' | 'en') => set({ targetLang }),
      clearAll: () => set({ sourceText: '', translatedText: '' }),

      setCurrentAPIIndex: (currentAPIIndex: number) => set({ currentAPIIndex }),
      setIsTranslating: (isTranslating: boolean) => set({ isTranslating }),
      setError: (error: string | null) => set({ error }),

      swapLanguages: () => {
        const { sourceLang, targetLang, sourceText, translatedText } = get();
        set({
          sourceText: translatedText,
          translatedText: sourceText,
          sourceLang: targetLang,
          targetLang: sourceLang,
        });
      },

      addToHistory: (translation: Translation) => {
        const { history } = get();
        // Remove duplicates and add to beginning
        const filteredHistory = history.filter(
          (h) => h.sourceText !== translation.sourceText || h.sourceLang !== translation.sourceLang,
        );
        set({
          history: [translation, ...filteredHistory].slice(0, 50), // Keep only 50 recent translations
        });
      },
      clearHistory: () => set({ history: [] }),
      removeFromHistory: (id: string) => {
        const { history } = get();
        set({ history: history.filter((h) => h.id !== id) });
      },
    })),
    {
      name: 'translation-storage',
      partialize: (state) => ({
        sourceLang: state.sourceLang,
        targetLang: state.targetLang,
        sourceText: state.sourceText,
        currentAPIIndex: state.currentAPIIndex,
        history: state.history,
      }),
    },
  ),
);
