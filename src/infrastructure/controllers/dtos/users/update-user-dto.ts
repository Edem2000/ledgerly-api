import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { Language } from 'domain/_core';
import { UserStatus } from 'domain/user/user-state';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsPhoneNumber('UZ')
    phone: string;

    @IsOptional()
    @IsEnum(Language)
    language: Language;

    @IsOptional()
    @IsEnum(UserStatus)
    status: UserStatus;
}
