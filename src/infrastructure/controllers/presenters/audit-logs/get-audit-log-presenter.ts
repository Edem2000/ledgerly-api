import { EnrichedAuditLog } from 'domain/audit';
import {
    AuditLogPresenter,
    AuditLogResponseDto,
} from 'infrastructure/controllers/presenters/_common/audit-log-presenter';
import { ErrorDto } from 'infrastructure/controllers/dtos/error-dto';

export class GetAuditLogPresenter {
    static present(auditLog: EnrichedAuditLog): GetAuditLogResponseDto {
        return {
            success: true,
            auditLog: AuditLogPresenter.present(auditLog),
        };
    }
}

export type GetAuditLogResponseDto =
    | {
          success: boolean;
          auditLog: AuditLogResponseDto;
      }
    | ErrorDto;
