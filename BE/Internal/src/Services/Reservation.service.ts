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
import { check } from "express-validator";

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
            if (req.action = "read:any") {
                const status: number = HttpStatusCode.Success;
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

                res.send({ "floors": dicFloors, "reservarions": dicReservations, "tables": tables, "table_reservations": table_reservations_info })
            }
            else throw new UnauthorizedError()
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    }


    public async filterReservation(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.action = "read:any") {
                interface Dictionary<T> {
                    [Key: string]: T;
                }

                let start_date = req.query.start
                let end_date = req.query.end
                let table = Number(req.query.table)
                let status_ = req.query.status
                let dicReservations: Dictionary<any> = {}
                let dates = await this.reservationRepository.getDatesLimit(start_date, end_date)
                let valid_reservations = await this.tableReservationRepository.getVaidReservation(table)
                let valid_reservations_array: number[] = []

                valid_reservations.map(async (item: any) => {
                    valid_reservations_array.push(item.reservationId)
                })

                for (let idx in dates) {
                    const item = dates[idx]
                    let ress = await this.reservationRepository.getFilterReservation(valid_reservations_array, item.dateTo, status_)
                    if (ress.length > 0) {
                        let index = item.dateTo
                        dicReservations[index] = ress
                    }
                }

                res.send({ "reservarions": dicReservations })
            }
            else throw new UnauthorizedError()
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    }

    public async updateReservationStatus(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.action = "update:any") {
                const status: number = HttpStatusCode.Success;
                let table_ids = await this.tableReservationRepository.getTables(Number(req.query.id))
                let array_table_ids: Array<number> = []
                table_ids.map((item: any) => array_table_ids.push(item.tableId))
                await this.reservationRepository.update(Number(req.query.id), req.body)
                await this.tableRepository.updateNumRes(-1, array_table_ids)
                await this.viewAllReservationsPage(req, res, next)
                Message.logMessage(req, status);
            }
            else throw new UnauthorizedError()
        }

        catch (err) {
            console.log(err)
            next(err);
        }
    }

    public async deleteReservation(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.action = "delete:any") {
                const reservation: any = await this.reservationRepository.findById(Number(req.query.id))
                console.log(reservation.status)
                const status = reservation.status
                let table_ids = await this.tableReservationRepository.getTables(Number(req.query.id))
                let array_table_ids: Array<number> = []
                table_ids.map((item: any) => array_table_ids.push(item.tableId))
                if (status == "Waiting") {
                    await this.tableRepository.updateNumRes(-1, array_table_ids)
                }
                await this.reservationRepository.delete(Number(req.query.id))
                await this.viewAllReservationsPage(req, res, next)
                const status_: number = HttpStatusCode.Success;
                Message.logMessage(req, status_);
            }
            else throw new UnauthorizedError()
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    }

    public async createReservation(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.action = "create:any") {
                const { table_ids, ...resInfo } = req.body
                if (resInfo.status == "Waiting") {
                    const reservations = await this.tableReservationRepository.getVaidReservations(table_ids)
                    let array_res_ids: Array<number> = []
                    reservations.map((item: any) => array_res_ids.push(item.reservationId))
                    const res_conflict = await this.reservationRepository.getConflictReservation(resInfo.dateTo, resInfo.timeTo, resInfo.timeEnd, array_res_ids)
                    if (res_conflict.length == 0) {
                        await this.tableRepository.updateNumRes(1, table_ids)
                    }
                    else {
                        res.send({ "message": "These tables are occupied in this time" })
                        return 
                    }
                }
                const new_res: any = await this.reservationRepository.create({
                    ...resInfo, createdAt: new Date(),
                    updatedAt: new Date(),
                })

                await Promise.all(
                    table_ids.map(async (item: any) => {
                        await this.tableReservationRepository.create({ tableId: item, reservationId: new_res.id })
                    })
                );
                await this.viewAllReservationsPage(req, res, next)

                const status_: number = HttpStatusCode.Success;
                Message.logMessage(req, status_);
            }
            else throw new UnauthorizedError()
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    }

    public async updateReservationDetail(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.action = "update:any") {
                const { res_id, ...resInfo } = req.body
                const reservation: any = await this.reservationRepository.findById(Number(res_id))
                const status = reservation.status
                let table_ids = await this.tableReservationRepository.getTables(Number(res_id))
                let array_table_ids: Array<number> = []
                table_ids.map((item: any) => array_table_ids.push(item.tableId))
                const reservations = await this.tableReservationRepository.getRemainReservations(resInfo.table_ids, Number(res_id))
                let array_res_ids: Array<number> = []
                reservations.map((item: any) => array_res_ids.push(item.reservationId))
                const res_conflict = await this.reservationRepository.getConflictReservation(resInfo.dateTo, resInfo.timeTo, resInfo.timeEnd, array_res_ids)
                if (resInfo.status == "Waiting") {
                    if (res_conflict.length == 0) {
                        if (status == "Waiting") {
                            await this.tableRepository.updateNumRes(-1, array_table_ids)
                        }
                        await this.reservationRepository.delete(Number(res_id))
                        req.body = resInfo
                        req.action = "create:any"
                        await this.createReservation(req, res, next)
                    }
                    else {
                        res.send({ "message": "These tables are occupied in this time" })
                    }
                }
                else {
                    if (status == "Waiting") {
                        await this.tableRepository.updateNumRes(-1, array_table_ids)
                    }
                    await this.reservationRepository.delete(Number(res_id))
                    req.body = resInfo
                    req.action = "create:any"
                    await this.createReservation(req, res, next)
                }
            }
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    }
}
