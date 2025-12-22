import { JwtService as NestJwtService } from '@nestjs/jwt';
import { config, JwtConfig } from 'infrastructure/config/config';
import { Injectable } from '@nestjs/common';
import { JwtService, TokenPayload, TokensObject } from 'domain/_utils/auth/types';

@Injectable()
export class JwtServiceImpl implements JwtService {
    private readonly jwtConfig: JwtConfig;

    constructor(private readonly jwtService: NestJwtService) {
        this.jwtConfig = config.jwt;
    }

    public getTokens(payload: TokenPayload): TokensObject {
        return {
            accessToken: this.generateAccessToken(payload),
            refreshToken: this.generateRefreshToken(payload),
        };
    }

    public generateAccessToken(payload: TokenPayload): string {
        return this.jwtService.sign(payload, {
            secret: this.jwtConfig.secret,
            expiresIn: this.jwtConfig.accessTtl,
        });
    }

    public generateRefreshToken(payload: TokenPayload): string {
        return this.jwtService.sign(payload, {
            secret: this.jwtConfig.secret,
            expiresIn: this.jwtConfig.refreshTtl,
        });
    }

    public verifyToken(token: string) {
        return this.jwtService.verify(token, { secret: this.jwtConfig.secret });
    }
}
