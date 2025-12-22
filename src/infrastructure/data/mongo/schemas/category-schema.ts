import { CategoryModel } from 'domain/category/category';
import { Types } from 'mongoose';
import { BaseSchema } from 'data/mongo/schemas/base-schema';
import { CollectionNames } from 'di/common';
import { CategoryStatuses } from 'domain/category/category-state';
import { identifierToObjectId, objectIdToIdentifier } from 'data';
import { Identifier } from 'domain/_core';

export const CategorySchema: BaseSchema<CategoryModel> = new BaseSchema(
    {
        title: {
            ru: {
                type: String,
                required: true,
                trim: true,
            },
            uz: {
                type: String,
                required: true,
                trim: true,
            },
            en: {
                type: String,
                required: true,
                trim: true,
            },
            _id: false,
        },
        alias: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        color: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        icon: {
            type: String,
            lowercase: true,
            trim: true,
        },
        userId: {
            type: Types.ObjectId,
            get: objectIdToIdentifier as (value: any) => Identifier,
            set: identifierToObjectId,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: CategoryStatuses,
        },
        deleted: {
            type: Boolean,
            required: true,
        },
        deletedAt: {
            type: Date,
        },
    },
    { timestamps: true, collection: CollectionNames.categories },
);

CategorySchema.index({ userId: 1, title: 1 }, { unique: true });
CategorySchema.index({ userId: 1, alias: 1 }, { unique: true });
