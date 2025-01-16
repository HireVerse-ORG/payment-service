import { Application } from "express";
import { errorHandler, notFoundHandler } from "./errorHandler";
import { subscriptionRoutes } from "../../modules/subscription/subscription.routes";
import { webhookRoutes } from "../../modules/webhooks/webhook.routes";

export function registerRoutes(app: Application, prefix = "/api/payment") {
    app.get(`${prefix}/health`, (req, res) => {
        res.json("Payment Server is healthy 🚀")
    })
    app.use(`${prefix}/subscription`, subscriptionRoutes);
    app.use('/webhook', webhookRoutes);
    app.use(notFoundHandler);
    app.use(errorHandler);
}