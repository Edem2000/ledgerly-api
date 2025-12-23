import { Identifier } from 'domain/_core';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { Transaction } from 'domain/transaction';
import { ExpenseCategorySummary, TransactionListFilter, TransactionListResult } from 'domain/transaction/service/types';

export interface TransactionRepository {
    create(category: Transaction): Promise<Transaction>;
    save(category: Transaction): Promise<Transaction>;
    findAllByUser(userId: Identifier): Promise<Transaction[]>;
    findPaginatedByUser(params: TransactionListFilter): Promise<TransactionListResult>;
    findAllByCategory(userId: Identifier, categoryId: Identifier): Promise<Transaction[]>;
    findById(id: Identifier): Promise<Transaction | null>;
    getExpenseSummaryByCategory(params: { userId: Identifier; from: Date; to: Date }): Promise<ExpenseCategorySummary[]>;
    updateById(id: Identifier, update: UpdateQuery<Transaction>): Promise<Transaction | null>;
    updateOne(filter: FilterQuery<Transaction>, update: UpdateQuery<Transaction>): Promise<Transaction | null>;
}
