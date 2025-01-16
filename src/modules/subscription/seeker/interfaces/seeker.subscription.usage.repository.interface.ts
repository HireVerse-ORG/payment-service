import { IPostgresRepository } from "@hireverse/service-common/dist/repository";
import { SeekerSubscriptionUsage } from "../models/seeker.subscription.usage.entity";

export interface ISeekerSubscriptionUsageRepository extends IPostgresRepository<SeekerSubscriptionUsage> {}