import { injectable } from "inversify";
import { ISeekerSubscriptionRepository } from "../interfaces/seeker.subscription.repository.interface";
import { PostgresBaseRepository } from "@hireverse/service-common/dist/repository";
import { SeekerSubscriptionPlan } from "../models/seeker.subscription.entity";
import { AppDataSource } from "../../../../core/database/postgress";
import { FindManyOptions, FindOneOptions } from "typeorm";
import { InternalError } from "@hireverse/service-common/dist/app.errors";

@injectable()
export class SeekerSubscriptionRepository extends PostgresBaseRepository<SeekerSubscriptionPlan> implements ISeekerSubscriptionRepository{

    constructor(){
        const repository = AppDataSource.getRepository(SeekerSubscriptionPlan);
        super(repository)
    }

    async findOneUpdated(filter?: FindOneOptions<SeekerSubscriptionPlan> | undefined): Promise<SeekerSubscriptionPlan | null> {
        return await this.repository.findOne(filter || {})
    }

    async countSubscriptions(options?: FindManyOptions<SeekerSubscriptionPlan>): Promise<number> {
        try {
            const count = await this.repository.count(options);
            return count;
        } catch (error) {
            throw new InternalError("Failed to perform count operation");
        }
    }
}