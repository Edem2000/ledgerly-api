import { BaseService, Identifier } from 'domain/_core';
import { UserRepository } from 'domain/user/repository/repository';
import { User } from 'domain/user/user';
import { Hasher } from 'domain/_utils/auth/types';
import { UserStatus } from 'domain/user/user-state';
import {
  CreateParams,
  GetUsersParams,
  GetUsersResult,
  LoginParams,
  UpdateParams,
  UserFilterQuery,
  UserSortQuery,
} from 'domain/user/service/types';
import { identifierToObjectId } from 'data';

export interface UserService {
  create(params: CreateParams): Promise<User>;
  validateUser(params: LoginParams): Promise<User | null>;
  updateRefreshToken(user: User, token: string): Promise<User>;
  changePassword(user: User, password: string): Promise<User>;
  getUsers(params: GetUsersParams): Promise<GetUsersResult>;
  search(query: string): Promise<GetUsersResult>;
  getById(id: Identifier): Promise<User | null>;
  deleteById(id: Identifier): Promise<void>;
  update(user: User, params: UpdateParams): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  assignCompanies(user: User, companyIds: Identifier[]): Promise<User>;
  unassignCompanies(user: User, companyIds: Identifier[]): Promise<User>;
  assignCompaniesToUsersWithRoles(roles: Identifier[], companyIds: Identifier[]): Promise<void>;
}

export class UserServiceImpl extends BaseService implements UserService {
  constructor(
    private repository: UserRepository,
    private hasher: Hasher,
  ) {
    super('user');
  }

  public async create(params: CreateParams): Promise<User> {
    const user = new User({
      ...params,
      password: this.hasher.hashPassword(params.password),
      status: UserStatus.Active,
      deleted: false,
      companyIds: [],
    });
    return await this.repository.create(user);
  }

  public async validateUser(params: LoginParams): Promise<User | null> {
    const user = await this.repository.findByEmail(params.email);
    if(user && this.hasher.comparePasswords(params.password, user.password)){
      return user;
    }
    return null;
  }

  public async updateRefreshToken(user: User, token: string): Promise<User> {
    user.refreshToken = token;
    user.lastLoggedInAt = new Date();
    return await this.repository.save(user);
  }

  public async changePassword(user: User, password: string): Promise<User> {
    user.password = this.hasher.hashPassword(password);
    return await this.repository.save(user);
  }

  public async getUsers(params: GetUsersParams): Promise<GetUsersResult> {
    const skip = (params.page - 1) * params.limit;

    const filter: UserFilterQuery = {};
    if(params.status){
      filter.status = params.status;
    }

    const sortQuery: UserSortQuery = {
      [params.sortBy || '_id']: params.sortOrder === 'asc' ? 1 : -1,
    } as UserSortQuery;

    return await this.repository.getUsers(filter, sortQuery, params.limit, skip)
  }

  public async search(query: string): Promise<GetUsersResult> {
    return await this.repository.searchByFields(query);
  }

  public async getById(id: Identifier): Promise<User | null> {
    return await this.repository.findById(id);
  }

  public async deleteById(id: Identifier): Promise<void> {
    const user = await this.repository.findById(id);
    if(!user) {
      return;
    }
    user.status = UserStatus.Deleted;
    user.deleted = true;
    user.deletedAt = new Date();
    await this.repository.save(user);
  }

  public async update(user: User, params: UpdateParams): Promise<User> {
    user.firstName = params.name?.first || user.firstName;
    user.lastName = params.name?.last || user.lastName;
    user.phone = params.phone || user.phone;
    user.email = params.email || user.email;
    user.language = params.language || user.language;

    return await this.repository.save(user);
  }

  public async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findByEmail(email);
  }

  public async save(entity: User): Promise<User> {
    return await this.repository.save(entity);
  }

  public async assignCompanies(user: User, companyIds: Identifier[]): Promise<User> {
    companyIds.forEach(companyId => {
      user.companyIds.push(companyId);
    })
    return await this.save(user);
  }

  public async unassignCompanies(user: User, companyIds: Identifier[]): Promise<User> {
    return await this.repository.updateById( user.id, {
      $pullAll: {
        companyIds: companyIds.map(id => id.toString())
      }
    }) as User;
  }

  public async assignCompaniesToUsersWithRoles(roles: Identifier[], companyIds: Identifier[]): Promise<void> {
    await this.repository.updateMany({ role: {$in: roles} }, {
      $addToSet: {
        companyIds: {
          $each: companyIds.map(id => id.toString())
        }
      }
    });
  }
}