import { IsString } from 'class-validator';
import { HexString } from 'domain/_core';
import { IsObjectId } from 'infrastructure/controllers/dtos/common/isObjectId';

export class DeleteCategoryDto {
    @IsString()
    @IsObjectId()
    id: HexString;
}
