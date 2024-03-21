import { injectable } from "inversify";
import "reflect-metadata";
import { IReservationRepository } from "../IReservationRepository";
import { BaseRepository } from "./BaseRepository";
import { Reservation, Table } from "../../Models";
import message from "../../Utils/Message";
import { Op } from "sequelize";

@injectable()
export class ReservationRepository
	extends BaseRepository<Reservation>
	implements IReservationRepository {
	constructor() {
		super(Reservation);
	}

	public async getDates() {
		let allDates = await this._model.findAll({ attributes: ['dateTo'], group: ['dateTo'], order: [['dateTo', 'DESC']] })
		return allDates
	}

	public async viewRes(date_: any) {
		try {
			const allRes = await this._model.findAll({
				attributes: ['id', 'customerCount', 'customerName', 'status', 'dateTo', 'timeTo', 'timeEnd', 'description'],
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

	public async getDatesLimit(start_date?: any, end_date?: any) {
		if (start_date == "" && end_date == "") {
			let allDates = await this._model.findAll({
				attributes: ['dateTo'], group: ['dateTo'], order: [['dateTo', 'DESC']]
			})
			return allDates
		}
		else if (start_date == "") {
			let allDates = await this._model.findAll({
				attributes: ['dateTo'], group: ['dateTo'], order: [['dateTo', 'DESC']], having: {
					dateTo: {
						[Op.lte]: end_date
					}
				}
			})
			return allDates
		}
		else if (end_date == "") {
			let allDates = await this._model.findAll({
				attributes: ['dateTo'], group: ['dateTo'], order: [['dateTo', 'DESC']], having: {
					dateTo: {
						[Op.gte]: start_date
					}
				}
			})
			return allDates
		}
		else {
			let allDates = await this._model.findAll({
				attributes: ['dateTo'], group: ['dateTo'], order: [['dateTo', 'DESC']], having: {
					[Op.and]: [
						{
							dateTo: {
								[Op.gte]: start_date
							}
						},
						{
							dateTo: {
								[Op.lte]: end_date
							}
						}
					]
				}
			})
			return allDates
		}
	}

	public async getFilterReservation(res_ids: any, date_: any, status_: any) {
		if (status_ != "") {

			let allRes = await this._model.findAll({
				attributes: ['id', 'customerCount', 'customerName', 'status', 'dateTo', 'timeTo', 'description'],
				where: {
					id: {
						[Op.in]: res_ids
					},
					dateTo: date_,
					status: status_
				}
			})
			return allRes;
		}

		let allRes = await this._model.findAll({
			attributes: ['id', 'customerCount', 'customerName', 'status', 'dateTo', 'timeTo', 'description'],
			where: {
				id: {
					[Op.in]: res_ids
				},
				dateTo: date_
			}
		})

		return allRes;
	}

}
