import { UserRepository } from 'domain/user/repository/repository';
import { User, UserModel } from 'domain/user/user';
import { EntityModel, MongooseRepository, SortQuery } from 'data';
import { GetUsersResult, UserFilterQuery, UserSortQuery } from 'domain/user/service/types';
import { Identifier } from 'domain/_core';

export class UserRepositoryImpl extends MongooseRepository<UserModel, User> implements UserRepository {
  constructor(private readonly entityModel: EntityModel<UserModel>) {
    super(entityModel, User);
  }

  public async findByEmail(email: string): Promise<User | null>{
    return await this.findOne({email});
  }

  public async findById(id: Identifier): Promise<User | null> {
    return await this.findOne({ _id: id, deleted: false });
  }

  public async getUsers(filter: UserFilterQuery, sort: UserSortQuery, limit: number, skip: number): Promise<GetUsersResult> {
    let sortCasted = sort as SortQuery<UserModel>;
    if (sort['name']) {
      sortCasted = { "name.first": sort['name'], "name.last": sort['name'] };
    }
    let users: User[] = [];
    let total: number = 0;
    await this.transactionalOperation(async () => {
      users = await this.find({ ...filter, deleted: false }, {limit, skip, sort: sortCasted });
      total = await this.getByQueryCount({ ...filter, deleted: false });
    });
    return { users, total };
  }

  public async searchByFields(query: string, limit: number = 10, skip: number = 0): Promise<GetUsersResult> {
    let users: User[] = [];
    let total: number = 0;

    const filter = {
      deleted: false,
      $or: [
        { "name.first": { $regex: query, $options: "i" } },
        { "name.last": { $regex: query, $options: "i" } },
        { phone: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ]
    };

    await this.transactionalOperation(async () => {
      users = await this.getByQuery(filter, skip, limit);
      total = await this.getByQueryCount(filter);
    });
    return { users, total };
  }
}