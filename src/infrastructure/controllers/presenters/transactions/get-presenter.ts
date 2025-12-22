import { Transaction } from 'domain/transaction';
import {
    TransactionPresenter,
    TransactionResponseDto,
} from 'infrastructure/controllers/presenters/_common/transaction-presenter';
import { ErrorDto } from 'infrastructure/controllers/dtos/error-dto';
import { PaginatedResponseDto } from 'infrastructure/controllers/presenters/_common/paginated-response-presenter';

export class GetTransactionsPresenter {
    static present(
        transactions: Transaction[],
        page: number,
        limit: number,
        total: number,
    ): GetTransactionsResponseDto {
        return {
            success: true,
            page,
            limit,
            total,
            data: transactions.map((transaction) => {
                return TransactionPresenter.present(transaction);
            }),
        };
    }
}

export type GetTransactionsResponseDto =
    | ({
          success: boolean;
      } & PaginatedResponseDto<TransactionResponseDto>)
    | ErrorDto;
