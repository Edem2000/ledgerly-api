import { Usecase } from 'domain/_core/base-domain/base-usecase';
import { UserService } from 'domain/user/service/service';
import { Context, Language } from 'domain/_core';
import { RoleService } from 'domain/role/service/service';
import { User } from 'domain/user/user';
import { RoleNotFoundError, UserExistsError } from 'domain/utils/errors';
import { Role, RoleAlias } from 'domain/role/role';
import { CurrentUser } from 'domain/_utils/auth/types';
import { AuditLogService, AuditType, TargetEntity } from 'domain/audit';

type UserCreateParams = {
  email: string,
  language: Language,
  name: {
    first: string,
    last: string,
  },
  password: string,
  phone: string,
  role: string,
}


type CreateResult = {
  user: User,
  role: Role,
}

export interface CreateUserUsecase extends Usecase<UserCreateParams, CreateResult, CurrentUser, Context> {}

export class CreateUserUsecaseImpl implements CreateUserUsecase {
  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private auditLogService: AuditLogService,
  ) {}

  async execute(params: UserCreateParams, currentUser: CurrentUser, context: Context): Promise<CreateResult> {
    const role = await this.roleService.findByAlias(params.role);

    if(!role) {
      throw new RoleNotFoundError();
    }

    const createParams = {
      ...params,
      role: role.id,
    };

    const userCheck = await this.userService.findByEmail(params.email);

    if(userCheck){
      throw new UserExistsError();
    }

    const user = await this.userService.create(createParams);


    await this.auditLogService.log({
      type: AuditType.UserRegistration,
      actorUserId: currentUser?.id,
      targetEntity: TargetEntity.User,
      targetId: user.id,
      metadata: {
        roleAlias: role.alias,

        // TODO: registrationDate: user.registeredAt,
      }
    }, context).catch((e) => {
      console.log("log creation error:", e);
    });

    console.log(`Created user ${user.id}`);

    return { user, role };
  }
}