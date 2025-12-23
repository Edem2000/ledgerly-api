import { Category } from 'domain/category';
import { CurrentUser } from 'domain/_utils/auth/types';
import { CategoryPresenter, CategoryResponseDto } from 'infrastructure/controllers/presenters/_common/category-presenter';
import { ErrorDto } from 'infrastructure/controllers/dtos/error-dto';

export class GetCategoryPresenter {
    static present(category: Category, currentUser: CurrentUser): GetCategoryResponseDto {
        return {
            success: true,
            category: CategoryPresenter.present(category, currentUser),
        };
    }
}

export type GetCategoryResponseDto =
    | {
          success: boolean;
          category: CategoryResponseDto;
      }
    | ErrorDto;
