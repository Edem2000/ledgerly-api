import { User } from 'domain/user/user';
import { Role } from 'domain/role/role';
import { HexString } from 'domain/_core';

export class UserPresenter {
  public static present(user: User, role?: Role): UserResponseDto {
    return {
      id: user.id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      status: user.status,
      companyIds: user.companyIds.map(companyId => companyId.toString()),
      role: role ? {
        id: role.id.toString(),
        name: role.name,
        alias: role.alias,
      } : undefined,
      language: user.language,
      lastLoggedInAt: user.lastLoggedInAt || null,
    };
  }
}

export type UserResponseDto = {
  id: HexString,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  status: string,
  companyIds: HexString[],
  role?: {
    id: HexString,
    name: {
      ru: string,
      uz: string,
      en: string,
    },
    alias: string,
  },
  language: string,
  lastLoggedInAt: Date | null,
};