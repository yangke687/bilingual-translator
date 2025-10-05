import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  FolderOpen,
  FolderPlus,
  Search,
  Hash,
  Trash2,
  Edit3,
  Check,
  X,
  Loader2,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  // AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useVocabStore } from '@/store/vocab-store';
import { useVocab } from '@/hooks/use-vocab';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { Checkbox } from './ui/checkbox';

const VocabularyCategories = ({ onLoad }: { onLoad: (category?: string) => void }) => {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    isCategoriesLoading,
    totalWordsCnt,
    // deleteCategory,
  } = useVocabStore();

  const navigate = useNavigate();
  const { category: activeCategory } = useParams<{ category: string }>();

  const { getCategories, addCategory, loadTotalWordsCnt, updateCategory, delCategory } = useVocab();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      getCategories();
      loadTotalWordsCnt();
    }
  }, [user]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategoryName, setEditCategoryName] = useState('');

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      setNewCategoryName('');
      setIsAddingCategory(false);
    }
  };

  const handleUpdateCategory = (categoryId: string) => {
    if (editCategoryName.trim()) {
      updateCategory(categoryId, editCategoryName.trim());
      setEditingCategory(null);
      setEditCategoryName('');
    }
  };

  const startEditing = (category: { id: string; name: string }) => {
    setEditingCategory(category.id);
    setEditCategoryName(category.name);
  };

  const cancelEditing = () => {
    setEditingCategory(null);
    setEditCategoryName('');
  };

  // 删除分类
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; text: string } | null>(
    null,
  );

  const handleDeleteClick = (catId: string, catText: string) => {
    setCategoryToDelete({ id: catId, text: catText });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      delCategory(categoryToDelete.id);
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* 标题区域 */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <FolderOpen className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-semibold">生词本分类</h1>
        </div>

        {/* 搜索框 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="搜索分类..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            disabled={!!isCategoriesLoading}
          />
        </div>
      </div>

      {/* 加载状态 */}
      {isCategoriesLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-sm">加载分类中...</p>
          </div>
        </div>
      ) : (
        /* 分类列表 */
        <ScrollArea className="flex-1 px-4">
          <div className="py-4 space-y-2">
            {/* 全部分类 */}
            <Button
              variant={selectedCategory === null ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start h-auto p-3 text-left',
                !activeCategory && 'bg-primary/10 text-primary',
              )}
              onClick={() => {
                navigate('/vocab');
                onLoad();
              }}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  <span>全部生词</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {totalWordsCnt}
                </Badge>
              </div>
            </Button>

            {/* 现有分类 */}
            {filteredCategories.map((category) => (
              <div key={category.id} className="group">
                {editingCategory === category.id ? (
                  <div className="flex items-center gap-2 p-2 bg-background border border-border rounded-md">
                    <Input
                      value={editCategoryName}
                      onChange={(e) => setEditCategoryName(e.target.value)}
                      className="h-8 text-sm"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleUpdateCategory(category.id);
                        if (e.key === 'Escape') cancelEditing();
                      }}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => handleUpdateCategory(category.id)}
                    >
                      <Check className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={cancelEditing}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    // variant={activeCategory === category.id ? 'secondary' : 'ghost'}
                    variant={'ghost'}
                    className={cn(
                      'w-full justify-start h-auto p-3 text-left relative',
                      activeCategory === category.id && 'bg-primary/10 text-primary',
                    )}
                    asChild
                    onClick={() => {
                      navigate(`/vocab/${category.id}`);
                      onLoad(category.id);
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        {/**<FolderOpen className="w-4 h-4" />**/}
                        <Checkbox
                          checked={selectedCategory === category.id}
                          onCheckedChange={(checked: boolean) => {
                            if (checked) {
                              setSelectedCategory(category.id);
                            }
                          }}
                        />
                        <span className="truncate">{category.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* <Badge variant="secondary" className="text-xs">
                          {category.wordCount}
                        </Badge> */}

                        {/* 操作按钮 */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditing(category);
                            }}
                          >
                            <Edit3 className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(category.id, category.name);
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Button>
                )}
              </div>
            ))}

            {/* 添加新分类 */}
            {isAddingCategory ? (
              <div className="flex items-center gap-2 p-2 bg-background border border-border rounded-md">
                <Input
                  placeholder="输入分类名称..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="h-8 text-sm"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddCategory();
                    if (e.key === 'Escape') setIsAddingCategory(false);
                  }}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={handleAddCategory}
                >
                  <Check className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={() => setIsAddingCategory(false)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                className="w-full justify-start h-auto p-3 text-muted-foreground border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:text-primary"
                onClick={() => setIsAddingCategory(true)}
              >
                <div className="flex items-center gap-2">
                  <FolderPlus className="w-4 h-4" />
                  <span>添加新分类</span>
                </div>
              </Button>
            )}
          </div>
        </ScrollArea>
      )}

      {/* 删除确认对话框 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除分类</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除分类 <b>{categoryToDelete?.text}</b> 吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VocabularyCategories;
