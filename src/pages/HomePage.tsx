import { useEffect } from 'react';
import LoginButton from '@/components/LoginButton';
import { TranslationHistory } from '../components/TranslationHistory';
import TranslationInterface from '../components/TranslationInterface';
import TranslationSettings from '../components/TranslationSettings';
import { useVocabStore } from '@/store/vocab-store';
import { useAuth } from '@/lib/auth-context';

export default function HomePage() {
  const { user } = useAuth();
  const init = useVocabStore((s) => s.init);

  useEffect(() => {
    if (user) {
      init(user.uid);
    }
  }, [user]);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/** settings */}
          <div className="flex justify-end">
            <div className="flex gap-1">
              <TranslationSettings />
              <LoginButton />
            </div>
          </div>

          <TranslationInterface />

          {/* History Section */}
          <div className="flex justify-center">
            <TranslationHistory />
          </div>
        </div>
      </div>
    </div>
  );
}
