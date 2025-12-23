import { IsString } from 'class-validator';

export class SuggestCategoryDto {
    @IsString()
    title: string;
}
