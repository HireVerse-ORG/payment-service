import { injectable } from "inversify";
import { ISeekerSubscriptionRepository } from "./interfaces/seeker.subscription.repository.interface";
import { PostgresBaseRepository } from "@hireverse/service-common/dist/repository";
import { SeekerSubscriptionPlan } from "./seeker.subscription.entity";
import { AppDataSource } from "../../../core/database/postgress";

@injectable()
export class SeekerSubscriptionRepository extends PostgresBaseRepository<SeekerSubscriptionPlan> implements ISeekerSubscriptionRepository{

    constructor(){
        const repository = AppDataSource.getRepository(SeekerSubscriptionPlan);
        super(repository)
    }
}