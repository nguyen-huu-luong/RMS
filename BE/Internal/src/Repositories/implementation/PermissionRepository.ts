import { injectable } from "inversify";
import "reflect-metadata";
import { IClientRepository } from "../IClientRepository";
import { BaseRepository } from "./BaseRepository";
import { Client, Permission } from "../../Models";
import Token from "../../Models/Token";
import { REFRESH_TOKEN } from "../../Constants";
import { IPermissionRepository } from "../IPermissionRepository";

@injectable()
export class PermissionRepository
	extends BaseRepository<Permission>
	implements IPermissionRepository
{
	constructor() {
		super(Permission);
	}

	public async findAllByRole(role: string): Promise<Permission[]> {
		const permissions = await this._model.findAll({where: {role}})
        return permissions;
	}
}
