import { Container } from "inversify";
import { loadSubscriptionContainer } from "../../modules/subscription/subscription.module";

const container = new Container();

loadSubscriptionContainer(container)

export { container };

