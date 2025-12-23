export interface LlmProvider {
    suggestCategories(transactionTitle: string, currentCategories: string[]): Promise<string[]>;
}