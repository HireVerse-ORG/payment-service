import { inject, injectable } from "inversify";
import containerTypes from "../../core/container/container.types";
import { IPaymentAdapter } from "../../core/adapters/interface/payment.adapter.interface";
import { IPaymentService } from "./interface/payment.service.interface";
import { CreatePaymentLinkDTO, CreatePlanDTO } from "../../core/adapters/dto/adapter.dto";

@injectable()
export class PaymentService implements IPaymentService {
    @inject(containerTypes.PaymentAdapter) private paymentAdapter!: IPaymentAdapter;

    async createCustomer(email: string, name: string): Promise<string> {
        const customerId = await this.paymentAdapter.createCustomer({email, name});
        return customerId;
    }

    async subscribeToPlan(customerId: string, planId: string): Promise<string> {
        const subscriptionId = await this.paymentAdapter.subscribeToPlan({customerId, planId});
        return subscriptionId;
    }

    async getPlanDetails(planId: string): Promise<{ amount: number; currency: string; }> {
        return await this.paymentAdapter.getPlanDetails(planId);
    }

    async genratePlan(data: CreatePlanDTO): Promise<string> {
        const planId = await this.paymentAdapter.createPlan(data);
        return planId
    }

    async generatePaymentLink(data: CreatePaymentLinkDTO): Promise<string> {
        const url = await this.paymentAdapter.createPaymentLink({...data});
        return url
    }
}