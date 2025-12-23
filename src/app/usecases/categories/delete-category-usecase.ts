import { Usecase } from 'domain/_core/base-domain/base-usecase';
import { Context, EntityId, Identifier } from 'domain/_core';
import { CurrentUser } from 'domain/_utils/auth/types';
import { CategoryService } from 'domain/category';
import { CategoryBudgetService } from 'domain/category-budget';
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
        private categoryBudgetService: CategoryBudgetService,
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

        // archive related category budgets (soft-delete + set status archived)
        try {
            await this.categoryBudgetService.archiveByCategory(params.id);
        } catch (e) {
            console.log('Failed to archive category budgets for category', params.id, e);
        }

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
