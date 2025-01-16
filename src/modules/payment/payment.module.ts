import { Container } from "inversify";
import { StripePaymentAdapter } from "../../core/adapters/stripe";
import containerTypes from "../../core/container/container.types";
import { PaymentService } from "./payment.service";
import { IPaymentAdapter } from "../../core/adapters/interface/payment.adapter.interface";

const loadPaymentContainer = (container: Container) => {
    container.bind<IPaymentAdapter>(containerTypes.PaymentAdapter).to(StripePaymentAdapter);
    container.bind<PaymentService>(containerTypes.PaymentService).to(PaymentService);
    
};

export {loadPaymentContainer}