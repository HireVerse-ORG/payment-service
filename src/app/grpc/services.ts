import { loadProto } from '@hireverse/service-protos';
import { container } from '../../core/container';
import containerTypes from '../../core/container/container.types';
import { SeekerSubscriptionGrpcController } from '../../modules/subscription/seeker/controllers/seeker.subscription.grpc.controller';

const paymentProto = loadProto('payment/payment.proto');

const seekerSubscriptionGrpcController = container.get<SeekerSubscriptionGrpcController>(containerTypes.SeekerSubscriptionGrpcController);

export const seekerPaymentService = {
    name: "SeekerPayment Service",
    serviceDefinition: paymentProto.payment.SeekerPaymentService.service,
    implementation: seekerSubscriptionGrpcController.getProcedures(),
}
