import { BaseEntity, BaseModel, Identifier, MultiLanguage } from 'domain/_core';
import { CategoryStatus } from 'domain/category/category-state';
import { Currency } from 'domain/transaction';

export type BudgetPeriod = {
    year: number;   // e.g. 2025
    month: number;  // 1..12
};

export enum CategoryBudgetStatus {
    active = 'active',
    archived = 'archived',
}

export const CategoryBudgetStatuses = Object.values(CategoryBudgetStatus);

export interface CategoryBudgetModel extends BaseModel {
    userId: Identifier;
    categoryId: Identifier;

    period: BudgetPeriod;

    plannedAmount?: number; // minor units (integer)
    limitAmount?: number;   // minor units (integer)
    currency: Currency;       // 'UZS' for v1

    note?: string;

    status: CategoryBudgetStatus;

    deleted: boolean;
    deletedAt?: Date;
}


export class CategoryBudget extends BaseEntity<CategoryBudgetModel> {
    public get userId(): Identifier {
        return this.model.userId;
    }
    public set userId(value: Identifier) {
        this.model.userId = value;
    }

    public get categoryId(): Identifier {
        return this.model.categoryId;
    }
    public set categoryId(value: Identifier) {
        this.model.categoryId = value;
    }

    public get period(): BudgetPeriod {
        return this.model.period;
    }
    public set period(value: BudgetPeriod) {
        this.model.period = value;
    }

    public get plannedAmount(): number | undefined {
        return this.model.plannedAmount;
    }
    public set plannedAmount(value: number | undefined) {
        this.model.plannedAmount = value;
    }

    public get limitAmount(): number | undefined {
        return this.model.limitAmount;
    }
    public set limitAmount(value: number | undefined) {
        this.model.limitAmount = value;
    }

    public get currency(): Currency {
        return this.model.currency;
    }
    public set currency(value: Currency) {
        this.model.currency = value;
    }

    public get note(): string | undefined {
        return this.model.note;
    }
    public set note(value: string | undefined) {
        this.model.note = value;
    }

    public get status(): CategoryBudgetStatus {
        return this.model.status;
    }
    public set status(value: CategoryBudgetStatus) {
        this.model.status = value;
    }

    public get deleted(): boolean {
        return this.model.deleted;
    }
    public set deleted(value: boolean) {
        this.model.deleted = value;
    }

    public get deletedAt(): Date | undefined {
        return this.model.deletedAt;
    }
    public set deletedAt(value: Date | undefined) {
        this.model.deletedAt = value;
    }
}
