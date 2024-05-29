import { Request, Response, NextFunction } from "express";
import { Message } from "../Utils";
import { HttpStatusCode } from "../Constants";
import statusMess from "../Constants/statusMess";
import { container } from "../Configs";
import {
    IFloorRepository, ITableRepository, IReservationRepository
} from "../Repositories";
import { TYPES } from "../Types/type";
import { RecordNotFoundError, UnauthorizedError } from "../Errors";

export class FloorService {
    constructor(
        private tableRepository = container.get<ITableRepository>(
            TYPES.ITableRepository
        ),
        private reservationRepository = container.get<IReservationRepository>(
            TYPES.IReservationRepository
        ),
        private floorRepository = container.get<IFloorRepository>(
            TYPES.IFloorRepository
        ),
    ) { }

    public async updateTableFloor() {
        try {
            interface Dictionary<T> {
                [Key: string]: T;
            }
            let floors = await this.floorRepository.findAllFloor()
            let dicFloors: Dictionary<any> = {}


            for (let idx in floors) {
                const item: any = floors[idx]
                let tables_ = await this.tableRepository.viewTables(item.id)
                let index = item.name
                dicFloors[index] = tables_
            }

            return dicFloors
        }
        catch (err) {
            console.log(err)
        }
    }

    public async createFloor(req: Request, res: Response, next: NextFunction) {
        try {
            const floor_name = req.body.floor_name;
            const status: number = HttpStatusCode.Success;
            if (req.action = "create:any") {
                let checker_num = await this.floorRepository.findFloor(floor_name)

                if (checker_num.length != 0) {
                    res.send({ "status": false, "message": "This floor name existed" })
                }

                else {
                    let status_request = await this.floorRepository.createFloor(floor_name)
                    console.log(status_request)
                    if (status_request) {
                        let updated_info = await this.updateTableFloor()
                        res.send({ "status": status_request, "floors": updated_info })
                    }
                    else {
                        res.send({ "status": status_request, "message": "Something went wrong" })
                    }
                }

                Message.logMessage(req, status);
            }
            else throw new UnauthorizedError()
        }
        catch (err) {
            console.log(err);
            next(err);
        }
    }

    public async viewAllReservationsPage(req: Request, res: Response, next: NextFunction) {
        try {
            interface Dictionary<T> {
                [Key: string]: T;
            }
            let floors = await this.floorRepository.findAllFloor()
            let dates = await this.reservationRepository.getDates()
            let tables = await this.tableRepository.all()
            let dicFloors: Dictionary<any> = {}
            let dicReservations: Dictionary<any> = {}

            for (let idx in floors) {
                const item: any = floors[idx]
                let tables_ = await this.tableRepository.viewTables(item.id)
                let index = item.name
                dicFloors[index] = tables_
            }

            for (let idx in dates) {
                const item: any = dates[idx]
                let ress = await this.reservationRepository.viewRes(item.dateTo)
                let index = item.dateTo
                dicReservations[index] = ress
            }


            let table_reservations_info: Dictionary<string> = {}

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

            return { "floors": dicFloors, "reservarions": dicReservations, "tables": tables, "table_reservations": table_reservations_info }
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    }


    public async deleteFloor(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.action = "create:any") {
                const floor_names = req.body.floor_names;
                const result = await this.floorRepository.deleteFloor(floor_names)
                let data = await this.viewAllReservationsPage(req, res, next)
                res.send(data)

            }
            else throw new UnauthorizedError()
        }
        catch (err) {
            console.log(err);
            next(err);
        }
    }
}
