import { IsInt, Max, Min } from 'class-validator';

export class GetCategoryBudgetsQueryDto {
    @IsInt()
    @Min(1970)
    @Max(3000)
    year: number;

    @IsInt()
    @Min(1)
    @Max(12)
    month: number;
}
