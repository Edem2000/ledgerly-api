export type LlmCategorySuggestion = {
    title: string;
    isNew: boolean;
};

export interface LlmProvider {
    suggestCategories(params: {
        title: string;
        existingCategories: string[];
        maxSuggestions: number;
    }): Promise<LlmCategorySuggestion[]>;
}
