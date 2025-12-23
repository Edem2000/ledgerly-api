import { EntityModel, MongooseRepository, SortQuery } from 'data';
import { Identifier } from 'domain/_core';
import {
    BudgetPeriod,
    CategoryBudget,
    CategoryBudgetModel,
    CategoryBudgetRepository,
    CategoryBudgetStatus,
} from 'domain/category-budget';

export class CategoryBudgetRepositoryImpl extends MongooseRepository<CategoryBudgetModel, CategoryBudget> implements CategoryBudgetRepository {
    constructor(private readonly entityModel: EntityModel<CategoryBudgetModel>) {
        super(entityModel, CategoryBudget);
    }

    public async findAllByUser(userId: Identifier): Promise<CategoryBudget[]> {
        return await this.find({ userId, deleted: false });
    }

    public async findById(id: Identifier): Promise<CategoryBudget | null> {
        //@ts-ignore
        return await this.findOne({ _id: id, deleted: false });
    }


    async findOneByUserCategoryPeriod(params: {
        userId: Identifier;
        categoryId: Identifier;
        period: BudgetPeriod;
    }): Promise<CategoryBudget | null> {
        const doc = await this.model.findOne({
            userId: params.userId,
            categoryId: params.categoryId,
            'period.year': params.period.year,
            'period.month': params.period.month,
            deleted: false,
        });

        return doc ? this.toEntity(doc) : null;
    }

    async findByPeriod(params: {
        userId: Identifier;
        period: BudgetPeriod;
        includeDeleted?: boolean;
    }): Promise<CategoryBudget[]> {
        const query: any = {
            userId: params.userId,
            'period.year': params.period.year,
            'period.month': params.period.month,
        };

        if (!params.includeDeleted) {
            query.deleted = false;
        }

        return  await this.find(query);
    }

    async updateOne(params: {
        userId: Identifier;
        categoryId: Identifier;
        period: BudgetPeriod;
        plannedAmount?: number;
        limitAmount?: number;
        currency: string;
        note?: string;
        status: CategoryBudgetStatus;
    }): Promise<CategoryBudget | null> {
        return await super.updateOne(
            {
                userId: params.userId,
                categoryId: params.categoryId,
                'period.year': params.period.year,
                'period.month': params.period.month,
            },
            {
                $set: {
                    plannedAmount: params.plannedAmount,
                    limitAmount: params.limitAmount,
                    currency: params.currency,
                    note: params.note,
                    status: params.status,
                    deleted: false,
                    deletedAt: undefined,
                },
            },
        );
    }

    public async archiveByCategory(categoryId: Identifier): Promise<void> {
        await this.updateMany({ categoryId, deleted: false }, { $set: { status: CategoryBudgetStatus.archived, deleted: true, deletedAt: new Date() } });
    }
}
