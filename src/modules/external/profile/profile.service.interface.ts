import { RPCServiceResponseDto } from "../dto/rpc.response.dto";

export interface IProfileService {
    getSeekerProfilesByUserId: (userId: string) => Promise<RPCServiceResponseDto>;
    getCompanyProfilesByUserId: (userId: string) => Promise<RPCServiceResponseDto>;
}