import { IsString } from 'class-validator';
import { IsObjectId } from 'infrastructure/controllers/dtos/common/isObjectId';
import { HexString } from 'domain/_core';

export class DeleteUserDto {
    @IsString()
    @IsObjectId()
    id: HexString;
}
