import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { Symbols } from 'di/common';
import { getExceptionByError } from 'infrastructure/controllers/exceptions/exceptions';
import { EntityId } from 'domain/_core';
import { JwtAuthGuard } from 'infrastructure/services/guards/auth-guard';
import { RolesGuard } from 'infrastructure/services/guards/roles-guard';
import { CurrentUserProvider } from 'infrastructure/utils/current-user-provider';
import { RoleAlias } from 'domain/role/role';
import { AllowRoles } from 'infrastructure/services/decorators/roles';
import { CreateCategoryUsecase } from 'usecases/categories/create-category-usecase';
import { GetCategoriesUsecase } from 'usecases/categories/get-categories-usecase';
import { GetCategoryUsecase } from 'usecases/categories/get-category-usecase';
import { UpdateCategoryUsecase } from 'usecases/categories/update-category-usecase';
import { DeleteCategoryUsecase } from 'usecases/categories/delete-category-usecase';
import { CreateCategoryDto } from 'infrastructure/controllers/dtos/categories/create-category-dto';
import { GetCategoryDto } from 'infrastructure/controllers/dtos/categories/get-category-dto';
import { UpdateCategoryDto } from 'infrastructure/controllers/dtos/categories/update-category-dto';
import { DeleteCategoryDto } from 'infrastructure/controllers/dtos/categories/delete-category-dto';
import {
    CreateCategoryPresenter,
    CreateCategoryResponseDto,
} from 'infrastructure/controllers/presenters/categories/create-presenter';
import {
    GetCategoriesPresenter,
    GetCategoriesResponseDto,
} from 'infrastructure/controllers/presenters/categories/get-presenter';
import {
    GetCategoryPresenter,
    GetCategoryResponseDto,
} from 'infrastructure/controllers/presenters/categories/get-category-presenter';
import {
    UpdateCategoryPresenter,
    UpdateCategoryResponseDto,
} from 'infrastructure/controllers/presenters/categories/update-presenter';
import {
    DeleteCategoryPresenter,
    DeleteCategoryResponseDto,
} from 'infrastructure/controllers/presenters/categories/delete-presenter';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('categories')
export class CategoryController {
    constructor(
        @Inject(Symbols.usecases.categories.create)
        private readonly createCategoryUsecase: CreateCategoryUsecase,
        @Inject(Symbols.usecases.categories.get)
        private readonly getCategoriesUsecase: GetCategoriesUsecase,
        @Inject(Symbols.usecases.categories.getOne)
        private readonly getCategoryUsecase: GetCategoryUsecase,
        @Inject(Symbols.usecases.categories.update)
        private readonly updateCategoryUsecase: UpdateCategoryUsecase,
        @Inject(Symbols.usecases.categories.delete)
        private readonly deleteCategoryUsecase: DeleteCategoryUsecase,
        @Inject(Symbols.infrastructure.providers.currentUser)
        private readonly currentUser: CurrentUserProvider,
    ) {}

    @Post('/')
    @AllowRoles(RoleAlias.User)
    public async create(@Body() params: CreateCategoryDto): Promise<CreateCategoryResponseDto> {
        try {
            const currentUser = await this.currentUser.get();
            const context = this.currentUser.getContext();

            const { category } = await this.createCategoryUsecase.execute(params, currentUser, context);

            return CreateCategoryPresenter.present(category);
        } catch (error) {
            throw getExceptionByError(error);
        }
    }

    @HttpCode(HttpStatus.OK)
    @Get()
    @AllowRoles(RoleAlias.User)
    public async getAll(): Promise<GetCategoriesResponseDto> {
        try {
            const currentUser = await this.currentUser.get();
            const context = this.currentUser.getContext();

            const { categories } = await this.getCategoriesUsecase.execute({}, currentUser, context);

            return GetCategoriesPresenter.present(categories, currentUser);
        } catch (error) {
            throw getExceptionByError(error);
        }
    }

    @HttpCode(HttpStatus.OK)
    @Get(':id')
    @AllowRoles(RoleAlias.User)
    public async getOne(@Param() params: GetCategoryDto): Promise<GetCategoryResponseDto> {
        try {
            const currentUser = await this.currentUser.get();
            const context = this.currentUser.getContext();
            const id = new EntityId(params.id);

            const { category } = await this.getCategoryUsecase.execute({ id }, currentUser, context);

            return GetCategoryPresenter.present(category, currentUser);
        } catch (error) {
            throw getExceptionByError(error);
        }
    }

    @HttpCode(HttpStatus.OK)
    @Patch(':id')
    @AllowRoles(RoleAlias.User)
    public async update(
        @Param() params: GetCategoryDto,
        @Body() body: UpdateCategoryDto,
    ): Promise<UpdateCategoryResponseDto> {
        try {
            const currentUser = await this.currentUser.get();
            const context = this.currentUser.getContext();
            const id = new EntityId(params.id);

            const { category } = await this.updateCategoryUsecase.execute(
                {
                    id,
                    title: body.title,
                    color: body.color,
                    icon: body.icon,
                },
                currentUser,
                context,
            );

            return UpdateCategoryPresenter.present(category, currentUser);
        } catch (error) {
            throw getExceptionByError(error);
        }
    }

    @HttpCode(HttpStatus.OK)
    @Delete(':id')
    @AllowRoles(RoleAlias.User)
    public async delete(@Param() params: DeleteCategoryDto): Promise<DeleteCategoryResponseDto> {
        try {
            const currentUser = await this.currentUser.get();
            const context = this.currentUser.getContext();
            const id = new EntityId(params.id);

            await this.deleteCategoryUsecase.execute({ id }, currentUser, context);

            return DeleteCategoryPresenter.present();
        } catch (error) {
            throw getExceptionByError(error);
        }
    }
}
