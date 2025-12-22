import { SetMetadata } from '@nestjs/common';
import { RoleAlias } from 'domain/role/role';

export const EXCLUDED_ROLES_KEY = 'excludedRoles';
export const ExcludeRoles = (...roles: RoleAlias[]) => SetMetadata(EXCLUDED_ROLES_KEY, roles);
