import Order from "../../Models/Order";
import Cart from "../../Models/Cart";
import { CartItem, OrderItem, Product } from "../../Models";
import message from "../../Utils/Message";
import { injectable } from "inversify";
import "reflect-metadata";
import { IOrderRepository } from "../IOrderRepository";
import { BaseRepository } from "./BaseRepository";
import { ForbiddenError, RecordNotFoundError } from "../../Errors";
@injectable()
export class OrderRepository
    extends BaseRepository<Order>
    implements IOrderRepository
{
    constructor() {
        super(Order);
    }
    public async viewOrders(userId: number) {
        try {
            console.log(this._model)
            const allOrders = await this._model.findAll({where:{
                clientId: userId
            }});
            return allOrders;
        } catch (err) {
            message.queryError(err);
        }
    }

    public async updateStatus(data: any) {
        try {
            const {orderId, ...status} = data
            const order = await this._model.findOne({
                where: {
                    id: orderId,
                },
            });
            if (!order){
                throw new RecordNotFoundError("Order does not exist!")
            }
            return await order.update(status);
        } catch (err) {
            message.queryError(err);
        }
    }

    public async getOne(userId?: number, orderId?:number){
        try {
            return await this._model.findOne({where:{
                id: orderId,
                clientId: userId
            }}); 
        } catch (err) {
            message.queryError(err);
        }
    }
}
