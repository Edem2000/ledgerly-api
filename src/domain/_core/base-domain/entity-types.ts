const EntityType = ['user', 'category', 'transaction', 'categoryBudget', 'role', 'auditLog'] as const;
export type EntityType = (typeof EntityType)[number];
