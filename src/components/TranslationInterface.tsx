import { useToast } from '@/lib/ToastContext';
import { Copy, Languages } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import LanguagesSwapButton from './LanguagesSwapButton';

export default function TranslationInterface() {
  const { toast } = useToast();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied!',
        description: 'Text copied to clipboard',
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Copy failed',
        description: 'Failed to copy text to clipboard',
      });
    }
  };

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
      <Button
        variant="ghost"
        size="sm"
        onClick={() => copyToClipboard('Hello, World!')}
        className="h-8 px-2"
      >
        <Copy className="w-4 h-4" />
      </Button>
    </div>
  );
}
