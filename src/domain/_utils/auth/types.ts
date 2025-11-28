import { RoleAlias } from 'domain/role/role';
import { HexString } from 'domain/_core';
import { UserModel } from 'domain/user';

export type CurrentUser = Pick<UserModel, 'name' | 'email' | 'companyIds' | 'phone' | 'language'> & {
  id: HexString,
  roleId: HexString,
  roleAlias: RoleAlias,
};

export type TokenPayload = CurrentUser;

export type TokensObject = {
  accessToken: string;
  refreshToken: string;
};

export interface JwtService {
  getTokens(payload: TokenPayload): TokensObject;
  generateAccessToken(payload: TokenPayload): string;
  generateRefreshToken(payload: TokenPayload): string;
  verifyToken(token: string): string;
}

export interface Hasher{
  hashPassword(password: string): string;
  comparePasswords(input: string, hashed: string): boolean;
}