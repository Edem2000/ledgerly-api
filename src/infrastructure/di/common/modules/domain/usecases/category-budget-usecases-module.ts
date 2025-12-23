import { Module } from '@nestjs/common';
import { Symbols } from 'di/common';
import { CategoryBudgetModule } from 'di/common/modules/domain/entities/category-budget-module';
import { UtilsModule } from 'di/common/modules/infrastructure/utils/utils-module';
import { CategoryBudgetService } from 'domain/category-budget';
import {
    CreateCategoryBudgetUsecase,
    CreateCategoryBudgetUsecaseImpl,
} from 'usecases/category-budgets/create-usecase';
import { GetCategoryBudgetsUsecase, GetCategoryBudgetsUsecaseImpl } from 'usecases/category-budgets/get-usecase';

@Module({
    imports: [CategoryBudgetModule, UtilsModule],
    providers: [
        {
            provide: Symbols.usecases.categoryBudgets.create,
            useFactory(categoryBudgetService: CategoryBudgetService): CreateCategoryBudgetUsecase {
                return new CreateCategoryBudgetUsecaseImpl(categoryBudgetService);
            },
            inject: [Symbols.domain.categoryBudget.service],
        },
        {
            provide: Symbols.usecases.categoryBudgets.get,
            useFactory(categoryBudgetService: CategoryBudgetService): GetCategoryBudgetsUsecase {
                return new GetCategoryBudgetsUsecaseImpl(categoryBudgetService);
            },
            inject: [Symbols.domain.categoryBudget.service],
        },
    ],
    exports: [Symbols.usecases.categoryBudgets.create, Symbols.usecases.categoryBudgets.get],
})
export class CategoryBudgetUsecasesModule {}
