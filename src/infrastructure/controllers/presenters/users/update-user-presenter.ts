import { User } from 'domain/user/user';
import { Role } from 'domain/role/role';
import { UserPresenter, UserResponseDto } from 'infrastructure/controllers/presenters/_common/user-presenter';
import { ErrorDto } from 'infrastructure/controllers/dtos/error-dto';

export class UpdateUserPresenter {
  static present(user: User, role: Role): UpdateUserResponseDto{
    return {
      success: true,
      user: UserPresenter.present(user, role),
    }
  }
}

export type UpdateUserResponseDto = {
  success: boolean,
  user: UserResponseDto,
} | ErrorDto;