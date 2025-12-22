import { IsEnum, IsISO8601, IsMongoId, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { TransactionType } from 'domain/transaction/types';

export class CreateTransactionDto {
    @IsString()
    @IsMongoId()
    categoryId: string;

    @IsString()
    title: string;

    @IsEnum(TransactionType)
    type: TransactionType;

    @IsNumber()
    @IsPositive()
    amount: number;

    @IsOptional()
    @IsString()
    currency?: string; // по умолчанию UZS

    @IsOptional()
    @IsISO8601()
    occurredAt?: string; // ISO строка с фронта

    @IsOptional()
    @IsString()
    note?: string;
}
