import { inject, injectable } from "inversify";
import TYPES from "../core/container/container.types";
import { KafkaTopics } from "@hireverse/kafka-communication/dist/events/topics";
import { JobPostedMessage } from "@hireverse/kafka-communication/dist/events/jobPosted";
import { KafkaConsumer } from "@hireverse/kafka-communication/dist/kafka";
import { ICompanySubscriptionUsageService } from "../modules/subscription/company/interfaces/company.subscription.usage.service.interface";
import { logger } from "../core/utils/logger";
import { ICompanySubscriptionService } from "../modules/subscription/company/interfaces/company.subscription.service.interface";

@injectable()
export class EventController {
    @inject(TYPES.KafkaConsumer) private consumer!: KafkaConsumer;
    @inject(TYPES.CompanySubscriptionUsageService) private companyUsageService!: ICompanySubscriptionUsageService;
    @inject(TYPES.CompanySubscriptionService) private companySubscriptionService!: ICompanySubscriptionService;


    async initializeSubscriptions() {
        await this.subscribeToJobPostedEvent();
    }

    private subscribeToJobPostedEvent = async () => {
        console.log(`Subscribing to topic: ${KafkaTopics.JOB_POSTED}`);
        await this.consumer.subscribeToTopic<JobPostedMessage>(
            KafkaTopics.JOB_POSTED,
            async (message) => {
                try {
                    const usage = await this.companyUsageService.getUsageByUserId(message.user_id);
                    const subscription = await this.companySubscriptionService.getSubscriptionByUserId(message.user_id);

                    if (usage && subscription) {
                        const jobpostCount = usage.jobsPosted + 1;
                        if(jobpostCount <= subscription.jobPostLimit){
                            await this.companyUsageService.updateUsage(usage.id, {
                                jobsPosted: jobpostCount,
                            });
                        }
                    } 
                } catch (error: any) {
                    logger.error(error.message || `Failed to process message from ${KafkaTopics.JOB_POSTED}:`);
                }
            }
        );
    };
}