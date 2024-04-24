import { injectable } from "inversify";
import "reflect-metadata";
import { IGroupRepository } from "../IGroupRepository";
import { BaseRepository } from "./BaseRepository";
import { Sequelize } from 'sequelize';
import Group from "../../Models/Group";
import { Client } from "../../Models";

@injectable()
export class GroupRepository
	extends BaseRepository<Group>
	implements IGroupRepository {
	constructor() {
		super(Group);
	}

	public async findByCond(cond: any) {
		let group = await this._model.findAll(cond)
		return group
	}

	public async getTotalPerGroup() {
		let total_per_group = await this._model.findAll({
			attributes: ['name']
		})

		return total_per_group
	}
}
