import { injectable } from "inversify";
import { PostgresBaseRepository } from "@hireverse/service-common/dist/repository";
import { ITransactionRepository } from "./interfaces/transaction.repository.interface";
import { AppDataSource } from "../../core/database/postgress";
import { Transaction } from "./transaction.entity";

@injectable()
export class TransactionRepository extends PostgresBaseRepository<Transaction> implements ITransactionRepository{

    constructor(){
        const repository = AppDataSource.getRepository(Transaction);
        super(repository)
    }

}