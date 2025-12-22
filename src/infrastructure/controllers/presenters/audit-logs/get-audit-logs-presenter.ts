import { ErrorDto } from 'infrastructure/controllers/dtos/error-dto';
import { PaginatedResponseDto } from 'infrastructure/controllers/presenters/_common/paginated-response-presenter';
import { AuditLog, EnrichedAuditLog } from 'domain/audit';
import {
    AuditLogPresenter,
    AuditLogResponseDto,
} from 'infrastructure/controllers/presenters/_common/audit-log-presenter';

export class GetAuditLogsPresenter {
    static present(auditLogs: EnrichedAuditLog[], page: number, limit: number, total: number): GetAuditLogsResponseDto {
        return {
            success: true,
            page,
            limit,
            total,
            data: auditLogs.map(AuditLogPresenter.present),
        };
    }
}

export type GetAuditLogsResponseDto =
    | ({
          success: boolean;
      } & PaginatedResponseDto<AuditLogResponseDto>)
    | ErrorDto;
