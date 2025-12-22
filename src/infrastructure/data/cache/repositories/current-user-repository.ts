import { CurrentUserCacheRepository } from 'domain/session';
import NodeCache from 'node-cache';
import { CurrentUser } from 'domain/_utils/auth/types';

export class CurrentUserCacheRepositoryImpl implements CurrentUserCacheRepository {
    private cache: NodeCache;

    constructor(private readonly ttl: number) {
        this.cache = new NodeCache({ stdTTL: this.ttl, checkperiod: 120, useClones: false });
    }

    private key(userId: string) {
        return `userctx:${userId}`;
    }

    get(userId: string): CurrentUser | undefined {
        return this.cache.get<CurrentUser>(this.key(userId));
    }

    set(ctx: CurrentUser, ttlSeconds: number = this.ttl) {
        this.cache.set(this.key(ctx.id), ctx, ttlSeconds);
    }

    delete(userId: string) {
        this.cache.del(this.key(userId));
    }
}
