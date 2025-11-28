import { BaseService, Identifier } from 'domain/_core';
import { Role, RoleAlias } from 'domain/role/role';
import { RoleRepository } from 'domain/role/repository/repository';

export interface RoleService {
  findByAlias(alias: string): Promise<Role | null>;
  findById(id: Identifier): Promise<Role | null>;
  getAll(): Promise<Role[]>;
  getTopRoles(): Promise<Role[]>;
  isTopRole(roleAlias: RoleAlias): Promise<boolean>;
}

export class RoleServiceImpl extends BaseService implements RoleService {
  constructor(
    private repository: RoleRepository,
  ) {
    super('role');
  }

  public async findByAlias(alias: string): Promise<Role | null> {
    return await this.repository.findByAlias(alias);
  }

  public async findById(id: Identifier): Promise<Role | null> {
    return await this.repository.findById(id);
  }

  public async getAll(): Promise<Role[]> {
    return await this.repository.getAll();
  }

  public async getTopRoles(): Promise<Role[]> {
    return await this.repository.getTopRoles();
  }

  public async isTopRole(roleAlias: RoleAlias): Promise<boolean> {
    const topRoles = await this.getTopRoles();
    const role = topRoles.find(role => role.alias === roleAlias);
    return !!role;
  }

}