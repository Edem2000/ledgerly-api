import { PaginatedDto } from 'infrastructure/controllers/dtos/common/paginated-dto';
import { IsString } from 'class-validator';

export class SearchUsersDto extends PaginatedDto {
    @IsString()
    query: string;
}
