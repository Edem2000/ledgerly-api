import { ErrorDto } from 'infrastructure/controllers/dtos/error-dto';
import { CategoryBudget } from 'domain/category-budget';
import {
    CategoryBudgetPresenter,
    CategoryBudgetResponseDto,
} from 'infrastructure/controllers/presenters/_common/category-budget-presenter';

export class GetCategoryBudgetsPresenter {
    static present(budgets: CategoryBudget[]): GetCategoryBudgetsResponseDto {
        return {
            success: true,
            data: budgets.map((transaction) => {
                return CategoryBudgetPresenter.present(transaction);
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
