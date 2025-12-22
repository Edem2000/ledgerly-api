import { BaseEntity, BaseModel, Identifier } from 'domain/_core';
import { TransactionType } from 'domain/transaction/types';

export interface TransactionModel extends BaseModel {
    title: string;
    note?: string;
    amount: number; // в базовой валюте (UZS), целое число
    currency: string; // 'UZS' для v1
    userId: Identifier;
    categoryId: Identifier;
    type: TransactionType;
    occurredAt: Date; // дата/время самой операции

    deleted: boolean;
    deletedAt?: Date;
    createdAt: Date;
}

export class Transaction extends BaseEntity<TransactionModel> {
    public get title(): string {
        return this.model.title;
    }

    public set title(value: string) {
        this.model.title = value;
    }

    public get note(): string | undefined {
        return this.model.note;
    }

    public set note(value: string | undefined) {
        this.model.note = value;
    }

    public get amount(): number {
        return this.model.amount;
    }

    public set amount(value: number) {
        this.model.amount = value;
    }

    public get currency(): string {
        return this.model.currency;
    }

    public set currency(value: string) {
        this.model.currency = value;
    }

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

    public get type(): TransactionType {
        return this.model.type;
    }

    public set type(value: TransactionType) {
        this.model.type = value;
    }

    public get occurredAt(): Date {
        return this.model.occurredAt;
    }

    public set occurredAt(value: Date) {
        this.model.occurredAt = value;
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

    public get createdAt(): Date {
        return this.model.createdAt;
    }
}
