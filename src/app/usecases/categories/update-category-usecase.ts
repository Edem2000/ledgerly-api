import { Usecase } from 'domain/_core/base-domain/base-usecase';
import { AllLanguages, Context, EntityId, Identifier, MultiLanguage } from 'domain/_core';
import { CurrentUser } from 'domain/_utils/auth/types';
import { Category, CategoryService } from 'domain/category';
import { TranslateService } from 'domain/_utils/translate';
import { SlugService } from 'domain/_utils/slug';
import { CategoryAlreadyExistsError, CategoryNotFoundError } from 'domain/utils/errors';
import { AuditLogService, AuditType, TargetEntity } from 'domain/audit';

type UpdateCategoryParams = {
    id: Identifier;
    title?: string;
    color?: string;
    icon?: string;
};

type UpdateCategoryResult = {
    category: Category;
};

export interface UpdateCategoryUsecase
    extends Usecase<UpdateCategoryParams, UpdateCategoryResult, CurrentUser, Context> {}

export class UpdateCategoryUsecaseImpl implements UpdateCategoryUsecase {
    constructor(
        private categoryService: CategoryService,
        private translateService: TranslateService,
        private slugService: SlugService,
        private auditLogService: AuditLogService,
    ) {}

    async execute(
        params: UpdateCategoryParams,
        currentUser: CurrentUser,
        context: Context,
    ): Promise<UpdateCategoryResult> {
        const category = await this.categoryService.getById(params.id);

        if (!category) {
            throw new CategoryNotFoundError();
        }

        const userId = new EntityId(currentUser.id);
        await this.categoryService.validateOwnership(category, userId);

        const updateParams: {
            title?: MultiLanguage;
            alias?: string;
            color?: string;
            icon?: string;
        } = {};

        if (params.title) {
            const multilanguageTitle: MultiLanguage = {
                ru: params.title,
                uz: params.title,
                en: params.title,
            };

            for (const language of AllLanguages) {
                if (currentUser.language === language) {
                    multilanguageTitle[language] = params.title;
                } else {
                    multilanguageTitle[language] = await this.translateService.translate(
                        params.title,
                        language,
                        currentUser.language,
                    );
                }
            }

            const alias = this.slugService.createSlug(multilanguageTitle.en);
            const existing = await this.categoryService.findAllByUser(userId);
            const sameNameExists = existing.some((item) => {
                return item.alias === alias && item.id.toString() !== category.id.toString();
            });

            if (sameNameExists) {
                throw new CategoryAlreadyExistsError();
            }

            updateParams.title = multilanguageTitle;
            updateParams.alias = alias;
        }

        if (params.color !== undefined) {
            updateParams.color = params.color;
        }

        if (params.icon !== undefined) {
            updateParams.icon = params.icon;
        }

        const updatedCategory = await this.categoryService.update(category, updateParams);

        await this.auditLogService
            .log(
                {
                    type: AuditType.ProductUpdate,
                    actorUserId: currentUser.id,
                    targetEntity: TargetEntity.Category,
                    targetId: params.id,
                },
                context,
            )
            .catch((e) => {
                console.log('log creation error:', e);
            });

        console.log(`Updated category ${category.id}`);

        return { category: updatedCategory };
    }
}
