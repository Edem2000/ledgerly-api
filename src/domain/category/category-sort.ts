export const CategorySortField = {
  Id: '_id',
  Title: 'title',
} as const;

export const CategorySortFields = Object.values(CategorySortField);

export type CategorySortField = typeof CategorySortField[keyof typeof CategorySortField];