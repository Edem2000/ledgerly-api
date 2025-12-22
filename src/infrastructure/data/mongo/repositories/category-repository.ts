import { EntityModel, MongooseRepository, SortQuery } from 'data';
import { Identifier } from 'domain/_core';
import { Category, CategoryModel, CategoryRepository } from 'domain/category';

export class CategoryRepositoryImpl extends MongooseRepository<CategoryModel, Category> implements CategoryRepository {
    constructor(private readonly entityModel: EntityModel<CategoryModel>) {
        super(entityModel, Category);
    }

    public async findAllByUser(userId: Identifier): Promise<Category[]> {
        return await this.find({ userId, deleted: false });
    }

    public async findById(id: Identifier): Promise<Category | null> {
        return await this.findOne({ _id: id, deleted: false });
    }
}
