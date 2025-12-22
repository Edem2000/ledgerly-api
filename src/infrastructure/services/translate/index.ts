import { TranslateService } from 'domain/_utils/translate';
import { AllLanguages, Language } from 'domain/_core';
import axios, { AxiosInstance } from 'axios';

export class YandexTranslateService implements TranslateService {
    private readonly http: AxiosInstance;

    constructor(private readonly config: { apiUrl: string; apiKey: string; folderId: string }) {
        if (!config.apiKey || !config.folderId) {
            throw new Error('YANDEX_API_KEY and YANDEX_FOLDER_ID must be defined');
        }

        this.http = axios.create({
            baseURL: this.config.apiUrl,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Api-Key ${config.apiKey}`,
            },
        });
    }

    public async translate(input: string, targetLanguage: Language, originLanguage?: Language): Promise<string> {
        const [result] = await this.translateBatch([input], targetLanguage, originLanguage);
        return result;
    }

    public async detectLanguage(input: string): Promise<Language> {
        const payload: Record<string, unknown> = {
            folderId: this.config.folderId,
            text: input,
            languageCodeHints: AllLanguages,
        };

        const { data } = await this.http.post<YandexDetectResponse>('detect', payload);

        return data?.languageCode;
    }

    private async translateBatch(texts: string[], targetLanguage: string, originLanguage?: string): Promise<string[]> {
        const payload: Record<string, unknown> = {
            folderId: this.config.folderId,
            texts,
            targetLanguageCode: targetLanguage,
        };

        if (originLanguage) {
            payload['sourceLanguageCode'] = originLanguage;
        }

        const { data } = await this.http.post<YandexTranslateResponse>('translate', payload);

        return data.translations.map((t) => t.text);
    }
}

interface YandexTranslateResponse {
    translations: { text: string; detectedLanguageCode?: string }[];
}

interface YandexDetectResponse {
    languageCode: Language;
}
