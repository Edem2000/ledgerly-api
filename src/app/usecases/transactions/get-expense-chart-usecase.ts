import { Usecase } from 'domain/_core/base-domain/base-usecase';
import { Context, EntityId } from 'domain/_core';
import { CurrentUser } from 'domain/_utils/auth/types';
import { CategoryService } from 'domain/category';
import { TransactionService } from 'domain/transaction';

export type ExpenseChartItem = {
    categoryId: string;
    title: string;
    color: string;
    icon?: string;
    total: number;
};

type GetExpenseChartParams = {
    year: number;
    month: number;
};

type GetExpenseChartResult = {
    items: ExpenseChartItem[];
};

export interface GetExpenseChartUsecase
    extends Usecase<GetExpenseChartParams, GetExpenseChartResult, CurrentUser, Context> {}

export class GetExpenseChartUsecaseImpl implements GetExpenseChartUsecase {
    constructor(private transactionService: TransactionService, private categoryService: CategoryService) {}

    async execute(
        params: GetExpenseChartParams,
        currentUser: CurrentUser,
        _context: Context,
    ): Promise<GetExpenseChartResult> {
        const userId = new EntityId(currentUser.id);
        const { from, to } = this.getMonthRange(params.year, params.month);

        const summaries = await this.transactionService.getExpenseSummaryByCategory({ userId, from, to });
        const categories = await this.categoryService.findAllByUser(userId);
        const categoriesById = new Map(categories.map((category) => [category.id.toString(), category]));

        const items: ExpenseChartItem[] = [];

        for (const summary of summaries) {
            const category = categoriesById.get(summary.categoryId.toString());
            if (!category) {
                continue;
            }

            const title =
                category.title[currentUser.language as keyof typeof category.title] ||
                category.title.en ||
                category.title.ru ||
                category.title.uz;

            items.push({
                categoryId: category.id.toString(),
                title,
                color: category.color,
                icon: category.icon,
                total: summary.total,
            });
        }
        return { items };
    }

    private getMonthRange(year: number, month: number): { from: Date; to: Date } {
        const from = new Date(year, month - 1, 1);
        const to = new Date(year, month, 1);

        return { from, to };
    }
}
