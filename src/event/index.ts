import { container } from "../core/container";
import TYPES from "../core/container/container.types";
import { EventController } from "./event.controller";
import { logger } from "../core/utils/logger";
import { kafkaConsumer, kafkaProducer } from "./event.container";

const eventController = container.get<EventController>(TYPES.EventController);

export async function startEventService() {
    try {
        await kafkaConsumer.connect();
        await eventController.initializeSubscriptions();
        await kafkaProducer.connect();
        logger.info("Event service started successfully.");
    } catch (error) {
        logger.error("Error starting the event service:", error);
    }
}

export async function stopEventService() {
    try {
        await kafkaConsumer.disconnect();
        await kafkaProducer.disconnect();
        logger.info("Event service stopped successfully.");
    } catch (error) {
        logger.error("Error stopping the event service:", error);
    }
}
