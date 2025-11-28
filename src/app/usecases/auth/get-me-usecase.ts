import { Usecase } from 'domain/_core/base-domain/base-usecase';
import { UserService } from 'domain/user/service/service';
import { CurrentUser, JwtService, TokenPayload, TokensObject } from 'domain/_utils/auth/types';
import { User } from 'domain/user/user';
import { RoleService } from 'domain/role/service/service';
import { Role } from 'domain/role/role';
import { InvalidCredentialsError, RoleNotFoundError, UserNotFoundError } from 'domain/utils/errors';
import { CurrentUserService } from 'domain/session';
import { EntityId } from 'domain/_core';

type GetMeParams = TokenPayload;

type GetMeResult = CurrentUser;

export interface GetMeUsecase extends Usecase<GetMeParams, GetMeResult> {}

export class GetMeUsecaseImpl implements GetMeUsecase {
  constructor(
    private userService: UserService,
    private currentUserService: CurrentUserService,
    private roleService: RoleService,
  ) {}

  async execute(params: GetMeParams): Promise<GetMeResult> {
    const cached = this.currentUserService.get(params.id);

    if(cached){
      return cached;
    }

    const user = await this.userService.getById(new EntityId(params.id));

    if(!user){
      throw new UserNotFoundError();
    }

    const role = await this.roleService.findById(user.role);

    if(!role) {
      throw new RoleNotFoundError();
    }

    const userData = {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      language: user.language,
      companyIds: user.companyIds,
      roleId: role.id.toString(),
      roleAlias: role.alias,
    };

    this.currentUserService.set(userData)

    return userData;
  }
}