import { Module } from '@nestjs/common';
import { JwtModule, JwtService as NestJwtService } from '@nestjs/jwt';
import { Symbols } from 'di/common';
import { config } from 'infrastructure/config/config';
import { JwtStrategyImpl } from 'infrastructure/services/jwt/jwt-strategy';
import { JwtServiceImpl } from 'infrastructure/services/jwt/jwt-service';
import { JwtService } from 'domain/_utils/auth/types';

@Module({
    imports: [
        JwtModule.register({
            secret: config.jwt.secret,
            signOptions: { expiresIn: config.jwt.accessTtl },
        }),
    ],
    providers: [
        {
            provide: Symbols.infrastructure.jwt.jwtStrategy,
            useFactory(): JwtStrategyImpl {
                return new JwtStrategyImpl(config.jwt);
            },
        },
        {
            provide: Symbols.infrastructure.jwt.jwtService,
            useFactory(nestJwtService: NestJwtService): JwtService {
                return new JwtServiceImpl(nestJwtService);
            },
            inject: [NestJwtService],
        },
    ],
    exports: [Symbols.infrastructure.jwt.jwtService],
})
export class AuthModule {}
