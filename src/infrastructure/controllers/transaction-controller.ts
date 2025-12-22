import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Param,
    Post,
    Query,
    UseGuards,
    UsePipes,
} from '@nestjs/common';
import { Symbols } from 'di/common';
import { getExceptionByError } from 'infrastructure/controllers/exceptions/exceptions';
import { EntityId } from 'domain/_core';
import { JwtAuthGuard } from 'infrastructure/services/guards/auth-guard';
import { RolesGuard } from 'infrastructure/services/guards/roles-guard';
import { CurrentUserProvider } from 'infrastructure/utils/current-user-provider';
import { CreateTransactionUsecase } from 'usecases/transactions/create-transaction-usecase';
import { RoleAlias } from 'domain/role/role';
import { AllowRoles } from 'infrastructure/services/decorators/roles';
import { CreateTransactionDto } from 'infrastructure/controllers/dtos/transactions/create-transaction-dto';
import {
    CreateTransactionPresenter,
    CreateTransactionResponseDto,
} from 'infrastructure/controllers/presenters/transactions/create-presenter';
import { GetTransactionsUsecase } from 'usecases/transactions/get-transactions-usecase';
import { DeleteTransactionUsecase } from 'usecases/transactions/delete-transaction-usecase';
import { Public } from 'infrastructure/services/decorators/public';
import { PaginationPipe } from 'infrastructure/controllers/pipes/pagination-pipe';
import { GetTransactionsQueryDto } from 'infrastructure/controllers/dtos/transactions/get-transactions-dto';
import { DeleteTransactionDto } from 'infrastructure/controllers/dtos/transactions/delete-transaction-dto';
import {
    GetTransactionsPresenter,
    GetTransactionsResponseDto,
} from 'infrastructure/controllers/presenters/transactions/get-presenter';
import {
    DeleteTransactionPresenter,
    DeleteTransactionResponseDto,
} from 'infrastructure/controllers/presenters/transactions/delete-presenter';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('transactions')
export class TransactionController {
    constructor(
        @Inject(Symbols.usecases.transactions.create)
        private readonly createTransactionUsecase: CreateTransactionUsecase,
        @Inject(Symbols.usecases.transactions.get)
        private readonly getTransactionsUsecase: GetTransactionsUsecase,
        @Inject(Symbols.usecases.transactions.delete)
        private readonly deleteTransactionUsecase: DeleteTransactionUsecase,

        @Inject(Symbols.infrastructure.providers.currentUser)
        private readonly currentUser: CurrentUserProvider,
    ) {}

    @Post('/')
    @AllowRoles(RoleAlias.User)
    public async create(@Body() params: CreateTransactionDto): Promise<CreateTransactionResponseDto> {
        try {
            const currentUser = await this.currentUser.get();
            const context = this.currentUser.getContext();

            const { transaction } = await this.createTransactionUsecase.execute(
                {
                    categoryId: new EntityId(params.categoryId),
                    title: params.title,
                    type: params.type,
                    amount: params.amount,
                    currency: params.currency,
                    occurredAt: params.occurredAt ? new Date(params.occurredAt) : undefined,
                    note: params.note,
                },
                currentUser,
                context,
            );

            return CreateTransactionPresenter.present(transaction);
        } catch (error) {
            throw getExceptionByError(error);
        }
    }

    @HttpCode(HttpStatus.OK)
    @Get()
    @AllowRoles(RoleAlias.User)
    @UsePipes(PaginationPipe)
    public async get(@Query() query: GetTransactionsQueryDto): Promise<GetTransactionsResponseDto> {
        try {
            const currentUser = await this.currentUser.get();
            const context = this.currentUser.getContext();
            const { from, to, categoryId, type } = query;

            const params = {
                page: query.page,
                limit: query.limit,
                from: from ? new Date(from) : undefined,
                to: to ? new Date(to) : undefined,
                categoryId: categoryId ? new EntityId(categoryId) : undefined,
                type: type,
            };

            const { transactions, page, limit, total } = await this.getTransactionsUsecase.execute(
                params,
                currentUser,
                context,
            );

            return GetTransactionsPresenter.present(transactions, page, limit, total);
        } catch (error) {
            throw getExceptionByError(error);
        }
    }

    @HttpCode(HttpStatus.OK)
    @Delete(':id')
    @AllowRoles(RoleAlias.User)
    public async delete(@Param() params: DeleteTransactionDto): Promise<DeleteTransactionResponseDto> {
        try {
            const currentUser = await this.currentUser.get();
            const context = this.currentUser.getContext();
            const id = new EntityId(params.id);

            await this.deleteTransactionUsecase.execute({ id }, currentUser, context);

            return DeleteTransactionPresenter.present();
        } catch (error) {
            throw getExceptionByError(error);
        }
    }
}
