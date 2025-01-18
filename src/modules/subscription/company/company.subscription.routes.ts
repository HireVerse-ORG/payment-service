import { Router } from "express";
import { container } from "../../../core/container";
import containerTypes from "../../../core/container/container.types";
import { CompanySubscriptionController } from "./controllers/company.subscription.controller";
import { allowedRoles } from "@hireverse/service-common/dist/token/user/userMiddleware";

const controlller = container.get<CompanySubscriptionController>(containerTypes.CompanySubscriptionController);

// base: /api/payment/subscription/company
const router = Router();

router.get('/plan', allowedRoles("company"), controlller.getSubscriptionPlan);
router.get('/usage', allowedRoles("company"), controlller.getSubscriptionPlanUsage);
router.post('/paymentlink', allowedRoles("company"), controlller.getPaymentlink);
router.delete('/cancel', allowedRoles("company"), controlller.cacelSubscription);

export const companySubscriptionRoutes = router;