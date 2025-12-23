import { Usecase } from 'domain/_core/base-domain/base-usecase';
import { Context, EntityId } from 'domain/_core';
import { CurrentUser } from 'domain/_utils/auth/types';
import { BudgetPeriod, CategoryBudget, CategoryBudgetService } from 'domain/category-budget';

type GetCategoryBudgetsParams = BudgetPeriod;

type GetCategoryBudgetsResult = {
    budgets: CategoryBudget[];
};

export interface GetCategoryBudgetsUsecase
    extends Usecase<GetCategoryBudgetsParams, GetCategoryBudgetsResult, CurrentUser, Context> {}

export class GetCategoryBudgetsUsecaseImpl implements GetCategoryBudgetsUsecase {
    constructor(private categoryBudgetService: CategoryBudgetService) {}

    async execute(
        params: GetCategoryBudgetsParams,
        currentUser: CurrentUser,
        context: Context,
    ): Promise<GetCategoryBudgetsResult> {
        const userId = new EntityId(currentUser.id);
        const budgets = await this.categoryBudgetService.findByPeriod(userId, params);

        return { budgets };
    }
}
