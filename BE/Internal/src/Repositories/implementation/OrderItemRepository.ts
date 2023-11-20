import { injectable } from "inversify";
import "reflect-metadata";
import { IOrderItemRepository } from "../IOrderItemRepository";
import { BaseRepository } from "./BaseRepository";
import { OrderItem } from "../../Models";
import message from "../../Utils/Message";

@injectable()
export class OrderItemRepository
    extends BaseRepository<OrderItem>
    implements IOrderItemRepository
{
    constructor() {
        super(OrderItem);
    }
    public async createItem(data: any) {
        try {
            const [orderItem] = await this._model.findOrCreate({
                where: {
                    orderId: data.orderId,
                    productId: data.productId,
                },
            });
            if (!orderItem.isNewRecord) {
                await orderItem.update({
                    quantity: orderItem.getDataValue("quantity") + data.quantity,
                    amount:
                        (orderItem.getDataValue("quantity") + data.quantity) *
                        data.price,
                });
            }
            return await orderItem.save();
        } catch (err) {
            message.queryError(err);
        }
    }
    public async getAll(orderId: number) {
        try {
            console.log(orderId)
            return await this._model.findAll({
                where: { orderId: orderId },
                order: [["createdAt", "DESC"]],
            });
        } catch (err) {
            message.queryError(err);
        }
    }
    public async getOne(orderId: number, productId: number) {
        try {
            return await this._model.findOne({
                where: { orderId: orderId, productId: productId },
            });
        } catch (err) {
            message.queryError(err);
        }
    }
    public async deleteOne(orderId: number, productId: number) {
        try {
            const orderItem = await this._model.findOne({
                where: { orderId: orderId, productId: productId },
            });
            await orderItem?.destroy();
            return;
        } catch (err) {
            message.queryError(err);
        }
    }
    public async updateOne(orderId: number, productId: number, data: any) {
        try {
            const orderItem = await this._model.findOne({
                where: { orderId: orderId, productId: productId },
            });
            await orderItem?.update({
                amount: data.amount,
                quantity: data.quantity,
            }); 
            return;
        } catch (err) {
            message.queryError(err);
        }
    }
}
