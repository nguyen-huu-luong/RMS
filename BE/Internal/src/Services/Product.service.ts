import { NextFunction, Request, Response } from "express";
import { Message } from "../Utils";
import { HttpStatusCode } from "../Constants";
import { container } from "../Configs";
import statusMess from "../Constants/statusMess";
import {
    IOrderItemRepository,
    IOrderRepository,
    IProductRepository,
    IClientHistoryRepository,
} from "../Repositories";
import { Category } from "../Models";
import { TYPES } from "../Types/type";
import { validationResult } from "express-validator";
/// <reference path="./types/globle.d.ts" />
import { ValidationError, RecordNotFoundError } from "../Errors";
import { Op, where } from "sequelize";

export class ProductService {
    constructor(
        private orderItemRepository = container.get<IOrderItemRepository>(
            TYPES.IOrderItemRepository
        ),
        private orderRepository = container.get<IOrderRepository>(
            TYPES.IOrderRepository
        ),
        private productRepository = container.get<IProductRepository>(
            TYPES.IProductRepository
        ),
        private clientHistoryRepository = container.get<IClientHistoryRepository>(
            TYPES.IClientHistoryRepository
        )
    ) {}

    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ValidationError(errors.array()[0].msg);
            }
            const status: number = HttpStatusCode.Success;
            let data: any;
            const namePattern: string = req.query.name as string;
            if (namePattern) {
                data = await this.productRepository.findByName(namePattern);
            } else {
                data = await this.productRepository.all();
            }
            res.status(status).send(data);
            Message.logMessage(req, status);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }

    public async getAllFullInformation(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            let sort_factor: any = req.query.sort_factor;
            let order: any = req.query.order;

            if (typeof sort_factor == "undefined") {
                sort_factor = "id";
            }

            if (typeof order == "undefined") {
                order = "ascend";
            }
            order = order === "ascend" ? "ASC" : "DESC";
            const status: number = HttpStatusCode.Success;
            const data = await this.productRepository.findByCond({
                include: [
                    {
                        model: Category,
                    },
                ],
                order: [[sort_factor, order]],
            });
            res.status(status).send(data);
            Message.logMessage(req, status);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }

    public async updateProduct(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const status: number = HttpStatusCode.Success;
            const data = await this.productRepository.update(
                parseInt(req.params.id),
                req.body
            );
            if (!data) {
                throw new RecordNotFoundError("Product do not exist");
            }
            res.status(status).send(statusMess.Success);
            Message.logMessage(req, status);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
    public async createProduct(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const status: number = HttpStatusCode.Success;
            const data = await this.productRepository.create(req.body);
            if (!data) {
                throw new RecordNotFoundError("Product do not exist");
            }
            res.status(status).send(statusMess.Success);
            Message.logMessage(req, status);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
    public async deleteProduct(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const status: number = HttpStatusCode.Success;
            const data = await this.productRepository.delete(
                parseInt(req.params.id)
            );
            if (!data) {
                throw new RecordNotFoundError("Product do not exist");
            }
            res.status(status).send(statusMess.Success);
            Message.logMessage(req, status);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
    public async getProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            console.log(req.params.id);
            const data = await this.productRepository.findById(
                parseInt(req.params.id)
            );
            if (!data) {
                throw new RecordNotFoundError("Product do not exist");
            }
            res.status(status).send(data);
            Message.logMessage(req, status);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }

    public async getBestSeller() {
        try {
            const done_orders: any = await this.orderRepository.getByCond({
                where: {
                    status: "Done",
                },
            });
            let done_orders_array: Array<any> = [];
            done_orders.map((item: any) => done_orders_array.push(item.id));
            let real_num_product = 6;

            const trend_products = await this.orderItemRepository.getBestSeller(
                real_num_product,
                done_orders_array
            );
            let trend_products_array: Array<any> = [];
            trend_products.map((item: any) =>
                trend_products_array.push(item.productId)
            );

            return trend_products_array;
        } catch (err) {
            console.log(err);
        }
    }

    public async getRecommendItem(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const clientHistories =
                await this.clientHistoryRepository.findByCond({
                    where: {
                        clientId: req.userId,
                        action: {
                            [Op.in]: ["order", "view_item"],
                        },
                    },
                    order: [["createdAt", "DESC"]],
                });
            let trend_product: Array<any> = [];

            let index: any;

            for (index in clientHistories) {
                const item = clientHistories[index];
                if (item.action == "order") {
                    const order_instance: any =
                        await this.orderRepository.findById(item.orderId);
                    if (order_instance.status == "Done") {
                        const order_items =
                            await this.orderItemRepository.findByCond({
                                where: {
                                    orderId: order_instance.id,
                                },
                            });
                        order_items.map((item: any) => {
                            trend_product.push(item.productId);
                        });
                    }
                } else {
                    trend_product.push(item.productId);
                }
            }

            let temp_trend_product_set: any = new Set(trend_product);
            if (temp_trend_product_set.size < 6) {
                const bestSelletProduct = await this.getBestSeller();
                temp_trend_product_set = new Set(
                    trend_product.concat(bestSelletProduct)
                );
            }
            let trend_product_array = Array.from(temp_trend_product_set);
            trend_product_array = trend_product_array.slice(0, 6);
            const trend_products_detail =
                await this.productRepository.findByCond({
                    where: {
                        id: {
                            [Op.in]: trend_product_array,
                        },
                    },
                });

            res.send(trend_products_detail);
        } catch (err) {
            console.log(err);
        }
    }
}
