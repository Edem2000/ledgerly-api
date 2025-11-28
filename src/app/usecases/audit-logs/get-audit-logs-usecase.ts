import { Usecase } from 'domain/_core/base-domain/base-usecase';
import {
  Actor,
  AuditCategory,
  AuditLog,
  AuditLogService,
  AuditLogSortField,
  AuditType, EnrichedAuditLog,
  TargetEntity,
} from 'domain/audit';
import { Identifier } from 'domain/_core';
import { LogEnricherService } from 'domain/audit/service/log-enricher-service';

type GetAuditLogsParams = {
  page: number;
  limit: number;
  sortBy?: AuditLogSortField;
  sortOrder: 'asc' | 'desc';
  actorType?: Actor,
  actorUserId?: Identifier,
  targetEntity?: TargetEntity,
  targetId?: Identifier,
  category?: AuditCategory,
  type?: AuditType,
};

type GetAuditLogsResult = {
  auditLogs: EnrichedAuditLog[];
  page: number;
  limit: number;
  total: number;
};


export interface GetAuditLogsUsecase extends Usecase<GetAuditLogsParams, GetAuditLogsResult> {}

export class GetAuditLogsUsecaseImpl implements GetAuditLogsUsecase {
  constructor(
    private auditLogService: AuditLogService,
    private logEnricher: LogEnricherService,
  ) {}

  public async execute(params: GetAuditLogsParams): Promise<GetAuditLogsResult> {
    const {page, limit} = params;

    const { auditLogs, total } = await this.auditLogService.getAuditLogs({ ...params });

    const enriched = await Promise.all(auditLogs.map(auditLog => this.logEnricher.enrich(auditLog)))

    return { auditLogs: enriched, page, limit, total };
  }

}

