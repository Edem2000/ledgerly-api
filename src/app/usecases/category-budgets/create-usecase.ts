import { Usecase } from 'domain/_core/base-domain/base-usecase';
import { Context, EntityId, Identifier } from 'domain/_core';
import { CurrentUser } from 'domain/_utils/auth/types';
import { CategoryBudget, CategoryBudgetService, CategoryBudgetStatus } from 'domain/category-budget';
import { Currency } from 'domain/transaction/types';
// import { CategoryBudgetAlreadyExistsError } from 'domain/utils/errors';

type CreateCategoryBudgetParams = {
    categoryId: Identifier;
    year: number;
    month: number;
    plannedAmount?: number;
    limitAmount?: number;
    currency?: Currency;
    note?: string;
};

type CreateResult = {
    budget: CategoryBudget;
};

export interface CreateCategoryBudgetUsecase
    extends Usecase<CreateCategoryBudgetParams, CreateResult, CurrentUser, Context> {}

export class CreateCategoryBudgetUsecaseImpl implements CreateCategoryBudgetUsecase {
    constructor(private categoryBudgetService: CategoryBudgetService) {}

    async execute(
        params: CreateCategoryBudgetParams,
        currentUser: CurrentUser,
        context: Context,
    ): Promise<CreateResult> {
        const userId = new EntityId(currentUser.id);

        const budget = await this.categoryBudgetService.create({
            userId,
            categoryId: params.categoryId,
            period: { year: params.year, month: params.month },
            plannedAmount: params.plannedAmount,
            limitAmount: params.limitAmount,
            currency: params.currency ?? Currency.Uzs,
            note: params.note,
            status: CategoryBudgetStatus.active,
        });

        return { budget };
    }
}
