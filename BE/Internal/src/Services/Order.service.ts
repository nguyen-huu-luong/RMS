import { Request, Response, NextFunction } from "express";
import { Message } from "../Utils";
import { HttpStatusCode } from "../Constants";
import statusMess from "../Constants/statusMess";
import { container } from "../Configs";
import { IOrderRepository } from "../Repositories/IOrderRepository";
import {
    ICartRepository,
    IProductRepository,
    IVoucherRepository,
} from "../Repositories";
import { TYPES } from "../Types/type";
import { RecordNotFoundError } from "../Errors";
export class OrderService {
    constructor(
        private orderRepository = container.get<IOrderRepository>(
            TYPES.IOrderRepository
        ),
        private cartRepository = container.get<ICartRepository>(
            TYPES.ICartRepository
        ),
        private productRepository = container.get<IProductRepository>(
            TYPES.IProductRepository
        ),
        private voucherRepository = container.get<IVoucherRepository>(
            TYPES.IVoucherRepository
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
            let response: any;
            if (req.action === "read:own") {
                const order = await this.orderRepository.getOne(
                    req.userId,
                    parseInt(req.params.id)
                );
                data = await order.getProducts();
                response = {
                    order: order,
                    items: data,
                };
            } else {
                const order = await this.orderRepository.findById(
                    parseInt(req.params.id)
                );
                data = await order.getProducts();
                response = {
                    order: order,
                    items: data,
                };
            }
            if (!data) {
                throw new RecordNotFoundError("Order do not exist");
            }
            res.status(status).send(response);
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
                let customerId = Number(req.query.customerId)
                if (customerId){
                    data = await this.orderRepository.viewOrders(customerId);
                }
                else {
                    data = await this.orderRepository.all();
                }
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
            const { voucherId, ...orderInfor } = req.body;
            if (req.action === "create:own") {
                console.log(req.userId)
                const order = await this.orderRepository.create({
                    ...orderInfor,
                    clientId: req.userId,
                });

                if (voucherId != 0 && voucherId != null) {
                    const voucher = await this.voucherRepository.findById(
                        voucherId
                    );
                    await order.setVoucher(voucher);
                }

                const cart = await this.cartRepository.getCart(req.userId);
                await this.orderRepository.update(order.getDataValue("id"), {
                    num_items: cart?.getDataValue("total"),
                    amount: cart?.getDataValue("amount"),
                });
                const cartItems = await cart.getProducts();
                await Promise.all(
                    cartItems.map(async (item: any) => {
                        await order.addProduct(item, {
                            through: {
                                quantity: item.CartItem.quantity,
                                amount: item.CartItem.amount,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            },
                        });
                    })
                );
                await cart.setProducts([]);
                await this.cartRepository.update(cart?.getDataValue("id"), {
                    total: 0,
                    amount: 0,
                });
            } else {
                const { products, ...orderData } = req.body;
                const order = await this.orderRepository.create(orderData);
                await Promise.all(
                    products.map(async (item: any) => {
                        let product = await this.productRepository.findById(
                            item.productId
                        );
                        if (!product) {
                            throw new RecordNotFoundError(
                                "Product do not exist"
                            );
                        }
                        await order.addProduct(product, {
                            through: {
                                quantity: item.quantity,
                                amount:
                                    item.quantity *
                                    product.getDataValue("price"),
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            },
                        });
                    })
                );
                const orderItems = await order.getProducts();
                const totalItems = orderItems.reduce(
                    (total: any, item: any) => total + item.OrderItem.quantity,
                    0
                );
                const totalAmount = orderItems.reduce(
                    (sum: any, item: any) => sum + item.OrderItem.amount,
                    0
                );
                await this.orderRepository.update(order.getDataValue("id"), {
                    num_items: totalItems,
                    amount: totalAmount,
                });
            }
            res.status(status).send(statusMess.Success);
            Message.logMessage(req, status);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }

    public async recordMoMoOrder(req: Request, res: Response, next: NextFunction){
        const { userId, ...orderInfor } = req.body;
        req.body = orderInfor
        req.userId = userId
        req.action = "create:own"
        this.createOrder(req, res, next)
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
