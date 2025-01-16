import express, { Router } from "express";
import { container } from "../../core/container";
import { WebhookController } from "./webhook.controller";
import containerTypes from "../../core/container/container.types";

const controlller = container.get<WebhookController>(containerTypes.WebhookController);

// base: /webhook
const router = Router();

router.post("/", express.json({ type: 'application/json' }), controlller.stripe)

export const webhookRoutes = router;