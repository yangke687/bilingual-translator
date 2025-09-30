import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import VocabularyCategories from '@/components/VocabCategories';
import VocabularyList from '@/components/VocabularyList';
import { useParams } from 'react-router-dom';
import { useVocab } from '@/hooks/use-vocab';
import { useAuth } from '@/lib/auth-context';

const VocabularyPage = () => {
  const { category } = useParams<{ category: string }>();

  const { loadWords } = useVocab();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadWords(category);
    }
  }, [user, category]);

  return (
    <div className="min-h-screen bg-background overflow-y-hidden">
      <div className="container mx-auto h-screen">
        {/* 顶部导航 */}
        <div className="p-4 border-b border-border">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              返回翻译
            </Button>
          </Link>
        </div>

        <div className="flex h-full">
          {/* 左侧分类栏 */}
          <div className="w-80 border-r border-border bg-muted/20">
            {<VocabularyCategories onLoad={loadWords} />}
          </div>

          {/* 右侧生词列表 */}
          <div className="flex-1">
            <VocabularyList category={category} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VocabularyPage;
