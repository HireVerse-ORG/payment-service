import { injectable } from "inversify";
import { IProfileService } from "./profile.service.interface";
import { RPCServiceResponseDto } from "../dto/rpc.response.dto";
import { companyProfileClient, seekerProfileClient } from "../../../core/rpc/clients";
import { mapGrpcErrorToHttpStatus } from "@hireverse/service-common/dist/utils";

@injectable()
export class ProfileService implements IProfileService {
    
    async getSeekerProfilesByUserId(userId: string) :Promise<RPCServiceResponseDto> {
        return new Promise((resolve, reject) => {
            seekerProfileClient.GetSeekerProfileByUserId({ userId }, (error: any | null, response: any) => {
                if (error) {
                    const status = mapGrpcErrorToHttpStatus(error);
                    const message = error.details;
                    return reject({ status, message, response });
                }
    
                return resolve({ status: 200, message: "Profiles Feteched", response });
            })
        })

    }

    async getCompanyProfilesByUserId(userId: string) :Promise<RPCServiceResponseDto> {
        return new Promise((resolve, reject) => {
            companyProfileClient.GetCompanyProfileByUserId({ userId }, (error: any | null, response: any) => {
                if (error) {
                    const status = mapGrpcErrorToHttpStatus(error);
                    const message = error.details;
                    return reject({ status, message, response });
                }
    
                return resolve({ status: 200, message: "Profiles Feteched", response });
            })
        })

    }
}