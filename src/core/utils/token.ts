import {TokenService} from "@hireverse/service-common/dist/token/TokenService";
import {UserPayload} from "@hireverse/service-common/dist/token/user/userPayload";
import { checkEnvVariables } from '@hireverse/service-common/dist/utils';

checkEnvVariables('JWT_SECRET_KEY');
export const tokenService = new TokenService<UserPayload>({secretKey:process.env.JWT_SECRET_KEY!});
