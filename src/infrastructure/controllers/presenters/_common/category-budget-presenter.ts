import { Category } from 'domain/category/category';
import { HexString, Language } from 'domain/_core';
import { CurrentUser } from 'domain/_utils/auth/types';
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
