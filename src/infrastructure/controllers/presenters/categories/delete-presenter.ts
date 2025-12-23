import { ErrorDto } from 'infrastructure/controllers/dtos/error-dto';

export class DeleteCategoryPresenter {
    static present(): DeleteCategoryResponseDto {
        return {
            success: true,
        };
    }
}

export type DeleteCategoryResponseDto =
    | {
          success: boolean;
      }
    | ErrorDto;
