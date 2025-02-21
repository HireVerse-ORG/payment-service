import { IPaginationResponse, IPostgresRepository } from "@hireverse/service-common/dist/repository";
import { Transaction } from "../transaction.entity";
import { FindManyOptions } from "typeorm";

export interface ITransactionRepository extends IPostgresRepository<Transaction> {
    getMRR(): Promise<number>
    getRevenueOverview(year: number): Promise<{ month: string; revenue: number }[]>;
    customPaginate(
            page: number,
            limit: number,
            filter?: FindManyOptions<Transaction>
        ): Promise<IPaginationResponse<Transaction>>;
}