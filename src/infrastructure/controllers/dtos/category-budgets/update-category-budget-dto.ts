import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Currency } from 'domain/transaction';

export class UpdateCategoryBudgetDto {
    @IsOptional()
    @IsInt()
    @Min(0)
    plannedAmount?: number | null;

    @IsOptional()
    @IsInt()
    @Min(0)
    limitAmount?: number | null;

    @IsOptional()
    @IsEnum(Currency)
    currency?: Currency;

    @IsOptional()
    @IsString()
    note?: string;
}
