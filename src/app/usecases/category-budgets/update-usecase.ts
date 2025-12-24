import { Usecase } from 'domain/_core/base-domain/base-usecase';
import { Context, EntityId, Identifier } from 'domain/_core';
import { CurrentUser } from 'domain/_utils/auth/types';
import { CategoryBudget, CategoryBudgetService } from 'domain/category-budget';
import { Currency } from 'domain/transaction';
import { CategoryBudgetAmountRequiredError, CategoryBudgetNotFoundError } from 'domain/utils/errors';

type UpdateCategoryBudgetParams = {
    id: Identifier;
    plannedAmount?: number | null;
    limitAmount?: number | null;
    currency?: Currency;
    note?: string;
};

type UpdateResult = {
    budget: CategoryBudget;
};

export interface UpdateCategoryBudgetUsecase
    extends Usecase<UpdateCategoryBudgetParams, UpdateResult, CurrentUser, Context> {}

export class UpdateCategoryBudgetUsecaseImpl implements UpdateCategoryBudgetUsecase {
    constructor(private categoryBudgetService: CategoryBudgetService) {}

    async execute(
        params: UpdateCategoryBudgetParams,
        currentUser: CurrentUser,
        context: Context,
    ): Promise<UpdateResult> {
        const categoryBudget = await this.categoryBudgetService.getById(params.id);

        if (!categoryBudget) {
            throw new CategoryBudgetNotFoundError();
        }

        const userId = new EntityId(currentUser.id);
        await this.categoryBudgetService.validateOwnership(categoryBudget, userId);

        if (params.plannedAmount !== undefined) {
            categoryBudget.plannedAmount = params.plannedAmount ?? undefined;
        }

        if (params.limitAmount !== undefined) {
            categoryBudget.limitAmount = params.limitAmount ?? undefined;
        }

        if (params.currency !== undefined) {
            categoryBudget.currency = params.currency;
        }

        if (params.note !== undefined) {
            categoryBudget.note = params.note;
        }

        if (categoryBudget.plannedAmount == null && categoryBudget.limitAmount == null) {
            throw new CategoryBudgetAmountRequiredError();
        }

        const saved = await this.categoryBudgetService.save(categoryBudget);

        return { budget: saved };
    }
}
