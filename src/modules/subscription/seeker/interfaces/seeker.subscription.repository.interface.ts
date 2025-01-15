import { IPostgresRepository } from "@hireverse/service-common/dist/repository";
import { SeekerSubscriptionPlan } from "../seeker.subscription.entity";

export interface ISeekerSubscriptionRepository extends IPostgresRepository<SeekerSubscriptionPlan> {}