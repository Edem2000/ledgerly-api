import { Transaction, TransactionModel, TransactionSortField } from 'domain/transaction';
import { DeepPartial } from 'domain/utils/type-helpers';
import { TransactionType } from 'domain/transaction/types';
import { Identifier } from 'domain/_core';

export type CreateParams = Omit<TransactionModel, 'deleted' | 'createdAt'>;
export type UpdateParams = DeepPartial<Omit<TransactionModel, 'userId' | 'status' | 'deleted' | 'deletedAt'>>;

export type TransactionSortQuery = {
    [K in TransactionSortField]: { [key in K]: 1 | -1 };
}[TransactionSortField];

export type TransactionListFilter = {
    userId: Identifier;
    from?: Date;
    to?: Date;
    categoryId?: Identifier;
    type?: TransactionType;
    page: number;
    limit: number;
};

export type TransactionListResult = {
    transactions: Transaction[];
    total: number;
};
