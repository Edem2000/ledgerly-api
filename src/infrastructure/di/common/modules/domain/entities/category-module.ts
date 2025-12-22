import { Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { CollectionNames, Symbols } from 'di/common';
import { BaseSchema } from 'data/mongo/schemas/base-schema';
import { EntityModel } from 'data';
import { CategoryModel } from 'domain/category/category';
import { CategorySchema } from 'data/mongo/schemas/category-schema';
import { CategoryRepository } from 'domain/category/repository/repository';
import { CategoryRepositoryImpl } from 'data/mongo/repositories/category-repository';
import { CategoryService, CategoryServiceImpl } from 'domain/category/service/service';
import { UtilsModule } from 'di/common/modules/infrastructure/utils/utils-module';

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: CollectionNames.categories,
                useFactory: (): BaseSchema<CategoryModel> =>
                    CategorySchema.set('collection', CollectionNames.categories),
            },
        ]),
        UtilsModule,
    ],
    providers: [
        {
            provide: Symbols.domain.category.categoryRepository,
            useFactory(model: EntityModel<CategoryModel>): CategoryRepository {
                return new CategoryRepositoryImpl(model);
            },
            inject: [getModelToken(CollectionNames.categories)],
        },
        {
            provide: Symbols.domain.category.categoryService,
            useFactory(repository: CategoryRepository): CategoryService {
                return new CategoryServiceImpl(repository);
            },
            inject: [Symbols.domain.category.categoryRepository],
        },
    ],
    exports: [Symbols.domain.category.categoryRepository, Symbols.domain.category.categoryService],
})
export class CategoryModule {}
