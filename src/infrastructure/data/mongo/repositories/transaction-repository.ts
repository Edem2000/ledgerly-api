import { EntityModel, MongooseRepository } from 'data';
import { Identifier } from 'domain/_core';
import { Transaction, TransactionModel, TransactionRepository, TransactionType } from 'domain/transaction';
import { ExpenseCategorySummary, TransactionListFilter, TransactionListResult } from 'domain/transaction/service/types';
import { identifierToObjectId, objectIdToIdentifier } from 'infrastructure/data/mongo/utils/identifier';

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

    public async getExpenseSummaryByCategory(params: {
        userId: Identifier;
        from: Date;
        to: Date;
    }): Promise<ExpenseCategorySummary[]> {
        const { userId, from, to } = params;

        const results = await this.model
            .aggregate<{ _id: Identifier; total: number }>([
                {
                    $match: {
                        userId: identifierToObjectId(userId),
                        deleted: false,
                        type: TransactionType.Expense,
                        occurredAt: {
                            $gte: from,
                            $lt: to,
                        },
                    },
                },
                {
                    $group: {
                        _id: '$categoryId',
                        total: { $sum: '$amount' },
                    },
                },
                {
                    $sort: { total: -1 },
                },
            ])
            .exec();

        return results.map((item) => ({
            categoryId: objectIdToIdentifier(item._id) as Identifier,
            total: item.total,
        }));
    }

    public async findById(id: Identifier): Promise<Transaction | null> {
        return await this.findOne({ _id: id, deleted: false });
    }
}
