import { TableReservation } from "../Models";
import { IBaseRepository } from "./IBaseRepository";

export interface ITableReservationRepository extends IBaseRepository<TableReservation> {
    getVaidReservation(tableId_: any): Promise<any>;
}

