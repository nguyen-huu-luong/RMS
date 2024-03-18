import { injectable } from "inversify";
import "reflect-metadata";
import message from "../../Utils/Message";
import { ITableRepository } from "../ITableRepository";
import { BaseRepository } from "./BaseRepository";
import { Table } from "../../Models";
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
				}
			});
			return allTables;
		} catch (err) {
			message.queryError(err);
		}
	}
}
