import { Reservation } from "../Models";
import { IBaseRepository } from "./IBaseRepository";

export interface IReservationRepository extends IBaseRepository<Reservation > {
    getDates(): Promise<any>;
    viewRes(date_: any): Promise<any>;
}