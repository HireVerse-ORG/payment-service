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
        const { jobApplicationsPerMonth, canMessageAllSeekers, canMessageOnlySeekers } = this.generatePlanDetails(plan);
        const subscription = await this.repo.create({ userId, plan, paymentIdentifier: paymentIdentifier ? paymentIdentifier : null, jobApplicationsPerMonth, canMessageAllSeekers, canMessageOnlySeekers });
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
        const { jobApplicationsPerMonth, canMessageAllSeekers, canMessageOnlySeekers } = this.generatePlanDetails(newPlan);
        const updatedSubscription = await this.repo.update(subscription.id, { plan: newPlan, jobApplicationsPerMonth, canMessageAllSeekers, canMessageOnlySeekers });

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

        const { jobApplicationsPerMonth, canMessageAllSeekers, canMessageOnlySeekers } = this.generatePlanDetails(SubscriptionPlan.FREE);
        const updatedSubscription = await this.repo.update(subscription.id, {
            plan: SubscriptionPlan.FREE,
            jobApplicationsPerMonth,
            canMessageAllSeekers,
            canMessageOnlySeekers,
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

        const { jobApplicationsPerMonth, canMessageAllSeekers, canMessageOnlySeekers } = this.generatePlanDetails(subscription.plan);
        const renewedSubscription = await this.repo.update(subscription.id, { jobApplicationsPerMonth, canMessageAllSeekers, canMessageOnlySeekers });

        if (!renewedSubscription) {
            throw new BadRequestError(`Failed to update subscription`);
        }

        await this.usageService.resetUsage(userId);

        return this.toDTO(renewedSubscription);
    }

    // Helper to generate plan details
    generatePlanDetails(plan: SubscriptionPlan) {
        switch (plan) {
            case SubscriptionPlan.PREMIUM:
                return {
                    jobApplicationsPerMonth: -1,
                    canMessageAllSeekers: true,
                    canMessageOnlySeekers: false,
                };
            case SubscriptionPlan.BASIC:
                return {
                    jobApplicationsPerMonth: 30,
                    canMessageAllSeekers: true,
                    canMessageOnlySeekers: false,
                };
            case SubscriptionPlan.FREE:
            default:
                return {
                    jobApplicationsPerMonth: 5,
                    canMessageAllSeekers: false,
                    canMessageOnlySeekers: true,
                };
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
            canMessageAllSeekers: entity.canMessageAllSeekers,
            canMessageOnlySeekers: entity.canMessageOnlySeekers,
        };
    }
}
