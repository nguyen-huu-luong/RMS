import { Request, Response, NextFunction } from 'express';
import {Message} from '../Utils/';
import {HttpStatusCode} from '../Constants';
import statusMess from '../Constants/statusMess';
import { container } from '../Configs';
import { IOrderRepository } from '../Repositories/IOrderRepository';
import { TYPES } from '../Repositories/type';

export class OrderService { 
    constructor(private orderRepository = container.get<IOrderRepository>(TYPES.IOrderRepository)) {}

    public async viewOrders(req: Request, res: Response,  next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            const data = await this.orderRepository.viewOrders();
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
            const data: any = req.body;
            await this.orderRepository.createOrder(data);
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
            await this.orderRepository.removeOrder(parseInt(req.params.id));
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
