import express, { Application } from "express";
import { errorHandler, notFoundHandler } from "./errorHandler";
import stripe from "../../modules/webhooks/stripe";
import { subscriptionRoutes } from "../../modules/subscription/subscription.routes";

export function registerRoutes(app: Application, prefix = "/api/payment") {
    app.get(`${prefix}/health`, (req, res) => {
        res.json("Payment Server is healthy 🚀")
    })
    app.use(`${prefix}/subscription`, subscriptionRoutes);
    app.post('/webhook', express.json({ type: 'application/json' }), stripe);
    app.use(notFoundHandler);
    app.use(errorHandler);
}