import { Usecase } from 'domain/_core/base-domain/base-usecase';
import { AllLanguages, Context, EntityId, MultiLanguage } from 'domain/_core';
import { CurrentUser } from 'domain/_utils/auth/types';
import { Category, CategoryService } from 'domain/category';
import { SlugService } from 'domain/_utils/slug';
import { TranslateService } from 'domain/_utils/translate';
import { AuditLogService, AuditType, TargetEntity } from 'domain/audit';
import { BadRequestException } from '@nestjs/common';
import { CategoryAlreadyExistsError } from 'domain/utils/errors';

type CreateCategoryParams = {
    title: string;
    color: string;
    icon?: string;
};

type CreateResult = {
    category: Category;
};

export interface CreateCategoryUsecase extends Usecase<CreateCategoryParams, CreateResult, CurrentUser, Context> {}

export class CreateCategoryUsecaseImpl implements CreateCategoryUsecase {
    constructor(
        private categoryService: CategoryService,
        private translateService: TranslateService,
        private slugService: SlugService,
        private auditLogService: AuditLogService,
    ) {}

    async execute(params: CreateCategoryParams, currentUser: CurrentUser, context: Context): Promise<CreateResult> {
        const { title, color, icon } = params;

        const userId = new EntityId(currentUser.id);

        const multilanguageTitle: MultiLanguage = {
            ru: title,
            uz: title,
            en: title,
        };

        for (const language of AllLanguages) {
            if (currentUser.language === language) {
                multilanguageTitle[language] = title;
            } else {
                multilanguageTitle[language] = await this.translateService.translate(
                    title,
                    language,
                    currentUser.language,
                );
            }
        }

        const alias = this.slugService.createSlug(multilanguageTitle.en);

        const existing = await this.categoryService.findAllByUser(userId);

        const sameNameExists = existing.some((c) => {
            return c.alias === alias;
        });

        if (sameNameExists) {
            throw new CategoryAlreadyExistsError();
        }

        const category = await this.categoryService.create({
            title: multilanguageTitle,
            alias: alias,
            color: color,
            icon: icon,
            userId: userId,
        });

        await this.auditLogService
            .log(
                {
                    type: AuditType.CategoryCreate,
                    actorUserId: currentUser?.id,
                    targetEntity: TargetEntity.Category,
                    targetId: category.id,
                    metadata: {},
                },
                context,
            )
            .catch((e) => {
                console.log('log creation error:', e);
            });

        console.log(`Created category ${category.id}`);

        return { category };
    }
}
