import { Usecase } from 'domain/_core/base-domain/base-usecase';
import { UserService } from 'domain/user/service/service';
import { Context, Identifier, Language } from 'domain/_core';
import { RoleService } from 'domain/role/service/service';
import { User } from 'domain/user/user';
import { RoleNotFoundError, UserNotFoundError } from 'domain/utils/errors';
import { Role } from 'domain/role/role';
import { CurrentUser } from 'domain/_utils/auth/types';
import { AuditLogService, AuditType, TargetEntity } from 'domain/audit';

type UserUpdateParams = {
    id: Identifier;
    query: {
        name: {
            first?: string;
            last?: string;
        };
        email?: string;
        language?: Language;
        phone?: string;
    };
};

type UpdateResult = {
    user: User;
    role: Role;
};

export interface UpdateUserUsecase extends Usecase<UserUpdateParams, UpdateResult, CurrentUser, Context> {}

export class UpdateUserUsecaseImpl implements UpdateUserUsecase {
    constructor(
        private userService: UserService,
        private roleService: RoleService,
        private auditLogService: AuditLogService,
    ) {}

    async execute(params: UserUpdateParams, currentUser: CurrentUser, context: Context): Promise<UpdateResult> {
        const user = await this.userService.getById(params.id);

        if (!user) {
            throw new UserNotFoundError();
        }

        const userUpdated = await this.userService.update(user, params.query);

        const role = await this.roleService.findById(userUpdated.role);

        if (!role) {
            throw new RoleNotFoundError();
        }

        await this.auditLogService
            .log(
                {
                    type: AuditType.UserUpdate,
                    actorUserId: currentUser.id,
                    targetEntity: TargetEntity.User,
                    targetId: params.id,
                },
                context,
            )
            .catch((e) => {
                console.log('log creation error:', e);
            });

        console.log(`Updated user ${user.id}`);

        return { user: userUpdated, role };
    }
}
