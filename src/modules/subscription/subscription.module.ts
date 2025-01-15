import { Container } from "inversify";
import { loadSeekerSubscriptionContainer } from "./seeker/seeker.subscription.module";

const loadSubscriptionContainer = (container: Container) => {
    loadSeekerSubscriptionContainer(container);
};

export {loadSubscriptionContainer}