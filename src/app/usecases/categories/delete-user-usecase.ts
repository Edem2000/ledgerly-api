import { Usecase } from 'domain/_core/base-domain/base-usecase';
import { UserService } from 'domain/user/service/service';
import { Context, Identifier } from 'domain/_core';
import { CurrentUser } from 'domain/_utils/auth/types';
import { AuditLogService, AuditType, TargetEntity } from 'domain/audit';

type DeleteUserParams = {
    id: Identifier;
};

type DeleteUserResult = void;
export interface DeleteUserUsecase extends Usecase<DeleteUserParams, DeleteUserResult, CurrentUser, Context> {}

export class DeleteUserUsecaseImpl implements DeleteUserUsecase {
    constructor(
        private userService: UserService,
        private auditLogService: AuditLogService,
    ) {}

    async execute(params: DeleteUserParams, currentUser: CurrentUser, context: Context): Promise<DeleteUserResult> {
        await this.userService.deleteById(params.id);

        await this.auditLogService
            .log(
                {
                    type: AuditType.UserDelete,
                    actorUserId: currentUser.id,
                    targetEntity: TargetEntity.User,
                    targetId: params.id,
                },
                context,
            )
            .catch((e) => {
                console.log('log creation error:', e);
            });
    }
}
