import {CompanyProfileClient, SeekerProfileClient} from '@hireverse/service-protos/dist/clients/profile-client';

export const companyProfileClient = CompanyProfileClient(process.env.PROFILE_SERVICE_URL!);
export const seekerProfileClient = SeekerProfileClient(process.env.PROFILE_SERVICE_URL!);