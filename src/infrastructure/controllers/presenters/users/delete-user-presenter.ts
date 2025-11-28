import { ErrorDto } from 'infrastructure/controllers/dtos/error-dto';

export class DeleteUserPresenter{
  static present(): DeleteUserResponseDto {
    return {
      success: true,
    }
  }
}

export type DeleteUserResponseDto = {
  success: boolean,
} | ErrorDto;