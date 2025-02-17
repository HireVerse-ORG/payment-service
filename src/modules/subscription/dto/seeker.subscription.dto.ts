import { SubscriptionPlan } from "../seeker/models/seeker.subscription.entity";

export interface SeekerSubscriptionPlanDTO {
    id: string;  
    userId: string;  
    plan: SubscriptionPlan;  
    paymentIdentifier?: string | null;  
    jobApplicationsPerMonth: number;  
    canMessageAnyone: boolean;  
    startDate: Date,
    endDate?: Date
}

export interface UpdateSeekerSubscriptionUsageDTO {
    jobApplicationsUsed?: number;
}
