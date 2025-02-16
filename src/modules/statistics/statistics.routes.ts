import { Router } from "express";
import { container } from "../../core/container";
import TYPES from "../../core/container/container.types";
import { StatisticsController } from "./statistics.controller";
import { allowedRoles } from "@hireverse/service-common/dist/token/user/userMiddleware";

const controlller = container.get<StatisticsController>(TYPES.StatisticsController);

// base: /api/payment/statistics
const router = Router();

router.get('/subscribers', allowedRoles('admin'), controlller.subscriberStatistics);
router.get('/revenue', allowedRoles('admin'), controlller.revenueStatistics);

export const statisticsRoutes = router;