import { injectable } from "inversify";
import { PostgresBaseRepository } from "@hireverse/service-common/dist/repository";
import { AppDataSource } from "../../../../core/database/postgress";
import { CompanySubscriptionPlan } from "../models/company.subscription.entity";
import { ICompanySubscriptionRepository } from "../interfaces/company.subscription.repository.interface";

@injectable()
export class CompanySubscriptionRepository extends PostgresBaseRepository<CompanySubscriptionPlan> implements ICompanySubscriptionRepository{

    constructor(){
        const repository = AppDataSource.getRepository(CompanySubscriptionPlan);
        super(repository)
    }
}