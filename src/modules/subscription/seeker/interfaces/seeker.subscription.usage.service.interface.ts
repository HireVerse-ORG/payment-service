import { UpdateSeekerSubscriptionUsageDTO } from '../../dto/seeker.subscription.dto';
import { SeekerSubscriptionUsage } from '../models/seeker.subscription.usage.entity';

export interface ISeekerSubscriptionUsageService {
    createUsage(userId: string): Promise<SeekerSubscriptionUsage>;
    getJobApplicationCount(userId: string): Promise<number>;
    updateUsage(id: string, data: UpdateSeekerSubscriptionUsageDTO): Promise<SeekerSubscriptionUsage>;
    getUsageByUserId(userId: string): Promise<SeekerSubscriptionUsage | null>;
    getOrCreateUsage(userId: string): Promise<SeekerSubscriptionUsage>;
    resetUsage(userId: string): Promise<SeekerSubscriptionUsage>;
}
