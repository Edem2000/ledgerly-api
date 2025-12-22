import { EntityModel, MongooseRepository } from 'data';
import { Identifier } from 'domain/_core';
import { Transaction, TransactionModel, TransactionRepository } from 'domain/transaction';
import { TransactionListFilter, TransactionListResult } from 'domain/transaction/service/types';

export class TransactionRepositoryImpl
    extends MongooseRepository<TransactionModel, Transaction>
    implements TransactionRepository
{
    constructor(private readonly entityModel: EntityModel<TransactionModel>) {
        super(entityModel, Transaction);
    }

    public async findAllByUser(userId: Identifier): Promise<Transaction[]> {
        return await this.find({ userId, deleted: false }, { sort: { createdAt: -1 } });
    }

    public async findPaginatedByUser(params: TransactionListFilter): Promise<TransactionListResult> {
        const { userId, from, to, categoryId, type, page, limit } = params;

        const query: Record<string, any> = { userId, deleted: false };

        if (categoryId) query.categoryId = categoryId;
        if (type) query.type = type;

        if (from || to) {
            query.occurredAt = {};
            if (from) query.occurredAt.$gte = from;
            if (to) query.occurredAt.$lte = to;
        }

        const skip = (page - 1) * limit;

        const [transactions, total] = await Promise.all([
            this.find(query, { sort: { occurredAt: -1 }, skip, limit }),
            this.model.countDocuments(query).exec(),
        ]);

        return {
            transactions: transactions,
            total,
        };
    }

    public async findAllByCategory(userId: Identifier, categoryId: Identifier): Promise<Transaction[]> {
        return await this.find({ userId, categoryId, deleted: false }, { sort: { createdAt: -1 } });
    }

    public async findById(id: Identifier): Promise<Transaction | null> {
        return await this.findOne({ _id: id, deleted: false });
    }
}
