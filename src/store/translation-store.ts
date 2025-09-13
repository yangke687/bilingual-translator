import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface TranslationState {
  sourceText: string;
  translatedText: string;
  sourceLang: 'en' | 'zh';
  targetLang: 'zh' | 'en';

  currentAPIIndex: number; // 调用的API序号
  isTranslating: boolean;
  error: string | null;

  setSourceText: (text: string) => void;
  setTranslatedText: (text: string) => void;
  swapLanguages: () => void;
  clearAll: () => void;

  setCurrentAPIIndex: (currentAPIIndex: number) => void;
  setIsTranslating: (isTranslating: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTranslationStore = create<TranslationState>()(
  persist(
    devtools((set, get) => ({
      sourceText: '',
      translatedText: '',
      sourceLang: 'en',
      targetLang: 'zh',

      currentAPIIndex: 0,
      error: null,
      isTranslating: false,

      setSourceText: (sourceText: string) => set({ sourceText }),
      setTranslatedText: (translatedText: string) => set({ translatedText }),
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
    })),
    {
      name: 'translation-storage',
      partialize: (state) => ({
        sourceLang: state.sourceLang,
        targetLang: state.targetLang,
        sourceText: state.sourceText,
        currentAPIIndex: state.currentAPIIndex,
      }),
    },
  ),
);
