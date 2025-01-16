import { Container } from "inversify";
import { WebhookController } from "./webhook.controller";
import containerTypes from "../../core/container/container.types";

const loadWebhookContainer = (container: Container) => {
    container.bind<WebhookController>(containerTypes.WebhookController).to(WebhookController);
};

export {loadWebhookContainer}