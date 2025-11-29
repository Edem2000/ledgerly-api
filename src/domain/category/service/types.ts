import { CategoryModel } from 'domain/category/category';
import { CategorySortField } from 'domain/category/category-sort';
import { DeepPartial } from 'domain/utils/type-helpers';

export type CreateParams = Omit<CategoryModel, 'deleted' | 'status'>;
export type UpdateParams = DeepPartial<
  Omit<CategoryModel, 'userId' | 'status' | 'deleted' | 'deletedAt'>
>;

export type CategorySortQuery = {
  [K in CategorySortField]: { [key in K]: 1 | -1 };
}[CategorySortField];