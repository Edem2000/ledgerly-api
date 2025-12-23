export const CategoryBudgetStatus = {
    Active: 'active',
    Inactive: 'inactive',
} as const;

export const CategoryBudgetStatuses = Object.values(CategoryBudgetStatus);

export type CategoryBudgetStatus = (typeof CategoryBudgetStatus)[keyof typeof CategoryBudgetStatus];
