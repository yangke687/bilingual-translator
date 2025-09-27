import { useAuth } from '@/lib/auth-context';
import { getFireDb } from '@/lib/firebase';
import { useVocabStore } from '@/store/vocab-store';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { type Category } from '@/store/vocab-store';

const db = getFireDb();

export const useVocab = () => {
  const { user } = useAuth();
  const { addCategory: localAddCategory, setCategories, setIsCategoriesLoading } = useVocabStore();

  const getCategories = async () => {
    try {
      setIsCategoriesLoading(true);

      const snap = await getDocs(collection(db, 'users', user!.uid, 'categories'));
      const categories = snap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .map((item) => ({
          ...item,
          createdAt: item.createdAt.toDate().toISOString(),
        }));

      setCategories(categories as Category[]);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  const addCategory = async (name: string, description?: string) => {
    const categoryId = name.replace(/\s+/g, '').toLocaleLowerCase();
    await setDoc(doc(db, 'users', user!.uid, 'categories', categoryId), {
      name,
      description: description || '',
      createdAt: new Date(),
    });

    localAddCategory({
      id: categoryId,
      name,
      description,
      createdAt: new Date().toISOString(),
    } as Category);
  };

  return {
    getCategories,
    addCategory,
  };
};
