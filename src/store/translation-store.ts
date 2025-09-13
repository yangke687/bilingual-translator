import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

interface TranslationState {
  sourceText: string;
  translatedText: string;
  sourceLang: 'en' | 'zh';
  targetLang: 'zh' | 'en';

  isTranslating: boolean;

  setSourceText: (text: string) => void;
  setTranslatedText: (text: string) => void;
  swapLanguages: () => void;
  clearAll: () => void;
}

export const useTranslationStore = create<TranslationState>()(
  persist(
    devtools((set, get) => ({
      sourceText: '',
      translatedText: '',
      sourceLang: 'en',
      targetLang: 'zh',

      isTranslating: false,

      setSourceText: (sourceText: string) => set({ sourceText }),
      setTranslatedText: (translatedText: string) => set({ translatedText }),

      clearAll: () => set({ sourceText: '', translatedText: '' }),

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
      }),
    },
  ),
);
