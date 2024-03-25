import { Request, Response, NextFunction } from "express";
import { Message } from "../Utils";
import { HttpStatusCode } from "../Constants";
import statusMess from "../Constants/statusMess";
import { container } from "../Configs";
import {
    ITableRepository, IReservationRepository, IFloorRepository
} from "../Repositories";
import { TYPES } from "../Types/type";
import { RecordNotFoundError, UnauthorizedError } from "../Errors";

export class TableService {
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
            await Promise.all(
                floors.map(async (item: any) => {
                    let tables_ = await this.tableRepository.viewTables(item.id)
                    let index = item.name
                    dicFloors[index] = tables_
                })
            );
            return dicFloors
        }
        catch (err) {
            console.log(err)
        }
    }

    public async createTable(req: Request, res: Response, next: NextFunction) {
        try {
            const table_name = req.body.table_name;
            const floor_name = req.body.floor_name;
            const status: number = HttpStatusCode.Success;
            if (req.action = "create:any") {
                let checker_num = await this.tableRepository.findTable(table_name)

                if (checker_num.length != 0) {
                    res.send({ "status": false, "message": "This table name existed" })
                }
                else {
                    let floor = await this.floorRepository.findOne(floor_name)
                    let status_request = await this.tableRepository.createTable(table_name, floor)
                
                    if (status_request == true) {
                        let updated_info = await this.updateTableFloor()
                        let tables = await this.tableRepository.all()
                        res.send({ "status": status_request, "floors": updated_info, "tables": tables })
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

            await Promise.all(
                floors.map(async (item: any) => {
                    let tables_ = await this.tableRepository.viewTables(item.id)
                    let index = item.name
                    dicFloors[index] = tables_
                })
            );


            await Promise.all(
                dates.map(async (item: any) => {
                    let ress = await this.reservationRepository.viewRes(item.dateTo)
                    let index = item.dateTo
                    dicReservations[index] = ress
                })
            );

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

            res.send({ "floors": dicFloors, "reservarions": dicReservations, "tables": tables, "table_reservations": table_reservations_info })
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    }


    public async deleteTable(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.action = "delete:any") {
                const table_names = req.body.request_body.table_names;
                const result = await this.tableRepository.deleteTable(table_names)
                await this.viewAllReservationsPage(req, res, next)

            }
            else throw new UnauthorizedError()
        }
        catch (err) {
            console.log(err);
            next(err);
        }
    }

    public async getTable(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.action = "read:any") {
                const table_id = Number(req.query.id);
                const table = await this.tableRepository.findById(table_id)
                res.send(table)

            }
            else throw new UnauthorizedError()
        }
        catch (err) {
            console.log(err);
            next(err);
        }
    }

    public async updateTable(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.action = "update:any") {
                const table_id = Number(req.query.id);
                const table = await this.tableRepository.update(table_id, req.body)
                res.send(table)

            }
            else throw new UnauthorizedError()
        }
        catch (err) {
            console.log(err);
            next(err);
        }
    }
}
