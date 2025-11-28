import { User, UserModel } from 'domain/user/user';
import { UserSortField } from 'domain/user/user-sort';
import { UserStatus } from 'domain/user/user-state';
import { DeepPartial } from 'domain/utils/type-helpers';

export type CreateParams = Omit<UserModel, 'status' | 'lastLoggedInAt' | 'deleted' | 'registeredAt'>;
export type UpdateParams = DeepPartial<Omit<UserModel, 'status' | 'lastLoggedInAt' | 'deleted' | 'password' | 'role'>>;

export type LoginParams = {
  email: string,
  password: string,
};

export type GetUsersParams = {
  page: number,
  limit: number,
  sortBy?: UserSortField,
  sortOrder: 'asc' | 'desc'
  status?: UserStatus,
}

export type GetUsersResult = {
  users: User[],
  total: number
};

export type UserFilterQuery = {
  status?: UserStatus,
};

export type UserSortQuery = {
  [K in UserSortField]: { [key in K]: 1 | -1 }
}[UserSortField];