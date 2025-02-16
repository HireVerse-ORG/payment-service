import { IPostgresRepository } from "@hireverse/service-common/dist/repository";
import { Transaction } from "../transaction.entity";

export interface ITransactionRepository extends IPostgresRepository<Transaction> {
    getMRR(): Promise<number>
    getRevenueOverview(year: number): Promise<{ month: string; revenue: number }[]>
}