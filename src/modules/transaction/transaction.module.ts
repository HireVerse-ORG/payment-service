import { Container } from "inversify";
import TYPES from "../../core/container/container.types";
import { ITransactionService } from "./interfaces/transaction.service.interface";
import { TransactionService } from "./transaction.service";
import { ITransactionRepository } from "./interfaces/transaction.repository.interface";
import { TransactionRepository } from "./transaction.repository";
import { TransactionController } from "./transaction.controller";

const loadTransactionContainer = (container: Container) => {
    container.bind<TransactionController>(TYPES.TransactionController).to(TransactionController);
    container.bind<ITransactionService>(TYPES.TransactionService).to(TransactionService);
    container.bind<ITransactionRepository>(TYPES.TransactionRepository).to(TransactionRepository);
}

export {loadTransactionContainer}