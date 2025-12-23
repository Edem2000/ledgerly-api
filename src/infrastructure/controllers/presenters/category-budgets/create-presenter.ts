import { ErrorDto } from 'infrastructure/controllers/dtos/error-dto';
import { CategoryBudget } from 'domain/category-budget';
import {
    CategoryBudgetPresenter,
    CategoryBudgetResponseDto,
} from 'infrastructure/controllers/presenters/_common/category-budget-presenter';

export class CreateCategoryBudgetPresenter {
    static present(budget: CategoryBudget): CreateCategoryBudgetResponseDto {
        return {
            success: true,
            budget: CategoryBudgetPresenter.present(budget),
        };
    }
}

export type CreateCategoryBudgetResponseDto =
    | {
          success: boolean;
          budget: CategoryBudgetResponseDto;
      }
    | ErrorDto;
