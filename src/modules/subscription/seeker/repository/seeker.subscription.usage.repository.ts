import { PostgresBaseRepository } from "@hireverse/service-common/dist/repository";
import { injectable } from "inversify";
import { ISeekerSubscriptionUsageRepository } from "../interfaces/seeker.subscription.usage.repository.interface";
import { SeekerSubscriptionUsage } from "../models/seeker.subscription.usage.entity";
import { AppDataSource } from "../../../../core/database/postgress";

@injectable()
export class SeekerSubscriptionUsageRepository extends PostgresBaseRepository<SeekerSubscriptionUsage> implements ISeekerSubscriptionUsageRepository{

    constructor(){
        const repository = AppDataSource.getRepository(SeekerSubscriptionUsage);
        super(repository)
    }

}