import { ErrorDto } from 'infrastructure/controllers/dtos/error-dto';
import { Transaction } from 'domain/transaction';
import {
    TransactionPresenter,
    TransactionResponseDto,
} from 'infrastructure/controllers/presenters/_common/transaction-presenter';

export class CreateTransactionPresenter {
    static present(transaction: Transaction): CreateTransactionResponseDto {
        return {
            success: true,
            transaction: TransactionPresenter.present(transaction),
        };
    }
}

export type CreateTransactionResponseDto =
    | {
          success: boolean;
          transaction: TransactionResponseDto;
      }
    | ErrorDto;