import { Usecase } from 'domain/_core/base-domain/base-usecase';
import { Context, EntityId, Identifier } from 'domain/_core';
import { CurrentUser } from 'domain/_utils/auth/types';
import { Transaction, TransactionService } from 'domain/transaction';
import { AuditLogService, AuditType, TargetEntity } from 'domain/audit';
import { Currency, TransactionType } from 'domain/transaction/types';
import { CategoryService } from 'domain/category';
// import { TransactionAlreadyExistsError } from 'domain/utils/errors';

type CreateTransactionParams = {
    categoryId: Identifier;
    title: string;
    type: TransactionType;
    amount: number;
    currency?: string;
    occurredAt?: Date;
    note?: string;
};

type CreateResult = {
    transaction: Transaction;
};

export interface CreateTransactionUsecase
    extends Usecase<CreateTransactionParams, CreateResult, CurrentUser, Context> {}

export class CreateTransactionUsecaseImpl implements CreateTransactionUsecase {
    constructor(
        private transactionService: TransactionService,
        private categoryService: CategoryService,
        private auditLogService: AuditLogService,
    ) {}

    async execute(params: CreateTransactionParams, currentUser: CurrentUser, context: Context): Promise<CreateResult> {
        const userId = new EntityId(currentUser.id);
        const occurredAt = params.occurredAt || new Date();

        const transaction = await this.transactionService.create({
            ...params,
            userId,
            currency: Currency.Uzs,
            occurredAt,
        });

        await this.categoryService.incrementUsage(params.categoryId, occurredAt);

        await this.auditLogService
            .log(
                {
                    type: AuditType.TransactionCreate,
                    actorUserId: currentUser?.id,
                    targetEntity: TargetEntity.Transaction,
                    targetId: transaction.id,
                    metadata: {},
                },
                context,
            )
            .catch((e) => {
                console.log('log creation error:', e);
            });

        return { transaction };
    }
}
