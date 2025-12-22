export const TransactionSortField = {
    Id: '_id',
    Amount: 'amount',
    CreatedAt: 'createdAt',
} as const;

export const TransactionSortFields = Object.values(TransactionSortField);

export type TransactionSortField = (typeof TransactionSortField)[keyof typeof TransactionSortField];
