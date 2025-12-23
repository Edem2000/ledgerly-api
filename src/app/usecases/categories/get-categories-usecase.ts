import { Usecase } from 'domain/_core/base-domain/base-usecase';
import { Context, EntityId } from 'domain/_core';
import { CurrentUser } from 'domain/_utils/auth/types';
import { Category, CategoryService } from 'domain/category';

type GetCategoriesParams = Record<string, never>;

type GetCategoriesResult = {
    categories: Category[];
};

export interface GetCategoriesUsecase
    extends Usecase<GetCategoriesParams, GetCategoriesResult, CurrentUser, Context> {}

export class GetCategoriesUsecaseImpl implements GetCategoriesUsecase {
    constructor(private categoryService: CategoryService) {}

    async execute(
        _: GetCategoriesParams,
        currentUser: CurrentUser,
        _context: Context,
    ): Promise<GetCategoriesResult> {
        const userId = new EntityId(currentUser.id);
        const categories = await this.categoryService.findAllByUser(userId);

        return { categories };
    }
}
