import { SetMetadata } from '@nestjs/common';
import { RoleAlias } from 'domain/role/role';

export const ROLES_KEY = 'roles';
export const AllowRoles = (...roles: RoleAlias[]) => SetMetadata(ROLES_KEY, roles);
