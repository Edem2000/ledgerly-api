import { Category } from 'domain/category';
import { CurrentUser } from 'domain/_utils/auth/types';
import { CategoryPresenter, CategoryResponseDto } from 'infrastructure/controllers/presenters/_common/category-presenter';
import { ErrorDto } from 'infrastructure/controllers/dtos/error-dto';

export class GetCategoriesPresenter {
    static present(categories: Category[], currentUser: CurrentUser): GetCategoriesResponseDto {
        return {
            success: true,
            data: categories.map((category) => CategoryPresenter.present(category, currentUser)),
        };
    }
}

export type GetCategoriesResponseDto =
    | {
          success: boolean;
          data: CategoryResponseDto[];
      }
    | ErrorDto;
