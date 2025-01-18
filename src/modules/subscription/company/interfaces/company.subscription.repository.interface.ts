import { IPostgresRepository } from "@hireverse/service-common/dist/repository";
import { CompanySubscriptionPlan } from "../models/company.subscription.entity";

export interface ICompanySubscriptionRepository extends IPostgresRepository<CompanySubscriptionPlan> {}