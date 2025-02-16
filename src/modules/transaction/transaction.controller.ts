import { inject, injectable } from "inversify";
import TYPES from "../../core/container/container.types";
import { ITransactionService } from "./interfaces/transaction.service.interface";
import asyncWrapper from "@hireverse/service-common/dist/utils/asyncWrapper";
import { AuthRequest } from "@hireverse/service-common/dist/token/user/userRequest";
import { Response } from "express";
import { TransactionStatus, UserType } from "./transaction.entity";
import { IProfileService } from "../external/profile/profile.service.interface";

@injectable()
export class TransactionController {
    @inject(TYPES.TransactionService) private transactionService!: ITransactionService;
    @inject(TYPES.ProfileService) private ProfileService!: IProfileService;

    /**
   * @route GET /api/payment/transactions/list
   * @scope Admin
   **/
    public listTransactions = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;
        const status = req.query.status as TransactionStatus || undefined;

        const transactions = await this.transactionService.listTransactions({
            status,
            page,
            limit
        })

        const transactionWithProfile = await Promise.all(
            transactions.data.map(async (tr) => {
                try {
                    if (tr.userType === UserType.SEEKER) {
                        const { response } = await this.ProfileService.getSeekerProfilesByUserId(tr.userId);
                        return {
                            ...tr,
                            profile: {
                                name: response.profile.profileName,
                                image: response.profile.image,
                            },
                        };
                    } else if (tr.userType === UserType.COMPANY) {
                        const { response } = await this.ProfileService.getCompanyProfilesByUserId(tr.userId);
                        return {
                            ...tr,
                            profile: {
                                name: response.profile.name,
                                image: response.profile.image,
                            },
                        };
                    } else {
                        return {
                            ...tr,
                            profile: null
                        };
                    }
                } catch (error) {
                    return {
                        ...tr,
                        profile: null
                    };
                }
            })
        );

        return res.json({
            ...transactions,
            data: transactionWithProfile
        });
    })
}