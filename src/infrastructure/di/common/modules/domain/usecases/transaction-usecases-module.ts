import { Module } from '@nestjs/common';
import { Symbols } from 'di/common';
import { UserModule } from 'di/common/modules/domain/entities';
import { AuditLogService } from 'domain/audit';
import { AuditLogModule } from 'di/common/modules/domain/entities/audit-log-module';
import { UtilsModule } from 'di/common/modules/infrastructure/utils/utils-module';
import { CategoryModule } from 'di/common/modules/domain/entities/category-module';
import { CategoryService } from 'domain/category';
import {
    CreateTransactionUsecase,
    CreateTransactionUsecaseImpl,
} from 'usecases/transactions/create-transaction-usecase';
import { TransactionService } from 'domain/transaction';
import { GetTransactionsUsecase, GetTransactionsUsecaseImpl } from 'usecases/transactions/get-transactions-usecase';
import {
    DeleteTransactionUsecase,
    DeleteTransactionUsecaseImpl,
} from 'usecases/transactions/delete-transaction-usecase';
import { TransactionModule } from 'di/common/modules/domain/entities/transaction-module';

@Module({
    imports: [UserModule, CategoryModule, TransactionModule, AuditLogModule, UtilsModule],
    providers: [
        {
            provide: Symbols.usecases.transactions.create,
            useFactory(
                transactionService: TransactionService,
                categoryService: CategoryService,
                auditLogService: AuditLogService,
            ): CreateTransactionUsecase {
                return new CreateTransactionUsecaseImpl(transactionService, categoryService, auditLogService);
            },
            inject: [
                Symbols.domain.transaction.service,
                Symbols.domain.category.categoryService,
                Symbols.domain.auditLog.auditLogService,
            ],
        },
        {
            provide: Symbols.usecases.transactions.get,
            useFactory(transactionService: TransactionService): GetTransactionsUsecase {
                return new GetTransactionsUsecaseImpl(transactionService);
            },
            inject: [Symbols.domain.transaction.service],
        },
        {
            provide: Symbols.usecases.transactions.delete,
            useFactory(
                transactionService: TransactionService,
                auditLogService: AuditLogService,
            ): DeleteTransactionUsecase {
                return new DeleteTransactionUsecaseImpl(transactionService, auditLogService);
            },
            inject: [Symbols.domain.transaction.service, Symbols.domain.auditLog.auditLogService],
        },
    ],
    exports: [
        Symbols.usecases.transactions.create,
        Symbols.usecases.transactions.get,
        Symbols.usecases.transactions.delete,
    ],
})
export class TransactionUsecasesModule {}
