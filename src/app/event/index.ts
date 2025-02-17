import { container } from "../../core/container";
import TYPES from "../../core/container/container.types";
import { EventController } from "../../modules/event/event.controller";
import { logger } from "../../core/utils/logger";
import { KafkaConsumer, KafkaProducer } from "@hireverse/kafka-communication/dist/kafka";

const eventController = container.get<EventController>(TYPES.EventController);
const kafkaConsumer = container.get<KafkaConsumer>(TYPES.KafkaConsumer);
const kafkaProducer = container.get<KafkaProducer>(TYPES.KafkaProducer);

export async function startEventService() {
    try {
        await kafkaProducer.connect();
        await kafkaConsumer.connect();
        await eventController.initializeSubscriptions();
        logger.info("Event service started successfully.");
    } catch (error) {
        logger.error("Error starting the event service:", error);
    }
}

export async function stopEventService() {
    try {
        await kafkaProducer.disconnect();
        await kafkaConsumer.disconnect();
        logger.info("Event service stopped successfully.");
    } catch (error) {
        logger.error("Error stopping the event service:", error);
    }
}
