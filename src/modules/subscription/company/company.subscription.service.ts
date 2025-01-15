import { inject, injectable } from "inversify";
import { ISeekerSubscriptionService } from "./interfaces/company.subscription.service.interface";
import containerTypes from "../../../core/container/container.types";
import { ISeekerSubscriptionRepository } from "./interfaces/company.subscription.repository.interface";

@injectable()
export class SeekerSubscriptionService implements ISeekerSubscriptionService {
    @inject(containerTypes.SeekerSubscriptionRepository) repo!: ISeekerSubscriptionRepository;

}