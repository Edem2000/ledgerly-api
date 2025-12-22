import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtConfig } from 'infrastructure/config/config';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategyImpl extends PassportStrategy(Strategy) {
    constructor(private readonly jwtConfig: JwtConfig) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtConfig.secret,
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub, email: payload.email };
    }
}
