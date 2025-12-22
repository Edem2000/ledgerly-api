import { BaseService, Identifier } from 'domain/_core';
import { TransactionRepository } from 'domain/transaction/repository/repository';
import { Transaction } from 'domain/transaction/transaction';
import {
    CreateParams,
    TransactionListFilter,
    TransactionListResult,
    UpdateParams,
} from 'domain/transaction/service/types';
import { ForbiddenException } from '@nestjs/common';

export interface TransactionService {
    validateOwnership(transaction: Transaction, userId: Identifier): Promise<void>;
    create(params: CreateParams): Promise<Transaction>;
    getById(id: Identifier): Promise<Transaction | null>;
    deleteById(id: Identifier): Promise<void>;
    update(transaction: Transaction, params: UpdateParams): Promise<Transaction>;
    findAllByUser(userId: Identifier): Promise<Transaction[]>;
    findPaginatedByUser(params: TransactionListFilter): Promise<TransactionListResult>;
}

export class TransactionServiceImpl extends BaseService implements TransactionService {
    constructor(private repository: TransactionRepository) {
        super('transaction');
    }

    public async validateOwnership(transaction: Transaction, userId: Identifier): Promise<void> {
        if (transaction.userId.toString() !== userId.toString()) {
            throw new ForbiddenException('You do not own this transaction');
        }
    }

    public async create(params: CreateParams): Promise<Transaction> {
        const transaction = new Transaction({
            ...params,
            createdAt: new Date(),
            deleted: false,
        });
        return await this.repository.create(transaction);
    }

    public async getById(id: Identifier): Promise<Transaction | null> {
        return await this.repository.findById(id);
    }

    public async deleteById(id: Identifier): Promise<void> {
        const transaction = await this.repository.findById(id);
        if (!transaction) {
            return;
        }
        transaction.deleted = true;
        transaction.deletedAt = new Date();
        await this.repository.save(transaction);
    }

    public async update(transaction: Transaction, params: UpdateParams): Promise<Transaction> {
        // transaction.title = (params.title as MultiLanguage) || transaction.title;
        // transaction.alias = params.alias || transaction.alias;
        // transaction.icon = params.icon || transaction.icon;
        // transaction.color = params.color || transaction.color;

        return await this.repository.save(transaction);
    }

    public async findAllByUser(userId: Identifier): Promise<Transaction[]> {
        return await this.repository.findAllByUser(userId);
    }

    public async findPaginatedByUser(params: TransactionListFilter): Promise<TransactionListResult> {
        return await this.repository.findPaginatedByUser(params);
    }

    public async save(entity: Transaction): Promise<Transaction> {
        return await this.repository.save(entity);
    }
}
