import { HexString } from 'domain/_core';
import { CategoryBudget } from 'domain/category-budget';

export class CategoryBudgetPresenter {
    public static present(entity: CategoryBudget): CategoryBudgetResponseDto {
        return {
            id: entity.id.toString(),
            categoryId: entity.categoryId.toString(),
            period: entity.period,
            plannedAmount: entity.plannedAmount,
            limitAmount: entity.limitAmount,
            currency: entity.currency,
            note: entity.note,
            status: entity.status,
        };
    }
}

export type CategoryBudgetResponseDto = {
    id: HexString;
    categoryId: HexString;
    period: { year: number; month: number };
    plannedAmount?: number;
    limitAmount?: number;
    currency: string;
    note?: string;
    status: string;
}
