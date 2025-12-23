import { ErrorDto } from 'infrastructure/controllers/dtos/error-dto';
import { SuggestedCategory } from 'usecases/transactions/suggest-category-usecase';

export class SuggestCategoryPresenter {
    static present(suggestions: SuggestedCategory[]): SuggestCategoryResponseDto {
        return {
            success: true,
            data: suggestions,
        };
    }
}

export type SuggestCategoryResponseDto =
    | {
          success: boolean;
          data: SuggestedCategory[];
      }
    | ErrorDto;
