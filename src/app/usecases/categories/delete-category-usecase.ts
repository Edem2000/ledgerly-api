import { Usecase } from 'domain/_core/base-domain/base-usecase';
import { Context, EntityId, Identifier } from 'domain/_core';
import { CurrentUser } from 'domain/_utils/auth/types';
import { CategoryService } from 'domain/category';
import { CategoryNotFoundError } from 'domain/utils/errors';
import { AuditLogService, AuditType, TargetEntity } from 'domain/audit';

type DeleteCategoryParams = {
    id: Identifier;
};

type DeleteCategoryResult = void;

export interface DeleteCategoryUsecase
    extends Usecase<DeleteCategoryParams, DeleteCategoryResult, CurrentUser, Context> {}

export class DeleteCategoryUsecaseImpl implements DeleteCategoryUsecase {
    constructor(
        private categoryService: CategoryService,
        private auditLogService: AuditLogService,
    ) {}

    async execute(
        params: DeleteCategoryParams,
        currentUser: CurrentUser,
        context: Context,
    ): Promise<DeleteCategoryResult> {
        const category = await this.categoryService.getById(params.id);

        if (!category) {
            throw new CategoryNotFoundError();
        }

        const userId = new EntityId(currentUser.id);
        await this.categoryService.validateOwnership(category, userId);

        await this.categoryService.deleteById(params.id);

        await this.auditLogService
            .log(
                {
                    type: AuditType.ProductDelete,
                    actorUserId: currentUser.id,
                    targetEntity: TargetEntity.Category,
                    targetId: params.id,
                },
                context,
            )
            .catch((e) => {
                console.log('log creation error:', e);
            });
    }
}
