import { ErrorDto } from 'infrastructure/controllers/dtos/error-dto';
import { Category } from 'domain/category';
import {
    CategoryPresenter,
    CategoryResponseDto,
} from 'infrastructure/controllers/presenters/_common/category-presenter';

export class CreateCategoryPresenter {
    static present(category: Category): CreateCategoryResponseDto {
        return {
            success: true,
            category: CategoryPresenter.present(category),
        };
    }
}

export type CreateCategoryResponseDto =
    | {
          success: boolean;
          category: CategoryResponseDto;
      }
    | ErrorDto;
