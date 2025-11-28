import { HexString } from 'domain/_core';
import { CurrentUser } from 'domain/_utils/auth/types';
import { CurrentUserCacheRepository } from 'domain/session';
import { User } from 'domain/user';
import { Role } from 'domain/role/role';

export interface CurrentUserService {
  get(userId: HexString): CurrentUser | undefined
  set(ctx: CurrentUser, ttlSeconds?: number): void;
  delete(userId: HexString): void;
  updateUser(user: User): void;
}

export class CurrentUserServiceImpl implements CurrentUserService {
  constructor(
    private repository: CurrentUserCacheRepository,
  ) {}

  public get(userId: HexString): CurrentUser | undefined {
    return this.repository.get(userId);
  }

  public set(userData: CurrentUser): void {
    this.repository.set(userData);
  }

  public delete(userId: HexString): void {
    this.repository.delete(userId);
  }

  public updateUser(user: User, role?: Role): void {
    const cached = this.get(user.id.toString());

    const userData = {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      language: user.language,
      roleId: role?.id.toString() || cached?.roleId!,
      roleAlias: role?.alias || cached?.roleAlias!,
    };

    this.repository.set(userData);
  }

}