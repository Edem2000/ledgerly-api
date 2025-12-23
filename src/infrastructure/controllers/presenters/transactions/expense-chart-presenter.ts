import { ErrorDto } from 'infrastructure/controllers/dtos/error-dto';
import { ExpenseChartItem } from 'usecases/transactions/get-expense-chart-usecase';

export class ExpenseChartPresenter {
    static present(items: ExpenseChartItem[]): ExpenseChartResponseDto {
        return {
            success: true,
            data: items,
        };
    }
}

export type ExpenseChartResponseDto =
    | {
          success: boolean;
          data: ExpenseChartItem[];
      }
    | ErrorDto;
