import { CompanySubscriptionPlan, CompanySubscriptionPlans } from "../models/company.subscription.entity";

export interface ICompanySubscriptionService {
    createSubscription(userId: string, plan: CompanySubscriptionPlans, paymentIdentifier?: string): Promise<CompanySubscriptionPlan>;
    getSubscriptionByUserId(userId: string): Promise<CompanySubscriptionPlan | null>;
    updateSubscriptionPlan(userId: string, newPlan: CompanySubscriptionPlans): Promise<CompanySubscriptionPlan>;
    cancelSubscription(userId: string): Promise<boolean>;
    checkSubscriptionStatus(userId: string): Promise<string>;
    renewSubscription(userId: string): Promise<CompanySubscriptionPlan>;
    generatePlanDetails(plan: CompanySubscriptionPlans): {
        jobPostLimit: number;
        resumeAccessLimit: number;
        profileAccessLimit: number;
    };
}