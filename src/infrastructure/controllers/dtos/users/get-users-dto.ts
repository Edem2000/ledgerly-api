import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { UserStatus } from 'domain/user/user-state';
import { PaginatedDto } from 'infrastructure/controllers/dtos/common/paginated-dto';
import { UserSortField, UserSortFields } from 'domain/user/user-sort';

export class GetUsersDto extends PaginatedDto{
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @IsOptional()
  @IsIn(UserSortFields)
  sortBy?: UserSortField = '_id';
}
