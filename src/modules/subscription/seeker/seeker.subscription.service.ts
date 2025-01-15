import { inject, injectable } from "inversify";
import { ISeekerSubscriptionService } from "./interfaces/seeker.subscription.service.interface";
import containerTypes from "../../../core/container/container.types";
import { ISeekerSubscriptionRepository } from "./interfaces/seeker.subscription.repository.interface";

@injectable()
export class SeekerSubscriptionService implements ISeekerSubscriptionService {
    @inject(containerTypes.SeekerSubscriptionRepository) repo!: ISeekerSubscriptionRepository;

}