import { Usecase } from 'domain/_core/base-domain/base-usecase';
import { UserService } from 'domain/user/service/service';
import { Context, Identifier } from 'domain/_core';
import { RoleService } from 'domain/role/service/service';
import { AccessDeniedError, RoleNotFoundError, UserNotFoundError } from 'domain/utils/errors';
import { RoleAlias } from 'domain/role/role';
import { CurrentUser } from 'domain/_utils/auth/types';
import { CurrentUserService } from 'domain/session';
import {
  AuditLogService,
  AuditType,
  TargetEntity,
} from 'domain/audit';

type AssignCompanyToUserParams = {
  userId: Identifier,
  companyId: Identifier,
}

type AssignCompanyToUserResult = {
  success: boolean;
}

export interface AssignCompanyToUserUsecase extends Usecase<AssignCompanyToUserParams, AssignCompanyToUserResult, CurrentUser, Context> {}

export class AssignCompanyToUserUsecaseImpl implements AssignCompanyToUserUsecase {
  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private currentUserService: CurrentUserService,
    private auditLogService: AuditLogService,
  ) {}

  async execute(params: AssignCompanyToUserParams, currentUser: CurrentUser, context: Context): Promise<AssignCompanyToUserResult> {
    const { userId, companyId } = params;

    const user = await this.userService.getById(userId);

    if(!user) {
      throw new UserNotFoundError();
    }

    const targetUserRole = await this.roleService.findById(user.role);

    if(!targetUserRole) {
      throw new RoleNotFoundError();
    }

    const canManage =
      currentUser.roleAlias === RoleAlias.SuperAdmin ||
      (currentUser.roleAlias === RoleAlias.Admin && targetUserRole.alias === RoleAlias.Operator);

    if (!canManage) throw new AccessDeniedError();

    const userUpdated = await this.userService.assignCompanies(user, [ companyId ]);

    this.currentUserService.updateUser(userUpdated)

    await this.auditLogService.log({
        type: AuditType.AssignCompanyToUser,
        actorUserId: currentUser.id,
        targetEntity: TargetEntity.User,
        targetId: userId,
    }, context).catch((e) => {
      console.log("log creation error:", e);
    });

    return { success: true };
  }
}