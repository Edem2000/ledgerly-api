const EntityType = [
    'user',
    'category',
    'transaction',
    'role',
    'auditLog',
] as const;
export type EntityType = (typeof EntityType)[number];
