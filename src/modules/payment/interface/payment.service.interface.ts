import { CreatePaymentLinkDTO, CreatePlanDTO } from "../../../core/adapters/dto/adapter.dto";

export interface IPaymentService {
    createCustomer(email: string, name: string): Promise<string>;
    subscribeToPlan(customerId: string, planId: string): Promise<string>;
    genratePlan(data: CreatePlanDTO): Promise<string>;
    generatePaymentLink(data: CreatePaymentLinkDTO): Promise<string>;
}