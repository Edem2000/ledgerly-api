import { ErrorDto } from 'infrastructure/controllers/dtos/error-dto';

export class DeleteTransactionPresenter{
  static present(): DeleteTransactionResponseDto {
    return {
      success: true,
    }
  }
}

export type DeleteTransactionResponseDto = {
  success: boolean,
} | ErrorDto;