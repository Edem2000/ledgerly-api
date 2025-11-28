export const UserStatus = {
  Active: "active",
  Inactive: "inactive",
  Deleted: "deleted",
} as const;

export const UserStatuses = Object.values(UserStatus);

export type UserStatus = typeof UserStatus[keyof typeof UserStatus];