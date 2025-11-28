import { Role } from 'domain/role/role';
import { Identifier } from 'domain/_core';

export interface RoleRepository {
  findByAlias(alias: string): Promise<Role | null>;
  findById(id: Identifier): Promise<Role | null>;
  getAll(): Promise<Role[]>;
  getTopRoles(): Promise<Role[]>;
}