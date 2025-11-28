import { Module } from '@nestjs/common';
import { AuthModule, Symbols } from 'di/common';
import { UserService } from 'domain/user/service/service';
import { CreateUserUsecase, CreateUserUsecaseImpl } from 'usecases/users/create-user-usecase';
import { LoginUsecase, LoginUsecaseImpl } from 'usecases/auth/login-usecase';
import { JwtService } from 'domain/_utils/auth/types';
import { RoleModule } from 'di/common/modules/domain/entities/role-module';
import { RoleService } from 'domain/role/service/service';
import { GetUsersUsecase, GetUsersUsecaseImpl } from 'usecases/users/get-users-usecase';
import { GetUserUsecase, GetUserUsecaseImpl } from 'usecases/users/get-user-usecase';
import { DeleteUserUsecase, DeleteUserUsecaseImpl } from 'usecases/users/delete-user-usecase';
import { UpdateUserUsecase, UpdateUserUsecaseImpl } from 'usecases/users/update-user-usecase';
import {  UserModule } from 'di/common/modules/domain/entities';
import { SearchUsersUsecase, SearchUsersUsecaseImpl } from 'usecases/users/search-users-usecase';
import { CurrentUserModule } from 'di/common/modules/domain/entities/current-user-module';
import { CurrentUserService } from 'domain/session';
import { GetMeUsecase, GetMeUsecaseImpl } from 'usecases/auth/get-me-usecase';
import { ChangePasswordUsecase, ChangePasswordUsecaseImpl } from 'usecases/auth/change-password-usecase';
import {
  AssignCompanyToUserUsecase,
  AssignCompanyToUserUsecaseImpl,
} from 'usecases/users/assign-company-to-user-usecase';
import {
  UnassignCompanyFromUserUsecase,
  UnassignCompanyFromUserUsecaseImpl,
} from 'usecases/users/unassign-company-from-user-usecase';
import { AuditLogService } from 'domain/audit';
import { AuditLogModule } from 'di/common/modules/domain/entities/audit-log-module';

