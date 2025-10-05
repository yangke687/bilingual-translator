import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { type WordDetail } from '@/store/translation-store';
import { fb_loadCategories, fb_addCategory } from '@/hooks/use-vocab';
import type { DocumentSnapshot } from 'firebase/firestore';

export interface Category {
  id: string;
  name: string;
  description: string;
  wordCount: number;
  createdAt: string;
}

export type Word = WordDetail & {
  sourceLang: 'en' | 'zh';
  targetLang: 'zh' | 'en';
  translatedText: string;
  id: string;
  createdAt: string;
  category: string;
  notes?: string;
};

export type SortFieldType = 'createdAt' | 'word';
export type SortDirectionType = 'asc' | 'desc';

export interface VocabStore {
  categories: Category[];
  isCategoriesLoading: boolean;
  selectedCategory: string; // selected catetory ID

  setCategories: (categries: Category[]) => void;
  setIsCategoriesLoading: (isCategoriesLoading: boolean) => void;
  setSelectedCategory: (selectedCategory: string) => void;
  addCategory: (category: Category) => void;

  words: Word[];
  totalWordsCnt: number;
  lastDoc: DocumentSnapshot | null;
  sortField: SortFieldType;
  sortDirection: SortDirectionType;
  isWordsLoading: boolean;
  hasMore: boolean;
  updateWord: (wordId: string, updates: Partial<Word>) => void;
  delWord: (wordId: string) => void;

  setWords: (words: Word[]) => void;
  setLastDoc: (lastDoc: DocumentSnapshot | null) => void;
  setSortField: (sortField: SortFieldType) => void;
  setSortDirection: (sortDirection: SortDirectionType) => void;
  setIsWordsLoading: (isWordsLoding: boolean) => void;
  setHasMore: (hasMore: boolean) => void;
  setTotalwordsCnt: (totalWordsCnt: number) => void;

  init: (uid: String) => void;
}

export const useVocabStore = create<VocabStore>()(
  persist(
    devtools((set, get) => ({
      categories: [],
      selectedCategory: '',

      setCategories: (categories: Category[]) => set({ categories }),
      setIsCategoriesLoading: (isCategoriesLoading: boolean) => set({ isCategoriesLoading }),
      setSelectedCategory: (selectedCategory: string) => set({ selectedCategory }),
      addCategory: (newCategory: Category) =>
        set((state: VocabStore) =>
          !state.categories.map((item) => item.id).includes(newCategory.id)
            ? { categories: [newCategory, ...state.categories] }
            : state,
        ),

      words: [],
      totalWordsCnt: 0,
      lastDoc: null,
      sortField: 'createdAt',
      sortDirection: 'desc',
      hasMore: false,
      setWords: (words: Word[]) => set({ words }),
      setLastDoc: (lastDoc: DocumentSnapshot | null) => set({ lastDoc }),
      setSortField: (sortField: SortFieldType) => set({ sortField }),
      setSortDirection: (sortDirection: SortDirectionType) => set({ sortDirection }),
      setIsWordsLoading: (isWordsLoading: boolean) => set({ isWordsLoading }),
      setHasMore: (hasMore: boolean) => set({ hasMore }),
      setTotalwordsCnt: (totalWordsCnt: number) => set({ totalWordsCnt }),
      updateWord: (wordId: string, updates: Partial<Word>) => {
        const words = get().words;
        set({
          words: words.map((word) => (word.id !== wordId ? word : { ...word, ...updates })),
        });
      },
      delWord: (wordId: string) => {
        const words = get().words;
        const totalWordsCnt = get().totalWordsCnt;

        set({
          words: words.filter((word) => word.id !== wordId),
          totalWordsCnt: totalWordsCnt - 1,
        });
      },

      init: async (uid: string) => {
        if (get().selectedCategory !== '') {
          return;
        }

        const categories = await fb_loadCategories(uid);

        set({
          selectedCategory:
            categories.length === 0
              ? await fb_addCategory(uid, { name: 'Default' })
              : categories[0].id,
        });
      },
    })),
    {
      name: 'vocab-store',
      partialize: (state) => ({
        categories: state.categories,
        selectedCategory: state.selectedCategory,
      }),
    },
  ),
);
