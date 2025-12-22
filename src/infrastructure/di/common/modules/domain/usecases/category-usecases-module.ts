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
        // {
        //   provide: Symbols.usecases.users.get,
        //   useFactory(
        //     userService: UserService,
        //     roleService: RoleService,
        //   ): GetUsersUsecase {
        //     return new GetUsersUsecaseImpl(userService, roleService);
        //   },
        //   inject: [
        //     Symbols.domain.user.userService,
        //     Symbols.domain.role.roleService,
        //   ],
        // },
        // {
        //   provide: Symbols.usecases.users.search,
        //   useFactory(
        //     userService: UserService,
        //     roleService: RoleService,
        //   ): SearchUsersUsecase {
        //     return new SearchUsersUsecaseImpl(userService, roleService);
        //   },
        //   inject: [
        //     Symbols.domain.user.userService,
        //     Symbols.domain.role.roleService,
        //   ],
        // },
        // {
        //   provide: Symbols.usecases.users.getOne,
        //   useFactory(
        //     userService: UserService,
        //     roleService: RoleService,
        //   ): GetUserUsecase {
        //     return new GetUserUsecaseImpl(userService, roleService);
        //   },
        //   inject: [
        //     Symbols.domain.user.userService,
        //     Symbols.domain.role.roleService,
        //   ],
        // },
        // {
        //   provide: Symbols.usecases.users.deleteUser,
        //   useFactory(
        //     userService: UserService,
        //     auditLogService: AuditLogService,
        //   ): DeleteUserUsecase {
        //     return new DeleteUserUsecaseImpl(userService, auditLogService);
        //   },
        //   inject: [
        //     Symbols.domain.user.userService,
        //     Symbols.domain.auditLog.auditLogService,
        //   ],
        // },
        // {
        //   provide: Symbols.usecases.users.updateUser,
        //   useFactory(
        //     userService: UserService,
        //     roleService: RoleService,
        //     auditLogService: AuditLogService,
        //   ): UpdateUserUsecase {
        //     return new UpdateUserUsecaseImpl(userService, roleService, auditLogService);
        //   },
        //   inject: [
        //     Symbols.domain.user.userService,
        //     Symbols.domain.role.roleService,
        //     Symbols.domain.auditLog.auditLogService,
        //   ],
        // },
    ],
    exports: [
        Symbols.usecases.categories.create,
        // Symbols.usecases.categories.get,
        // Symbols.usecases.categories.getOne,
        // Symbols.usecases.categories.delete,
        // Symbols.usecases.categories.update,
        // Symbols.usecases.categories.search,
    ],
})
export class CategoryUsecasesModule {}
