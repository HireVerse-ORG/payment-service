import { inject, injectable } from "inversify";
import TYPES from "../../core/container/container.types";
import { ITransactionService } from "../transaction/interfaces/transaction.service.interface";
import asyncWrapper from "@hireverse/service-common/dist/utils/asyncWrapper";
import { AuthRequest } from "@hireverse/service-common/dist/token/user/userRequest";
import { Response } from "express";
import { ISeekerSubscriptionService } from "../subscription/seeker/interfaces/seeker.subscription.service.interface";
import { ICompanySubscriptionService } from "../subscription/company/interfaces/company.subscription.service.interface";

@injectable()
export class StatisticsController {
    @inject(TYPES.SeekerSubscriptionService) private seekerSubscriptionService!: ISeekerSubscriptionService;
    @inject(TYPES.CompanySubscriptionService) private companySubscriptionService!: ICompanySubscriptionService;
    @inject(TYPES.TransactionService) private transactionService!: ITransactionService;

    /**
   * @route GET /api/payment/statistics/subscribers
   * @scope Admin
   **/
    public subscriberStatistics = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const userSubscriptions = await this.seekerSubscriptionService.getTotalSubscribers();
        const companySubscriptions = await this.companySubscriptionService.getTotalSubscribers();
        const totalSubscriptions = userSubscriptions + companySubscriptions;

        return res.json({
            userSubscriptions,
            companySubscriptions,
            totalSubscriptions,
        }
        );
    });

    /**
   * @route GET /api/payment/statistics/revenue
   * @scope Admin
   **/
    public revenueStatistics = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const currentYear = new Date().getFullYear();

        const monthRevenue = await this.transactionService.getMonthlyRecurringRevenue();
        const yearlyOverview = await this.transactionService.getYearlyRevenueOverview(currentYear);

        return res.json({
            monthRevenue,
            yearlyOverview
        });
    });
}