import fs from 'node:fs';
import path from 'node:path';
import { LlmCategorySuggestion, LlmProvider } from 'domain/_utils/llm';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

const DEFAULT_PROMPT_PATH = path.resolve(process.cwd(), 'src/infrastructure/services/llm/system-prompt.txt');

type OpenAiConfig = {
    apiUrl: string;
    apiKey: string;
    model: string;
};

export class OpenAiProvider implements LlmProvider {
    private readonly client: OpenAI;
    private readonly systemPrompt: string;

    constructor(private readonly config: OpenAiConfig) {
        if (!config.apiKey) {
            throw new Error('OPENAI_API_KEY must be defined');
        }

        this.client = new OpenAI({
            apiKey: config.apiKey,
            baseURL: config.apiUrl,
        });

        this.systemPrompt = this.loadSystemPrompt();
    }

    public async suggestCategories(params: {
        title: string;
        existingCategories: string[];
        maxSuggestions: number;
    }): Promise<LlmCategorySuggestion[]> {
        const messages: ChatCompletionMessageParam[] = [
            { role: 'system', content: this.systemPrompt },
            {
                role: 'user',
                content: JSON.stringify({
                    title: params.title,
                    existingCategories: params.existingCategories,
                    maxSuggestions: params.maxSuggestions,
                }),
            },
        ];

        const payload = {
            model: this.config.model,
            messages,
            temperature: 0.2,
        };

        const completion = await this.client.chat.completions.create(payload);
        const content = completion.choices?.[0]?.message?.content ?? '';
        return this.parseSuggestions(content, params.maxSuggestions);
    }

    private loadSystemPrompt(): string {
        return (
            'You are an assistant that suggests transaction categories.\n' +
            '\n' +
            'Return ONLY valid JSON with this shape:\n' +
            '{\n' +
            '  "suggestions": [\n' +
            '    { "title": "string", "isNew": true }\n' +
            '  ]\n' +
            '}\n' +
            '\n' +
            'Rules:\n' +
            '- Use the provided existing categories exactly when they fit; set isNew to false.\n' +
            '- If no existing category fits, propose new categories; set isNew to true.\n' +
            '- Suggest at most the requested maxSuggestions.\n' +
            '- Keep titles concise and user-friendly.\n' +
            '- Do not include any extra commentary or formatting outside JSON.\n'
        );
    }

    private parseSuggestions(content: string, maxSuggestions: number): LlmCategorySuggestion[] {
        const jsonPayload = this.extractJson(content);
        if (!jsonPayload) {
            return [];
        }

        const parsed = JSON.parse(jsonPayload) as { suggestions?: Array<{ title?: string; isNew?: boolean }> };
        const suggestions = parsed?.suggestions ?? [];

        return suggestions
            .map((suggestion) => {
                const title = String(suggestion?.title ?? '').trim();
                if (!title) {
                    return null;
                }
                return {
                    title,
                    isNew: Boolean(suggestion?.isNew),
                } satisfies LlmCategorySuggestion;
            })
            .filter((suggestion): suggestion is LlmCategorySuggestion => Boolean(suggestion))
            .slice(0, maxSuggestions);
    }

    private extractJson(content: string): string | null {
        const trimmed = content.trim();
        if (!trimmed) {
            return null;
        }

        const firstBrace = trimmed.indexOf('{');
        const lastBrace = trimmed.lastIndexOf('}');

        if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
            return null;
        }

        return trimmed.slice(firstBrace, lastBrace + 1);
    }
}
