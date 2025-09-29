import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { type WordDetail } from '@/store/translation-store';
import { fb_loadCategories, fb_addCategory } from '@/hooks/use-vocab';

export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export type Word = WordDetail & {
  sourceLang: 'en' | 'zh';
  targetLang: 'zh' | 'en';
  translatedText: string;
};

export interface VocabStore {
  categories: Category[];
  isCategoriesLoading: Boolean;
  selectedCategory: string; // selected catetory ID

  setCategories: (categries: Category[]) => void;
  setIsCategoriesLoading: (isCategoriesLoading: boolean) => void;
  setSelectedCategory: (selectedCategory: string) => void;
  addCategory: (category: Category) => void;

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
