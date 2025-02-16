import { Container } from "inversify";
import TYPES from "../../core/container/container.types";
import { ProfileService } from "./profile/profile.service";
import { IProfileService } from "./profile/profile.service.interface";

export function loadExternalContainer(container: Container) {
    container.bind<IProfileService>(TYPES.ProfileService).to(ProfileService);
}
