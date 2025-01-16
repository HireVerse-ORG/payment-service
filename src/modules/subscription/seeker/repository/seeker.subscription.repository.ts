import { injectable } from "inversify";
import { ISeekerSubscriptionRepository } from "../interfaces/seeker.subscription.repository.interface";
import { PostgresBaseRepository } from "@hireverse/service-common/dist/repository";
import { SeekerSubscriptionPlan } from "../models/seeker.subscription.entity";
import { AppDataSource } from "../../../../core/database/postgress";
import { FindOneOptions } from "typeorm";

@injectable()
export class SeekerSubscriptionRepository extends PostgresBaseRepository<SeekerSubscriptionPlan> implements ISeekerSubscriptionRepository{

    constructor(){
        const repository = AppDataSource.getRepository(SeekerSubscriptionPlan);
        super(repository)
    }

    async findOneUpdated(filter?: FindOneOptions<SeekerSubscriptionPlan> | undefined): Promise<SeekerSubscriptionPlan | null> {
        return await this.repository.findOne(filter || {})
    }
}