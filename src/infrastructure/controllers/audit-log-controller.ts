import { Controller, Get, HttpCode, HttpStatus, Inject, Param, Query, UseGuards, UsePipes } from '@nestjs/common';
import { Symbols } from 'di/common';
import { getExceptionByError } from 'infrastructure/controllers/exceptions/exceptions';
import { PaginationPipe } from 'infrastructure/controllers/pipes/pagination-pipe';

import { JwtAuthGuard } from 'infrastructure/services/guards/auth-guard';
import { RolesGuard } from 'infrastructure/services/guards/roles-guard';
import { AllowRoles } from 'infrastructure/services/decorators/roles';
import { RoleAlias } from 'domain/role/role';
import { GetAuditLogsUsecase } from 'usecases/audit-logs/get-audit-logs-usecase';
import { GetAuditLogUsecase } from 'usecases/audit-logs/get-audit-log-usecase';
import { GetAuditLogsDto } from 'infrastructure/controllers/dtos/audit-logs/get-audit-logs-dto';
import {
  GetAuditLogsPresenter,
  GetAuditLogsResponseDto,
} from 'infrastructure/controllers/presenters/audit-logs/get-audit-logs-presenter';
import { GetAuditLogDto } from 'infrastructure/controllers/dtos/audit-logs/get-audit-log-dto';
import {
  GetAuditLogPresenter,
  GetAuditLogResponseDto,
} from 'infrastructure/controllers/presenters/audit-logs/get-audit-log-presenter';
import { EntityId } from 'domain/_core';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('audit')
export class AuditLogController {
  constructor(
    @Inject(Symbols.usecases.auditLogs.get)
    private readonly getAuditLogsUsecase: GetAuditLogsUsecase,
    @Inject(Symbols.usecases.auditLogs.getOne)
    private readonly getAuditLogUsecase: GetAuditLogUsecase,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  @AllowRoles(RoleAlias.SuperAdmin, RoleAlias.Admin)
  @UsePipes(PaginationPipe)
  public async getAuditLogs(@Query() query: GetAuditLogsDto): Promise<GetAuditLogsResponseDto> {
    try {
      const params = {
        page: query.page,
        limit: query.limit,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder,
        actorType: query.actorType,
        actorUserId: query.actorUserId,
        targetEntity: query.targetEntity,
        targetId: query.targetId,
        category: query.category,
        type: query.type,
      };

      const { auditLogs, page, limit, total } = await this.getAuditLogsUsecase.execute(params);

      return GetAuditLogsPresenter.present(auditLogs, page, limit, total);
    } catch (error) {
      throw getExceptionByError(error);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @AllowRoles(RoleAlias.SuperAdmin, RoleAlias.Admin)
  public async getAuditLog(@Param() params: GetAuditLogDto): Promise<GetAuditLogResponseDto> {
    try {
      const id = new EntityId(params.id)

      const { auditLog } = await this.getAuditLogUsecase.execute({ id });

      return GetAuditLogPresenter.present(auditLog);
    } catch (error) {
      throw getExceptionByError(error);
    }
  }
}
