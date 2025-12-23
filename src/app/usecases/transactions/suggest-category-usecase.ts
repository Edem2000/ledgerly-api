import { Usecase } from 'domain/_core/base-domain/base-usecase';
import { Context, EntityId } from 'domain/_core';
import { CurrentUser } from 'domain/_utils/auth/types';
import { Category, CategoryService } from 'domain/category';
import { LlmProvider } from 'domain/_utils/llm';

export type SuggestedCategory = {
    id?: string;
    title: string;
    aiSuggested: boolean;
    isNew: boolean;
};

type SuggestCategoryParams = {
    title: string;
};

type SuggestCategoryResult = {
    suggestions: SuggestedCategory[];
};

export interface SuggestCategoryUsecase
    extends Usecase<SuggestCategoryParams, SuggestCategoryResult, CurrentUser, Context> {}

export class SuggestCategoryUsecaseImpl implements SuggestCategoryUsecase {
    constructor(private categoryService: CategoryService, private llmProvider: LlmProvider) {}

    async execute(
        params: SuggestCategoryParams,
        currentUser: CurrentUser,
        _context: Context,
    ): Promise<SuggestCategoryResult> {
        const userId = new EntityId(currentUser.id);
        const categories = await this.categoryService.findAllByUser(userId);
        const language = currentUser.language;

        const categoryTitles = categories.map((category) => this.getCategoryTitle(category, language));
        const titleToCategory = new Map(
            categories.map((category) => [this.normalizeTitle(this.getCategoryTitle(category, language)), category]),
        );

        const llmSuggestions = await this.llmProvider.suggestCategories({
            title: params.title,
            existingCategories: categoryTitles,
            maxSuggestions: 3,
        });

        const suggestions: SuggestedCategory[] = [];
        const usedTitles = new Set<string>();

        for (const suggestion of llmSuggestions) {
            const normalized = this.normalizeTitle(suggestion.title);
            if (!normalized || usedTitles.has(normalized)) {
                continue;
            }

            const matchedCategory = titleToCategory.get(normalized);
            const title = matchedCategory
                ? this.getCategoryTitle(matchedCategory, language)
                : suggestion.title.trim();

            suggestions.push({
                id: matchedCategory?.id?.toString(),
                title,
                aiSuggested: true,
                isNew: !matchedCategory,
            });
            usedTitles.add(normalized);

            if (suggestions.length >= 3) {
                break;
            }
        }

        const remainingSlots = Math.max(0, 5 - suggestions.length);
        if (remainingSlots > 0) {
            const sortedCategories = [...categories].sort((a, b) => {
                if (a.usageCount !== b.usageCount) {
                    return b.usageCount - a.usageCount;
                }

                const aDate = a.lastUsedAt?.getTime() ?? 0;
                const bDate = b.lastUsedAt?.getTime() ?? 0;

                if (aDate !== bDate) {
                    return bDate - aDate;
                }

                const aTitle = this.getCategoryTitle(a, language);
                const bTitle = this.getCategoryTitle(b, language);

                return aTitle.localeCompare(bTitle);
            });

            for (const category of sortedCategories) {
                if (suggestions.length >= 5) {
                    break;
                }

                const normalized = this.normalizeTitle(this.getCategoryTitle(category, language));
                if (usedTitles.has(normalized)) {
                    continue;
                }

                suggestions.push({
                    id: category.id.toString(),
                    title: this.getCategoryTitle(category, language),
                    aiSuggested: false,
                    isNew: false,
                });
                usedTitles.add(normalized);
            }
        }

        return { suggestions: suggestions.slice(0, 5) };
    }

    private getCategoryTitle(category: Category, language: string): string {
        return (
            category.title[language as keyof typeof category.title] ||
            category.title.en ||
            category.title.ru ||
            category.title.uz
        );
    }

    private normalizeTitle(title: string): string {
        return title.trim().toLowerCase();
    }
}
