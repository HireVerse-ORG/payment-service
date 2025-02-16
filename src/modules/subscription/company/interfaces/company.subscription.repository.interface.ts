import { IPostgresRepository } from "@hireverse/service-common/dist/repository";
import { CompanySubscriptionPlan } from "../models/company.subscription.entity";
import { FindManyOptions } from "typeorm";

export interface ICompanySubscriptionRepository extends IPostgresRepository<CompanySubscriptionPlan> {
    countSubscriptions(options?: FindManyOptions<CompanySubscriptionPlan>): Promise<number>
}