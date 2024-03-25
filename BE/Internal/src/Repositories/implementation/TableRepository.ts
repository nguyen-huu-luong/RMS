import { injectable } from "inversify";
import "reflect-metadata";
import message from "../../Utils/Message";
import { ITableRepository } from "../ITableRepository";
import { BaseRepository } from "./BaseRepository";
import { Table } from "../../Models";
import { Op } from "sequelize";
@injectable()
export class TableRepository
	extends BaseRepository<Table>
	implements ITableRepository {
	constructor() {
		super(Table);
	}

	public async viewTables(floor: any) {
		try {
			const allTables = await this._model.findAll({
				where: {
					floorId: floor
				},
				order:  [
					["id", "ASC"]
				]
			});
			return allTables;
		} catch (err) {
			message.queryError(err);
		}
	}

	public async createTable(table_name: any, floor: any) {
		try {
			let table = await this._model.create({
				name: table_name,
				numRes: 0,
				status: "Free",
				createdAt: new Date(),
				updatedAt: new Date(),
			})
			await this._model.update({ floorId: floor.id }, {
				where: { name: table_name }
			})
			return true
		}
		catch (err) {
			return false
		}
	}

	public async findTable(table_name: any) {
		try {
			let table = await this._model.findAll({
				attributes: ['name'],
				where: {
					name: table_name
				}
			})

			return table
		}
		catch (err) {
			return false
		}
	}

	public async deleteTable(table_names: any) {
		try {
			await this._model.destroy({
				where: {
					name: {
						[Op.in]: table_names
					}
				}
			})

			return true
		}
		catch (err) {
			return false
		}
	}

	public async updateNumRes(num: number, table_ids: any) {
		try {

			await this._model.increment('numRes', {by: num, where: {
				id: {
					[Op.in]: table_ids
				}
			}})

			return true
		}
		catch (err) {
			return false
		}
	}
}
