import { SubscriptionPlan } from "../seeker/seeker.subscription.entity";

export interface SeekerSubscriptionPlanDTO {
    id: string;  
    userId: string;  
    plan: SubscriptionPlan;  
    paymentIdentifier?: string | null;  
    jobApplicationsPerMonth: number;  
    canMessageAllSeekers: boolean;  
    canMessageOnlySeekers: boolean; 
}