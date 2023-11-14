import { container } from "../Configs";
import { Permission } from "../Models";
import { IPermissionRepository } from "../Repositories/IPermissionRepository";
import { TYPES } from "../Repositories/type";

export class AuthorizationService {
    constructor(
        private permissionRepository = container.get<IPermissionRepository>(TYPES.IPermissionRepository)
    ) {}
    public async getPermisstions(role: string) {
        return await this.permissionRepository.findAllByRole(role)
    }
}