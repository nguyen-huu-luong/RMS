import { Request, Response, NextFunction } from 'express';
import {Message} from '../Utils/';
import {HttpStatusCode} from '../Constants';
import statusMess from '../Constants/statusMess';
import { container } from '../Configs';
import { IOrderRepository } from '../Repositories/IOrderRepository';
import { TYPES } from '../Repositories/type';
import { RecordNotFoundError } from '../Errors';
export class OrderService { 
    constructor(private orderRepository = container.get<IOrderRepository>(TYPES.IOrderRepository)) {}

    public async viewOrderItems(req: Request, res: Response,  next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            let data: any;
            if (req.action === "read:own"){
                data = await this.orderRepository.getOrderItems(parseInt(req.params.id), req.userId); 
            } else {
                console.log(parseInt(req.params.id))
                data = await this.orderRepository.getOrderItems(parseInt(req.params.id));
            }
            if (!data) {
				throw new RecordNotFoundError("Order do not exist");
			}
            res.status(status).send(data);
            Message.logMessage(req, status);
        }
        catch (err) {
            console.log(err)
            next(err)
        }
    }

    public async viewOrders(req: Request, res: Response,  next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            let data: any;
            if (req.action === "read:own"){
                data = await this.orderRepository.viewOrders(req.userId); 
            } else {
                data = await this.orderRepository.adminViewOrders();
            }
            res.status(status).send(data);
            Message.logMessage(req, status);
        }
        catch (err) {
            console.log(err)
            next(err)
        }
    }

    public async createOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            let data: any;
            if (req.action === "create:own"){
                await this.orderRepository.createOrder(req.userId, req.body); 
            } else {
                await this.orderRepository.adminCreateOrder(req.body);
            }
            res.status(status).send(statusMess.Success);
            Message.logMessage(req, status)
        }
        catch (err) {
            console.log(err)
            next(err)
        }
    }

    public async removeOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            await this.orderRepository.removeOrder(req.body);
            res.status(status).send(statusMess.Success);
            Message.logMessage(req, status)
        }
        catch (err) {
            console.log(err)
            next(err)
        }
    }

    public async updateStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            const data: any = req.body;
            await this.orderRepository.updateStatus(data);
            res.status(status).send(statusMess.Success);
            Message.logMessage(req, status)
        }
        catch (err) {
            console.log(err)
            next(err)
        }
    }
}
