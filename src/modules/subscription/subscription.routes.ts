import { Router } from "express";
import { seekerSubscriptionRoutes } from "./seeker/seeker.subscription.routes";
import { companySubscriptionRoutes } from "./company/company.subscription.routes";

// base: /api/payment/subscription
const router = Router();

router.use("/seeker", seekerSubscriptionRoutes);
router.use("/company", companySubscriptionRoutes);

export const subscriptionRoutes = router;