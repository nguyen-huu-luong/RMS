import Order from "../../Models/Order";
import Cart from "../../Models/Cart";
import { CartItem, OrderItem, Product } from "../../Models";
import message from "../../Utils/Message";
import { injectable } from "inversify";
import "reflect-metadata";
import { IOrderRepository } from "../IOrderRepository";
import { BaseRepository } from "./BaseRepository";
import { ForbiddenError, RecordNotFoundError } from "../../Errors";
import { Op, Sequelize } from "sequelize";
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
            console.log(this._model);
            const allOrders = await this._model.findAll({
                where: {
                    clientId: userId,
                },
            });
            return allOrders;
        } catch (err) {
            message.queryError(err);
        }
    }

    public async updateStatus(data: any) {
        try {
            const { orderId, ...status } = data;
            const order = await this._model.findOne({
                where: {
                    id: orderId,
                },
            });
            if (!order) {
                throw new RecordNotFoundError("Order does not exist!");
            }
            return await order.update(status);
        } catch (err) {
            message.queryError(err);
        }
    }

    public async getOne(userId?: number, orderId?: number) {
        try {
            return await this._model.findOne({
                where: {
                    id: orderId,
                    clientId: userId,
                },
            });
        } catch (err) {
            message.queryError(err);
        }
    }

    public async createOrder(userId: number, data: any) {
        try {
        } catch (err) {
            message.queryError(err);
        }
    }

    public async getDailyOrder() {
        try {
            const today = new Date();
            const startOfToday = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate()
            );
            const endOfToday = today;
            const yesterday = new Date();
            yesterday.setDate(today.getDate() - 1);
            const startOfYesterday = new Date(
                yesterday.getFullYear(),
                yesterday.getMonth(),
                yesterday.getDate()
            );
            const endOfYesterday = new Date(
                yesterday.getFullYear(),
                yesterday.getMonth(),
                yesterday.getDate() + 1
            );
            const [todayOrders, yesterdayOrders] = await Promise.all([
                this._model.findAll({
                    where: {
                        createdAt: {
                            [Op.between]: [startOfToday, endOfToday],
                        },
                        status: "Done",
                    },
                }),
                this._model.findAll({
                    where: {
                        createdAt: {
                            [Op.between]: [startOfYesterday, endOfYesterday],
                        },
                        status: "Done",
                    },
                }),
            ]);
            return {
                todayOrders: todayOrders,
                yesterdayOrders: yesterdayOrders,
            };
        } catch (err) {
            message.queryError(err);
        }
    }

    public async getMonthlyOrder() {
        try {
            const today = new Date();
            const startOfMonth = new Date(
                today.getFullYear(),
                today.getMonth(),
                2
            );
            const endOfMonth = today;
            const startOfLastMonth = new Date(
                today.getFullYear(),
                today.getMonth() - 1,
                1
            );
            const endOfLastMonth = new Date(
                today.getFullYear(),
                today.getMonth(),
                1
            );
            const [currentMonthOrders, lastMonthOrders] = await Promise.all([
                this._model.findAll({
                    where: {
                        createdAt: {
                            [Op.between]: [startOfMonth, endOfMonth],
                        },
                        status: "Done",
                    },
                }),
                this._model.findAll({
                    where: {
                        createdAt: {
                            [Op.between]: [startOfLastMonth, endOfLastMonth],
                        },
                        status: "Done",
                    },
                }),
            ]);
            return {
                currentMonthOrders: currentMonthOrders,
                lastMonthOrders: lastMonthOrders,
            };
        } catch (err) {
            message.queryError(err);
        }
    }

    public async getChart(beginDate?: Date, endDate?: Date) {
        try {
            const currentMonthOrders = await Promise.all([
                this._model.findAll({
                    where: {
                        createdAt: {
                            [Op.between]: [beginDate, endDate],
                        },
                        status: "Done",
                    },
                    attributes: [
                        [Sequelize.literal(`DATE("createdAt")`), "date"],
                        [Sequelize.literal(`COUNT(*)`), "count"],
                        [Sequelize.fn('sum', Sequelize.col('amount')), 'total_amount']
                    ],
                    group: ["date"],
                }),
            ]);
            return currentMonthOrders;
        } catch (err) {
            message.queryError(err);
        }
    }


    public async getYearlyOrder() {
        try {
            const today = new Date();
            const startOfYear = new Date(today.getFullYear(), 0, 1);
            const endOfYear = today;
            const startOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
            const endOfLastYear = startOfYear;
            const [currentYearOrders, lastYearOrders] = await Promise.all([
                this._model.findAll({
                    where: {
                        createdAt: {
                            [Op.between]: [startOfYear, endOfYear],
                        },
                        status: "Done",
                    },
                }),
                this._model.findAll({
                    where: {
                        createdAt: {
                            [Op.between]: [startOfLastYear, endOfLastYear],
                        },
                        status: "Done",
                    },
                }),
            ]);
            return {
                currentYearOrders: currentYearOrders,
                lastYearOrders: lastYearOrders,
            };
        } catch (err) {
            message.queryError(err);
        }
    }

    public async getOrdersByDate(beginDate: Date, endDate: Date = new Date()) {
        try {
            const orders = await this._model.findAll({
                where: {
                    createdAt: {
                        [Op.between]: [beginDate, endDate],
                    },
                    status: "Done",
                },
            });
            return { orders: orders };
        } catch (err) {
            message.queryError(err);
        }
    }

    public async getMonthlyTopProduct() {
        try {
            const today = new Date();
            const startOfMonth = new Date(
                today.getFullYear(),
                today.getMonth(),
                2
            );
            const endOfMonth = today;
            const startOfLastMonth = new Date(
                today.getFullYear(),
                today.getMonth(),
                2
            );
            const endOfLastMonth = startOfMonth;
            const orders = await this._model.findAll({
                where: {
                    createdAt: {
                        [Op.between]: [startOfMonth, endOfMonth],
                    },
                    status: "Done",
                },
            });
            const productSales: Map<number, number> = new Map();
            for (const order of orders) {
                const orderItems = await order.getProducts();
                for (const orderItem of orderItems) {
                    const { productId, quantity } = orderItem.OrderItem;
                    if (!productSales.has(productId)) {
                        productSales.set(productId, quantity);
                    } else {
                        productSales.set(
                            productId,
                            productSales.get(productId) + quantity
                        );
                    }
                }
            }
            const previousMonth = await this.getCustomTopProduct(
                startOfLastMonth,
                endOfLastMonth
            );
            const productSalesArray: [number, number, number][] = Array.from(
                productSales
            ).map(([productId, quantity]) => [productId, quantity, -10]);
            productSalesArray.sort((a, b) => b[1] - a[1]);
            const topProducts = productSalesArray.slice(0, 10);
            if (previousMonth) {
                const result: [number, number, number][] = topProducts.map(
                    ([productId, quantity, rank], index) => {
                        const indexInPrevious = previousMonth.findIndex(
                            (pre: any) => pre[0] === productId
                        );
                        const indexChange =
                            indexInPrevious !== -1
                                ? indexInPrevious - index
                                : -10;
                        return [productId, quantity, indexChange];
                    }
                );
                return result;
            } else return topProducts;
        } catch (err) {
            message.queryError(err);
        }
    }

    public async getYearlyTopProduct() {
        try {
            const today = new Date();
            const startOfYear = new Date(today.getFullYear(), 0, 1);
            const endOfYear = new Date();
            const startOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
            const endOfLastYear = startOfYear;
            const orders = await this._model.findAll({
                where: {
                    createdAt: {
                        [Op.between]: [startOfYear, endOfYear],
                    },
                    status: "Done",
                },
            });
            const productSales: Map<number, number> = new Map();
            for (const order of orders) {
                const orderItems = await order.getProducts();
                for (const orderItem of orderItems) {
                    const { productId, quantity } = orderItem.OrderItem;
                    if (!productSales.has(productId)) {
                        productSales.set(productId, quantity);
                    } else {
                        productSales.set(
                            productId,
                            productSales.get(productId) + quantity
                        );
                    }
                }
            }
            const previosYear = await this.getCustomTopProduct(
                startOfLastYear,
                endOfLastYear
            );
            const productSalesArray: [number, number, number][] = Array.from(
                productSales
            ).map(([productId, quantity]) => [productId, quantity, -10]);
            productSalesArray.sort((a, b) => b[1] - a[1]);
            const topProducts = productSalesArray.slice(0, 10);
            if (previosYear) {
                const result: [number, number, number][] = topProducts.map(
                    ([productId, quantity, rank], index) => {
                        const indexInPrevious = previosYear.findIndex(
                            (pre: any) => pre[0] === productId
                        );
                        const indexChange =
                            indexInPrevious !== -1
                                ? indexInPrevious - index
                                : -10;
                        return [productId, quantity, indexChange];
                    }
                );
                return result;
            } else return topProducts;
        } catch (err) {
            message.queryError(err);
        }
    }

    public async getCustomTopProduct(
        beginDate: Date,
        endDate: Date = new Date()
    ) {
        try {
            const orders = await this._model.findAll({
                where: {
                    createdAt: {
                        [Op.between]: [beginDate, endDate],
                    },
                    status: "Done",
                },
            });
            const productSales: Map<number, number> = new Map();
            for (const order of orders) {
                const orderItems = await order.getProducts();
                for (const orderItem of orderItems) {
                    const { productId, quantity } = orderItem.OrderItem;
                    if (!productSales.has(productId)) {
                        productSales.set(productId, quantity);
                    } else {
                        productSales.set(
                            productId,
                            productSales.get(productId) + quantity
                        );
                    }
                }
            }
            const productSalesArray: [number, number][] =
                Array.from(productSales);
            productSalesArray.sort((a, b) => b[1] - a[1]);
            const topProducts = productSalesArray.slice(0, 10);
            return topProducts;
        } catch (err) {
            message.queryError(err);
        }
    }

    public async getByCond(cond: any){
        try{
            return await this._model.findAll(cond)
        }
        catch (err){
            message.queryError(err);
        }
    }


    public async getNewestOrder(customerId: number |  string) {
        return await  this._model.findOne({
            where: {clientId: customerId},
            order: [ [ 'createdAt', 'DESC' ]],
        });
    }

}
