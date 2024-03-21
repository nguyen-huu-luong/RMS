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
import { QueryOptions, TYPES } from "../Types/type";
import { RecordNotFoundError, UnauthorizedError } from "../Errors";
import { parseRequesQueries } from "../Helper/helper";
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
            const queries = { ...req.body, ...req.query };
            const options: QueryOptions = parseRequesQueries(queries);
            if (req.action === "read:own") {
                data = await this.orderRepository.viewOrders(req.userId);
            } else {
                let customerId = Number(req.query.customerId);
                if (customerId) {
                    data = await this.orderRepository.viewOrders(customerId);
                } else {
                    data = await this.orderRepository.all(options);
                    const orders = await Promise.all(
                        data.data.map(async (order: any) => {
                            const client = await order.getClient();
                            return { order: order, client: client };
                        })
                    );
                    data.data = orders;
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
                console.log(req.userId);
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
                    amount:
                        parseInt(cart?.getDataValue("amount")) +
                        parseInt(order.getDataValue("shippingCost")),
                });
                const cartItems = await cart.getProducts();
                await Promise.all(
                    cartItems.map(async (item: any) => {
                        await order.addProduct(item, {
                            through: {
                                quantity: item.CartItem.quantity,
                                amount: item.CartItem.amount,
                                status: "Preparing",
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

    public async recordMoMoOrder(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const { userId, ...orderInfor } = req.body;
        req.body = orderInfor;
        req.userId = userId;
        req.action = "create:own";
        this.createOrder(req, res, next);
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
            if (req.action === "update:own") {
                await this.orderRepository.updateStatus(data);
            } else if (req.action === "update:any") {
                await this.orderRepository.updateStatus(data);
            } else throw new UnauthorizedError();
            res.status(status).send(statusMess.Success);
            Message.logMessage(req, status);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }

    public async updateItemStatus(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const status: number = HttpStatusCode.Success;
            const { orderId, itemId, stt }: any = req.body;
            if (req.action === "update:any") {
                // await this.orderRepository.updateStatus(data);
            } else throw new UnauthorizedError();
            res.status(status).send(statusMess.Success);
            Message.logMessage(req, status);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }

    public async updateItems(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            const {orderId, productId, dish_status} = req.body;
            console.log(req.body)
            if (req.action === "update:any") {
                const order = await this.orderRepository.findById(orderId);
                const product = await this.productRepository.findById(productId);
                let orderItems = await order.getProducts();
                const targetOrderItem = orderItems.map((item: any) => {
                    if (item.OrderItem.getDataValue("productId") == productId)
                        return item.OrderItem;
                }).filter((order: any) => order !== undefined);
                await order.addProduct(product, {
                    through: {
                        quantity: targetOrderItem[0].quantity,
                        amount:
                            targetOrderItem[0].quantity *
                            product.getDataValue("price"),
                        status: dish_status,
                        createdAt: targetOrderItem[0].createdAt,
                        updatedAt: new Date(),
                    },
                });
                orderItems = await order.getProducts();
                const check = orderItems.every((item: any) => item.OrderItem.status === 'Ready');
                if (check) {
                    await order.update({ status: dish_status });
                    return res.status(status).send("Update Order");
                } 
            } else throw new UnauthorizedError();
            Message.logMessage(req, status);
            return res.status(status).send(statusMess.Success);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }

    public async viewItems(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            const { orderId, itemId, stt }: any = req.body;
            if (req.action === "read:any") {
                const orders = await this.orderRepository.all();
                const ordersWithItems = (await Promise.all(
                    orders.map(async (order: any) => {
                        if (order.status === 'Preparing' || order.status === 'Ready') {
                            const orderItems = await order.getProducts();
                            return {
                                ...order.toJSON(),
                                orderItems: orderItems.map((item: any) => item.toJSON()),
                            };
                        } else return null;
                    })
                )).filter((order: any) => order !== null)
                res.status(status).send(ordersWithItems);
            } else throw new UnauthorizedError();
            Message.logMessage(req, status);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
}
