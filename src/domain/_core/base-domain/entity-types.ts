const EntityType = [
    'user',
    'category',
    'role',
    'auditLog',
] as const;
export type EntityType = (typeof EntityType)[number];
