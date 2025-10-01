import { useAuth } from '@/lib/auth-context';
import { getFireDb } from '@/lib/firebase';
import { useVocabStore, type Word } from '@/store/vocab-store';
import {
  doc,
  setDoc,
  query,
  getDocs,
  getDoc,
  collection,
  orderBy,
  where,
  startAfter,
  limit,
  type DocumentSnapshot,
} from 'firebase/firestore';
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

export const fb_loadWords = async ({
  uid,
  category,
  searchWord,
  pageSize,
  lastDoc,
  sortField = 'createdAt',
  sortDirection = 'desc',
}: {
  uid: string;
  category?: string;
  searchWord?: string;
  pageSize: number;
  lastDoc: DocumentSnapshot | null;
  sortField?: 'createdAt' | 'word';
  sortDirection?: 'asc' | 'desc';
}) => {
  let q = collection(db, 'users', uid, 'vocab');

  let conditions = [];

  if (category) {
    conditions.push(where('category', '==', category));
  }

  if (searchWord) {
    const normalized = searchWord.trim().toLowerCase();
    conditions.push(where('word', '==', normalized));
  }

  // query
  let queryRef = query(q, ...conditions, orderBy(sortField, sortDirection), limit(pageSize));

  if (lastDoc) {
    queryRef = query(queryRef, startAfter(lastDoc));
  }

  const snapshot = await getDocs(queryRef);

  const words = snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toISOString(),
      }) as Word,
  );

  return {
    words,
    lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
  };
};

//
export const useVocab = () => {
  const { user } = useAuth();
  const {
    words,
    addCategory: localAddCategory,
    setCategories,
    setIsCategoriesLoading,
    selectedCategory,
    setWords,
    setLastDoc,
    setIsWordsLoading,
    lastDoc,
    sortField,
    sortDirection,
    setHasMore,
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

    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  };

  // 添加单词进生词本
  const addWord = async (word: Omit<Word, 'id' | 'createdAt' | 'category'>) => {
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

  // 处理首次加载
  const loadWords = async (category?: string, searchWord?: string) => {
    setWords([]);
    setLastDoc(null);
    setIsWordsLoading(true);

    const { words: newWords, lastDoc: newLastDoc } = await fb_loadWords({
      uid: user!.uid,
      category,
      searchWord,
      pageSize: 5,
      lastDoc: null,
      sortField,
      sortDirection,
    });

    setWords(newWords);
    setLastDoc(newLastDoc);
    setHasMore(newWords.length > 0);
    setIsWordsLoading(false);
  };

  // 下拉加载
  const scrollLoadwords = async (category?: string, searchWord?: string) => {
    const { words: newWords, lastDoc: newLastDoc } = await fb_loadWords({
      uid: user!.uid,
      category,
      searchWord,
      pageSize: 5,
      lastDoc,
      sortField,
      sortDirection,
    });

    setWords([...words, ...newWords]);
    setLastDoc(newLastDoc);
    setHasMore(newWords.length > 0);
    setIsWordsLoading(false);
  };

  return {
    getCategories,
    addCategory,
    hasWord,
    addWord,
    loadWords,
    scrollLoadwords,
  };
};
