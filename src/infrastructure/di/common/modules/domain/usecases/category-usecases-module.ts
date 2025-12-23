import { Module } from '@nestjs/common';
import { Symbols } from 'di/common';
import { UserModule } from 'di/common/modules/domain/entities';
import { AuditLogService } from 'domain/audit';
import { AuditLogModule } from 'di/common/modules/domain/entities/audit-log-module';
import { UtilsModule } from 'di/common/modules/infrastructure/utils/utils-module';
import { CategoryModule } from 'di/common/modules/domain/entities/category-module';
import { TranslateService } from 'domain/_utils/translate';
import { SlugService } from 'domain/_utils/slug';
import { CategoryService } from 'domain/category';
import { CreateCategoryUsecase, CreateCategoryUsecaseImpl } from 'usecases/categories/create-category-usecase';
import { GetCategoriesUsecase, GetCategoriesUsecaseImpl } from 'usecases/categories/get-categories-usecase';
import { GetCategoryUsecase, GetCategoryUsecaseImpl } from 'usecases/categories/get-category-usecase';
import { UpdateCategoryUsecase, UpdateCategoryUsecaseImpl } from 'usecases/categories/update-category-usecase';
import { DeleteCategoryUsecase, DeleteCategoryUsecaseImpl } from 'usecases/categories/delete-category-usecase';

@Module({
    imports: [UserModule, CategoryModule, AuditLogModule, UtilsModule],
    providers: [
        {
            provide: Symbols.usecases.categories.create,
            useFactory(
                categoryService: CategoryService,
                translateService: TranslateService,
                slugService: SlugService,
                auditLogService: AuditLogService,
            ): CreateCategoryUsecase {
                return new CreateCategoryUsecaseImpl(categoryService, translateService, slugService, auditLogService);
            },
            inject: [
                Symbols.domain.category.categoryService,
                Symbols.infrastructure.utils.translate,
                Symbols.infrastructure.utils.slug,
                Symbols.domain.auditLog.auditLogService,
            ],
        },
        {
            provide: Symbols.usecases.categories.get,
            useFactory(categoryService: CategoryService): GetCategoriesUsecase {
                return new GetCategoriesUsecaseImpl(categoryService);
            },
            inject: [Symbols.domain.category.categoryService],
        },
        {
            provide: Symbols.usecases.categories.getOne,
            useFactory(categoryService: CategoryService): GetCategoryUsecase {
                return new GetCategoryUsecaseImpl(categoryService);
            },
            inject: [Symbols.domain.category.categoryService],
        },
        {
            provide: Symbols.usecases.categories.update,
            useFactory(
                categoryService: CategoryService,
                translateService: TranslateService,
                slugService: SlugService,
                auditLogService: AuditLogService,
            ): UpdateCategoryUsecase {
                return new UpdateCategoryUsecaseImpl(
                    categoryService,
                    translateService,
                    slugService,
                    auditLogService,
                );
            },
            inject: [
                Symbols.domain.category.categoryService,
                Symbols.infrastructure.utils.translate,
                Symbols.infrastructure.utils.slug,
                Symbols.domain.auditLog.auditLogService,
            ],
        },
        {
            provide: Symbols.usecases.categories.delete,
            useFactory(categoryService: CategoryService, auditLogService: AuditLogService): DeleteCategoryUsecase {
                return new DeleteCategoryUsecaseImpl(categoryService, auditLogService);
            },
            inject: [Symbols.domain.category.categoryService, Symbols.domain.auditLog.auditLogService],
        },
    ],
    exports: [
        Symbols.usecases.categories.create,
        Symbols.usecases.categories.get,
        Symbols.usecases.categories.getOne,
        Symbols.usecases.categories.delete,
        Symbols.usecases.categories.update,
        // Symbols.usecases.categories.search,
    ],
})
export class CategoryUsecasesModule {}
