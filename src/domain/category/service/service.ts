import { BaseService, Identifier, MultiLanguage } from 'domain/_core';
import { CategoryRepository } from 'domain/category/repository/repository';
import { Category } from 'domain/category/category';
import { CategoryStatus } from 'domain/category/category-state';
import { CreateParams, UpdateParams } from 'domain/category/service/types';
import { ForbiddenException } from '@nestjs/common';

export interface CategoryService {
  validateOwnership(category: Category, userId: Identifier): Promise<void>;
  create(params: CreateParams): Promise<Category>;
  getById(id: Identifier): Promise<Category | null>;
  deleteById(id: Identifier): Promise<void>;
  update(category: Category, params: UpdateParams): Promise<Category>;
  findAllByUser(userId: Identifier): Promise<Category[]>;
}

export class CategoryServiceImpl
  extends BaseService
  implements CategoryService
{
  constructor(
    private repository: CategoryRepository,
  ) {
    super('category');
  }

  public async validateOwnership(
    category: Category,
    userId: Identifier,
  ): Promise<void> {
    if (category.userId.toString() !== userId.toString()) {
      throw new ForbiddenException('You do not own this category');
    }
  }

  public async create(params: CreateParams): Promise<Category> {
    const category = new Category({
      ...params,
      status: CategoryStatus.Active,
    });
    return await this.repository.create(category);
  }

  public async getById(id: Identifier): Promise<Category | null> {
    return await this.repository.findById(id);
  }

  public async deleteById(id: Identifier): Promise<void> {
    const category = await this.repository.findById(id);
    if (!category) {
      return;
    }
    category.status = CategoryStatus.Deleted;
    category.deleted = true;
    category.deletedAt = new Date();
    await this.repository.save(category);
  }

  public async update(
    category: Category,
    params: UpdateParams,
  ): Promise<Category> {
    category.title = (params.title as MultiLanguage) || category.title;
    category.alias = params.alias || category.alias;
    category.icon = params.icon || category.icon;
    category.color = params.color || category.color;

    return await this.repository.save(category);
  }

  public async findAllByUser(userId: Identifier): Promise<Category[]> {
    return await this.repository.findAllByUser(userId);
  }

  public async save(entity: Category): Promise<Category> {
    return await this.repository.save(entity);
  }
}