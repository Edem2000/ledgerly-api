import { Usecase } from 'domain/_core/base-domain/base-usecase';
import { Context, EntityId } from 'domain/_core';
import { CurrentUser } from 'domain/_utils/auth/types';
import { BudgetPeriod, CategoryBudget, CategoryBudgetService } from 'domain/category-budget';
import { TransactionService } from 'domain/transaction';

type GetCategoryBudgetsParams = BudgetPeriod;

type GetCategoryBudgetsResult = {
    budgets: (CategoryBudget & { spent?: number })[];
};

export interface GetCategoryBudgetsUsecase
    extends Usecase<GetCategoryBudgetsParams, GetCategoryBudgetsResult, CurrentUser, Context> {}

export class GetCategoryBudgetsUsecaseImpl implements GetCategoryBudgetsUsecase {
    constructor(
        private categoryBudgetService: CategoryBudgetService,
        private transactionService: TransactionService,
    ) {}

    async execute(
        params: GetCategoryBudgetsParams,
        currentUser: CurrentUser,
        context: Context,
    ): Promise<GetCategoryBudgetsResult> {
        const userId = new EntityId(currentUser.id);
        const budgets = await this.categoryBudgetService.findByPeriod(userId, params);

        // Enrich each budget with spent amount
            const enrichedBudgets = await Promise.all(
                budgets.map(async (budget) => {
                    try {
                        // Skip if categoryId is missing
                        if (!budget.categoryId) {
                            (budget as any).spent = undefined;
                            return budget as CategoryBudget & { spent?: number };
                        }

                        const spent = await this.transactionService.getSpentByCategoryAndPeriod({
                            userId,
                            categoryId: budget.categoryId,
                            year: params.year,
                            month: params.month,
                        });

                        (budget as any).spent = spent;
                        return budget as CategoryBudget & { spent?: number };
                    } catch (e) {
                        console.log('Failed to get spent for budget', budget.id, e);
                        (budget as any).spent = undefined;
                        return budget as CategoryBudget & { spent?: number };
                    }
                }),
            );

        return { budgets: enrichedBudgets };
    }
}
