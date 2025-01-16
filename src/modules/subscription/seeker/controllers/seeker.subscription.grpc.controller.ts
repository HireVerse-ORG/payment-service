import { inject, injectable } from "inversify";
import { BaseController } from "../../../../core/base.controller";
import { grpcWrapper } from "../../../../core/utils/grpcWrapper";
import containerTypes from "../../../../core/container/container.types";
import { ISeekerSubscriptionService } from "../interfaces/seeker.subscription.service.interface";
import { IPaymentService } from "../../../payment/interface/payment.service.interface";
import { SubscriptionPlan } from "../models/seeker.subscription.entity";
import { STRIPE_SEEKER_SUBSCRIPTION_IDS } from "../../../../core/adapters/stripe";

@injectable()
export class SeekerSubscriptionGrpcController extends BaseController {
    @inject(containerTypes.SeekerSubscriptionService) private subscriptionService!: ISeekerSubscriptionService;
    @inject(containerTypes.PaymentService) private paymentService!: IPaymentService;

    public getProcedures() {
        return {
            CreateFreePlan: this.createFreePlan.bind(this),
        }
    }

    private createFreePlan = grpcWrapper(async (call: any, callback: any) => {        
        let { userId, email, name } = call.request;
        const stripeCustomerId = await this.paymentService.createCustomer(email, name);
        await this.paymentService.subscribeToPlan(stripeCustomerId, STRIPE_SEEKER_SUBSCRIPTION_IDS[SubscriptionPlan.FREE]);
        await this.subscriptionService.createSubscription(userId, SubscriptionPlan.FREE, stripeCustomerId);
        callback(null, {message: "Free plan created"})
    })
}