import { Usecase } from 'domain/_core/base-domain/base-usecase';
import { TransactionService } from 'domain/transaction';
import { Context, Identifier } from 'domain/_core';
import { CurrentUser } from 'domain/_utils/auth/types';
import { AuditLogService, AuditType, TargetEntity } from 'domain/audit';

type DeleteTransactionParams = {
    id: Identifier;
};

type DeleteTransactionResult = void;
export interface DeleteTransactionUsecase
    extends Usecase<
        DeleteTransactionParams,
        DeleteTransactionResult,
        CurrentUser,
        Context
    > {}

export class DeleteTransactionUsecaseImpl implements DeleteTransactionUsecase {
    constructor(
        private transactionService: TransactionService,
        private auditLogService: AuditLogService,
    ) {}

    async execute(
        params: DeleteTransactionParams,
        currentUser: CurrentUser,
        context: Context,
    ): Promise<DeleteTransactionResult> {
        await this.transactionService.deleteById(params.id);

        await this.auditLogService
            .log(
                {
                    type: AuditType.TransactionDelete,
                    actorUserId: currentUser.id,
                    targetEntity: TargetEntity.Transaction,
                    targetId: params.id,
                },
                context,
            )
            .catch((e) => {
                console.log('log creation error:', e);
            });
    }
}