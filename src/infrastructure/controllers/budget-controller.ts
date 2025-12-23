import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Post,
    Query,
    UseGuards,
    Patch,
    Param,
} from '@nestjs/common';
import { Symbols } from 'di/common';
import { getExceptionByError } from 'infrastructure/controllers/exceptions/exceptions';
import { EntityId } from 'domain/_core';
import { JwtAuthGuard } from 'infrastructure/services/guards/auth-guard';
import { RolesGuard } from 'infrastructure/services/guards/roles-guard';
import { CurrentUserProvider } from 'infrastructure/utils/current-user-provider';
import { RoleAlias } from 'domain/role/role';
import { AllowRoles } from 'infrastructure/services/decorators/roles';
import { CreateCategoryBudgetPresenter, CreateCategoryBudgetResponseDto } from 'infrastructure/controllers/presenters/category-budgets/create-presenter';
import { CreateCategoryBudgetUsecase } from 'usecases/category-budgets/create-usecase';
import { CreateCategoryBudgetDto } from 'infrastructure/controllers/dtos/category-budgets/create-category-budget-dto';
import { GetCategoryBudgetsPresenter, GetCategoryBudgetsResponseDto } from 'infrastructure/controllers/presenters/category-budgets/get-presenter';
import { GetCategoryBudgetsQueryDto } from 'infrastructure/controllers/dtos/category-budgets/get-dto';
import { GetCategoryBudgetsUsecase } from 'usecases/category-budgets/get-usecase';
import { UpdateCategoryBudgetDto } from 'infrastructure/controllers/dtos/category-budgets/update-category-budget-dto';
import { UpdateCategoryBudgetUsecase } from 'usecases/category-budgets/update-usecase';


@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('category-budgets')
export class CategoryBudgetController {
    constructor(
        @Inject(Symbols.usecases.categoryBudgets.create)
        private readonly createCategoryBudgetUsecase: CreateCategoryBudgetUsecase,
        @Inject(Symbols.usecases.categoryBudgets.get)
        private readonly getCategoryBudgetsUsecase: GetCategoryBudgetsUsecase,
        @Inject(Symbols.usecases.categoryBudgets.update)
        private readonly updateCategoryBudgetUsecase: UpdateCategoryBudgetUsecase,
        // @Inject(Symbols.usecases.categoryBudgets.delete)
        // private readonly deleteCategoryBudgetUsecase: DeleteCategoryBudgetUsecase,

        @Inject(Symbols.infrastructure.providers.currentUser)
        private readonly currentUser: CurrentUserProvider,
    ) {}

    @Post('/')
    @AllowRoles(RoleAlias.User)
    public async create(@Body() params: CreateCategoryBudgetDto): Promise<CreateCategoryBudgetResponseDto> {
        try {
            const currentUser = await this.currentUser.get();
            const context = this.currentUser.getContext();

            const { budget } = await this.createCategoryBudgetUsecase.execute(
                {
                    categoryId: new EntityId(params.categoryId),
                    currency: params.currency,
                    plannedAmount: params.plannedAmount,
                    limitAmount: params.limitAmount,
                    month: params.month,
                    year: params.year,
                    note: params.note,
                },
                currentUser,
                context,
            );

            return CreateCategoryBudgetPresenter.present(budget);
        } catch (error) {
            throw getExceptionByError(error);
        }
    }

    @Patch(':id')
    @AllowRoles(RoleAlias.User)
    public async update(@Param('id') id: string, @Body() params: UpdateCategoryBudgetDto): Promise<CreateCategoryBudgetResponseDto> {
        try {
            const currentUser = await this.currentUser.get();
            const context = this.currentUser.getContext();

            const { budget } = await this.updateCategoryBudgetUsecase.execute(
                {
                    id: new EntityId(id),
                    plannedAmount: params.plannedAmount,
                    limitAmount: params.limitAmount,
                    currency: params.currency,
                    note: params.note,
                },
                currentUser,
                context,
            );

            return CreateCategoryBudgetPresenter.present(budget);
        } catch (error) {
            throw getExceptionByError(error);
        }
    }

    @HttpCode(HttpStatus.OK)
    @Get()
    @AllowRoles(RoleAlias.User)
    public async get(@Query() query: GetCategoryBudgetsQueryDto): Promise<GetCategoryBudgetsResponseDto> {
        try {
            const currentUser = await this.currentUser.get();
            const context = this.currentUser.getContext();

            const { budgets } = await this.getCategoryBudgetsUsecase.execute(
                {
                    year: query.year,
                    month: query.month,
                },
                currentUser,
                context,
            );

            return GetCategoryBudgetsPresenter.present(budgets);
        } catch (error) {
            throw getExceptionByError(error);
        }
    }
    //
    // @HttpCode(HttpStatus.OK)
    // @Delete(':id')
    // @AllowRoles(RoleAlias.User)
    // public async delete(@Param() params: DeleteCategoryBudgetDto): Promise<DeleteCategoryBudgetResponseDto> {
    //     try {
    //         const currentUser = await this.currentUser.get();
    //         const context = this.currentUser.getContext();
    //         const id = new EntityId(params.id);
    //
    //         await this.deleteCategoryBudgetUsecase.execute({ id }, currentUser, context);
    //
    //         return DeleteCategoryBudgetPresenter.present();
    //     } catch (error) {
    //         throw getExceptionByError(error);
    //     }
    // }
}
