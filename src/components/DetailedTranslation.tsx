import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useVocab } from '@/hooks/use-vocab';
import {
  useTranslationStore,
  type DetailedTranslation,
  type WordDetail,
} from '@/store/translation-store';
import { BookOpen, Quote, Users, Volume2, Star } from 'lucide-react';
import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { type Word } from '@/store/vocab-store';

interface DetailedTranslationProps {
  detailed: DetailedTranslation;
  className?: string;
}

const WordDetailCard: React.FC<{ word: WordDetail }> = ({ word }) => {
  const { sourceLang, targetLang, translatedText } = useTranslationStore();
  const { user } = useAuth();
  const { addWord, hasWord } = useVocab();
  const [isFavor, setIsFavor] = useState<Partial<Word> | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (user && word && word.word) {
      hasWord(word.word).then((res) => setIsFavor(res));
    }
  }, [word, user]);

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-blue-700">{word.word}</CardTitle>
          <div className="flex items-center gap-2">
            {word.partOfSpeech && (
              <Badge variant="outline" className="text-xs">
                {word.partOfSpeech}
              </Badge>
            )}
            {word.phonetic && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                {word.phoneticAudio && (
                  <Volume2
                    className="w-4 h-4 text-primary cursor-pointer"
                    onClick={() => {
                      const audio = new Audio(word.phoneticAudio);
                      audio.play();
                    }}
                  />
                )}
                <span className="font-mono">{word.phonetic}</span>
              </div>
            )}
            {/** 添加到生词本 */}
            {user &&
              (isFavor ? (
                <Star
                  className="w-4 h-4  fill-current text-yellow-500 cursor-pointer"
                  onClick={() => navigate(`/vocab/${isFavor!.category}/${isFavor!.word}`)}
                />
              ) : (
                <Star
                  className="w-4 h-4 cursor-pointer"
                  onClick={async () => {
                    try {
                      const _word = { ...word, sourceLang, targetLang, translatedText };
                      await addWord(_word);
                      setIsFavor(_word);
                    } catch {}
                  }}
                />
              ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 定义/释义 */}
        {word.definitions.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-sm text-gray-700">释义</span>
            </div>
            <ul className="space-y-1 ml-6">
              {word.definitions.map((definition, index) => (
                <li key={index} className="text-sm text-gray-800 leading-relaxed">
                  • {definition}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 例句 */}
        {word.examples && word.examples.length > 0 && (
          <>
            <Separator />
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Quote className="w-4 h-4 text-green-600" />
                <span className="font-medium text-sm text-gray-700">例句</span>
              </div>
              <ul className="space-y-2 ml-6">
                {word.examples.map((example, index) => (
                  <li key={index} className="text-sm text-gray-700 italic bg-green-50 p-2 rounded">
                    "{example}"
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* 同义词 */}
        {word.synonyms && word.synonyms.length > 0 && (
          <>
            <Separator />
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-sm text-gray-700">近义词</span>
              </div>
              <div className="flex flex-wrap gap-1 ml-6">
                {word.synonyms.map((synonym, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {synonym}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export const DetailedTranslationView: React.FC<DetailedTranslationProps> = ({
  detailed,
  className = '',
}) => {
  if (!detailed.words || detailed.words.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">词汇详解</h3>
        <Badge variant="outline" className="text-xs">
          {detailed.service}
        </Badge>
      </div>

      <div className="space-y-3">
        {detailed.words.map((word, index) => (
          <WordDetailCard key={`${word.word}-${index}`} word={word} />
        ))}
      </div>

      {detailed.words.length > 0 && (
        <div className="text-xs text-gray-500 text-center py-2">
          词汇信息来源：Free Dictionary API
        </div>
      )}
    </div>
  );
};
