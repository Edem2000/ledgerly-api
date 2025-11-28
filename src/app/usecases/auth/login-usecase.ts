import { Usecase } from 'domain/_core/base-domain/base-usecase';
import { UserService } from 'domain/user/service/service';
import { CurrentUser, JwtService, TokensObject } from 'domain/_utils/auth/types';
import { User } from 'domain/user/user';
import { RoleService } from 'domain/role/service/service';
import { Role } from 'domain/role/role';
import { InvalidCredentialsError, RoleNotFoundError } from 'domain/utils/errors';
import { CurrentUserService } from 'domain/session';
import { Context } from 'domain/_core';
import { AuditLogService, AuditType, TargetEntity } from 'domain/audit';

type LoginParams = {
  email: string,
  password: string,
}

type LoginResult = {
  user: User,
  role: Role,
  tokens: TokensObject,
}

export interface LoginUsecase extends Usecase<LoginParams, LoginResult, CurrentUser | null, Context> {}

export class LoginUsecaseImpl implements LoginUsecase {
  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private currentUserService: CurrentUserService,
    private jwtService: JwtService,
    private auditLogService: AuditLogService,
  ) {}

  async execute(params: LoginParams, currentUser: CurrentUser, context: Context): Promise<LoginResult> {
    const user = await this.userService.validateUser(params);

    if(!user) {
      throw new InvalidCredentialsError();
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
      roleId: role.id.toString(),
      roleAlias: role.alias,
    };

    const tokens = this.jwtService.getTokens(userData);

    this.currentUserService.set(userData);

    await this.userService.updateRefreshToken(user, tokens.refreshToken);

    await this.auditLogService.log({
      actorUserId: user.id.toString(),
      targetEntity: TargetEntity.User,
      type: AuditType.Login
    }, { ...context, correlationId: tokens.accessToken }).catch((e) => {
      console.log("log creation error:", e);
    });

    return {user, role, tokens}
  }
}