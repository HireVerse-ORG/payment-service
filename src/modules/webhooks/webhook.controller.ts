import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { ISeekerSubscriptionService } from "../subscription/seeker/interfaces/seeker.subscription.service.interface";
import containerTypes from "../../core/container/container.types";
import { ICompanySubscriptionService } from "../subscription/company/interfaces/company.subscription.service.interface";
import { ITransactionService } from "../transaction/interfaces/transaction.service.interface";
import { TransactionStatus } from "../transaction/transaction.entity";
import { logger } from "../../core/utils/logger";

@injectable()
export class WebhookController {
    @inject(containerTypes.SeekerSubscriptionService) private seekerSubscriptionService!: ISeekerSubscriptionService;
    @inject(containerTypes.CompanySubscriptionService) private companySubscriptionService!: ICompanySubscriptionService;
    @inject(containerTypes.TransactionService) private transactionService!: ITransactionService;

    stripe = async (request: Request, response: Response) => {
        const event = request.body;

        try {
            switch (event.type) {
                case 'checkout.session.completed':
                    const session = event.data.object;
                    const { userId, plan_type, selected_plan, transaction_id } = session.metadata
                    if (userId && plan_type === "seeker") {
                        try {
                            await this.seekerSubscriptionService.updateSubscriptionPlan(userId, selected_plan);
                        } catch (error) {
                            // console.log(error);
                        }
                    }

                    if (userId && plan_type === "company") {
                        try {
                            await this.companySubscriptionService.updateSubscriptionPlan(userId, selected_plan);
                        } catch (error) {
                            // console.log(error);
                        }
                    }

                    if (transaction_id) {
                        await this.transactionService.updateTransactionStatus(transaction_id, TransactionStatus.COMPLETED);
                    }

                    break;

                case 'customer.subscription.updated':
                    const subscription = event.data.object;
                    const { userId: updatedUserId, plan_type: updatedPlanType } = subscription.metadata;

                    if(subscription.status === 'active'){
                        let subscriptionId, paymentIdentifier: string | undefined;

                        if (updatedUserId && updatedPlanType === 'seeker') {
                            try {
                                const subscription = await this.seekerSubscriptionService.renewSubscription(updatedUserId);
                                subscriptionId = subscription.id;
                                if(subscription.paymentIdentifier){
                                    paymentIdentifier = subscription.paymentIdentifier;
                                }
                            } catch (error) {
                                // console.error("Error updating subscription data:", error);
                            }
                        }
    
                        if (updatedUserId && updatedPlanType === 'company') {
                            try {
                                const subscription = await this.companySubscriptionService.renewSubscription(updatedUserId);
                                subscriptionId = subscription.id;
                                if(subscription.paymentIdentifier){
                                    paymentIdentifier = subscription.paymentIdentifier;
                                }
                            } catch (error) {
                                // console.error("Error updating subscription data:", error);
                            }
                        }

                        if(updatedUserId){
                            await this.transactionService.createTransaction({
                                amount: 0,
                                currency: "usd",
                                paymentIdentifier,                     
                                userId: updatedUserId,
                                userType: updatedPlanType,
                                status: TransactionStatus.COMPLETED,
                                metadata: {
                                    subscription_details: {
                                        id: subscriptionId,
                                        plan_type: updatedPlanType,
                                    }
                                }
                            })
                        }

                    }
                    break;

                case "invoice.payment_failed":
                case "payment_intent.payment_failed": {
                    const obj = event.data.object;
                    const transactionId = obj.metadata ? obj.metadata.transaction_id : null;
                    if (transactionId) {
                        try {
                            await this.transactionService.updateTransactionStatus(
                                transactionId,
                                TransactionStatus.FAILED
                            );
                        } catch (error) {
                            logger.error("Failed to update transaction status to FAILED:", error);
                        }
                    }
                    break;
                }

                default:
            }

            response.json({ received: true });
        } catch (err: any) {
            console.error("Webhook signature verification failed.", err);
            response.status(400).send(`Webhook Error: ${err.message}`);
        }
    };
}
