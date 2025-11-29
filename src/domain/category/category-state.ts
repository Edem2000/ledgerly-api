export const CategoryStatus = {
  Active: "active",
  Inactive: "inactive",
  Deleted: "deleted",
} as const;

export const CategoryStatuses = Object.values(CategoryStatus);

export type CategoryStatus = typeof CategoryStatus[keyof typeof CategoryStatus];