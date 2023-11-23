import { Permission } from "../Models";

export interface IPermissionRepository {
    findAllByRole(role : string) : Promise<Permission[]> ;
}