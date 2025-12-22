import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Symbols } from 'di/common';
import { JwtService } from 'domain/_utils/auth/types';
import { IS_PUBLIC_KEY } from 'infrastructure/services/decorators/public';
import { randomUUID } from 'crypto';
import { Context } from 'domain/_core';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        @Inject(Symbols.infrastructure.jwt.jwtService)
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        const request = context.switchToHttp().getRequest();
        request.context = this.gatherContext(request);

        if (isPublic) return true;

        const authHeader = request.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('No token provided');
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = this.jwtService.verifyToken(token);

            request.user = decoded;
            request.context.correlationId = token;

            return true;
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }

    private gatherContext(request: { ip: string; headers: Record<string, string> }, token?: string): Context {
        return {
            ip: request.ip,
            requestId: request.headers['x-request-id'] ?? randomUUID(),
            userAgent: request.headers['user-agent'] || 'unknown',
            correlationId: token || '',
        };
    }
}
