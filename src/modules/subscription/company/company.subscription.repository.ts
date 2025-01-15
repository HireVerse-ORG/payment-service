import { injectable } from "inversify";
import { ISeekerSubscriptionRepository } from "./interfaces/company.subscription.repository.interface";
import { PostgresBaseRepository } from "@hireverse/service-common/dist/repository";
import { SeekerSubscriptionPlan } from "./company.subscription.entity";
import { AppDataSource } from "../../../core/database/postgress";

@injectable()
export class SeekerSubscriptionRepository extends PostgresBaseRepository<SeekerSubscriptionPlan> implements ISeekerSubscriptionRepository{

    constructor(){
        const repository = AppDataSource.getRepository(SeekerSubscriptionPlan);
        super(repository)
    }
}