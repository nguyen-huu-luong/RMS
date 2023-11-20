import { Request, Response, NextFunction } from "express";
import { Message } from "../Utils/";
import { HttpStatusCode } from "../Constants";
import statusMess from "../Constants/statusMess";
import { container } from "../Configs";
import { IOrderRepository } from "../Repositories/IOrderRepository";
import {
    ICartRepository,
    IOrderItemRepository,
    ICartItemRepository,
    IProductRepository,
} from "../Repositories";
import { TYPES } from "../Repositories/type";
import { RecordNotFoundError } from "../Errors";
import { or } from "sequelize";
import { OrderItem } from "../Models";
import { param } from "express-validator";
export class OrderService {
    constructor(
        private orderRepository = container.get<IOrderRepository>(
            TYPES.IOrderRepository
        ),
        private orderItemRepository = container.get<IOrderItemRepository>(
            TYPES.IOrderItemRepository
        ),
        private cartRepository = container.get<ICartRepository>(
            TYPES.ICartRepository
        ),
        private cartItemRepository = container.get<ICartItemRepository>(
            TYPES.ICartItemRepository
        ),
        private productRepository = container.get<IProductRepository>(
            TYPES.IProductRepository
        )
    ) {}

    public async viewOrderItems(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const status: number = HttpStatusCode.Success;
            let data: any;
            if (req.action === "read:own") {
                const order = await this.orderRepository.getOne(
                    req.userId,
                    parseInt(req.params.id)
                );
                data = await this.orderItemRepository.getAll(
                    parseInt(req.params.id)
                );
            } else {
                data = await this.orderItemRepository.getAll(
                    parseInt(req.params.id)
                );
            }
            if (!data) {
                throw new RecordNotFoundError("Order do not exist");
            }
            res.status(status).send(data);
            Message.logMessage(req, status);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }

    public async viewOrders(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            let data: any;
            if (req.action === "read:own") {
                data = await this.orderRepository.viewOrders(req.userId);
            } else {
                data = await this.orderRepository.all();
            }
            res.status(status).send(data);
            Message.logMessage(req, status);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }

    public async createOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            if (req.action === "create:own") {
                const order = await this.orderRepository.create({
                    ...req.body,
                    clientId: req.userId,
                });
                const cart = await this.cartRepository.getCart(req.userId);
                await this.orderRepository.update(order.getDataValue("id"), {
                    num_items: cart?.getDataValue("total"),
                    amount: cart?.getDataValue("amount"),
                });
                const cartItems = await this.cartItemRepository.getAll(
                    cart?.getDataValue("id")
                );
                await Promise.all(
                    cartItems.map(async (cartItem: any) => {
                        await this.orderItemRepository.create({
                            orderId: order.getDataValue("id"),
                            productId: cartItem.getDataValue("productId"),
                            quantity: cartItem.getDataValue("quantity"),
                            amount: cartItem.getDataValue("amount"),
                        });
                    })
                );
                await this.cartItemRepository.deleteAll(
                    cart?.getDataValue("id")
                );
                await this.cartRepository.update(cart?.getDataValue("id"), {
                    total: 0,
                    amount: 0,
                });
            } else {
                // await this.orderRepository.adminCreateOrder(req.body);
                const { products, ...orderData } = req.body;
                const order = await this.orderRepository.create(orderData);
                await Promise.all(
                    products.map(async (item: any) => {
                        let product = await this.productRepository.findById(item.productId);
                        await this.orderItemRepository.create({
                            orderId: order.getDataValue("id"),
                            productId: item.productId,
                            quantity: item.quantity,
                            amount: item.quantity * product.getDataValue('price'),      
                        })
                    })
                );
                const orderItems = await this.orderItemRepository.getAll(order.getDataValue('id'));
                const totalItems = orderItems.reduce(
                    (total: number, orderItems: any) =>
                        total + orderItems.getDataValue("quantity"),
                    0
                );
                const totalAmount = orderItems.reduce(
                    (sum: number, orderItems: any) => sum + orderItems.getDataValue("amount"),
                    0
                );
                await this.orderRepository.update(order.getDataValue('id'), { num_items: totalItems, amount: totalAmount })
            }
            res.status(status).send(statusMess.Success);
            Message.logMessage(req, status);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }

    public async removeOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            await this.orderRepository.delete(parseInt(req.params.id));
            res.status(status).send(statusMess.Success);
            Message.logMessage(req, status);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }

    public async updateStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            const data: any = req.body;
            await this.orderRepository.updateStatus(data);
            res.status(status).send(statusMess.Success);
            Message.logMessage(req, status);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
}
