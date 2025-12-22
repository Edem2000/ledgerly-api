import { Module } from '@nestjs/common';
import { Symbols } from 'di/common';
import { AuditLogModule } from 'di/common/modules/domain/entities/audit-log-module';
import { AuditLogService, LogEnricherService } from 'domain/audit';
import { GetAuditLogUsecase, GetAuditLogUsecaseImpl } from 'usecases/audit-logs/get-audit-log-usecase';
import { GetAuditLogsUsecase, GetAuditLogsUsecaseImpl } from 'usecases/audit-logs/get-audit-logs-usecase';

@Module({
    imports: [AuditLogModule],
    providers: [
        {
            provide: Symbols.usecases.auditLogs.get,
            useFactory(auditLogService: AuditLogService, logEnricherService: LogEnricherService): GetAuditLogsUsecase {
                return new GetAuditLogsUsecaseImpl(auditLogService, logEnricherService);
            },
            inject: [Symbols.domain.auditLog.auditLogService, Symbols.domain.auditLog.logEnricherService],
        },
        {
            provide: Symbols.usecases.auditLogs.getOne,
            useFactory(auditLogService: AuditLogService, logEnricherService: LogEnricherService): GetAuditLogUsecase {
                return new GetAuditLogUsecaseImpl(auditLogService, logEnricherService);
            },
            inject: [Symbols.domain.auditLog.auditLogService, Symbols.domain.auditLog.logEnricherService],
        },
    ],
    exports: [Symbols.usecases.auditLogs.get, Symbols.usecases.auditLogs.getOne],
})
export class AuditLogUsecasesModule {}
