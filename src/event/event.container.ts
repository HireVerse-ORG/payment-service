import { Container } from "inversify";
import { kafka } from "@hireverse/kafka-communication";
import { EventController } from "./event.controller";
import TYPES from "../core/container/container.types";
import { KafkaConnect, KafkaConsumer, KafkaProducer } from "@hireverse/kafka-communication/dist/kafka";

const kafkaConnect = new KafkaConnect({
    clientId: "payment-service",
    brokers: [process.env.KAFKA_SERVER!],
    retry: {
        retries: 5, 
        factor: 0.2,
    }
})

export const kafkaProducer = new kafka.KafkaProducer(kafkaConnect, { 
    allowAutoTopicCreation: process.env.NODE_ENV === "development"
});
export const kafkaConsumer = new kafka.KafkaConsumer(kafkaConnect, { 
        groupId: "payment-group", 
        allowAutoTopicCreation: process.env.NODE_ENV === "development"
    });

export function loadEventContainer(container: Container) {
    container.bind<KafkaConsumer>(TYPES.KafkaConsumer).toConstantValue(kafkaConsumer);
    container.bind<KafkaProducer>(TYPES.KafkaProducer).toConstantValue(kafkaProducer);
    container.bind<EventController>(TYPES.EventController).to(EventController);
}
