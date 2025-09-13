import { TranslationHistory } from '../components/TranslationHistory';
import TranslationInterface from '../components/TranslationInterface';
import TranslationSettings from '../components/TranslationSettings';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/** settings */}
          <div className="flex justify-end">
            <TranslationSettings />
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
