import { asUniqueArray, generateSymbols } from 'domain/utils/type-helpers';

export const Symbols = generateSymbols({
    infrastructure: {
        db: asUniqueArray(['main', 'idGenerator'] as const),
        common: asUniqueArray(['logger', 'localization', 'customDate'] as const),
        storage: asUniqueArray(['asyncStorage'] as const),
        kafka: asUniqueArray(['kafkaProducer', 'kafkaClient', 'keyGenerator'] as const),
        jwt: asUniqueArray(['jwtService', 'jwtStrategy'] as const),
        utils: asUniqueArray(['hasher', 'slug', 'translate'] as const),
        providers: asUniqueArray(['currentUser'] as const),
    },
    domain: {
        user: asUniqueArray(['userRepository', 'userService'] as const),
        currentUser: asUniqueArray(['currentUserRepository', 'currentUserService'] as const),
        role: asUniqueArray(['roleRepository', 'roleService'] as const),
        category: asUniqueArray(['categoryRepository', 'categoryService'] as const),
        transaction: asUniqueArray(['repository', 'service'] as const),
        product: asUniqueArray(['productRepository', 'productService'] as const),
        upload: asUniqueArray(['uploadRepository', 'uploadService'] as const),
        stats: asUniqueArray(['statsService'] as const),
        auditLog: asUniqueArray(['auditLogRepository', 'auditLogService', 'logEnricherService'] as const),
        reference: {
            cisType: asUniqueArray(['repository'] as const),
            countryCode: asUniqueArray(['repository'] as const),
            productGroup: asUniqueArray(['repository'] as const),
            releaseMethodType: asUniqueArray(['repository'] as const),
            serialNumberType: asUniqueArray(['repository'] as const),
            service: asUniqueArray(['service'] as const),
        },
    },
    usecases: {
        users: asUniqueArray([
            'login',
            'getMe',
            'createUser',
            'get',
            'getOne',
            'deleteUser',
            'updateUser',
            'assignCompany',
            'unassignCompany',
            'search',
            'changePassword',
        ] as const),
        categories: asUniqueArray(['create', 'get', 'getOne', 'delete', 'update', 'search'] as const),
        transactions: asUniqueArray(['create', 'get', 'getOne', 'delete', 'update', 'search'] as const),
        products: asUniqueArray(['create', 'get', 'getOne', 'delete', 'update', 'search'] as const),
        uploads: asUniqueArray(['create', 'get', 'getOne', 'delete'] as const),
        auditLogs: asUniqueArray(['get', 'getOne'] as const),
        reference: asUniqueArray(['getByType'] as const),
    },
    externalDomain: {},
} as const);

export const CollectionNames = {
    users: 'users',
    categories: 'categories',
    transactions: 'transactions',
    stateHistory: 'state_history',
    auditLogs: 'audit_logs',
};
