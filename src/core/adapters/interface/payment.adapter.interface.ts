import { CreateCustomerDTO, CreatePaymentLinkDTO, CreatePlanDTO, SubscribeToPlanDTO } from "../dto/adapter.dto";

export interface IPaymentAdapter {
    createCustomer(data: CreateCustomerDTO): Promise<string>;
    subscribeToPlan(data: SubscribeToPlanDTO): Promise<string>;
    createPlan(data: CreatePlanDTO): Promise<string>;
    createPaymentLink(data: CreatePaymentLinkDTO): Promise<string>;
    getPlanDetails(planId: string): Promise<{ amount: number; currency: string; }>
}
