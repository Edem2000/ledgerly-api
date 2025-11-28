import { BaseEntity, BaseModel, MultiLanguage } from 'domain/_core';
import { User } from 'domain/user';

export interface RoleModel extends BaseModel {
  name: MultiLanguage;
  alias: RoleAlias,
}

export class Role extends BaseEntity<RoleModel> {
  public get name(): MultiLanguage {
    return this.model.name;
  }

  public set name(value: MultiLanguage){
    this.model.name = value;
  }

  public get alias(): RoleAlias {
    return this.model.alias;
  }

  public set alias(value: RoleAlias){
    this.model.alias = value;
  }
}

export const RoleAlias = {
  User: 'user',
  SuperAdmin: 'superadmin',
  Admin: 'admin',
  Operator: 'operator'
} as const;

export type RoleAlias = typeof RoleAlias[keyof typeof RoleAlias];




