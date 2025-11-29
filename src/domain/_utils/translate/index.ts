import { Language } from 'domain/_core';

export interface TranslateService {
  translate(input: string, targetLanguage: Language, originLanguage?: Language): Promise<string>;
  detectLanguage(input: string): Promise<Language>;
}