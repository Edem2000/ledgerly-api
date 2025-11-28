
import { User } from 'domain/user';
import { Identifier } from 'domain/_core';
import { CurrentUser } from 'domain/_utils/auth/types';

// export function isOperator(user: User) {
//   return user.role === RoleAlias.Operator;
// }

export function userHasAccessToCompany(user: User | CurrentUser, companyId: Identifier): boolean {
  const ids = user.companyIds;
  return ids.some((id) => id.toString() === companyId.toString());
}

