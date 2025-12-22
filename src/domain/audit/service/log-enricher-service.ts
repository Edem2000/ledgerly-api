import { AuditLog, EnrichedAuditLog, TargetEntity } from 'domain/audit';
import { UserRepository } from 'domain/user';

export interface LogEnricherService {
    enrich(auditLog: AuditLog): Promise<EnrichedAuditLog>;
}

export class LogEnricherServiceImpl implements LogEnricherService {
    private repoStrategy: Map<TargetEntity, AvailableRepos>;
    constructor(
        private readonly userRepository: UserRepository,
        // private readonly companyRepository: CompanyRepository,
        // private readonly productRepository: ProductRepository,
    ) {
        this.repoStrategy = new Map<TargetEntity, AvailableRepos>([
            [TargetEntity.User, this.userRepository],
            // [TargetEntity.Company, this.companyRepository],
            // [TargetEntity.Product, this.productRepository],
        ]);
    }

    public async enrich(auditLog: AuditLog): Promise<EnrichedAuditLog> {
        const actorId = auditLog.actorUserId;
        const targetId = auditLog.targetId;

        const repo = this.repoStrategy.get(auditLog.targetEntity);

        const [actor, target] = await Promise.all([
            actorId ? await this.userRepository.findById(actorId) : null,
            targetId && repo ? await repo.findById(targetId) : null,
        ]);

        return {
            auditLog: auditLog,
            actor: actor,
            targetEntity: target,
        };
    }
}

type AvailableRepos = UserRepository;
