import { Module } from '@nestjs/common';
import { UserController } from 'infrastructure/controllers/user-controller';
import { UserUsecasesModule } from 'di/common/modules/domain/usecases/user-usecases-module';
import { AuthModule } from 'di/common/modules/infrastructure/auth/auth-module';
import { JwtAuthGuard } from 'infrastructure/services/guards/auth-guard';
import { ProvidersModule } from 'di/common/modules/infrastructure/providers';
import { AuditLogController } from 'infrastructure/controllers/audit-log-controller';
import { AuditLogUsecasesModule } from 'di/common/modules/domain/usecases/audit-logs-usecases-module';
import { CategoryUsecasesModule } from 'di/common/modules/domain/usecases/category-usecases-module';
import { CategoryController } from 'infrastructure/controllers/category-controller';
import { TransactionController } from 'infrastructure/controllers/transaction-controller';
import { TransactionUsecasesModule } from 'di/common/modules/domain/usecases/transaction-usecases-module';
import { CategoryBudgetUsecasesModule } from 'di/common/modules/domain/usecases/category-budget-usecases-module';
import { CategoryBudgetController } from 'infrastructure/controllers/budget-controller';

@Module({
    imports: [
        UserUsecasesModule,
        CategoryUsecasesModule,
        TransactionUsecasesModule,
        CategoryBudgetUsecasesModule,
        AuditLogUsecasesModule,
        AuthModule,
        ProvidersModule,
    ],
    providers: [
        JwtAuthGuard,
        // {
        //   provide: APP_GUARD,
        //   useClass: JwtAuthGuard,
        // },
    ],
    controllers: [
        UserController,
        CategoryController,
        TransactionController,
        CategoryBudgetController,
        AuditLogController,
    ],
})
export class AppModule {}
