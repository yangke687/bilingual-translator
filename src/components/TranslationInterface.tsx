import { Languages } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import LanguagesSwapButton from './LanguagesSwapButton';

export default function TranslationInterface() {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/** Header */}
      <div className="text-center space-y-2">
        {/** Title */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <Languages className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Bilingual Translator</h1>
        </div>

        {/** Swap Button */}
        <div className="flex items-center justify-center gap-4">
          <Badge variant={'outline'} className="px-3 py-1">
            Egnlish
          </Badge>
          <LanguagesSwapButton />
          <Badge variant={'outline'} className="px-3 py-1">
            中文
          </Badge>
        </div>
      </div>

      {/** Translation Inteface */}
    </div>
  );
}
