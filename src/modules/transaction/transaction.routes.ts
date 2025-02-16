import { Router } from "express";
import { container } from "../../core/container";
import TYPES from "../../core/container/container.types";
import {allowedRoles} from "@hireverse/service-common/dist/token/user/userMiddleware";
import { TransactionController } from "./transaction.controller";

const controlller = container.get<TransactionController>(TYPES.TransactionController);

// base: /api/payment/transactions
const router = Router();

router.get('/list', allowedRoles('admin'), controlller.listTransactions);

export const transactionRoutes = router;