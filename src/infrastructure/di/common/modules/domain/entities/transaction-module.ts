import { Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { CollectionNames, Symbols } from 'di/common';
import { BaseSchema } from 'data/mongo/schemas/base-schema';
import { EntityModel } from 'data';
import { TransactionModel } from 'domain/transaction/transaction';
import { TransactionSchema } from 'data/mongo/schemas/transaction-schema';
import { TransactionRepositoryImpl } from 'data/mongo/repositories/transaction-repository';
import { TransactionRepository, TransactionService, TransactionServiceImpl } from 'domain/transaction';
import { UtilsModule } from 'di/common/modules/infrastructure/utils/utils-module';

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: CollectionNames.transactions,
                useFactory: (): BaseSchema<TransactionModel> =>
                    TransactionSchema.set('collection', CollectionNames.transactions),
            },
        ]),
    ],
    providers: [
        {
            provide: Symbols.domain.transaction.repository,
            useFactory(model: EntityModel<TransactionModel>): TransactionRepository {
                return new TransactionRepositoryImpl(model);
            },
            inject: [getModelToken(CollectionNames.transactions)],
        },
        {
            provide: Symbols.domain.transaction.service,
            useFactory(repository: TransactionRepository): TransactionService {
                return new TransactionServiceImpl(repository);
            },
            inject: [Symbols.domain.transaction.repository],
        },
    ],
    exports: [Symbols.domain.transaction.repository, Symbols.domain.transaction.service],
})
export class TransactionModule {}
