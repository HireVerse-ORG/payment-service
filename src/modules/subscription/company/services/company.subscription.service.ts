import { inject, injectable } from "inversify";
import containerTypes from "../../../../core/container/container.types";
import { ICompanySubscriptionService } from "../interfaces/company.subscription.service.interface";
import { ICompanySubscriptionRepository } from "../interfaces/company.subscription.repository.interface";
import { CompanySubscriptionPlan, CompanySubscriptionPlans } from "../models/company.subscription.entity";
import { ICompanySubscriptionUsageService } from "../interfaces/company.subscription.usage.service.interface";
import { BadRequestError, NotFoundError } from "@hireverse/service-common/dist/app.errors";

@injectable()
export class CompanySubscriptionService implements ICompanySubscriptionService {
    @inject(containerTypes.CompanySubscriptionRepository) repo!: ICompanySubscriptionRepository;
    @inject(containerTypes.CompanySubscriptionUsageService) private usageService!: ICompanySubscriptionUsageService;

    // Create a new subscription
    async createSubscription(userId: string, plan: CompanySubscriptionPlans, paymentIdentifier?: string): Promise<CompanySubscriptionPlan> {
        const { jobPostLimit, applicantionAccessLimit } = this.generatePlanDetails(plan);
        const {startDate, endDate} = this.generatePlanDates();

        const subscription = await this.repo.create({ userId, plan, paymentIdentifier: paymentIdentifier ? paymentIdentifier : null, 
            jobPostLimit, applicantionAccessLimit,
            startDate,
            endDate,
        });
        await this.usageService.createUsage(userId);
        return subscription;
    }

    // Get a subscription by user ID
    async getSubscriptionByUserId(userId: string): Promise<CompanySubscriptionPlan | null> {
        const subscription = await this.repo.findOne({
            where: { userId },
        });
        return subscription ? subscription : null;
    }

    // Update a subscription plan
    async updateSubscriptionPlan(userId: string, newPlan: CompanySubscriptionPlans): Promise<CompanySubscriptionPlan> {
        const subscription = await this.getSubscriptionByUserId(userId);
        if (!subscription) {
            throw new NotFoundError(`Subscription not found`);
        }
        const { jobPostLimit, applicantionAccessLimit } = this.generatePlanDetails(newPlan);
        const {startDate, endDate} = this.generatePlanDates();

        const updatedSubscription = await this.repo.update(subscription.id, { plan: newPlan, 
            jobPostLimit, applicantionAccessLimit,
            startDate, endDate 
        });
        await this.usageService.resetUsage(userId);
        if (!updatedSubscription) {
            throw new BadRequestError(`Failed to update subscription`);
        }
        return updatedSubscription;
    }

    // Cancel a subscription
    async cancelSubscription(userId: string): Promise<boolean> {
        const subscription = await this.getSubscriptionByUserId(userId);
        if (!subscription) {
            throw new NotFoundError(`Subscription not found`);
        }

        if (subscription.plan === CompanySubscriptionPlans.FREE) {
            throw new BadRequestError(`Subscription is already canceled or free`);
        }

        const { jobPostLimit, applicantionAccessLimit } = this.generatePlanDetails(CompanySubscriptionPlans.FREE);
        const {startDate, endDate} = this.generatePlanDates();

        const updatedSubscription = await this.repo.update(subscription.id, {
            plan: CompanySubscriptionPlans.FREE,
            jobPostLimit, applicantionAccessLimit,
            startDate, endDate,
        });

        if (!updatedSubscription) {
            throw new BadRequestError(`Failed to cancel subscription`);
        }

        await this.usageService.resetUsage(userId);
        return true;
    }

    // Check the subscription status
    async checkSubscriptionStatus(userId: string): Promise<string> {
        const subscription = await this.getSubscriptionByUserId(userId);
        if (!subscription) {
            throw new NotFoundError(`Subscription not found`);
        }
        return subscription.plan;
    }


    // Renew a subscription
    async renewSubscription(userId: string): Promise<CompanySubscriptionPlan> {
        const subscription = await this.getSubscriptionByUserId(userId);
        if (!subscription) {
            throw new NotFoundError(`Subscription not found`);
        }

        const { jobPostLimit, applicantionAccessLimit } = this.generatePlanDetails(subscription.plan);
        const {startDate, endDate} = this.generatePlanDates();

        const renewedSubscription = await this.repo.update(subscription.id, { 
            jobPostLimit, applicantionAccessLimit,
            startDate, endDate 
        });

        if (!renewedSubscription) {
            throw new BadRequestError(`Failed to update subscription`);
        }

        await this.usageService.resetUsage(userId);

        return renewedSubscription;
    }

    async getTotalSubscribers(): Promise<number> {
        return await this.repo.countSubscriptions();
    }

    private generatePlanDates(): {startDate: Date; endDate: Date} {
        return {
            startDate: new Date(),
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
        }
    }

    generatePlanDetails(plan: CompanySubscriptionPlans) {
        switch (plan) {
            case CompanySubscriptionPlans.FREE:
                return {
                    jobPostLimit: 1,
                    applicantionAccessLimit: 5,
                };

            case CompanySubscriptionPlans.BASIC:
                return {
                    jobPostLimit: 5,
                    applicantionAccessLimit: 20,
                };

            case CompanySubscriptionPlans.PREMIUM:
                return {
                    jobPostLimit: -1,
                    applicantionAccessLimit: -1,
                };

            default:
                throw new Error("Invalid subscription plan");
        }
    }
}