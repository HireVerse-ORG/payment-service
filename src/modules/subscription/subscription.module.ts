import { Container } from "inversify";
import { loadSeekerSubscriptionContainer } from "./seeker/seeker.subscription.module";
import { loadCompanySubscriptionContainer } from "./company/company.subscription.module";

const loadSubscriptionContainer = (container: Container) => {
    loadSeekerSubscriptionContainer(container);
    loadCompanySubscriptionContainer(container);
};

export {loadSubscriptionContainer}