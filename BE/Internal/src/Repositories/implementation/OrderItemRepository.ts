import { OrderItem, Product, Order } from "../../Models";
import message from "../../Utils/Message";
import { injectable } from "inversify";
import "reflect-metadata";
import { IOrderItemRepository } from "../IOrderItemRepository";
import { BaseRepository } from "./BaseRepository";
import { Op } from "sequelize";
import { Sequelize } from 'sequelize';
@injectable()
export class OrderItemRepository
    extends BaseRepository<OrderItem>
    implements IOrderItemRepository {
    constructor() {
        super(OrderItem);
    }

    public async getBestSeller(num_product: number, order_valid: any) {
        const products = await this._model.findAll({
            attributes: ['productId'],
            where: {
                orderId: {
                    [Op.in]: order_valid
                }
            },
            group: 'productId',
            limit: num_product,
            order: [
                [Sequelize.fn('count', Sequelize.col('productId')), 'DESC'],
            ]
        })

        return products
    }

    public async findByCond(cond: any) {
        return await this._model.findAll(cond)
    }
}
