import { inject, injectable } from "inversify";
import containerTypes from "../../../../core/container/container.types";
import { ISeekerSubscriptionService } from "../interfaces/seeker.subscription.service.interface";
import asyncWrapper from "@hireverse/service-common/dist/utils/asyncWrapper";
import { AuthRequest } from '@hireverse/service-common/dist/token/user/userRequest';
import { Response } from "express";
import { ISeekerSubscriptionUsageService } from "../interfaces/seeker.subscription.usage.service.interface";
import { IPaymentService } from "../../../payment/interface/payment.service.interface";
import { SubscriptionPlan } from "../models/seeker.subscription.entity";
import { STRIPE_SEEKER_SUBSCRIPTION_IDS } from "../../../../core/adapters/stripe";
import { ITransactionService } from "../../../transaction/interfaces/transaction.service.interface";
import { UserType } from "../../../transaction/transaction.entity";

@injectable()
export class SeekerSubscriptionController {
    @inject(containerTypes.SeekerSubscriptionService) private subscriptionService!: ISeekerSubscriptionService;
    @inject(containerTypes.SeekerSubscriptionUsageService) private usageService!: ISeekerSubscriptionUsageService;
    @inject(containerTypes.PaymentService) private paymentService!: IPaymentService;
    @inject(containerTypes.TransactionService) private transactionService!: ITransactionService;

    /**
   * @route GET /api/payment/subscription/seeker/plan
   * @scope Seeker
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
   * @route GET /api/payment/subscription/seeker/usage
   * @scope Seeker
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
     * @route POST /api/payment/subscription/seeker/paymentlink
     * @scope Seeker
     **/
    public getPaymentlink = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const userId = req.payload?.userId!;
        const { plan, successUrl, cancelUrl } = req.body;

        let validPlan: SubscriptionPlan;
        if (plan === "basic") {
            validPlan = SubscriptionPlan.BASIC;
        } else if (plan === "premium") {
            validPlan = SubscriptionPlan.PREMIUM;
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

        const PLAN_ID = STRIPE_SEEKER_SUBSCRIPTION_IDS[validPlan];

        const planDetails = await this.paymentService.getPlanDetails(PLAN_ID);

        const transaction = await this.transactionService.createTransaction({
            amount: planDetails.amount,
            userId,
            userType: UserType.SEEKER,
            currency: planDetails.currency,
            paymentIdentifier: subscription.paymentIdentifier,
            metadata: {
                plan_type: "seeker",
                subscription_details: {
                    plan: validPlan,
                    plan_id: PLAN_ID,
                    id: subscription.id,
                    ...this.subscriptionService.generatePlanDetails(validPlan),
                }
            }
        })

        const customerId = subscription.paymentIdentifier;

        const url = await this.paymentService.generatePaymentLink({
            customerId,
            priceId: PLAN_ID,
            successUrl,
            cancelUrl,
            metadata: {
                userId,
                plan_type: "seeker",
                selected_plan: plan,
                transaction_id: transaction.id,
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

        await this.paymentService.subscribeToPlan(customerId, STRIPE_SEEKER_SUBSCRIPTION_IDS[SubscriptionPlan.FREE]);
        await this.subscriptionService.cancelSubscription(userId)
        return res.json({ message: "Subscription Cancelled" })
    });

}