import { BaseService, Identifier } from 'domain/_core';
import { BudgetPeriod, CategoryBudget, CategoryBudgetRepository, CategoryBudgetStatus } from 'domain/category-budget';
import { Currency } from 'domain/transaction';
import { CategoryService } from 'domain/category';
import {
    AccessDeniedError,
    CategoryBudgetAlreadyExistsError,
    CategoryBudgetAmountRequiredError,
    CategoryNotFoundError,
} from 'domain/utils/errors';

export interface CategoryBudgetService {
    create(params: {
        userId: Identifier;
        categoryId: Identifier;
        period: BudgetPeriod;
        plannedAmount?: number;
        limitAmount?: number;
        currency: Currency;
        note?: string;
        status: CategoryBudgetStatus;
    }): Promise<CategoryBudget>;
    getById(id: Identifier): Promise<CategoryBudget | null>;
    deleteById(id: Identifier): Promise<void>;
}

export class CategoryBudgetServiceImpl extends BaseService implements CategoryBudgetService {
    constructor(
        private repository: CategoryBudgetRepository,
        private categoryService: CategoryService,
    ) {
        super('categoryBudget');
    }

    async create(params: {
        userId: Identifier;
        categoryId: Identifier;
        period: BudgetPeriod;
        plannedAmount?: number;
        limitAmount?: number;
        currency: Currency;
        note?: string;
        status: CategoryBudgetStatus;
    }): Promise<CategoryBudget> {
        this.ensureHasAtLeastOneValue(params.plannedAmount, params.limitAmount);

        const ownedCategory = await this.categoryService.getById(params.categoryId);
        if (!ownedCategory) {
            throw new CategoryNotFoundError();
        }

        try {
            await this.categoryService.validateOwnership(ownedCategory, params.userId);
        } catch (error) {
            throw new AccessDeniedError();
        }

        const existing = await this.repository.findOneByUserCategoryPeriod({
            userId: params.userId,
            categoryId: params.categoryId,
            period: params.period,
        });

        if (existing) {
            throw new CategoryBudgetAlreadyExistsError();
        }

        const categoryBudget = new CategoryBudget({
            ...params,
            deleted: false,
        });
        return await this.repository.create(categoryBudget);
    }

    findByPeriod(userId: Identifier, period: BudgetPeriod): Promise<CategoryBudget[]> {
        return this.repository.findByPeriod({ userId, period });
    }

    async copyFromPreviousMonth(params: {
        userId: Identifier;
        toPeriod: BudgetPeriod;
        overwrite: boolean;
    }): Promise<CategoryBudget[]> {
        const fromPeriod = getPreviousMonth(params.toPeriod);

        const source = await this.repository.findByPeriod({
            userId: params.userId,
            period: fromPeriod,
        });

        if (source.length === 0) {
            // просто вернём пусто, это норм
            return [];
        }

        // если overwrite=false — не трогаем уже заданные в целевом месяце
        const existing = await this.repository.findByPeriod({
            userId: params.userId,
            period: params.toPeriod,
            includeDeleted: true,
        });

        const existingMap = new Map<string, CategoryBudget>();
        for (const e of existing) {
            existingMap.set(e.categoryId.toString(), e);
        }

        const results: CategoryBudget[] = [];

        for (const item of source) {
            const exists = existingMap.get(item.categoryId.toString());

            if (exists && !params.overwrite) {
                // оставляем как есть
                if (!exists.deleted) results.push(exists);
                continue;
            }

            const saved = await this.create({
                userId: params.userId,
                categoryId: item.categoryId,
                period: params.toPeriod,
                plannedAmount: item.plannedAmount,
                limitAmount: item.limitAmount,
                currency: item.currency,
                note: item.note,
                status: item.status,
            });

            results.push(saved);
        }

        return results;
    }

    public async validateOwnership(category: CategoryBudget, userId: Identifier): Promise<void> {
        if (category.userId.toString() !== userId.toString()) {
            throw new AccessDeniedError();
        }
    }

    public async getById(id: Identifier): Promise<CategoryBudget | null> {
        return await this.repository.findById(id);
    }

    public async deleteById(id: Identifier): Promise<void> {
        const categoryBudget = await this.repository.findById(id);
        if (!categoryBudget) {
            return;
        }
        categoryBudget.status = CategoryBudgetStatus.archived;
        categoryBudget.deleted = true;
        categoryBudget.deletedAt = new Date();
        await this.repository.save(categoryBudget);
    }

    public async save(entity: CategoryBudget): Promise<CategoryBudget> {
        return await this.repository.save(entity);
    }

    private ensureHasAtLeastOneValue(plannedAmount?: number, limitAmount?: number) {
        if (plannedAmount == null && limitAmount == null) {
            throw new CategoryBudgetAmountRequiredError();
        }
    }
}


// helper: previous month
function getPreviousMonth(period: BudgetPeriod): BudgetPeriod {
    if (period.month === 1) return { year: period.year - 1, month: 12 };
    return { year: period.year, month: period.month - 1 };
}
