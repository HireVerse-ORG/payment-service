import { inject, injectable } from "inversify";
import containerTypes from "../../../../core/container/container.types";
import { ICompanySubscriptionService } from "../interfaces/company.subscription.service.interface";
import { BaseController } from "../../../../core/base.controller";
import { ICompanySubscriptionUsageService } from "../interfaces/company.subscription.usage.service.interface";
import { IPaymentService } from "../../../payment/interface/payment.service.interface";
import asyncWrapper from "@hireverse/service-common/dist/utils/asyncWrapper";
import { AuthRequest } from "@hireverse/service-common/dist/token/user/userRequest";
import { Response } from "express";
import { CompanySubscriptionPlans } from "../models/company.subscription.entity";
import { STRIPE_COMPANY_SUBSCRIPTION_IDS } from "../../../../core/adapters/stripe";

@injectable()
export class CompanySubscriptionController extends BaseController {
    @inject(containerTypes.CompanySubscriptionService) subscriptionService!: ICompanySubscriptionService;
    @inject(containerTypes.CompanySubscriptionUsageService) private usageService!: ICompanySubscriptionUsageService;
    @inject(containerTypes.PaymentService) private paymentService!: IPaymentService;

    /**
   * @route GET /api/payment/subscription/company/plan
   * @scope Company
   **/
    public getSubscriptionPlan = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const userId = req.payload?.userId!;
        const plan = await this.subscriptionService.getSubscriptionByUserId(userId);
        if (!plan) {
            return res.status(400).json({ message: "Subscription not found" });
        }

        return res.json(plan);
    })

    /**
   * @route GET /api/payment/subscription/company/usage
   * @scope Company
   **/
    public getSubscriptionPlanUsage = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const userId = req.payload?.userId!;
        const usage = await this.usageService.getUsageByUserId(userId);
        if (!usage) {
            return res.status(400).json({ message: "Subscription Usage not found" });
        }

        return res.json(usage);
    })

    /**
     * @route POST /api/payment/subscription/company/paymentlink
     * @scope Company
     **/
    public getPaymentlink = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const userId = req.payload?.userId!;
        const { plan, successUrl, cancelUrl } = req.body;

        let validPlan: CompanySubscriptionPlans;
        if (plan === "basic") {
            validPlan = CompanySubscriptionPlans.BASIC;
        } else if (plan === "premium") {
            validPlan = CompanySubscriptionPlans.PREMIUM;
        } else {
            return res.status(400).json({ message: "Invalid subscription plan." });
        }

        const subscription = await this.subscriptionService.getSubscriptionByUserId(userId);

        if (!subscription || !subscription.paymentIdentifier) {
            return res.status(400).json({ message: "Subscription not found." });
        }

        if (validPlan == subscription.plan) {
            return res.status(400).json({ message: "Already Subscribed to this plan" });
        }

        const customerId = subscription.paymentIdentifier;

        const url = await this.paymentService.generatePaymentLink({
            customerId,
            priceId: STRIPE_COMPANY_SUBSCRIPTION_IDS[validPlan],
            successUrl,
            cancelUrl,
            metadata: {
                userId,
                plan_type: "company",
                selected_plan: plan
            },
        });

        return res.json({ url, expires_in: "24 hours" });

    });

    /**
     * @route DELETE /api/payment/subscription/seeker/cancel
     * @scope Seeker
     **/
    public cacelSubscription = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const userId = req.payload?.userId!;

        const subscription = await this.subscriptionService.getSubscriptionByUserId(userId);

        if (!subscription || !subscription.paymentIdentifier) {
            return res.status(400).json({ message: "Subscription not found." });
        }

        const customerId = subscription.paymentIdentifier;

        await this.paymentService.subscribeToPlan(customerId, STRIPE_COMPANY_SUBSCRIPTION_IDS[CompanySubscriptionPlans.FREE]);
        await this.subscriptionService.cancelSubscription(userId)
        return res.json({ message: "Subscription Cancelled" })
    });
}