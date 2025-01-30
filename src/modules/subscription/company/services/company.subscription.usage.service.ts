import { inject, injectable } from "inversify";
import containerTypes from "../../../../core/container/container.types";
import { ICompanySubscriptionUsageService } from "../interfaces/company.subscription.usage.service.interface";
import { ICompanySubscriptionUsageRepository } from "../interfaces/company.subscription.usage.repository.interface";
import { CompanySubscriptionUsage } from "../models/company.subscription.usage.entity";
import { BadRequestError, NotFoundError } from "@hireverse/service-common/dist/app.errors";
import { UpdateCompanySubscriptionUsageDTO } from "../../dto/company.subscription.dto";

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

        const resetedUsage = await this.repo.update(usage.id, { jobsPosted: 0, applicantionAccessed: 0, applicationIdsAccessed: null });

        if (!resetedUsage) {
            throw new BadRequestError("Failed to reset Usage");
        }

        return resetedUsage;
    }

    async updateApplicationAccess(userId: string, applicationId: string): Promise<boolean> {
        const usage = await this.getUsageByUserId(userId);

        if (!usage) {
            throw new NotFoundError("Users usage not forund");
        }

        const {applicantionAccessed, applicationIdsAccessed} = usage;

        if (applicationIdsAccessed && applicationIdsAccessed.includes(applicationId)) {
            return false;    
        }

        
        const ids = applicationIdsAccessed ? [...applicationIdsAccessed, applicationId] : [applicationId];
        const count = applicantionAccessed + 1;
        await this.repo.update(usage.id, {applicantionAccessed: count, applicationIdsAccessed: ids});

        return true
    }

    async updateUsage(id: string, data: UpdateCompanySubscriptionUsageDTO): Promise<CompanySubscriptionUsage> {
        const updatedUsage = await this.repo.update(id, data);
        if (!updatedUsage) {
            throw new BadRequestError("Failed to update subscription usage");
        }
        return updatedUsage;
    }
}