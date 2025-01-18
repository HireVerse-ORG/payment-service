import { Container } from "inversify";
import TYPES from "../../../core/container/container.types";
import { CompanySubscriptionController } from "./controllers/company.subscription.controller";
import { ICompanySubscriptionService } from "./interfaces/company.subscription.service.interface";
import { CompanySubscriptionService } from "./services/company.subscription.service";
import { ICompanySubscriptionRepository } from "./interfaces/company.subscription.repository.interface";
import { CompanySubscriptionRepository } from "./repository/company.subscription.repository";
import { ICompanySubscriptionUsageService } from "./interfaces/company.subscription.usage.service.interface";
import { CompanySubscriptionUsageService } from "./services/company.subscription.usage.service";
import { ICompanySubscriptionUsageRepository } from "./interfaces/company.subscription.usage.repository.interface";
import { CompanySubscriptionUsageRepository } from "./repository/company.subscription.usage.repository";
import { CompanySubscriptionGrpcController } from "./controllers/company.subscription.grpc.controller";

const loadCompanySubscriptionContainer = (container: Container) => {
    container.bind<CompanySubscriptionController>(TYPES.CompanySubscriptionController).to(CompanySubscriptionController);
    container.bind<CompanySubscriptionGrpcController>(TYPES.CompanySubscriptionGrpcController).to(CompanySubscriptionGrpcController);
    container.bind<ICompanySubscriptionService>(TYPES.CompanySubscriptionService).to(CompanySubscriptionService);
    container.bind<ICompanySubscriptionRepository>(TYPES.CompanySubscriptionRepository).to(CompanySubscriptionRepository);
    container.bind<ICompanySubscriptionUsageService>(TYPES.CompanySubscriptionUsageService).to(CompanySubscriptionUsageService);
    container.bind<ICompanySubscriptionUsageRepository>(TYPES.CompanySubscriptionUsageRepository).to(CompanySubscriptionUsageRepository);
};

export {loadCompanySubscriptionContainer}