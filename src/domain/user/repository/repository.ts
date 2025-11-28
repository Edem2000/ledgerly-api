import { User, UserModel } from 'domain/user/user';
import { GetUsersResult, UserFilterQuery, UserSortQuery } from 'domain/user/service/types';
import { Identifier } from 'domain/_core';
import { FilterQuery, UpdateQuery } from 'mongoose';

export interface UserRepository {
  create(user: User): Promise<User>;
  save(entity: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: Identifier): Promise<User | null>;
  getUsers(filter: UserFilterQuery, sort: UserSortQuery, limit: number, skip: number): Promise<GetUsersResult>;
  searchByFields(query: string, limit?: number, skip?: number): Promise<GetUsersResult>;
  updateById(id: Identifier, update: UpdateQuery<User>,): Promise<User | null>;
  updateOne(filter: FilterQuery<User>, update: UpdateQuery<User>): Promise<User | null>;
  updateMany(filter: FilterQuery<User>, update: UpdateQuery<User>): Promise<User[]>;
}
