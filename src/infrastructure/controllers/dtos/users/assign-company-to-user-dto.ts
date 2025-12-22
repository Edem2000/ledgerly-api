import { IsMongoId, IsString } from 'class-validator';
import { HexString } from 'domain/_core';

export class AssignCompanyToUserDto {
    @IsString()
    @IsMongoId()
    companyId: HexString;
}
