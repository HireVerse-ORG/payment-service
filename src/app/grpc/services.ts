import { loadProto } from '@hireverse/service-protos';
import { container } from '../../core/container';
import containerTypes from '../../core/container/container.types';
import { SeekerSubscriptionGrpcController } from '../../modules/subscription/seeker/controllers/seeker.subscription.grpc.controller';
import { CompanySubscriptionGrpcController } from '../../modules/subscription/company/controllers/company.subscription.grpc.controller';

const paymentProto = loadProto('payment/payment.proto');

const seekerSubscriptionGrpcController = container.get<SeekerSubscriptionGrpcController>(containerTypes.SeekerSubscriptionGrpcController);
const companySubscriptionGrpcController = container.get<CompanySubscriptionGrpcController>(containerTypes.CompanySubscriptionGrpcController);

export const seekerPaymentService = {
    name: "SeekerPayment Service",
    serviceDefinition: paymentProto.payment.SeekerPaymentService.service,
    implementation: seekerSubscriptionGrpcController.getProcedures(),
}

export const companyPaymentService = {
    name: "CompanyPayment Service",
    serviceDefinition: paymentProto.payment.CompanyPaymentService.service,
    implementation: companySubscriptionGrpcController.getProcedures(),
}
