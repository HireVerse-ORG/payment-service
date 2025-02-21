import { inject, injectable } from "inversify";
import TYPES from "../../core/container/container.types";
import { ITransactionService } from "./interfaces/transaction.service.interface";
import { ITransactionRepository } from "./interfaces/transaction.repository.interface";
import { CreateTransactionDto } from "./dto/transaction.dto";
import { Transaction, TransactionStatus } from "./transaction.entity";
import { IPaginationResponse } from "@hireverse/service-common/dist/repository";

@injectable()
export class TransactionService implements ITransactionService {
    @inject(TYPES.TransactionRepository) private repo!: ITransactionRepository;

    async createTransaction(data: CreateTransactionDto): Promise<Transaction> {
        return await this.repo.create(data);
    }

    async updateTransactionStatus(transactionId: string, status: TransactionStatus): Promise<void> {
        await this.repo.update(transactionId, { status });
    }

    async getTransactionById(transactionId: string): Promise<Transaction | null> {
        return await this.repo.findOne({ where: { id: transactionId } });
    }

    async getTransactionsForUser(userId: string): Promise<Transaction[]> {
        return await this.repo.findAll({
            where: { userId },
            order: {
                createdAt: 'DESC'
            }
        });
    }

    async getMonthlyRecurringRevenue(): Promise<number> {
        return await this.repo.getMRR();
    }

    async listTransactions(filter: { userId?: string; status?: TransactionStatus; page: number; limit: number; }): Promise<IPaginationResponse<Transaction>> {
        const { userId, status, page, limit } = filter;
        const whereClause: any = {};
        if (userId) whereClause.userId = userId;
        if (status) whereClause.status = status;
        const transactions = await this.repo.customPaginate(page, limit, {
            where: whereClause,
            order: {
                createdAt: 'DESC'
            }
        });

        return transactions;
    }

    async getYearlyRevenueOverview(year: number): Promise<{ month: string; revenue: number; }[]> {
        return await this.repo.getRevenueOverview(year);
    }
}