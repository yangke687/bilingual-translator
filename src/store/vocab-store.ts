import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface VocabStore {
  categories: Category[];
  isCategoriesLoading: Boolean;
  selectedCategory: string; // selected catetory ID

  setCategories: (categries: Category[]) => void;
  setIsCategoriesLoading: (isCategoriesLoading: boolean) => void;
  setSelectedCategory: (selectedCategory: string) => void;
  addCategory: (category: Category) => void;
}

export const useVocabStore = create<VocabStore>()(
  persist(
    devtools((set, get) => ({
      categories: [],

      setCategories: (categories: Category[]) => set({ categories }),
      setIsCategoriesLoading: (isCategoriesLoading: boolean) => set({ isCategoriesLoading }),
      setSelectedCategory: (selectedCategory: string) => set({ selectedCategory }),
      addCategory: (newCategory: Category) =>
        set((state: VocabStore) =>
          !state.categories.map((item) => item.id).includes(newCategory.id)
            ? { categories: [newCategory, ...state.categories] }
            : state,
        ),
    })),
    {
      name: 'vocab-store',
      partialize: (state) => ({
        selectedCategory: state.selectedCategory,
      }),
    },
  ),
);
