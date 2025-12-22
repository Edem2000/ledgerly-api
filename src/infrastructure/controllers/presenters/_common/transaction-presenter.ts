import { Transaction } from 'domain/transaction';
import { HexString } from 'domain/_core';
import { CurrentUser } from 'domain/_utils/auth/types';
import { TransactionType } from 'domain/transaction/types';

export class TransactionPresenter {
    public static present(transaction: Transaction, currentUser?: CurrentUser): TransactionResponseDto {
        return {
            id: transaction.id.toString(),
            title: transaction.title,
            userId: transaction.userId.toString(),
            categoryId: transaction.categoryId.toString(),
            type: transaction.type,
            amount: transaction.amount,
            currency: transaction.currency,
            occurredAt: transaction.occurredAt.toISOString(),
            note: transaction.note,
            createdAt: transaction.createdAt.toISOString(),
        };
    }
}

export class TransactionResponseDto {
    id: HexString;
    userId: HexString;
    categoryId: HexString;
    title: string;
    type: TransactionType;
    amount: number;
    currency: string;
    occurredAt: string;
    note?: string;
    createdAt: string;
}
