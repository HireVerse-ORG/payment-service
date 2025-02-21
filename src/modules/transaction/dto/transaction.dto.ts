import { TransactionStatus, UserType } from "../transaction.entity";

export interface CreateTransactionDto {
    userId: string;
    userType: UserType;
    amount: number;
    currency?: string;
    paymentIdentifier?: string;
    status?: TransactionStatus;
    metadata?: Record<string, any>;
}
