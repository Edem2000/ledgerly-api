import { Inject, Injectable, Scope } from '@nestjs/common';
import { Request } from 'express';
import { CurrentUser, TokenPayload } from 'domain/_utils/auth/types';
import { GetMeUsecase } from 'usecases/auth/get-me-usecase';
import { InvalidCredentialsError } from 'domain/utils/errors';
import { REQUEST } from '@nestjs/core';
import { Symbols } from 'di/common';
import { Context } from 'domain/_core';

@Injectable({ scope: Scope.REQUEST })
export class CurrentUserProvider {
    constructor(
        @Inject(Symbols.usecases.users.getMe) private readonly getMeUsecase: GetMeUsecase,
        @Inject(REQUEST) private readonly request: Request,
    ) {}

    async get(): Promise<CurrentUser> {
        const payload = this.request.user as TokenPayload;
        if (!payload) throw new InvalidCredentialsError();

        return await this.getMeUsecase.execute(payload);
    }

    getContext(): Context {
        // @ts-ignore
        return this.request.context as Context;
    }
}
