import { Request, Response, NextFunction } from "express";
import { Message } from "../Utils";
import { HttpStatusCode } from "../Constants";
import statusMess from "../Constants/statusMess";
import { container } from "../Configs";
import {
    ITableRepository, IReservationRepository, IFloorRepository, CartRepository,
    ICartRepository, ICartItemRepository
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
        private cartRepository = container.get<ICartRepository>(
            TYPES.ICartRepository
        ),
        private cartItemRepository = container.get<ICartItemRepository>(
            TYPES.ICartItemRepository
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

                    if (status_request != false) {
                        let updated_info = await this.updateTableFloor()
                        let tables = await this.tableRepository.all()
                        await this.cartRepository.create({
                            tableId: status_request,
                            createAt: new Date(),
                            updateAt: new Date()
                        })
                        res.send({ "status": true, "floors": updated_info, "tables": tables })
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
                console.log(req.body)
                const table_names = req.body.table_names;
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

    public async addToCart(req: Request, res: Response, next: NextFunction) {
        try {
            const table_id = Number(req.params.id);
            const cart = await this.cartRepository.getCartTable(table_id)
            let amount_items: number = cart.amount
            const cart_items = req.body

            await Promise.all(
                cart_items.map(async (item: any) => {
                    await this.cartItemRepository.create({
                        cartId: cart.id,
                        productId: item.id,
                        amount: item.amount,
                        quantity: item.quantity,
                        status: item.status,
                        createAt: new Date(),
                        updateAt: new Date()
                    })
                    amount_items += item.amount
                })
            )

            await this.cartRepository.update(Number(cart.id), { amount: amount_items, total: amount_items })
            const cart_new = await this.cartRepository.getCartTable(table_id)
            res.send(cart_new)
        }
        catch (err) {
            console.log(err);
            next(err);
        }
    }

    public async updateCart(req: Request, res: Response, next: NextFunction) {
        try {
            const cart_items = req.body
            const table_id = Number(req.params.id);
            const cart = await this.cartRepository.getCartTable(table_id)
            let amount_items: number = cart.amount
            await Promise.all(
                cart_items.map(async (item: any) => {
                    let same_items = await this.cartItemRepository.findByCond({ productId: item.id, cartId: cart.id, status: item.status })
                    if (same_items.length == 0) {
                        await this.cartItemRepository.create({
                            cartId: cart.id,
                            productId: item.id,
                            amount: item.amount,
                            quantity: item.quantity,
                            status: item.status,
                            createAt: new Date(),
                            updateAt: new Date()
                        })
                    }
                    else {
                        let same_item = same_items[0]
                        await this.cartItemRepository.updateItems({ productId: item.id, cartId: cart.id, status: item.status }, { amount: item.amount + same_item.amount, quantity: item.quantity + same_item.quantity })
                    }
                    amount_items += item.amount
                })
            )

            await this.cartRepository.update(Number(cart.id), { amount: amount_items, total: amount_items })
            const cart_new = await this.cartRepository.getCartTable(table_id)
            res.send(cart_new)
        }
        catch (err) {
            console.log(err);
            next(err);
        }
    }
}
