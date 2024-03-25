import { Reservation } from "../Models";
import { IBaseRepository } from "./IBaseRepository";

export interface IReservationRepository extends IBaseRepository<Reservation > {
    getDates(): Promise<any>;
    viewRes(date_: any): Promise<any>;
    getDatesLimit(start_date ?: any, end_date ?: any): Promise<any>;
    getFilterReservation(res_ids: any, date_: any, status_: any): Promise<any>
    getConflictReservation(date_to: any, time_to: any, time_end: any, res_ids: any): Promise<any>
}