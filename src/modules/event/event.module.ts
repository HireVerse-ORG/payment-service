import { Container } from "inversify";
import { kafka } from "@hireverse/kafka-communication";
import { EventController } from "./event.controller";
import TYPES from "../../core/container/container.types";
import { KafkaConnect, KafkaConsumer, KafkaProducer } from "@hireverse/kafka-communication/dist/kafka";
import { logger } from "../../core/utils/logger";

const kafkaConnect = new KafkaConnect({
    clientId: "payment-service",
    brokers: [process.env.KAFKA_SERVER!],
    retry: {
        retries: 10,              
        initialRetryTime: 500,   
        factor: 0.3,              
        multiplier: 2,           
        maxRetryTime: 60_000,    
        restartOnFailure: async (error) => {
            logger.error("Kafka connection failed:", error);
            return true; 
        },
    }
})

export const kafkaProducer = new kafka.KafkaProducer(kafkaConnect, { 
    allowAutoTopicCreation: process.env.KAFKA_AUTO_CREATE_TOPICS === "true",
});
export const kafkaConsumer = new kafka.KafkaConsumer(kafkaConnect, { 
        groupId: "payment-group", 
        allowAutoTopicCreation: process.env.KAFKA_AUTO_CREATE_TOPICS === "true",
    });

export function loadEventContainer(container: Container) {
    container.bind<KafkaConsumer>(TYPES.KafkaConsumer).toConstantValue(kafkaConsumer);
    container.bind<KafkaProducer>(TYPES.KafkaProducer).toConstantValue(kafkaProducer);
    container.bind<EventController>(TYPES.EventController).to(EventController);
}
