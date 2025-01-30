import { inject, injectable } from "inversify";
import containerTypes from "../../../../core/container/container.types";
import { ICompanySubscriptionService } from "../interfaces/company.subscription.service.interface";
import { BaseController } from "../../../../core/base.controller";
import { IPaymentService } from "../../../payment/interface/payment.service.interface";
import { grpcWrapper } from "../../../../core/utils/grpcWrapper";
import { CompanySubscriptionPlans } from "../models/company.subscription.entity";
import { STRIPE_COMPANY_SUBSCRIPTION_IDS } from "../../../../core/adapters/stripe";
import { ICompanySubscriptionUsageService } from "../interfaces/company.subscription.usage.service.interface";

@injectable()
export class CompanySubscriptionGrpcController extends BaseController {
    @inject(containerTypes.CompanySubscriptionService) subscriptionService!: ICompanySubscriptionService;
    @inject(containerTypes.CompanySubscriptionUsageService) usageService!: ICompanySubscriptionUsageService;
    @inject(containerTypes.PaymentService) private paymentService!: IPaymentService;

    public getProcedures() {
        return {
            CreateCompanyFreePlan: this.createFreePlan.bind(this),
            CanAccessApplication: this.canAccessApplication.bind(this),
        }
    }

    private createFreePlan = grpcWrapper(async (call: any, callback: any) => {
        let { userId, email, name } = call.request;
        const stripeCustomerId = await this.paymentService.createCustomer(email, name);
        await this.paymentService.subscribeToPlan(stripeCustomerId, STRIPE_COMPANY_SUBSCRIPTION_IDS[CompanySubscriptionPlans.FREE]);
        await this.subscriptionService.createSubscription(userId, CompanySubscriptionPlans.FREE, stripeCustomerId);
        callback(null, { message: "Free plan created" })
    })

    private canAccessApplication = grpcWrapper(async (call: any, callback: any) => {
        let { userId, applicationId } = call.request;

        const usage = await this.usageService.getUsageByUserId(userId);
        const subscription = await this.subscriptionService.getSubscriptionByUserId(userId);

        let canAccess = true;

        if (!usage || !subscription) {
            canAccess = false;
        } else if (subscription.plan !== CompanySubscriptionPlans.PREMIUM &&
            !usage.applicationIdsAccessed?.includes(applicationId) && 
            usage.applicantionAccessed >= subscription.applicantionAccessLimit) {
            canAccess = false;
        }

        callback(null, { canAccess });
    })

}