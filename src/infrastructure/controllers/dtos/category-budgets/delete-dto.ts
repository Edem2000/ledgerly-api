import { IsString } from 'class-validator';
import { IsObjectId } from 'infrastructure/controllers/dtos/common/isObjectId';
import { HexString } from 'domain/_core';

export class DeleteCategoryBudgetDto {
    @IsString()
    @IsObjectId()
    id: HexString;
}
