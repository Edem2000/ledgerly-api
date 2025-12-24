import { ErrorDto } from 'infrastructure/controllers/dtos/error-dto';
import { CategoryBudget } from 'domain/category-budget';
import {
    CategoryBudgetPresenter,
    CategoryBudgetResponseDto,
} from 'infrastructure/controllers/presenters/_common/category-budget-presenter';

export class GetCategoryBudgetsPresenter {
    static present(budgets: (CategoryBudget & { spent?: number })[]): GetCategoryBudgetsResponseDto {
        return {
            success: true,
            data: budgets.map((budget) => {
                return CategoryBudgetPresenter.present(budget, (budget as any).spent);
            }),
        };
    }
}

export type GetCategoryBudgetsResponseDto =
    | {
          success: boolean;
          data: CategoryBudgetResponseDto[];
      }
    | ErrorDto;
