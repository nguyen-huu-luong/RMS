import { NextFunction, Request, Response } from 'express';
import { Message } from '../Utils';
import { HttpStatusCode } from '../Constants';
import { container } from '../Configs';
import { TYPES } from "../Types/type";
import { IOrderItemRepository, IOrderRepository, IProductRepository } from '../Repositories';
import { Op } from 'sequelize';

export class OrderItemService {
    constructor(
        private orderItemRepository = container.get<IOrderItemRepository>(TYPES.IOrderItemRepository),
        private orderRepository = container.get<IOrderRepository>(TYPES.IOrderRepository),
        private productRepository = container.get<IProductRepository>(TYPES.IProductRepository)
    ) { }

    public async getBestSeller(req: Request, res: Response, next: NextFunction) {
        try {
            const done_orders: any = await this.orderRepository.getByCond({
                where: {
                    status: "Done"
                }
            })
            let done_orders_array: Array<any> = []
            done_orders.map((item: any) => done_orders_array.push(item.id))
            const num_product = req.query.num
            let real_num_product = 6

            if (num_product) {
                real_num_product = Number(num_product)
            }

            const trend_products = await this.orderItemRepository.getBestSeller(real_num_product, done_orders_array)
            let trend_products_array: Array<any> = []
            trend_products.map((item: any) => trend_products_array.push(item.productId))
            const trend_products_detail = await this.productRepository.findByCond({
                where: {
                    id: {
                        [Op.in]: trend_products_array
                    }
                }
            })
            const status: number = HttpStatusCode.Success;
            Message.logMessage(req, status);
            res.send(trend_products_detail)
        }
        catch (err) {
            console.log(err)
            next(err);
        }
    }

    
}
