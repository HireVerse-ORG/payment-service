import { Container } from "inversify";
import { loadSubscriptionContainer } from "../../modules/subscription/subscription.module";
import { loadPaymentContainer } from "../../modules/payment/payment.module";
import { loadWebhookContainer } from "../../modules/webhooks/webhook.module";

const container = new Container();

loadWebhookContainer(container);
loadPaymentContainer(container)
loadSubscriptionContainer(container)

export { container };

