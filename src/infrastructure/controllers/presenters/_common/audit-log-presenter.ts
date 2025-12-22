import { Actor, AuditCategory, AuditLog, AuditType, EnrichedAuditLog, TargetEntity } from 'domain/audit';
import { HexString } from 'domain/_core';
import { User } from 'domain/user';
import { UserPresenter, UserResponseDto } from 'infrastructure/controllers/presenters/_common/user-presenter';
import { MultilingualStringDto } from 'infrastructure/controllers/dtos/common/multilanguage-dto';
import { Category } from 'domain/category';
import {
    CategoryPresenter,
    CategoryResponseDto,
} from 'infrastructure/controllers/presenters/_common/category-presenter';
import { Transaction } from 'domain/transaction';
import {
    TransactionPresenter,
    TransactionResponseDto,
} from 'infrastructure/controllers/presenters/_common/transaction-presenter';

export class AuditLogPresenter {
    public static present(enrichedAuditLog: EnrichedAuditLog): AuditLogResponseDto {
        const auditLog = enrichedAuditLog.auditLog;
        return {
            id: auditLog.id.toString(),
            occurredAt: auditLog.occurredAt,
            actorType: auditLog.actorType,
            actorUserId: auditLog.actorUserId ? auditLog.actorUserId.toString() : undefined,
            targetEntity: auditLog.targetEntity,
            targetId: auditLog.targetId ? auditLog.targetId.toString() : undefined,
            category: auditLog.category,
            type: auditLog.type,
            message: auditLog.message,
            metadata: auditLog.metadata,
            requestId: auditLog.requestId,
            correlationId: auditLog.correlationId,
            ip: auditLog.ip,
            userAgent: auditLog.userAgent,
            actor: AuditLogPresenter.presentActor(enrichedAuditLog.actor),
            target: AuditLogPresenter.presentTarget<typeof auditLog.targetEntity>(
                auditLog.targetEntity,
                enrichedAuditLog.targetEntity,
            ),
        };
    }

    private static presentActor(actor: User | null): UserResponseDto | null {
        if (!actor) {
            return null;
        }

        return UserPresenter.present(actor);
    }

    private static presentTarget<K extends TargetEntity>(
        targetEntity: K,
        target: TargetMap[K] | null,
    ): TargetResponseMap[K] | null {
        if (!target) {
            return null;
        }

        const presenterStrategy = {
            [TargetEntity.User]: (user: User) => UserPresenter.present(user),
            [TargetEntity.Category]: (category: Category) => CategoryPresenter.present(category),
            [TargetEntity.Transaction]: (transaction: Transaction) => TransactionPresenter.present(transaction),
        } satisfies {
            [K in TargetEntity]: (x: TargetMap[K]) => TargetResponseMap[K];
        };

        const presenter = presenterStrategy[targetEntity] as (
            x: TargetMap[typeof targetEntity],
        ) => TargetResponseMap[typeof targetEntity];

        return presenter(target);
    }
}

type TargetMap = {
    [TargetEntity.User]: User;
    [TargetEntity.Category]: Category;
    [TargetEntity.Transaction]: Transaction;
};

type TargetResponseMap = {
    [TargetEntity.User]: UserResponseDto;
    [TargetEntity.Category]: CategoryResponseDto;
    [TargetEntity.Transaction]: TransactionResponseDto;
};

type TargetResponseDto = UserResponseDto | CategoryResponseDto | TransactionResponseDto | null;

export type AuditLogResponseDto = {
    id: string;
    occurredAt: Date;
    actorType: Actor;
    actorUserId?: HexString;
    targetEntity: TargetEntity;
    targetId?: HexString;
    category: AuditCategory;
    type: AuditType;
    message?: MultilingualStringDto;
    metadata?: Record<string, unknown>;
    requestId?: string;
    correlationId?: string;
    ip?: string;
    userAgent?: string;
    actor: UserResponseDto | null;
    target: TargetResponseDto | null;
};
