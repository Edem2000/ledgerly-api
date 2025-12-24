import { Module } from '@nestjs/common';
import { Symbols } from 'di/common';
import { CategoryBudgetModule } from 'di/common/modules/domain/entities/category-budget-module';
import { TransactionModule } from 'di/common/modules/domain/entities/transaction-module';
import { UtilsModule } from 'di/common/modules/infrastructure/utils/utils-module';
import { CategoryBudgetService } from 'domain/category-budget';
import { TransactionService } from 'domain/transaction';
import {
    CreateCategoryBudgetUsecase,
    CreateCategoryBudgetUsecaseImpl,
} from 'usecases/category-budgets/create-usecase';
import { GetCategoryBudgetsUsecase, GetCategoryBudgetsUsecaseImpl } from 'usecases/category-budgets/get-usecase';
import {
    UpdateCategoryBudgetUsecase,
    UpdateCategoryBudgetUsecaseImpl,
} from 'usecases/category-budgets/update-usecase';

@Module({
    imports: [CategoryBudgetModule, TransactionModule, UtilsModule],
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
            useFactory(
                categoryBudgetService: CategoryBudgetService,
                transactionService: TransactionService,
            ): GetCategoryBudgetsUsecase {
                return new GetCategoryBudgetsUsecaseImpl(categoryBudgetService, transactionService);
            },
            inject: [Symbols.domain.categoryBudget.service, Symbols.domain.transaction.service],
        },
        {
            provide: Symbols.usecases.categoryBudgets.update,
            useFactory(categoryBudgetService: CategoryBudgetService): UpdateCategoryBudgetUsecase {
                return new UpdateCategoryBudgetUsecaseImpl(categoryBudgetService);
            },
            inject: [Symbols.domain.categoryBudget.service],
        },
    ],
    exports: [
        Symbols.usecases.categoryBudgets.create,
        Symbols.usecases.categoryBudgets.get,
        Symbols.usecases.categoryBudgets.update,
    ],
})
export class CategoryBudgetUsecasesModule {}
