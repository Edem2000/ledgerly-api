import { IsMongoId, IsString } from 'class-validator';
import { HexString } from 'domain/_core';

export class UnassignCompanyFromUserDto {
    @IsString()
    @IsMongoId()
    companyId: HexString;
}
