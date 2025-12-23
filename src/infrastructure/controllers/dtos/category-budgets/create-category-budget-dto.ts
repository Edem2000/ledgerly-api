import { IsEnum, IsInt, IsMongoId, IsOptional, IsString, Max, Min } from 'class-validator';
import { Currency } from 'domain/transaction';

export class CreateCategoryBudgetDto {
    @IsString()
    @IsMongoId()
    categoryId: string;

    @IsInt()
    @Min(1970)
    @Max(3000)
    year: number;

    @IsInt()
    @Min(1)
    @Max(12)
    month: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    plannedAmount?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    limitAmount?: number;

    @IsOptional()
    @IsEnum(Currency)
    currency?: Currency;

    @IsOptional()
    @IsString()
    note?: string;
}
