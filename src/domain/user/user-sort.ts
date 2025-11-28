export const UserSortField = {
  Id: '_id',
  Name: 'name',
  Email: 'email',
  Phone: 'phone',
} as const;

export const UserSortFields = Object.values(UserSortField);

export type UserSortField = typeof UserSortField[keyof typeof UserSortField];