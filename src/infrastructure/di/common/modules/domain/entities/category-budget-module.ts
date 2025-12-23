import { Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { CollectionNames, Symbols } from 'di/common';
import { BaseSchema } from 'data/mongo/schemas/base-schema';
import { EntityModel } from 'data';
import { UtilsModule } from 'di/common/modules/infrastructure/utils/utils-module';
import {
    CategoryBudgetModel,
    CategoryBudgetRepository,
    CategoryBudgetService,
    CategoryBudgetServiceImpl,
} from 'domain/category-budget';
import { CategoryBudgetSchema } from 'data/mongo/schemas/category-budget-schema';
import { CategoryBudgetRepositoryImpl } from 'data/mongo/repositories/category-budget-repository';
import { CategoryModule } from 'di/common/modules/domain/entities/category-module';
import { CategoryService } from 'domain/category';

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: CollectionNames.categoryBudgets,
                useFactory: (): BaseSchema<CategoryBudgetModel> =>
                    CategoryBudgetSchema.set('collection', CollectionNames.categoryBudgets),
            },
        ]),
        UtilsModule,
        CategoryModule,
    ],
    providers: [
        {
            provide: Symbols.domain.categoryBudget.repository,
            useFactory(model: EntityModel<CategoryBudgetModel>): CategoryBudgetRepository {
                return new CategoryBudgetRepositoryImpl(model);
            },
            inject: [getModelToken(CollectionNames.categoryBudgets)],
        },
        {
            provide: Symbols.domain.categoryBudget.service,
            useFactory(
                repository: CategoryBudgetRepository,
                categoryService: CategoryService,
            ): CategoryBudgetService {
                return new CategoryBudgetServiceImpl(repository, categoryService);
            },
            inject: [Symbols.domain.categoryBudget.repository, Symbols.domain.category.categoryService],
        },
    ],
    exports: [Symbols.domain.categoryBudget.repository, Symbols.domain.categoryBudget.service],
})
export class CategoryBudgetModule {}
