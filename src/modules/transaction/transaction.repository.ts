import { injectable } from "inversify";
import { IPaginationResponse, PostgresBaseRepository } from "@hireverse/service-common/dist/repository";
import { ITransactionRepository } from "./interfaces/transaction.repository.interface";
import { AppDataSource } from "../../core/database/postgress";
import { Transaction, TransactionStatus } from "./transaction.entity";
import { InternalError } from "@hireverse/service-common/dist/app.errors";
import { FindManyOptions } from "typeorm";

@injectable()
export class TransactionRepository extends PostgresBaseRepository<Transaction> implements ITransactionRepository {

    constructor() {
        const repository = AppDataSource.getRepository(Transaction);
        super(repository)
    }

    async customPaginate(
        page: number,
        limit: number,
        filter?: FindManyOptions<Transaction>
    ): Promise<IPaginationResponse<Transaction>> {
        const [data, total] = await this.repository.findAndCount({
            ...filter,
            take: limit,
            skip: (page - 1) * limit,
        });
    
        return {
            data,
            currentPage: page,
            limit,
            hasPreviousPage: page > 1,
            hasNextPage: page * limit < total,
            total,
            totalPages: Math.ceil(total / limit),
        };
    }
    

    async getMRR(): Promise<number> {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        try {
            const result = await this.repository
                .createQueryBuilder("transaction")
                .select("SUM(transaction.amount)", "mrr")
                .where("transaction.status = :status", { status: TransactionStatus.COMPLETED })
                .andWhere("EXTRACT(MONTH FROM transaction.createdAt) = :currentMonth", { currentMonth })
                .andWhere("EXTRACT(YEAR FROM transaction.createdAt) = :currentYear", { currentYear })
                .getRawOne();

            return result && result.mrr ? result.mrr : 0;

        } catch (error) {
            throw new InternalError("Failer to perform mrr operation")
        }
    }

    async getRevenueOverview(year: number): Promise<{ month: string; revenue: number }[]> {
        try {
            const result = await this.repository
                .createQueryBuilder("transaction")
                .select("EXTRACT(MONTH FROM transaction.createdAt)", "month")
                .addSelect("SUM(transaction.amount)", "revenue")
                .where("transaction.status = :status", { status: TransactionStatus.COMPLETED })
                .andWhere("EXTRACT(YEAR FROM transaction.createdAt) = :year", { year })
                .groupBy("month")
                .getRawMany();

            const months = [
                { month: "Jan", num: 1 },
                { month: "Feb", num: 2 },
                { month: "Mar", num: 3 },
                { month: "Apr", num: 4 },
                { month: "May", num: 5 },
                { month: "Jun", num: 6 },
                { month: "Jul", num: 7 },
                { month: "Aug", num: 8 },
                { month: "Sep", num: 9 },
                { month: "Oct", num: 10 },
                { month: "Nov", num: 11 },
                { month: "Dec", num: 12 },
            ];

            const overview = months.map(m => {
                const data = result.find((r: any) => parseInt(r.month, 10) === m.num);
                return {
                    month: m.month,
                    revenue: data && data.revenue ? parseFloat(data.revenue) : 0,
                };
            });

            return overview;
        } catch (error) {
            throw new InternalError("Failer to perform revenue overview operation")
        }
    }
}