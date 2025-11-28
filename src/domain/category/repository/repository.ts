import { Category } from 'domain/category/category';
import { Identifier } from 'domain/_core';
import { FilterQuery, UpdateQuery } from 'mongoose';

export interface CategoryRepository {
  create(category: Category): Promise<Category>;
  save(category: Category): Promise<Category>;
  findAllByUser(userId: Identifier): Promise<Category[]>;
  findById(id: Identifier): Promise<Category | null>;
  updateById(
    id: Identifier,
    update: UpdateQuery<Category>,
  ): Promise<Category | null>;
  updateOne(
    filter: FilterQuery<Category>,
    update: UpdateQuery<Category>,
  ): Promise<Category | null>;
}
