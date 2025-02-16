import { CreateTransactionDto } from "../dto/transaction.dto";
import { Transaction, TransactionStatus } from "../transaction.entity";
import { IPaginationResponse } from "@hireverse/service-common/dist/repository";

export interface ITransactionService {
    createTransaction(data: CreateTransactionDto): Promise<Transaction>;
    updateTransactionStatus(transactionId: string, status: TransactionStatus): Promise<void>;
    getTransactionById(transactionId: string): Promise<Transaction | null>;
    getTransactionsForUser(userId: string): Promise<Transaction[]>;
    getMonthlyRecurringRevenue(): Promise<number>;
    listTransactions(filter: {
        userId?: string,
        status?: TransactionStatus,
        page: number,
        limit: number,
    }): Promise<IPaginationResponse<Transaction>>;
}