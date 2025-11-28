import { CurrentUser } from 'domain/_utils/auth/types';
import { HexString } from 'domain/_core';

export interface CurrentUserCacheRepository {
  get(userId: HexString): CurrentUser | undefined
  set(ctx: CurrentUser, ttlSeconds?: number): void;
  delete(userId: HexString): void;
}