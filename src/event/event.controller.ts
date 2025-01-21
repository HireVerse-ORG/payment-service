import { inject, injectable } from "inversify";
import TYPES from "../core/container/container.types";
import { KafkaTopics } from "@hireverse/kafka-communication/dist/events/topics";
import { KafkaConsumer, KafkaProducer } from "@hireverse/kafka-communication/dist/kafka";
import { ICompanySubscriptionUsageService } from "../modules/subscription/company/interfaces/company.subscription.usage.service.interface";
import { logger } from "../core/utils/logger";
import { ICompanySubscriptionService } from "../modules/subscription/company/interfaces/company.subscription.service.interface";
import { JobStatusUpdatedEvent, JobValidationMessage } from "@hireverse/kafka-communication/dist/events";

@injectable()
export class EventController {
    @inject(TYPES.KafkaConsumer) private consumer!: KafkaConsumer;
    @inject(TYPES.KafkaProducer) private producer!: KafkaProducer;
    @inject(TYPES.CompanySubscriptionUsageService) private companyUsageService!: ICompanySubscriptionUsageService;
    @inject(TYPES.CompanySubscriptionService) private companySubscriptionService!: ICompanySubscriptionService;


    async initializeSubscriptions() {
        await this.subscribeToJobPostedEvent();
    }

    private subscribeToJobPostedEvent = async () => {
        await this.consumer.subscribeToTopic<JobValidationMessage>(
            KafkaTopics.JOB_VALIDATION_REQUESTED,
            async (message) => {
                try {
                    const { job_id, user_id } = message;
    
                    const usage = await this.companyUsageService.getUsageByUserId(user_id);
                    const subscription = await this.companySubscriptionService.getSubscriptionByUserId(user_id);
    
                    if (usage && subscription) {
                        const jobpostCount = usage.jobsPosted + 1;
                        
                        if (subscription.jobPostLimit === -1 || jobpostCount <= subscription.jobPostLimit) {
                            await this.companyUsageService.updateUsage(usage.id, {
                                jobsPosted: jobpostCount,
                            });
    
                            const jobStatusSuccessEvent = JobStatusUpdatedEvent({
                                key: job_id,
                                value: {
                                    job_id,
                                    status: "success",
                                    reason: null,
                                },
                            });
    
                            await this.producer.sendEvent(jobStatusSuccessEvent);
                        } else {
                            const jobStatusFailureEvent = JobStatusUpdatedEvent({
                                key: job_id,
                                value: {
                                    job_id,
                                    status: "failed",
                                    reason: "Job post limit exceeded",
                                },
                            });
    
                            await this.producer.sendEvent(jobStatusFailureEvent);
                        }
                    } 
                } catch (error: any) {
                    logger.error(
                        error.message ||
                            `Failed to process message from ${KafkaTopics.JOB_VALIDATION_REQUESTED}:`
                    );
    
                    const jobStatusErrorEvent = JobStatusUpdatedEvent({
                        key: message.job_id,
                        value: {
                            job_id: message.job_id,
                            status: "failed",
                            reason: "Internal error occurred while processing validation",
                        },
                    });
    
                    await this.producer.sendEvent(jobStatusErrorEvent);
                }
            }
        );
    };
    
}