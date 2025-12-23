import { Types } from 'mongoose';
import { CategoryBudgetModel, CategoryBudgetStatus, CategoryBudgetStatuses } from 'domain/category-budget';
import { BaseSchema } from 'data/mongo/schemas/base-schema';
import { identifierToObjectId, objectIdToIdentifier } from 'data/mongo';
import { Identifier } from 'domain/_core';
import { CollectionNames } from 'di/common';

export const CategoryBudgetSchema: BaseSchema<CategoryBudgetModel> = new BaseSchema(
    {
        userId: {
            type: Types.ObjectId,
            get: objectIdToIdentifier as (value: any) => Identifier,
            set: identifierToObjectId,
            required: true,
        },

        categoryId: {
            type: Types.ObjectId,
            get: objectIdToIdentifier as (value: any) => Identifier,
            set: identifierToObjectId,
            required: true,
        },

        period: {
            year: {
                type: Number,
                required: true,
                min: 1970,
                max: 3000,
            },
            month: {
                type: Number,
                required: true,
                min: 1,
                max: 12,
            },
            _id: false,
        },

        plannedAmount: {
            type: Number,
            min: 0,
        },

        limitAmount: {
            type: Number,
            min: 0,
        },

        currency: {
            type: String,
            required: true,
            uppercase: true,
            trim: true,
            default: 'UZS',
        },

        note: {
            type: String,
            trim: true,
        },

        status: {
            type: String,
            required: true,
            enum: CategoryBudgetStatuses,
            default: CategoryBudgetStatus.active,
        },

        deleted: {
            type: Boolean,
            required: true,
            default: false,
        },

        deletedAt: {
            type: Date,
        },
    },
    { timestamps: true, collection: CollectionNames.categoryBudgets },
);


CategoryBudgetSchema.index(
    { userId: 1, categoryId: 1, 'period.year': 1, 'period.month': 1 },
    { unique: true },
);

CategoryBudgetSchema.index({ userId: 1, 'period.year': 1, 'period.month': 1, deleted: 1 });

CategoryBudgetSchema.index({ categoryId: 1 });
