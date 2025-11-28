import { Usecase } from 'domain/_core/base-domain/base-usecase';
import { UserService } from 'domain/user/service/service';
import { User, UserWithRole } from 'domain/user/user';
import { RoleNotFoundError } from 'domain/utils/errors';
import { RoleService } from 'domain/role/service/service';

type SearchUsersParams = {
  query: string;
  page: number,
  limit: number,
};

type SearchUsersResult = {
  users: UserWithRole[],
  page: number,
  limit: number,
  total: number,
};

export interface SearchUsersUsecase extends Usecase<SearchUsersParams, SearchUsersResult> {}

export class SearchUsersUsecaseImpl implements SearchUsersUsecase {
  constructor(
    private userService: UserService,
    private roleService: RoleService,
  ) {}

  public async execute(params: SearchUsersParams): Promise<SearchUsersResult> {
    const {page, limit} = params;

    const { users: usersRaw, total } = await this.userService.search(params.query);

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

