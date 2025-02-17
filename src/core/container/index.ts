import { Container } from "inversify";
import { loadSubscriptionContainer } from "../../modules/subscription/subscription.module";
import { loadPaymentContainer } from "../../modules/payment/payment.module";
import { loadWebhookContainer } from "../../modules/webhooks/webhook.module";
import { loadEventContainer } from "../../modules/event/event.module";
import { loadTransactionContainer } from "../../modules/transaction/transaction.module";
import { loadExternalContainer } from "../../modules/external/external.module";
import { loadStatisticsContainer } from "../../modules/statistics/statistics.module";

const container = new Container();

loadExternalContainer(container)
loadEventContainer(container)
loadWebhookContainer(container);
loadPaymentContainer(container)
loadSubscriptionContainer(container);
loadTransactionContainer(container);
loadStatisticsContainer(container);

export { container };

