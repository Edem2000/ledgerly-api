import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { CategoryBudgetStatus } from 'domain/category-budget';
import { Currency } from 'domain/transaction';

export class CreateCategoryBudgetDto {
    @IsString()
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
    @IsString()
    @IsEnum(CategoryBudgetStatus)
    currency?: Currency;

    @IsOptional()
    @IsString()
    note?: string;

    @IsOptional()
    @IsEnum(CategoryBudgetStatus)
    status?: CategoryBudgetStatus;
}