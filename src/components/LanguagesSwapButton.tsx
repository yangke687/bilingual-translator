import { ArrowLeftRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useTranslationStore } from '@/store/translation-store'


export default function LanguagesSwapButton() {
  const { swapLanguages } = useTranslationStore()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={swapLanguages}
      disabled={false}
      className="flex items-center gap-2 transition-transform hover:scale-105"
    >
      <ArrowLeftRight className="w-4 h-4" />
      <span className="hidden sm:inline">Swap</span>
    </Button>
  );
}
