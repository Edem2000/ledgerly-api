import { IsInt, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetCategoryBudgetsQueryDto {
    @Type(() => Number)
    @IsInt()
    @Min(1970)
    @Max(3000)
    year: number;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(12)
    month: number;
}
