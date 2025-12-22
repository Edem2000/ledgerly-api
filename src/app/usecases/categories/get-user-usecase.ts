import { Usecase } from 'domain/_core/base-domain/base-usecase';
import { UserService } from 'domain/user/service/service';
import { User } from 'domain/user/user';
import { RoleService } from 'domain/role/service/service';
import { Role } from 'domain/role/role';
import { RoleNotFoundError, UserNotFoundError } from 'domain/utils/errors';
import { Identifier } from 'domain/_core';

type GetUserParams = {
    id: Identifier;
};

type GetUserResult = {
    user: User;
    role: Role;
};

export interface GetUserUsecase extends Usecase<GetUserParams, GetUserResult> {}

export class GetUserUsecaseImpl implements GetUserUsecase {
    constructor(
        private userService: UserService,
        private roleService: RoleService,
    ) {}

    async execute(params: GetUserParams): Promise<GetUserResult> {
        const user = await this.userService.getById(params.id);

        if (!user) {
            throw new UserNotFoundError();
        }

        const role = await this.roleService.findById(user.role);

        if (!role) {
            throw new RoleNotFoundError();
        }

        return { user, role };
    }
}
