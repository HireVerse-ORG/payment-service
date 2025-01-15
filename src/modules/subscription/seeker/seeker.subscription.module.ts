import { Container } from "inversify";
import { SeekerSubscriptionController } from "./seeker.subscription.controller";
import TYPES from "../../../core/container/container.types";
import { ISeekerSubscriptionService } from "./interfaces/seeker.subscription.service.interface";
import { SeekerSubscriptionService } from "./seeker.subscription.service";
import { ISeekerSubscriptionRepository } from "./interfaces/seeker.subscription.repository.interface";
import { SeekerSubscriptionRepository } from "./seeker.subscription.repository";

const loadSeekerSubscriptionContainer = (container: Container) => {
    container.bind<SeekerSubscriptionController>(TYPES.SeekerSubscriptionController).to(SeekerSubscriptionController);
    container.bind<ISeekerSubscriptionService>(TYPES.SeekerSubscriptionService).to(SeekerSubscriptionService);
    container.bind<ISeekerSubscriptionRepository>(TYPES.SeekerSubscriptionRepository).to(SeekerSubscriptionRepository);
};

export {loadSeekerSubscriptionContainer}