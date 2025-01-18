import { CompanySubscriptionUsage } from "../models/company.subscription.usage.entity";

export interface ICompanySubscriptionUsageService {
    createUsage(userId: string): Promise<CompanySubscriptionUsage>;
    getUsageByUserId(userId: string): Promise<CompanySubscriptionUsage | null>;
    getOrCreateUsage(userId: string): Promise<CompanySubscriptionUsage>;
    resetUsage(userId: string): Promise<CompanySubscriptionUsage>;
}