@Module({
  imports: [
    UserModule,
    CurrentUserModule,
    AuthModule,
    RoleModule,
    AuditLogModule,
  ],
  providers: [
    {
      provide: Symbols.usecases.users.createUser,
      useFactory(
        userService: UserService,
        roleService: RoleService,
        auditLogService: AuditLogService,
      ): CreateUserUsecase {
        return new CreateUserUsecaseImpl(userService, roleService, auditLogService);
      },
      inject: [
        Symbols.domain.user.userService,
        Symbols.domain.role.roleService,
        Symbols.domain.auditLog.auditLogService,
      ],
    },
    {
      provide: Symbols.usecases.users.login,
      useFactory(
        userService: UserService,
        roleService: RoleService,
        currentUserService: CurrentUserService,
        jwtService: JwtService,
        auditLogService: AuditLogService,
      ): LoginUsecase {
        return new LoginUsecaseImpl(userService, roleService, currentUserService, jwtService, auditLogService);
      },
      inject: [
        Symbols.domain.user.userService,
        Symbols.domain.role.roleService,
        Symbols.domain.currentUser.currentUserService,
        Symbols.infrastructure.jwt.jwtService,
        Symbols.domain.auditLog.auditLogService,
      ],
    },
    {
      provide: Symbols.usecases.users.changePassword,
      useFactory(
        userService: UserService,
        roleService: RoleService,
        currentUserService: CurrentUserService,
        jwtService: JwtService,
        auditLogService: AuditLogService,
      ): ChangePasswordUsecase {
        return new ChangePasswordUsecaseImpl(userService, roleService, currentUserService, jwtService, auditLogService);
      },
      inject: [
        Symbols.domain.user.userService,
        Symbols.domain.role.roleService,
        Symbols.domain.currentUser.currentUserService,
        Symbols.infrastructure.jwt.jwtService,
        Symbols.domain.auditLog.auditLogService,
      ],
    },
    {
      provide: Symbols.usecases.users.getMe,
      useFactory(
        userService: UserService,
        currentUserService: CurrentUserService,
        roleService: RoleService,
      ): GetMeUsecase {
        return new GetMeUsecaseImpl(userService, currentUserService, roleService);
      },
      inject: [
        Symbols.domain.user.userService,
        Symbols.domain.currentUser.currentUserService,
        Symbols.domain.role.roleService,
      ],
    },
    {
      provide: Symbols.usecases.users.get,
      useFactory(
        userService: UserService,
        roleService: RoleService,
      ): GetUsersUsecase {
        return new GetUsersUsecaseImpl(userService, roleService);
      },
      inject: [
        Symbols.domain.user.userService,
        Symbols.domain.role.roleService,
      ],
    },
    {
      provide: Symbols.usecases.users.search,
      useFactory(
        userService: UserService,
        roleService: RoleService,
      ): SearchUsersUsecase {
        return new SearchUsersUsecaseImpl(userService, roleService);
      },
      inject: [
        Symbols.domain.user.userService,
        Symbols.domain.role.roleService,
      ],
    },
    {
      provide: Symbols.usecases.users.getOne,
      useFactory(
        userService: UserService,
        roleService: RoleService,
      ): GetUserUsecase {
        return new GetUserUsecaseImpl(userService, roleService);
      },
      inject: [
        Symbols.domain.user.userService,
        Symbols.domain.role.roleService,
      ],
    },
    {
      provide: Symbols.usecases.users.deleteUser,
      useFactory(
        userService: UserService,
        auditLogService: AuditLogService,
      ): DeleteUserUsecase {
        return new DeleteUserUsecaseImpl(userService, auditLogService);
      },
      inject: [
        Symbols.domain.user.userService,
        Symbols.domain.auditLog.auditLogService,
      ],
    },
    {
      provide: Symbols.usecases.users.updateUser,
      useFactory(
        userService: UserService,
        roleService: RoleService,
        auditLogService: AuditLogService,
      ): UpdateUserUsecase {
        return new UpdateUserUsecaseImpl(userService, roleService, auditLogService);
      },
      inject: [
        Symbols.domain.user.userService,
        Symbols.domain.role.roleService,
        Symbols.domain.auditLog.auditLogService,
      ],
    },
    {
      provide: Symbols.usecases.users.assignCompany,
      useFactory(
        userService: UserService,
        roleService: RoleService,
        currentUserService: CurrentUserService,
        auditLogService: AuditLogService,
      ): AssignCompanyToUserUsecase {
        return new AssignCompanyToUserUsecaseImpl(userService, roleService, currentUserService, auditLogService);
      },
      inject: [
        Symbols.domain.user.userService,
        Symbols.domain.role.roleService,
        Symbols.domain.currentUser.currentUserService,
        Symbols.domain.auditLog.auditLogService,
      ],
    },
    {
      provide: Symbols.usecases.users.unassignCompany,
      useFactory(
        userService: UserService,
        roleService: RoleService,
        currentUserService: CurrentUserService,
        auditLogService: AuditLogService,
      ): UnassignCompanyFromUserUsecase {
        return new UnassignCompanyFromUserUsecaseImpl(userService, roleService, currentUserService, auditLogService);
      },
      inject: [
        Symbols.domain.user.userService,
        Symbols.domain.role.roleService,
        Symbols.domain.currentUser.currentUserService,
        Symbols.domain.auditLog.auditLogService,
      ],
    },
  ],
  exports: [
    Symbols.usecases.users.createUser,
    Symbols.usecases.users.login,
    Symbols.usecases.users.changePassword,
    Symbols.usecases.users.getMe,
    Symbols.usecases.users.get,
    Symbols.usecases.users.getOne,
    Symbols.usecases.users.deleteUser,
    Symbols.usecases.users.updateUser,
    Symbols.usecases.users.assignCompany,
    Symbols.usecases.users.unassignCompany,
    Symbols.usecases.users.search,
  ],
})

export class UserUsecasesModule {}