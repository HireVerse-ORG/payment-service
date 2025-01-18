import { injectable } from "inversify";
import { PostgresBaseRepository } from "@hireverse/service-common/dist/repository";
import { AppDataSource } from "../../../../core/database/postgress";
import { CompanySubscriptionUsage } from "../models/company.subscription.usage.entity";
import { ICompanySubscriptionUsageRepository } from "../interfaces/company.subscription.usage.repository.interface";

@injectable()
export class CompanySubscriptionUsageRepository extends PostgresBaseRepository<CompanySubscriptionUsage> implements ICompanySubscriptionUsageRepository{

    constructor(){
        const repository = AppDataSource.getRepository(CompanySubscriptionUsage);
        super(repository)
    }
}