import { IPostgresRepository } from "@hireverse/service-common/dist/repository";
import { CompanySubscriptionUsage } from "../models/company.subscription.usage.entity";

export interface ICompanySubscriptionUsageRepository extends IPostgresRepository<CompanySubscriptionUsage> {}