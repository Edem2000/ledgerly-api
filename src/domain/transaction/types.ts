export const TransactionType = {
    Income: "income",
    Expense: "expense",
} as const;

export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];

export const Currency = {
    Uzs: "UZS"
} as const;

export type Currency = (typeof Currency)[keyof typeof Currency];