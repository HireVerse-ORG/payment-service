import { injectable } from "inversify";
import { PostgresBaseRepository } from "@hireverse/service-common/dist/repository";
import { AppDataSource } from "../../../../core/database/postgress";
import { CompanySubscriptionPlan } from "../models/company.subscription.entity";
import { ICompanySubscriptionRepository } from "../interfaces/company.subscription.repository.interface";
import { FindManyOptions } from "typeorm";
import { InternalError } from "@hireverse/service-common/dist/app.errors";

@injectable()
export class CompanySubscriptionRepository extends PostgresBaseRepository<CompanySubscriptionPlan> implements ICompanySubscriptionRepository {

    constructor() {
        const repository = AppDataSource.getRepository(CompanySubscriptionPlan);
        super(repository)
    }

    async countSubscriptions(options?: FindManyOptions<CompanySubscriptionPlan>): Promise<number> {
        try {
            const count = await this.repository.count(options);
            return count;
        } catch (error) {
            throw new InternalError("Failed to perform count operation");
        }
    }
}