import { TableReservation } from "../Models";
import { IBaseRepository } from "./IBaseRepository";

export interface ITableReservationRepository extends IBaseRepository<TableReservation> {
    getVaidReservation(tableId_: any): Promise<any>;
    getTables(resId_: any) : Promise<any>;
    getVaidReservations(tableIds: any) : Promise<any>;
    getRemainReservations(tableIds: any, res_id: any) : Promise<any>;
    deleteBasedOnResID(res_id: number): Promise<any>;
}

