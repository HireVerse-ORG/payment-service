import { IPostgresRepository } from "@hireverse/service-common/dist/repository";
import { SeekerSubscriptionPlan } from "../company.subscription.entity";

export interface ISeekerSubscriptionRepository extends IPostgresRepository<SeekerSubscriptionPlan> {}