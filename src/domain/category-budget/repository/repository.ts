import { BudgetPeriod, CategoryBudget } from 'domain/category-budget';
import { Identifier } from 'domain/_core';
import { FilterQuery, UpdateQuery } from 'mongoose';

export interface CategoryBudgetRepository {
    create(categoryBudget: CategoryBudget): Promise<CategoryBudget>;
    save(categoryBudget: CategoryBudget): Promise<CategoryBudget>;
    findAllByUser(userId: Identifier): Promise<CategoryBudget[]>;
    findById(id: Identifier): Promise<CategoryBudget | null>;
    updateById(id: Identifier, update: UpdateQuery<CategoryBudget>): Promise<CategoryBudget | null>;
    updateOne(filter: FilterQuery<CategoryBudget>, update: UpdateQuery<CategoryBudget>): Promise<CategoryBudget | null>;
    findOne(params: {
        userId: Identifier;
        categoryId: Identifier;
        period: BudgetPeriod;
    }): Promise<CategoryBudget | null>;

    findByPeriod(params: {
        userId: Identifier;
        period: BudgetPeriod;
        includeDeleted?: boolean;
    }): Promise<CategoryBudget[]>;

    findOne(params: {
        userId: Identifier;
        categoryId: Identifier;
        period: BudgetPeriod;
    }): Promise<CategoryBudget | null>;
}
