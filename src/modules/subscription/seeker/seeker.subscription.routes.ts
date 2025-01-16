import { Router } from "express";
import {allowedRoles} from "@hireverse/service-common/dist/token/user/userMiddleware";
import { container } from "../../../core/container";
import containerTypes from "../../../core/container/container.types";
import { SeekerSubscriptionController } from "./controllers/seeker.subscription.controller";

const controlller = container.get<SeekerSubscriptionController>(containerTypes.SeekerSubscriptionController);

// base: /api/payment/subscription/seeker
const router = Router();

router.get('/plan', allowedRoles("seeker"), controlller.getSubscriptionPlan);
router.get('/usage', allowedRoles("seeker"), controlller.getSubscriptionPlanUsage);
router.post('/paymentlink', allowedRoles("seeker"), controlller.getPaymentlink);
router.delete('/cancel', allowedRoles("seeker"), controlller.cacelSubscription);

export const seekerSubscriptionRoutes = router;