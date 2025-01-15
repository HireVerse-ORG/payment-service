import { Request, Response } from "express";

export default function (request: Request, response: Response) {
    const event = request.body;

    try {
        switch (event.type) {
            case "checkout.session.completed":
                console.log("Checkout session completed!");
                break;

            case "invoice.payment_succeeded":
                console.log("Invoice payment succeeded!");
                // Process successful payment (e.g., grant subscription)
                break;

            case "customer.subscription.deleted":
                console.log("Subscription canceled!");
                // Process subscription cancellation (e.g., revoke access)
                break;

            default:
                // console.log(`Unhandled event type ${event.type}`);
        }

        response.json({ received: true });
    } catch (err: any) {
        console.error("Webhook signature verification failed.", err);
        response.status(400).send(`Webhook Error: ${err.message}`);
    }
}