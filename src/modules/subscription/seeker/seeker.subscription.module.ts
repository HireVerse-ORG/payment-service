import { Container } from "inversify";
import { SeekerSubscriptionController } from "./controllers/seeker.subscription.controller";
import TYPES from "../../../core/container/container.types";
import { ISeekerSubscriptionService } from "./interfaces/seeker.subscription.service.interface";
import { SeekerSubscriptionService } from "./services/seeker.subscription.service";
import { ISeekerSubscriptionRepository } from "./interfaces/seeker.subscription.repository.interface";
import { SeekerSubscriptionRepository } from "./repository/seeker.subscription.repository";
import { ISeekerSubscriptionUsageService } from "./interfaces/seeker.subscription.usage.service.interface";
import { SeekerSubscriptionUsageService } from "./services/seeker.subscription.usage.service";
import { SeekerSubscriptionUsageRepository } from "./repository/seeker.subscription.usage.repository";
import { ISeekerSubscriptionUsageRepository } from "./interfaces/seeker.subscription.usage.repository.interface";
import { SeekerSubscriptionGrpcController } from "./controllers/seeker.subscription.grpc.controller";

const loadSeekerSubscriptionContainer = (container: Container) => {
    container.bind<SeekerSubscriptionGrpcController>(TYPES.SeekerSubscriptionGrpcController).to(SeekerSubscriptionGrpcController);
    container.bind<SeekerSubscriptionController>(TYPES.SeekerSubscriptionController).to(SeekerSubscriptionController);
    container.bind<ISeekerSubscriptionService>(TYPES.SeekerSubscriptionService).to(SeekerSubscriptionService);
    container.bind<ISeekerSubscriptionRepository>(TYPES.SeekerSubscriptionRepository).to(SeekerSubscriptionRepository);

    container.bind<ISeekerSubscriptionUsageService>(TYPES.SeekerSubscriptionUsageService).to(SeekerSubscriptionUsageService);
    container.bind<ISeekerSubscriptionUsageRepository>(TYPES.SeekerSubscriptionUsageRepository).to(SeekerSubscriptionUsageRepository);
};

export {loadSeekerSubscriptionContainer}