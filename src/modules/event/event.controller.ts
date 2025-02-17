import { inject, injectable } from "inversify";
import TYPES from "../../core/container/container.types";
import { KafkaTopics } from "@hireverse/kafka-communication/dist/events/topics";
import { KafkaConsumer, KafkaProducer } from "@hireverse/kafka-communication/dist/kafka";
import { ICompanySubscriptionUsageService } from "../subscription/company/interfaces/company.subscription.usage.service.interface";
import { logger } from "../../core/utils/logger";
import { ICompanySubscriptionService } from "../subscription/company/interfaces/company.subscription.service.interface";
import { JobAppliedAccepted, JobAppliedMessage, JobApplicationViewedMessage,
        JobAppliedRejected, JobValidationMessage, 
        JobPostAcceptedEvent,
        JobPostRejectedEvent,
        JobApplicationViewUpdatedEvent} from "@hireverse/kafka-communication/dist/events";
import { ISeekerSubscriptionUsageService } from "../subscription/seeker/interfaces/seeker.subscription.usage.service.interface";
import { ISeekerSubscriptionService } from "../subscription/seeker/interfaces/seeker.subscription.service.interface";

@injectable()
export class EventController {
    @inject(TYPES.KafkaConsumer) private consumer!: KafkaConsumer;
    @inject(TYPES.KafkaProducer) private producer!: KafkaProducer;
    @inject(TYPES.CompanySubscriptionUsageService) private companyUsageService!: ICompanySubscriptionUsageService;
    @inject(TYPES.CompanySubscriptionService) private companySubscriptionService!: ICompanySubscriptionService;
    @inject(TYPES.SeekerSubscriptionUsageService) private seekerUsageService!: ISeekerSubscriptionUsageService;
    @inject(TYPES.SeekerSubscriptionService) private seekerSubscriptionService!: ISeekerSubscriptionService;


    async initializeSubscriptions() {
        await this.consumer.subscribeToTopics([
            { topic: KafkaTopics.JOB_APPLIED, handler: this.jobAppliedEventHandler },
            { topic: KafkaTopics.JOB_VALIDATION_REQUESTED, handler: this.jobPostedEventHandler },
            { topic: KafkaTopics.JOB_APPLICATION_VIEWED, handler: this.jobApplicationViewedHandler },
        ])
    }

    private jobApplicationViewedHandler = async (message: JobApplicationViewedMessage) => {
        const {job_application_id, viewer_user_id} = message;
        try {
            const updated = await this.companyUsageService.updateApplicationAccess(viewer_user_id, job_application_id);
            if(updated){
                const viewUpdatedEvent = JobApplicationViewUpdatedEvent({ key: message.job_application_id, value: message });
                await this.producer.sendEvent(viewUpdatedEvent);
            }
        } catch (error) {
            logger.error(`Failed to process message from ${KafkaTopics.JOB_APPLICATION_VIEWED}`);
        }
    }

    private jobAppliedEventHandler = async (message: JobAppliedMessage) => {
        const { job_application_id, user_id } = message;
        try {
            const usage = await this.seekerUsageService.getUsageByUserId(user_id);
            const subscription = await this.seekerSubscriptionService.getSubscriptionByUserId(user_id);
            if (usage && subscription) {
                const jobAppliedCount = usage.jobApplicationsUsed + 1;
                if (subscription.jobApplicationsPerMonth === -1 || jobAppliedCount <= subscription.jobApplicationsPerMonth) {
                    await this.seekerUsageService.updateUsage(usage.id, { jobApplicationsUsed: jobAppliedCount });
                    const jobApplicationAcceptedEvent = JobAppliedAccepted({
                        key: job_application_id,
                        value: {
                            job_application_id,
                            user_id,
                        }
                    })
                    this.producer.sendEvent(jobApplicationAcceptedEvent);

                } else {
                    const jobApplicationRejectedEvent = JobAppliedRejected({
                        key: job_application_id,
                        value: {
                            job_application_id,
                            user_id,
                            reason: "Job Application limit exceeded"
                        }
                    })
                    this.producer.sendEvent(jobApplicationRejectedEvent);
                }
            }

        } catch (error) {
            logger.error(`Failed to process message from ${KafkaTopics.JOB_APPLIED}`);
        }
    }

    private jobPostedEventHandler = async (message: JobValidationMessage) => {
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

                    const jobPostAcceptedEvent = JobPostAcceptedEvent({
                        key: job_id,
                        value: message
                    })

                    await this.producer.sendEvent(jobPostAcceptedEvent)
                } else {
                    const jobRejectedEvent = JobPostRejectedEvent({
                        key: job_id,
                        value: {...message, reason: "Job post limit exceeded"}
                    })
                    await this.producer.sendEvent(jobRejectedEvent)
                }
            }
        } catch (error: any) {
            logger.error(
                error.message ||
                `Failed to process message from ${KafkaTopics.JOB_VALIDATION_REQUESTED}:`
            );
        }
    }

}