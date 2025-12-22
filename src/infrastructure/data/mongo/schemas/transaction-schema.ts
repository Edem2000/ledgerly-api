import { Types } from 'mongoose';
import { BaseSchema } from 'data/mongo/schemas/base-schema';
import { CollectionNames } from 'di/common';
import { identifierToObjectId, objectIdToIdentifier } from 'data';
import { Identifier } from 'domain/_core';
import { TransactionModel } from 'domain/transaction';
import { TransactionType } from 'domain/transaction/types';

export const TransactionSchema: BaseSchema<TransactionModel> = new BaseSchema(
    {
        title: {
            type: String,
            trim: true,
        },

        note: {
            type: String,
            trim: true,
        },

        amount: {
            type: Number,
            required: true,
        },

        currency: {
            type: String,
            required: true,
            uppercase: true,
            trim: true,
        },

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

        type: {
            type: String,
            required: true,
            enum: TransactionType,
        },

        occurredAt: {
            type: Date,
            required: true,
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
    {
        timestamps: true,
        collection: CollectionNames.transactions,
    },
);

TransactionSchema.index({ userId: 1, categoryId: 1 });
