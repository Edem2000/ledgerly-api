import { RoleRepository } from 'domain/role/repository/repository';
import { Role, RoleAlias, RoleModel } from 'domain/role/role';
import { EntityId, Identifier } from 'domain/_core';

export class RoleRepositoryImpl implements RoleRepository {
  private aliasBasedMap: Map<RoleAlias, Role> | null = null;
  private idBasedMap: Map<string, Role> | null = null;
  constructor(private readonly collection: RolesCollection) {}

  public async getAll(): Promise<Role[]>{
    return Array.from(this.getAliasBasedMap().values());
  }

  public async getTopRoles(): Promise<Role[]>{
    return [ await this.findByAlias(RoleAlias.SuperAdmin),  await this.findByAlias(RoleAlias.Admin)! ].filter(item => item !== null);
  }

  public async findByAlias(alias: RoleAlias): Promise<Role | null>{
    const data = this.getAliasBasedMap();
    if(data && data.has(alias)){
      return new Role(data.get(alias));
    }
    return null;
  }

  public async findById(id: Identifier): Promise<Role | null>{
    const data = this.getIdBasedMap();
    const stringId = id.toString();
    if(data && data.has(stringId)){
      return data.get(stringId)!;
    }
    return null;
  }

  private getData(): Role[] {
    return this.collection.data();
  }

  private getAliasBasedMap() {
    if(!this.aliasBasedMap){
      const prepared: [RoleAlias, Role][] = this.getData().map(item => [item.alias, item]);
      this.aliasBasedMap = new Map<RoleAlias, Role>(prepared)
    }
    return this.aliasBasedMap;
  }

  private getIdBasedMap() {
    if(!this.idBasedMap){
      const prepared: [string, Role][] = this.getData().map(item => [item.id!.toString(), item]);
      this.idBasedMap = new Map<string, Role>(prepared)
    }
    return this.idBasedMap;
  }
}

export class RolesCollection {
  public data(): Role[] {
    return [
      new Role({
        id: new EntityId('680aa6d4588a0511ca60a3ef'),
        name: {
          ru: 'Суперадмин',
          uz: 'Superadmin',
          en: 'Superadmin',
        },
        alias: RoleAlias.SuperAdmin,
      }),
      new Role({
        id: new EntityId('683f6e97f94267f09a6c695a'),
        name: {
          ru: 'Администратор',
          uz: 'Администратор',
          en: 'Administrator',
        },
        alias: RoleAlias.Admin,
      }),
      new Role({
        id: new EntityId('683f6eb5fa3791ce4c979c9d'),
        name: {
          ru: 'Оператор',
          uz: 'Оператор',
          en: 'Operator',
        },
        alias: RoleAlias.Operator,
      }),
    ];
  }
}

