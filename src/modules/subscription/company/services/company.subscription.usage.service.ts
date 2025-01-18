import { inject, injectable } from "inversify";
import containerTypes from "../../../../core/container/container.types";
import { ICompanySubscriptionUsageService } from "../interfaces/company.subscription.usage.service.interface";
import { ICompanySubscriptionUsageRepository } from "../interfaces/company.subscription.usage.repository.interface";
import { CompanySubscriptionUsage } from "../models/company.subscription.usage.entity";
import { BadRequestError, NotFoundError } from "@hireverse/service-common/dist/app.errors";

@injectable()
export class CompanySubscriptionUsageService implements ICompanySubscriptionUsageService {
    @inject(containerTypes.CompanySubscriptionUsageRepository) repo!: ICompanySubscriptionUsageRepository;

    async createUsage(userId: string): Promise<CompanySubscriptionUsage> {
        const usage = await this.repo.create({ userId });
        return usage;
    }

    async getUsageByUserId(userId: string): Promise<CompanySubscriptionUsage | null> {
        return await this.repo.findOne({ where: { userId } });
    }

    async getOrCreateUsage(userId: string): Promise<CompanySubscriptionUsage> {
        let usage = await this.getUsageByUserId(userId);

        if (!usage) {
            usage = await this.createUsage(userId);
        }

        return usage;
    }

    async resetUsage(userId: string): Promise<CompanySubscriptionUsage> {
        const usage = await this.getUsageByUserId(userId);

        if (!usage) {
            throw new NotFoundError("Users usage not forund");
        }

        const resetedUsage = await this.repo.update(usage.id, { jobsPosted: 0, profilesViewed: 0, resumesAccessed: 0 });

        if (!resetedUsage) {
            throw new BadRequestError("Failed to reset Usage");
        }

        return resetedUsage;
    }
}