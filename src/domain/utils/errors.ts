import { MultiLanguage } from 'domain/_core';
import { HttpStatus } from '@nestjs/common';

export class CustomError extends Error {
    httpCode: number;
    errorCode: number;
    errorMessage: MultiLanguage;
    constructor(message: MultiLanguage, code: number, httpCode: number = 400) {
        super();
        this.httpCode = httpCode;
        this.errorCode = code;
        this.errorMessage = message;
    }
}

export class UserNotFoundError extends CustomError {
    constructor() {
        super(
            {
                ru: 'Пользователь не найден',
                uz: 'Пользователь не найден',
                en: 'User not found',
            },
            10000,
            HttpStatus.NOT_FOUND,
        );
    }
}

export class RoleNotFoundError extends CustomError {
    constructor() {
        super(
            {
                ru: 'Роль не найдена',
                uz: 'Роль не найдена',
                en: 'Role not found',
            },
            10001,
            HttpStatus.UNAUTHORIZED,
        );
    }
}

export class InvalidCredentialsError extends CustomError {
    constructor() {
        super(
            {
                ru: 'Неверные данные',
                uz: 'Неверные данные',
                en: 'Invalid credentials',
            },
            10002,
            HttpStatus.UNAUTHORIZED,
        );
    }
}

export class CategoryAlreadyExistsError extends CustomError {
    constructor() {
        super(
            {
                ru: 'Категория уже существует',
                uz: 'Категория уже существует',
                en: 'Category already exists',
            },
            10003,
            HttpStatus.BAD_REQUEST,
        );
    }
}

export class CategoryNotFoundError extends CustomError {
    constructor() {
        super(
            {
                ru: 'Категория не найдена',
                uz: 'Категория не найдена',
                en: 'Category not found',
            },
            10010,
            HttpStatus.NOT_FOUND,
        );
    }
}

export class CategoryBudgetAlreadyExistsError extends CustomError {
    constructor() {
        super(
            {
                ru: 'Бюджет категории уже существует',
                uz: 'Бюджет категории уже существует',
                en: 'Category budget already exists',
            },
            10011,
            HttpStatus.CONFLICT,
        );
    }
}

export class CategoryBudgetAmountRequiredError extends CustomError {
    constructor() {
        super(
            {
                ru: 'Укажите план или лимит',
                uz: 'План ёки лимитни кўрсатинг',
                en: 'Provide planned or limit amount',
            },
            10012,
            HttpStatus.BAD_REQUEST,
        );
    }
}

export class ProductExistsError extends CustomError {
    constructor() {
        super(
            {
                ru: 'Продукт с данным GTIN уже существует',
                uz: 'Продукт с данным GTIN уже существует',
                en: 'Product with defined GTIN code already exists',
            },
            10004,
            HttpStatus.UNPROCESSABLE_ENTITY,
        );
    }
}

export class ProductNotFoundError extends CustomError {
    constructor() {
        super(
            {
                ru: 'Продукт не найден',
                uz: 'Продукт не найден',
                en: 'Product not found',
            },
            10005,
            HttpStatus.NOT_FOUND,
        );
    }
}

export class UserExistsError extends CustomError {
    constructor() {
        super(
            {
                ru: 'Пользователь уже существует',
                uz: 'Пользователь уже существует',
                en: 'User already exists',
            },
            10006,
            HttpStatus.BAD_REQUEST,
        );
    }
}

export class AccessDeniedError extends CustomError {
    constructor() {
        super(
            {
                ru: 'Отказано в доступе',
                uz: 'Отказано в доступе',
                en: 'Access denied',
            },
            10007,
            HttpStatus.FORBIDDEN,
        );
    }
}

export class PasswordDoNotMatchError extends CustomError {
    constructor() {
        super(
            {
                ru: 'Пароли не совпадают',
                uz: 'Пароли не совпадают',
                en: 'Passwords do not match',
            },
            10008,
            HttpStatus.BAD_REQUEST,
        );
    }
}

export class AuditLogNotFoundError extends CustomError {
    constructor() {
        super(
            {
                ru: 'Запись действий не найдена',
                uz: 'Запись действий не найдена',
                en: 'Log Record not found',
            },
            10009,
            HttpStatus.NOT_FOUND,
        );
    }
}
