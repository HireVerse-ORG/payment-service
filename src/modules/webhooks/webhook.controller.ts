import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { ISeekerSubscriptionService } from "../subscription/seeker/interfaces/seeker.subscription.service.interface";
import containerTypes from "../../core/container/container.types";

@injectable()
export class WebhookController {
    @inject(containerTypes.SeekerSubscriptionService) private seekerSubscriptionService!: ISeekerSubscriptionService;

    stripe = async (request: Request, response: Response) => {
        const event = request.body;

        try {
            switch (event.type) {
                case 'checkout.session.completed':
                    const session = event.data.object;
                    const { userId, plan_type, selected_plan } = session.metadata
                    if (userId && plan_type === "seeker") {
                        try {
                            await this.seekerSubscriptionService.updateSubscriptionPlan(userId, selected_plan);
                        } catch (error) {
                            // console.log(error);
                        }
                    }
                    break;

                case 'customer.subscription.updated':
                    const subscription = event.data.object;
                    const { userId: updatedUserId, plan_type: updatedPlanType } = subscription.metadata;

                    if (updatedUserId && updatedPlanType === 'seeker') {
                        try {
                            await this.seekerSubscriptionService.renewSubscription(updatedUserId);
                        } catch (error) {
                            // console.error("Error updating subscription data:", error);
                        }
                    }
                    break;

                case "invoice.payment_succeeded":
                    // console.log("Invoice payment succeeded!");
                    // Process successful payment (e.g., grant subscription)
                    break;

                case "customer.subscription.deleted":
                    // console.log("Subscription canceled!");
                    // Process subscription cancellation (e.g., revoke access)
                    break;

                default:
            }

            response.json({ received: true });
        } catch (err: any) {
            console.error("Webhook signature verification failed.", err);
            response.status(400).send(`Webhook Error: ${err.message}`);
        }
    };
}
