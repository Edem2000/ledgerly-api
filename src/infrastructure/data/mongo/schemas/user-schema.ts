import { UserModel } from 'domain/user/user';
import { Types } from 'mongoose';
import { BaseSchema } from 'data/mongo/schemas/base-schema';
import { CollectionNames } from 'di/common';
import { UserStatuses } from 'domain/user/user-state';
import { identifierToObjectId, objectIdToIdentifier } from 'data';
import { Identifier } from 'domain/_core';

export const UserSchema: BaseSchema<UserModel> = new BaseSchema(
    {
        name: {
            first: {
                type: String,
                required: true,
                trim: true,
            },
            last: {
                type: String,
                required: true,
                trim: true,
            },
            _id: false,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        phone: {
            type: String,
        },
        role: {
            type: Types.ObjectId,
            get: objectIdToIdentifier as (value: any) => Identifier,
            set: identifierToObjectId,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: UserStatuses,
        },
        deleted: {
            type: Boolean,
            required: true,
        },
        deletedAt: {
            type: Date,
        },
        registeredAt: {
            type: Date,
        },
        lastLoggedInAt: {
            type: Date,
        },
        refreshToken: {
            type: String,
        },
    },
    { timestamps: true, collection: CollectionNames.users },
);
