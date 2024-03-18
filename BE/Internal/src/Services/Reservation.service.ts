import { Request, Response, NextFunction } from "express";
import { Message } from "../Utils";
import { HttpStatusCode } from "../Constants";
import statusMess from "../Constants/statusMess";
import { container } from "../Configs";
import {
    IReservationRepository,
    ITableReservationRepository,
    ITableRepository,
    IFloorRepository
} from "../Repositories";
import { TYPES } from "../Types/type";
import { RecordNotFoundError, UnauthorizedError } from "../Errors";

export class ReservationService {
    constructor(
        private reservationRepository = container.get<IReservationRepository>(
            TYPES.IReservationRepository
        ),
        private tableReservationRepository = container.get<ITableReservationRepository>(
            TYPES.ITableReservationRepository
        ),
        private tableRepository = container.get<ITableRepository>(
            TYPES.ITableRepository
        ),
        private floorRepository = container.get<IFloorRepository>(
            TYPES.IFloorRepository
        ),
    ) { }

    public async viewAllReservationsPage(req: Request, res: Response, next: NextFunction) {
        try {
            interface Dictionary<T> {
                [Key: string]: T;
            }
            let floors = await this.floorRepository.all()
            let dates = await this.reservationRepository.getDates()
            let tables = await this.tableRepository.all()
            let dicFloors: Dictionary<any> = {}
            let dicReservations: Dictionary<any> = {}

            await Promise.all(
                floors.map(async (item: any) => {
                    let tables = await this.tableRepository.viewTables(item.id)
                    let index = item.name
                    dicFloors[index] = tables
                })
            );


            await Promise.all(
                dates.map(async (item: any) => {
                    let ress = await this.reservationRepository.viewRes(item.dateTo)
                    let index = item.dateTo
                    dicReservations[index] = ress
                })
            );

            let table_reservations_info:  Dictionary<string> = {}

            await Promise.all(
                Object.keys(dicReservations).map(async (key: any, index: any) => {
                    dicReservations[key].map((item: any, index: any) => {
                        let table_names = ""
                        item.Tables.map((table: any) => {
                            table_names += table.name + ','
                        })
                        if (table_names[table_names.length - 1] == ',') {
                            table_names = table_names.substring(0, table_names.length - 1)
                        }
                        table_reservations_info[`${item.id}`] = table_names
                    })

                })
            );

            res.send({ "floors": dicFloors, "reservarions": dicReservations, "tables": tables, "table_reservations": table_reservations_info })
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    }

}
