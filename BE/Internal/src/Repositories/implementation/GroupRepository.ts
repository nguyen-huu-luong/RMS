import { injectable } from "inversify";
import "reflect-metadata";
import { IGroupRepository } from "../IGroupRepository";
import { BaseRepository } from "./BaseRepository";
import Group from "../../Models/Group";

@injectable()
export class GroupRepository
	extends BaseRepository<Group>
	implements IGroupRepository
{
	constructor() {
		super(Group);
	}

	public async findByCond(cond: any) {
		let group = await this._model.findAll(cond)
		return group
	}
}
