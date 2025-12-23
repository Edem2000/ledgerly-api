import { Usecase } from 'domain/_core/base-domain/base-usecase';
import { Context, EntityId, Identifier } from 'domain/_core';
import { CurrentUser } from 'domain/_utils/auth/types';
import { Category, CategoryService } from 'domain/category';
import { CategoryNotFoundError } from 'domain/utils/errors';

type GetCategoryParams = {
    id: Identifier;
};

type GetCategoryResult = {
    category: Category;
};

export interface GetCategoryUsecase
    extends Usecase<GetCategoryParams, GetCategoryResult, CurrentUser, Context> {}

export class GetCategoryUsecaseImpl implements GetCategoryUsecase {
    constructor(private categoryService: CategoryService) {}

    async execute(
        params: GetCategoryParams,
        currentUser: CurrentUser,
        _context: Context,
    ): Promise<GetCategoryResult> {
        const category = await this.categoryService.getById(params.id);

        if (!category) {
            throw new CategoryNotFoundError();
        }

        const userId = new EntityId(currentUser.id);
        await this.categoryService.validateOwnership(category, userId);

        return { category };
    }
}
