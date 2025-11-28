import { TokensObject } from 'domain/_utils/auth/types';
import { User } from 'domain/user/user';
import { Role } from 'domain/role/role';
import { UserPresenter, UserResponseDto } from 'infrastructure/controllers/presenters/_common/user-presenter';
import { ErrorDto } from 'infrastructure/controllers/dtos/error-dto';

export class LoginPresenter {
  static present(user: User, role: Role, tokens: TokensObject): LoginResponseDto{
    return {
      success: true,
      user: UserPresenter.present(user, role),
      tokens: tokens,
    }
  }
}

export type LoginResponseDto = {
  success: boolean,
  user: UserResponseDto,
  tokens: {
    accessToken: string,
    refreshToken: string,
  }
} | ErrorDto;