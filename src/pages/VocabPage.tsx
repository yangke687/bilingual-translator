import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import VocabularyCategories from '@/components/VocabCategories';
// import VocabularyList from '@/components/VocabularyList';
import { useVocabStore } from '@/store/vocab-store';

const VocabularyPage = () => {
  const { selectedCategory } = useVocabStore();

  return (
    <div className="min-h-screen bg-background">
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
          <div className="w-80 border-r border-border bg-muted/20">{<VocabularyCategories />}</div>

          {/* 右侧生词列表 */}
          <div className="flex-1">{/* <VocabularyList category={selectedCategory} /> */}</div>
        </div>
      </div>
    </div>
  );
};

export default VocabularyPage;
