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
    Query,
    UseGuards,
    UsePipes,
} from '@nestjs/common';
import { CreateUserUsecase } from 'usecases/users/create-user-usecase';
import { Symbols } from 'di/common';
import { RegisterUserDto } from 'infrastructure/controllers/dtos/users/user-register-dto';
import { LoginDto } from 'infrastructure/controllers/dtos/users/login-dto';
import { LoginUsecase } from 'usecases/auth/login-usecase';
import { LoginPresenter, LoginResponseDto } from 'infrastructure/controllers/presenters/users/login-presenter';
import { getExceptionByError } from 'infrastructure/controllers/exceptions/exceptions';
import { RegisterPresenter, RegisterResponseDto } from 'infrastructure/controllers/presenters/users/register-presenter';
import { PaginationPipe } from 'infrastructure/controllers/pipes/pagination-pipe';
import { GetUsersDto } from 'infrastructure/controllers/dtos/users/get-users-dto';
import { GetUsersUsecase } from 'usecases/users/get-users-usecase';
import {
    GetUsersPresenter,
    GetUsersResponseDto,
} from 'infrastructure/controllers/presenters/users/get-users-presenter';
import { GetUserDto } from 'infrastructure/controllers/dtos/users/get-user-dto';
import { EntityId } from 'domain/_core';
import { GetUserPresenter, GetUserResponseDto } from 'infrastructure/controllers/presenters/users/get-user-presenter';
import { GetUserUsecase } from 'usecases/users/get-user-usecase';
import { DeleteUserDto } from 'infrastructure/controllers/dtos/users/delete-user-dto';
import {
    DeleteUserPresenter,
    DeleteUserResponseDto,
} from 'infrastructure/controllers/presenters/users/delete-user-presenter';
import { DeleteUserUsecase } from 'usecases/users/delete-user-usecase';
import { UpdateUserDto } from 'infrastructure/controllers/dtos/users/update-user-dto';
import { UpdateUserUsecase } from 'usecases/users/update-user-usecase';
import {
    UpdateUserPresenter,
    UpdateUserResponseDto,
} from 'infrastructure/controllers/presenters/users/update-user-presenter';
import { JwtAuthGuard } from 'infrastructure/services/guards/auth-guard';
import { RolesGuard } from 'infrastructure/services/guards/roles-guard';
import { Public } from 'infrastructure/services/decorators/public';
import { SearchUsersUsecase } from 'usecases/users/search-users-usecase';
import { SearchUsersDto } from 'infrastructure/controllers/dtos/users/search-users-dto';
import { ChangePasswordDto } from 'infrastructure/controllers/dtos/users/change-password-dto';
import { ChangePasswordUsecase } from 'usecases/auth/change-password-usecase';
import { ChangePasswordPresenter } from 'infrastructure/controllers/presenters/users/change-passsword-presenter';
import { CurrentUserProvider } from 'infrastructure/utils/current-user-provider';
import { CreateCategoryUsecase } from 'usecases/categories/create-category-usecase';
import { RoleAlias } from 'domain/role/role';
import { AllowRoles } from 'infrastructure/services/decorators/roles';
import { CreateCategoryDto } from 'infrastructure/controllers/dtos/categories/create-category-dto';
import {
    CreateCategoryPresenter,
    CreateCategoryResponseDto,
} from 'infrastructure/controllers/presenters/categories/create-presenter';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('categories')
export class CategoryController {
    constructor(
        @Inject(Symbols.usecases.categories.create)
        private readonly createCategoryUsecase: CreateCategoryUsecase,
        // @Inject(Symbols.usecases.categories.get)
        // private readonly getCategorysUsecase: GetCategorysUsecase,
        // @Inject(Symbols.usecases.categories.getOne)
        // private readonly getCategoryUsecase: GetCategoryUsecase,
        // @Inject(Symbols.usecases.categories.search)
        // private readonly searchCategorysUsecase: SearchCategorysUsecase,
        // @Inject(Symbols.usecases.categories.delete)
        // private readonly deleteCategoryUsecase: DeleteCategoryUsecase,
        // @Inject(Symbols.usecases.categories.update)
        // private readonly updateCategoryUsecase: UpdateCategoryUsecase,

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

    // @HttpCode(HttpStatus.OK)
    // @Get('/search')
    // @Public()
    // @UsePipes(PaginationPipe)
    // public async search(@Query() query: SearchUsersDto): Promise<GetUsersResponseDto> {
    //   try {
    //     const params = {
    //       page: query.page,
    //       limit: query.limit,
    //       query: query.query,
    //     };
    //
    //     const { users, page, limit, total } = await this.searchUsersUsecase.execute(params);
    //
    //     return GetUsersPresenter.present(users, page, limit, total);
    //   } catch (error) {
    //     throw getExceptionByError(error);
    //   }
    // }
    //
    // @HttpCode(HttpStatus.OK)
    // @Get()
    // @Public()
    // @UsePipes(PaginationPipe)
    // public async getUsers(@Query() query: GetUsersDto): Promise<GetUsersResponseDto> {
    //   try {
    //     const params = {
    //       page: query.page,
    //       limit: query.limit,
    //       sortBy: query.sortBy,
    //       sortOrder: query.sortOrder,
    //       status: query.status,
    //     };
    //
    //     const { users, page, limit, total } = await this.getUsersUsecase.execute(params);
    //
    //     return GetUsersPresenter.present(users, page, limit, total);
    //   } catch (error) {
    //     throw getExceptionByError(error);
    //   }
    // }
    //
    // @HttpCode(HttpStatus.OK)
    // @Get(':id')
    // @Public()
    // public async getUser(@Param() params: GetUserDto): Promise<GetUserResponseDto> {
    //   try {
    //     const id = new EntityId(params.id)
    //
    //     const { user, role } = await this.getUserUsecase.execute({ id });
    //
    //     return GetUserPresenter.present(user, role);
    //   } catch (error) {
    //     throw getExceptionByError(error);
    //   }
    // }
    //
    // @HttpCode(HttpStatus.OK)
    // @Delete(':id')
    // @Public()
    // public async deleteUser(@Param() params: DeleteUserDto): Promise<DeleteUserResponseDto> {
    //   try {
    //     const currentUser = await this.currentUser.get();
    //     const context = this.currentUser.getContext();
    //     const id = new EntityId(params.id)
    //
    //     await this.deleteUserUsecase.execute({ id }, currentUser, context);
    //
    //     return DeleteUserPresenter.present();
    //   } catch (error) {
    //     throw getExceptionByError(error);
    //   }
    // }
    //
    // @HttpCode(HttpStatus.OK)
    // @Patch(':id')
    // @Public()
    // public async updateUser(@Param('id') id: string, @Body() params: UpdateUserDto): Promise<UpdateUserResponseDto> {
    //   try {
    //     const context = this.currentUser.getContext();
    //     const currentUser = await this.currentUser.get();
    //     const updateParams = {
    //       id: new EntityId(id),
    //       query: {
    //         name: {
    //           first: params.firstName,
    //           last: params.lastName,
    //         },
    //         email: params.email,
    //         language: params.language,
    //         phone: params.phone,
    //       },
    //     };
    //
    //     const { user, role} = await this.updateUserUsecase.execute(updateParams, currentUser, context);
    //
    //     return UpdateUserPresenter.present(user, role);
    //   } catch (error) {
    //     throw getExceptionByError(error);
    //   }
    // }
}
