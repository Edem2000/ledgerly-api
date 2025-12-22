import { Usecase } from 'domain/_core/base-domain/base-usecase';
import { AuditLogService, EnrichedAuditLog, LogEnricherService } from 'domain/audit';
import { AuditLogNotFoundError } from 'domain/utils/errors';
import { Identifier } from 'domain/_core';

type GetAuditLogParams = {
    id: Identifier;
};

type GetAuditLogResult = {
    auditLog: EnrichedAuditLog;
};

export interface GetAuditLogUsecase extends Usecase<GetAuditLogParams, GetAuditLogResult> {}

export class GetAuditLogUsecaseImpl implements GetAuditLogUsecase {
    constructor(
        private auditLogService: AuditLogService,
        private logEnricher: LogEnricherService,
    ) {}

    async execute(params: GetAuditLogParams): Promise<GetAuditLogResult> {
        const auditLog = await this.auditLogService.getById(params.id);

        if (!auditLog) {
            throw new AuditLogNotFoundError();
        }

        const enriched = await this.logEnricher.enrich(auditLog);

        return { auditLog: enriched };
    }
}
