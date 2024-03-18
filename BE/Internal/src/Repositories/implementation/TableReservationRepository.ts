import { injectable } from "inversify";
import "reflect-metadata";
import { ITableReservationRepository } from "../ITableReservationRepository";
import { BaseRepository } from "./BaseRepository";
import { TableReservation } from "../../Models";
import message from "../../Utils/Message";

@injectable()
export class TableReservationRepository
	extends BaseRepository<TableReservation>
	implements ITableReservationRepository
{
	constructor() {
		super(TableReservation);
	}

}
