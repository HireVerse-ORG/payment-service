export interface CreateCustomerDTO {
    email: string;
    name: string;
    metadata?: Record<string, string>;
}

export interface SubscribeToPlanDTO {
    customerId: string;
    planId: string;
    metadata?: Record<string, string>;
}

export interface CreatePlanDTO {
    name: string;
    description: string;
    amount: number; 
    currency: string; 
    interval: 'day' | 'week' | 'month' | 'year'; 
    metadata?: Record<string, string>;
}

export interface CreatePaymentLinkDTO {
    customerId: string;
    priceId: string;
    quantity?: number;
    metadata?: Record<string, string>; 
    successUrl: string; 
    cancelUrl: string; 
}
