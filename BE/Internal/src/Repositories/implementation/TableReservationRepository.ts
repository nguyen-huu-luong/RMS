import { injectable } from "inversify";
import "reflect-metadata";
import { ITableReservationRepository } from "../ITableReservationRepository";
import { BaseRepository } from "./BaseRepository";
import { TableReservation } from "../../Models";
import message from "../../Utils/Message";
import { table } from "console";
import { Op } from "sequelize";

@injectable()
export class TableReservationRepository
	extends BaseRepository<TableReservation>
	implements ITableReservationRepository {
	constructor() {
		super(TableReservation);
	}

	public async getVaidReservation(tableId_: any) {
		if (tableId_ == "") {
			let table_ids = this._model.findAll({
				attributes: ['reservationId']
			})
			return table_ids
		}
		let table_ids = this._model.findAll({
			attributes: ['reservationId'],
			where: {
				tableId: tableId_
			}
		})
		return table_ids
	}

	public async getTables(resId_: any) {
		let table_ids = await this._model.findAll({
			attributes: ['tableId'],
			where: {
				reservationId: resId_
			}
		})
		return table_ids
	}

	public async getVaidReservations(tableIds: any) {

		let table_ids = await this._model.findAll({
			attributes: ['reservationId'],
			where: {
				tableId: {
					[Op.in]: tableIds
				}
			}
		})
		return table_ids
	}

	public async getRemainReservations(tableIds: any, res_id: any) {

		let table_ids = await this._model.findAll({
			attributes: ['reservationId'],
			where: {
				tableId: {
					[Op.in]: tableIds
				},
				reservationId: {
					[Op.ne]: res_id
				}
			}
		})
		return table_ids
	}

	public async deleteBasedOnResID(res_id: any){
		try {
			await this._model.destroy({
				where: {
					reservationId: res_id
				}
			})

			return true
		}
		catch (err) {
			return false
		}
	}
}
