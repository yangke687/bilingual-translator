import { type DetailedTranslation } from '../store/translation-store';
import { DictionaryManager } from './dictionary-apis';

export interface TranslationAPI {
  name: string;
  translate: (text: string, from: string, to: string) => Promise<string>;
  isAvailable: () => boolean;
  dailyLimit?: number;
  requiresAuth: boolean;
}

// MyMemory 免费翻译API (每日1000次请求限制)
export const myMemoryAPI: TranslationAPI = {
  name: 'MyMemory',
  requiresAuth: false,
  dailyLimit: 1000,

  isAvailable: () => true,

  translate: async (text: string, from: string, to: string) => {
    const fromLang = from === 'en' ? 'en' : 'zh-cn';
    const toLang = to === 'zh' ? 'zh-cn' : 'en';
    const langPair = `${fromLang}|${toLang}`;

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`MyMemory API错误: ${response.status}`);
    }

    const data = await response.json();

    if (data.responseStatus !== 200) {
      throw new Error(`翻译失败: ${data.responseDetails || '未知错误'}`);
    }

    return data.responseData.translatedText;
  },
};

// // LibreTranslate 免费开源翻译API
export const libreTranslateAPI: TranslationAPI = {
  name: 'LibreTranslate',
  requiresAuth: false,

  isAvailable: () => false, // 有跨域限制

  translate: async (text: string, from: string, to: string) => {
    const fromLang = from;
    const toLang = to;

    // 使用公共LibreTranslate实例
    const url = 'https://de.libretranslate.com/';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: fromLang,
        target: toLang,
        format: 'text',
      }),
    });

    if (!response.ok) {
      throw new Error(`LibreTranslate API错误: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`翻译失败: ${data.error}`);
    }

    return data.translatedText;
  },
};

// Google 翻译
export const googleTranslateAPI: TranslationAPI = {
  name: 'Google Translate',
  requiresAuth: false,

  isAvailable: () => true,

  translate: async (text: string, from: string, to: string) => {
    const fromLang = from === 'zh' ? 'zh-cn' : 'en';
    const toLang = to === 'zh' ? 'zh-cn' : 'en';

    // 使用免费的Google Translate代理服务
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromLang}&tl=${toLang}&dt=t&q=${encodeURIComponent(text)}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; TranslationApp/1.0)',
        },
      });

      if (!response.ok) {
        console.warn(`Google Translate代理 ${url} 返回错误: ${response.status}`);
      }

      const data = await response.json();

      if (data && data[0] && data[0][0] && data[0][0][0]) {
        return data[0][0][0];
      }

      console.warn(`Google Translate代理 ${url} 返回格式错误`);
    } catch (error) {
      console.warn(`Google Translate代理 ${url} 请求失败:`, error);
    }

    throw new Error('Google Translate服务暂时不可用');
  },
};

export class TranslationManager {
  private apis: TranslationAPI[] = [myMemoryAPI, /**libreTranslateAPI,*/ googleTranslateAPI];

  getAvailableAPIs(): TranslationAPI[] {
    return this.apis.filter((api) => api.isAvailable());
  }

  async translate(text: string, from: string, to: string, currentAPIIndex: number = 0) {
    if (this.getAvailableAPIs().length === 0) {
      throw new Error('没有可用的翻译服务, 请检查网络连接或API配置');
    }

    if (isNaN(currentAPIIndex)) {
      throw new Error('没有预设的的翻译服务, 请检查网络连接或API配置');
    }

    if (!this.getAvailableAPIs()[currentAPIIndex]) {
      throw new Error('当前翻译服务不可用');
    }

    const api = this.getAvailableAPIs()[currentAPIIndex];

    try {
      const translatedText = await api.translate(text, from, to);

      // 获取详细翻译信息（音标、词性等）
      const detailedResult = await this.getDetailedTranslation(
        text,
        translatedText,
        from,
        to,
        api.name,
      );

      return {
        translatedText,
        detailedResult,
        service: api.name,
      };
    } catch (error) {
      console.warn(`${api.name} 翻译失败:`, error);

      throw new Error('未知错误');
    }
  }

  async getDetailedTranslation(
    sourceText: string,
    translatedText: string,
    from: string,
    to: string,
    serviceName: string,
  ): Promise<DetailedTranslation> {
    try {
      // 判断是否为单词或短语（较短的文本才获取详细信息）
      const isShortText = sourceText.trim().split(/\s+/).length <= 3 && sourceText.length <= 50;

      if (!isShortText) {
        return {
          basicTranslation: translatedText,
          words: [],
          service: serviceName,
        };
      }

      // 获取源语言词汇详细信息
      const sourceWords = await DictionaryManager.getTextDetails(sourceText, from as 'en' | 'zh');

      return {
        basicTranslation: translatedText,
        words: sourceWords,
        service: serviceName,
      };
    } catch (error) {
      console.warn('获取详细翻译信息失败:', error);

      // 失败时返回基础翻译结果
      return {
        basicTranslation: translatedText,
        words: [],
        service: serviceName,
      };
    }
  }
}

export const translationManager = new TranslationManager();
