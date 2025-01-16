import { inject, injectable } from "inversify";
import { ISeekerSubscriptionUsageRepository } from "../interfaces/seeker.subscription.usage.repository.interface";
import { ISeekerSubscriptionUsageService } from "../interfaces/seeker.subscription.usage.service.interface";
import containerTypes from "../../../../core/container/container.types";
import { SeekerSubscriptionUsage } from "../models/seeker.subscription.usage.entity";
import { BadRequestError, NotFoundError } from "@hireverse/service-common/dist/app.errors";

@injectable()
export class SeekerSubscriptionUsageService implements ISeekerSubscriptionUsageService {
    @inject(containerTypes.SeekerSubscriptionUsageRepository) private repo!: ISeekerSubscriptionUsageRepository;

    async createUsage(userId: string): Promise<SeekerSubscriptionUsage> {
        const usage = await this.repo.create({userId});
        return usage;
    }

    async getUsageByUserId(userId: string): Promise<SeekerSubscriptionUsage | null> {
        return await this.repo.findOne({where: {userId}});
    }

    async getOrCreateUsage(userId: string): Promise<SeekerSubscriptionUsage> {
        let usage = await this.getUsageByUserId(userId);
        
        if(!usage){
            usage = await this.createUsage(userId);
        }

        return usage;
    }

    async getJobApplicationCount(userId: string): Promise<number> {
        const usage = await this.getOrCreateUsage(userId);
        return usage.jobApplicationsUsed;
    }

    async resetUsage(userId: string): Promise<SeekerSubscriptionUsage> {
        const usage = await this.getUsageByUserId(userId);

        if(!usage){
            throw new NotFoundError("Users usage not forund");
        }

        const resetedUsage =  await this.repo.update(usage.id, {jobApplicationsUsed: 0});

        if(!resetedUsage){
            throw new BadRequestError("Failed to reset Usage");
        }

        return resetedUsage;
    }
}