import { SeekerSubscriptionPlanDTO } from "../../dto/seeker.subscription.dto";
import { SubscriptionPlan } from "../models/seeker.subscription.entity";

export interface ISeekerSubscriptionService {
    createSubscription(userId: string, plan: SubscriptionPlan, paymentIdentifier?: string): Promise<SeekerSubscriptionPlanDTO>;
    getSubscriptionByUserId(userId: string): Promise<SeekerSubscriptionPlanDTO | null>;
    updateSubscriptionPlan(userId: string, newPlan: SubscriptionPlan): Promise<SeekerSubscriptionPlanDTO>;
    cancelSubscription(userId: string): Promise<boolean>;
    checkSubscriptionStatus(userId: string): Promise<string>;
    getAllSubscriptions(): Promise<SeekerSubscriptionPlanDTO[]>;
    renewSubscription(userId: string): Promise<SeekerSubscriptionPlanDTO>;
    generatePlanDetails(plan: SubscriptionPlan): {
        jobApplicationsPerMonth: number;
        canMessageAllSeekers: boolean;
        canMessageOnlySeekers: boolean;
    };
}
