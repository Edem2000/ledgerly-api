import { ErrorDto } from 'infrastructure/controllers/dtos/error-dto';
import { CategoryBudget } from 'domain/category-budget';
import {
    CategoryBudgetPresenter,
    CategoryBudgetResponseDto,
} from 'infrastructure/controllers/presenters/_common/category-budget-presenter';

export class CreateCategoryBudgetPresenter {
    static present(transaction: CategoryBudget): CreateCategoryBudgetResponseDto {
        return {
            success: true,
            transaction: CategoryBudgetPresenter.present(transaction),
        };
    }
}

export type CreateCategoryBudgetResponseDto =
    | {
          success: boolean;
          transaction: CategoryBudgetResponseDto;
      }
    | ErrorDto;
