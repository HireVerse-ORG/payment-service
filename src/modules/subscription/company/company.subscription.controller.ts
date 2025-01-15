import { inject, injectable } from "inversify";
import containerTypes from "../../../core/container/container.types";
import { ISeekerSubscriptionService } from "./interfaces/company.subscription.service.interface";

@injectable()
export class SeekerSubscriptionController {
    @inject(containerTypes.SeekerSubscriptionService) service!: ISeekerSubscriptionService;
}