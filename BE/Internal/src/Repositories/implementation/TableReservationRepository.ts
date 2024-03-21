import { injectable } from "inversify";
import "reflect-metadata";
import { ITableReservationRepository } from "../ITableReservationRepository";
import { BaseRepository } from "./BaseRepository";
import { TableReservation } from "../../Models";
import message from "../../Utils/Message";
import { table } from "console";

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
}
