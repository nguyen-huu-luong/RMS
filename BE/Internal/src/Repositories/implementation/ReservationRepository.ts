import { injectable } from "inversify";
import "reflect-metadata";
import { IReservationRepository } from "../IReservationRepository";
import { BaseRepository } from "./BaseRepository";
import { Reservation, Table } from "../../Models";
import message from "../../Utils/Message";

@injectable()
export class ReservationRepository
	extends BaseRepository<Reservation>
	implements IReservationRepository {
	constructor() {
		super(Reservation);
	}

	public async getDates() {
		// let allDates = await this._model.findAll({ attributes: ['dateTo'], group: ['dateTo'] })
		// console.log(allDates[0].dataValues.dateTo)
		// let allDatesSort = allDates.sort(function (a, b) {
		// 	var aComps = a.dataValues.dateTo.split("-")
		// 	var bComps = b.dataValues.dateTo.split("-");
		// 	var aDate = new Date(aComps[2], aComps[1], aComps[0]);
		// 	var bDate = new Date(bComps[2], bComps[1], bComps[0]);
		// 	return -(aDate.getTime() - bDate.getTime());
		// });
		// return allDatesSort
		let allDates = await this._model.findAll({attributes: ['dateTo'],  group: ['dateTo'], order: [['dateTo','DESC']]})
		return allDates
	}

	public async viewRes(date_: any) {
		try {
			const allRes = await this._model.findAll({
				attributes: ['id', 'customerCount', 'customerName', 'status', 'dateTo', 'timeTo', 'description'],
				where: {
					dateTo: date_
				},
				include: Table 
			});
			return allRes;
		} catch (err) {
			message.queryError(err);
		}
	}


}
