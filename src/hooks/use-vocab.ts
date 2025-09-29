import { useAuth } from '@/lib/auth-context';
import { getFireDb } from '@/lib/firebase';
import { useVocabStore, type Word } from '@/store/vocab-store';
import { doc, setDoc, query, getDocs, getDoc, collection, orderBy } from 'firebase/firestore';
import { type Category } from '@/store/vocab-store';
import { useToast } from '@/lib/ToastContext';

const db = getFireDb();

export const fb_loadCategories = async (uid: string) => {
  const q = await query(collection(db, 'users', uid, 'categories'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .map((item) => ({
      ...item,
      createdAt: item.createdAt.toDate().toISOString(),
    }));
};

export const fb_addCategory = async (
  uid: string,
  category: { name: string; description?: string },
) => {
  const categoryId = category.name.replace(/\s+/g, '').toLocaleLowerCase();
  await setDoc(doc(db, 'users', uid, 'categories', categoryId), {
    name: category.name,
    description: category.description || '',
    createdAt: new Date(),
  });
  return categoryId;
};

export const useVocab = () => {
  const { user } = useAuth();
  const {
    addCategory: localAddCategory,
    setCategories,
    setIsCategoriesLoading,
    selectedCategory,
  } = useVocabStore();
  const { toast } = useToast();

  const getCategories = async () => {
    try {
      setIsCategoriesLoading(true);
      setCategories((await fb_loadCategories(user!.uid)) as Category[]);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  const addCategory = async (name: string, description?: string) => {
    const id = await fb_addCategory(user!.uid, { name, description: description || '' });
    localAddCategory({
      id,
      name,
      description,
      createdAt: new Date().toISOString(),
    } as Category);
  };

  const hasWord = async (word: string) => {
    const wordId = word.toLowerCase();
    const docRef = doc(db, 'users', user!.uid, 'vocab', wordId);
    const snap = await getDoc(docRef);

    return snap.exists();
  };

  const addWord = async (word: Word) => {
    const wordId = word.word.toLowerCase();

    if (!selectedCategory) {
      return toast({
        title: 'Error!',
        description: 'No default vocabulary category selected',
      });
    }

    const { phoneticAudio, phonetic, ...props } = word;

    await setDoc(doc(db, 'users', user!.uid, 'vocab', wordId), {
      ...props,
      phonetic: phonetic || '',
      phoneticAudio: phoneticAudio || '',
      category: selectedCategory,
      createdAt: new Date(),
    });

    toast({
      title: 'Success!',
      description: 'Vocabulary added',
    });
  };

  return {
    getCategories,
    addCategory,
    hasWord,
    addWord,
  };
};
