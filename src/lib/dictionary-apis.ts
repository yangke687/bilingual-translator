// 词典API服务 - 获取音标、词性、例句等详细信息

import { type WordDetail } from '@/store/translation-store';

// Free Dictionary API - 免费英语词典
export class FreeDictionaryAPI {
  static async getWordDetails(word: string): Promise<WordDetail | null> {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`,
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        return null;
      }

      const entry = data[0];
      const wordDetail: WordDetail = {
        word: entry.word || word,
        phonetic: this.extractPhonetic(entry),
        phoneticAudio: this.extractPhoneticAudio(entry),
        partOfSpeech: [],
        definitions: [],
        examples: [],
        synonyms: [],
      };

      // 提取词性、定义和例句
      if (entry.meanings && Array.isArray(entry.meanings)) {
        for (const meaning of entry.meanings) {
          const partOfSpeech = meaning.partOfSpeech || '';

          if (meaning.definitions && Array.isArray(meaning.definitions)) {
            for (const definition of meaning.definitions) {
              // 添加带词性的定义
              const defText = partOfSpeech
                ? `(${partOfSpeech}) ${definition.definition}`
                : definition.definition;
              wordDetail.definitions.push(defText);

              // 设置主要词性
              if (partOfSpeech && !wordDetail.partOfSpeech?.includes(partOfSpeech)) {
                wordDetail.partOfSpeech?.push(partOfSpeech);
              }

              // 添加例句
              if (definition.example) {
                wordDetail.examples?.push(definition.example);
              }

              // 添加同义词
              if (definition.synonyms && Array.isArray(definition.synonyms)) {
                wordDetail.synonyms?.push(...definition.synonyms);
              }
            }
          }
        }
      }

      // 限制数量避免界面过于冗长
      // wordDetail.definitions = wordDetail.definitions; //.slice(0, 3);
      const __definitions: string[] = [];

      wordDetail.partOfSpeech?.forEach((p: string) => {
        const d = wordDetail.definitions.filter((d) => d.indexOf(`(${p})`) == 0);
        if (d.length > 1) {
          __definitions.push(d[0]);
          __definitions.push(d[1]);
        } else if (d.length > 0) {
          __definitions.push(d[0]);
        }
      });
      wordDetail.definitions = __definitions;
      wordDetail.examples = wordDetail.examples?.slice(0, 2);
      wordDetail.synonyms = wordDetail.synonyms?.slice(0, 3);

      return wordDetail;
    } catch (error) {
      console.warn('Free Dictionary API 错误:', error);
      return null;
    }
  }

  private static extractPhonetic(entry: any): string | undefined {
    // 尝试从多个位置提取音标
    if (entry.phonetic) {
      return entry.phonetic;
    }

    if (entry.phonetics && Array.isArray(entry.phonetics)) {
      for (const phonetic of entry.phonetics) {
        if (phonetic.text) {
          return phonetic.text;
        }
      }
    }

    return undefined;
  }

  private static extractPhoneticAudio(entry: any): string | undefined {
    if (entry.phonetics && Array.isArray(entry.phonetics)) {
      for (const phonetic of entry.phonetics) {
        if (phonetic.audio) {
          return phonetic.audio;
        }
      }
    }

    return undefined;
  }
}

// 词典服务管理器
export class DictionaryManager {
  // 获取英文单词详细信息
  static async getEnglishWordDetails(word: string): Promise<WordDetail | null> {
    // 清理单词（移除标点符号，转为小写）
    const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');

    if (!cleanWord || cleanWord.length < 2) {
      return null;
    }

    // 尝试Free Dictionary API
    const result = await FreeDictionaryAPI.getWordDetails(cleanWord);
    if (result) {
      return result;
    }

    // 备用API可以在这里添加
    return null;
  }

  // 获取中文词汇详细信息
  static async getChineseWordDetails(word: string): Promise<WordDetail | null> {
    // 中文词典API暂时未实现
    // 可以集成百度词典或其他中文词典API
    return null;
  }

  // 批量获取句子中所有词汇的详细信息
  static async getTextDetails(text: string, language: 'en' | 'zh'): Promise<WordDetail[]> {
    if (language === 'zh') {
      // 中文分词较复杂，暂时返回空数组
      return [];
    }

    // 英文单词提取
    const words = this.extractEnglishWords(text);
    const wordDetails: WordDetail[] = [];

    // 限制查询数量避免过多API请求
    const limitedWords = words.slice(0, 5);

    for (const word of limitedWords) {
      const detail = await this.getEnglishWordDetails(word);
      if (detail) {
        wordDetails.push(detail);
      }
    }

    return wordDetails;
  }

  // 提取英文单词
  private static extractEnglishWords(text: string): string[] {
    // 提取英文单词，过滤常见停用词
    const stopWords = new Set([
      'the',
      'a',
      'an',
      'and',
      'or',
      'but',
      'in',
      'on',
      'at',
      'to',
      'for',
      'of',
      'with',
      'by',
      'is',
      'are',
      'was',
      'were',
      'be',
      'been',
      'have',
      'has',
      'had',
      'do',
      'does',
      'did',
      'will',
      'would',
      'should',
      'could',
      'this',
      'that',
      'these',
      'those',
      'i',
      'you',
      'he',
      'she',
      'it',
      'we',
      'they',
    ]);

    const words = text.toLowerCase().match(/\b[a-z]+\b/g) || [];

    return words.filter((word) => word.length > 2 && !stopWords.has(word)).slice(0, 10); // 限制单词数量
  }
}
