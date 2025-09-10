export interface TranslationAPI {
  name: string;
  translate: (text: string, from: string, to: string) => Promise<string>;
  isAvailable: () => boolean;
  dailyLimit?: number;
  requiresAuth: boolean;
}

export class TranslationManager {
  private apis: TranslationAPI[] = [];

  private currentAPIIndex = 0;

  getAvailableAPIs: () => TranslationAPI[] = () => {
    return this.apis.filter((api) => api.isAvailable());
  };
}

export const translationManager = new TranslationManager();
