import { Usecase } from 'domain/_core/base-domain/base-usecase';
import { Transaction, TransactionService, TransactionSortField, TransactionType } from 'domain/transaction';
import { CurrentUser } from 'domain/_utils/auth/types';
import { Context, EntityId, Identifier } from 'domain/_core';

type GetTransactionsParams = {
    page: number;
    limit: number;
    from?: Date;
    to?: Date;
    categoryId?: Identifier;
    type?: TransactionType;
    sortBy?: TransactionSortField;
};

type GetTransactionsResult = {
    transactions: Transaction[];
    page: number;
    limit: number;
    total: number;
};

export interface GetTransactionsUsecase
    extends Usecase<GetTransactionsParams, GetTransactionsResult, CurrentUser, Context> {}

export class GetTransactionsUsecaseImpl implements GetTransactionsUsecase {
    constructor(private transactionService: TransactionService) {}

    public async execute(
        params: GetTransactionsParams,
        currentUser: CurrentUser,
        context: Context,
    ): Promise<GetTransactionsResult> {
        const { page, limit } = params;

        const { transactions, total } = await this.transactionService.findPaginatedByUser({
            ...params,
            userId: new EntityId(currentUser.id),
        });

        return { transactions, page, limit, total };
    }
}
