import { Container } from "inversify";
import { SeekerSubscriptionController } from "./company.subscription.controller";
import TYPES from "../../../core/container/container.types";
import { ISeekerSubscriptionService } from "./interfaces/company.subscription.service.interface";
import { SeekerSubscriptionService } from "./company.subscription.service";
import { ISeekerSubscriptionRepository } from "./interfaces/company.subscription.repository.interface";
import { SeekerSubscriptionRepository } from "./company.subscription.repository";

const loadSeekerSubscriptionContainer = (container: Container) => {
    container.bind<SeekerSubscriptionController>(TYPES.SeekerSubscriptionController).to(SeekerSubscriptionController);
    container.bind<ISeekerSubscriptionService>(TYPES.SeekerSubscriptionService).to(SeekerSubscriptionService);
    container.bind<ISeekerSubscriptionRepository>(TYPES.SeekerSubscriptionRepository).to(SeekerSubscriptionRepository);
};

export {loadSeekerSubscriptionContainer}