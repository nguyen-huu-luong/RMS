import { NextFunction, Request, Response } from 'express';
import {Message} from '../Utils';
import {HttpStatusCode} from '../Constants';
import { container } from '../Configs';
import statusMess from '../Constants/statusMess';
import { IOrderItemRepository, IOrderRepository, IProductRepository, IClientHistoryRepository } from '../Repositories';
import { TYPES } from "../Types/type";
import { validationResult } from "express-validator";
/// <reference path="./types/globle.d.ts" />
import {
	ValidationError,
    RecordNotFoundError
} from "../Errors";

export class ProductService {
    constructor(
        private orderItemRepository = container.get<IOrderItemRepository>(TYPES.IOrderItemRepository),
        private orderRepository = container.get<IOrderRepository>(TYPES.IOrderRepository),
        private productRepository = container.get<IProductRepository>(TYPES.IProductRepository),
        private clientHistoryRepository = container.get<IClientHistoryRepository>(TYPES.IClientHistoryRepository)
    ) {}

    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
			if (!errors.isEmpty()) {
				throw new ValidationError(errors.array()[0].msg);
			}
            const status: number = HttpStatusCode.Success;
            const data = await this.productRepository.all();
            res.status(status).send(data);
            Message.logMessage(req, status);
        }
        catch (err) {
            console.log(err)
			next(err);
        }
    }
    public async updateProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            const data = await this.productRepository.update(parseInt(req.params.id), req.body);
            if (!data) {
				throw new RecordNotFoundError("Product do not exist");
			}
            res.status(status).send(statusMess.Success);
            Message.logMessage(req, status);
        }
        catch (err) {
            console.log(err)
			next(err);
        }
    }
    public async createProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            const data = await this.productRepository.create(req.body);
            if (!data) {
				throw new RecordNotFoundError("Product do not exist");
			}
            res.status(status).send(statusMess.Success);
            Message.logMessage(req, status);
        }
        catch (err) {
            console.log(err)
			next(err);
        }
    }
    public async deleteProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            const data = await this.productRepository.delete(parseInt(req.params.id));
            if (!data) {
				throw new RecordNotFoundError("Product do not exist");
			}
            res.status(status).send(statusMess.Success);
            Message.logMessage(req, status)
        }
        catch (err) {
            console.log(err)
			next(err);
        }
    }
    public async getProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            console.log(req.params.id)
            const data = await this.productRepository.findById(parseInt(req.params.id));
            if (!data) {
				throw new RecordNotFoundError("Product do not exist");
			}
            res.status(status).send(data);
            Message.logMessage(req, status);
        }
        catch (err) {
            console.log(err)
			next(err);
        }
    }


    public async getBestSeller() {
            try {
                const done_orders: any = await this.orderRepository.getByCond({
                    where: {
                        status: "Done"
                    }
                })
                let done_orders_array: Array<any> = []
                done_orders.map((item: any) => done_orders_array.push(item.id))
                let real_num_product = 6
    
                const trend_products = await this.orderItemRepository.getBestSeller(real_num_product, done_orders_array)
                let trend_products_array: Array<any> = []
                trend_products.map((item: any) => trend_products_array.push(item.productId))

                return trend_products_array
            }
            catch (err) {
                console.log(err)
            }
    }

    public async getRecommendItem(req: Request, res: Response, next: NextFunction) {

    }
}
