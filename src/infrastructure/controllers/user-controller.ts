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
import { AllowRoles } from 'infrastructure/services/decorators/roles';
import { RoleAlias } from 'domain/role/role';
import { SearchUsersUsecase } from 'usecases/users/search-users-usecase';
import { SearchUsersDto } from 'infrastructure/controllers/dtos/users/search-users-dto';
import { ChangePasswordDto } from 'infrastructure/controllers/dtos/users/change-password-dto';
import { ChangePasswordUsecase } from 'usecases/auth/change-password-usecase';
import { ChangePasswordPresenter } from 'infrastructure/controllers/presenters/users/change-passsword-presenter';
import { CurrentUserProvider } from 'infrastructure/utils/current-user-provider';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(
    @Inject(Symbols.usecases.users.createUser)
    private readonly createUserUsecase: CreateUserUsecase,
    @Inject(Symbols.usecases.users.login)
    private readonly loginUsecase: LoginUsecase,
    @Inject(Symbols.usecases.users.changePassword)
    private readonly changePasswordUsecase: ChangePasswordUsecase,
    @Inject(Symbols.usecases.users.get)
    private readonly getUsersUsecase: GetUsersUsecase,
    @Inject(Symbols.usecases.users.getOne)
    private readonly getUserUsecase: GetUserUsecase,
    @Inject(Symbols.usecases.users.search)
    private readonly searchUsersUsecase: SearchUsersUsecase,
    @Inject(Symbols.usecases.users.deleteUser)
    private readonly deleteUserUsecase: DeleteUserUsecase,
    @Inject(Symbols.usecases.users.updateUser)
    private readonly updateUserUsecase: UpdateUserUsecase,

    @Inject(Symbols.infrastructure.providers.currentUser)
    private readonly currentUser: CurrentUserProvider,
  ) {}

  @Post('/register')
  @Public()
  public async register(@Body() params: RegisterUserDto): Promise<RegisterResponseDto> {
    try {
      const context = this.currentUser.getContext();

      const createParams = {
        name: {
          first: params.firstName,
          last: params.lastName,
        },
        email: params.email,
        language: params.language,
        password: params.password,
        phone: params.phone,
        role: params.role,
      };

      const { user, role } =  await this.createUserUsecase.execute(createParams, undefined, context);

      return RegisterPresenter.present(user, role);
    } catch (error) {
      throw getExceptionByError(error);
    }
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  public async login(@Body() params: LoginDto): Promise<LoginResponseDto> {
    try {
      const context = this.currentUser.getContext();

      const { user, role, tokens } = await this.loginUsecase.execute({
        email: params.email,
        password: params.password,
      }, null, context);

      return LoginPresenter.present(user, role, tokens);
    } catch (error) {
      throw getExceptionByError(error);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id/change-password')
  public async changePassword(@Param('id') id: string, @Body() params: ChangePasswordDto): Promise<LoginResponseDto> {
    try {
      const context = this.currentUser.getContext();
      const currentUser = await this.currentUser.get();

      const { user, role, tokens } = await this.changePasswordUsecase.execute({
        userId: new EntityId(id),
        currentPassword: params.currentPassword,
        newPassword: params.newPassword,
        newPasswordConfirmation: params.newPasswordConfirmation,
      }, currentUser, context);

      return ChangePasswordPresenter.present(user, role, tokens);
    } catch (error) {
      throw getExceptionByError(error);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('/search')
  @Public()
  @UsePipes(PaginationPipe)
  public async search(@Query() query: SearchUsersDto): Promise<GetUsersResponseDto> {
    try {
      const params = {
        page: query.page,
        limit: query.limit,
        query: query.query,
      };

      const { users, page, limit, total } = await this.searchUsersUsecase.execute(params);

      return GetUsersPresenter.present(users, page, limit, total);
    } catch (error) {
      throw getExceptionByError(error);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  @Public()
  @UsePipes(PaginationPipe)
  public async getUsers(@Query() query: GetUsersDto): Promise<GetUsersResponseDto> {
    try {
      const params = {
        page: query.page,
        limit: query.limit,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder,
        status: query.status,
      };

      const { users, page, limit, total } = await this.getUsersUsecase.execute(params);

      return GetUsersPresenter.present(users, page, limit, total);
    } catch (error) {
      throw getExceptionByError(error);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @Public()
  public async getUser(@Param() params: GetUserDto): Promise<GetUserResponseDto> {
    try {
      const id = new EntityId(params.id)

      const { user, role } = await this.getUserUsecase.execute({ id });

      return GetUserPresenter.present(user, role);
    } catch (error) {
      throw getExceptionByError(error);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  @Public()
  public async deleteUser(@Param() params: DeleteUserDto): Promise<DeleteUserResponseDto> {
    try {
      const currentUser = await this.currentUser.get();
      const context = this.currentUser.getContext();
      const id = new EntityId(params.id)

      await this.deleteUserUsecase.execute({ id }, currentUser, context);

      return DeleteUserPresenter.present();
    } catch (error) {
      throw getExceptionByError(error);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  @Public()
  public async updateUser(@Param('id') id: string, @Body() params: UpdateUserDto): Promise<UpdateUserResponseDto> {
    try {
      const context = this.currentUser.getContext();
      const currentUser = await this.currentUser.get();
      const updateParams = {
        id: new EntityId(id),
        query: {
          name: {
            first: params.firstName,
            last: params.lastName,
          },
          email: params.email,
          language: params.language,
          phone: params.phone,
        },
      };

      const { user, role} = await this.updateUserUsecase.execute(updateParams, currentUser, context);

      return UpdateUserPresenter.present(user, role);
    } catch (error) {
      throw getExceptionByError(error);
    }
  }
}
