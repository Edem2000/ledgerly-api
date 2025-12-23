import { IsEnum, IsInt, IsISO8601, IsOptional, IsString, Min } from 'class-validator';
import { TransactionType } from 'domain/transaction/types';
import { PaginatedDto } from 'infrastructure/controllers/dtos/common/paginated-dto';
import { Type } from 'class-transformer';

export class GetCategoryBudgetsQueryDto {
    @IsOptional()
    @IsISO8601()
    from?: string;

    @IsOptional()
    @IsISO8601()
    to?: string;

    @IsOptional()
    @IsString()
    categoryId?: string;

    @IsOptional()
    @IsEnum(TransactionType)
    type?: TransactionType;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit: number = 20;
}
