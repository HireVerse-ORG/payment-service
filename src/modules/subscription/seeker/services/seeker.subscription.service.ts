import { inject, injectable } from "inversify";
import { ISeekerSubscriptionService } from "../interfaces/seeker.subscription.service.interface";
import containerTypes from "../../../../core/container/container.types";
import { ISeekerSubscriptionRepository } from "../interfaces/seeker.subscription.repository.interface";
import { SubscriptionPlan, SeekerSubscriptionPlan } from "../models/seeker.subscription.entity";
import { BadRequestError, NotFoundError } from "@hireverse/service-common/dist/app.errors";
import { SeekerSubscriptionPlanDTO } from "../../dto/seeker.subscription.dto";
import { ISeekerSubscriptionUsageService } from "../interfaces/seeker.subscription.usage.service.interface";

@injectable()
export class SeekerSubscriptionService implements ISeekerSubscriptionService {
    @inject(containerTypes.SeekerSubscriptionRepository) private repo!: ISeekerSubscriptionRepository;
    @inject(containerTypes.SeekerSubscriptionUsageService) private usageService!: ISeekerSubscriptionUsageService;


    // Create a new subscription
    async createSubscription(userId: string, plan: SubscriptionPlan, paymentIdentifier?: string): Promise<SeekerSubscriptionPlanDTO> {
        const { jobApplicationsPerMonth, canMessageAnyone } = this.generatePlanDetails(plan);
        const {startDate, endDate} = this.generatePlanDates();

        const subscription = await this.repo.create({ userId, plan, paymentIdentifier: paymentIdentifier ? paymentIdentifier : null, 
            jobApplicationsPerMonth, canMessageAnyone,
            startDate,
            endDate,
        });
        await this.usageService.createUsage(userId);
        return this.toDTO(subscription);
    }

    // Get a subscription by user ID
    async getSubscriptionByUserId(userId: string): Promise<SeekerSubscriptionPlanDTO | null> {
        const subscription = await this.repo.findOne({
            where: { userId },
        });

        return subscription ? this.toDTO(subscription) : null;
    }

    // Update a subscription plan
    async updateSubscriptionPlan(userId: string, newPlan: SubscriptionPlan): Promise<SeekerSubscriptionPlanDTO> {
        const subscription = await this.getSubscriptionByUserId(userId);
        if (!subscription) {
            throw new NotFoundError(`Subscription not found`);
        }
        const { jobApplicationsPerMonth, canMessageAnyone } = this.generatePlanDetails(newPlan);
        const {startDate, endDate} = this.generatePlanDates();

        const updatedSubscription = await this.repo.update(subscription.id, { plan: newPlan, 
            jobApplicationsPerMonth, canMessageAnyone, 
            startDate,
            endDate
        });

        if (!updatedSubscription) {
            throw new BadRequestError(`Failed to update subscription`);
        }

        await this.usageService.resetUsage(userId);
        return this.toDTO(updatedSubscription);
    }

    // Cancel a subscription
    async cancelSubscription(userId: string): Promise<boolean> {
        const subscription = await this.getSubscriptionByUserId(userId);
        if (!subscription) {
            throw new NotFoundError(`Subscription not found`);
        }

        if (subscription.plan === SubscriptionPlan.FREE) {
            throw new BadRequestError(`Subscription is already canceled or free`);
        }

        const { jobApplicationsPerMonth, canMessageAnyone } = this.generatePlanDetails(SubscriptionPlan.FREE);
        const {startDate, endDate} = this.generatePlanDates();

        const updatedSubscription = await this.repo.update(subscription.id, {
            plan: SubscriptionPlan.FREE,
            jobApplicationsPerMonth,
            canMessageAnyone,
            startDate,
            endDate
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

    // Get all subscriptions
    async getAllSubscriptions(): Promise<SeekerSubscriptionPlanDTO[]> {
        const subscriptions = await this.repo.findAll({});
        return subscriptions.map(this.toDTO);
    }

    // Renew a subscription
    async renewSubscription(userId: string): Promise<SeekerSubscriptionPlanDTO> {
        const subscription = await this.getSubscriptionByUserId(userId);
        if (!subscription) {
            throw new NotFoundError(`Subscription not found`);
        }

        const { jobApplicationsPerMonth, canMessageAnyone } = this.generatePlanDetails(subscription.plan);
        const {startDate, endDate} = this.generatePlanDates();

        const renewedSubscription = await this.repo.update(subscription.id, { 
            jobApplicationsPerMonth, canMessageAnyone,
            startDate,
            endDate 
        });

        if (!renewedSubscription) {
            throw new BadRequestError(`Failed to update subscription`);
        }

        await this.usageService.resetUsage(userId);

        return this.toDTO(renewedSubscription);
    }

    async getTotalSubscribers(): Promise<number> {
        return await this.repo.countSubscriptions();
    }

    // Helper to generate plan details
    generatePlanDetails(plan: SubscriptionPlan) {
        switch (plan) {
            case SubscriptionPlan.PREMIUM:
                return {
                    jobApplicationsPerMonth: -1,
                    canMessageAnyone: true,
                };
            case SubscriptionPlan.BASIC:
                return {
                    jobApplicationsPerMonth: 30,
                    canMessageAnyone: true,
                };
            case SubscriptionPlan.FREE:
            default:
                return {
                    jobApplicationsPerMonth: 5,
                    canMessageAnyone: false,
                };
        }
    }

    private generatePlanDates(): {startDate: Date; endDate: Date} {
        return {
            startDate: new Date(),
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
        }
    }
    // Helper to convert an entity to a DTO
    private toDTO(entity: SeekerSubscriptionPlan): SeekerSubscriptionPlanDTO {
        return {
            id: entity.id,
            userId: entity.userId,
            plan: entity.plan,
            paymentIdentifier: entity.paymentIdentifier || null,
            jobApplicationsPerMonth: entity.jobApplicationsPerMonth,
            canMessageAnyone: entity.canMessageAnyone,
            startDate: entity.startDate,
            endDate: entity.endDate,
        };
    }
}
