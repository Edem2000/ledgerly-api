import { Module } from '@nestjs/common';
import { CollectionNames, Symbols } from 'di/common';
import { AuditLogRepository } from 'domain/audit/repository/repository';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { BaseSchema } from 'data/mongo/schemas/base-schema';
import { AuditLogSchema } from 'data/mongo/schemas/audit-log-schema';
import {
  AuditLogModel,
  AuditLogService,
  AuditLogServiceImpl,
  LogEnricherService,
  LogEnricherServiceImpl,
} from 'domain/audit';
import { EntityModel } from 'data';
import { AuditLogRepositoryImpl } from 'data/mongo/repositories/audit-log-repository';
import { UserRepository } from 'domain/user';
import { UserModule } from 'di/common/modules/domain/entities/user-module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: CollectionNames.auditLogs,
        useFactory: (): BaseSchema<AuditLogModel> => AuditLogSchema.set('collection', CollectionNames.auditLogs),
      },
    ]),
    UserModule,
  ],
  providers: [
    {
      provide: Symbols.domain.auditLog.auditLogRepository,
      useFactory(model: EntityModel<AuditLogModel>): AuditLogRepository {
        return new AuditLogRepositoryImpl(model);
      },
      inject: [getModelToken(CollectionNames.auditLogs)],
    },
    {
      provide: Symbols.domain.auditLog.auditLogService,
      useFactory(
        repository: AuditLogRepository,
      ): AuditLogService {
        return new AuditLogServiceImpl(repository);
      },
      inject: [
        Symbols.domain.auditLog.auditLogRepository,
      ],
    },
    {
      provide: Symbols.domain.auditLog.logEnricherService,
      useFactory(
        userRepository: UserRepository,
      ): LogEnricherService {
        return new LogEnricherServiceImpl(userRepository);
      },
      inject: [
        Symbols.domain.user.userRepository,
      ],
    },
  ],
  exports: [Symbols.domain.auditLog.auditLogRepository, Symbols.domain.auditLog.auditLogService, Symbols.domain.auditLog.logEnricherService],
})

export class AuditLogModule {}