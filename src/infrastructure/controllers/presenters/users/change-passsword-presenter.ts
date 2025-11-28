import { TokensObject } from 'domain/_utils/auth/types';
import { User } from 'domain/user/user';
import { Role } from 'domain/role/role';
import { UserPresenter, UserResponseDto } from 'infrastructure/controllers/presenters/_common/user-presenter';
import { ErrorDto } from 'infrastructure/controllers/dtos/error-dto';

export class ChangePasswordPresenter {
  static present(user: User, role: Role, tokens: TokensObject): ChangePasswordResponseDto{
    return {
      success: true,
      user: UserPresenter.present(user, role),
      tokens: tokens,
    }
  }
}

export type ChangePasswordResponseDto = {
  success: boolean,
  user: UserResponseDto,
  tokens: {
    accessToken: string,
    refreshToken: string,
  }
} | ErrorDto;