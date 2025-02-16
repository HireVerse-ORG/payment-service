import { IPostgresRepository } from "@hireverse/service-common/dist/repository";
import { SeekerSubscriptionPlan } from "../models/seeker.subscription.entity";
import { FindOneOptions } from "typeorm";

export interface ISeekerSubscriptionRepository extends IPostgresRepository<SeekerSubscriptionPlan> {
    findOneUpdated(filter?: FindOneOptions<SeekerSubscriptionPlan> | undefined): Promise<SeekerSubscriptionPlan | null>
}