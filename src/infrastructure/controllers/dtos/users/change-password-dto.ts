import { IsString, MinLength } from 'class-validator';
import { IsObjectId } from 'infrastructure/controllers/dtos/common/isObjectId';
import { HexString } from 'domain/_core';

export class ChangePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(8)
  newPassword: string;

  @IsString()
  @MinLength(8)
  newPasswordConfirmation: string;
}

export class ChangePasswordQueryDto {
  @IsString()
  @IsObjectId()
  id: HexString;
}