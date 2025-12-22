import { UserWithRole } from 'domain/user/user';
import { Role } from 'domain/role/role';
import { UserPresenter, UserResponseDto } from 'infrastructure/controllers/presenters/_common/user-presenter';
import { ErrorDto } from 'infrastructure/controllers/dtos/error-dto';
import { PaginatedResponseDto } from 'infrastructure/controllers/presenters/_common/paginated-response-presenter';

export class GetUsersPresenter {
    static present(users: UserWithRole[], page: number, limit: number, total: number): GetUsersResponseDto {
        return {
            success: true,
            page,
            limit,
            total,
            data: users.map((userWithRole) => {
                return UserPresenter.present(userWithRole.user, userWithRole.role as Role);
            }),
        };
    }
}

export type GetUsersResponseDto =
    | ({
          success: boolean;
      } & PaginatedResponseDto<UserResponseDto>)
    | ErrorDto;
