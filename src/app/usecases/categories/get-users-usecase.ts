import { Usecase } from 'domain/_core/base-domain/base-usecase';
import { UserService } from 'domain/user/service/service';
import { RoleService } from 'domain/role/service/service';
import { User, UserWithRole } from 'domain/user/user';
import { RoleNotFoundError } from 'domain/utils/errors';
import { UserSortField } from 'domain/user/user-sort';
import { UserStatus } from 'domain/user/user-state';

type GetUsersParams = {
  page: number,
  limit: number,
  sortBy?: UserSortField,
  sortOrder: 'asc' | 'desc'
  status?: UserStatus,
};

type GetUsersResult = {
  users: UserWithRole[],
  page: number,
  limit: number,
  total: number
};

export interface GetUsersUsecase extends Usecase<GetUsersParams, GetUsersResult> {}

export class GetUsersUsecaseImpl implements GetUsersUsecase {
  constructor(
    private userService: UserService,
    private roleService: RoleService,
  ) {}

  public async execute(params: GetUsersParams): Promise<GetUsersResult> {
    const {page, limit} = params;

    const { users: usersRaw , total } = await this.userService.getUsers(params);

    const users: UserWithRole[] = [];

    for (const user of usersRaw) {
      const userPopulated = await this.mapUserRole(user);
      users.push(userPopulated);
    }

    return { users, page, limit, total };
  }

  private async mapUserRole(user: User): Promise<UserWithRole> {
    const role = await this.roleService.findById(user.role);

    if(!role) {
      throw new RoleNotFoundError();
    }

    return {
      user,
      role
    }
  }
}

