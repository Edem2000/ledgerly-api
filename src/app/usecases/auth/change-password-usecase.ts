import { Usecase } from 'domain/_core/base-domain/base-usecase';
import { UserService } from 'domain/user/service/service';
import { CurrentUser, JwtService, TokensObject } from 'domain/_utils/auth/types';
import { User } from 'domain/user/user';
import { RoleService } from 'domain/role/service/service';
import { Role } from 'domain/role/role';
import {
  InvalidCredentialsError,
  PasswordDoNotMatchError,
  RoleNotFoundError,
  UserNotFoundError,
} from 'domain/utils/errors';
import { CurrentUserService } from 'domain/session';
import { Context, Identifier } from 'domain/_core';
import {
  AuditLogService,
  AuditType,
  TargetEntity,
} from 'domain/audit';

type ChangePasswordParams = {
  userId: Identifier,
  currentPassword: string,
  newPassword: string,
  newPasswordConfirmation: string,
}

type ChangePasswordResult = {
  user: User,
  role: Role,
  tokens: TokensObject,
}

export interface ChangePasswordUsecase extends Usecase<ChangePasswordParams, ChangePasswordResult, CurrentUser, Context> {}

export class ChangePasswordUsecaseImpl implements ChangePasswordUsecase {
  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private currentUserService: CurrentUserService,
    private jwtService: JwtService,
    private auditLogService: AuditLogService,
  ) {}

  async execute(params: ChangePasswordParams, currentUser: CurrentUser, context: Context): Promise<ChangePasswordResult> {
    const { userId, currentPassword, newPassword, newPasswordConfirmation} = params;

    if (newPassword !== newPasswordConfirmation) {
      throw new PasswordDoNotMatchError();
    }

    const user = await this.userService.getById(userId);

    if(!user){
      throw new UserNotFoundError();
    }

    const userValidation = await this.userService.validateUser({ email: user.email, password: currentPassword });

    if(!userValidation) {
      throw new InvalidCredentialsError();
    }

    await this.userService.changePassword(user, newPassword);


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

    const tokens = this.jwtService.getTokens(userData);

    this.currentUserService.set(userData);

    await this.userService.updateRefreshToken(user, tokens.refreshToken);

    await this.auditLogService.log({
        type: AuditType.PasswordChange,
        actorUserId: currentUser.id,
        targetEntity: TargetEntity.User,
        targetId: user.id,
    }, context).catch((e) => {
      console.log("log creation error:", e);
    });

    return {user, role, tokens}
  }
}