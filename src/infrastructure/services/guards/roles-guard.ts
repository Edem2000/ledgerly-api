import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleAlias } from 'domain/role/role';
import { ROLES_KEY } from 'infrastructure/services/decorators/roles';
import { EXCLUDED_ROLES_KEY } from 'infrastructure/services/decorators/exclude-roles';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<RoleAlias[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        const excludedRoles = this.reflector.getAllAndOverride<RoleAlias[]>(EXCLUDED_ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        const { user } = context.switchToHttp().getRequest();

        // Check if user role is excluded
        if (excludedRoles?.length && excludedRoles.includes(user.roleAlias)) {
            throw new ForbiddenException('Access denied for your role');
        }

        // Check if user role is allowed
        if (requiredRoles?.length && !requiredRoles.includes(user.roleAlias)) {
            throw new ForbiddenException('Access denied for your role');
        }

        return true;
    }
}
