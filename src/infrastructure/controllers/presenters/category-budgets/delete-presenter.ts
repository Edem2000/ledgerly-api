import { ErrorDto } from 'infrastructure/controllers/dtos/error-dto';

export class DeleteCategoryBudgetPresenter {
    static present(): DeleteCategoryBudgetResponseDto {
        return {
            success: true,
        };
    }
}

export type DeleteCategoryBudgetResponseDto =
    | {
          success: boolean;
      }
    | ErrorDto;
